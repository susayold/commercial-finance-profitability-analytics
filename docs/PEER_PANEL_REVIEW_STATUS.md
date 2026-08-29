# Peer Panel Review Status — 2026-08-29

## Current verified layer

A remote Google Sheet, **Peer_Financial_Panel_Review_v1**, contains 15 rows for VNM, QNS and KDC covering FY2021-FY2025. Values are taken from the latest official annual-report summary tables and retain the source document, URL, basis and comparability note.

- VNM: net revenue, operating profit, profit before tax, profit after tax and total assets.
- QNS: net revenue, profit before tax, profit after tax and total assets.
- KDC: net revenue, profit before tax and total assets; profit after tax is populated only where the latest report narrative/statement review is unambiguous.

## Why this is the correct intermediate state

The project must not manufacture a long-run series by copying a current-year number into historical years or by mixing VAS, IFRS, consolidated and separate statements. Blank values are intentional review flags, not missing work hidden as zero.

## Archived coverage

- VNM annual reports: FY2006-FY2025.
- QNS annual reports: FY2016-FY2025.
- KDC annual reports: FY2016-FY2025.
- MCH annual reports and audited statements: source registry and OCR review layer.

## Next extraction pass

1. Parse the statement pages of each FY2016-FY2020 report for revenue, gross profit, operating profit, PBT, PAT, assets, equity and CFO.
2. Capture page-level source anchors and original labels.
3. Reconcile the extracted values to the latest restated comparative columns.
4. Flag perimeter changes (KDC restructuring, QNS sugar/soy mix, VNM IFRS/VAS basis) before trend calculations.
5. Load only approved rows into the Power BI peer benchmark table.

## Evidence labels

- `reported_summary_verified`: copied from an official summary table and retained with source URL.
- `statement_review_required`: candidate requires page-level review before use in a calculated trend.
- `calculated`: derived margin, CAGR or ratio; never presented as reported.
