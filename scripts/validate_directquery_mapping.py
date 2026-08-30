#!/usr/bin/env python3
"""Validate the explicit Import-to-DirectQuery table mapping contract."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from build_powerbi_refreshable_project import DIRECTQUERY_SOURCE_TABLES, TABLES


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--contract", type=Path, default=Path("powerbi/directquery/DIRECTQUERY_MIGRATION_CONTRACT.json"))
    parser.add_argument("--schema", type=Path, default=Path("powerbi/directquery/VNFinance_DirectQuery_Schema.sql"))
    parser.add_argument("--pbip-tables", type=Path, default=Path("powerbi/native/VNFinance_PBIP_Extended/VNFinance_Commercial_Finance.SemanticModel/definition/tables"))
    args = parser.parse_args()

    contract = json.loads(args.contract.read_text(encoding="utf-8"))
    ddl = args.schema.read_text(encoding="utf-8")
    expected = list(TABLES.keys())
    mappings = contract.get("tables", [])
    checks: list[tuple[str, bool, str]] = []

    def add(name: str, ok: bool, detail: str = "") -> None:
        checks.append((name, bool(ok), detail))

    add("contract parses", True)
    add("current mode is Import", contract.get("current_report_mode") == "Import_replace_and_refresh")
    add("target mode is DirectQuery/APR", contract.get("target_report_mode") == "DirectQuery_with_Automatic_Page_Refresh")
    add("runtime credential policy", contract.get("connection", {}).get("credential_policy") == "runtime_only")
    add("server/database use environment names", contract.get("connection", {}).get("server_env") == "VNFINANCE_SQL_SERVER" and contract.get("connection", {}).get("database_env") == "VNFINANCE_SQL_DATABASE")
    add("mapping count equals report tables", len(mappings) == len(expected), f"{len(mappings)} mappings / {len(expected)} expected")

    names = [item.get("report_table") for item in mappings]
    sources = [item.get("source_table") for item in mappings]
    add("each report table appears once", names == expected and len(set(names)) == len(names), ", ".join(str(name) for name in names))
    add("every mapping is DirectQuery", all(item.get("storage_mode") == "DirectQuery" for item in mappings))
    add("source schema is finance", all(isinstance(source, str) and source.startswith("finance.") for source in sources))
    add("key columns are explicit", all(isinstance(item.get("key_columns"), list) and item["key_columns"] for item in mappings))

    declarations = set(re.findall(r"IF OBJECT_ID\(N'finance\.([^']+)', N'U'\)", ddl))
    expected_sources = {f"finance.{DIRECTQUERY_SOURCE_TABLES.get(name, name)}" for name in expected}
    add("all mapped sources are declared in DDL", set(sources) <= {f"finance.{name}" for name in declarations})
    add("DDL has no missing report sources", expected_sources <= {f"finance.{name}" for name in declarations})
    add("Refresh_Control is declared", "finance.Refresh_Control" in {f"finance.{name}" for name in declarations})

    pbip_files = {path.stem for path in args.pbip_tables.glob("*.tmdl")} if args.pbip_tables.is_dir() else set()
    add("PBIP table files match mapping", pbip_files == set(expected), f"{len(pbip_files)} PBIP table files")

    preserve = contract.get("preserve", {})
    add("preservation counts are explicit", preserve.get("measure_count") == 60 and preserve.get("relationship_count") == 25 and preserve.get("report_page_count") == 6 and preserve.get("visual_container_count") == 42)
    control = contract.get("operational_control", {})
    required_control = {"batch_id", "status", "source_watermark_utc", "load_completed_utc", "source_row_count", "loaded_row_count", "rejected_row_count", "source_hash_sha256"}
    add("operational freshness fields are explicit", required_control <= set(control.get("required_fields", [])))
    health_outputs = control.get("health_query_outputs", {})
    add("health output states are explicit", set(health_outputs.get("control_status", [])) == {"PASS", "WARN", "FAIL"} and {"CURRENT", "STALE_WATERMARK", "REJECTED_ROWS", "LOAD_FAILED", "NO_LOAD", "CLOCK_SKEW"} <= set(health_outputs.get("control_reason", [])))
    add("claim boundary is present", "does not claim" in contract.get("claim_boundary", ""))

    failed = [name for name, ok, _ in checks if not ok]
    result = {
        "status": "PASS" if not failed else "FAIL",
        "checks": len(checks),
        "passed": len(checks) - len(failed),
        "failed": failed,
        "mapping_count": len(mappings),
        "evidence_boundary": contract.get("claim_boundary", ""),
    }
    print(json.dumps(result, indent=2))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
