#!/usr/bin/env python3
"""Run a reproducible two-batch SQL Server LocalDB DirectQuery smoke test.

The test is intentionally Windows-only and ephemeral. It provisions the
checked-in schema, loads the committed fixture, changes one source value in a
temporary copy, loads that copy as a second batch, and proves that the health
query exposes the new batch and changed metric. It does not claim Power BI
Desktop, Service capacity, gateway or Automatic Page Refresh evidence.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
sys.path.insert(0, str(SCRIPT_DIR))

from load_directquery_sqlserver import apply_load, inspect_source, source_hash  # noqa: E402
from build_powerbi_refreshable_project import TABLES  # noqa: E402


def checked(args: list[str]) -> str:
    result = subprocess.run(args, check=True, text=True, capture_output=True)
    return result.stdout


def find_sqllocaldb() -> str:
    candidates = [shutil.which("SqlLocalDB.exe"), shutil.which("sqllocaldb")]
    candidates.extend(
        [
            r"C:\Program Files\Microsoft SQL Server\170\Tools\Binn\SqlLocalDB.exe",
            r"C:\Program Files\Microsoft SQL Server\160\Tools\Binn\SqlLocalDB.exe",
        ]
    )
    for candidate in candidates:
        if candidate and Path(candidate).is_file():
            return str(Path(candidate))
    raise RuntimeError("SqlLocalDB.exe was not found on this Windows host")


def pipe_name(sql_localdb: str, instance: str) -> str:
    output = checked([sql_localdb, "info", instance])
    match = re.search(r"(?im)^Instance pipe name:\s*(.+?)\s*$", output)
    if not match:
        raise RuntimeError(f"LocalDB pipe name was not returned for {instance}: {output}")
    return match.group(1).strip()


def connection_string(pipe: str, database: str) -> str:
    return (
        f"DRIVER={{SQL Server}};SERVER={pipe};DATABASE={database};"
        "Trusted_Connection=Yes;TrustServerCertificate=Yes;"
    )


def connect(connection: str):
    try:
        import pyodbc  # type: ignore
    except ImportError as exc:  # pragma: no cover - host prerequisite
        raise RuntimeError("Install pyodbc on the controlled Windows loader host") from exc
    return pyodbc.connect(connection, autocommit=True)


def apply_schema(connection: str, schema_path: Path) -> int:
    sql = schema_path.read_text(encoding="utf-8")
    batches = [part.strip() for part in re.split(r"(?im)^\s*GO\s*(?:--.*)?$", sql) if part.strip()]
    conn = connect(connection)
    try:
        cursor = conn.cursor()
        for batch in batches:
            cursor.execute(batch)
        cursor.close()
    finally:
        conn.close()
    return len(batches)


def create_database(sql_localdb: str, pipe: str, database: str) -> None:
    master = connect(connection_string(pipe, "master"))
    try:
        safe = database.replace("]", "]]" )
        master.cursor().execute(
            f"IF DB_ID(N'{safe}') IS NULL CREATE DATABASE [{safe}]"
        )
    finally:
        master.close()


def health_row(connection: str, query_path: Path) -> dict[str, Any]:
    conn = connect(connection)
    try:
        cursor = conn.cursor()
        cursor.execute(query_path.read_text(encoding="utf-8"))
        columns = [column[0] for column in cursor.description or []]
        row = cursor.fetchone()
        if row is None:
            raise RuntimeError("health query returned no control row")
        result = dict(zip(columns, row))
        cursor.close()
        return result
    finally:
        conn.close()


def scalar_metrics(connection: str) -> dict[str, Any]:
    conn = connect(connection)
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT COUNT_BIG(*) AS row_count, COALESCE(SUM(units), 0) AS units, "
            "COALESCE(SUM(net_sales), 0) AS net_sales FROM finance.Sales"
        )
        row = cursor.fetchone()
        if row is None:
            raise RuntimeError("Sales metric query returned no row")
        return {"row_count": int(row[0]), "units": int(row[1]), "net_sales": str(row[2])}
    finally:
        conn.close()


def mutate_fixture(input_dir: Path, output_dir: Path) -> Path:
    shutil.copytree(input_dir, output_dir)
    sales_path = output_dir / TABLES["Sales"]["file"]
    with sales_path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)
        fieldnames = reader.fieldnames or []
    if not rows or "units" not in fieldnames:
        raise RuntimeError("Sales fixture has no row/units column to mutate")
    rows[0]["units"] = str(int(rows[0]["units"]) + 1)
    with sales_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    return output_dir


def serializable(value: Any) -> Any:
    if hasattr(value, "isoformat"):
        return value.isoformat()
    if isinstance(value, bytes):
        return value.decode("utf-8", errors="replace")
    return value


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, default=REPO_ROOT / "powerbi" / "data" / "current")
    parser.add_argument("--schema", type=Path, default=REPO_ROOT / "powerbi" / "directquery" / "VNFinance_DirectQuery_Schema.sql")
    parser.add_argument("--health-query", type=Path, default=REPO_ROOT / "powerbi" / "directquery" / "VNFinance_DirectQuery_Health.sql")
    parser.add_argument("--report", type=Path, help="write JSON evidence")
    parser.add_argument("--instance-name", default="", help="LocalDB instance name; defaults to a UTC timestamp")
    parser.add_argument("--database", default="", help="database name; defaults to an ephemeral name")
    parser.add_argument("--keep-instance", action="store_true", help="leave the instance for manual inspection")
    args = parser.parse_args()

    if os.name != "nt":
        raise RuntimeError("This smoke test requires Windows SQL Server LocalDB")
    sql_localdb = find_sqllocaldb()
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    instance = args.instance_name or f"VNFinanceDQ_SMOKE_{stamp.replace('T', '').replace(':', '').replace('Z', '')}"
    database = args.database or f"VNFinanceDQ_SMOKE_{stamp.replace('T', '').replace(':', '').replace('Z', '')}"
    base_batch = f"DQ_LOCALDB_TWO_BATCH_BASE_{stamp}"
    changed_batch = f"DQ_LOCALDB_TWO_BATCH_CHANGED_{stamp}"
    created = False
    evidence: dict[str, Any] = {
        "status": "FAIL",
        "mode": "two_batch_localdb_smoke",
        "instance": instance,
        "database": database,
        "claim_boundary": "integration evidence only; not production realtime or Power BI Automatic Page Refresh",
    }

    try:
        checked([sql_localdb, "create", instance])
        created = True
        checked([sql_localdb, "start", instance])
        pipe = pipe_name(sql_localdb, instance)
        create_database(sql_localdb, pipe, database)
        database_connection = connection_string(pipe, database)
        ddl_batches = apply_schema(database_connection, args.schema)

        base_manifest, base_rows = inspect_source(args.input_dir)
        base_watermark = "2026-08-30T16:00:00Z"
        apply_load(database_connection, base_manifest, base_rows, base_batch, base_watermark)
        base_metrics = scalar_metrics(database_connection)
        base_health = health_row(database_connection, args.health_query)

        with tempfile.TemporaryDirectory(prefix="vnfinance_dq_two_batch_") as temp_dir:
            changed_dir = mutate_fixture(args.input_dir, Path(temp_dir) / "changed")
            changed_manifest, changed_rows = inspect_source(changed_dir)
            changed_watermark = "2026-08-30T16:01:00Z"
            apply_started = time.perf_counter()
            apply_load(database_connection, changed_manifest, changed_rows, changed_batch, changed_watermark)
            after_apply = time.perf_counter()
            changed_metrics = scalar_metrics(database_connection)
            changed_health = health_row(database_connection, args.health_query)
            health_elapsed = time.perf_counter() - after_apply

        expected_unit_delta = changed_metrics["units"] - base_metrics["units"]
        checks = {
            "ddl_batches": {"status": "PASS" if ddl_batches >= 19 else "FAIL", "value": ddl_batches},
            "base_health_pass": {"status": "PASS" if base_health.get("control_status") == "PASS" else "FAIL"},
            "changed_health_pass": {"status": "PASS" if changed_health.get("control_status") == "PASS" else "FAIL"},
            "latest_batch_is_changed": {"status": "PASS" if changed_health.get("batch_id") == changed_batch else "FAIL"},
            "row_count_stable": {"status": "PASS" if changed_metrics["row_count"] == base_metrics["row_count"] else "FAIL"},
            "units_delta_plus_one": {"status": "PASS" if expected_unit_delta == 1 else "FAIL", "observed": expected_unit_delta},
            "source_hash_changed": {"status": "PASS" if source_hash(base_manifest) != source_hash(changed_manifest) else "FAIL"},
            "changed_loaded_rows_tie": {"status": "PASS" if changed_health.get("loaded_row_count") == sum(item["rows"] for item in changed_manifest) else "FAIL"},
        }
        evidence.update(
            {
                "status": "PASS" if all(item["status"] == "PASS" for item in checks.values()) else "FAIL",
                "ddl_batches": ddl_batches,
                "base": {"batch_id": base_batch, "health": {k: serializable(v) for k, v in base_health.items()}, "metrics": base_metrics, "source_hash_sha256": source_hash(base_manifest)},
                "changed": {"batch_id": changed_batch, "health": {k: serializable(v) for k, v in changed_health.items()}, "metrics": changed_metrics, "source_hash_sha256": source_hash(changed_manifest)},
                "checks": checks,
                "observed_health_query_seconds_after_commit": round(health_elapsed, 4),
                "temporary_instance_cleanup": "PENDING",
            }
        )
    except Exception as exc:
        evidence["error"] = str(exc)
    finally:
        if created and not args.keep_instance:
            try:
                subprocess.run([sql_localdb, "stop", instance], check=False, text=True, capture_output=True)
                subprocess.run([sql_localdb, "delete", instance], check=False, text=True, capture_output=True)
                evidence["temporary_instance_cleanup"] = "PASS"
            except Exception as exc:  # pragma: no cover - cleanup failure is captured
                evidence["temporary_instance_cleanup"] = f"FAIL: {exc}"
        elif args.keep_instance:
            evidence["temporary_instance_cleanup"] = "KEPT_BY_OPERATOR"

    evidence["status"] = "PASS" if evidence.get("status") == "PASS" and evidence.get("temporary_instance_cleanup") in {"PASS", "KEPT_BY_OPERATOR"} else "FAIL"
    payload = json.dumps(evidence, indent=2, default=serializable) + "\n"
    print(payload, end="")
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(payload, encoding="utf-8")
    return 0 if evidence["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
