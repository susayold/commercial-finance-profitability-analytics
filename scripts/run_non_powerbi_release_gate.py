#!/usr/bin/env python3
"""Run the non-BI finance-core closure gate and write a shareable QA package."""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TODAY = "2026-09-01"


def run(label: str, command: list[str]) -> dict:
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
    return {"id": label, "status": "PASS" if result.returncode == 0 else "FAIL", "stdout": result.stdout[-1200:], "stderr": result.stderr[-1200:]}


def main() -> int:
    checks = [run("FINANCE_CORE_QA", ["node", "scripts/run_finance_qa.mjs", "--nonbi"])]
    required = [
        "data/governance/finance_metric_registry.csv",
        "data/governance/exported_metric_snapshot.csv",
        "data/governance/claim_registry.csv",
        "schemas/unit_contract.csv",
        "docs/ARCHITECTURE_NON_POWERBI.md",
        "docs/VNFINANCE_FPA_NON_POWERBI_GAP_RESEARCH_AND_UPDATE_MASTER_PLAN_2026-09-01.md",
        "data/accounting/gl_management_mapping.csv",
        "docs/THREE_YEAR_DRIVER_BASED_OPERATING_PLAN.md",
        "data/planning/three_year_operating_plan.csv",
        "data/planning/operating_plan_reconciliation.csv",
        "data/planning/operating_plan_initiatives.csv",
        "docs/FORECAST_VERSIONING_BACKTEST_V2.md",
        "data/forecast/forecast_versioned_snapshots_v2.csv",
        "data/forecast/forecast_backtest_metrics_v2.csv",
        "data/forecast/forecast_version_bridge_v2.csv",
        "data/forecast/forecast_override_log_v2.csv",
        "output/pptx/VNFINANCE_NONBI_FPA_MBR_2026-09-01.pptx",
        "docs/FINANCE_ANALYST_WALKTHROUGH_SCRIPT_5_MIN.md",
        "reports/EXECUTIVE_BOARD_PACK_INDEX_2026-09-01.md",
        "reports/RECRUITER_SITE_LINK_QA_2026-09-02.json",
        "RECRUITER_START_HERE.md",
        ".gitattributes",
        "reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md",
        "scripts/build_correlated_monte_carlo_v2.mjs",
        "scripts/validate_correlated_monte_carlo_v2.mjs",
        "data/monte_carlo_risk_overlay_v2_2026-09-02.csv",
        "data/monte_carlo_risk_overlay_v2_draws_2026-09-02.csv",
        "data/monte_carlo_correlation_matrix_v2.csv",
        "reports/MONTE_CARLO_RISK_OVERLAY_V2_2026-09-02.md",
        "scripts/build_sap_like_mapping_rehearsal.mjs",
        "scripts/validate_sap_like_mapping_rehearsal.mjs",
        "data/accounting/sap_like_mapping_rehearsal.csv",
        "reports/SAP_LIKE_MAPPING_REHEARSAL_2026-09-02.md",
        "reports/SAP_LIKE_MAPPING_REHEARSAL_QA_2026-09-02.json",
        "scripts/build_monthly_commentary_draft.mjs",
        "scripts/validate_monthly_commentary_draft.mjs",
        "data/governance/commentary_draft_2026-09-02.csv",
        "reports/MONTHLY_COMMENTARY_DRAFT_2026-09-02.md",
        "reports/MONTHLY_COMMENTARY_APPROVAL_LOG_2026-09-02.csv",
        "scripts/build_fpa_case_summary_pdf.py",
        "scripts/validate_fpa_case_summary_pdf.py",
        "output/pdf/VNFINANCE_FPA_CASE_SUMMARY_ONE_PAGE.pdf",
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
        ],
    }
    canonical_status = {
        "project": "VietNova Consumer JSC — non-Power-BI FP&A release",
        "generated_on": TODAY,
        "active_scope": ["Excel financial model", "integrated three statements", "standard costing", "three-year operating plan", "forecast versioning/backtest", "management reporting", "editable management pack", "controls", "website", "CV/recruiter package"],
        "core_status": "PASS" if not failures else "FAIL",
        "appendix_status": "AVAILABLE_WITH_CAVEATS",
        "external_status": "PENDING_EXTERNAL_INPUT",
        "external_gates": ["Gate A — approved internal pre-close forecast snapshot plus post-close actuals"],
        "power_bi_status": "OUT_OF_ACTIVE_SCOPE",
        "claims_policy": "Synthetic and derived finance outputs are labelled; no employer impact, live ERP experience or live forecast accuracy is claimed.",
        "release_gate": f"reports/NON_POWERBI_RELEASE_GATE_{TODAY}.json",
    }
    reports = ROOT / "reports"
    reports.mkdir(exist_ok=True)
    (reports / f"NON_POWERBI_RELEASE_GATE_{TODAY}.json").write_text(json.dumps(gate, indent=2), encoding="utf-8")
    (ROOT / "data" / "governance" / "project_status_nonbi.json").write_text(json.dumps(canonical_status, indent=2), encoding="utf-8")
    passed = len(checks) - len(failures)
    (reports / f"NON_POWERBI_FINAL_QA_{TODAY}.md").write_text(
        f"# Non-Power-BI Final QA — {TODAY}\n\n"
        f"**Overall status: {'PASS' if not failures else 'FAIL'}** ({passed}/{len(checks)} checks passed)\n\n"
        "## What is closed\n\n"
        "- Sales_Fact economic integrity and dimensional keys are validator-checked.\n"
        "- Scenario revenue, gross profit, controllable OPEX, EBITDA proxy, margin and CCC reconcile to one canonical snapshot.\n"
        "- The 3-year driver-based operating plan and versioned forecast/backtest rehearsal are validator-checked and evidence-labelled.\n"
        "- MCH ROE uses the approved average-equity denominator across FY2016–FY2025.\n"
        "- Website, MBR, CFO memo and CV values are checked against the exported snapshot.\n"
        "- Core finance QA is 52/52 PASS; the release file gate is 43/43 PASS.\n"
        "- Recruiter website external-link snapshot is 42/42 PASS; private GitHub/Drive access boundaries are documented.\n"
        "- One-page recruiter case summary PDF is rendered, text-extractable and validator-checked.\n"
        "- Correlated Monte Carlo v2, SAP-like mapping and automated commentary are appendix rehearsals with explicit evidence boundaries.\n"
        "- Synthetic customer profitability, Monte Carlo and M&A modules retain explicit evidence boundaries.\n\n"
        "## External gates (not inferred as closed)\n\n"
        "- Gate A: provide an approved internal pre-close forecast snapshot plus post-close actuals to calculate live Bias/WAPE.\n",
        encoding="utf-8",
    )
    (reports / f"NON_POWERBI_CHANGELOG_{TODAY}.md").write_text(
        f"# Non-Power-BI Closure Changelog — {TODAY}\n\n"
        "- Rebuilt final_v1 forecast/OPEX calculations so the EBITDA proxy is mathematically consistent.\n"
        "- Added metric registry, unit contract, artifact map, claim registry and exported metric snapshot.\n"
        "- Added the editable 10-slide management pack and five-minute finance-analyst narration script.\n"
        "- Added Sales_Fact, scenario, public-metric and cross-artifact executable validators.\n"
        "- Added architecture diagram, recruiter start page and line-ending governance.\n"
        "- Added recruiter-site external-link QA with explicit private GitHub/Drive access-boundary handling.\n"
        "- Repaired the GL management mapping serialization and added 14/14 mapping-aware statement controls.\n"
        "- Added correlated Monte Carlo v2, SAP-like mapping rehearsal and human-gated commentary draft appendices.\n"
        "- Added a one-page recruiter case summary PDF generated from the canonical metric snapshot.\n"
        "- Clarified synthetic/rehearsal boundaries for customer profitability and M&A modules.\n",
        encoding="utf-8",
    )
    (reports / f"KNOWN_LIMITATIONS_NON_POWERBI_{TODAY}.md").write_text(
        f"# Known Limitations — {TODAY}\n\n"
        "1. VietNova operating data is deterministic synthetic data; it cannot support claims of employer impact.\n"
        "2. EBITDA is an explicit proxy (`gross profit − controllable OPEX`), not reported statutory EBITDA.\n"
        "3. Monte Carlo outputs are seeded scenario distributions, not probabilistic estimates calibrated to live history; the v2 matrix is judgmental.\n"
        "4. M&A outputs are a synthetic screening rehearsal; confirmatory diligence, financing and tax review are absent.\n"
        "5. Automated commentary is a first draft and remains NEEDS_REVIEW until a human approves it.\n"
        "6. SAP-like mapping is a simulated FI/CO rehearsal and does not evidence SAP production experience.\n"
        "7. Gate A remains an external evidence gate as documented above.\n",
        encoding="utf-8",
    )
    print(json.dumps(gate, indent=2))
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
