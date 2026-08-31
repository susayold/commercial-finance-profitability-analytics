# VietNova FP&A Model v1 — model readme

## Purpose

This workbook demonstrates the monthly operating rhythm expected from a junior FP&A or business-finance analyst: load actuals, set a scenario, explain the revenue gap, isolate channel economics, monitor cash conversion and publish a controlled management view.

## Model grain and flow

- Monthly grain: Jan-2023 to Dec-2025, 36 periods.
- Commercial grain: 5 channels, 36 SKUs, 24 customers and 6,480 synthetic sales lines.
- Flow: assumptions -> imported actuals -> forecast -> variance bridge -> channel profitability -> working capital -> checks -> dashboard.
- Currency: VND. Display is in full VND in the workbook; management materials should use VND million or billion consistently.

## Workbook tabs

1. Cover: purpose, ownership, refresh rule and evidence classification.
2. Assumptions: scenario selector and editable growth/risk assumptions.
3. Sources: synthetic-data provenance and public-peer evidence boundaries.
4. Data_Actuals: monthly revenue, COGS, opex proxy and operating cash flow proxy.
5. Data_Channel: channel revenue, COGS, channel fee, trade spend and contribution margin.
6. Data_WC: AR, inventory, AP and cash-conversion metrics.
7. Forecast_Model: actual, budget, variance dollars, variance percent and scenario output.
8. Variance_Analysis: FY2023 budget bridge plus FY2024/FY2025 trend comparison.
9. Channel_Profit: formula-driven channel P&L and decision flags.
10. Working_Capital: DSO, DIO, DPO, CCC and action flags.
11. Checks: visible control gate with decomposed PASS/FAIL checks.
12. Dashboard: executive KPI block and actual-versus-budget chart.

## Formula and control conventions

- Blue/yellow cells are editable assumptions; imported data is separated from calculation tabs.
- Green-style links indicate cross-sheet references; black formulas are calculations.
- Formula outputs are bounded to the known data ranges to avoid full-column performance issues.
- No output cell should be overwritten with a hardcoded number when a source or formula exists.
- Checks must remain visible in the published workbook. Model status is PASS only when every decomposed check is PASS.

## Core finance logic

- Budget revenue = actual revenue multiplied by one plus the selected scenario growth assumption.
- Gross profit = revenue minus COGS.
- Contribution margin = gross profit minus channel fee minus trade spend.
- EBITDA proxy = contribution margin minus opex proxy. This is a management proxy, not reported EBITDA.
- Revenue variance = actual revenue minus budget revenue; variance percent divides by budget.
- Cash conversion cycle = DSO plus DIO minus DPO.
- Channel decision flag marks contribution-margin rates below the 25% hurdle for commercial review.

## QA evidence

The v1 build completed with:

- Revenue input tie-out: PASS.
- Forecast row population: PASS (36/36).
- Channel revenue tie-out: PASS.
- Working-capital row population: PASS (36/36).
- Negative-revenue sanity check: PASS (zero negative rows).
- Formula-error scan: PASS (zero matches).
- Model status: PASS.

## Limitations and next controls

- VietNova is fictional; public peers calibrate context but do not supply private operating data.
- Opex, EBITDA and OCF are management proxies and must be labelled as such in the CV and website.
- The next version should replace proxy lines with a chart-of-accounts mapping, add month-end close status, add version/date stamps and add a formal forecast-vs-latest-estimate scenario.
- A production implementation would add user access controls, source-file checksums, period-lock rules and an automated refresh log.



## v2 expansion

Version 2 expands the v1 management model to 28 tabs. New modules include:

- Invoice-line Sales_Fact with 2,160 rows across 36 months, 12 SKUs, 5 channels and 10 customers.
- Product, channel and customer profitability.
- Price-volume-mix bridge with a monthly reconciliation check.
- Promotion and pricing simulator with incremental revenue, variable cost, promotion spend, contribution-after-spend, ROI and approval hurdle; a dedicated Pricing_Simulator tab adds elasticity, CM delta and break-even price; four negative-CM stop-loss events are deliberately visible.
- Budget, forecast versions, base/upside/downside scenarios and a seeded 100-iteration Monte Carlo overlay.
- Working-capital schedule with AR, inventory, AP, DSO, DIO, DPO, CCC, cash-release estimate and escalation flags.
- Debt/liquidity schedule with minimum cash, revolver draw and interest proxy.
- Marginal-ROI budget allocation with target shares, fixed-budget conservation, capacity/max-increase caps and public peer benchmark with comparability notes.
- CFO Executive Output with readable text month labels and a control-gated PASS status.

### v2 QA evidence

- P&L revenue populated: PASS (36/36).
- Sales revenue tie: PASS.
- Channel revenue tie: PASS within an explicitly disclosed VND 100m tolerance for deterministic unit rounding.
- Working-capital rows: PASS (36/36); FY2025 Base CCC = 54.0 days using ending AR, inventory and AP balances.
- PVM bridge rows: PASS (36/36).
- No negative sales: PASS (0 rows).
- Scenario rows: PASS (4/4).
- Budget allocation rows: PASS (5/5).
- Promotion ROI validator: PASS (8 events; 4 negative-CM events; hurdle decisions recalculate).
- Fixed-budget allocation validator: PASS (old and new budget both VND 4.35bn; caps and deltas recalculate).
- Formula-error scan: PASS (zero matches).
- Model status: PASS.
