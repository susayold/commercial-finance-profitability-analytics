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
