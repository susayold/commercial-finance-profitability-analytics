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

