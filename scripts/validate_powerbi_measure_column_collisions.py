#!/usr/bin/env python3
"""Fail fast when a Power BI table has a measure/column name collision.

Power BI Desktop rejects a model when a measure and a column share a name in
the same table (case-insensitive). This validator checks both editable source
formats so a package can be rejected before a native Desktop open.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def add(results: list[tuple[str, bool, str]], name: str, ok: bool, detail: str = "") -> None:
    results.append((name, bool(ok), detail))


def pbip_collisions(root: Path) -> dict[str, list[str]]:
    collisions: dict[str, list[str]] = {}
    for path in root.glob("**/definition/tables/*.tmdl"):
        text = path.read_text(encoding="utf-8")
        table_match = re.search(r"^table (?:'([^']+)'|(\S+))$", text, re.MULTILINE)
        table = (table_match.group(1) or table_match.group(2)) if table_match else path.stem
        columns = {m.group(1) or m.group(2) for m in re.finditer(r"^\s*column (?:'([^']+)'|(\S+))$", text, re.MULTILINE)}
        measures = {m.group(1) or m.group(2) for m in re.finditer(r"^\s*measure (?:'([^']+)'|(\S+))\s*=", text, re.MULTILINE)}
        column_by_fold = {name.casefold(): name for name in columns}
        hit = sorted(column_by_fold[key] for key in (m.casefold() for m in measures) if key in column_by_fold)
        if hit:
            collisions[table] = hit
    return collisions


def pbixproj_collisions(root: Path) -> dict[str, list[str]]:
    collisions: dict[str, list[str]] = {}
    tables = root / "Model" / "tables"
    for table_dir in tables.iterdir() if tables.is_dir() else []:
        if not table_dir.is_dir():
            continue
        columns = {p.stem for p in (table_dir / "columns").glob("*.json")}
        measures: set[str] = set()
        for path in (table_dir / "measures").glob("*.xml"):
            text = path.read_text(encoding="utf-8")
            match = re.search(r'<Measure\s+Name="([^"]+)"', text)
            if match:
                measures.add(match.group(1))
        column_by_fold = {name.casefold(): name for name in columns}
        hit = sorted(column_by_fold[key] for key in (m.casefold() for m in measures) if key in column_by_fold)
        if hit:
            collisions[table_dir.name] = hit
    return collisions


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pbip", type=Path, default=Path("powerbi/native/VNFinance_PBIP"))
    parser.add_argument("--pbixproj", type=Path, default=Path("powerbi/native/VNFinance_PbixProj"))
    args = parser.parse_args()
    results: list[tuple[str, bool, str]] = []
    pbip = pbip_collisions(args.pbip)
    pbixproj = pbixproj_collisions(args.pbixproj)
    add(results, "PBIP measure/column names are unique", not pbip, json.dumps(pbip, sort_keys=True) if pbip else "none")
    add(results, "PbixProj measure/column names are unique", not pbixproj, json.dumps(pbixproj, sort_keys=True) if pbixproj else "none")
    failed = [name for name, ok, _ in results if not ok]
    payload = {"status": "PASS" if not failed else "FAIL", "checks": len(results), "passed": len(results) - len(failed), "failed": failed, "pbip_collisions": pbip, "pbixproj_collisions": pbixproj, "evidence_boundary": "Static model-name check; it does not replace native Desktop open/refresh/render QA."}
    print(json.dumps(payload, indent=2))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
