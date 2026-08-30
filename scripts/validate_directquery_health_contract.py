#!/usr/bin/env python3
"""Validate the fail-closed freshness contract used by DirectQuery health."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from build_powerbi_refreshable_project import TABLES


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--query", type=Path, default=Path("powerbi/directquery/VNFinance_DirectQuery_Health.sql"))
    args = parser.parse_args()
    sql = args.query.read_text(encoding="utf-8")
    checks: list[tuple[str, bool, str]] = []

    def add(name: str, ok: bool, detail: str = "") -> None:
        checks.append((name, bool(ok), detail))

    add("SLA parameter is explicit", bool(re.search(r"DECLARE\s+@SlaMinutes\s+int\s*=\s*\d+", sql, flags=re.I)))
    sla_match = re.search(r"DECLARE\s+@SlaMinutes\s+int\s*=\s*(\d+)", sql, flags=re.I)
    add("SLA default is positive", bool(sla_match and int(sla_match.group(1)) > 0))
    add("UTC source watermark is used", "SYSUTCDATETIME()" in sql)
    add("latency is calculated in SQL", "DATEDIFF_BIG(MINUTE, source_watermark_utc" in sql)
    add("latest batch is selected deterministically", "ORDER BY load_completed_utc DESC, load_started_utc DESC" in sql)
    add("empty control table fails closed", "latest.batch_id IS NULL THEN N'FAIL'" in sql and "N'NO_LOAD'" in sql)
    add("non-success batch fails closed", "latest.status <> N'SUCCEEDED' THEN N'FAIL'" in sql and "N'LOAD_FAILED'" in sql)
    add("rejected rows are visible as warning", "rejected_row_count > 0 THEN N'WARN'" in sql and "N'REJECTED_ROWS'" in sql)
    add("stale watermark is visible as warning", "ELSE N'WARN'" in sql and "N'STALE_WATERMARK'" in sql)
    add("current batch has PASS state", "latency_minutes BETWEEN 0 AND @SlaMinutes THEN N'PASS'" in sql and "N'CURRENT'" in sql)
    add("clock skew has a reason", "N'CLOCK_SKEW'" in sql)
    add("refresh control source is queried", "FROM finance.Refresh_Control" in sql)
    add("rejected count is returned", "COALESCE(rejected_row_count, 0) AS rejected_row_count" in sql)
    add("source row counts are returned", "COALESCE(source_row_count, 0) AS source_row_count" in sql)
    add("all report table tie-outs are present", all(f"FROM finance.{table}" in sql for table in TABLES))

    failed = [name for name, ok, _ in checks if not ok]
    result = {
        "status": "PASS" if not failed else "FAIL",
        "checks": len(checks),
        "passed": len(checks) - len(failed),
        "failed": failed,
        "evidence_boundary": "Static SQL contract check; it does not prove a live database, gateway or Power BI Automatic Page Refresh deployment.",
    }
    print(json.dumps(result, indent=2))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
