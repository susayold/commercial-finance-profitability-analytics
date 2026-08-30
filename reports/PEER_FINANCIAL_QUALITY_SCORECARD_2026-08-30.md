# Peer Financial-Quality Scorecard — VNM / QNS / KDC (FY2020–FY2025)

**Review date:** 2026-08-30  
**Evidence class:** calculated from the approved normalized peer panel; not an investment recommendation.

## Purpose

This scorecard adds a finance-analyst layer above the 240-row normalized statement export. It deliberately separates:

- **VNM:** the long-run financial benchmark and the only company eligible for trend interpretation in this scorecard.
- **QNS:** input-cost / plant-economics context; revenue-basis break means no unadjusted cross-company growth ranking.
- **KDC:** strategic portfolio context; consolidation/perimeter breaks mean no unadjusted cross-company growth ranking.

A blank value means a required component is unavailable in the approved panel. Blank is controlled missingness, not a zero.

## Metric definitions

- Revenue CAGR FY2020–FY2025 = (FY2025 revenue / FY2020 revenue)^(1/5) − 1.
- PBT margin, PAT margin and gross margin use FY2025 numerator divided by FY2025 net revenue.
- Total-assets CAGR uses FY2020 and FY2025 consolidated total assets.
- Equity ratio = FY2025 owners’ equity / FY2025 total assets.
- CFO / PAT = FY2025 operating cash flow / FY2025 PAT.

Every row keeps the two source record IDs and URLs used for the calculation.

## Calculated readout

| Company | Revenue CAGR | FY2025 PBT margin | FY2025 PAT margin | FY2025 gross margin | Asset CAGR | Equity ratio | CFO/PAT | Readout |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| VNM | 1.28% | 18.30% | 14.79% | n/a | 1.94% | n/a | n/a | Trend candidate; missing gross-profit/equity/OCF blocks those ratios |
| QNS | 10.26% | 20.92% | 18.12% | 33.33% | 9.42% | 74.19% | n/a | Context only; revenue-basis bridge remains open |
| KDC | 1.70% | 8.03% | 6.49% | 18.50% | 2.40% | 55.64% | 14.67% | Context only; perimeter transition and missing 2021–2023 PAT block clean trend claims |
```

## Analyst interpretation

1. VNM’s FY2020–FY2025 revenue CAGR is 1.28% and FY2025 PBT margin is 18.30%; this is a benchmark signal, not a target for VietNova.
2. QNS shows a higher FY2025 PBT margin (20.92%) and gross margin (33.33%), but the scorecard keeps it as input-cost context because the revenue basis is not uniform across the historical window.
3. KDC’s FY2025 PBT margin (8.03%) and PAT margin (6.49%) are useful strategic context, while FY2025 CFO/PAT of 14.67% is a cash-conversion follow-up—not a clean peer ranking metric.
4. Missing VNM gross profit, equity and OCF, plus missing QNS OCF and KDC FY2021–FY2023 PAT, are explicitly surfaced. The scorecard does not impute or rank blanks.

## Use in a finance-analyst interview

- Start with the decision: choose a benchmark for margin, cash or input-cost stress.
- Show the row-level source IDs and formula definition.
- Explain why VNM can support a trend narrative but QNS/KDC cannot support an unadjusted league table.
- Convert the signal into a management action: use QNS for commodity sensitivity, KDC for perimeter/one-off review and VNM for financial-quality discipline.

## Release rule

Only rows with `status=calculated` may be displayed as numeric signals. `rankability=context_only` must remain labelled context; `blocked` rows remain blank. The detailed QNS/KDC adjustment-feasibility register remains the required next step before adjusted full-period CAGR.
