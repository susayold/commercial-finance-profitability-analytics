# Finance Analyst CV Bullet Bank — 2026-08-30

Purpose: provide evidence-backed, ATS-friendly bullets for a one-page CV. Select only bullets that match the vacancy; do not use all of them together.

## Evidence classes

- `SIMULATED/DERIVED`: VietNova operating model, MBR, OPEX, CAPEX, pricing/promotion, risk and M&A scenarios.
- `PUBLIC_REPORTED/CALCULATED_PUBLIC`: MCH/VNM/QNS/KDC filings and derived ratios.
- `PBIP_SCAFFOLD`: Power BI source contract, DAX and QA design; native PBIX is not closed.
- `LIVE_OBSERVED`: not available until Gate A receives an approved internal snapshot and post-close actuals.

## Quantified anchor bank

| Anchor | Safe CV wording | Evidence |
|---|---|---|
| 36 months / 2,160 invoice lines / 28 tabs | Built a 36-month, 2,160-line driver-based FP&A model across 28 tabs | Excel v2 / CFO output |
| 9 visible controls / zero formula errors | Passed nine visible model controls and a zero-match formula-error scan | Excel QA |
| 22-row driver register | Mapped 22 operational-to-financial drivers to owners, guardrails and decisions | Driver tree register |
| OPEX 13/13 QA | Linked headcount, payroll, benefits, bonus and non-payroll spend to budget/forecast variance with 13/13 QA | OPEX module |
| CAPEX 15/15 QA | Linked approval, commitment, payment, depreciation and payback with 15/15 QA | CAPEX module |
| MCH 80 rows / 8 metrics | Built an approved FY2016–FY2025 public statement supplement with 80 rows and eight metrics | MCH supplement |
| FY2020 MCH approved | Page-reviewed official HNX FY2020 statements and tied eight metrics to the approved supplement | HNX PDF + runbook |
| FY2017 evidence boundary | Added eight-metric web-index evidence with 8/8 QA while retaining `INDEXED_ONLY` status and comparative-column provenance | FY2017 indexed memo + QA |
| 17 relationships / 6 pages / 18 QA definitions | Designed a Power BI-ready semantic contract with 17 relationships, six pages and 18 QA definitions | PBIP scaffold |
| 5,000 risk draws | Built a seeded 5,000-draw scenario risk overlay with percentile bands and downside triggers | Monte Carlo module |
| 12 recommendations | Converted model signals into 12 decision rows with value equation, owner, guardrail and review date | Recommendation register |

## Variant A — Junior FP&A / Finance Analyst

Use when the vacancy emphasizes budgeting, forecasting, month-end, P&L and management reporting.

- Built a 36-month, 2,160-line driver-based FP&A model across 28 tabs, linking budget/forecast versions to P&L, PVM, profitability, working capital, liquidity and scenarios; nine controls passed and formula-error scan returned zero matches (`SIMULATED/DERIVED`).
- Designed a pre-close forecast-freeze protocol that preserves immutable forecast values, records model version/cutoff/approver and blocks leakage; Bias/WAPE release remains gated on real internal evidence (`PBIP_SCAFFOLD` / `DEMO_FIXTURE_ONLY`).
- Added OPEX/headcount planning for hires, exits, payroll, benefits, bonus and non-payroll spend, with budget-versus-forecast variance and 13/13 automated QA (`SIMULATED/DERIVED`).
- Added CAPEX/fixed-asset planning for approval, commitment, cash payment, depreciation, benefits and payback, with 15/15 automated QA (`SIMULATED/DERIVED`).
- Packaged an executive MBR with PVM, cash/CCC triggers, owner/action tracker and scenario preconditions; every recommendation carries a guardrail and review date (`SIMULATED/DERIVED`).

## Variant B — Business Finance / Commercial Finance Analyst

Use when the vacancy emphasizes commercial partnering, trade spend, pricing, promotion, channel or customer profitability.

- Built channel, customer and product contribution views that connect price, volume, mix, discount, returns, cost of sales and logistics to the management P&L (`SIMULATED/DERIVED`).
- Designed promotion ROI after spend, pricing break-even and fixed-budget allocation controls; allocation conserves the approved budget and checks capacity/max-increase constraints (`SIMULATED/DERIVED`).
- Mapped 22 operational drivers—from customers/outlets, orders, units and ASP to gross-to-net, contribution, inventory and AR/DSO—to owners, guardrails and decision actions (`SIMULATED/DERIVED`).
- Converted commercial signals into a 12-row recommendation register covering promotion, pricing, working capital, scenarios, CoA controls, credit, D2C and M&A; each row includes value equation, owner and review date (`SIMULATED/DERIVED` / `CALCULATED_PUBLIC`).
- Built Finance Business Partnering battle cards for Sales, Marketing and Supply Chain pushback, linking the answer to quantified thresholds, downside and monitoring KPI (`SIMULATED/DERIVED`).

## Variant C — Finance Data Analyst (secondary)

Use only when the vacancy explicitly asks for semantic modelling, Power BI, DAX, controls or reproducibility.

- Designed a Power BI-ready semantic contract with 5 dimensions, 9 facts, 17 relationships, six report pages and 18 QA definitions; source-coherence preflight passed (`PBIP_SCAFFOLD`).
- Added machine-readable validators for schema, reconciliation, leakage, evidence class, source identity and visual QA, wired into a repeatable GitHub Actions finance QA workflow (`PBIP_SCAFFOLD`).
- Preserved source lineage and comparability flags across a 240-row peer panel plus a separate 80-row MCH statement supplement; missing bridges remain blank instead of being imputed (`PUBLIC_REPORTED/CALCULATED_PUBLIC`).
- Built a seeded 5,000-draw risk overlay with percentile bands, downside breach probabilities and joint-downside trigger logic; independence limitations are explicitly documented (`SIMULATED/DERIVED`).
- Documented the six-page Power BI build, refresh ownership, QA-01–QA-18 evidence requirements and PBIX release hard stops; native PBIX is intentionally not claimed (`PBIP_SCAFFOLD`).

## Safe versus unsafe wording

| Safe | Avoid until gate closes |
|---|---|
| “Designed a PBIP source/QA contract” | “Built and deployed a Power BI dashboard” |
| “Built a synthetic forecast-control rehearsal” | “Achieved X% forecast accuracy” |
| “Analyzed public MCH statements” | “Improved MCH company EBITDA by X%” |
| “Modelled promotion ROI and allocation guardrails” | “Delivered X revenue uplift” |
| “Produced a 13/13 or 15/15 QA result for the module” | “Saved X cost” without realized evidence |

## One-page selection recipe

1. Choose one summary line and three project bullets for the target role.
2. Use one operating scale bullet, one decision/driver bullet and one control/evidence bullet.
3. Keep evidence-class wording when the number comes from synthetic or public data.
4. Put tools after outcomes; do not lead with Power BI if the role is corporate finance.
5. Replace all bracketed candidate fields and add only real employment/education facts.
6. Run the PDF/ATS check after final selection; never exceed four project bullets in a one-page CV.

## Source links

- [Finance Analyst CV V2](FINANCE_ANALYST_CV_ONE_PAGE_V2.md)
- [Role variants](CV_ROLE_VARIANTS.md)
- [Evidence map](CV_EVIDENCE_MAP.md)
- [Remaining-gates handoff](REMAINING_GATES_HANDOFF_2026-08-30.md)
- [Interview walkthrough](INTERVIEW_WALKTHROUGH_FINANCE_ANALYST_2026-08-30.md)