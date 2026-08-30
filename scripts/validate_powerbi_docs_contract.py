#!/usr/bin/env python3
"""Verify that Power BI refresh documentation matches the live source contract.

This is a small documentation regression gate. It compares the canonical
14-file list used by ``prepare_powerbi_refresh.py`` with the architecture
runbook, the PBIP/PbixProj Power Query references and the committed fixture.
It prevents a stale filename in a handoff document from breaking a future
data-only replacement.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


def add(checks: list[dict[str, Any]], name: str, passed: bool, detail: str) -> None:
    checks.append({"name": name, "status": "PASS" if passed else "FAIL", "detail": detail})


def canonical_files(refresh_script: Path) -> list[str]:
    text = refresh_script.read_text(encoding="utf-8")
    match = re.search(r"^FILES\s*=\s*\((.*?)^\)\s*$", text, re.MULTILINE | re.DOTALL)
    if not match:
        raise ValueError("could not locate FILES tuple in prepare_powerbi_refresh.py")
    values = re.findall(r'"([^"\r\n]+\.csv)"', match.group(1))
    if len(values) != len(set(values)):
        raise ValueError("canonical FILES tuple contains duplicate names")
    return values


def architecture_files(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    marker = "Required CSV files:"
    if marker not in text:
        return []
    section = text.split(marker, 1)[1]
    section = section.split("The Calendar table", 1)[0]
    return re.findall(r"^\s*-\s*`([^`\r\n]+\.csv)`\s*$", section, re.MULTILINE)


def query_files(roots: list[Path]) -> list[str]:
    found: list[str] = []
    for root in roots:
        if not root.is_dir():
            continue
        for path in root.rglob("*"):
            if path.suffix.lower() not in {".tmdl", ".m"}:
                continue
            text = path.read_text(encoding="utf-8", errors="replace")
            for value in re.findall(r'File\.Contents\(DataRoot\s*&\s*"([^"]+\.csv)"', text):
                found.append(value.lstrip("\\/"))
    return found


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=Path("."))
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    root = args.repo_root.resolve()
    checks: list[dict[str, Any]] = []
    try:
        expected = canonical_files(root / "scripts" / "prepare_powerbi_refresh.py")
        add(checks, "canonical contract has 14 files", len(expected) == 14, f"{len(expected)} files")
    except (OSError, ValueError) as exc:
        expected = []
        add(checks, "canonical contract can be parsed", False, str(exc))

    architecture_path = root / "docs" / "POWER_BI_REFRESH_ARCHITECTURE.md"
    try:
        documented = architecture_files(architecture_path)
        add(checks, "architecture runbook lists exactly the canonical files", documented == expected, ", ".join(documented))
    except OSError as exc:
        documented = []
        add(checks, "architecture runbook can be read", False, str(exc))

    representation_roots = [
        root / "powerbi" / "native" / "VNFinance_PBIP",
        root / "powerbi" / "native" / "VNFinance_PbixProj",
    ]
    representation_refs = [query_files([path]) for path in representation_roots]
    referenced = [value for values in representation_refs for value in values]
    referenced_set = sorted(set(referenced))
    add(checks, "Power Query references exactly the canonical files", referenced_set == sorted(expected), ", ".join(referenced_set))
    add(
        checks,
        "PBIP and PbixProj query representations agree",
        all(sorted(values) == sorted(expected) for values in representation_refs),
        "; ".join(f"{path.name}: {len(values)}" for path, values in zip(representation_roots, representation_refs)),
    )
    add(
        checks,
        "Each Power Query representation has unique DataRoot references",
        all(len(values) == len(set(values)) for values in representation_refs),
        "; ".join(f"{path.name}: {len(values)} refs" for path, values in zip(representation_roots, representation_refs)),
    )

    data_dir = root / "powerbi" / "data" / "current"
    actual = sorted(path.name for path in data_dir.glob("*.csv")) if data_dir.is_dir() else []
    add(checks, "committed fixture contains every canonical file", set(expected) <= set(actual), ", ".join(sorted(set(expected) - set(actual))))

    failed = [check["name"] for check in checks if check["status"] != "PASS"]
    payload = {
        "status": "PASS" if not failed else "FAIL",
        "checks": len(checks),
        "passed": len(checks) - len(failed),
        "failed": failed,
        "canonical_files": expected,
        "architecture_files": documented,
        "query_files": referenced,
        "fixture_csv_files": actual,
        "evidence_boundary": "This validates the source/document contract only; it does not prove Desktop refresh or realtime APR.",
        "evidence": checks,
    }
    print(json.dumps(payload, indent=2))
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
