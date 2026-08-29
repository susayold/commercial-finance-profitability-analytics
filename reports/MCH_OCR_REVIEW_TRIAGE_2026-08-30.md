# MCH OCR Review Triage — 2026-08-30

## Purpose

This is a prioritization layer for the MCH audited consolidated-statement OCR candidates. It is not an approval layer. Every candidate remains `needs_human_review` until a reviewer checks the original PDF page and records an approval decision.

## Current queue

- Review queue rows: **120**
- Candidate-selected / aggregated rows: **50 / 9**
- Missing-candidate rows: **61**
- Panel candidate rows: **59**
- Panel review status: **{"needs_human_review":59}**

The queue is intentionally incomplete: missing candidates are preserved as missing rather than backfilled from an unverified copy.

## Automated triage signals

### 1. High-priority numeric outliers

A value below VND 1bn is flagged for page-level confirmation because the current consolidated statement metrics are in VND and the OCR pipeline can select note codes, clipped digits or the wrong column. Flagged rows:

- FY2018 cash: `119982.0` (page 6)
- FY2022 cash: `13013.0` (page 6)

### 2. Adjacent-year duplicates

Identical values repeated in adjacent fiscal years are not automatically wrong, but they are high-priority checks because OCR often reuses the comparative column or a prior-year line:

- revenue: FY2016/2017, value `13789759442477.0`
- gross_profit: FY2016/2017, value `6249818487562.0`
- cash: FY2016/2017, value `6914244921330.0`
- cash: FY2019/2020, value `2191361038968.0`
- inventory: FY2016/2017, value `715921028319.0`
- inventory: FY2019/2020, value `1168106286708.0`
- total_debt: FY2016/2017, value `3097814964783.0`

### 3. Missing-candidate concentration

- trade_receivables: 10 missing candidate rows
- trade_payables: 10 missing candidate rows
- capex: 10 missing candidate rows
- total_assets: 9 missing candidate rows
- operating_cash_flow: 6 missing candidate rows
- npat: 5 missing candidate rows
- operating_profit: 4 missing candidate rows
- gross_profit: 4 missing candidate rows
- cash: 1 missing candidate rows
- inventory: 1 missing candidate rows
- total_debt: 1 missing candidate rows

## Reviewer protocol

For each flagged row:

1. Open the exact PDF named in `source_file`.
2. Navigate to `source_page` and confirm the original label, current-year column, comparative column, unit and sign.
3. Compare the PDF screenshot against the candidate value; check whether the row is a statement line, note code, subtotal or formula component.
4. Record `approved`, `rejected` or `needs_second_review`, with reviewer, timestamp, screenshot/page reference and correction reason.
5. For `total_debt`, approve the two component borrowings first and recompute the aggregate; never approve the aggregate alone.
6. Re-run the peer validator only after all required metrics for a year have page-level approvals.

## Release rules

- No OCR candidate is promoted to `reported_statement_verified` from this triage report alone.
- Missing candidates remain missing; they do not become zero.
- A year may enter the approved peer panel only when the required metric set has complete approvals and no unresolved duplicate/outlier flags.
- If a restatement or perimeter change is discovered, preserve both versions and add the comparability flag.

## Recommended review order

1. FY2018–FY2022 low-value cash and repeated comparative-column flags.
2. FY2016–FY2025 revenue and gross-profit rows.
3. Operating profit, NPAT and operating cash flow.
4. Balance-sheet metrics and total-debt component aggregation.
5. FY2023 rows, where the current candidate coverage is sparse.

## Evidence boundary

This triage pack improves review efficiency and auditability. It does not change the current status: the MCH OCR layer remains a human-review queue and is not used as verified peer evidence until page-level approvals are recorded.
