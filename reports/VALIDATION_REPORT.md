# Validation Report — VNFinance Commercial Finance Portfolio

Date: 2026-08-30

## Scope

This report covers the Excel v2 model, synthetic operating layer, peer statement layer, Power BI contract and recruiter-facing outputs. The authoritative files are stored in the remote GitHub repository and Google Drive project folder.

## Current validation evidence

| Control | Result |
|---|---|
| Synthetic ledger QA | PASS; deterministic generation and validator are versioned |
| Excel v2 model | PASS; nine control checks PASS and formula-error scan returns zero |
| Peer queue | PASS; 25 of 25 rows are reported_statement_verified |
| VNM historical layer | PASS; FY2006–FY2020 complete, 15 rows and eight metrics per year |
| QNS / KDC statement layers | PASS for their documented fiscal-year scopes; basis and perimeter caveats retained |
| Website / deck | PASS; production site and rendered deck passed handoff QA |
| Power BI model contract | PASS as a metadata and measure specification |
| Native PBIX | OPEN; must be created and tested in Power BI Desktop |

## Power BI release gate

Run QA-01 through QA-18 in [powerbi/QA_TEST_MATRIX.md](../powerbi/QA_TEST_MATRIX.md) after importing the remote v2 workbook and approved peer CSV. Execute [powerbi/qa_validation_queries.dax](../powerbi/qa_validation_queries.dax) and record observed results on Controls & Evidence. The PBIX is releasable only when all tests pass and the reviewer can reproduce the executive answer in under five minutes.

## Evidence links

- [GitHub repository](https://github.com/susayold/commercial-finance-profitability-analytics)
- [Peer review Sheet](https://docs.google.com/spreadsheets/d/1HNViR2NV1KPu1H-ZYRADv8amwP1-kzY8QzvmcwT3csE/edit)
- [Drive project root](https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR)
- [Power BI build guide](../powerbi/POWER_BI_BUILD_GUIDE_V2.md)
- [QA matrix Drive copy](https://drive.google.com/file/d/1goi-4XMbHbUAeqE9dIHkISHhdZf5MGtb/view)
- [DAX controls Drive copy](https://drive.google.com/file/d/1l2_xVOfEdXzozbON4-7BN6hTt6zlSAog/view)

## Release interpretation

“PASS” here means the documented controls and evidence policy pass. It does not mean the synthetic case represents actual company performance or that a native PBIX exists.
