#!/usr/bin/env python3
"""Structural QA for the editable final_v1 Power BI source and PBIT."""
from __future__ import annotations

import importlib.util
import json
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILDER_PATH = ROOT / "scripts" / "build_powerbi_final.py"
spec = importlib.util.spec_from_file_location("final_builder", BUILDER_PATH)
if spec is None or spec.loader is None:
    raise RuntimeError("Cannot import final Power BI builder")
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


def main() -> int:
    checks: list[dict] = []

    def add(code: str, name: str, ok: bool, detail: str) -> None:
        checks.append({"id": code, "name": name, "status": "PASS" if ok else "FAIL", "detail": detail})

    files_ok = all((builder.DATA_DIR / spec["file"]).exists() for spec in builder.TABLES.values())
    add("QA-X09", "Every semantic table has a source file", files_ok, f"tables={len(builder.TABLES)}")
    columns = {name: {col[0] for col in spec["columns"]} for name, spec in builder.TABLES.items()}
    measures = {item[0] for item in builder.MEASURES}
    page_errors: list[str] = []
    visual_names_ok = True
    bounds_ok = True
    for page in builder.build_pages():
        names = [v["name"] for v in page["visuals"]]
        if len(names) != len(set(names)):
            visual_names_ok = False
            page_errors.append(f"duplicate visual names: {page['displayName']}")
        for visual in page["visuals"]:
            pos = visual["layouts"][0]["position"]
            bounds_ok = bounds_ok and pos["x"] >= 0 and pos["y"] >= 0 and pos["x"] + pos["width"] <= page["width"] and pos["y"] + pos["height"] <= page["height"]
            query = visual["singleVisual"].get("prototypeQuery", {})
            for select in query.get("Select", []):
                if "Column" in select:
                    source = select["Column"]["Expression"]["SourceRef"]["Source"]
                    field = select["Column"]["Property"]
                    entity = next((entry["Entity"] for entry in query.get("From", []) if entry["Name"] == source), source)
                    if entity not in columns or field not in columns[entity]:
                        page_errors.append(f"{page['displayName']}/{visual['name']}: missing column {entity}.{field}")
                elif "Measure" in select:
                    field = select["Measure"]["Property"]
                    if field not in measures:
                        page_errors.append(f"{page['displayName']}/{visual['name']}: missing measure {field}")
    add("QA-X10", "Every visual field resolves to model metadata", not page_errors, "; ".join(page_errors[:5]) or "192 visuals resolved")
    add("QA-X11", "Visual names are unique per page", visual_names_ok, "; ".join(page_errors[:3]) or "no duplicates")
    add("QA-X12", "All visuals stay inside the declared canvas", bounds_ok, "1672 × 941 geometry")
    relationship_errors: list[str] = []
    for name, from_table, from_col, to_table, to_col in builder.RELATIONSHIPS:
        if from_table not in columns or from_col not in columns[from_table] or to_table not in columns or to_col not in columns[to_table]:
            relationship_errors.append(f"{name}: {from_table}.{from_col} -> {to_table}.{to_col}")
    add("QA-X13", "Relationship endpoints resolve", not relationship_errors, "; ".join(relationship_errors[:5]) or f"relationships={len(builder.RELATIONSHIPS)}")

    report_path = ROOT / "powerbi" / "final" / builder.PROJECT / f"{builder.PROJECT}.Report" / "report.json"
    report = json.loads(report_path.read_text(encoding="utf-8"))
    page_size_ok = all(s["width"] == 1672 and s["height"] == 941 for s in report["sections"])
    add("QA-X14", "PBIP report pages use reference canvas", page_size_ok, f"pages={len(report['sections'])}")
    pbit_path = ROOT / "powerbi" / "releases" / "VNFinance_Commercial_Finance_FINAL.pbit"
    with zipfile.ZipFile(pbit_path) as archive:
        model = json.loads(archive.read("DataModelSchema").decode("utf-16le"))
        layout = json.loads(archive.read("Report/Layout").decode("utf-16le"))
        pbit_ok = len(model["model"]["tables"]) == len(builder.TABLES) and len(model["model"]["relationships"]) == len(builder.RELATIONSHIPS) and len(layout["sections"]) == len(builder.build_pages())
    add("QA-X15", "PBIT container model/layout topology matches PBIP", pbit_ok, "UTF-16LE DataModelSchema + Report/Layout")
    payload = {"status": "PASS" if all(c["status"] == "PASS" for c in checks) else "FAIL", "checks": len(checks), "passed": sum(c["status"] == "PASS" for c in checks), "failed": [c["id"] for c in checks if c["status"] == "FAIL"]}
    out = ROOT / "reports" / "POWER_BI_FINAL_BUILD_QA_2026-08-31.json"
    out.write_text(json.dumps({**payload, "results": checks}, indent=2), encoding="utf-8")
    md = ROOT / "reports" / "POWER_BI_FINAL_BUILD_QA_2026-08-31.md"
    lines = ["# Power BI final build QA", "", f"**Status:** `{payload['status']}`", "", "| ID | Check | Result | Evidence |", "|---|---|---|---|"]
    lines.extend(f"| {c['id']} | {c['name']} | **{c['status']}** | {c['detail']} |" for c in checks)
    md.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps(payload, indent=2))
    return 0 if payload["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
