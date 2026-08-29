# Data Acquisition Status

Updated: 2026-08-29

## Remote archive

Google Drive project folder: https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR

Current verified raw PDF count: 57.

| Company | Annual reports | Audited consolidated FY statements | Status |
|---|---:|---:|---|
| VNM | 20 (2006-2025) | Embedded in annual reports; separate audited layer next | Complete annual layer |
| QNS | 10 (2016-2025) | Embedded in annual reports; separate audited layer next | Complete annual layer |
| KDC | 10 (2016-2025) | Embedded in annual reports; separate audited layer next | Complete annual layer |
| MCH | 7 (2018, 2019, 2021-2025) | 10 (2016-2025) | Audited financial core complete; older annual-report gaps remain |

## QA performed

- Every uploaded PDF passed a PDF magic-byte check.
- Drive folder readback reconciles expected file names and counts.
- QNS archive item labeled as 2015 was rejected because text extraction identified it as the 2016 annual report.
- MCH 2017 audited consolidated statement was recovered from the official current Financial Information endpoint after the legacy named URL returned 404.
- Original labels, official URLs, language, scope and acquisition status are retained in data/source_registry.csv.
- No raw PDFs are stored in Git history.

## Source gaps kept explicit

### QNS 2015

The current archive exposes a 2015 report entry, but its legacy LinkClick attachments currently return server errors. The duplicate PDF available under a 2016-looking filename contains 2016 report content and was not relabeled.

### MCH annual reports

The current official annual-report media layer has verified downloadable copies for 2018, 2019 and 2021-2025. Pages for older years are discoverable, but attachments for 2015-2017 and 2020 are not currently retrievable as verified PDF copies. This does not block the audited consolidated FS series 2016-2025.

## Next extraction queue

1. Download or read annual-report financial-statement pages from Drive.
2. Extract P&L, balance sheet, cash flow, segment and disclosure tables with page lineage.
3. Run two-person-style checks: machine extraction plus independent recalculation.
4. Add original/restated basis fields and accounting-standard notes.
5. Acquire official quarterlies and half-year statements for 2019-2025.
6. Build fact_financial_statement, fact_segment and fact_disclosure.
7. Reconcile normalized totals to source statements before any peer chart is published.

## Evidence rule

A report can support a reported fact only when company, period, document type, scope, unit and source page are known. A calculated metric must retain its formula and source inputs. A synthetic metric must never be presented as a company-reported number.
