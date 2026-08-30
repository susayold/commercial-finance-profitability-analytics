#!/usr/bin/env python3
"""Trigger and audit an on-demand Power BI Service dataset refresh.

The command is intentionally side-effect-free unless ``--apply`` is supplied.
It is an Import-mode orchestration helper: replacing the 14 source files and
then running this script can refresh the published dataset without opening
Power BI Desktop. It is not an Automatic Page Refresh/DirectQuery claim.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from typing import Any


API_ROOT = "https://api.powerbi.com/v1.0/myorg"


def iso_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def auth_headers(token: str) -> dict[str, str]:
    value = token.strip()
    if value.lower().startswith("bearer "):
        value = value[7:].strip()
    return {"Authorization": f"Bearer {value}", "Accept": "application/json"}


def request_json(method: str, url: str, token: str, payload: dict[str, Any] | None = None) -> tuple[int, dict[str, Any]]:
    body = None if payload is None else json.dumps(payload).encode("utf-8")
    headers = auth_headers(token)
    if body is not None:
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            raw = response.read().decode("utf-8")
            return response.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Power BI API {method} {url} returned HTTP {exc.code}: {detail[:1000]}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Power BI API request failed: {exc.reason}") from exc


def history_url(workspace_id: str, dataset_id: str) -> str:
    return f"{API_ROOT}/groups/{workspace_id}/datasets/{dataset_id}/refreshes?$top=10"


def get_history(workspace_id: str, dataset_id: str, token: str) -> list[dict[str, Any]]:
    _, response = request_json("GET", history_url(workspace_id, dataset_id), token)
    value = response.get("value", [])
    if not isinstance(value, list):
        raise RuntimeError("Power BI refresh history response did not contain a list in 'value'")
    return [item for item in value if isinstance(item, dict)]


def refresh_identity(entry: dict[str, Any]) -> tuple[str, str]:
    return str(entry.get("requestId", "")), str(entry.get("startTime", ""))


def find_new_refresh(history: list[dict[str, Any]], before: set[tuple[str, str]], triggered_at: str) -> dict[str, Any] | None:
    candidates = [entry for entry in history if refresh_identity(entry) not in before]
    if not candidates:
        # Some tenants omit requestId; startTime is still useful as a bounded
        # fallback because the history endpoint returns UTC timestamps.
        candidates = [entry for entry in history if str(entry.get("startTime", "")) >= triggered_at]
    return candidates[0] if candidates else None


def build_dry_run(workspace_id: str, dataset_id: str, *, poll_seconds: int, timeout_seconds: int) -> dict[str, Any]:
    return {
        "status": "DRY_RUN_PASS",
        "mode": "on_demand_import_refresh",
        "workspace_id": workspace_id,
        "dataset_id": dataset_id,
        "endpoint": f"POST {API_ROOT}/groups/{workspace_id}/datasets/{dataset_id}/refreshes",
        "payload": {"notifyOption": "NoNotification"},
        "poll_seconds": poll_seconds,
        "timeout_seconds": timeout_seconds,
        "side_effect": "none; rerun with --apply and PBI_ACCESS_TOKEN to trigger the service refresh",
        "claim_boundary": "This is scheduled/on-demand Import refresh orchestration, not DirectQuery Automatic Page Refresh.",
    }


def apply_refresh(workspace_id: str, dataset_id: str, token: str, poll_seconds: int, timeout_seconds: int) -> dict[str, Any]:
    before = {refresh_identity(entry) for entry in get_history(workspace_id, dataset_id, token)}
    triggered_at = iso_now()
    post_url = f"{API_ROOT}/groups/{workspace_id}/datasets/{dataset_id}/refreshes"
    request_json("POST", post_url, token, {"notifyOption": "NoNotification"})
    deadline = time.monotonic() + timeout_seconds
    while time.monotonic() <= deadline:
        history = get_history(workspace_id, dataset_id, token)
        entry = find_new_refresh(history, before, triggered_at)
        if entry is not None:
            status = str(entry.get("status", "Unknown"))
            if status in {"Completed", "Failed"}:
                result: dict[str, Any] = {
                    "status": "APPLY_PASS" if status == "Completed" else "APPLY_FAIL",
                    "mode": "on_demand_import_refresh",
                    "workspace_id": workspace_id,
                    "dataset_id": dataset_id,
                    "refresh": {key: entry.get(key) for key in ["requestId", "id", "refreshType", "startTime", "endTime", "status", "serviceExceptionJson"] if key in entry},
                    "claim_boundary": "Import refresh completed; this does not prove DirectQuery Automatic Page Refresh.",
                }
                if status == "Failed":
                    result["error"] = entry.get("serviceExceptionJson", "Power BI reported Failed")
                return result
        time.sleep(poll_seconds)
    raise TimeoutError(f"No terminal refresh result observed within {timeout_seconds} seconds; inspect refresh history manually")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workspace-id", required=True)
    parser.add_argument("--dataset-id", required=True)
    parser.add_argument("--access-token", default="", help="Bearer token; prefer PBI_ACCESS_TOKEN environment variable")
    parser.add_argument("--apply", action="store_true", help="POST a refresh and poll refresh history")
    parser.add_argument("--poll-seconds", type=int, default=10)
    parser.add_argument("--timeout-seconds", type=int, default=600)
    parser.add_argument("--report", type=os.path.abspath, help="write JSON evidence to this path")
    args = parser.parse_args()
    if args.poll_seconds < 1 or args.timeout_seconds < 1:
        parser.error("--poll-seconds and --timeout-seconds must be positive")

    try:
        if args.apply:
            token = args.access_token or os.environ.get("PBI_ACCESS_TOKEN", "")
            if not token:
                raise RuntimeError("--apply requires --access-token or PBI_ACCESS_TOKEN; no token is stored in the repository")
            result = apply_refresh(args.workspace_id, args.dataset_id, token, args.poll_seconds, args.timeout_seconds)
        else:
            result = build_dry_run(args.workspace_id, args.dataset_id, poll_seconds=args.poll_seconds, timeout_seconds=args.timeout_seconds)
        print(json.dumps(result, indent=2))
        if args.report:
            os.makedirs(os.path.dirname(args.report) or ".", exist_ok=True)
            with open(args.report, "w", encoding="utf-8") as handle:
                json.dump(result, handle, indent=2)
                handle.write("\n")
        return 0 if result["status"] in {"DRY_RUN_PASS", "APPLY_PASS"} else 1
    except Exception as exc:
        print(json.dumps({"status": "FAIL", "error": str(exc)}, indent=2), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
