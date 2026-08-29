# VNM Legacy FY2006–FY2015 Review Protocol

## Objective

Convert legacy Vinamilk annual-report candidates into an evidence-gated consolidated statement layer without mixing annual-summary KPIs, separate-company statements, VAS consolidated statements or later IFRS presentation.

## Required fields per fiscal year

`net_revenue_vnd_bn`, `gross_profit_vnd_bn`, `operating_profit_vnd_bn`, `profit_before_tax_vnd_bn`, `profit_after_tax_vnd_bn`, `total_assets_vnd_bn`, `owners_equity_vnd_bn`, `operating_cash_flow_vnd_bn`, `source_document`, `source_url`, `page_anchor`, `reported_basis`, `source_status`, `reviewer_note`.

## Promotion gate

Promote a year to `reported_statement_verified` only when:

1. The source is an official annual report or audited financial-statement PDF archived in Drive.
2. The statement identity is explicit: consolidated (`hợp nhất`) and the fiscal year is visible.
3. All eight financial fields are captured from statement pages or an unambiguous comparative column.
4. Page anchors cover balance sheet, income statement and cash-flow statement.
5. Arithmetic checks pass: gross profit ≤ net revenue; assets ≈ liabilities + equity; PBT − tax ± deferred tax ≈ PAT; CFO is the line labelled “net cash from operating activities”.
6. Units are normalized to VND bn with the original unit retained in the reviewer note.
7. Any restatement or consolidation-perimeter break is documented before trend use.

## Candidate handling

- `summary_candidate_review_required`: summary values may be displayed in Controls & Evidence but are excluded from statement-level trend claims.
- `statement_review_required`: at least one statement identity, page anchor or metric tie-out is unresolved.
- Never impute missing gross profit, equity or CFO from another year; keep the cell blank.
- When annual-report summary and statement values disagree, retain both in separate fields and use the statement value for the approved benchmark only after the basis is documented.

## Reconciliation worksheet

For each year, record the original label, original amount, normalized amount, page, column (current/comparative), source PDF ID and reviewer initials. Reconcile the extracted row to the next year's comparative column where available. A disagreement above 0.1% requires a note; a disagreement above 1.0% blocks promotion until resolved.

## Current backlog

VNM FY2006 remains statement-review-required. VNM FY2007–FY2009 have summary and/or operating candidates archived and remain unapproved until the full metric set and page-level tie-outs are complete. VNM FY2010–FY2015 are now statement-verified in `data/vnm_statement_metrics_2010_2011.csv`, `data/vnm_statement_metrics_2012_2013.csv` and `data/vnm_statement_metrics_2014_2015.csv`. The approved peer benchmark therefore uses statement rows from FY2016 onward; the legacy layer remains evidence-gated until each year is promoted.

## Remote artifacts

- Queue: https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/data/peer_extraction_queue.csv
- Summary candidates: https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/data/vnm_legacy_summary_candidates_2007_2015.csv
- Operating candidates: https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/data/vnm_legacy_operating_candidates_2007_2015.csv

