# Recruiter Start Here — Commercial Finance & FP&A

## 60-second review path

1. Open the [GitHub Pages recruiter site](https://susayold.github.io/commercial-finance-profitability-analytics/) for the executive finance story.
2. Open the [Executive Dashboard](https://susayold.github.io/commercial-finance-profitability-analytics/dashboard/) for the synthesized KPI / action view.
3. Open the [Excel FP&A Model Showcase](https://susayold.github.io/commercial-finance-profitability-analytics/excel/) to inspect the spreadsheet capability layer and download the workbook.
4. Review the [Monthly Business Review / CFO operating pack](reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md) for decisions, owners, guardrails and review cadence.
5. Review the [Rolling-origin forecast backtest](reports/ROLLING_ORIGIN_FORECAST_BACKTEST_2026-09-08.md) for forecast-governance methodology and historical OOS evidence.

## Excel proof of skill

The recruiter workbook is available at:

- [Download `VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx`](site/public/downloads/VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx)
- Website route: `/excel/`

The workbook has **12 sheets** and demonstrates controlled assumptions, formula-driven outputs, cross-sheet references, Actual / Budget / Forecast variance analysis, `SUMIFS`, `INDEX` / `MATCH`, data validation, conditional formatting, working-capital formulas, forecast Bias / WAPE review, model checks and version/change history.

It is deliberately recruiter-readable: another reviewer can see which cells are inputs, which are formulas, where outputs come from, what remains OPEN, and how changes are documented.

## Core finance story

The main business question is:

> Which growth, margin and working-capital drivers should management act on next month?

The project demonstrates the ability to:

- reconcile transaction-level operating data into a management P&L and integrated finance model;
- explain performance through profitability, Price–Volume–Mix, costing and working-capital drivers;
- test Base / Upside / Downside scenarios and evaluate historical forecast performance without data leakage;
- translate findings into management actions with owners, value equations, guardrails and review dates;
- keep evidence classes and unsupported claims explicit instead of forcing every status to green.

## Strong recruiter talking points

### 1. Finance modelling

The model connects operating data to management P&L, balance sheet, cash flow, subledgers, debt and PP&E roll-forwards with automated reconciliation checks.

### 2. Commercial Finance

The project evaluates channel, customer, SKU and promotion economics after COGS, fees and trade spend. The decision logic does not assume that revenue growth or average promotion ROI is automatically good.

### 3. Working capital

DSO, DIO, DPO and CCC are used as diagnostic metrics, then converted into collections, inventory, supplier-term and liquidity actions.

### 4. Forecast governance

The historical rolling-origin revenue backtest uses only information available at each forecast origin. The primary seasonal-naive model achieves approximately **1.2% WAPE** at the governed 1M / 3M / 6M horizons on simulated historical data. This is labelled `SIMULATED_HISTORICAL_BACKTEST`; it is not claimed as live employer/company forecasting performance.

### 5. Excel capability

The Excel workbook is not a screenshot-only artifact. Recruiters can download the `.xlsx`, inspect formulas, use scenario/channel selectors and review control / change-log sheets. The spreadsheet layer is designed to show practical FP&A execution: monthly reporting, variance analysis, profitability review, working-capital monitoring, scenario planning and model handover.

## Evidence boundary

Operating data and model outputs are **SIMULATED / DERIVED** portfolio evidence. Historical forecast performance is **SIMULATED_HISTORICAL_BACKTEST**. Genuine live forecast accuracy remains **Gate A — OPEN**, because it requires a real forecast frozen before close and actuals observed after close.

The Excel workbook does not imply live ERP access, statutory-close ownership, employer impact or live forecast accuracy.

## Current controlled finance release

- Release: `VNFINANCE-FPA-v1.1.1`
- Immutable tag: `fpa-portfolio-v1.1.1`
- Excel recruiter workbook: `v1.2.0` additive capability artifact
- Power BI: out of active scope

The Excel artifact adds recruiter evidence of spreadsheet capability but does not change the controlled FY2025 finance truth.
