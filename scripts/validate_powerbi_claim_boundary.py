#!/usr/bin/env python3
"""Fail closed if the Power BI release overstates realtime/native evidence."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=Path("."))
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    root = args.repo_root.resolve()
    checks: list[tuple[str, bool, str]] = []

    def add(name: str, passed: bool, detail: str = "") -> None:
        checks.append((name, bool(passed), detail))

    readiness_path = root / "powerbi" / "DIRECTQUERY_READINESS.json"
    manifest_path = root / "powerbi" / "PBIP_SOURCE_MANIFEST.json"
    semantic_root = root / "powerbi" / "native" / "VNFinance_PBIP" / "VNFinance_Commercial_Finance.SemanticModel"
    runbook_path = root / "powerbi" / "POWER_BI_DESKTOP_RUNBOOK.md"
    release_path = root / "reports" / "POWER_BI_REFRESHABLE_RELEASE_2026-08-30.md"
    boundary_path = root / "powerbi" / "POWER_BI_NATIVE_BINARY_BOUNDARY.md"

    try:
        readiness = json.loads(readiness_path.read_text(encoding="utf-8"))
        add("DirectQuery readiness JSON parses", True)
    except (OSError, json.JSONDecodeError) as exc:
        readiness = {}
        add("DirectQuery readiness JSON parses", False, str(exc))

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        add("PBIP source manifest parses", True)
    except (OSError, json.JSONDecodeError) as exc:
        manifest = {}
        add("PBIP source manifest parses", False, str(exc))

    add(
        "Current mode is explicitly Import replace-and-refresh",
        readiness.get("current_report_mode") == "Import_replace_and_refresh",
        str(readiness.get("current_report_mode")),
    )
    add(
        "Realtime claim is not promoted without external evidence",
        readiness.get("realtime_claim", {}).get("status") != "PASS",
        str(readiness.get("realtime_claim", {}).get("status")),
    )
    add(
        "Manifest keeps native PBIX claim pending",
        manifest.get("release_artifacts", {}).get("native_desktop_qa") == "PENDING"
        and manifest.get("evidence_policy", {}).get("native_pbix_claimed") is False,
        "native_desktop_qa=%s; native_pbix_claimed=%s"
        % (
            manifest.get("release_artifacts", {}).get("native_desktop_qa"),
            manifest.get("evidence_policy", {}).get("native_pbix_claimed"),
        ),
    )

    tmdl_files = sorted((semantic_root / "definition" / "tables").glob("*.tmdl"))
    import_count = 0
    data_root_refs = 0
    for path in tmdl_files:
        text = path.read_text(encoding="utf-8")
        import_count += text.count("mode: import")
        data_root_refs += text.count("File.Contents(DataRoot &")
    add("All CSV partitions remain Import mode", import_count == 15, str(import_count))
    add("All 14 CSV partitions use DataRoot", data_root_refs == 14, str(data_root_refs))

    runbook = runbook_path.read_text(encoding="utf-8") if runbook_path.exists() else ""
    release = release_path.read_text(encoding="utf-8") if release_path.exists() else ""
    add("Runbook disclaims CSV second-level realtime", "not second-level realtime" in runbook)
    add("Runbook defines Automatic Page Refresh migration", "Automatic Page Refresh" in runbook)
    add("Release disclaims native PBIX", "No native `.pbix` is claimed" in release)
    boundary = boundary_path.read_text(encoding="utf-8") if boundary_path.exists() else ""
    add("Native binary boundary note exists", boundary_path.is_file() and "pbi-tools" in boundary and "Power BI Desktop" in boundary)

    failed = [name for name, passed, _ in checks if not passed]
    payload = {
        "status": "PASS" if not failed else "FAIL",
        "checks": len(checks),
        "passed": len(checks) - len(failed),
        "failed": failed,
        "evidence": [{"name": name, "pass": passed, "detail": detail} for name, passed, detail in checks],
    }
    print(json.dumps(payload, indent=2))
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
