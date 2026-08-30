# MCH FY2017/FY2020 Source Verification Runbook

Date: 2026-08-30  
Purpose: close the remaining source-registry retrieval gap and record page-level evidence without upgrading an indexed URL into approved evidence.

## Current evidence boundary

The approved MCH supplement covers FY2016–FY2025 (80 rows, eight metrics). FY2017 is validated from the audited FY2018 comparative/corresponding columns. The standalone FY2020 annual report is archived from the official HNX-hosted signed PDF, page-reviewed and promoted to `APPROVED`; FY2017 remains `INDEXED_ONLY` because the official company PDF is discoverable in search but direct byte retrieval currently fails with a TLS/404 response in this runtime.

## Official indexed sources

| Fiscal year | Official source | Indexed evidence | Current status |
|---|---|---|---|
| FY2017 | [Masan Consumer Annual Report 2017](https://masanconsumer.com/wp-content/uploads/2024/05/Bao-cao-thuong-nien-nam-2017.pdf) | Search index identifies the annual report and contents, including audited financial statements | INDEXED_ONLY — verify file bytes and archive to Drive |
| FY2020 | [Masan Consumer Annual Report 2020](https://owa.hnx.vn/ftp/cims/2021/3_W5/000000010261769_20210329_MSC_AR2020_Full_Lan_2_signed.pdf) | Official HNX-hosted signed PDF archived in Drive (67 pages; 8,940,859 bytes; SHA-256 recorded in source registry); consolidated statements page-reviewed and tied to the approved supplement | APPROVED — PDF pages 30–34 (printed pages 59–67) |

The report landing pages are also retained: [MCH annual-report index](https://masanconsumer.com/quan-he-co-dong/bao-cao-thuong-nien/) and [2020 report page](https://masanconsumer.com/document/bao-cao-thuong-nien-2020/).

## Closure procedure

1. Open the official PDF URL in a normal browser session. For FY2020, use the archived HNX signed PDF in Drive; for FY2017, use the Masan Consumer landing-page download control if the CDN returns a protocol/404 error; do not substitute an aggregator.
2. Save the received PDF directly into the private Drive project root under `01_Raw_Reports/MCH/` with the naming convention `MCH_Annual_Report_FY2017.pdf` or `MCH_Annual_Report_FY2020.pdf`.
3. Record Drive file ID, MIME type, byte size, retrieval timestamp and SHA-256 in `data/source_registry.csv` and the Drive source log.
4. Page-review the consolidated income statement, balance sheet and cash-flow statement. Record page numbers and the exact Vietnamese line labels for the eight approved metrics.
5. Reconcile each extracted metric to the existing supplement. A source can be promoted only when (a) the year and entity match, (b) VND units are explicit, (c) statement totals tie, and (d) no gross/net or perimeter break is silently introduced.
6. Run the repository QA runner and archive the resulting report. Keep the existing FY2017 comparative caveat unless the standalone report explicitly resolves it.

## FY2020 page-level review record

The archived signed HNX PDF was reviewed at statement level. PDF pages 30–34 (printed pages 59–67) show the consolidated balance sheet, income statement and indirect cash-flow statement in VND. The following lines tie to the FY2016–FY2025 supplement (rounded to VND bn): net revenue 23,342.7345; gross profit 9,919.2141; operating profit 5,406.9115; PBT 5,391.0278; PAT 4,597.5713; total assets 25,533.4066; equity 14,282.9848; CFO 4,678.3385. Statement totals reconcile: gross profit = net revenue − cost of sales; PBT bridges operating profit with finance/associate/other items; PAT bridges PBT with current/deferred tax; total assets = total resources; CFO equals cash-flow code 20. This supports APPROVED for FY2020 only. FY2017 remains comparative/corresponding-column evidence.

## FY2017 retrieval attempt record

On 2026-08-30 the official Masan Consumer URL `https://masanconsumer.com/wp-content/uploads/2024/05/Bao-cao-thuong-nien-nam-2017.pdf` was confirmed by the company site/search index and opened as an indexed PDF result. Direct download attempts from this runtime returned a TLS protocol error (PowerShell/cURL) or HTTP 404 (Node fetch), so no bytes, hash or page count were recorded. The source remains `INDEXED_ONLY`; the FY2018 audited comparative/corresponding columns remain the approved FY2017 provenance. No aggregator copy was substituted. The bounded extraction is available in [MCH_FY2017_WEB_INDEX_EVIDENCE.md](../reports/MCH_FY2017_WEB_INDEX_EVIDENCE.md), with [CSV](../data/mch_fy2017_web_index_evidence.csv) and [8/8 QA](../reports/MCH_FY2017_WEB_INDEX_EVIDENCE_QA.md).

## Required source-log fields

`company, fiscal_year, report_type, official_url, drive_file_id, retrieved_at_utc, sha256, page_income_statement, page_balance_sheet, page_cash_flow, entity_scope, currency_unit, source_status, reviewer, review_note`

## Promotion rules

- `INDEXED_ONLY`: URL is discoverable but bytes are not archived or verified.
- `ARCHIVED_PENDING_REVIEW`: bytes are in Drive and hash is recorded, but page review is incomplete.
- `APPROVED`: page-level review and tie-outs pass; source may support the approved supplement.
- `REJECTED`: wrong entity/year, inaccessible or non-official source, or failed tie-out.

Until FY2017 reaches `APPROVED`, do not claim a standalone annual-report citation for FY2017 or overwrite its comparative provenance. FY2020 may be cited as an approved standalone source using the page anchors above.

## Recruiter-safe wording while open

“MCH FY2016–FY2025 statement supplement is approved with explicit FY2017 comparative provenance; FY2020 standalone annual-report evidence is approved with page anchors, while FY2017 remains retrieval-gated pending official PDF archive and page review.”

## Acceptance checklist

- [x] FY2020 official PDF bytes archived in Drive; FY2017 remains pending retrieval (not GitHub)
- [x] FY2020 SHA-256 and file metadata recorded
- [x] FY2020 statement pages and line labels recorded (PDF 30–34 / printed 59–67)
- [x] FY2020 eight metrics tie to source and existing supplement
- [x] FY2020 source registry status updated by a reviewed commit
- [x] QA runner green and release overlay updated
- [ ] FY2017 official PDF bytes archived and page-reviewed
