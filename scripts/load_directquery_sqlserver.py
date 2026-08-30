#!/usr/bin/env python3
"""Load the 14-file finance fixture into the DirectQuery source contract.

The default mode is a side-effect-free dry run. ``--apply`` is deliberately
explicit because it replaces the report-facing tables in one transaction.
The loader uses pyodbc only for an apply, so reviewers can validate the exact
file set, headers, row counts and hashes without a database or credentials.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import sys
from datetime import date, datetime, timezone
from decimal import Decimal
from pathlib import Path
from typing import Any

from build_powerbi_refreshable_project import TABLES


TABLE_ORDER = [name for name, spec in TABLES.items() if spec.get("file")]


def qident(value: str) -> str:
    """Quote a SQL Server identifier after restricting it to the model contract."""
    if not value or any(ch not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_" for ch in value):
        raise ValueError(f"unsafe SQL identifier: {value!r}")
    return f"[{value}]"


def parse_value(raw: str, kind: str) -> Any:
    if kind == "string":
        return raw if raw != "" else None
    if raw == "":
        return None
    if kind == "int64":
        return int(raw)
    if kind == "double":
        return Decimal(raw)
    if kind == "dateTime":
        return date.fromisoformat(raw[:10])
    if kind == "boolean":
        lowered = raw.strip().lower()
        if lowered in {"true", "1", "yes"}:
            return True
        if lowered in {"false", "0", "no"}:
            return False
        raise ValueError(f"invalid boolean value: {raw!r}")
    raise ValueError(f"unsupported model type: {kind}")


def inspect_source(input_dir: Path) -> tuple[list[dict[str, Any]], dict[str, list[tuple[Any, ...]]]]:
    """Validate headers/types and return deterministic rows ready for pyodbc."""
    if not input_dir.is_dir():
        raise FileNotFoundError(f"input directory not found: {input_dir}")
    manifest: list[dict[str, Any]] = []
    rows_by_table: dict[str, list[tuple[Any, ...]]] = {}
    for table in TABLE_ORDER:
        spec = TABLES[table]
        path = input_dir / spec["file"]
        if not path.is_file():
            raise FileNotFoundError(f"missing contract file for {table}: {path.name}")
        expected = [column for column, _, _ in spec["columns"]]
        expected_types = {column: kind for column, kind, _ in spec["columns"]}
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            header = reader.fieldnames or []
            if len(header) != len(set(header)):
                raise ValueError(f"{path.name}: duplicate column names in header")
            if set(header) != set(expected) or len(header) != len(expected):
                missing = sorted(set(expected) - set(header))
                extra = sorted(set(header) - set(expected))
                raise ValueError(f"{path.name}: header mismatch; missing={missing}, extra={extra}")
            rows: list[tuple[Any, ...]] = []
            for line_number, raw_row in enumerate(reader, start=2):
                try:
                    rows.append(tuple(parse_value(raw_row.get(column, ""), expected_types[column]) for column in expected))
                except (TypeError, ValueError, OverflowError) as exc:
                    raise ValueError(f"{path.name}:{line_number}: {exc}") from exc
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        manifest.append({"table": table, "file": path.name, "rows": len(rows), "sha256": digest})
        rows_by_table[table] = rows
    return manifest, rows_by_table


def source_hash(manifest: list[dict[str, Any]]) -> str:
    canonical = "\n".join(f"{item['file']}|{item['rows']}|{item['sha256']}" for item in manifest)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def build_result(manifest: list[dict[str, Any]], *, mode: str, batch_id: str, watermark: str) -> dict[str, Any]:
    return {
        "status": "DRY_RUN_PASS" if mode == "dry-run" else "READY_TO_APPLY",
        "mode": mode,
        "batch_id": batch_id,
        "source_watermark_utc": watermark,
        "physical_table_count": len(manifest),
        "source_row_count": sum(item["rows"] for item in manifest),
        "source_hash_sha256": source_hash(manifest),
        "tables": manifest,
        "next_step": "Run with --apply --connection-string <secret-free reference> after applying the DirectQuery DDL." if mode == "dry-run" else "Database transaction committed; verify health query and Power BI visual freshness.",
    }


def apply_load(connection_string: str, manifest: list[dict[str, Any]], rows_by_table: dict[str, list[tuple[Any, ...]]], batch_id: str, watermark: str) -> int:
    try:
        import pyodbc  # type: ignore
    except ImportError as exc:
        raise RuntimeError("--apply requires pyodbc; install requirements-directquery.txt on the controlled loader host") from exc

    conn = pyodbc.connect(connection_string, autocommit=False)
    cursor = conn.cursor()
    started = datetime.now(timezone.utc).replace(tzinfo=None)
    source_rows = sum(item["rows"] for item in manifest)
    digest = source_hash(manifest)
    try:
        cursor.execute("SELECT 1 FROM sys.tables t JOIN sys.schemas s ON s.schema_id=t.schema_id WHERE s.name=N'finance' AND t.name=N'Refresh_Control'")
        if cursor.fetchone() is None:
            raise RuntimeError("finance.Refresh_Control is missing; apply powerbi/directquery/VNFinance_DirectQuery_Schema.sql first")
        cursor.execute(
            "INSERT INTO [finance].[Refresh_Control] "
            "(batch_id,status,source_watermark_utc,load_started_utc,physical_table_count,source_row_count,loaded_row_count,rejected_row_count,source_hash_sha256) "
            "VALUES (?,?,?,?,?,?,?,?,?)",
            batch_id, "RUNNING", datetime.fromisoformat(watermark.replace("Z", "+00:00")).replace(tzinfo=None), started,
            len(manifest), source_rows, 0, 0, digest,
        )
        conn.commit()

        # Delete in an explicit, deterministic order. The migration DDL has no
        # FK constraints yet; DELETE is safer than TRUNCATE if one is added.
        for table in TABLE_ORDER:
            cursor.execute(f"DELETE FROM [finance].{qident(table)}")
        for table in TABLE_ORDER:
            columns = [column for column, _, _ in TABLES[table]["columns"]]
            placeholders = ",".join("?" for _ in columns)
            sql = f"INSERT INTO [finance].{qident(table)} ({','.join(qident(c) for c in columns)}) VALUES ({placeholders})"
            cursor.fast_executemany = True
            cursor.executemany(sql, rows_by_table[table])

        cursor.execute("DELETE FROM [finance].[Calendar]")
        cursor.execute(
            "INSERT INTO [finance].[Calendar] ([month],[year],[quarter],month_number,year_month) "
            "SELECT DISTINCT [month], YEAR([month]), CONCAT(N'Q', DATEPART(QUARTER,[month])), MONTH([month]), CONVERT(nvarchar(20),[month],126) "
            "FROM [finance].[Sales]"
        )
        cursor.execute("SELECT COALESCE(SUM(row_count),0) FROM (" + " UNION ALL ".join(f"SELECT COUNT_BIG(*) AS row_count FROM [finance].{qident(t)}" for t in TABLE_ORDER) + ") AS counts")
        loaded_rows = int(cursor.fetchone()[0])
        completed = datetime.now(timezone.utc).replace(tzinfo=None)
        cursor.execute(
            "UPDATE [finance].[Refresh_Control] SET status=?, load_completed_utc=?, loaded_row_count=?, rejected_row_count=? WHERE batch_id=?",
            "SUCCEEDED", completed, loaded_rows, 0, batch_id,
        )
        conn.commit()
        print(json.dumps({"status": "APPLY_PASS", "batch_id": batch_id, "loaded_row_count": loaded_rows, "calendar_rows": int(cursor.execute("SELECT COUNT_BIG(*) FROM [finance].[Calendar]").fetchone()[0]), "source_hash_sha256": digest}, indent=2))
        return 0
    except Exception as exc:
        conn.rollback()
        try:
            cursor.execute("UPDATE [finance].[Refresh_Control] SET status=?, load_completed_utc=?, error_message=? WHERE batch_id=?", "FAILED", datetime.now(timezone.utc).replace(tzinfo=None), str(exc)[:2000], batch_id)
            conn.commit()
        except Exception:
            conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, default=Path("powerbi/data/current"))
    parser.add_argument("--report", type=Path, help="write the JSON evidence file")
    parser.add_argument("--batch-id", default="", help="stable id for an apply; defaults to UTC timestamp")
    parser.add_argument("--watermark-utc", default="", help="ISO-8601 UTC source watermark; defaults to current UTC")
    parser.add_argument("--apply", action="store_true", help="replace source tables in a real SQL Server/Azure SQL transaction")
    parser.add_argument("--connection-string", default="", help="pyodbc connection string; omit and use VNFINANCE_SQL_CONNECTION")
    args = parser.parse_args()

    batch_id = args.batch_id or datetime.now(timezone.utc).strftime("DQ_%Y%m%dT%H%M%SZ")
    watermark = args.watermark_utc or datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    try:
        manifest, rows_by_table = inspect_source(args.input_dir)
        if args.apply:
            connection = args.connection_string or os.environ.get("VNFINANCE_SQL_CONNECTION", "")
            if not connection:
                raise RuntimeError("--apply requires --connection-string or VNFINANCE_SQL_CONNECTION; no secret is stored in the repository")
            code = apply_load(connection, manifest, rows_by_table, batch_id, watermark)
            result = build_result(manifest, mode="apply", batch_id=batch_id, watermark=watermark)
            result["status"] = "APPLY_PASS"
        else:
            result = build_result(manifest, mode="dry-run", batch_id=batch_id, watermark=watermark)
            code = 0
            print(json.dumps(result, indent=2))
        if args.report:
            args.report.parent.mkdir(parents=True, exist_ok=True)
            args.report.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
        return code
    except Exception as exc:
        print(json.dumps({"status": "FAIL", "error": str(exc)}, indent=2), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
