#!/usr/bin/env python3
"""Exercise the DirectQuery health query's PASS/WARN/FAIL state machine.

This Windows-only test uses a disposable LocalDB database and inserts only
operational ``Refresh_Control`` rows; it does not load or publish finance
facts. It proves that no-load, current, stale, rejected-row and failed-batch
states are surfaced with an unambiguous status/reason pair.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
sys.path.insert(0, str(SCRIPT_DIR))

from run_directquery_localdb_smoke import (  # noqa: E402
    apply_schema,
    checked,
    connect,
    connection_string,
    create_database,
    find_sqllocaldb,
    health_row,
    pipe_name,
)


def utc_naive(minutes_ago: int = 0) -> datetime:
    return (datetime.now(timezone.utc) - timedelta(minutes=minutes_ago)).replace(tzinfo=None, microsecond=0)


def insert_control(connection: str, *, batch_id: str, status: str, watermark: datetime, rejected: int) -> None:
    conn = connect(connection)
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO finance.Refresh_Control "
            "(batch_id,status,source_watermark_utc,load_started_utc,load_completed_utc,"
            "physical_table_count,source_row_count,loaded_row_count,rejected_row_count,source_hash_sha256,error_message) "
            "VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            batch_id,
            status,
            watermark,
            watermark,
            utc_naive(),
            14,
            100,
            100 - rejected,
            rejected,
            "a" * 64,
            None,
        )
        cursor.close()
    finally:
        conn.close()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--schema", type=Path, default=REPO_ROOT / "powerbi" / "directquery" / "VNFinance_DirectQuery_Schema.sql")
    parser.add_argument("--health-query", type=Path, default=REPO_ROOT / "powerbi" / "directquery" / "VNFinance_DirectQuery_Health.sql")
    parser.add_argument("--report", type=Path)
    parser.add_argument("--keep-instance", action="store_true")
    args = parser.parse_args()

    if os.name != "nt":
        raise RuntimeError("This smoke test requires Windows SQL Server LocalDB")

    sql_localdb = find_sqllocaldb()
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    instance = f"VNFH{stamp}"
    database = f"VNFH{stamp}"
    evidence: dict[str, object] = {
        "status": "FAIL",
        "mode": "directquery_health_contract_localdb",
        "instance": instance,
        "database": database,
        "claim_boundary": "Health state-machine integration evidence only; not production realtime or Power BI Automatic Page Refresh.",
    }
    created = False
    cases = [
        ("no_load", None, "FAIL", "NO_LOAD"),
        ("current_success", ("SUCCEEDED", 0, 5), "PASS", "CURRENT"),
        ("stale_success", ("SUCCEEDED", 0, 120), "WARN", "STALE_WATERMARK"),
        ("rejected_success", ("SUCCEEDED", 3, 5), "WARN", "REJECTED_ROWS"),
        ("failed_batch", ("FAILED", 0, 5), "FAIL", "LOAD_FAILED"),
    ]
    observations: list[dict[str, object]] = []
    try:
        checked([sql_localdb, "create", instance])
        created = True
        checked([sql_localdb, "start", instance])
        pipe = pipe_name(sql_localdb, instance)
        create_database(sql_localdb, pipe, database)
        database_connection = connection_string(pipe, database)
        ddl_batches = apply_schema(database_connection, args.schema)
        for index, (name, payload, expected_status, expected_reason) in enumerate(cases, start=1):
            conn = connect(database_connection)
            try:
                conn.cursor().execute("DELETE FROM finance.Refresh_Control")
            finally:
                conn.close()
            batch_id = f"DQ_HEALTH_CASE_{index}_{stamp}"
            if payload is not None:
                status, rejected, minutes_ago = payload
                insert_control(database_connection, batch_id=batch_id, status=status, watermark=utc_naive(minutes_ago), rejected=rejected)
            row = health_row(database_connection, args.health_query)
            observed_status = str(row.get("control_status"))
            observed_reason = str(row.get("control_reason"))
            observations.append({
                "case": name,
                "expected_status": expected_status,
                "expected_reason": expected_reason,
                "observed_status": observed_status,
                "observed_reason": observed_reason,
                "pass": observed_status == expected_status and observed_reason == expected_reason,
            })
        evidence.update({"status": "PASS" if all(bool(item["pass"]) for item in observations) else "FAIL", "ddl_batches": ddl_batches, "cases": observations})
    except Exception as exc:
        evidence["error"] = str(exc)
    finally:
        if created and not args.keep_instance:
            subprocess.run([sql_localdb, "stop", instance], check=False, text=True, capture_output=True)
            subprocess.run([sql_localdb, "delete", instance], check=False, text=True, capture_output=True)
            evidence["temporary_instance_cleanup"] = "PASS"
        elif args.keep_instance:
            evidence["temporary_instance_cleanup"] = "KEPT_BY_OPERATOR"
        else:
            evidence["temporary_instance_cleanup"] = "NOT_CREATED"

    if evidence.get("status") != "PASS" or evidence.get("temporary_instance_cleanup") not in {"PASS", "KEPT_BY_OPERATOR"}:
        evidence["status"] = "FAIL"
    payload = json.dumps(evidence, indent=2, default=str) + "\n"
    print(payload, end="")
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(payload, encoding="utf-8")
    return 0 if evidence["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
