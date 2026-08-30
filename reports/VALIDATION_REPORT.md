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
| Native PBIX | Observed native artifact opens, refreshes, saves and reopens; full QA-01–QA-18 matrix remains pending |

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

“PASS” here means the documented controls and evidence policy pass. It does not mean the synthetic case represents actual company performance, that the full native QA matrix is signed off, or that production realtime exists.


## Forecast accuracy status

Bias and WAPE are now reproducible on the controlled synthetic frozen-snapshot fixture; they are still not claimed as live VietNova performance. The leakage-safe script and input schema are available in [docs/FORECAST_ACCURACY_BACKTEST.md](../docs/FORECAST_ACCURACY_BACKTEST.md). This is an explicit control, not a missing-data workaround.


The backtest implementation has also passed its deterministic unit fixture: 3 eligible rows, 1 FUTURE_LEAKAGE exclusion, Bias/WAPE outputs matching the expected CSV. This validates the control logic, not live forecast accuracy for VietNova.


## Forecast snapshot capture sheet

A native Google Sheet template is now available at https://docs.google.com/spreadsheets/d/1jv9rl49WDkwmRx8p41C10P0epbPY-Oq8AlihxQGJMfg/edit. Its formula checks were verified after conversion: the 29-row demo contains 27 FROZEN eligible rows, one FUTURE_LEAKAGE exception and one NOT_ELIGIBLE draft; Backtest_Output returns +5%/+5%, −2%/2% and +10%/10% for the three eligible versions. These are controlled synthetic results; live VietNova Bias/WAPE remains gated until real approved pre-close snapshots are supplied.
