#!/usr/bin/env python3
"""Run the deterministic Power BI release gates in one fail-closed command.

The command aggregates the source-contract, package-coherence, refresh-dry-run
and claim-boundary validators. On Windows it also runs the Desktop host
preflight. A missing Desktop or cloud database is reported as
``EXTERNAL_PENDING`` rather than being mistaken for a passing native/realtime
release. No refresh, database load or Service API call is performed.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def json_objects(text: str) -> list[dict[str, Any]]:
    decoder = json.JSONDecoder()
    objects: list[dict[str, Any]] = []
    for index, character in enumerate(text):
        if character != "{":
            continue
        try:
            value, _ = decoder.raw_decode(text[index:])
        except json.JSONDecodeError:
            continue
        if isinstance(value, dict) and "status" in value:
            objects.append(value)
    return objects


def status_payload(stdout: str, stderr: str, returncode: int, *, preferred: str = "") -> dict[str, Any]:
    objects = json_objects(stdout)
    selected = None
    if preferred:
        for item in reversed(objects):
            if preferred in item:
                selected = item
                break
    if selected is None and objects:
        # Validators can embed nested status objects in their evidence. The
        # first top-level object is the command's authoritative result; taking
        # the last object would incorrectly select a nested NOT_REQUESTED row
        # from the finance refresh orchestrator.
        selected = objects[0]
    if selected is None:
        selected = {"status": "FAIL", "error": "command did not emit a status JSON object"}
    result = {
        "status": str(selected.get("status", "FAIL")),
        "exit_code": returncode,
        "details": selected,
    }
    if returncode != 0 and stderr:
        result["stderr_tail"] = stderr[-1200:]
    return result


def run_command(command: list[str], root: Path, *, preferred: str = "") -> dict[str, Any]:
    completed = subprocess.run(command, cwd=root, capture_output=True, text=True, check=False, env=os.environ.copy())
    return status_payload(completed.stdout, completed.stderr, completed.returncode, preferred=preferred)


def python_command(root: Path, script: str, *args: str) -> list[str]:
    return [sys.executable, str(root / script), *args]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--input-dir", type=Path, default=None)
    parser.add_argument("--data-root", type=Path, default=None)
    parser.add_argument("--desktop-path", type=Path, default=None)
    parser.add_argument("--report", type=Path, required=True, help="JSON evidence output; must end in .json")
    args = parser.parse_args()

    # The release gate writes a machine-readable payload.  Requiring a JSON
    # suffix prevents a rehearsal from silently overwriting a Markdown release
    # record when an operator passes the wrong path.
    if args.report.suffix.lower() != ".json":
        parser.error("--report must point to a .json evidence file")

    root = args.repo_root.resolve()
    input_dir = (args.input_dir or root / "powerbi" / "data" / "current").resolve()
    data_root = (args.data_root or root / "powerbi" / "data" / "current").resolve()
    started = datetime.now(timezone.utc).isoformat()
    stages: dict[str, dict[str, Any]] = {}

    with tempfile.TemporaryDirectory(prefix="vnfinance_release_gate_") as temp_dir:
        temp = Path(temp_dir)
        input_report = temp / "input_contract.json"
        package_report = temp / "package.json"
        coherence_report = temp / "coherence.md"
        claim_report = temp / "claim.json"
        refresh_report = temp / "refresh.json"

        stages["input_contract"] = run_command(
            python_command(root, "scripts/validate_powerbi_input_contract.py", "--input-dir", str(input_dir), "--report", str(input_report)),
            root,
        )
        stages["refresh_dry_run"] = run_command(
            python_command(
                root,
                "scripts/run_finance_refresh.py",
                "--input-dir",
                str(input_dir),
                "--data-root",
                str(data_root),
                "--report",
                str(refresh_report),
            ),
            root,
        )
        stages["package"] = run_command(
            python_command(
                root,
                "scripts/validate_powerbi_refreshable_project.py",
                "--pbit",
                str(root / "powerbi" / "releases" / "Commercial_Finance_Profitability_Analytics.pbit"),
                "--pbip",
                str(root / "powerbi" / "native" / "VNFinance_PBIP"),
                "--pbixproj",
                str(root / "powerbi" / "native" / "VNFinance_PbixProj"),
                "--data-dir",
                str(input_dir),
                "--report",
                str(package_report),
            ),
            root,
        )
        stages["artifact_coherence"] = run_command(
            python_command(root, "scripts/validate_powerbi_artifact_coherence.py", "--report", str(coherence_report)),
            root,
        )
        stages["claim_boundary"] = run_command(
            python_command(root, "scripts/validate_powerbi_claim_boundary.py", "--repo-root", str(root), "--report", str(claim_report)),
            root,
        )
        stages["directquery_mapping"] = run_command(
            python_command(root, "scripts/validate_directquery_mapping.py"),
            root,
        )
        stages["service_workflow_contract"] = run_command(
            python_command(root, "scripts/validate_powerbi_service_workflow.py"),
            root,
        )

        preflight = root / "scripts" / "powerbi_desktop_preflight.ps1"
        powershell = shutil.which("powershell") or shutil.which("pwsh")
        if os.name != "nt" or not powershell or not preflight.is_file():
            stages["desktop_preflight"] = {
                "status": "EXTERNAL_PENDING",
                "exit_code": None,
                "details": {"status": "EXTERNAL_PENDING", "reason": "Windows PowerShell/Desktop preflight is unavailable on this host."},
            }
        else:
            command = [powershell, "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(preflight), "-ProjectRoot", str(root), "-DataRoot", str(input_dir)]
            desktop_path = args.desktop_path
            if desktop_path:
                command.extend(["-DesktopPath", str(desktop_path)])
            result = run_command(command, root, preferred="desktop")
            if result["status"] == "PENDING":
                result["status"] = "EXTERNAL_PENDING"
            stages["desktop_preflight"] = result

    deterministic_names = (
        "input_contract",
        "refresh_dry_run",
        "package",
        "artifact_coherence",
        "claim_boundary",
        "directquery_mapping",
        "service_workflow_contract",
    )
    deterministic_ok = all(stages[name]["status"] == "PASS" and stages[name]["exit_code"] == 0 for name in deterministic_names)
    desktop_ok = stages["desktop_preflight"]["status"] == "PASS" and stages["desktop_preflight"]["exit_code"] == 0
    if not deterministic_ok:
        overall = "FAIL"
    elif desktop_ok:
        overall = "PASS"
    else:
        overall = "PASS_WITH_EXTERNAL_PENDING"

    result = {
        "status": overall,
        "started_at_utc": started,
        "completed_at_utc": datetime.now(timezone.utc).isoformat(),
        "repo_root": str(root),
        "input_dir": str(input_dir),
        "data_root": str(data_root),
        "stages": stages,
        "claim_boundary": "This command validates the refreshable package; it never proves native PBIX rendering or production DirectQuery/APR realtime.",
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0 if overall in {"PASS", "PASS_WITH_EXTERNAL_PENDING"} else 1


if __name__ == "__main__":
    raise SystemExit(main())
