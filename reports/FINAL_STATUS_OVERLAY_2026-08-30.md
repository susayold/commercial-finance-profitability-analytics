# Final Status Overlay — Finance Analyst Portfolio (2026-08-30)

This note supersedes earlier dated progress paragraphs where they conflict with the current remote state.

## Current release status

| Workstream | Current truth | Evidence |
|---|---|---|
| Finance model | Excel v2 is formula-driven, scenario-enabled and QA-controlled | VietNova_FPA_Model_v2.xlsx, Checks/CFO_Output, model QA |
| Public evidence | 57 official PDFs are archived in Drive; raw reports stay out of GitHub | Drive project root and source registry |
| Peer panel | Approved VNM/QNS/KDC core remains 240 rows; QNS/KDC comparability caveats are preserved | data/normalized_peer_panel_approved_2016_2025.csv |
| MCH statement supplement | Separate approved supplement is complete: 80 rows = FY2016–FY2025 × 8 metrics | data/mch_statement_metrics_2024_2025_approved.csv |
| MCH FY2017 | Uses audited FY2018 comparative/corresponding columns; confidence and caveat are explicit | reports/MCH_APPROVED_STATEMENT_SUPPLEMENT_2024_2025.md |
| MCH OCR queue | 59 machine-review candidates remain intake-only and unapproved; this queue is distinct from the approved page-reviewed supplement | reports/MCH_OCR_REVIEW_DECISION_2026-08-30.md |
| MCH analyst layer | Trend CSV/report and recruiter case-study walkthrough are complete | data/mch_finance_analyst_trend_2016_2025.csv, reports/MCH_FINANCE_ANALYST_CASE_STUDY_WALKTHROUGH.md |\n| Credit screening | Lender-style MCH memo is complete with conditions, stress screen and evidence boundaries | reports/MCH_CREDIT_MEMO_FINANCE_ANALYST.md; Drive mirror: https://docs.google.com/document/d/15h8U_55cR5MBZV5KewQMvyJ6bjtVahKO0V5rXn-oXZQ/edit?usp=drivesdk |
| Recruiter website | Sites version 6 is deployed and includes the MCH Finance Analyst Lens plus credit-memo link | https://vn-finance-fpa-case.sangkenny200.chatgpt.site; Sites v6 release record: https://docs.google.com/document/d/1WSaAd7YVTVclTnSKYoqqXdvxpK_GACSFc0cG-XJxXlY/edit?usp=drivesdk |
| Forecast proxy | VNM public-guidance analysis is complete but explicitly not internal forecast accuracy | reports/VNM_PUBLIC_GUIDANCE_ANALYSIS.md |
| Power BI | Portable PBIP source contract and QA definitions are complete; native PBIX/Desktop evidence remains open | powerbi/PBIP_SOURCE_MANIFEST.json, powerbi/QA_EVIDENCE_LOG_TEMPLATE.csv |

## Finance-analyst readout

The portfolio now demonstrates both operating finance and public-company analysis:

- VietNova is the synthetic operating case: budget, forecast versions, PVM, channel/customer profitability, promotion ROI, working capital, liquidity and CFO output.
- MCH is the public-finance case: ten-year reported trend, margin expansion, FY2025 earnings-quality warning and cash-conversion diagnostic.
- VNM/QNS/KDC are benchmark context, not a forced league table. Revenue-basis and perimeter breaks are visible.
- The website and CV claims use evidence labels and do not present synthetic or public-guidance data as internal company facts.

## Remaining external gates

Only two items require an external input or desktop application:

1. Gate A: add at least one approved real internal pre-close forecast snapshot with model version, cutoff timestamp, approver and actual-availability date, then run the live Bias/WAPE validator.
2. Gate B: open the remote model in Power BI Desktop, create the native .pbix, execute QA-01–QA-18, reconcile the visuals to Excel and archive the binary plus visual evidence.

These are not fabricated locally because doing so would weaken the evidence standard.

## Remote storage

All durable data, code, reports, validators, website source and Drive mirrors are stored remotely in GitHub and/or the private Google Drive project root. No local working copy is part of the deliverable.
