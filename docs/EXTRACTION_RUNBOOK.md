# Extraction Runbook

## Purpose

Convert remote official report PDFs into a lineage-preserving normalized peer panel.

The extraction code is deliberately conservative. It is not allowed to silently fill nulls, merge statements, or publish machine output as analyst-approved data.

## Local staging contract

The repository is remote-first. For a run, materialize source PDFs into a temporary staging directory, run the parser, upload output to Drive, and delete staging after remote verification.

Required inputs:

- official PDFs;
- data/source_registry.csv;
- scripts/extract_peer_statements.py.

Example command:

    python scripts/extract_peer_statements.py --input-root <temporary-source-root> --registry data/source_registry.csv --output <temporary-output>/peer_financial_panel.csv --qa-json <temporary-output>/peer_financial_panel_qa.json

The parser returns a non-zero exit code when a file fails or the QA layer detects duplicate/ambiguous rows. That is expected until human review is complete.

## Review sequence

1. Check the failure list.
2. Check each duplicate metric by page.
3. Confirm statement scope is consolidated.
4. Confirm current-versus-comparative column order.
5. Confirm currency and scale from the source page.
6. Recalculate gross margin, operating margin, net margin and CCC from approved rows.
7. Compare extracted values to the annual-report headline table.
8. Mark approved rows only after independent review.
9. Commit only de-identified calculated panel data if redistribution rights permit.
10. Keep raw PDFs in Google Drive.

## Required approval fields

A row is ready for analysis only when:

- company and ticker are correct;
- report year and period type are correct;
- scope is consolidated or intentionally segment-level;
- original label is retained;
- unit and scale are known;
- source page is recorded;
- no duplicate remains;
- value ties to the PDF;
- reviewer status is approved.

## Known limitations

- Scanned reports may return no text and require OCR or manual transcription.
- Similar labels can appear on multiple pages; duplicate controls intentionally stop the batch.
- Company accounting labels and perimeter can change over time.
- A calculated metric is not a reported fact.
- Peer comparability is a separate decision from extraction success.
