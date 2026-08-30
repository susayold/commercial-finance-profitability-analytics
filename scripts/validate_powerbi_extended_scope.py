#!/usr/bin/env python3
"""Validate the extended finance-analyst Power BI scope.

This gate is intentionally separate from the compact native-PBIX inventory:
it verifies the five planning/evidence tables, their 19-file DataRoot drop and
the Desktop-compatible extended PBIT model without claiming a native binary.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import zipfile
from pathlib import Path


def check(results: list[dict], name: str, ok: bool, detail: str = "") -> None:
    results.append({"name": name, "status": "PASS" if ok else "FAIL", "detail": detail})


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", type=Path, default=Path("."))
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    root = args.repo_root.resolve()
    results: list[dict] = []
    pbip = root / "powerbi" / "native" / "VNFinance_PBIP_Extended"
    pbit = root / "powerbi" / "releases" / "Commercial_Finance_Profitability_Analytics_extended.pbit"
    data = root / "powerbi" / "data" / "current"
    required_tables = {"Scenario Selector", "Peer_Benchmark", "Peer_Review_Queue", "OPEX_Headcount", "CAPEX_Projects"}
    required_files = {
        "scenario_selector.csv",
        "peer_benchmark_approved_2016_2025.csv",
        "peer_extraction_queue.csv",
        "opex_headcount_planning_synthetic.csv",
        "capex_fixed_asset_planning_synthetic.csv",
    }

    table_files = list((pbip / "VNFinance_Commercial_Finance.SemanticModel" / "definition" / "tables").glob("*.tmdl")) if pbip.is_dir() else []
    table_names: set[str] = set()
    measures = 0
    keys_per_table: dict[str, int] = {}
    for path in table_files:
        text = path.read_text(encoding="utf-8")
        match = re.search(r"^table (?:'([^']+)'|(\S+))$", text, re.MULTILINE)
        name = (match.group(1) or match.group(2)) if match else path.stem
        table_names.add(name)
        measures += len(re.findall(r"^\s*measure (?:'[^']+'|\S+)\s*=", text, re.MULTILINE))
        keys_per_table[name] = len(re.findall(r"^\s*\tisKey\s*$", text, re.MULTILINE))
    check(results, "extended PBIP exists", pbip.is_dir(), str(pbip))
    check(results, "extended PBIP has 20 tables", len(table_names) == 20, str(len(table_names)))
    check(results, "extended PBIP contains five added tables", required_tables <= table_names, ", ".join(sorted(required_tables - table_names)))
    check(results, "extended PBIP has 60 measures", measures == 60, str(measures))
    check(results, "extended tables have at most one key column", all(value <= 1 for value in keys_per_table.values()), json.dumps(keys_per_table, sort_keys=True))

    report_json = pbip / "VNFinance_Commercial_Finance.Report" / "report.json"
    try:
        report = json.loads(report_json.read_text(encoding="utf-8"))
        sections = report.get("sections", [])
        visuals = sum(len(section.get("visualContainers", [])) for section in sections)
        check(results, "extended PBIP has six pages", len(sections) == 6, str(len(sections)))
        check(results, "extended PBIP has 42 visuals", visuals == 42, str(visuals))
    except (OSError, json.JSONDecodeError) as exc:
        check(results, "extended PBIP report JSON readable", False, str(exc))

    check(results, "extended DataRoot additions are present", required_files <= {path.name for path in data.glob("*.csv")}, ", ".join(sorted(required_files - {path.name for path in data.glob('*.csv')})))
    scenario_path = data / "scenario_selector.csv"
    required_scenario_columns = {
        "scenario", "base_case", "revenue_multiplier", "cogs_multiplier",
        "opex_multiplier", "working_capital_days_delta", "scenario_note",
    }
    try:
        with scenario_path.open(newline="", encoding="utf-8") as handle:
            scenario_rows = list(csv.DictReader(handle))
        headers = set(scenario_rows[0]) if scenario_rows else set()
        check(results, "scenario selector exposes editable driver columns", required_scenario_columns <= headers, ", ".join(sorted(required_scenario_columns - headers)))
        values = {row.get("scenario", "") for row in scenario_rows}
        has_sensitivity = any(
            abs(float(row.get("revenue_multiplier", 1)) - 1) > 1e-9
            or abs(float(row.get("cogs_multiplier", 1)) - 1) > 1e-9
            or abs(float(row.get("opex_multiplier", 1)) - 1) > 1e-9
            for row in scenario_rows
        )
        check(results, "scenario selector has five rows and a non-neutral sensitivity", values == {"Actual", "Budget", "Forecast", "Upside", "Downside"} and has_sensitivity, json.dumps(sorted(values)))
    except (OSError, ValueError, IndexError) as exc:
        check(results, "scenario selector exposes editable driver columns", False, str(exc))
        check(results, "scenario selector has five rows and a non-neutral sensitivity", False, str(exc))
    try:
        with zipfile.ZipFile(pbit) as archive:
            model = json.loads(archive.read("DataModelSchema"))
            model_tables = model["model"].get("tables", [])
            model_names = {table["name"] for table in model_tables}
            model_measures = sum(len(table.get("measures", [])) for table in model_tables)
            relations = len(model["model"].get("relationships", []))
            check(results, "extended PBIT is a readable ZIP", True, str(pbit.stat().st_size))
            check(results, "extended PBIT has 20 tables", len(model_names) == 20, str(len(model_names)))
            check(results, "extended PBIT includes five added tables", required_tables <= model_names, ", ".join(sorted(required_tables - model_names)))
            check(results, "extended PBIT has 60 measures", model_measures == 60, str(model_measures))
            check(results, "extended PBIT has 25 relationships", relations == 25, str(relations))
    except (OSError, zipfile.BadZipFile, KeyError, json.JSONDecodeError) as exc:
        check(results, "extended PBIT can be inspected", False, str(exc))

    failed = [item["name"] for item in results if item["status"] != "PASS"]
    payload = {
        "status": "PASS" if not failed else "FAIL",
        "checks": len(results),
        "passed": len(results) - len(failed),
        "failed": failed,
        "evidence_boundary": "Extended PBIP/PBIT topology and data-drop contract only; native PBIX and production realtime remain separate gates.",
        "checks_detail": results,
    }
    print(json.dumps(payload, indent=2))
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
