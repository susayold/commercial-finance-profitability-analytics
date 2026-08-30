# MCH OCR Review Decision — 2026-08-30

**Company:** Masan Consumer Corporation (MCH)  
**Evidence object:** [MCH OCR review workbench on Drive](https://docs.google.com/spreadsheets/d/1eRWrYLyiXNsGQuqsPwXAjT3rodJJMzI9dmjj6OkcJRY/edit)  
**Decision:** Keep MCH out of the approved normalized peer panel until human source-page review is complete.

## What the workbench contains

The workbench holds 59 OCR candidate rows spanning FY2016–FY2025. Candidates include revenue, gross profit, operating profit, NPAT, cash, inventory, operating cash flow and calculated total debt. Each row carries an official Masan Consumer financial-statement URL, a source page, OCR method, confidence and a `needs_human_review` status.

## Why automatic promotion is unsafe

- The extraction was produced by RapidOCR and explicitly records grouped-line ambiguity; the canonical amount can be confused with a comparative column, note number or account code.
- Coverage is inconsistent by year: some years omit gross profit, NPAT, operating profit or operating cash flow, so a partial series could be mistaken for a complete panel.
- Several candidates are visibly implausible and require source-page confirmation before use. Examples include FY2018 cash of VND 119,982, FY2022 cash of VND 13,013, and FY2019 total debt of VND 5.239tn against a comparative VND 41.1bn. These may be OCR column/decimal errors.
- Some rows use labels such as “Net operating profit” or “Netprofit after tax”, which must be mapped to the normalized metric dictionary only after the underlying statement line is verified.
- Calculated total debt is derived from OCR borrowings components and therefore needs a two-line tie-out, not a single-value acceptance.

## Required promotion gate

1. Open each official PDF at the recorded page and capture the exact current-year and comparative columns.
2. Transcribe the full statement row and sign (including zeros and decimals); record the page and statement section.
3. Reconcile revenue → gross profit → operating profit → PBT/NPAT where the statement presents the bridge.
4. Recompute total debt from verified short-term and long-term borrowings and tie it to the balance sheet.
5. Convert VND to VND bn only after transcription; retain the original VND amount in the review log.
6. Require a second-person or second-pass review for every promoted year and update the workbench fields `review_decision`, `corrected_value`, `reviewer_name`, `reviewed_at` and `evidence_reference`.
7. Promote only rows with `review_decision=approved`, `confidence=high`, and a non-empty source page; leave unresolved rows as blocked.

## Current project treatment

MCH remains a strategic-context / intake candidate and is not included in the 240-row approved panel. The 80-row MCH intake template remains intentionally blocked. This preserves analytical integrity while keeping the OCR queue auditable and ready for a focused human review pass.

## FY2024–FY2025 candidate layer
A separate 16-row candidate dataset now captures all eight normalized metrics for FY2024 and FY2025 from the official consolidated statements, with statement-equation and balance-sheet tie-outs. It remains `pending_visual_signoff` and is not part of the approved panel. See [MCH statement candidate reconciliation](MCH_STATEMENT_CANDIDATE_RECONCILIATION_2024_2025.md) and the [Drive candidate Sheet](https://docs.google.com/spreadsheets/d/1L8sRGR-4DI3bxE7ODqzjo9Bq18d4UjvADVUPjUDZKBE/edit).