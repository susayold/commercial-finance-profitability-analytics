# MCH FY2017/FY2020 Source Verification Runbook

Date: 2026-08-30  
Purpose: close the remaining source-registry retrieval gap without upgrading an indexed URL into approved evidence.

## Current evidence boundary

The approved MCH supplement covers FY2016–FY2025 (80 rows, eight metrics). FY2017 is validated from the audited FY2018 comparative/corresponding columns. The source registry still marks the standalone FY2017 and FY2020 annual-report attachments as `GAP / OFFICIAL_ATTACHMENT_UNAVAILABLE` because the runtime download check returned an HTTP 404. This runbook preserves the official indexed URLs and defines the evidence needed before changing the status.

## Official indexed sources

| Fiscal year | Official source | Indexed evidence | Current status |
|---|---|---|---|
| FY2017 | [Masan Consumer Annual Report 2017](https://masanconsumer.com/wp-content/uploads/2024/05/Bao-cao-thuong-nien-nam-2017.pdf) | Search index identifies the annual report and contents, including audited financial statements | GAP — verify file bytes and archive to Drive |
| FY2020 | [Masan Consumer Annual Report 2020](https://masanconsumer.com/wp-content/uploads/2021/03/Bao-cao-thuong-nien-nam-2020.pdf) | Search index identifies the annual report and report pages | GAP — verify file bytes and archive to Drive |

The report landing pages are also retained: [MCH annual-report index](https://masanconsumer.com/quan-he-co-dong/bao-cao-thuong-nien/) and [2020 report page](https://masanconsumer.com/document/bao-cao-thuong-nien-2020/).

## Closure procedure

1. Open the official PDF URL in a normal browser session. If the CDN returns 404, use the corresponding official landing page's download control; do not substitute an aggregator.
2. Save the received PDF directly into the private Drive project root under `01_Raw_Reports/MCH/` with the naming convention `MCH_Annual_Report_FY2017.pdf` or `MCH_Annual_Report_FY2020.pdf`.
3. Record Drive file ID, MIME type, byte size, retrieval timestamp and SHA-256 in `data/source_registry.csv` and the Drive source log.
4. Page-review the consolidated income statement, balance sheet and cash-flow statement. Record page numbers and the exact Vietnamese line labels for the eight approved metrics.
5. Reconcile each extracted metric to the existing supplement. A source can be promoted only when (a) the year and entity match, (b) VND units are explicit, (c) statement totals tie, and (d) no gross/net or perimeter break is silently introduced.
6. Run the repository QA runner and archive the resulting report. Keep the existing FY2017 comparative caveat unless the standalone report explicitly resolves it.

## Required source-log fields

`company, fiscal_year, report_type, official_url, drive_file_id, retrieved_at_utc, sha256, page_income_statement, page_balance_sheet, page_cash_flow, entity_scope, currency_unit, source_status, reviewer, review_note`

## Promotion rules

- `INDEXED_ONLY`: URL is discoverable but bytes are not archived or verified.
- `ARCHIVED_PENDING_REVIEW`: bytes are in Drive and hash is recorded, but page review is incomplete.
- `APPROVED`: page-level review and tie-outs pass; source may support the approved supplement.
- `REJECTED`: wrong entity/year, inaccessible or non-official source, or failed tie-out.

Until both years reach `APPROVED`, do not claim a standalone annual-report citation for FY2017/FY2020 and do not overwrite the existing FY2017 comparative provenance.

## Recruiter-safe wording while open

“MCH FY2016–FY2025 statement supplement is approved with explicit FY2017 comparative provenance; two standalone annual-report attachment URLs are indexed in the source registry but remain retrieval-gated pending Drive archive and page review.”

## Acceptance checklist

- [ ] Official PDF bytes archived in Drive (not GitHub)
- [ ] SHA-256 and file metadata recorded
- [ ] Statement pages and line labels recorded
- [ ] Eight metrics tie to source and existing supplement
- [ ] Source registry status updated by a reviewed commit
- [ ] QA runner green and release overlay updated
