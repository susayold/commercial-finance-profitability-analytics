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
