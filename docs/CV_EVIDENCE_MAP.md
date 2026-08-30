# CV Evidence Map — Finance Analyst / FP&A

Use these bullets only with the evidence label shown. Synthetic metrics must remain explicitly described as simulated or illustrative.

## Target positioning

Junior FP&A / Finance Analyst / Business Finance Analyst with a commercial-finance lens across P&L, forecast, profitability, working capital and management communication.

## One-page CV bullets

- Built a formula-driven 28-tab FP&A model for a fictional FMCG company, linking 2,160 invoice-line records across 36 months to management P&L, budget, forecast versions, PVM, product/channel/customer profitability, working capital, liquidity and scenario analysis.
- Designed a visible finance control gate with nine checks; reconciled sales detail to P&L, channel detail to company revenue and 36 monthly working-capital rows, with zero formula-error matches in the final scan.
- Created a commercial-finance decision layer that evaluates promotion/pricing events through incremental revenue, variable cost, contribution margin, hurdle rates and explicit approval/stop-loss actions.
- Built a working-capital cockpit that surfaces DSO, DIO, DPO, CCC and cash-release opportunities; the illustrative FY2025 case shows 54.8 days average CCC and a June escalation flag.
- Implemented leakage-safe forecast governance: archived 29 controlled snapshots with 27 FROZEN eligible rows, one FUTURE_LEAKAGE exception and one NOT_ELIGIBLE draft; reproduced versioned Bias/WAPE of +5%/+5%, −2%/2% and +10%/10% (synthetic fixture, not live company accuracy).
- Calibrated a synthetic operating ledger against public FMCG peer context while maintaining an evidence taxonomy that separates reported facts, calculated facts, synthetic facts, assumptions, inferences and recommendations.
- Built a source-linked peer QA workflow for official annual reports and audited statements, promoting 25/25 queue rows to reported_statement_verified only after page-level checks and retaining an explicit human-review protocol.
- Built a source-linked VNM long-run panel spanning FY2006–FY2025, deriving revenue growth, margins, cash conversion and asset efficiency while flagging the FY2021 statement-to-summary basis break.
- Built a formula-driven D2C unit-economics module linking acquisition spend, repeat orders, gross margin and variable service costs to CAC, LTV/CAC, payback and scale/hold decisions; included Base/Downside/Upside sensitivities and six automated control checks (synthetic case).
- Built a source-linked public-guidance proxy for Vinamilk FY2018–FY2025 with 16 AGM/IR guidance-versus-actual observations, explicit revenue-basis controls and aggregate Bias/WAPE (public guidance, not internal forecast).
- Built a page-reviewed Masan Consumer FY2016–FY2025 finance trend and lender-style credit memo; FY2025 margin compression, PAT decline and cash-conversion warning are calculated from reported statements, with a 15/15 automated QA report.
- Added a financial-statement analysis layer using net margin, asset turnover, equity multiplier, DuPont ROE, ROA/ROE, CFO/revenue and debt/equity proxy; 11/11 controls pass and FY2024/FY2025 follow-ups are explicitly documented.
- Built a QNS/KDC basis-perimeter bridge that calculates only within-window descriptive growth, retains source lineage and blocks misleading cross-break CAGR; validator and QA report pass 12/12.
- Built a 21-row peer financial-quality scorecard for VNM/QNS/KDC with CAGR, margins, capital and cash metrics, source-record lineage, controlled blanks and rankability guardrails; validator and QA report pass 11/11.
- Authored a portable Power BI source handoff with a machine-readable semantic manifest covering 5 dimensions, 9 facts, 15 relationships, 6 report pages and 18 QA tests; wired manifest validation into GitHub Actions (native PBIX remains Desktop-dependent).
- Extended the public-guidance proxy into a reproducible forecast-performance analysis with metric/regime splits, Bias/WAPE/MAPE, within-2% accuracy bands and ranked misses; kept the evidence explicitly outside the internal forecast gate.
- Prepared a finance-analyst interview talk track that traces one KPI from source to P&L to decision, including a 90-second pitch, 15-minute reviewer tour, STAR stories and honest responses to data/PBIX limitations.

## Skills mapped to artifacts

| CV claim | Artifact | Verification |
|---|---|---|
| FP&A model building | VietNova_FPA_Model_v2.xlsx | Checks tab = PASS |
| Budget / forecast | Budget, Forecast_Versions, Scenario_MonteCarlo | Scenario rows 4/4 |
| Forecast governance / accuracy | Forecast_Snapshot_Input, Backtest_Output, frozen archive | 29 rows; 14/14 archive QA; leakage gate |
| Variance analysis | Variance_Bridge, PVM | PVM rows 36/36 |
| Profitability | Product_Profitability, Channel_Customer | Channel/customer formulas |
| Working capital | Working_Capital, AR, Inventory, AP | FY2025 CCC output |
| Liquidity | Debt_Liquidity | Minimum cash / revolver formulas |
| Commercial finance | Promotion_Pricing, Budget_Allocation | Hurdle and marginal ROI |
| D2C unit economics | D2C Unit Economics Sheet, d2c_unit_economics_synthetic.csv | CAC/LTV/payback; six native checks PASS; CI validator |
| Public guidance / forecast-vs-actual | VNM public guidance proxy FY2018–FY2025 | 16 rows; Bias -2.63%; WAPE 3.14%; Gate A excluded |
| MCH financial-statement analysis | MCH FY2016–FY2025 statement analysis dataset/report | DuPont, ROA/ROE, CFO/revenue and leverage proxy; 11/11 controls PASS |
| Peer financial-quality scorecard | VNM/QNS/KDC scorecard/report | 21 rows; source lineage; VNM trend candidate; QNS/KDC context-only; 11/11 controls PASS |
| Power BI source handoff | powerbi/PBIP_SOURCE_MANIFEST.json, PBIP_SOURCE_HANDOFF.md, PBIP_DESKTOP_EXECUTION_CHECKLIST.md | 5 dimensions; 9 facts; 15 relationships; 18 QA definitions; Desktop runbook and CI validator PASS |
| Public guidance performance analysis | data/vnm_public_guidance_proxy_analysis.json, VNM_PUBLIC_GUIDANCE_ANALYSIS.md | Metric/regime Bias-WAPE-MAPE splits, descriptive bands, ranked misses; CI validator |
| Data governance | Source_Register, peer review queue | OCR not auto-approved |
| Communication | CFO memo, battle cards, website spec | Decision/action structure |
| Interview communication | docs/FINANCE_ANALYST_INTERVIEW_TALK_TRACK.md | 90-second pitch, 15-minute walkthrough, STAR stories, pushback answers |

## Interview proof points

1. Start with the business question, not the chart.
2. Trace one KPI from Executive Output back to source facts and assumptions.
3. Demonstrate a scenario change and explain the downstream impact.
4. Show the disclosed VND 100m channel tie-out tolerance rather than hiding it.
5. Explain why synthetic operating data is necessary and how public filings are bounded.
6. State the next production control: chart-of-accounts mapping, period locks, refresh log and reviewer sign-off.

## Claims to avoid

- Do not call proxy EBITDA or OCF audited or statutory.
- Do not present VietNova customer, SKU or promotion values as a real company fact.
- Do not claim causal promotion lift without a control design.
- Do not claim OCR figures are approved until a human reviewer signs off.


- Built a transparent synthetic M&A accretion/dilution screen linking target standalone forecasts, revenue/cost synergies, integration costs and financing interest to Year-1 dilution, Year-2 EPS accretion of 17.16%, incremental FCFF and deal NPV of VND 28.39bn; included a 12-cell entry-multiple / synergy-realization sensitivity grid and explicit diligence caveats.

| M&A / strategic finance | docs/MNA_ACCRETION_DILUTION.md, mna_accretion_dilution_synthetic.csv, mna_accretion_dilution_sensitivity.csv | Validator PASS; synthetic case, not a live recommendation |


Drive mirror for M&A extension:
- Data: https://drive.google.com/file/d/1LK-YloDyk2iXqoW_XsFflkYrb4h6a224/view and https://drive.google.com/file/d/1kv60z5MXY4wghumtHvg3MqroCy-vJCyT/view
- Methodology: https://drive.google.com/file/d/1gwEWr1hIQ0XhNWP23GkrAzLBRqd6DcOe/view
- QA: https://drive.google.com/file/d/1cyt24IdL7Y8SlP97s8Qk_tt1FZsFEaOg/view
- Validator: https://drive.google.com/file/d/1kGdGkWhgMpSEvpmEsGAhflB4qC92hNmy/view


- Native M&A model: https://docs.google.com/spreadsheets/d/1GKGSKu1QpXJau_zCub5Sg7oi-VEugclP8Roor1GET5k/edit?usp=drivesdk (Assumptions, Forecast, Sensitivity, Checks; overall control status PASS).


## Final external-gates handoff

- [Execution handoff](docs/FINAL_EXTERNAL_GATES_HANDOFF.md) · [Drive copy](https://drive.google.com/file/d/1QGZOL27pumhK1z0UFE1WQ_cN0IjZ5bg7/view)
- [Live snapshot submission template](data/forecast_snapshot_live_submission_template.csv) · [Drive template](https://drive.google.com/file/d/1WQ_9L7JrbogUjhytealtfeJnXekRJqqu/view)
- The handoff specifies the exact evidence bundle, acceptance sequence, hard stops and release naming for Gate A (live pre-close forecast accuracy) and Gate B (native Power BI Desktop).


## One-page CV draft

- Finance-first V2: [FINANCE_ANALYST_CV_ONE_PAGE_V2.md](FINANCE_ANALYST_CV_ONE_PAGE_V2.md) · [Drive copy](https://docs.google.com/document/d/1pf5jUlWAajDPUj4Rs4GL6xnWyAKi_kXPLVLy59lIviU/edit?usp=drivesdk)

- [Finance Analyst / Junior FP&A CV draft](docs/FINANCE_ANALYST_CV_ONE_PAGE.md) · [Drive copy](https://drive.google.com/file/d/1rRpc9qNKcia0MeckGhqzrVnJ_iyed7RB/view)
- Bullets are restricted to validated evidence and explicitly label synthetic/public-guidance outputs; replace bracketed personal fields before use.

## Market-fit overlay

- [Vietnam role-alignment matrix](ROLE_ALIGNMENT_MATRIX.md) · [CSV](../data/role_alignment_matrix.csv) · [Drive copy](https://drive.google.com/file/d/1ngIE4Nw4-P-F6xtmxXvhUfVJPsOPVV6D/view)
- Use the matrix to choose bullets by role; do not add an unverified keyword such as SAP production experience or internal forecast accuracy.
- [Role-targeted CV variants](CV_ROLE_VARIANTS.md) · [Drive copy](https://drive.google.com/file/d/1nfaqwK6J8_1A0O5wpLZhmakhXLrWgObh/view)


## Master-plan evidence matrix

- [Machine-readable evidence matrix](data/master_plan_evidence_matrix.csv) · [Validator](scripts/validate_master_plan_evidence_matrix.mjs) · [QA report](reports/MASTER_PLAN_EVIDENCE_MATRIX_QA.md)
- [Drive matrix](https://drive.google.com/file/d/1yqiUFL1p6KT2WeXQNP2nIW1RXnO5PlyX/view) · [Drive validator](https://drive.google.com/file/d/1gz9jURxhEqkunS-z8lE_O2FNhfoxZHHI/view) · [Drive QA](https://drive.google.com/file/d/1-tQP0Dmj7n-LVSj154DF-iUP2KffBFcn/view)
- Current audit: 28 requirement rows, 20 mandatory-core rows, two external gates intentionally pending; validator PASS.


## Website strategic-finance release

- [Release note](reports/SITE_STRATEGIC_FINANCE_RELEASE_2026-08-30.md) · [Drive release note](https://drive.google.com/file/d/19mW_MT81z1CMeU9v39fBHBdiIcoLkEiQ/view)
- Production site version 3 now includes Strategic Finance / M&A and CV quick-tour cards: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- Local build PASS; deployment succeeded. Shared UI-library lint warnings remain pre-existing and do not include new page-level errors.
- [Drive build archive](https://drive.google.com/file/d/1mfx-4W0cfZvGlcZv6TONO36H3rKXgqib/view) · [v3 page source](https://drive.google.com/file/d/1gJZOyXQKPoOuEHDmRLQezSn3GgULp0f-/view) · [v3 CSS source](https://drive.google.com/file/d/136FgoZ8gzarzNZAtXWmsHpMi6PYj53fb/view)


## Website runtime QA

- [Runtime/access-boundary QA](reports/SITE_RUNTIME_QA_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1z1LGW43fG94bEkFgbPZP3QVYQvYwxZt-/view)
- Source/build/deployment checks PASS for Sites version 3. The site intentionally remains owner-only; unauthenticated requests receive the sign-in screen. Visual click-through requires the owner session.


## Archived master plan

- [Corporate Financial Analyst / FP&A master plan](docs/CORPORATE_FINANCIAL_ANALYST_FPA_MASTER_PLAN.md)
- [Drive archive](https://drive.google.com/file/d/1blpG-4CKWkjPpuwXwOFRkwI038XXMOnK/view)
- The detailed plan is now stored remotely; no local output copy is retained.

## Operational driver / unit economics evidence

- CV bullet: operational driver tree linking revenue → gross-to-net → contribution → inventory/AR cash → D2C unit economics.
- Direct report: [Operational Driver Tree & Unit Economics](OPERATIONAL_DRIVER_TREE_UNIT_ECONOMICS.md)
- Register: [22-row driver register](../data/operational_driver_tree_unit_economics.csv)
- QA: [10/10 design controls and 15/15 automated checks](../reports/OPERATIONAL_DRIVER_TREE_UNIT_ECONOMICS_QA.md)
- Evidence boundary: SIMULATED / DERIVED; never phrase the bullet as realized company impact.
- Gate A/B wording: [Gate A intake contract](GATE_A_B_USER_INPUT_CHECKLIST.md) and [Power BI source-coherence QA](../reports/POWER_BI_SOURCE_COHERENCE_QA.md) are preflight evidence only; native PBIX and LIVE_INTERNAL forecast accuracy remain open.

## OPEX and headcount planning evidence

- CV bullet: cost-center bridge from opening headcount → hires/exits → payroll → benefits/bonus → total OPEX → budget/forecast variance.
- Direct report: [OPEX & Headcount Planning Module](OPEX_HEADCOUNT_PLANNING_MODULE.md)
- Synthetic register: [opex_headcount_planning_synthetic.csv](../data/opex_headcount_planning_synthetic.csv)
- QA: [OPEX/headcount QA](../reports/OPEX_HEADCOUNT_PLANNING_QA.md) — 13/13 automated checks.
- Evidence boundary: SIMULATED / DERIVED; do not describe employees, salaries or savings as real company outcomes.

## CAPEX and fixed-asset planning evidence

- CV bullet: project-level bridge from approval → commitment → cash payment → in-service depreciation → benefit/payback.
- Direct report: [CAPEX & Fixed-Asset Planning Module](CAPEX_FIXED_ASSET_PLANNING_MODULE.md)
- Synthetic register: [capex_fixed_asset_planning_synthetic.csv](../data/capex_fixed_asset_planning_synthetic.csv)
- QA: [CAPEX/fixed-asset QA](../reports/CAPEX_FIXED_ASSET_PLANNING_QA.md) — 15/15 automated checks.
- Evidence boundary: SIMULATED / DERIVED; do not describe approvals, cash payments or returns as realized company outcomes.
