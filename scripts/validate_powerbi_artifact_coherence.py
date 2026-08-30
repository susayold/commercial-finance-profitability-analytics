#!/usr/bin/env python3
"""Validate that the generated PBIP/PBIT topology matches its release manifest.

The broader ``model_contract.json`` describes the full Excel design. The
generated PBIP/PBIT is intentionally a compact refreshable operating model;
this gate prevents those two scopes from being silently treated as identical.
"""

from __future__ import annotations

import argparse
import json
import re
import zipfile
from pathlib import Path

from build_powerbi_refreshable_project import MEASURES, RELATIONSHIPS, TABLES


def check(results: list[tuple[str, bool, str]], name: str, ok: bool, detail: str = "") -> None:
    results.append((name, bool(ok), detail))


def pbit_inventory(path: Path) -> dict[str, object]:
    with zipfile.ZipFile(path) as package:
        model = json.loads(package.read("DataModelSchema").decode("utf-16-le"))
        report = json.loads(package.read("Report/Layout").decode("utf-16-le"))
    tables = model["model"].get("tables", [])
    return {
        "table_names": [table.get("name") for table in tables],
        "measure_names": [measure.get("name") for table in tables for measure in table.get("measures", [])],
        "relationship_count": len(model["model"].get("relationships", [])),
        "page_count": len(report.get("sections", [])),
        "visual_container_count": sum(len(page.get("visualContainers", [])) for page in report.get("sections", [])),
    }


def pbip_inventory(path: Path) -> dict[str, object]:
    table_files = sorted(path.glob("**/definition/tables/*.tmdl"))
    table_names: list[str] = []
    measure_names: list[str] = []
    for table_file in table_files:
        text = table_file.read_text(encoding="utf-8")
        table_match = re.search(r"^table (?:'([^']+)'|(\S+))$", text, re.MULTILINE)
        if table_match:
            table_names.append(table_match.group(1) or table_match.group(2))
        for match in re.finditer(r"^\s*measure (?:'([^']+)'|(\S+))\s*=", text, re.MULTILINE):
            measure_names.append(match.group(1) or match.group(2))
    relationship_file = next(path.glob("**/definition/relationships.tmdl"), None)
    relationship_count = 0
    if relationship_file:
        relationship_count = len(re.findall(r"^relationship ", relationship_file.read_text(encoding="utf-8"), re.MULTILINE))
    pages = list(path.glob("**/*.Report/report.json"))
    page_count = 0
    visual_count = 0
    if pages:
        report = json.loads(pages[0].read_text(encoding="utf-8"))
        sections = report.get("sections", [])
        page_count = len(sections)
        visual_count = sum(len(section.get("visualContainers", [])) for section in sections)
    return {
        "table_names": table_names,
        "measure_names": measure_names,
        "relationship_count": relationship_count,
        "page_count": page_count,
        "visual_container_count": visual_count,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=Path("powerbi/PBIP_SOURCE_MANIFEST.json"))
    parser.add_argument("--pbip", type=Path, default=Path("powerbi/native/VNFinance_PBIP"))
    parser.add_argument("--pbit", type=Path, default=Path("powerbi/releases/Commercial_Finance_Profitability_Analytics.pbit"))
    parser.add_argument("--report", type=Path, default=None)
    args = parser.parse_args()

    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    inventory = manifest.get("package_inventory", {})
    expected_tables = list(TABLES)
    expected_measures = [name for name, _dax, _fmt in MEASURES]
    results: list[tuple[str, bool, str]] = []

    check(results, "scope contract declared", manifest.get("scope_contract", {}).get("pbip_project_contract") == "COMPACT_REFRESHABLE_OPERATING_MODEL", str(manifest.get("scope_contract", {})))
    check(results, "manifest table count", inventory.get("table_count") == len(expected_tables), str(inventory.get("table_count")))
    check(results, "manifest table names", inventory.get("table_names") == expected_tables, str(inventory.get("table_names")))
    check(results, "manifest measure count", inventory.get("measure_count") == len(expected_measures), str(inventory.get("measure_count")))
    check(results, "manifest measure names", inventory.get("measure_names") == expected_measures, str(inventory.get("measure_names")))
    check(results, "manifest relationship count", inventory.get("relationship_count") == len(RELATIONSHIPS), str(inventory.get("relationship_count")))
    check(results, "manifest page/visual counts", inventory.get("page_count") == 6 and inventory.get("visual_container_count") == 39, str(inventory))

    pbip = pbip_inventory(args.pbip)
    check(results, "PBIP table names", set(pbip["table_names"]) == set(expected_tables), str(pbip["table_names"]))
    check(results, "PBIP measure names", set(pbip["measure_names"]) == set(expected_measures), f"{len(pbip['measure_names'])} measures")
    check(results, "PBIP relationship count", pbip["relationship_count"] == len(RELATIONSHIPS), str(pbip["relationship_count"]))
    check(results, "PBIP page/visual counts", pbip["page_count"] == 6 and pbip["visual_container_count"] == 39, str(pbip))

    pbit = pbit_inventory(args.pbit)
    check(results, "PBIT table names", set(pbit["table_names"]) == set(expected_tables), str(pbit["table_names"]))
    check(results, "PBIT measure names", set(pbit["measure_names"]) == set(expected_measures), f"{len(pbit['measure_names'])} measures")
    check(results, "PBIT relationship count", pbit["relationship_count"] == len(RELATIONSHIPS), str(pbit["relationship_count"]))
    check(results, "PBIT page/visual counts", pbit["page_count"] == 6 and pbit["visual_container_count"] == 39, str(pbit))

    failed = [name for name, ok, _detail in results if not ok]
    status = "PASS" if not failed else "FAIL"
    payload = {"status": status, "checks": len(results), "passed": len(results) - len(failed), "failed": failed}
    print(json.dumps(payload, indent=2))
    if args.report:
        lines = [
            "# Power BI Generated Artifact Coherence QA",
            "",
            f"**Overall status:** `{status}` ({payload['passed']}/{payload['checks']} checks passed)",
            "",
            "This report compares the generated PBIP/PBIT topology with the package inventory declared in `PBIP_SOURCE_MANIFEST.json`.",
            "",
            "| Check | Result | Detail |",
            "|---|---:|---|",
        ]
        lines.extend(f"| {name} | {'PASS' if ok else 'FAIL'} | {detail.replace('|', '/') or '—'} |" for name, ok, detail in results)
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
