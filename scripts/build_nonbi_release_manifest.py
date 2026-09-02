#!/usr/bin/env python3
"""Build the human-readable non-Power-BI FP&A release manifest."""
from __future__ import annotations

import hashlib
import json
import subprocess
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TODAY = "2026-09-02"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def git_head() -> str:
    return subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()


def main() -> None:
    snapshot_path = ROOT / "data" / "governance" / "recruiter_metric_snapshot.json"
    snapshot = json.loads(snapshot_path.read_text(encoding="utf-8"))
    identity = json.loads((ROOT / "data" / "governance" / "release_identity_nonbi.json").read_text(encoding="utf-8"))
    files = [
        "data/governance/release_identity_nonbi.json",
        "reports/GITHUB_PUBLIC_SAFE_SCAN_2026-09-02.md",
        "data/operating_inputs/manifest.json",
        "data/finance_model/final_v1/source_manifest.csv",
        "data/governance/finance_metric_registry.csv",
        "data/governance/exported_metric_snapshot.csv",
        "data/governance/recruiter_metric_snapshot.json",
        "data/financial_statements/monthly_income_statement.csv",
        "data/financial_statements/monthly_balance_sheet.csv",
        "data/financial_statements/monthly_cash_flow.csv",
        "data/accounting/trial_balance_monthly.csv",
        "data/accounting/gl_management_mapping.csv",
        "data/costing/cost_variance_monthly.csv",
        "data/forecast/forecast_versioned_snapshots_v2.csv",
        "data/planning/three_year_operating_plan.csv",
        "output/pptx/VNFINANCE_NONBI_FPA_MBR_2026-09-01.pptx",
        "output/pdf/VNFINANCE_FPA_CASE_SUMMARY_ONE_PAGE.pdf",
        "reports/NON_POWERBI_FINAL_QA_2026-09-01.md",
        "reports/NON_POWERBI_RELEASE_GATE_2026-09-01.json",
        "reports/RECRUITER_SITE_LINK_QA_2026-09-02.json",
        "docs/FINANCE_ANALYST_CV_ONE_PAGE_V3.md",
        "docs/CANDIDATE_APPLICATION_INTAKE_AND_CV_BUILD_PACK.md",
        "docs/CV_ROLE_VARIANTS_V2.md",
        "docs/CV_EVIDENCE_MAP.md",
        "docs/FINANCE_ANALYST_CV_BULLET_BANK_2026-08-30.md",
        "docs/FINANCE_ANALYST_INTERVIEW_TALK_TRACK.md",
        "docs/INTERVIEW_WALKTHROUGH_FINANCE_ANALYST_2026-08-30.md",
        "reports/CV_V3_QA.md",
        "scripts/validate_cv_v3.mjs",
        "output/pdf/FINANCE_ANALYST_CV_ONE_PAGE_V3.pdf",
        "scripts/render_cv_v3_pdf.py",
        "scripts/validate_cv_v3_pdf.py",
        "reports/FINANCE_ANALYST_CV_V3_PDF_QA.md",
        "data/governance/candidate_profile_intake.json",
        "scripts/validate_candidate_profile.mjs",
        "reports/CANDIDATE_PROFILE_INTAKE_QA_2026-09-02.md",
        "data/governance/recording_handoff.json",
        "scripts/validate_recording_handoff.mjs",
        "reports/RECORDING_HANDOFF_QA_2026-09-02.md",
        "reports/NON_POWERBI_HANDOFF_INDEX_2026-09-01.md",
        "reports/BOSS_HANDOFF_PACK_2026-08-31.md",
        "docs/DEFINITION_OF_DONE_AUDIT.md",
        "scripts/validate_nonbi_scope_boundary.mjs",
        "reports/NONBI_SCOPE_BOUNDARY_QA_2026-09-02.json",
    ]
    inventory = []
    for relative in files:
        path = ROOT / relative
        if path.exists():
            inventory.append({"path": relative, "bytes": path.stat().st_size, "sha256": sha256(path)})

    report = ROOT / "reports" / f"NONBI_RELEASE_MANIFEST_{TODAY}.md"
    lines = [
        f"# VNFinance non-Power-BI FP&A release manifest — {TODAY}",
        "",
        "> Scope lock: this is the active FP&A / Financial Analyst release. Power BI is archived and excluded from acceptance.",
        "",
        "## Release identity",
        "",
        f"- Release date: **{TODAY}**",
        f"- Release name: **{identity['release_name']}**",
        f"- Release tag: **{identity['release_tag'] or 'PENDING_INPUT_GATED_CLOSURE'}**",
        f"- Release status: **{identity['release_status']}**",
        f"- Payload commit at manifest generation: `{git_head()}`",
        f"- Current period: **{snapshot['current_period']}**",
        f"- Operating input: `data/operating_inputs/manifest.json` (seed `{json.loads((ROOT / 'data' / 'operating_inputs' / 'manifest.json').read_text())['seed']}`, 36 months)",
        "- Evidence: operating data is SIMULATED/DERIVED; public-company data is separate OBSERVED/CALCULATED_PUBLIC; valuation/M&A/Monte Carlo are SYNTHETIC_REHEARSAL.",
        "- Recruiter website: Sites **v26**, source commit `f1d0c6fcc180bcc5a033062b0a49b1d7816202bb`, private production deployment.",
        "- GitHub policy: **PUBLIC_SAFE_PORTFOLIO_REPOSITORY**; private raw filings remain in Drive.",
        "",
        "## Quality gates",
        "",
        f"- Core non-BI QA: **{snapshot['qa']['expected_core_checks']['passed']}/{snapshot['qa']['expected_core_checks']['total']} PASS**.",
        f"- Release file gate: **{snapshot['qa']['expected_release_checks']['passed']}/{snapshot['qa']['expected_release_checks']['total']} PASS**.",
        f"- Recruiter website external-link QA: **{snapshot['qa']['recruiter_link_checks']['passed']}/{snapshot['qa']['recruiter_link_checks']['total']} PASS**.",
        "- Gate A: **PENDING_EXTERNAL_INPUT** — an approved internal pre-close forecast snapshot plus post-close actuals is still required before claiming live forecast accuracy.",
        "- Candidate personalization: **INPUT-GATED** — replace CV placeholders and add genuine identity/experience before submission.",
        "",
        "## Active artifact inventory",
        "",
        "| Artifact | Purpose | Evidence boundary |",
        "|---|---|---|",
        "| `data/finance_model/final_v1/` | Controlled finance schedules | SIMULATED / DERIVED |",
        "| `data/financial_statements/` + `data/accounting/` | Linked three statements, TB, GL mapping and close controls | SIMULATED / DERIVED |",
        "| `data/costing/` + `data/macros/` | Standard costing, reserve policy and macro cutoff | SIMULATED / ASSUMPTION |",
        "| `data/planning/` + `data/forecast/` | Three-year plan and forecast v2/backtest rehearsal | SIMULATED / DERIVED |",
        "| `output/pptx/VNFINANCE_NONBI_FPA_MBR_2026-09-01.pptx` | Editable management pack | Derived case output |",
        "| `output/pdf/VNFINANCE_FPA_CASE_SUMMARY_ONE_PAGE.pdf` | One-page recruiter summary | Derived case output |",
        "| `docs/*CV*` + interview scripts | Recruiter positioning and walkthrough package | Evidence-labelled; candidate facts remain input-gated |",
        "| `output/pdf/FINANCE_ANALYST_CV_ONE_PAGE_V3.pdf` | One-page finance-first CV PDF | Template; candidate facts remain input-gated |",
        "| `data/governance/candidate_profile_intake.json` + validator | Safe candidate-facts intake contract | INPUT-GATED by design |",
        "| `data/governance/recording_handoff.json` + validator | Safe manual walkthrough handoff contract | INPUT-GATED by design |",
        "| `reports/NONBI_SCOPE_BOUNDARY_QA_2026-09-02.json` | Active non-BI source/path boundary control | PASS evidence |",
        "| `site/` | Recruiter website and evidence navigation | No unsupported live-impact claim |",
        "",
        "## Recruiter handoff links",
        "",
        f"- Website: {snapshot['recruiter_links']['website']}",
        f"- GitHub: {snapshot['recruiter_links']['github']}",
        f"- Case summary PDF: {snapshot['recruiter_links']['case_summary_pdf']}",
        f"- Drive folder: {snapshot['recruiter_links']['drive_folder']}",
        "",
        "## File hashes",
        "",
        "| Path | Bytes | SHA-256 |",
        "|---|---:|---|",
    ]
    lines.extend(f"| `{item['path']}` | {item['bytes']:,} | `{item['sha256']}` |" for item in inventory)
    lines.extend([
        "",
        "## Reproduction",
        "",
        "```text",
        "python scripts/build_recruiter_metric_snapshot.py",
        "node scripts/validate_recruiter_metric_snapshot.mjs",
        "node scripts/run_finance_qa.mjs --nonbi",
        "python scripts/run_non_powerbi_release_gate.py",
        "```",
        "",
        "## Excluded historical path",
        "",
        "Power BI PBIP/PBIT/Desktop material remains in the repository archive for traceability only. It is not an active source, not part of this manifest's acceptance gate and not a recruiter claim.",
        "",
    ])
    report.write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps({"status": "PASS", "output": str(report), "files_hashed": len(inventory), "payload_commit": git_head()}, indent=2))


if __name__ == "__main__":
    main()
