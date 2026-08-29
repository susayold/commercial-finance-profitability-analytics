# Commercial Finance & Profitability Analytics

End-to-end Vietnam FMCG Corporate Financial Analyst / FP&A / Commercial Finance portfolio case.

## Project design

- Fictional operating company: VietNova Consumer JSC
- Primary commercial anchor: Masan Consumer (MCH)
- Peer benchmarks: Vinamilk (VNM), Quang Ngai Sugar (QNS), KIDO (KDC)
- Public evidence: official annual reports, audited statements, filings and primary macro sources
- Operating model: deterministic synthetic SKU-channel-customer ledger calibrated to public economics
- Outputs: Excel, Power BI, CFO memo, management deck, battle cards and recruiter-first website

## Current data foundation

- 57 official PDFs archived in Google Drive (47 annual reports + 10 MCH audited consolidated statements)
- VNM: 2006-2025
- QNS: 2016-2025
- KDC: 2016-2025
- MCH: 2018, 2019 and 2021-2025
- MCH audited consolidated financial statements: 2016-2025
- Missing and rejected documents are recorded explicitly; gaps are never filled with unverified copies
- VietNova synthetic v1.0.0: 36 months, 6,480 sales lines, 36 SKUs, 5 channels, 24 customers, 13 CSV tables + manifest; QA controls PASS (10,152 checks, 0 errors)
- Synthetic generator, ledger schema, hidden-truth event specification and QA validator are versioned in `scripts/` and `schemas/`
- MCH OCR extraction pipeline: 125 machine candidates across FY2016-FY2025, 59 canonical review candidates and an explicit 120-row review queue; no OCR row is approved automatically

Raw reports are stored in the private [Google Drive project folder](https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR). They are intentionally excluded from Git history.

## FP&A model v1

The first executable model is now available:

- [VietNova_FPA_Model_v1.xlsx](https://docs.google.com/spreadsheets/d/1UADsLbTP4nor1fZblvdjL5gWVKhG-m9r/edit?usp=drivesdk)
- [Dashboard render](https://drive.google.com/file/d/1He5m0oqP9VnEQhqpe_ywtdSMKSNfnVG5/view?usp=drivesdk)
- [Formula-driven builder](scripts/build_fpa_model.mjs)
- Workbook tabs: Cover, Assumptions, Sources, Data_Actuals, Data_Channel, Data_WC, Forecast_Model, Variance_Analysis, Channel_Profit, Working_Capital, Checks and Dashboard.
- QA evidence: model status PASS; revenue tie-out, channel tie-out, working-capital row count, negative-revenue sanity and formula-error scan all pass.
- The workbook is a finance model, not a black-box dashboard: editable scenario assumptions are separated from imported data and every output is formula-driven.

## Start here

- [Full-depth execution blueprint](docs/FULL_DEPTH_EXECUTION_BLUEPRINT.md)
- [Source registry](data/source_registry.csv)
- [.gitignore and storage guardrails](.gitignore)

## Evidence policy

Every output distinguishes reported fact, calculated fact, synthetic fact, assumption, inference and recommendation. Public filings calibrate and benchmark the model; they do not provide or imply private SKU, customer, promotion or forecast data.

## Status

Phase 1A complete: remote infrastructure, source archive, registry, synthetic operating ledger, MCH OCR review layer and executable Excel FP&A model v1.

Next: human-review the MCH OCR queue and extend page-level extraction to VNM/QNS/KDC; then Power BI model build and management deliverables.
