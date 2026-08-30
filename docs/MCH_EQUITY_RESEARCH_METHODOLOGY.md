# MCH Equity Research Rehearsal — Methodology

## Purpose

This pack rehearses a public-filing equity-research workflow for a junior finance analyst: frame the thesis, separate reported facts from calculated ratios and assumptions, score the fundamental setup, identify catalysts and risks, and state what evidence would change the view.

It is not a live broker report, an external rating or investment advice.

## Source and lineage

- Historical source: `data/mch_finance_analyst_trend_2016_2025.csv`.
- The source contains ten FY2016–FY2025 rows derived from the approved MCH statement layer.
- FY2017 uses audited FY2018 comparative/corresponding columns and remains a disclosed comparability caveat.
- Valuation frame: `data/mch_valuation_rehearsal_summary.json`, which is explicitly `ANALYST_ASSUMPTION_REHEARSAL`.

## Calculations

- Revenue CAGR = `(Revenue_FY2025 / Revenue_FY2016)^(1/9) − 1`.
- PAT CAGR and operating-profit CAGR use the same nine-period convention.
- Year-on-year changes use the source's reported/derived YoY columns where available; FY2025 operating-profit YoY is recalculated against FY2024.
- Operating margin = operating profit / net revenue.
- PAT margin = PAT / net revenue.
- CFO / PAT = operating cash flow / PAT.
- Equity ratio and ROA proxy are taken from the approved trend layer; they are context measures, not full liquidity or debt-service tests.
- The report retains one row per fiscal year so a reviewer can tie the narrative to the underlying time series.

## Scorecard design

The five dimensions are a structured communication framework:

1. Earnings durability
2. Margin quality
3. Cash conversion
4. Capital resilience
5. Valuation support

Each score is an analyst judgement from 1 (weak) to 5 (strong), with a public-evidence rationale and a condition that would change the view. The composite is descriptive, not a statistical rating or fair-value calculation.

## Valuation boundary

The DCF companion is EV-only. Per-share value is intentionally not calculated because net debt/net cash, diluted shares, current market price, approved management forecast and capex/working-capital history are unavailable in the approved layer. A reviewer should treat the scenario range as an assumption map, not a target price.

## Review standard

The validator must confirm:

- ten-year coverage and latest-year anchor;
- CAGR, YoY, margin, cash-conversion and peak/weak-year tie-outs;
- scorecard row, range and composite integrity;
- valuation linkage and EV-only boundary;
- thesis, scorecard, catalysts, risks, diligence table and limitations in the report.

Rebuild with `node scripts/build_mch_equity_research_rehearsal.mjs`, then run `node scripts/validate_mch_equity_research_rehearsal.mjs`.
