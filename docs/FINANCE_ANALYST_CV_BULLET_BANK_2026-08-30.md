# Finance Analyst CV Bullet Bank — 2026-08-30

Purpose: provide evidence-backed, ATS-friendly bullets for a one-page CV. Select only bullets that match the vacancy; do not use all of them together.

## Evidence classes

- `SIMULATED/DERIVED`: VietNova operating model, MBR, OPEX, CAPEX, pricing/promotion, risk and M&A scenarios.
- `PUBLIC_REPORTED/CALCULATED_PUBLIC`: MCH/VNM/QNS/KDC filings and derived ratios.
- `FINANCE_DATA_CONTROLS`: finance data contract, reconciliation and repeatable QA design.
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
| 17 relationships / 6 report-ready views / 18 QA definitions | Designed a finance data contract with 17 relationships, six report-ready views and 18 QA definitions | Finance data controls |
| 5,000 risk draws | Built a seeded 5,000-draw scenario risk overlay with percentile bands and downside triggers | Monte Carlo module |
| 12 recommendations | Converted model signals into 12 decision rows with value equation, owner, guardrail and review date | Recommendation register |

## Variant A — Junior FP&A / Finance Analyst

Use when the vacancy emphasizes budgeting, forecasting, month-end, P&L and management reporting.

- Built a 36-month, 2,160-line driver-based FP&A model across 28 tabs, linking budget/forecast versions to P&L, PVM, profitability, working capital, liquidity and scenarios; nine controls passed and formula-error scan returned zero matches (`SIMULATED/DERIVED`).
- Designed a pre-close forecast-freeze protocol that preserves immutable forecast values, records model version/cutoff/approver and blocks leakage; Bias/WAPE release remains gated on real internal evidence (`FINANCE_DATA_CONTROLS` / `DEMO_FIXTURE_ONLY`).
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

Use when the vacancy explicitly asks for finance data controls, semantic modelling, reconciliation or reproducibility.

- Designed a finance data contract with 5 dimensions, 9 facts, 17 relationships, six report-ready views and 18 QA definitions; source-coherence preflight passed (`FINANCE_DATA_CONTROLS`).
- Added machine-readable validators for schema, reconciliation, leakage, evidence class and source identity, wired into a repeatable GitHub Actions finance QA workflow (`FINANCE_DATA_CONTROLS`).
- Preserved source lineage and comparability flags across a 240-row peer panel plus a separate 80-row MCH statement supplement; missing bridges remain blank instead of being imputed (`PUBLIC_REPORTED/CALCULATED_PUBLIC`).
- Built a seeded 5,000-draw risk overlay with percentile bands, downside breach probabilities and joint-downside trigger logic; independence limitations are explicitly documented (`SIMULATED/DERIVED`).
- Documented the six-view finance reporting contract, refresh ownership and QA-01–QA-18 evidence requirements; model outputs remain traceable to controlled source tables (`FINANCE_DATA_CONTROLS`).

## Safe versus unsafe wording

| Safe | Avoid until gate closes |
|---|---|
| “Designed a finance data/control contract” | “Owned a production finance system” without evidence |
| “Built a synthetic forecast-control rehearsal” | “Achieved X% forecast accuracy” |
| “Analyzed public MCH statements” | “Improved MCH company EBITDA by X%” |
| “Modelled promotion ROI and allocation guardrails” | “Delivered X revenue uplift” |
| “Produced a 13/13 or 15/15 QA result for the module” | “Saved X cost” without realized evidence |

## One-page selection recipe

1. Choose one summary line and three project bullets for the target role.
2. Use one operating scale bullet, one decision/driver bullet and one control/evidence bullet.
3. Keep evidence-class wording when the number comes from synthetic or public data.
4. Put tools after outcomes; do not lead with software names if the role is corporate finance.
5. Replace all bracketed candidate fields and add only real employment/education facts.
6. Run the PDF/ATS check after final selection; never exceed four project bullets in a one-page CV.

## Source links

- [Finance Analyst CV V2](FINANCE_ANALYST_CV_ONE_PAGE_V2.md)
- [Role variants](CV_ROLE_VARIANTS.md)
- [Evidence map](CV_EVIDENCE_MAP.md)
- [Remaining-gates handoff](REMAINING_GATES_HANDOFF_2026-08-30.md)
- [Interview walkthrough](INTERVIEW_WALKTHROUGH_FINANCE_ANALYST_2026-08-30.md)

### Customer profitability concentration
- Built a 24-customer profitability layer with gross-to-net leakage, contribution, DSO and a 10% working-capital cost proxy; top-five accounts represented 28.62% of gross sales and 30.88% of after-WC contribution in the synthetic FY2025 rehearsal. C06 was flagged for 14.58% contribution margin and 88.72-day DSO (`SYNTHETIC_REHEARSAL`).
- Added a deterministic summary output and 14/14 QA validator; current cross-platform runner covers 43 checks (42 invocations across 40 unique validator files plus contract-shape).
