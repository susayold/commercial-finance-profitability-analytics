# VNFinance non-Power-BI FP&A release manifest — 2026-09-02

> Scope lock: this is the active FP&A / Financial Analyst release. Power BI is archived and excluded from acceptance.

## Release identity

- Release date: **2026-09-02**
- Payload commit at manifest generation: `80ba7f3c83ac8d7c619c9e7bf8947e1aaa6d693e`
- Current period: **FY2025**
- Operating input: `data/operating_inputs/manifest.json` (seed `20260829`, 36 months)
- Evidence: operating data is SIMULATED/DERIVED; public-company data is separate OBSERVED/CALCULATED_PUBLIC; valuation/M&A/Monte Carlo are SYNTHETIC_REHEARSAL.
- Recruiter website: Sites **v26**, source commit `f1d0c6fcc180bcc5a033062b0a49b1d7816202bb`, private production deployment.

## Quality gates

- Core non-BI QA: **55/55 PASS**.
- Release file gate: **52/52 PASS**.
- Recruiter website external-link QA: **42/42 PASS**.
- Gate A: **PENDING_EXTERNAL_INPUT** — an approved internal pre-close forecast snapshot plus post-close actuals is still required before claiming live forecast accuracy.
- Candidate personalization: **INPUT-GATED** — replace CV placeholders and add genuine identity/experience before submission.

## Active artifact inventory

| Artifact | Purpose | Evidence boundary |
|---|---|---|
| `data/finance_model/final_v1/` | Controlled finance schedules | SIMULATED / DERIVED |
| `data/financial_statements/` + `data/accounting/` | Linked three statements, TB, GL mapping and close controls | SIMULATED / DERIVED |
| `data/costing/` + `data/macros/` | Standard costing, reserve policy and macro cutoff | SIMULATED / ASSUMPTION |
| `data/planning/` + `data/forecast/` | Three-year plan and forecast v2/backtest rehearsal | SIMULATED / DERIVED |
| `output/pptx/VNFINANCE_NONBI_FPA_MBR_2026-09-01.pptx` | Editable management pack | Derived case output |
| `output/pdf/VNFINANCE_FPA_CASE_SUMMARY_ONE_PAGE.pdf` | One-page recruiter summary | Derived case output |
| `reports/NONBI_SCOPE_BOUNDARY_QA_2026-09-02.json` | Active non-BI source/path boundary control | PASS evidence |
| `site/` | Recruiter website and evidence navigation | No unsupported live-impact claim |

## Recruiter handoff links

- Website: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- GitHub: https://github.com/susayold/commercial-finance-profitability-analytics
- Case summary PDF: https://drive.google.com/file/d/19rzyxjeIWWDus1LzPiYzcvtM3yK3yxkO/view?usp=drivesdk
- Drive folder: https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR

## File hashes

| Path | Bytes | SHA-256 |
|---|---:|---|
| `data/operating_inputs/manifest.json` | 312 | `153C9FFD6793A811F6542F51B9217E9468A6508623B1A8C5919C45CFB39A06E3` |
| `data/finance_model/final_v1/source_manifest.csv` | 6,806 | `DAFE1B0D0249B39742A89996BF0A4C14C5EBCB8D421E105F343E74232E915EFB` |
| `data/governance/finance_metric_registry.csv` | 6,404 | `6835BE030C44723EFA675A958C9310FF8E05EC83A8D1D56BB5A2596336206FAE` |
| `data/governance/exported_metric_snapshot.csv` | 2,415 | `D7E5EB190184959D0D084E49385B04D3328A6803D65AFA233317C949230D9E80` |
| `data/governance/recruiter_metric_snapshot.json` | 4,301 | `4F353BEC882B6A8E998F05E9DA5A77787BDBB24FB6A644FA3066D3111CD568A6` |
| `data/financial_statements/monthly_income_statement.csv` | 12,101 | `23226481B8821E384FD70944168F2A45ED8F58D0BD2B1AB4423C13CC9C9DAC01` |
| `data/financial_statements/monthly_balance_sheet.csv` | 9,832 | `F97957340383E4C07BA029A57FD449B64E956F6CD93340D640E932C36005437F` |
| `data/financial_statements/monthly_cash_flow.csv` | 9,543 | `23C4B212ECF5E15C80A2DEB6CC7DC9039456C507227E75765746F25994493FC5` |
| `data/accounting/trial_balance_monthly.csv` | 29,535 | `AF43011A801101466D9450AD248D45E846245DD6839098A7288AFEA0A2CCCA5F` |
| `data/accounting/gl_management_mapping.csv` | 2,344 | `B5CA1E69E7F6B420B7E87EE15AB44A437ECD9989310506DD3F34E5FC462433E7` |
| `data/costing/cost_variance_monthly.csv` | 213,750 | `3A8664BB74DC9EBA35F38AA58EEC66A3928E6A0337540A7FE911DA6B71129383` |
| `data/forecast/forecast_versioned_snapshots_v2.csv` | 75,012 | `E90824EFC74FBF2A5FDAAFDF0177A80D46C73D2C46D27EA805AB110F203FA7ED` |
| `data/planning/three_year_operating_plan.csv` | 24,448 | `3E2AAF7189C3C81F883ECB0FF6563570B94DD266BAE4A0883D699007CD43DDC8` |
| `output/pptx/VNFINANCE_NONBI_FPA_MBR_2026-09-01.pptx` | 60,841 | `9AB883EA338348530064F35969A592FB00F048FAD0767C20B9964CAB74829CA9` |
| `output/pdf/VNFINANCE_FPA_CASE_SUMMARY_ONE_PAGE.pdf` | 6,054 | `837024C9E4809A8ACFCA897AF3D8B3B2DE7803484ADC979DF0C931858BA9D52D` |
| `reports/NON_POWERBI_FINAL_QA_2026-09-01.md` | 1,281 | `1AE58535446B904A5BD0F2468D03A202DB182196598945C0A4946DF82DF527AC` |
| `reports/NON_POWERBI_RELEASE_GATE_2026-09-01.json` | 5,765 | `2907BFE965B4D963A98D56E6E38C1EB85D211EC07324A40011DC8CC7632FA8B9` |
| `reports/RECRUITER_SITE_LINK_QA_2026-09-02.json` | 20,017 | `91215AEF0962E9465B0606FBAEBB6D4B3A789335A10C29F8B84A715605DC067A` |
| `scripts/validate_nonbi_scope_boundary.mjs` | 4,094 | `CE2A66EBB013EF80A3F00E3795B7EE9F6A5CC3D8806B3178C5343A3FA16A7816` |
| `reports/NONBI_SCOPE_BOUNDARY_QA_2026-09-02.json` | 3,409 | `CC055FCC99A80CBF9AFEE42EA0E2C636ACADCA33FE0F9CB29858A8C3F0E6AC70` |

## Reproduction

```text
python scripts/build_recruiter_metric_snapshot.py
node scripts/validate_recruiter_metric_snapshot.mjs
node scripts/run_finance_qa.mjs --nonbi
python scripts/run_non_powerbi_release_gate.py
```

## Excluded historical path

Power BI PBIP/PBIT/Desktop material remains in the repository archive for traceability only. It is not an active source, not part of this manifest's acceptance gate and not a recruiter claim.
