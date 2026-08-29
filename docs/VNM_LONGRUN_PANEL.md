# Vinamilk (VNM) Long-Run Analyst Panel — FY2006–FY2025

## Scope

This panel joins the statement-verified VNM layer for FY2006–FY2020 with the latest official-report summary series for FY2021–FY2025. It is designed for historical context and trend diagnostics, not for pretending that every year has identical statement-level coverage.

## Derived fields

- 'revenue_yoy_pct': year-over-year change in reported net revenue.
- 'gross_margin_pct', 'operating_margin_pct', 'pbt_margin_pct', 'pat_margin_pct': reported profit divided by reported net revenue.
- 'cfo_to_pat_pct': operating cash flow divided by profit after tax when both are available.
- 'asset_turnover': net revenue divided by total assets.
- 'equity_ratio': owners' equity divided by total assets.
- 'comparability_flag': 'statement_verified', 'basis_break_review', or 'summary_verified'.

## Trend readout

| Window | Revenue CAGR | PBT CAGR | PAT CAGR | Interpretation |
|---|---:|---:|---:|---|
| FY2006–FY2020 | 17.49% | 24.03% | 22.44% | Long statement-verified operating history; FY2006 is a restated comparative |
| FY2016–FY2020 | 6.25% | 4.73% | 4.66% | Consistent VAS statement layer |
| FY2021–FY2025 | 1.10% | -2.56% | -3.00% | Latest-report summary series; gross profit/CFO are not supplied in this layer |

## Required caveats

1. FY2021–FY2025 rows are 'reported_summary_verified' and intentionally retain blank fields where the latest report summary does not expose gross profit or operating cash flow.
2. FY2021 is marked 'basis_break_review' because the panel moves from statement-level extraction to latest-report summary series.
3. FY2006 is a restated comparative from the FY2007 filing; do not treat it as an independently issued FY2006 report.
4. Revenue, perimeter and accounting presentation should be checked before using cross-window CAGRs in an investment conclusion.
5. The panel is historical evidence only; it is not a forecast and does not imply company impact from the fictional VietNova model.

## Recruiter use

Use this panel to demonstrate that the analyst can:

- preserve source lineage and page anchors;
- separate statement-level evidence from summary evidence;
- calculate margins, cash conversion and asset efficiency;
- identify basis breaks before ranking a long-run trend.
