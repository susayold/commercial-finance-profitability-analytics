#!/usr/bin/env python3
"""Run the non-Power-BI closure gate and write a shareable QA package."""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TODAY = "2026-08-31"


def run(label: str, command: list[str]) -> dict:
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
    return {"id": label, "status": "PASS" if result.returncode == 0 else "FAIL", "stdout": result.stdout[-1200:], "stderr": result.stderr[-1200:]}


def main() -> int:
    checks = [
        run("SF", ["node", "scripts/validate_sales_fact_economic_integrity.mjs"]),
        run("SC", ["node", "scripts/validate_scenario_metric_consistency.mjs"]),
        run("PUB", ["node", "scripts/validate_public_metric_consistency.mjs"]),
        run("XART", ["node", "scripts/validate_cross_artifact_finance_consistency.mjs"]),
        run("MC", ["node", "scripts/validate_monte_carlo_risk_overlay.mjs", "reports/MONTE_CARLO_RISK_OVERLAY_2026-08-30.md", "data/monte_carlo_risk_overlay_2026-08-30.csv"]),
    ]
    required = [
        "data/governance/finance_metric_registry.csv",
        "data/governance/exported_metric_snapshot.csv",
        "data/governance/claim_registry.csv",
        "schemas/unit_contract.csv",
        "docs/ARCHITECTURE_NON_POWERBI.md",
        "RECRUITER_START_HERE.md",
        ".gitattributes",
    ]
    for item in required:
        checks.append({"id": f"FILE:{item}", "status": "PASS" if (ROOT / item).exists() else "FAIL", "stdout": "", "stderr": ""})
    failures = [check for check in checks if check["status"] != "PASS"]
    gate = {
        "status": "PASS" if not failures else "FAIL",
        "generated_on": TODAY,
        "scope": "non_powerbi_finance_analyst_closure",
        "checks": [{"id": c["id"], "status": c["status"]} for c in checks],
        "open_external_gates": [
            {"gate": "Gate A", "description": "Genuine internal pre-close forecast snapshot and post-close actuals are required before claiming live forecast accuracy."},
            {"gate": "Gate B", "description": "Native Power BI Desktop QA and production Service refresh evidence remain external to this non-Power-BI release."},
        ],
    }
    reports = ROOT / "reports"
    reports.mkdir(exist_ok=True)
    (reports / f"NON_POWERBI_RELEASE_GATE_{TODAY}.json").write_text(json.dumps(gate, indent=2), encoding="utf-8")
    passed = len(checks) - len(failures)
    (reports / f"NON_POWERBI_FINAL_QA_{TODAY}.md").write_text(
        f"# Non-Power-BI Final QA — {TODAY}\n\n"
        f"**Overall status: {'PASS' if not failures else 'FAIL'}** ({passed}/{len(checks)} checks passed)\n\n"
        "## What is closed\n\n"
        "- Sales_Fact economic integrity and dimensional keys are validator-checked.\n"
        "- Scenario revenue, gross profit, controllable OPEX, EBITDA proxy, margin and CCC reconcile to one canonical snapshot.\n"
        "- MCH ROE uses the approved average-equity denominator across FY2016–FY2025.\n"
        "- Website, MBR, CFO memo and CV values are checked against the exported snapshot.\n"
        "- Synthetic customer profitability, Monte Carlo and M&A modules retain explicit evidence boundaries.\n\n"
        "## External gates (not inferred as closed)\n\n"
        "- Gate A: provide an approved internal pre-close forecast snapshot plus post-close actuals to calculate live Bias/WAPE.\n"
        "- Gate B: execute native Power BI Desktop QA and production Service refresh acceptance.\n",
        encoding="utf-8",
    )
    (reports / f"NON_POWERBI_CHANGELOG_{TODAY}.md").write_text(
        f"# Non-Power-BI Closure Changelog — {TODAY}\n\n"
        "- Rebuilt final_v1 forecast/OPEX calculations so the EBITDA proxy is mathematically consistent.\n"
        "- Added metric registry, unit contract, artifact map, claim registry and exported metric snapshot.\n"
        "- Added Sales_Fact, scenario, public-metric and cross-artifact executable validators.\n"
        "- Added architecture diagram, recruiter start page and line-ending governance.\n"
        "- Clarified synthetic/rehearsal boundaries for customer profitability and M&A modules.\n",
        encoding="utf-8",
    )
    (reports / f"KNOWN_LIMITATIONS_NON_POWERBI_{TODAY}.md").write_text(
        f"# Known Limitations — {TODAY}\n\n"
        "1. VietNova operating data is deterministic synthetic data; it cannot support claims of employer impact.\n"
        "2. EBITDA is an explicit proxy (`gross profit − controllable OPEX`), not reported statutory EBITDA.\n"
        "3. Monte Carlo outputs are seeded scenario distributions, not probabilistic estimates calibrated to live history.\n"
        "4. M&A outputs are a synthetic screening rehearsal; confirmatory diligence, financing and tax review are absent.\n"
        "5. Gate A and Gate B remain external evidence gates as documented above.\n",
        encoding="utf-8",
    )
    print(json.dumps(gate, indent=2))
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
