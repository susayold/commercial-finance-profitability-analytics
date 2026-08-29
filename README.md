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

Current state: Excel v2, management memo/deck, recruiter site, peer-panel review layer and Power BI semantic contract are delivered; native PBIX creation and older-year page-level peer review remain explicit next actions.


## FP&A model v2 — full 28-tab finance analyst model

- [VietNova_FPA_Model_v2.xlsx](https://docs.google.com/spreadsheets/d/1-DAMs7zqQr8a6Otimm3WgkAIsX3kazpm/edit)
- [Executive Output render](https://drive.google.com/file/d/1ItKSxASsxKx3nmJDIm76rOYVGwVWH2pb/view)
- [v2 builder](scripts/build_fpa_model_v2.mjs)
- 28 tabs cover master data, invoice-line sales, commercial costs, inventory, AR/AP, debt/liquidity, budget, forecast versions, P&L, variance bridge, PVM, product/channel/customer profitability, promotion/pricing, working capital, seeded Monte Carlo, budget allocation, peer benchmark, checks and CFO output.
- QA evidence: formula-error scan = zero matches; all nine control checks PASS; model status PASS.
- A VND 100m channel tie-out tolerance is disclosed in Checks to account for deterministic invoice-unit rounding; this is not hidden.
- Executive KPIs are synthetic management outputs and are labelled as proxies; public peer values are calibration context only.


## Recruiter website

- [Live site](https://vn-finance-fpa-case.sangkenny200.chatgpt.site)
- [Site source snapshot on Drive](https://drive.google.com/file/d/1PGOVMQ-POmEey9qUQDsw1B5F9F5oKl0j/view?usp=drivesdk)
- [Site source folder](site/)
- Sites project: `appgprj_6a930a2f81f48191b1e015f1fa938c69`; production deployment is version 1.


## Peer panel review layer

- [Peer panel review status](docs/PEER_PANEL_REVIEW_STATUS.md)
- [Remote peer panel sheet](https://docs.google.com/spreadsheets/d/1HNViR2NV1KPu1H-ZYRADv8amwP1-kzY8QzvmcwT3csE/edit)
- FY2021-FY2025 summary values are source-linked; blank cells remain review flags where statement-level validation is not complete.


## Peer and Power BI follow-through

- Calculated peer summary: data/peer_analyst_summary.csv
- Long-run comparability summary: data/peer_analyst_summary_longrun.csv
- Power BI implementation status: docs/POWER_BI_IMPLEMENTATION_STATUS.md
- Native PBIX creation is an explicit next action; no placeholder PBIX is claimed.

## Final QA

- Final QA and remote handoff: docs/FINAL_QA_AND_HANDOFF_2026-08-30.md


## Power BI QA handoff

- [Detailed build guide](powerbi/POWER_BI_BUILD_GUIDE_V2.md)
- [18-test QA matrix](powerbi/QA_TEST_MATRIX.md)
- [Executable DAX validation queries](powerbi/qa_validation_queries.dax)
- [Final QA and remote handoff](docs/FINAL_QA_AND_HANDOFF_2026-08-30.md)
- Current evidence baseline: peer extraction queue 25/25 rows reported_statement_verified; VNM statement layer complete FY2006–FY2020 (15 rows, eight metrics per year).
- Native .pbix remains Desktop-dependent and is intentionally not represented by a placeholder file.


## Financial analyst methodology pack

- [Business case](docs/BUSINESS_CASE.md)
- [KPI dictionary](docs/KPI_DICTIONARY.md)
- [PVM methodology](docs/PVM_METHODOLOGY.md)
- [Rolling forecast methodology](docs/FORECAST_METHODOLOGY.md)
- [Assumptions and limitations](docs/ASSUMPTIONS_AND_LIMITATIONS.md)
- [Claim governance](docs/CLAIM_GOVERNANCE.md)
- [Validation report](reports/VALIDATION_REPORT.md)
- [Drive mirror pack](https://drive.google.com/file/d/1NdetbRKfVEe9dQc-5n5XqBTDEnehWW4x/view)
