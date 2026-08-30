#!/usr/bin/env python3
"""Validate the repository's GitHub Actions -> Power BI Service refresh contract.

This is a static contract check only. It never contacts GitHub or Power BI and
never reads credential values. The check ensures that a data-only commit can
reach the intended validation and Service-refresh branch when the operator has
configured the required repository secrets.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


def add(checks: list[dict[str, Any]], name: str, passed: bool, detail: str) -> None:
    checks.append({"name": name, "status": "PASS" if passed else "FAIL", "detail": detail})


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=Path("."))
    parser.add_argument("--workflow", type=Path, default=None)
    parser.add_argument("--report", type=Path, default=None)
    args = parser.parse_args()

    root = args.repo_root.resolve()
    workflow = (args.workflow or root / ".github" / "workflows" / "powerbi-service-refresh.yml").resolve()
    checks: list[dict[str, Any]] = []
    if not workflow.is_file():
        add(checks, "Service refresh workflow exists", False, str(workflow))
        payload = {
            "status": "FAIL",
            "checks": len(checks),
            "passed": 0,
            "failed": [item["name"] for item in checks],
            "workflow": str(workflow),
            "evidence_boundary": "Static workflow contract only; no GitHub or Power BI call was made.",
            "evidence": checks,
        }
        print(json.dumps(payload, indent=2))
        return 1

    text = workflow.read_text(encoding="utf-8")
    add(checks, "Service refresh workflow exists", True, str(workflow))
    add(checks, "Manual dispatch is available", bool(re.search(r"(?m)^\s*workflow_dispatch:\s*$", text)), "workflow_dispatch")
    add(checks, "Push trigger targets main", bool(re.search(r"(?ms)^\s*push:\s*.*?^\s*branches:\s*\n\s*-\s*main\s*$", text)), "main branch")
    add(checks, "Data-only push path is wired", '"powerbi/data/current/**"' in text, "powerbi/data/current/**")
    add(checks, "Refresh script changes trigger workflow", '"scripts/prepare_powerbi_refresh.py"' in text and '"scripts/trigger_powerbi_service_refresh.py"' in text, "prepare + trigger scripts")
    add(checks, "Input validation runs before refresh", "python scripts/validate_vietnova_data.py" in text and "python scripts/validate_powerbi_input_contract.py" in text, "two validators")

    required_secrets = ("PBI_WORKSPACE_ID", "PBI_DATASET_ID", "PBI_ACCESS_TOKEN")
    missing_secrets = [name for name in required_secrets if f"secrets.{name}" not in text]
    add(checks, "Required GitHub secrets are declared", not missing_secrets, "missing=" + ",".join(missing_secrets))
    add(checks, "Workspace and dataset IDs reach the refresh CLI", "--workspace-id \"$PBI_WORKSPACE_ID\"" in text and "--dataset-id \"$PBI_DATASET_ID\"" in text, "ID wiring")
    add(checks, "Apply flag is explicit", "--apply" in text, "service apply is opt-in")
    add(checks, "Refresh evidence output is JSON", 'powerbi_service_refresh_apply.json' in text and 'powerbi_service_refresh_input_contract.md' in text, "bounded evidence artifacts")
    add(checks, "Missing secrets produce SKIPPED without a service call", '"status": "SKIPPED"' in text and "SERVICE_REFRESH_SKIPPED" in text and "else\n            python scripts/trigger_powerbi_service_refresh.py" in text, "fail-closed secret branch")
    add(checks, "No credential literals are committed", not bool(re.search(r"(?i)(Bearer\s+[A-Za-z0-9._~-]{20,}|PBI_ACCESS_TOKEN\s*=\s*['\"][^$\s])", text)), "secret placeholders only")

    failed = [item["name"] for item in checks if item["status"] != "PASS"]
    payload = {
        "status": "PASS" if not failed else "FAIL",
        "checks": len(checks),
        "passed": len(checks) - len(failed),
        "failed": failed,
        "workflow": str(workflow),
        "evidence_boundary": "Static workflow contract only; no GitHub or Power BI call was made.",
        "evidence": checks,
    }
    print(json.dumps(payload, indent=2))
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
