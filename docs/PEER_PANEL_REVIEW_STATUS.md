# Peer Panel Review Status — 2026-08-29

## Current verified layer

A remote Google Sheet, **Peer_Financial_Panel_Review_v1**, contains 15 rows for VNM, QNS and KDC covering FY2021-FY2025, plus source-linked legacy tabs. Values are taken from the latest official annual-report summary tables and retain the source document, URL, basis and comparability note.

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
2. VNM FY2006-FY2015 summary candidates are now archived in `data/vnm_legacy_summary_candidates_2007_2015.csv`; they remain review-required until the full metric set is page-anchored.
3. Capture page-level source anchors and original labels.
4. Reconcile the extracted values to the latest restated comparative columns.
5. Flag perimeter changes (KDC restructuring, QNS sugar/soy mix, VNM IFRS/VAS basis) before trend calculations.
6. Load only approved rows into the Power BI peer benchmark table.

## Evidence labels

- `reported_summary_verified`: copied from an official summary table and retained with source URL.
- `statement_review_required`: candidate requires page-level review before use in a calculated trend.
- `calculated`: derived margin, CAGR or ratio; never presented as reported.


## Source-linked analyst summary

- [Calculated peer summary CSV](../data/peer_analyst_summary.csv)
- [Remote Google Sheet with formulas and review queue](https://docs.google.com/spreadsheets/d/1HNViR2NV1KPu1H-ZYRADv8amwP1-kzY8QzvmcwT3csE/edit)
- [Narrative summary in Drive](https://docs.google.com/document/d/1RYxXxNddNYHca0IkglXmx_O--guf0IST2V8v-nCGuyw/edit)
- [Long-run comparability CSV](../data/peer_analyst_summary_longrun.csv)
- Drive CSV copies: [peer summary](https://drive.google.com/file/d/1qmLnJI3tZqzMkPoc6TAJT1YWQqPuMMWi/view) and [long-run summary](https://drive.google.com/file/d/1a3M6pXLbiMigi1I8teV7n-mZjCT4zOMu/view)
- Control note: unverified KDC PAT values remain blank in the panel and formulas return blank, never 0%.


## Queue traceability fields

The queue now includes `source_url`, `page_anchor`, `reported_basis` and `reviewer_note`. KDC FY2016–FY2020 now has a verified statement-metrics table with page anchors; VNM/QNS legacy rows remain explicitly review-required. `page_anchor` is intentionally blank until a human reviewer confirms the statement page; this prevents an OCR or summary candidate from being mistaken for approved evidence.

- [Traceable queue CSV](../data/peer_extraction_queue.csv)
- Drive mirror: https://drive.google.com/file/d/14WLSAnEnpzkI2s3M23oAwcvkvG9vIeV3/view
- KDC statement metrics CSV: ../data/kdc_statement_metrics_2016_2020.csv
- QNS summary metrics CSV: ../data/qns_summary_metrics_2016_2020.csv
- Drive QNS summary metrics: https://drive.google.com/file/d/11ZXiCUnUw_tuZdkO52cqhPUDaICsbbuk/view
- Native Sheet tab: `QNS_Summary_Metrics_2016_2020`
- Drive KDC statement metrics: https://drive.google.com/file/d/1dOJLLzxpQa9ujX_yijkPkuwSjAhaKFMd/view


## Verified VNM statement layer (2026-08-30)

VNM FY2016–FY2020 is now approved at statement level using VAS consolidated statements. The new table includes revenue, gross profit, operating profit, PBT, PAT, total assets, owners’ equity, operating cash flow, source URL and page anchors.

- [VNM FY2016–FY2020 statement metrics](../data/vnm_statement_metrics_2016_2020.csv)
- Drive CSV: https://drive.google.com/file/d/18IrPvgbW2GHJItmKxZPdQIJXylcYJgZg/view
- Native Sheet tab: `VNM_Statement_Metrics_2016_2020`
- Page anchors: FY2016 134–137; FY2017 132–137; FY2018 144–149; FY2019 142–147; FY2020 140–145.

Queue status is now 10 `reported_statement_verified`, 14 `summary_candidate_review_required` and 1 `statement_review_required` (VNM FY2006).

## Approved benchmark export

`data/peer_benchmark_approved_2016_2025.csv` is the evidence-gated export for Power BI: 30 company-year rows from VNM, QNS and KDC. Statement rows retain gross profit, operating profit, equity and CFO; summary rows intentionally leave unavailable metrics blank. Use `Source_Status`, `Source_Layer`, `Revenue_Basis` and `Comparability_Note` as required slicers/tooltip fields.

- [Approved 2016–2025 benchmark CSV](../data/peer_benchmark_approved_2016_2025.csv)
- Drive CSV: https://drive.google.com/file/d/1vXw9EaZaJ0HUCKn5MzHgK2dG1fgGUT6r/view
- Native Sheet tab: `Peer_Benchmark_Approved_2016_2025`

## VNM legacy operating candidate layer

A supplemental candidate file now captures readable gross profit, operating profit and operating cash flow for selected VNM legacy years (2007, 2010–2015), while 2008–2009 remain blank where OCR does not expose the full statement. These rows remain `summary_candidate_review_required` until balance-sheet fields and page-level tie-outs are complete.

- [VNM legacy operating candidates](../data/vnm_legacy_operating_candidates_2007_2015.csv)
- Drive CSV: https://drive.google.com/file/d/1UQjJe7Bwe05TGdpHcPM36Z084HsCQL44/view
- Native Sheet tab: `VNM_Legacy_Operating_Candidates`

## QNS operating-profit candidate layer

QNS FY2016–FY2019 operating-profit figures are now captured from annual-report summary/operating tables; FY2020 remains blank because the readable summary exposes PBT/PAT but not operating profit. CFO and statement page anchors remain open, so every row stays `summary_candidate_review_required`.

- [QNS operating candidates](../data/qns_operating_candidates_2016_2020.csv)
- Drive CSV: https://drive.google.com/file/d/1LCkUDTcjRw7RvYazM05cNA5ipi3fdqhc/view
- Native Sheet tab: `QNS_Operating_Candidates_2016_2020`

## QNS FY2020 audited statement promotion (2026-08-30)

QNS FY2020 has now been promoted from a summary candidate to a statement-verified row using the official audited consolidated financial statements. Report pages 6–9 provide the balance sheet, income statement and cash flow statement. The approved row uses VAS net revenue of 6,489.764 bn (not the 6,702 bn total-revenue summary KPI), gross profit 2,051.480 bn, operating profit 1,233.248 bn, PBT 1,266.434 bn, PAT 1,052.978 bn, assets 9,150.331 bn, equity 6,605.367 bn and CFO 76.962 bn.

- [QNS FY2020 statement metrics](../data/qns_statement_metrics_2020.csv)
- Drive CSV: https://drive.google.com/file/d/1tfACwjS4LDGb6SRzY2ubJvngK-H8elMa/view
- Official audited PDF: https://drive.google.com/file/d/1KqGqXOUl67oLp4MHnpwL-VCpHX0narW0/view
- Native Sheet tab: `QNS_Statement_Metrics_2020`

Queue status is now 11 `reported_statement_verified`, 13 `summary_candidate_review_required` and 1 `statement_review_required` (VNM FY2006).

## QNS FY2016–FY2019 audited statement promotion (2026-08-30)

QNS FY2016–FY2019 are now promoted to the approved consolidated statement layer. FY2016–FY2017 use the audited FY2017 filing (FY2016 comparative column); FY2018 uses the archived audited consolidated FY2018 PDF; FY2019 uses the audited FY2020 consolidated filing's FY2019 comparative column. This prevents the FY2019 standalone filing from being mixed into the consolidated peer panel.

- [QNS FY2016–FY2019 statement metrics](../data/qns_statement_metrics_2016_2019.csv)
- Drive CSV: https://drive.google.com/file/d/1WrGQZgBPy-B77_Fahfbcoukraknu7lFN/view
- QNS FY2018 audited PDF: https://drive.google.com/file/d/1AohYk_IrJGml5C95EC4g2xDxWTAVnp3E/view
- QNS FY2017 source (FY2016 comparative): https://drive.google.com/file/d/1hK0YwMWkyofUJpzcXteht_gzXC2n-IWh/view
- QNS FY2019 comparative source (audited FY2020 consolidated): https://drive.google.com/file/d/1KqGqXOUl67oLp4MHnpwL-VCpHX0narW0/view
- Native Sheet tab: `QNS_Statement_Metrics_2016_2019`

The QNS operating-candidate file remains as a historical audit trail; the approved benchmark now uses the statement layer for FY2016–FY2020. Queue status is now 15 `reported_statement_verified`, 9 `summary_candidate_review_required` and 1 `statement_review_required` (VNM FY2006).

