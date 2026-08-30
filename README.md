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

- 58 official PDFs archived in Google Drive (47 annual reports + 10 MCH audited consolidated statements)
- VNM: 2006-2025
- QNS: 2016-2025
- KDC: 2016-2025
- MCH: FY2016-FY2025 statement supplement approved; FY2017 comparative caveat retained
- MCH finance-analyst case-study walkthrough: `reports/MCH_FINANCE_ANALYST_CASE_STUDY_WALKTHROUGH.md` · [native Drive Doc](https://docs.google.com/document/d/1viCTwj6jdwiUX8tM-6W6cJWTfOnD1z6KMhrqznP553Q/edit?usp=drivesdk)
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
- [Source registry](data/source_registry.csv) · [Drive snapshot (FY2020 APPROVED)](https://drive.google.com/file/d/1llxbbQSPlc4xmAL-kf3NgZdyZzjJbHix/view?usp=drivesdk)
- [.gitignore and storage guardrails](.gitignore)

## Evidence policy

Every output distinguishes reported fact, calculated fact, synthetic fact, assumption, inference and recommendation. Public filings calibrate and benchmark the model; they do not provide or imply private SKU, customer, promotion or forecast data.


## Current status overlay

See [Final Status Overlay](reports/FINAL_STATUS_OVERLAY_2026-08-30.md) · [Drive mirror](https://docs.google.com/document/d/1hokvGptWOnSoN8GO2SK124iEPpEHw8fXsA8Kp51FKkU/edit?usp=drivesdk) for the authoritative current-state index; it supersedes stale historical progress paragraphs where needed.

## Status

Phase 1A complete: remote infrastructure, source archive, registry, synthetic operating ledger, MCH OCR review layer and executable Excel FP&A model v1.

Current state: Excel v2, management memo/deck, recruiter site, peer-panel review layer, full VNM FY2006–FY2025 panel and Power BI semantic contract are delivered; only the genuine internal forecast snapshot (Gate A) and native PBIX/Desktop QA (Gate B) remain external next actions.

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
- [Site source archive V8 on Drive](https://drive.google.com/file/d/1o7GqTKvV3K5uLu4rQ9R-0A8n32pqte4L/view?usp=drivesdk)
- [Site source folder](site/)
- Sites project: `appgprj_6a930a2f81f48191b1e015f1fa938c69`; production deployment is version 8. [V8 release record](reports/SITE_V8_RELEASE_RECORD_2026-08-30.md) · [Drive release record](https://drive.google.com/file/d/1p3gSEo7gkH_skLniiMFK96SgBnk1aSaO/view?usp=drivesdk) · [V8 source archive](https://drive.google.com/file/d/1o7GqTKvV3K5uLu4rQ9R-0A8n32pqte4L/view?usp=drivesdk).
- Website release update: [Forecast section release](reports/SITE_FORECAST_SECTION_RELEASE_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1Cz5Hl0HH9YLLklKBHJ2FBlTdEyQWz6u9/view). Production site now exposes a recruiter-facing forecast-performance section with explicit Gate A exclusion.
- Interview preparation: [Finance Analyst / FP&A talk track](docs/FINANCE_ANALYST_INTERVIEW_TALK_TRACK.md) · [Drive copy](https://drive.google.com/file/d/1qyKG5FJW5_EdKyu10l-xWUyOU9i5tLRy/view). Includes a 90-second pitch, 15-minute walkthrough, STAR stories and pushback answers.

- [MCH OCR review triage](reports/MCH_OCR_REVIEW_TRIAGE_2026-08-30.md) · [Drive review document](https://docs.google.com/document/d/1MRy5T3IC19X77agxXheJ74mZQjAz__IeMbavaJkYQ8I/edit?usp=drivesdk) — 120-row queue, 61 missing candidates, 2 numeric outliers and 7 adjacent-year duplicate signals prioritized for page-level review. · [Machine-readable flags](data/mch_ocr_triage_flags.csv) · [Drive Sheet](https://docs.google.com/spreadsheets/d/1UvYD22jwFh1UaolxC_jH7HkpJ8Csi6qS6aTtSBbI4Dw/edit?usp=drivesdk) · [Page-level review workbench template](data/mch_ocr_review_workbench_template.csv) · [Drive Workbench](https://docs.google.com/spreadsheets/d/1eRWrYLyiXNsGQuqsPwXAjT3rodJJMzI9dmjj6OkcJRY/edit?usp=drivesdk) · [Workbench validator](scripts/validate_mch_ocr_workbench.mjs) · [Drive CSV](https://drive.google.com/file/d/1t2qH7YEmGxJNROT4VXRHrUTqAH-zFV1a/view) · [Drive validator](https://drive.google.com/file/d/1rXeXg9mCkgoPHim5yK7U-9pmYDJdeNp-/view) · [Drive flags CSV](https://drive.google.com/file/d/1D4AZBz-IK4TrenRLtgtBcN5csnmC4m6Z/view)

## Peer panel review layer

- [Peer panel review status](docs/PEER_PANEL_REVIEW_STATUS.md)
- [Remote peer panel sheet](https://docs.google.com/spreadsheets/d/1HNViR2NV1KPu1H-ZYRADv8amwP1-kzY8QzvmcwT3csE/edit)
- Native tab `VNM_Longrun_Panel_2006_2025` exposes the full FY2006–FY2025 historical panel with derived ratios and basis-break flags.
- FY2021-FY2025 summary values are source-linked; blank cells remain review flags where statement-level validation is not complete.

- [Peer comparability decision memo](reports/PEER_COMPARABILITY_DECISION_2026-08-30.md) · [Drive memo](https://docs.google.com/document/d/184FPk4ZcPaWVtWm4qqRsvsG3RO0D_Lv9tS46yKXqCGk/edit?usp=drivesdk) — VNM is the long-run trend benchmark; QNS/KDC remain bounded context until basis/perimeter controls are closed.

- [QNS/KDC basis-perimeter bridge](reports/PEER_BASIS_PERIMETER_BRIDGE_2026-08-30.md) · [segmented CSV](data/peer_basis_perimeter_bridge_2016_2025.csv) · [validator](scripts/validate_peer_basis_perimeter_bridge.mjs) · [12/12 QA PASS](reports/PEER_BASIS_PERIMETER_BRIDGE_QA.md) · [Drive report](https://docs.google.com/document/d/1VouSfVYA5QMRFlXp5CGpVODvuD_EP3lDlRvFrn54kzM/edit?usp=drivesdk) · [Drive Sheet](https://docs.google.com/spreadsheets/d/1lEQ20BVWRGPfj1GaJlCeWlRDvXEsupPuFTAiabPZ9z0/edit?usp=drivesdk) · [Drive QA](https://docs.google.com/document/d/1AKMJEiV_WM1Bynu_4LsdS2g91KqnbUh3jrMGN3QQSsI/edit?usp=drivesdk) · [Drive validator](https://docs.google.com/document/d/1co9fF6l9Ufk3ZYX_IUerJc0xGgTxBkYE2MBw6OUp2Os/edit?usp=drivesdk) — within-basis growth is shown; cross-break full-period CAGR remains blocked.

- [QNS/KDC adjustment-feasibility ledger](reports/PEER_BASIS_ADJUSTMENT_FEASIBILITY_2026-08-30.md) · [CSV](data/peer_basis_adjustment_feasibility_2026-08-30.csv) · [validator](scripts/validate_peer_basis_adjustment_feasibility.mjs) · [10/10 QA PASS](reports/PEER_BASIS_ADJUSTMENT_FEASIBILITY_QA.md) · [Drive report](https://docs.google.com/document/d/1j4n34qdg3L4wlCcsf2KlQfakMzw3zqNIAVCnoO21eLM/edit?usp=drivesdk) · [Drive ledger](https://docs.google.com/spreadsheets/d/1JYVMneApyJCtSSnTbyYma_bJhrHfScxI_tZtZlEcIPU/edit?usp=drivesdk) · [Drive QA](https://docs.google.com/document/d/1MEyVLEIAv3d_MgZFX2EBmC5CzuXwPDSLLffr-s-f2Bo/edit?usp=drivesdk) — adjustment remains blocked until entity/gross-to-net bridges are sourced.

- Normalized peer evidence layer: [approved long-form CSV](data/normalized_peer_panel_approved_2016_2025.csv), [KDC FY2024–FY2025 exact statement supplement](data/kdc_statement_metrics_2024_2025.csv), [MCH core-panel intake template (intentionally separate)](data/normalized_peer_panel_intake_template.csv), [methodology](docs/NORMALIZED_PEER_PANEL_METHODOLOGY.md), [validator](scripts/validate_normalized_peer_panel.mjs), [approved QA](reports/NORMALIZED_PEER_PANEL_QA.md) and [template QA](reports/NORMALIZED_PEER_PANEL_TEMPLATE_QA.md). [Drive native Sheet](https://docs.google.com/spreadsheets/d/11v8XpRNMCkaWkhqakjxh1Ao3E0yTP4cLP3Z3Jmg7Owg/edit?usp=drivesdk) · [Drive approved CSV](https://drive.google.com/file/d/10TEXjoohSV4J75TpmTFvoWt8nVXgPnrd/view) · [Drive KDC supplement](https://drive.google.com/file/d/16TZWVvN6XgVneG_jlubnHa9jeFhXZVqR/view) · [Drive MCH template](https://drive.google.com/file/d/1oZS-UL-Z1oDPH4QJOLH1_JToTE9bUqN-/view) · [Drive methodology](https://drive.google.com/file/d/1ezRb7YYtgX13suCgF7ztwWvAoeCuaTW3/view).

## Peer and Power BI follow-through
## Peer and Power BI follow-through

- Calculated peer summary: data/peer_analyst_summary.csv
- Long-run comparability summary: data/peer_analyst_summary_longrun.csv
- Power BI implementation status: docs/POWER_BI_IMPLEMENTATION_STATUS.md
- Native PBIX creation is an explicit next action; no placeholder PBIX is claimed.

## Remote release status

- [Drive archive authority map](docs/DRIVE_ARCHIVE_AUTHORITY_MAP_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1AkUbm5WN_rfyZ5l20Elvdteld2JuoToR/view?usp=drivesdk)

- [Release-status record](reports/REMOTE_RELEASE_STATUS_2026-08-30.md) · [Drive current mirror](https://docs.google.com/document/d/112gXNmli0sf-qL1CrKuiWPA8Z0ekcXGRwromDQ-wdGc/edit?usp=drivesdk) · [Drive copy](https://drive.google.com/file/d/1xb_SyGeE5_vWnKEmRNtwd6u4ZZExc5RR/view?usp=drivesdk)
- This record is the reviewer-first index for remote storage, QA evidence and the two intentionally open external gates.

## Final QA

- Final QA and remote handoff: docs/FINAL_QA_AND_HANDOFF_2026-08-30.md

## Power BI QA handoff

- [Detailed build guide](powerbi/POWER_BI_BUILD_GUIDE_V2.md)
- [PBIX release evidence template](powerbi/PBIX_RELEASE_EVIDENCE_TEMPLATE.md) · [Drive copy](https://drive.google.com/file/d/1zeOflHSaBjlna_Nl0vQ2pS2m42XApWi3/view?usp=drivesdk)
- [18-test QA matrix](powerbi/QA_TEST_MATRIX.md)
- [Executable DAX validation queries](powerbi/qa_validation_queries.dax)
- [Final QA and remote handoff](docs/FINAL_QA_AND_HANDOFF_2026-08-30.md)
- Current evidence baseline: peer extraction queue 25/25 rows reported_statement_verified; VNM statement layer complete FY2006–FY2020 (15 rows, eight metrics per year).
- Native .pbix remains Desktop-dependent and is intentionally not represented by a placeholder file.

## Public-guidance forecast performance analysis

- [Analyst report](reports/VNM_PUBLIC_GUIDANCE_ANALYSIS.md) · [Analysis JSON](data/vnm_public_guidance_proxy_analysis.json) · [Generator](scripts/analyze_public_guidance_proxy.mjs) · [QA](reports/VNM_PUBLIC_GUIDANCE_ANALYSIS_QA.md)
- [Drive report](https://drive.google.com/file/d/1G7XgCuQ3MLza4NjetaCwRajPKdLsZQWN/view) · [Drive analysis JSON](https://drive.google.com/file/d/1xF72I7FYa7T68e-NfC1aIeAnEXXRByht/view) · [Drive generator](https://drive.google.com/file/d/1bvA-P3ihQbf10BZxc1C_IBOwZYgZyjng/view) · [Drive validator](https://drive.google.com/file/d/1UU6Ln2p2lnOb_oZ-pre5v_u5TMuv4O-5/view) · [Drive QA](https://drive.google.com/file/d/1aFj7k9rL8ERfcNzEbOq5D_9g5y5P0Kck/view)
- The report decomposes the 16-row VNM public-guidance proxy by metric and period, with Bias, WAPE, MAPE, within-2% rate, descriptive error bands and worst misses.
- Key readout: PBT WAPE 4.89% versus revenue WAPE 2.79%; FY2022 PBT is the largest miss at -12.533% of guidance. These are public-guidance observations, not internal forecast accuracy.

## PBIP source handoff (portable Power BI build contract)

- [PBIP source manifest](powerbi/PBIP_SOURCE_MANIFEST.json) · [Drive copy](https://drive.google.com/file/d/1ZusZswCyESNKSFp-B1A_IOHZ3KtNiFnz/view)
- [PBIP handoff instructions](docs/PBIP_SOURCE_HANDOFF.md) · [Drive copy](https://drive.google.com/file/d/1MFMxCBM3HRG4Ffge5OwlV9ENkEOPn806/view)
- [Desktop execution checklist](powerbi/PBIP_DESKTOP_EXECUTION_CHECKLIST.md) · covers prerequisites, topology, six-page build, QA-01–QA-18 and release evidence naming.
- [Manifest validator](scripts/validate_pbip_source_manifest.mjs) · [Drive copy](https://drive.google.com/file/d/1fHLaWb1W1MwnVECFgabThpghA971u8XL/view)
- Remote validation: 5 dimensions, 9 facts, 17 relationships, 6 report pages and 18 QA tests — PASS.
- This is a portable source scaffold, not a native .pbix; the binary remains a Power BI Desktop-dependent release gate.

## Financial analyst methodology pack

- [Business case](docs/BUSINESS_CASE.md)
- [KPI dictionary](docs/KPI_DICTIONARY.md)
- [PVM methodology](docs/PVM_METHODOLOGY.md)
- [Rolling forecast methodology](docs/FORECAST_METHODOLOGY.md)
- [Assumptions and limitations](docs/ASSUMPTIONS_AND_LIMITATIONS.md)
- [Claim governance](docs/CLAIM_GOVERNANCE.md)
- [Validation report](reports/VALIDATION_REPORT.md)
- [Executive output reconciliation](reports/EXECUTIVE_OUTPUT_RECONCILIATION.md) · [Drive copy](https://drive.google.com/file/d/1aZpqpilCs9aDzK4fNPS226w-_xTS1951/view?usp=drivesdk)
- [Drive mirror pack](https://drive.google.com/file/d/1NdetbRKfVEe9dQc-5n5XqBTDEnehWW4x/view)

- [Native PBIX execution runbook](powerbi/POWER_BI_DESKTOP_RUNBOOK.md) · [Drive copy](https://drive.google.com/file/d/1GdN43ajowcg9qjIf5fmwnX9Qarfd64Us/view)

- [Forecast accuracy backtest specification](docs/FORECAST_ACCURACY_BACKTEST.md) · [Bias/WAPE script](scripts/compute_forecast_accuracy.mjs) · [Input template](data/forecast_accuracy_input_template.csv)

- [Native forecast snapshot capture Sheet](https://docs.google.com/spreadsheets/d/1jv9rl49WDkwmRx8p41C10P0epbPY-Oq8AlihxQGJMfg/edit) · [Builder script](scripts/build_forecast_capture.mjs)

## Forecast governance close control

- [Forecast snapshot close calendar](docs/FORECAST_SNAPSHOT_CLOSE_CALENDAR.md) · [Drive copy](https://drive.google.com/file/d/12jAEwrXTeUmz5lzu9aUh1Ay6MUvsMu88/view)
- [Real snapshot onboarding pack](docs/REAL_SNAPSHOT_ONBOARDING_PACK.md) · [Drive copy](https://drive.google.com/file/d/1gjdrHk6T4xnsv9SFaGoCIsd9CLRLl5oc/view) · native Sheet tab `Real_Snapshot_Onboarding`
- The calendar defines WD-5 through month+1 accuracy steps, immutable snapshot fields, RACI, freeze protocol, leakage-safe eligibility and exception handling.

- [Multi-version forecast accuracy demo](docs/FORECAST_ACCURACY_BACKTEST.md): 29-row controlled fixture, 27 eligible observations and explicit leakage exclusions.

- [Definition-of-done evidence audit](docs/DEFINITION_OF_DONE_AUDIT.md) · [Drive current mirror](https://docs.google.com/document/d/1IKPE6kHjmGhaHKhUsRO9jkJGFTgY0EiyYprrYruiFd8/edit?usp=drivesdk) · [Drive copy](https://drive.google.com/file/d/1moblqlk6_MApvkIBSdluDBnxhqhwTqxI/view)

- [VNM long-run analyst panel FY2006–FY2025](data/vnm_longrun_panel_2006_2025.csv) · [Methodology](docs/VNM_LONGRUN_PANEL.md) · [Drive CSV](https://drive.google.com/file/d/1R0ruyyRRLl7bFWuzKlhpihor2_4Qu4Hv/view)

- [VNM long-run panel QA validator](scripts/validate_vnm_longrun_panel.mjs) · [QA report](reports/VNM_LONGRUN_PANEL_QA.md) (17/17 checks PASS).

- Automated regression checks: [`.github/workflows/finance-qa.yml`](.github/workflows/finance-qa.yml) runs forecast leakage unit test, VNM panel 17-check validator, D2C unit economics validator and Power BI contract JSON validation on push/PR.

- [CI QA rehearsal report](reports/CI_QA_LOCAL_REHEARSAL_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1CUWzZ4PClwQPEMXgNvn679uufSnTntmQ/view)

- Peer evidence gate: [validator](scripts/validate_peer_evidence.mjs) · [21/21 QA report](reports/PEER_EVIDENCE_QA.md) · [Drive validator](https://drive.google.com/file/d/1DyD5uJc1q-tgjh4S-1QSeKynYbizukAH/view) · [Drive report](https://drive.google.com/file/d/1P8V6vm77MoKrSxfinijZKJMp4LZ5cc6y/view)

- [Forecast capture Sheet QA report](reports/FORECAST_CAPTURE_SHEET_QA.md) · [Drive copy](https://drive.google.com/file/d/16oxmO8IdsfXhZxngLmnGYu2CtCUJW3UO/view)

- Native freeze-gate test: DRAFT rows are blocked; temporary FROZEN test produced metrics/READY and was reverted. See [capture QA](reports/FORECAST_CAPTURE_SHEET_QA.md).

- [Frozen forecast capture archive](data/forecast_snapshot_capture_demo_frozen.csv) · [Archive validator](scripts/validate_forecast_capture_archive.mjs) · [Archive builder](scripts/build_forecast_capture_demo_archive.mjs) · [14/14 QA report](reports/FORECAST_CAPTURE_ARCHIVE_QA.md) · [Drive CSV](https://drive.google.com/file/d/1EBX9s3C16ZRkbLDpwfYVmgV_7Tw3LRCn/view?usp=drivesdk) · [Drive builder](https://drive.google.com/file/d/1Wkg5-FB2pDwe4h7uqbhGn2a4VTaW-Hbg/view?usp=drivesdk) · [Drive validator](https://drive.google.com/file/d/1y2R3ISujxkNOGIZysclawoYB4wUvaMWR/view?usp=drivesdk) · [Drive QA](https://drive.google.com/file/d/1EODWWBJxWVPxhCGjjQ6qYXfMlUawKE94/view?usp=drivesdk)

## D2C unit economics

- [Methodology](docs/D2C_UNIT_ECONOMICS.md) · [Drive copy](https://drive.google.com/file/d/1r1KAjXCLb133ODeTBH6QSq9Cs-n6ckBd/view)
- [Synthetic data extract](data/d2c_unit_economics_synthetic.csv) · [Drive CSV](https://drive.google.com/file/d/1xrGQE3YeNJA4dqVD7Fa2Nct6x4TJUjo_/view)
- [Automated validator](scripts/validate_d2c_unit_economics.mjs) · [Drive validator](https://drive.google.com/file/d/1neCA_5JjXwKSicpr8E2mGshFJa4x0x8P/view) · [QA report](reports/D2C_UNIT_ECONOMICS_QA.md) · [Drive QA](https://drive.google.com/file/d/1uZjki-UQvXn3IFOhkSnx1V3HWyWVZgl2/view)
- [Native D2C Unit Economics Sheet](https://docs.google.com/spreadsheets/d/1nTEJJ9iBvxne0hCjGSDoHKaWgR_pqiMqgXYaTqGgbik/edit?usp=drivesdk)
- Base illustration: CAC VND130k, LTV contribution VND93.6k, LTV/CAC 0.72x and payback 3.33 orders; all six native controls PASS. Inputs remain synthetic and the hurdle is illustrative.


## Public guidance proxy (VNM FY2018–FY2025)

- [Methodology](docs/VNM_PUBLIC_GUIDANCE_PROXY.md) · [Synthetic/proxy dataset](data/vnm_public_guidance_proxy_2018_2025.csv) · [Validator](scripts/validate_public_guidance_proxy.mjs) · [QA report](reports/VNM_PUBLIC_GUIDANCE_PROXY_QA.md) · [Drive QA](https://drive.google.com/file/d/17QXfKkUS127vGkdfn1Jx0zpIrPrmld7I/view)
- [Drive CSV](https://drive.google.com/file/d/1BW6zGnxS-m67lLPLKfZuJn-5M-d4elw-/view) · [Drive methodology](https://drive.google.com/file/d/1LOmPrCcFGBFUXsdw3hi7WXziebKxHRJL/view) · [Drive validator](https://drive.google.com/file/d/1Y1nBInfRASnSankqfgmvjzcx7KP7EFq_/view)
- 16 observations (revenue and PBT, FY2018–FY2025) produce aggregate Bias -2.63% and WAPE 3.14%.
- This is AGM/public guidance, not an internal forecast snapshot; every row is explicitly `PUBLIC_GUIDANCE_PROXY` and `gate_a_eligible=NO`.



- Site V6 release record: [GitHub source/deployment note](site/README.md) · [Drive mirror](https://docs.google.com/document/d/1WSaAd7YVTVclTnSKYoqqXdvxpK_GACSFc0cG-XJxXlY/edit?usp=drivesdk)

## Customer profitability and concentration

- [Methodology](docs/CUSTOMER_PROFITABILITY_METHODOLOGY.md) · [Synthetic customer P&L](data/customer_profitability_synthetic.csv) · [Validator](scripts/validate_customer_profitability.mjs) · [10/10 QA report](reports/CUSTOMER_PROFITABILITY_QA.md)
- [Drive customer P&L](https://drive.google.com/file/d/1S9zo-2x90wd3kHCQE-3HnKgzXf7EiQs4/view?usp=drivesdk) · [Drive methodology](https://drive.google.com/file/d/1-fX1ha3FRjueADxB6JKwoJVHUOySauZ9/view?usp=drivesdk) · [Drive validator](https://drive.google.com/file/d/1aVU-W46JXXZ6_ZgnPpBQxzE-QYIab3th/view?usp=drivesdk) · [Drive QA](https://drive.google.com/file/d/18F5b6jsL8MMppfDfqu7VIe7zM8owYqnX/view?usp=drivesdk)
- The layer separates gross-to-net leakage, contribution, DSO and working-capital cost. C06 is intentionally a high-revenue / low-margin / long-DSO review account; all values are synthetic rehearsal evidence.


The derived decision layer adds [concentration and channel analysis](docs/CUSTOMER_PROFITABILITY_ANALYSIS.md), [summary JSON](data/customer_profitability_summary.json) and [14/14 QA](reports/CUSTOMER_PROFITABILITY_ANALYSIS_QA.md).
## Inventory quality, aging, shrinkage and wastage

- [Methodology](docs/INVENTORY_QUALITY_METHODOLOGY.md) · [Synthetic schedule](data/inventory_quality_synthetic.csv) · [Validator](scripts/validate_inventory_quality.mjs) · [9/9 QA report](reports/INVENTORY_QUALITY_QA.md)
- [Drive schedule](https://drive.google.com/file/d/1PvM1CCVqGh6kDiftBQyzfHAz0kCphRTi/view?usp=drivesdk) · [Drive methodology](https://drive.google.com/file/d/1v9mT08eADR_WtldPwKwwLGu_2UUZ0dON/view?usp=drivesdk) · [Drive validator](https://drive.google.com/file/d/1BqPUA4HrRqft33qyIaZQZJUqs-jBGBQ1/view?usp=drivesdk) · [Drive QA](https://drive.google.com/file/d/1CH3oTWcKdQAWY8bowHsOYfHK8Pmd7NFW/view?usp=drivesdk)
- The layer covers 36 rows across 12 months and three categories, with explicit aging buckets, obsolete reserve, write-off rate and shrinkage rate. It is synthetic rehearsal evidence and requires physical-count/expiry/accounting records before any real-company conclusion.

## Liquidity stress and revolver policy

- [Methodology](docs/LIQUIDITY_STRESS_METHODOLOGY.md) · [Synthetic schedule](data/liquidity_stress_synthetic.csv) · [Validator](scripts/validate_liquidity_stress.mjs) · [9/9 QA report](reports/LIQUIDITY_STRESS_QA.md)
- [Drive schedule](https://drive.google.com/file/d/1WLVSFiwDsRcySK-_E3_wFxpJpvTOec8I/view?usp=drivesdk) · [Drive methodology](https://drive.google.com/file/d/1YHE1Y3x-AdblXZumk9QBztbUwwxGHcEf/view?usp=drivesdk) · [Drive validator](https://drive.google.com/file/d/1P45NxJoee3U_nZbKwbYE_2hiCdiILTVN/view?usp=drivesdk) · [Drive QA](https://drive.google.com/file/d/1xjKSAh22zFGbgUIT3foYe-NbjAMmJS7t/view?usp=drivesdk)
- Synthetic rehearsal: BASE ends with VND5,280m cash and VND6,580m headroom; DOWNSIDE reaches the revolver limit in October and ends December with negative VND740m headroom. The breach is intentionally visible and is not a real-company financing conclusion.

## MCH credit-screening extension

- [Finance-analyst credit memo](reports/MCH_CREDIT_MEMO_FINANCE_ANALYST.md) · [Drive mirror](https://docs.google.com/document/d/15h8U_55cR5MBZV5KewQMvyJ6bjtVahKO0V5rXn-oXZQ/edit?usp=drivesdk)
- Lender-style view: WATCH / CONDITIONAL SUPPORT. FY2025 equity ratio is 54.9%, but CFO/PAT fell to 31.5%; debt-service capacity remains unproven until debt, interest, maturity and working-capital schedules are provided.
- Automated credit-memo trend QA: [15/15 checks PASS](reports/MCH_CREDIT_MEMO_QA.md) · [validator](scripts/validate_mch_credit_memo.mjs) · [Drive QA Doc](https://docs.google.com/document/d/1LdV0ricHr9pr-sX1fN6JS6-znpUkToa15FsqrIG-rsc/edit?usp=drivesdk) · [Drive validator](https://docs.google.com/document/d/1NXMt_uXLPG0M0RQizozP7bCWY5vqXxzMuAxNgeA4YD0/edit?usp=drivesdk).

## M&A / strategic stretch

- [Synthetic M&A accretion/dilution case](docs/MNA_ACCRETION_DILUTION.md)
- [Forecast data](data/mna_accretion_dilution_synthetic.csv) · [Sensitivity grid](data/mna_accretion_dilution_sensitivity.csv)
- [Automated validator](scripts/validate_mna_accretion_dilution.mjs) · [QA report](reports/MNA_ACCRETION_DILUTION_QA.md)
- Base screen: 8.5x entry EBITDA, Year-2 EPS accretion 17.16%, deal NPV VND 28.39bn; Year-1 dilution is -0.46% after integration costs.
- Evidence class is SYNTHETIC / REHEARSAL; confirmatory diligence, purchase accounting and leverage modelling remain required before any real-world recommendation.


Drive mirror for M&A extension:
- Data: https://drive.google.com/file/d/1LK-YloDyk2iXqoW_XsFflkYrb4h6a224/view and https://drive.google.com/file/d/1kv60z5MXY4wghumtHvg3MqroCy-vJCyT/view
- Methodology: https://drive.google.com/file/d/1gwEWr1hIQ0XhNWP23GkrAzLBRqd6DcOe/view
- QA: https://drive.google.com/file/d/1cyt24IdL7Y8SlP97s8Qk_tt1FZsFEaOg/view
- Validator: https://drive.google.com/file/d/1kGdGkWhgMpSEvpmEsGAhflB4qC92hNmy/view


- Native M&A model: https://docs.google.com/spreadsheets/d/1GKGSKu1QpXJau_zCub5Sg7oi-VEugclP8Roor1GET5k/edit?usp=drivesdk (Assumptions, Forecast, Sensitivity, Checks; overall control status PASS).


## Final external-gates handoff

- [Execution handoff](docs/FINAL_EXTERNAL_GATES_HANDOFF.md) · [Drive copy](https://drive.google.com/file/d/1QGZOL27pumhK1z0UFE1WQ_cN0IjZ5bg7/view)
- [Live snapshot submission template](data/forecast_snapshot_live_submission_template.csv) · [Drive template](https://drive.google.com/file/d/1WQ_9L7JrbogUjhytealtfeJnXekRJqqu/view)
- The handoff specifies the exact evidence bundle, acceptance sequence, hard stops and release naming for Gate A (live pre-close forecast accuracy) and Gate B (native Power BI Desktop).

- [External-gates execution pack](docs/EXTERNAL_GATES_EXECUTION_PACK.md) · [Drive copy](https://drive.google.com/file/d/1Xk7cQS4wMxNVlt_pmL_bh2O8P0K3t67m/view) — field-level intake, eligibility, QA, RACI and release checklist.
- [Gate A/B user-input checklist](docs/GATE_A_B_USER_INPUT_CHECKLIST.md) · [Drive copy](https://docs.google.com/document/d/13XgQTTqVLCecLTpp7uiNdu9RL6k3TYYFp40VVffoGSs/edit?usp=drivesdk) — exact fields, evidence files and acceptance rules needed to close the two external gates.

### Gate-ready intake and evidence contracts

- Gate A now has a machine-readable [governance schema](schemas/forecast_snapshot_live.schema.json), [structural unit fixture](data/forecast_snapshot_live_unit_test.csv) and [live-submission validator](scripts/validate_live_forecast_submission.mjs). Fixture mode returns `FIXTURE_PASS_NOT_LIVE`; `--mode=live` requires `LIVE_INTERNAL` evidence, non-synthetic source URLs, approval fields and at least one eligible frozen row before releasing observed Bias/WAPE.
- Gate B now has a machine-readable [QA-01–QA-18 evidence log](powerbi/QA_EVIDENCE_LOG_TEMPLATE.csv) and [evidence validator](scripts/validate_powerbi_qa_evidence.mjs). A PASS row is rejected unless observed value, evidence reference, reviewer and execution timestamp are recorded; a FAIL row must carry an owner, remediation and retest date.
- Drive mirrors: [latest source ZIP (site-gate release)](https://drive.google.com/file/d/1zNXpV56WwOlk3A4PD-PNoQScRDsfBnjO/view), [prior source ZIP at commit 0fce808](https://drive.google.com/file/d/1K_6ARYeSIIgzU1oiCJo3eJj_AM_iaI2S/view), [forecast fixture](https://drive.google.com/file/d/1GoatFUjdypKBn_579sttiBRFEv2ps22i/view), [forecast schema](https://drive.google.com/file/d/12Z7gGOiGTlfEDiv_0dpHCq9Ktf2xIWhw/view), [forecast validator](https://drive.google.com/file/d/1z26_vOP_wKsPpEpFhy4XYIoUIQolePuw/view), [Power BI QA log](https://drive.google.com/file/d/1bUIDkqafEQEMfiPhFfd1eg6lrTrKxAa6/view), [Power BI QA validator](https://drive.google.com/file/d/1kL0ulqiiFsf_ogrRPqz10WQ7B8y4CxSs/view).


- [Candidate application + CV build pack](docs/CANDIDATE_APPLICATION_INTAKE_AND_CV_BUILD_PACK.md) · [Drive copy](https://drive.google.com/file/d/1vZmLitH1CI-uVAoJmLil1P_tVHZ0MvwT/view) — candidate intake, role variants, ATS matrix and interview conversion.

## One-page CV draft

- [Finance Analyst / Junior FP&A CV draft](docs/FINANCE_ANALYST_CV_ONE_PAGE.md) · [Drive copy](https://drive.google.com/file/d/1rRpc9qNKcia0MeckGhqzrVnJ_iyed7RB/view)
- [Finance-first one-page CV V2](docs/FINANCE_ANALYST_CV_ONE_PAGE_V2.md) · [Drive copy](https://docs.google.com/document/d/1pf5jUlWAajDPUj4Rs4GL6xnWyAKi_kXPLVLy59lIviU/edit?usp=drivesdk) · [Evidence map](docs/CV_EVIDENCE_MAP.md) · [Drive evidence map](https://docs.google.com/document/d/1YjloTkCbzTMCfOO19O1BVf5M0SOXxWFzJx7i0QGHLus/edit?usp=drivesdk)
- Bullets are restricted to validated evidence and explicitly label synthetic/public-guidance outputs; replace bracketed personal fields before use.


## Master-plan evidence matrix

- [Machine-readable evidence matrix](data/master_plan_evidence_matrix.csv) · [Validator](scripts/validate_master_plan_evidence_matrix.mjs) · [QA report](reports/MASTER_PLAN_EVIDENCE_MATRIX_QA.md)
- [Drive matrix](https://drive.google.com/file/d/1yqiUFL1p6KT2WeXQNP2nIW1RXnO5PlyX/view) · [Drive validator](https://drive.google.com/file/d/1gz9jURxhEqkunS-z8lE_O2FNhfoxZHHI/view) · [Drive QA](https://drive.google.com/file/d/1-tQP0Dmj7n-LVSj154DF-iUP2KffBFcn/view)
- Current audit: 28 requirement rows, 20 mandatory-core rows, two external gates intentionally pending; validator PASS.


## Website strategic-finance release

- [Release note](reports/SITE_STRATEGIC_FINANCE_RELEASE_2026-08-30.md) · [Drive release note](https://drive.google.com/file/d/19mW_MT81z1CMeU9v39fBHBdiIcoLkEiQ/view)
- Production site version 7 includes Strategic Finance / M&A, CV quick-tour cards and direct Gate A/B contract links: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- Local build PASS; deployment succeeded. Shared UI-library lint warnings remain pre-existing and do not include new page-level errors.
- [Drive build archive](https://drive.google.com/file/d/1mfx-4W0cfZvGlcZv6TONO36H3rKXgqib/view) · [v3 page source](https://drive.google.com/file/d/1gJZOyXQKPoOuEHDmRLQezSn3GgULp0f-/view) · [v3 CSS source](https://drive.google.com/file/d/136FgoZ8gzarzNZAtXWmsHpMi6PYj53fb/view)


## Website runtime QA

- [Runtime/access-boundary QA](reports/SITE_RUNTIME_QA_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1z1LGW43fG94bEkFgbPZP3QVYQvYwxZt-/view)
- Source/build/deployment checks PASS for Sites version 7. The site intentionally remains owner-only; unauthenticated requests receive the sign-in screen. Visual click-through requires the owner session. See [site gate-contract release evidence](reports/SITE_GATE_CONTRACT_RELEASE_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/12dxwwLYD3CrWtajxKdciMoalt-CIzd0R/view).


## Archived master plan

- [Corporate Financial Analyst / FP&A master plan](docs/CORPORATE_FINANCIAL_ANALYST_FPA_MASTER_PLAN.md)
- [Drive archive](https://drive.google.com/file/d/1blpG-4CKWkjPpuwXwOFRkwI038XXMOnK/view)
- The detailed plan is now stored remotely; no local output copy is retained.


## Market-fit role alignment (30 Aug 2026)

- [Role-alignment matrix](docs/ROLE_ALIGNMENT_MATRIX.md) · [machine-readable CSV](data/role_alignment_matrix.csv) · [validator](scripts/validate_role_alignment_matrix.mjs)
- [Drive matrix](https://drive.google.com/file/d/1ngIE4Nw4-P-F6xtmxXvhUfVJPsOPVV6D/view) · [Drive CSV](https://drive.google.com/file/d/1kTabGOJ66UbXbWxv1bsbJwHqJmbKcoot/view) · [Drive validator](https://drive.google.com/file/d/1jsNPUb-F8mvESYmyUnT6Q3xlt5aFg9cu/view)
- Research maps recurring Vietnam hiring signals—planning/forecasting, variance/PVM, profitability, working capital, business partnering, commercial ROI, modelling, controls, Power BI and communication—to concrete artifacts and CV phrases. Gate A and Gate B remain explicitly caveated.
- [Role-targeted CV variants](docs/CV_ROLE_VARIANTS.md) · [Drive copy](https://drive.google.com/file/d/1nfaqwK6J8_1A0O5wpLZhmakhXLrWgObh/view)

- [Latest full-depth execution status](docs/FULL_DEPTH_EXECUTION_BLUEPRINT.md) · [Drive copy](https://drive.google.com/file/d/1g3wdwx1baGRGW4kjbLJSTd8Aoy1ZgsW0/view)
- [Latest data-acquisition status](docs/DATA_ACQUISITION_STATUS.md) · [Drive copy](https://drive.google.com/file/d/1kiG1GIw7OP1RFNwyMniADYY0_UM3rBn-/view)
- [Final QA and handoff](docs/FINAL_QA_AND_HANDOFF_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1xQIm44FZnwH_Xdhv4vp8sAD9OHENY2Zh/view) · [Current-state addendum](reports/FINAL_QA_HANDOFF_ADDENDUM_2026-08-30.md) · [Drive addendum](https://drive.google.com/file/d/1TZ_1HGzvO-u-O96nAtPzR95DYjn0pZNR/view?usp=drivesdk)
- [Reproducible QA runner](docs/REPRODUCIBLE_QA_RUNNER.md) · [Runner script](scripts/run_finance_qa.mjs) · [Drive guide](https://drive.google.com/file/d/1A0oiAWHr2E2DpLPapQneAzKTKF6D5w-H/view) · [Drive script](https://drive.google.com/file/d/13TxmloAohyUMgor4IJyuJnyxVCt0DJtR/view)
- [Promotion/pricing/allocation methodology](docs/PROMOTION_PRICING_ALLOCATION_METHODOLOGY.md) · [Stretch-module QA report](reports/COMMERCIAL_STRETCH_MODULE_QA_2026-08-30.md) · [Drive QA](https://drive.google.com/file/d/1j-n0VoDMdzEZTWgV_C5jQVeQX7mtBttO/view)
- Promotion ROI now subtracts spend and applies a 25% hurdle; fixed-budget allocation now conserves the VND 4.35bn approved budget and checks capacity/max-increase constraints.
- [Pricing simulator synthetic data](data/pricing_simulator_synthetic.csv) · [validator](scripts/validate_pricing_simulator.mjs) · integrated workbook tab `Pricing_Simulator` · [Drive CSV](https://drive.google.com/file/d/1ztUZZTUNMoKIDiPsHheeVtPj0t7GPn5T/view) · [Drive validator](https://drive.google.com/file/d/1_WJXVSBdPOM4QCavzqFq5y9TF-3xuNWy/view)



### Latest evidence-layer update

QNS FY2021–FY2025 gross profit and owners' equity are now included from the readable FY2025 management summary table (pages 27–28), with evidence-tier flags preserved. See [QNS reported summary evidence](reports/QNS_REPORTED_SUMMARY_EVIDENCE_2021_2025.md) and [QNS source extract](data/qns_reported_summary_metrics_2021_2025.csv).
- [QNS evidence memo on Drive](https://docs.google.com/document/d/1gH1Gd9PR4-h-Q0tB-VzdXgFKn5LfjcGDEwzHI_lsU7g/edit) · [QNS summary Sheet on Drive](https://docs.google.com/spreadsheets/d/1N5Vwwp60war25MIBwpoPz2YaoB9d6OYDsgmJ6lqnXBo/edit) · [normalized panel Sheet](https://docs.google.com/spreadsheets/d/11v8XpRNMCkaWkhqakjxh1Ao3E0yTP4cLP3Z3Jmg7Owg/edit)


- [MCH OCR review decision](reports/MCH_OCR_REVIEW_DECISION_2026-08-30.md) · [Drive memo](https://docs.google.com/document/d/1gkr2Vu6W2aagw1UKev2lTWX97FALutV0uCrk_QWCTIg/edit) · [MCH review workbench](https://docs.google.com/spreadsheets/d/1eRWrYLyiXNsGQuqsPwXAjT3rodJJMzI9dmjj6OkcJRY/edit)

### Historical MCH latest-year candidate layer (superseded)
The FY2024–FY2025 16-row candidate layer is retained as an audit-trail artifact from the pre-approval stage. Visual sign-off is complete and the current approved layer is the separate FY2016–FY2025 supplement below. [MCH candidate reconciliation](reports/MCH_STATEMENT_CANDIDATE_RECONCILIATION_2024_2025.md) · [candidate CSV](data/mch_statement_candidates_2024_2025.csv) · [Drive candidate Sheet](https://docs.google.com/spreadsheets/d/1L8sRGR-4DI3bxE7ODqzjo9Bq18d4UjvADVUPjUDZKBE/edit) · [Drive reconciliation memo](https://docs.google.com/document/d/1HHWzjsW0I4PjyJYBsCawGx7_e141gLSESbodhpadU5s/edit)

- [MCH approved FY2016–FY2025 supplement](reports/MCH_APPROVED_STATEMENT_SUPPLEMENT_2024_2025.md) · [approved CSV](data/mch_statement_metrics_2024_2025_approved.csv) · [Drive Sheet](https://docs.google.com/spreadsheets/d/1a3crr3Je3U1q7tnCMgYH--ZimJFfh7EdCmdhsKQNbz8/edit) · [Drive memo](https://docs.google.com/document/d/1Ib__7FWjmtGFViexE-f__U2qCGx6xz3AK9qOTB8fLsw/edit)
- [MCH supplement QA](reports/MCH_STATEMENT_SUPPLEMENT_QA_2026-08-30.md) · [validator](scripts/validate_mch_statement_supplement.mjs) · [Finance-analyst trend layer](reports/MCH_FINANCE_ANALYST_TREND_2016_2025.md) · [Trend CSV](data/mch_finance_analyst_trend_2016_2025.csv) · [Drive trend Sheet](https://docs.google.com/spreadsheets/d/1AH5nMI6W4N6YGPjf3sLYxtNZSFBzehg7STkkKNPtAPM/edit?usp=drivesdk) · [Drive trend report](https://docs.google.com/document/d/1XcfSiyfblt666E3pFQFEWeVimLsDP4kVghHkcS7OgOY/edit?usp=drivesdk) · [Drive QA](https://docs.google.com/document/d/1nFRTVgw9K-U5JrgDpJ6xkWPPcq-oEoFR-u9_3A8LiMA/edit?usp=drivesdk) · [Drive validator](https://docs.google.com/document/d/1Rc4NbrjYmsdhBVLKkrWogT18Hzk7G6M9h1ACkOKGtQg/edit?usp=drivesdk)
- [MCH credit memo QA — 15/15 PASS](reports/MCH_CREDIT_MEMO_QA.md) · [Drive QA](https://docs.google.com/document/d/1LdV0ricHr9pr-sX1fN6JS6-znpUkToa15FsqrIG-rsc/edit?usp=drivesdk)

The approved MCH supplement now covers FY2016–FY2025 (80 rows, all eight metrics), after visual PDF review, statement tie-outs, balance-sheet checks and cash-flow confirmation. FY2017 is explicitly flagged as a comparative/corresponding-column year from the audited FY2018 filing. [approved CSV](data/mch_statement_metrics_2024_2025_approved.csv) · [reconciliation report](reports/MCH_APPROVED_STATEMENT_SUPPLEMENT_2024_2025.md) · [Drive Sheet](https://docs.google.com/spreadsheets/d/1a3crr3Je3U1q7tnCMgYH--ZimJFfh7EdCmdhsKQNbz8/edit)

- [Remaining-gates handoff](docs/REMAINING_GATES_HANDOFF_2026-08-30.md) · [Drive handoff](https://docs.google.com/document/d/1UNB4HHdVQJWOyaLo3W1szCd2v-tlYx4JWf1ItVur9cQ/edit?usp=drivesdk)
- [Gate A redacted-data request template](docs/GATE_A_INTERNAL_DATA_REQUEST_TEMPLATE_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1v3hxQHP7H8EE3LUJ8e-e4iig2z5-HXci/view?usp=drivesdk) · [Copy/paste Google Doc](https://docs.google.com/document/d/1HHKXilZVeQ9FfXj4jaTK_1KjNJkL0-fwQzXv67purIM/edit?usp=drivesdk)
- [Finance Analyst interview walkthrough](docs/INTERVIEW_WALKTHROUGH_FINANCE_ANALYST_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/16JeKPtMA_0kbz6n8376xemYznp3WUQ4H/view?usp=drivesdk)
- [Finance Analyst CV bullet bank](docs/FINANCE_ANALYST_CV_BULLET_BANK_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1PEycoK7tBPlmH1NfRT2342jtUdszWiRK/view?usp=drivesdk)
- Gate A, Gate B, FY2017 retrieval and CV personalization remain explicitly input-gated; no unsupported evidence is promoted.

## MCH source verification runbook

- [FY2017/FY2020 source verification runbook](docs/MCH_SOURCE_VERIFICATION_RUNBOOK_2026-08-30.md) · [Drive mirror](https://docs.google.com/document/d/1dQLpARQ3nV4qkt4DbFU4yCVVHQ7zSYO7rH-8c9C-Xtk/edit?usp=drivesdk) · [FY2017 indexed evidence memo](reports/MCH_FY2017_WEB_INDEX_EVIDENCE.md) · [CSV](data/mch_fy2017_web_index_evidence.csv) · [8/8 QA](reports/MCH_FY2017_WEB_INDEX_EVIDENCE_QA.md) · [Drive memo](https://drive.google.com/file/d/12fNf-xOHSYsnGxlmoVCQse-g-DSJse8y/view?usp=drivesdk) · [Drive CSV](https://drive.google.com/file/d/12DzqLsaAIHxWvVcaI06zjxW2j5YeoRI9/view?usp=drivesdk)
- Official annual-report URLs are preserved in the source registry. FY2020 standalone bytes are archived from the official HNX signed PDF as APPROVED with hash/size metadata and statement page anchors; FY2017 remains retrieval-gated. The runbook defines Drive archive, hash, page-review, tie-out and promotion rules; no unverified source is promoted.


## MCH financial-statement analysis / earnings quality

- [Analysis report](reports/MCH_FINANCIAL_STATEMENT_ANALYSIS_2026-08-30.md) · [dataset](data/mch_financial_statement_analysis_2016_2025.csv) · [validator](scripts/validate_mch_financial_statement_analysis.mjs) · [QA](reports/MCH_FINANCIAL_STATEMENT_ANALYSIS_QA.md)
- [Drive report](https://docs.google.com/document/d/1FgZurJC5pqdAwn9_jISfnujGavFtZAiXQl1klXsHMqQ/edit?usp=drivesdk) · [Drive dataset](https://drive.google.com/file/d/1VmufGdZqnW8UEsZzy_26fjZvOAqBTqws/view?usp=drivesdk) · [Drive validator](https://drive.google.com/file/d/1KLPbnCjNXvWTZBSz9DzlF9SNe2FiLCt-/view?usp=drivesdk) · [Drive QA](https://docs.google.com/document/d/1OHA7cUGLrRGbnFKgvZYX9i9cfEXUa-7VSAMfum9R0qs/edit?usp=drivesdk)
- The layer decomposes reported profit into margin, efficiency and capital-structure drivers and flags FY2025 cash conversion (CFO/revenue 6.98%) plus FY2024 equity-base sensitivity. All ratios are calculated and caveated; no standalone valuation claim is made.

- [Native Drive analysis Sheet](https://docs.google.com/spreadsheets/d/1f4o0myaW6ejjtRVIO_PPT_ODezJo0ANrTQPYxRQ58SI/edit?usp=drivesdk) — reviewer-facing table with one row per FY2016–FY2025 and formula-ready ratio columns.


## Peer financial-quality scorecard

- [Scorecard report](reports/PEER_FINANCIAL_QUALITY_SCORECARD_2026-08-30.md) · [CSV](data/peer_financial_quality_scorecard_2020_2025.csv) · [Validator](scripts/validate_peer_financial_quality_scorecard.mjs) · [QA](reports/PEER_FINANCIAL_QUALITY_SCORECARD_QA.md)
- The scorecard covers revenue/asset CAGR, FY2025 margins, equity ratio and CFO/PAT with source-record lineage. VNM is the only long-run trend candidate; QNS/KDC remain context-only and missing components stay blank.


## Monthly Business Review / CFO Operating Pack

- [Finance Analyst operating pack](reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md) · [KPI CSV](data/monthly_business_review_kpi_pack_2026-08-30.csv) · [Validator](scripts/validate_monthly_business_review.mjs) · [QA](reports/MONTHLY_BUSINESS_REVIEW_QA.md)
- [Drive native pack](https://docs.google.com/document/d/1C7joqU6Dsyued-Zc5HrFnrMXiLW3Bkks0iaevLcVbNs/edit?usp=drivesdk) · [Drive native KPI Sheet](https://docs.google.com/spreadsheets/d/1YWai5MSnAiRS2W9d0JXQsQ9soCZ2_odkvsR7S64-JmU/edit?usp=drivesdk) · [Drive raw KPI CSV](https://drive.google.com/file/d/1bbiHU9LbUrtpFdUfiUToegIiamqT-KnB/view?usp=drivesdk) · [Drive QA](https://drive.google.com/file/d/1fEdL0Bkl-TkvQKp7A36TFq2MUFS9-fS3/view?usp=drivesdk) · [Drive validator](https://drive.google.com/file/d/1kJwAUZDyq5dD9t7KNz4oLlwIRfLW6gID/view?usp=drivesdk)
- The pack adds an executive scenario table, actual-vs-budget/forecast bridge contract, PVM formulas, channel/customer/SKU profitability agenda, DSO/DIO/DPO cash triggers, owner-action tracker and a 15-minute reviewer script. All headline values remain proxy/derived until Gate A and production CoA mapping are supplied.


## Finance Analyst KPI dictionary

- [KPI dictionary and control contract](docs/FINANCE_ANALYST_KPI_DICTIONARY.md) · [CSV extract](data/finance_analyst_kpi_dictionary.csv) · [Validator](scripts/validate_finance_analyst_kpi_dictionary.mjs) · [QA](reports/FINANCE_ANALYST_KPI_DICTIONARY_QA.md)
- [Drive native dictionary](https://docs.google.com/document/d/1Fh2HWNnQ5b3vdCFaUfwfNEIwM9i8T9gDlgYYkrEUh7s/edit?usp=drivesdk) · [Drive native Sheet](https://docs.google.com/spreadsheets/d/1O8c8uy80hlzhEKxKwGpdV9PvYz_M0PvN8E38kpFeQK4/edit?usp=drivesdk) · [Drive CSV](https://drive.google.com/file/d/1V-kWmRU9fyTIe9JjUcw8nW54cf8udu2U/view?usp=drivesdk) · [Drive QA](https://drive.google.com/file/d/1BvG-LYPDLo_Ere_iHoM6qwkeax-M-ey9/view?usp=drivesdk) · [Drive validator](https://drive.google.com/file/d/1pxIzRF3MtaJRiQzTvg0X4oxlBCDe65fX/view?usp=drivesdk)


Validator maintenance note: the KPI dictionary validator threshold was aligned to the current 8,406-character report; CI now validates the canonical script at scripts/validate_finance_analyst_kpi_dictionary.mjs. Latest Drive validator copy: https://drive.google.com/file/d/1HJ9BUitYgbxe2tDzHwj29JqLWD8XfapW/view?usp=drivesdk


## Management recommendation register

- [Recommendation register](reports/MANAGEMENT_RECOMMENDATION_REGISTER_2026-08-30.md) · [CSV extract](data/management_recommendation_register_2026-08-30.csv) · [Validator](scripts/validate_management_recommendation_register.mjs) · [QA](reports/MANAGEMENT_RECOMMENDATION_REGISTER_QA.md)
- [Drive native register](https://docs.google.com/document/d/14dQcHGVRLWdVeVZ5faigCk8G15B5tbib_Q5qr87HhXU/edit?usp=drivesdk) · [Drive native Sheet](https://docs.google.com/spreadsheets/d/1moxRhlVwQyMHCXoGLymylFkDRmD3Syso5JZS1uvrI7I/edit?usp=drivesdk) · [Drive CSV](https://drive.google.com/file/d/147oDhUogp7lKNykSyxXwQqr-djhfOkK8/view?usp=drivesdk) · [Drive QA](https://drive.google.com/file/d/1UznqGhyrtIHFJmDbdeek0PNiK3Sologs/view?usp=drivesdk) · [Drive validator](https://drive.google.com/file/d/1ThYoCPXQqFPWjAENE1RB4qbTCz5aLbhh/view?usp=drivesdk)
- Twelve recommendations translate model signals into decision, value equation, owner, guardrail and review date; evidence classes stay visible and no realized impact is claimed.


## Finance Business Partnering battle cards v2

- [Battle cards v2](docs/BATTLE_CARDS_V2.md) · [Decision-matrix CSV](data/battle_cards_v2.csv) · [Validator](scripts/validate_battle_cards_v2.mjs) · [QA](reports/BATTLE_CARDS_V2_QA.md)
- [Drive native cards](https://docs.google.com/document/d/1gmyvvRhvAaxdYcuEAyXA15r1r5XKx7mNxyQLN5qGA-8/edit?usp=drivesdk) · [Drive native Sheet](https://docs.google.com/spreadsheets/d/1PYlnzqPs4vr9PFKKULBvljEaEkMrvlEuWJpI7pGnqfY/edit?usp=drivesdk) · [Drive CSV](https://drive.google.com/file/d/1OkJ9d5_h2kRqDmdVefBLdU2uBQIFCx93/view?usp=drivesdk) · [Drive QA](https://drive.google.com/file/d/1Oz4mEQQ-Erhu-oIfcWr8LBB3HKvKD71d/view?usp=drivesdk) · [Drive validator](https://drive.google.com/file/d/15yk8sBtQKubQRudZwnWv2DVzuZEuaF91/view?usp=drivesdk)


## Master-plan coverage audit refresh

The [evidence matrix](data/master_plan_evidence_matrix.csv) and [QA report](reports/MASTER_PLAN_EVIDENCE_MATRIX_QA.md) now include the MBR pack, KPI dictionary, Management Recommendation Register and Battle Cards v2. Coverage remains 28 rows: 20 mandatory core, 3 conditional, 1 strategic stretch, 2 external gates and 2 recruiting deliverables. All core rows are complete or caveated; Gate A/B remain pending external evidence.


## Monthly close / forecast / business partnering calendar

- [Operating calendar and RACI](docs/MONTHLY_CLOSE_FORECAST_BUSINESS_PARTNERING_CALENDAR.md) · [Cadence CSV](data/monthly_close_forecast_business_partnering_calendar.csv) · [Validator](scripts/validate_monthly_close_calendar.mjs) · [QA](reports/MONTHLY_CLOSE_FORECAST_BUSINESS_PARTNERING_CALENDAR_QA.md)
- [Drive native calendar](https://docs.google.com/document/d/1OdG_wEBHp0Ho8CxuItYp68hYelavC5V6up4qd-lDR4Y/edit?usp=drivesdk) · [Drive native Sheet](https://docs.google.com/spreadsheets/d/1ZQgxnPRXgfSkp-Eml35X2ql074BqUz8m3FVsBsr9MPc/edit?usp=drivesdk) · [Drive CSV](https://drive.google.com/file/d/16rUpEGqaIM6gcR4ooVFCgAXFQ476GDUI/view?usp=drivesdk) · [Drive QA](https://drive.google.com/file/d/1FFZmB5GgsOKYXn3CoR2VF-L0myeNBz5O/view?usp=drivesdk) · [Drive validator](https://drive.google.com/file/d/1cJ2ECf-tocWCmkZYGNmOe1TNMKW469GB/view?usp=drivesdk)
- The schedule covers WD-5 forecast freeze through WD+5 publication, with RACI, SLA, subledger tie-outs, PVM review, CFO sign-off and escalation rules.


## Recruiter deliverable index refresh

- [15-minute review path and release boundaries](docs/DELIVERABLE_INDEX_2026-08-29.md) · [Drive refresh copy](https://drive.google.com/file/d/1s60auQyHV58bWy2mjlGSuAtI5KLVMJVt/view?usp=drivesdk)
- The review path now orders site → FP&A model → MBR → recommendation register → KPI dictionary → battle cards → close calendar → public/strategic extensions.


## Monte Carlo risk overlay

- [Risk overlay report](reports/MONTE_CARLO_RISK_OVERLAY_2026-08-30.md) · [Output CSV](data/monte_carlo_risk_overlay_2026-08-30.csv) · [Builder](scripts/build_monte_carlo_risk_overlay.mjs) · [Validator](scripts/validate_monte_carlo_risk_overlay.mjs) · [QA](reports/MONTE_CARLO_RISK_OVERLAY_QA.md)
- [Drive native report](https://docs.google.com/document/d/1vm6paEerCLN20Bt4q5q8bAKz8YEnEE6Ilkf2DIjubs0/edit?usp=drivesdk) · [Drive native output Sheet](https://docs.google.com/spreadsheets/d/1HvW-ewvUj05SFCmA4ljQjeDYtKg5m0dk-Dc_eph3_kY/edit?usp=drivesdk) · [Drive CSV](https://drive.google.com/file/d/1cKerh2MZogeJXx9mmVlC6D311KNWT68j/view?usp=drivesdk) · [Drive builder](https://drive.google.com/file/d/13cuQBTTYxggb6ADqdGtG52s5THmxYc6u/view?usp=drivesdk) · [Drive validator](https://drive.google.com/file/d/1gcqwaHwRLC2rHnp8UapwdKRc7za4iumP/view?usp=drivesdk) · [Drive QA](https://drive.google.com/file/d/1g6Ey6lUpOJb3ZqVII2rIPT1ml9_Mbq42/view?usp=drivesdk)
- The overlay runs 5,000 deterministic draws, reports P05/P25/P50/P75/P95, downside breach probabilities and a joint-downside probability. It is explicitly synthetic and independent-assumption limited.


Monte Carlo reproducibility note: the builder writes real newline-delimited CSV output and CI diffs the rebuilt 5,000-draw file against the committed output. Latest Drive builder copy: https://drive.google.com/file/d/1mz5iDcReO_kpMc0e-62M7LUwWTh6T2MF/view?usp=drivesdk


Monte Carlo validator maintenance: report non-triviality threshold is aligned to the 3,788-character risk memo; latest Drive validator copy: https://drive.google.com/file/d/1dRih4ruQ6H35xWtKTZbH3trqcEdByj4-/view?usp=drivesdk


Monte Carlo QA hardening: the seeded builder is rerun in CI and the committed output is validated; a standalone comparator remains archived for local/reviewer reproduction. Drive comparator: https://drive.google.com/file/d/1eDx_fLi36b8pm3NAA3D1TdG0GwIsZ21S/view?usp=drivesdk

## Operational Driver Tree & Unit Economics (Module F)

- Contract: [docs/OPERATIONAL_DRIVER_TREE_UNIT_ECONOMICS.md](docs/OPERATIONAL_DRIVER_TREE_UNIT_ECONOMICS.md)
- Machine-readable register: [data/operational_driver_tree_unit_economics.csv](data/operational_driver_tree_unit_economics.csv)
- QA: [reports/OPERATIONAL_DRIVER_TREE_UNIT_ECONOMICS_QA.md](reports/OPERATIONAL_DRIVER_TREE_UNIT_ECONOMICS_QA.md)
- Native Drive report: https://docs.google.com/document/d/1oN-nFippLlBKEXKKEsFz7tSoWkT2w-QRVDi-exTlFd0/edit?usp=drivesdk
- Native Drive register: https://docs.google.com/spreadsheets/d/1xe2FNuB2Twf0_OvCnTQ8MaQb4U9BtBBLm7epoo9bnkk/edit?usp=drivesdk

The module maps revenue, gross-to-net, contribution, inventory, working capital, customer and D2C drivers to owners, guardrails and decisions. It includes a source-to-metric contract, reconciliation controls, scenario labelling and a monthly finance cadence. All case inputs remain SIMULATED / DERIVED until approved source data exists.

## OPEX and headcount planning

[Module](docs/OPEX_HEADCOUNT_PLANNING_MODULE.md) · [Synthetic data](data/opex_headcount_planning_synthetic.csv) · [QA](reports/OPEX_HEADCOUNT_PLANNING_QA.md)

The module links opening headcount, hires/exits, payroll, benefits, bonus and non-payroll spend to budget and forecast variance. It is a SIMULATED / DERIVED FP&A rehearsal, not real company evidence.

## CAPEX and fixed-asset planning

[Module](docs/CAPEX_FIXED_ASSET_PLANNING_MODULE.md) · [Synthetic data](data/capex_fixed_asset_planning_synthetic.csv) · [QA](reports/CAPEX_FIXED_ASSET_PLANNING_QA.md)

The module links approval, commitment, cash payment, depreciation, benefits and payback by project. It is SIMULATED / DERIVED and not evidence of realized company investment returns.


## Latest website release

- Site V9 now surfaces the customer-economics decision lens with concentration, after-WC contribution and C06 review signal: [release record](reports/SITE_V9_RELEASE_RECORD_2026-08-30.md) · [Drive release record](https://drive.google.com/file/d/1vZn_kPRFlURjye_3Bbxikq62BWVUy1BK/view?usp=drivesdk).
- Production: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
