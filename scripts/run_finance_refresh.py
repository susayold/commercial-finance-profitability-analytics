#!/usr/bin/env python3
"""Orchestrate a validated Power BI data replacement.

The default mode is side-effect-free. With explicit flags the command can
apply the Import DataRoot swap, load the DirectQuery source and/or trigger a
published Power BI Service refresh. Each requested stage is recorded in one
JSON evidence file; tokens and connection strings are never written there.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent


def parse_json(text: str) -> dict[str, Any]:
    decoder = json.JSONDecoder()
    for offset, character in enumerate(text):
        if character != "{":
            continue
        try:
            value, _ = decoder.raw_decode(text[offset:])
        except json.JSONDecodeError:
            continue
        if isinstance(value, dict) and "status" in value:
            return value
    return {"status": "FAIL", "error": "command did not emit a status JSON object"}


def run_stage(command: list[str], *, env: dict[str, str] | None = None) -> tuple[int, dict[str, Any], str]:
    result = subprocess.run(command, capture_output=True, text=True, check=False, env=env)
    payload = parse_json(result.stdout)
    if result.returncode != 0 and payload.get("status") == "FAIL":
        payload.setdefault("stderr", result.stderr[-2000:])
    return result.returncode, payload, result.stderr[-2000:]


def requested_stage(name: str, status: str) -> dict[str, Any]:
    return {"requested": True, "status": status, "stage": name}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, required=True, help="candidate CSV directory")
    parser.add_argument("--data-root", type=Path, required=True, help="Power BI DataRoot target")
    parser.add_argument("--report", type=Path, required=True, help="combined JSON evidence output")
    parser.add_argument("--apply", action="store_true", help="apply the validated Import DataRoot swap")
    parser.add_argument("--directquery-apply", action="store_true", help="load the same input into the DirectQuery database")
    parser.add_argument("--directquery-connection", default="", help="pyodbc connection; prefer VNFINANCE_SQL_CONNECTION")
    parser.add_argument("--workspace-id", default="")
    parser.add_argument("--dataset-id", default="")
    parser.add_argument("--service-apply", action="store_true", help="trigger and poll a published Power BI Service refresh")
    parser.add_argument("--service-timeout-seconds", type=int, default=600)
    parser.add_argument("--service-poll-seconds", type=int, default=10)
    args = parser.parse_args()
    if args.service_apply and (not args.workspace_id or not args.dataset_id):
        parser.error("--service-apply requires --workspace-id and --dataset-id")
    if args.directquery_apply and not (args.directquery_connection or os.environ.get("VNFINANCE_SQL_CONNECTION")):
        parser.error("--directquery-apply requires --directquery-connection or VNFINANCE_SQL_CONNECTION")

    evidence: dict[str, Any] = {
        "status": "FAIL",
        "mode": "finance_refresh_orchestrator",
        "started_at_utc": datetime.now(timezone.utc).isoformat(),
        "input_dir": str(args.input_dir.resolve()),
        "data_root": str(args.data_root.resolve()),
        "stages": {},
        "claim_boundary": "Import refresh is automated; DirectQuery/APR and native PBIX evidence remain separate gates.",
    }

    prepare = [sys.executable, str(SCRIPT_DIR / "prepare_powerbi_refresh.py"), "--input-dir", str(args.input_dir), "--data-root", str(args.data_root), "--report", str(args.report.with_name(args.report.stem + "_import.json"))]
    if args.apply:
        prepare.append("--apply")
    code, payload, stderr = run_stage(prepare)
    evidence["stages"]["import"] = {"requested": True, "apply": args.apply, "exit_code": code, "result": payload}
    if code != 0 or payload.get("status") != "PASS":
        evidence["error"] = {"stage": "import", "stderr": stderr}
        return write_evidence(args.report, evidence)

    if args.directquery_apply:
        loader_report = args.report.with_name(args.report.stem + "_directquery.json")
        loader = [sys.executable, str(SCRIPT_DIR / "load_directquery_sqlserver.py"), "--input-dir", str(args.input_dir), "--apply", "--report", str(loader_report)]
        environment = os.environ.copy()
        connection = args.directquery_connection or environment.get("VNFINANCE_SQL_CONNECTION", "")
        environment["VNFINANCE_SQL_CONNECTION"] = connection
        code, payload, stderr = run_stage(loader, env=environment)
        evidence["stages"]["directquery"] = {"requested": True, "apply": True, "exit_code": code, "result": payload}
        if code != 0 or payload.get("status") != "APPLY_PASS":
            evidence["error"] = {"stage": "directquery", "stderr": stderr}
            return write_evidence(args.report, evidence)
    else:
        evidence["stages"]["directquery"] = {"requested": False, "status": "NOT_REQUESTED", "claim_boundary": "Provide --directquery-apply only for a real configured SQL Server-compatible source."}

    if args.service_apply:
        service_report = args.report.with_name(args.report.stem + "_service.json")
        service = [sys.executable, str(SCRIPT_DIR / "trigger_powerbi_service_refresh.py"), "--workspace-id", args.workspace_id, "--dataset-id", args.dataset_id, "--apply", "--poll-seconds", str(args.service_poll_seconds), "--timeout-seconds", str(args.service_timeout_seconds), "--report", str(service_report)]
        code, payload, stderr = run_stage(service, env=os.environ.copy())
        evidence["stages"]["service"] = {"requested": True, "apply": True, "exit_code": code, "result": payload}
        if code != 0 or payload.get("status") != "APPLY_PASS":
            evidence["error"] = {"stage": "service", "stderr": stderr}
            return write_evidence(args.report, evidence)
    else:
        evidence["stages"]["service"] = {"requested": False, "status": "NOT_REQUESTED", "claim_boundary": "Provide --service-apply only for a published Import dataset with runtime credentials."}

    evidence["status"] = "PASS"
    evidence["completed_at_utc"] = datetime.now(timezone.utc).isoformat()
    return write_evidence(args.report, evidence)


def write_evidence(path: Path, evidence: dict[str, Any]) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(evidence, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(evidence, indent=2))
    return 0 if evidence.get("status") == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
