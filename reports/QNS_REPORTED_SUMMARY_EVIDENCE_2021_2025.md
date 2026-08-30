# QNS Reported Summary Evidence — FY2021–FY2025

**Review date:** 2026-08-30  
**Company:** Quang Ngai Sugar Joint Stock Company (QNS)  
**Evidence tier:** Reported annual-report management summary (not promoted as audited-statement extraction)

## Decision

The QNS FY2025 Annual Report contains a clearly readable five-year management summary table covering FY2021–FY2025. It reports net revenue, gross profit, profit before tax, profit after tax, total assets and owners' equity in VND billion. These values are suitable for the normalized panel's reported-summary layer. The report's standalone financial-statement section is referenced but not text-extractable at statement-line level in the supplied PDF; therefore the values remain tagged `reported_in_annual_report` / `partially_comparable`, not `audited`.

## Source

- Annual report: [QNS Annual Report 2025](https://drive.google.com/file/d/15mGdakHpBm2hqXbRnDRubgSGR1R9oQf2/view)
- Report section: “BÁO CÁO CỦA BAN ĐIỀU HÀNH — MỘT SỐ CHỈ TIÊU TÀI CHÍNH”
- PDF text anchor: report pages 27–28 (management report summary; page marker 27 precedes the table and the table continues on the next report page).
- Unit: VND billion; consolidated group.

## Extracted values

| FY | Net revenue | Gross profit | PBT | PAT | Total assets | Owners' equity |
|---:|---:|---:|---:|---:|---:|---:|
| 2021 | 7,335 | 2,262 | 1,439 | 1,254 | 9,876 | 7,095 |
| 2022 | 8,255 | 2,459 | 1,505 | 1,287 | 10,266 | 7,465 |
| 2023 | 10,021 | 3,351 | 2,447 | 2,183 | 12,053 | 8,581 |
| 2024 | 10,243 | 3,484 | 2,645 | 2,377 | 13,808 | 10,002 |
| 2025 | 10,575 | 3,525 | 2,212 | 1,916 | 14,350 | 10,646 |

## Reconciliation and use

- Existing normalized QNS rows for net revenue, PBT, PAT and total assets tie to the same five-year table.
- Gross profit and owners' equity are promoted from blank/not-available placeholders to reported values for FY2021–FY2025.
- Operating profit and operating cash flow remain blank because the table does not report them and no statement-line extraction was accepted.
- Do not calculate a full-period CAGR across QNS without first addressing the company's changing perimeter and the summary-vs-statement basis; use year-over-year trend charts with the comparability flag visible.

## QA

- Source values were transcribed directly from the table; no interpolation or OCR estimation was used.
- The normalized panel validator must pass with 240 rows and 8 metric rows per company-year.
- This supplement is intentionally separate from the audited KDC statement supplement so reviewers can distinguish evidence tiers.


## FY2020 cross-check
The QNS FY2021 Annual Report management summary (page 32) provides FY2020 gross profit of VND 2,051bn and owners' equity of VND 6,605bn. These two rows were also populated in the normalized panel as reported annual-report summary values. The panel keeps the FY2020 source document/page distinct from the FY2021–FY2025 extract.