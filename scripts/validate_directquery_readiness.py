#!/usr/bin/env python3
"""Validate the DirectQuery migration pack without requiring a database connection."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from build_powerbi_refreshable_project import TABLES


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--readiness", type=Path, default=Path("powerbi/DIRECTQUERY_READINESS.json"))
    parser.add_argument("--schema", type=Path, default=Path("powerbi/directquery/VNFinance_DirectQuery_Schema.sql"))
    parser.add_argument("--health-query", type=Path, default=Path("powerbi/directquery/VNFinance_DirectQuery_Health.sql"))
    parser.add_argument("--loader", type=Path, default=Path("scripts/load_directquery_sqlserver.py"))
    args = parser.parse_args()

    readiness = json.loads(args.readiness.read_text(encoding="utf-8"))
    ddl = args.schema.read_text(encoding="utf-8")
    health_query = args.health_query.read_text(encoding="utf-8")
    loader = args.loader.read_text(encoding="utf-8")
    checks: list[tuple[str, bool, str]] = []

    def add(name: str, ok: bool, detail: str = "") -> None:
        checks.append((name, bool(ok), detail))

    add("readiness JSON parses", True)
    add("status is gated", readiness.get("status") == "READY_FOR_DATABASE_PROVISIONING", readiness.get("status", ""))
    add("current mode is Import", readiness.get("current_report_mode") == "Import_replace_and_refresh")
    add("target mode is DirectQuery", readiness.get("target_report_mode") == "DirectQuery_with_Automatic_Page_Refresh")
    add("physical CSV table count", readiness.get("source_contract", {}).get("physical_csv_tables") == 14)
    add("report table count", readiness.get("source_contract", {}).get("report_tables") == 15)
    add("table-name preservation", readiness.get("source_contract", {}).get("preserve_table_names") is True)
    add("column-name preservation", readiness.get("source_contract", {}).get("preserve_column_names") is True)
    add("required gates present", len(readiness.get("required_external_gates", [])) >= 6)
    add("realtime claim remains pending", readiness.get("realtime_claim", {}).get("status") == "PENDING")
    add("Import cannot be labelled realtime", readiness.get("realtime_claim", {}).get("must_not_label_import_csv_as_realtime") is True)
    add("freshness controls present", len(readiness.get("operational_controls", [])) >= 7)
    add("finance schema declaration", "CREATE SCHEMA finance" in ddl)
    add("Refresh_Control metadata table declared", "CREATE TABLE finance.Refresh_Control" in ddl)
    add("health query has freshness status", "control_status" in health_query and "latency_minutes" in health_query)
    add("loader defaults to dry-run", "if args.apply" in loader and '"DRY_RUN_PASS"' in loader)
    add("loader records source hash", "source_hash_sha256" in loader)

    expected_tables = ["Calendar", *TABLES.keys()]
    declarations = re.findall(r"IF OBJECT_ID\(N'finance\.([^']+)', N'U'\)", ddl)
    add("all report tables declared", set(expected_tables) <= set(declarations), f"{len(set(declarations))} declarations")
    allowed_tables = set(expected_tables) | {"Refresh_Control"}
    add("no unexpected table names", set(declarations) <= allowed_tables, ", ".join(sorted(set(declarations) - allowed_tables)) or "none")
    for table, spec in TABLES.items():
        expected_columns = [name for name, _, _ in spec["columns"]]
        if table == "Calendar":
            continue
        # Restrict the check to the CREATE TABLE block for this table so a
        # shared column name in another table cannot satisfy the contract.
        match = re.search(rf"CREATE TABLE finance\.{re.escape(table)} \((.*?)\n\s*\);", ddl, flags=re.S)
        block = match.group(1) if match else ""
        missing = [column for column in expected_columns if not re.search(rf"(?m)^\s*\[?{re.escape(column)}\]?\s+", block)]
        add(f"{table} columns", not missing, ", ".join(missing) or f"{len(expected_columns)} columns")
    add("query-path indexes present", all(name in ddl for name in ["IX_finance_Sales_Month_Channel", "IX_finance_Sales_Month_Customer", "IX_finance_Sales_Month_SKU", "IX_finance_Costs_Month_Channel"]))

    passed = sum(ok for _, ok, _ in checks)
    failed = [name for name, ok, _ in checks if not ok]
    print(json.dumps({"status": "PASS" if not failed else "FAIL", "checks": len(checks), "passed": passed, "failed": failed}, indent=2))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
