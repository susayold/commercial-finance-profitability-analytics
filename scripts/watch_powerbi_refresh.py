#!/usr/bin/env python3
"""Watch the validated finance input contract and trigger a refresh run.

This is an operator-side bridge for teams that receive CSV drops rather than
Git commits. It hashes the complete 14-file input contract, waits for a stable
copy, validates the data and then delegates to ``run_finance_refresh.py``. It
is intentionally explicit about side effects: the watcher is read-only unless
``--apply`` is supplied, and a Power BI Service call additionally requires
``--service-apply`` plus the normal runtime credentials.

Import mode still needs a Desktop/API refresh after the files are copied. A
second-level realtime claim requires the DirectQuery/APR production gates.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


REQUIRED_FILES = (
    "sales_fact.csv",
    "commercial_costs.csv",
    "inventory.csv",
    "receivables.csv",
    "payables.csv",
    "debt.csv",
    "budget.csv",
    "forecast.csv",
    "marketing_spend.csv",
    "promotions.csv",
    "product_master.csv",
    "customer_master.csv",
    "channel_master.csv",
    "source_control.csv",
)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def contract_hash(input_dir: Path) -> tuple[str, dict[str, Any]]:
    """Hash names and bytes in deterministic contract order."""

    digest = hashlib.sha256()
    files: dict[str, Any] = {}
    for name in REQUIRED_FILES:
        path = input_dir / name
        if not path.is_file():
            raise FileNotFoundError(f"missing required contract file: {path}")
        raw = path.read_bytes()
        file_hash = hashlib.sha256(raw).hexdigest()
        digest.update(name.encode("utf-8"))
        digest.update(b"\0")
        digest.update(raw)
        files[name] = {"sha256": file_hash, "bytes": len(raw)}
    return digest.hexdigest(), files


def wait_until_stable(input_dir: Path, settle_seconds: float) -> tuple[str, dict[str, Any]]:
    before, _ = contract_hash(input_dir)
    if settle_seconds <= 0:
        return before, contract_hash(input_dir)[1]
    time.sleep(settle_seconds)
    after, files = contract_hash(input_dir)
    if before != after:
        raise RuntimeError("input files changed during settle window; waiting for the next poll")
    return after, files


def run_refresh(args: argparse.Namespace, input_hash: str) -> tuple[int, dict[str, Any]]:
    script_dir = Path(__file__).resolve().parent
    command = [
        sys.executable,
        str(script_dir / "run_finance_refresh.py"),
        "--input-dir",
        str(args.input_dir),
        "--data-root",
        str(args.data_root),
        "--report",
        str(args.report),
    ]
    if args.apply:
        command.append("--apply")
    if args.directquery_apply:
        command.append("--directquery-apply")
    if args.directquery_connection:
        command.extend(["--directquery-connection", args.directquery_connection])
    if args.service_apply:
        command.extend(
            [
                "--service-apply",
                "--workspace-id",
                args.workspace_id,
                "--dataset-id",
                args.dataset_id,
                "--service-timeout-seconds",
                str(args.service_timeout_seconds),
                "--service-poll-seconds",
                str(args.service_poll_seconds),
            ]
        )
    result = subprocess.run(command, capture_output=True, text=True, check=False, env=os.environ.copy())
    payload: dict[str, Any] = {
        "input_contract_hash": input_hash,
        "refresh_exit_code": result.returncode,
        "stdout_status": "PASS" if result.returncode == 0 else "FAIL",
    }
    # The delegated orchestrator writes detailed evidence. Retain only a
    # bounded stderr tail here so secrets or noisy output are not copied.
    if result.returncode != 0:
        payload["stderr_tail"] = result.stderr[-1000:]
    return result.returncode, payload


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, required=True)
    parser.add_argument("--data-root", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True, help="delegated refresh evidence JSON")
    parser.add_argument("--interval-seconds", type=float, default=30.0)
    parser.add_argument("--settle-seconds", type=float, default=3.0)
    parser.add_argument("--max-events", type=int, default=0, help="stop after N changed batches; 0 means keep watching")
    parser.add_argument("--apply", action="store_true", help="copy validated files into DataRoot")
    parser.add_argument("--directquery-apply", action="store_true")
    parser.add_argument("--directquery-connection", default="")
    parser.add_argument("--service-apply", action="store_true")
    parser.add_argument("--workspace-id", default="")
    parser.add_argument("--dataset-id", default="")
    parser.add_argument("--service-timeout-seconds", type=int, default=600)
    parser.add_argument("--service-poll-seconds", type=int, default=10)
    parser.add_argument("--once", action="store_true", help="inspect one snapshot and exit without waiting")
    args = parser.parse_args()
    if args.interval_seconds <= 0 or args.settle_seconds < 0:
        parser.error("--interval-seconds must be positive and --settle-seconds cannot be negative")
    if args.service_apply and (not args.workspace_id or not args.dataset_id):
        parser.error("--service-apply requires --workspace-id and --dataset-id")
    if args.directquery_apply and not (args.directquery_connection or os.environ.get("VNFINANCE_SQL_CONNECTION")):
        parser.error("--directquery-apply requires --directquery-connection or VNFINANCE_SQL_CONNECTION")

    input_dir = args.input_dir.resolve()
    previous_hash = ""
    event_count = 0
    while True:
        try:
            current_hash, files = wait_until_stable(input_dir, args.settle_seconds)
        except (FileNotFoundError, RuntimeError) as exc:
            event = {"status": "PENDING", "checked_at_utc": utc_now(), "input_dir": str(input_dir), "reason": str(exc)}
            print(json.dumps(event, indent=2))
            if args.once:
                return 2
            time.sleep(args.interval_seconds)
            continue

        if current_hash == previous_hash:
            event = {"status": "NO_CHANGE", "checked_at_utc": utc_now(), "input_contract_hash": current_hash, "files": files}
            print(json.dumps(event, indent=2))
            if args.once:
                return 0
            time.sleep(args.interval_seconds)
            continue

        started = utc_now()
        code, delegated = run_refresh(args, current_hash)
        event_count += 1
        event = {
            "status": "PASS" if code == 0 else "FAIL",
            "checked_at_utc": started,
            "input_contract_hash": current_hash,
            "event_number": event_count,
            "apply": bool(args.apply),
            "service_apply": bool(args.service_apply),
            "directquery_apply": bool(args.directquery_apply),
            "delegated": delegated,
            "claim_boundary": "Import refresh requires a Desktop/API refresh; DirectQuery/APR production evidence remains separate.",
        }
        print(json.dumps(event, indent=2))
        # Keep a failed hash unacknowledged so the next poll retries the same
        # batch after a transient validator, database or Service failure.
        if code == 0:
            previous_hash = current_hash
        if args.max_events and event_count >= args.max_events:
            return 0 if code == 0 else 1
        if args.once:
            return 0 if code == 0 else 1
        time.sleep(args.interval_seconds)


if __name__ == "__main__":
    raise SystemExit(main())
