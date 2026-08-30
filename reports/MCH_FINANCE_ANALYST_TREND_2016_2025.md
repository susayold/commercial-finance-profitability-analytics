# MCH Finance-Analyst Trend Layer — FY2016–FY2025

**Review date:** 2026-08-30  
**Source layer:** `data/mch_statement_metrics_2024_2025_approved.csv` (80 rows; 10 years × 8 metrics).

## What this layer adds

This derived layer converts the approved statement facts into analyst-ready signals: YoY revenue/PAT growth, gross/operating/PAT margins, CFO-to-PAT conversion, equity ratio and a simple ROA proxy. It is calculated—not reported—and keeps the FY2017 comparative caveat visible.

## Key readout

- Net revenue increased from VND 13,789.8bn in FY2016 to VND 30,556.5bn in FY2025, a descriptive FY2016–FY2025 CAGR of 9.24%. FY2017 is a comparative/corresponding-column year and should be caveated in any long-run narrative.
- Gross margin stayed structurally high (roughly 44–46%), while operating margin expanded from 22.9% in FY2016 to 25.4% in FY2025, peaking at 29.2% in the series.
- PAT margin moved from 20.2% to 22.1%, but cash conversion was volatile: CFO/PAT was 116.5% in FY2024 versus 31.5% in FY2025.
- FY2025 therefore merits a working-capital / cash-conversion diagnostic rather than a profit-only conclusion; no causal claim is made without note-level drivers.

## Metric definitions

- `revenue_yoy_pct`, `pat_yoy_pct`: year-over-year change in the reported metric.
- `gross_margin_pct`, `operating_margin_pct`, `pat_margin_pct`: metric divided by net revenue.
- `cfo_to_pat_pct`: operating cash flow divided by PAT.
- `equity_ratio_pct`: owners' equity divided by total assets.
- `roa_proxy_pct`: PAT divided by average total assets (FY2016 uses ending assets because no prior-year row is in the layer).

## Controls and caveats

- All source facts come from page-reviewed statement rows with source document, URL, page and review fields.
- FY2017 uses the audited FY2018 comparative income column and 1/1/2018 corresponding balance-sheet column; keep `audited_status=audited_comparative` and `restatement_status=corresponding_column`.
- Ratios are deterministic calculations and should not be mistaken for reported KPIs.
