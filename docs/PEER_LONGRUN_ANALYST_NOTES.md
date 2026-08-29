# Peer Long-Run Analyst Notes — FY2016–FY2025

## Scope and evidence

This note uses the evidence-gated export `data/peer_benchmark_approved_2016_2025.csv`. FY2016–FY2020 VNM and KDC rows are VAS consolidated statements with page anchors; QNS FY2016–FY2019 remain official summary-table rows while FY2020 is now an audited VAS consolidated statement with pages 6–9; FY2021–FY2025 are latest annual-report summary series. Missing operating profit, gross profit, equity or CFO values are intentionally blank and must not be imputed.

## FY2016–FY2020 read-through

| Company | Revenue CAGR | PBT margin change | PAT margin change | Asset turnover change | Analyst interpretation |
|---|---:|---:|---:|---:|---|
| VNM | 6.3% | 24.0% → 22.7% | 20.0% → 18.8% | 1.59x → 1.23x | Scale continued, but incremental assets outpaced revenue; margin resilience remains the key FP&A question. |
| QNS | -1.5% | 21.7% → 18.9% | 19.8% → 15.7% | 1.16x → 0.73x | Slower top line and weaker capital productivity; investigate mix, sugar-cycle exposure and working-capital absorption. |
| KDC | n.m. | 67.3% → 5.0% | 52.9% → 4.0% | 0.25x → 0.67x | 2016 is distorted by investment/divestment income and perimeter changes; do not present the 2016–2020 CAGR as core operating growth. |

## How to present this in an interview

1. Start with evidence classification: statement-verified versus summary-verified, and show the source URL/page anchor.
2. Explain that VNM is the cleanest operating benchmark for margin and cash-conversion discussion; QNS is a useful capital-productivity contrast; KDC is a perimeter-change case study.
3. Use the blank fields as a control story: a finance analyst should preserve “not available” rather than silently convert missing data to zero.
4. Keep revenue-basis breaks visible. QNS historical rows use total-revenue summary values while later rows use net-revenue summary values; KDC has consolidation changes.
5. Translate the public-company evidence into VietNova actions: protect contribution margin, challenge asset growth, and gate growth investments on payback/cash conversion.

## Reproducibility

- Approved export: [GitHub CSV](../data/peer_benchmark_approved_2016_2025.csv)
- Drive export: https://drive.google.com/file/d/1vXw9EaZaJ0HUCKn5MzHgK2dG1fgGUT6r/view
- Review queue: [GitHub CSV](../data/peer_extraction_queue.csv)
- Native Sheet: [Peer_Financial_Panel_Review_v1](https://docs.google.com/spreadsheets/d/1HNViR2NV1KPu1H-ZYRADv8amwP1-kzY8QzvmcwT3csE/edit)


## Latest QNS evidence update (2026-08-30)

QNS FY2020 is promoted to statement-verified in the queue and approved benchmark. The row uses net revenue 6,489.764 bn, operating profit 1,233.248 bn and CFO 76.962 bn from the audited consolidated statements, while retaining the 6,702 bn annual-summary total-revenue figure as a basis-difference caveat. QNS FY2016–FY2019 remain summary candidates for long-run comparability until their statement pages are extracted.

## QNS statement-layer refresh (2026-08-30)

QNS FY2016–FY2020 is now statement-verified on a consistent VAS consolidated net-revenue basis. Using the approved rows, QNS net revenue moves from VND 6,972.104 bn in FY2016 to VND 6,489.764 bn in FY2020, a -1.78% CAGR. PBT margin declines from 22.1% to 19.5%, PAT margin from 20.2% to 16.2%, and asset turnover from 1.14x to 0.71x. Gross margin is comparatively resilient at 32.6% in FY2016 versus 31.6% in FY2020, so the more actionable questions are operating leverage, mix and capital absorption rather than gross-margin collapse.

- FY2016–FY2017 source: audited FY2017 filing, statement pages 6–9 (FY2016 comparative column).
- FY2018 source: audited consolidated FY2018 filing, statement pages 6–9.
- FY2019 source: audited FY2020 consolidated filing, statement pages 6–9 comparative column.
- [QNS statement layer](../data/qns_statement_metrics_2016_2019.csv)

The earlier summary-based QNS CAGR table is retained as historical context only; any dashboard or interview narrative should use the statement layer and explicitly label the revenue basis.

## VNM FY2009–FY2020 evidence-gated long-run read-through (2026-08-30)

The merged statement layer `data/vnm_statement_metrics_2009_2020.csv` now gives a twelve-year VAS consolidated series with page anchors. On the reported statement basis, net revenue grows from VND 10,613.8 bn (FY2009) to VND 59,636.3 bn (FY2020), approximately 16.9% CAGR. Gross margin expands from 36.5% to 46.4%, while PBT margin moderates from 25.7% to 22.7% and PAT margin from 22.4% to 18.8%. Asset turnover is broadly stable/slightly lower (1.25x to 1.23x), but CFO/PAT conversion falls from 1.30x to 0.91x, which is a useful FP&A prompt to investigate working-capital and investment intensity rather than treating growth as automatically cash-accretive.

Interpretation controls: FY2009–FY2015 are retained in an evidence-gated legacy layer, FY2016–FY2020 are in the approved benchmark, and FY2017 includes an explicitly documented consolidation-perimeter expansion. Do not combine this historical read-through with QNS/KDC CAGR rankings without reconciling revenue definitions and perimeter changes.

- [Merged VNM statement layer](../data/vnm_statement_metrics_2009_2020.csv)
- Drive copy: https://drive.google.com/file/d/1qjYylxjoNIOQ_RHb1glC69CZY-Fmqfj0/view
- Native Sheet tab: `VNM_Statement_Metrics_2009_2020`

## VNM historical layer closure (2026-08-30)

The full VNM statement layer now covers FY2006–FY2020 (`data/vnm_statement_metrics_2006_2020.csv`). FY2006 is the restated comparative in the FY2007 audited VAS 25 consolidated filing—the first year VNM prepared consolidated statements—so it must carry a first-consolidation caveat in any chart. FY2007–FY2015 are also evidence-gated historical rows; FY2016–FY2020 remain the approved benchmark statement layer.

- [Full VNM FY2006–FY2020 layer](../data/vnm_statement_metrics_2006_2020.csv)
- Native Sheet tab: `VNM_Statement_Metrics_2006_2020`
