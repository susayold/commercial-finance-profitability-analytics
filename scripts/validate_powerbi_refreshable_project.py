#!/usr/bin/env python3
"""Validate the refreshable Power BI source project and compiled PBIT package."""

from __future__ import annotations

import argparse
import csv
import json
import re
import tempfile
import zipfile
from decimal import Decimal
from pathlib import Path


REQUIRED_PARTS = {
    "Version",
    "Settings",
    "Metadata",
    "DiagramLayout",
    "Report/Layout",
    "DataModelSchema",
    "[Content_Types].xml",
}

EXPECTED_SCOPES = {
    "compact": {"tables": 15, "measures": 37, "relationships": 23, "pages": 6, "visuals": 39, "csv": 14},
    "extended": {"tables": 20, "measures": 60, "relationships": 25, "pages": 6, "visuals": 42, "csv": 19},
}


def check(condition: bool, label: str, results: list[tuple[str, bool, str]], detail: str = "") -> None:
    results.append((label, bool(condition), detail))


def validate_package(pbit: Path, results: list[tuple[str, bool, str]], expected: dict[str, int]) -> dict[str, int]:
    with zipfile.ZipFile(pbit) as package:
        parts = set(package.namelist())
        check(REQUIRED_PARTS <= parts, "PBIT package parts", results, ", ".join(sorted(parts)))
        model = json.loads(package.read("DataModelSchema").decode("utf-16-le"))
        report = json.loads(package.read("Report/Layout").decode("utf-16-le"))

    tables = model["model"].get("tables", [])
    measures = [m for table in tables for m in table.get("measures", [])]
    relationships = model["model"].get("relationships", [])
    pages = report.get("sections", [])
    visuals = [visual for page in pages for visual in page.get("visualContainers", [])]
    expressions = model["model"].get("expressions", [])
    partitions = [p for table in tables for p in table.get("partitions", [])]

    check(len(tables) == expected["tables"], "PBIT semantic tables", results, str(len(tables)))
    check(len(measures) == expected["measures"], "PBIT DAX measures", results, str(len(measures)))
    check(len(relationships) == expected["relationships"], "PBIT relationships", results, str(len(relationships)))
    check(len(pages) == expected["pages"], "PBIT report pages", results, str(len(pages)))
    check(len(visuals) == expected["visuals"], "PBIT visual containers", results, str(len(visuals)))
    check(any(e.get("name") == "DataRoot" for e in expressions), "PBIT DataRoot parameter", results)
    check(all(p.get("mode") == "import" for p in partitions), "PBIT Import partitions", results, str(len(partitions)))
    return {"tables": len(tables), "measures": len(measures), "relationships": len(relationships), "pages": len(pages), "visuals": len(visuals)}


def validate_pbip(pbip_root: Path, results: list[tuple[str, bool, str]], expected: dict[str, int]) -> dict[str, int]:
    json_like = [*pbip_root.rglob("*.json"), *pbip_root.rglob("*.pbip"), *pbip_root.rglob("*.pbir"), *pbip_root.rglob("*.pbism"), *pbip_root.rglob(".platform")]
    for path in json_like:
        raw = path.read_bytes()
        check(not raw.startswith(b"\xef\xbb\xbf"), f"No UTF-8 BOM: {path.name}", results)
        json.loads(raw.decode("utf-8"))
    check(bool(json_like), "PBIP JSON artifacts parse", results, str(len(json_like)))

    pbip_files = list(pbip_root.glob("*.pbip"))
    pbir_files = list(pbip_root.rglob("definition.pbir"))
    check(len(pbip_files) == 1, "PBIP entry point", results, str(len(pbip_files)))
    check(len(pbir_files) == 1, "PBIR definition", results, str(len(pbir_files)))
    if pbir_files:
        ref = json.loads(pbir_files[0].read_text(encoding="utf-8"))["datasetReference"]["byPath"]["path"]
        check((pbir_files[0].parent / ref).resolve().exists(), "PBIR semantic-model path resolves", results, ref)

    tmdl_files = list(pbip_root.rglob("*.tmdl"))
    all_tmdl = "\n".join(path.read_text(encoding="utf-8") for path in tmdl_files)
    table_files = list(pbip_root.rglob("definition/tables/*.tmdl"))
    measure_count = sum(len(re.findall(r"(?m)^\s*measure\s+", p.read_text(encoding="utf-8"))) for p in table_files)
    relationship_file = next(iter(pbip_root.rglob("relationships.tmdl")), None)
    relationship_count = len(re.findall(r"(?m)^relationship\s+", relationship_file.read_text(encoding="utf-8"))) if relationship_file else 0
    check(len(table_files) == expected["tables"], "PBIP TMDL tables", results, str(len(table_files)))
    check(measure_count == expected["measures"], "PBIP TMDL measures", results, str(measure_count))
    check(relationship_count == expected["relationships"], "PBIP TMDL relationships", results, str(relationship_count))
    check("expression DataRoot" in all_tmdl and "IsParameterQuery=true" in all_tmdl, "PBIP DataRoot parameter", results)
    check(all(len(str(path.resolve())) <= 256 for path in pbip_root.rglob("*")), "PBIP path length <= 256", results)
    return {"tables": len(table_files), "measures": measure_count, "relationships": relationship_count}


def validate_refresh_contract(data_dir: Path, pbixproj: Path, results: list[tuple[str, bool, str]], expected: dict[str, int]) -> dict[str, str | int]:
    sales = data_dir / "sales_fact.csv"
    with sales.open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))
        headers = list(rows[0])
    baseline = sum(Decimal(row["net_sales"]) for row in rows)
    delta = Decimal("1000000")

    with tempfile.TemporaryDirectory(prefix="vnfinance_powerbi_swap_") as scratch:
        test_file = Path(scratch) / sales.name
        changed = [row.copy() for row in rows]
        changed[0]["net_sales"] = str(Decimal(changed[0]["net_sales"]) + delta)
        changed[0]["contribution_margin"] = str(Decimal(changed[0]["contribution_margin"]) + delta)
        with test_file.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=headers)
            writer.writeheader()
            writer.writerows(changed)
        with test_file.open(newline="", encoding="utf-8") as handle:
            reread = list(csv.DictReader(handle))
            changed_headers = list(reread[0])
        changed_total = sum(Decimal(row["net_sales"]) for row in reread)

    check(headers == changed_headers, "Data-swap schema unchanged", results, f"{len(headers)} columns")
    check(len(rows) == len(reread), "Data-swap row count unchanged", results, str(len(rows)))
    check(changed_total - baseline == delta, "Data-swap value delta detected", results, f"{changed_total - baseline:,.0f} VND")

    query_dir = pbixproj / "Model" / "queries"
    expected_csv = sorted(path.name for path in data_dir.glob("*.csv"))
    referenced = []
    for query in query_dir.glob("*.m"):
        text = query.read_text(encoding="utf-8")
        if "File.Contents(DataRoot" in text:
            match = re.search(r'DataRoot\s*&\s*"\\\\([^\"]+\.csv)"', text)
            if match:
                referenced.append(match.group(1))
    missing = sorted(set(referenced) - set(expected_csv))
    check(len(referenced) == expected["csv"], "Power Query files use DataRoot", results, str(len(referenced)))
    check(not missing, "All referenced CSV files exist", results, ", ".join(missing) or "none missing")
    return {"rows": len(rows), "columns": len(headers), "delta_vnd": str(delta), "referenced_csv": len(referenced)}


def write_report(path: Path, results: list[tuple[str, bool, str]], metrics: dict[str, object]) -> None:
    passed = sum(1 for _, ok, _ in results if ok)
    status = "PASS" if passed == len(results) else "FAIL"
    lines = [
        "# Power BI Refreshable Package QA",
        "",
        f"**Overall status:** `{status}`",
        "",
        "This is source/package QA. Native Power BI Desktop open, credential binding, visual rendering, and refresh execution remain separate release gates.",
        "",
        "## Package inventory",
        "",
        *[f"- **{key}:** {value}" for key, value in metrics.items()],
        "",
        "## Checks",
        "",
        "| Check | Result | Evidence |",
        "|---|---:|---|",
    ]
    for label, ok, detail in results:
        lines.append(f"| {label} | {'PASS' if ok else 'FAIL'} | {detail.replace('|', '/')} |")
    lines += [
        "",
        "## Refresh interpretation",
        "",
        "- `REFRESH_CONTRACT_PASS`: replacing a CSV with the same filename and schema changes source values while preserving the contract. Power BI recalculates the model after **Refresh**.",
        "- `NATIVE_DESKTOP_REFRESH_PENDING`: this machine could not execute the final Desktop open/refresh/render gate because `PBIDesktop.exe` is missing and MSI repair requires Administrator rights.",
        "- This Import-mode package is refreshable, not true streaming real-time. True automatic page refresh requires a supported DirectQuery/LiveConnect source.",
        "",
    ]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pbit", type=Path, required=True)
    parser.add_argument("--pbip", type=Path, required=True)
    parser.add_argument("--pbixproj", type=Path, required=True)
    parser.add_argument("--data-dir", type=Path, required=True)
    parser.add_argument("--scope", choices=sorted(EXPECTED_SCOPES), default="compact")
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()

    expected = EXPECTED_SCOPES[args.scope]
    results: list[tuple[str, bool, str]] = []
    metrics: dict[str, object] = {}
    metrics["scope"] = args.scope
    metrics.update({f"pbit_{k}": v for k, v in validate_package(args.pbit, results, expected).items()})
    metrics.update({f"pbip_{k}": v for k, v in validate_pbip(args.pbip, results, expected).items()})
    metrics.update({f"refresh_{k}": v for k, v in validate_refresh_contract(args.data_dir, args.pbixproj, results, expected).items()})
    metrics["pbit_bytes"] = args.pbit.stat().st_size
    write_report(args.report, results, metrics)
    failed = [label for label, ok, _ in results if not ok]
    print(json.dumps({"status": "PASS" if not failed else "FAIL", "checks": len(results), "failed": failed, "metrics": metrics}, indent=2))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
