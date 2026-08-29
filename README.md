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
- Website release update: [Forecast section release](reports/SITE_FORECAST_SECTION_RELEASE_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1Cz5Hl0HH9YLLklKBHJ2FBlTdEyQWz6u9/view). Production site now exposes a recruiter-facing forecast-performance section with explicit Gate A exclusion.
- Interview preparation: [Finance Analyst / FP&A talk track](docs/FINANCE_ANALYST_INTERVIEW_TALK_TRACK.md) · [Drive copy](https://drive.google.com/file/d/1qyKG5FJW5_EdKyu10l-xWUyOU9i5tLRy/view). Includes a 90-second pitch, 15-minute walkthrough, STAR stories and pushback answers.

## Peer panel review layer

- [Peer panel review status](docs/PEER_PANEL_REVIEW_STATUS.md)
- [Remote peer panel sheet](https://docs.google.com/spreadsheets/d/1HNViR2NV1KPu1H-ZYRADv8amwP1-kzY8QzvmcwT3csE/edit)
- Native tab `VNM_Longrun_Panel_2006_2025` exposes the full FY2006–FY2025 historical panel with derived ratios and basis-break flags.
- FY2021-FY2025 summary values are source-linked; blank cells remain review flags where statement-level validation is not complete.

## Peer and Power BI follow-through

- Calculated peer summary: data/peer_analyst_summary.csv
- Long-run comparability summary: data/peer_analyst_summary_longrun.csv
- Power BI implementation status: docs/POWER_BI_IMPLEMENTATION_STATUS.md
- Native PBIX creation is an explicit next action; no placeholder PBIX is claimed.

## Remote release status

- [Release-status record](reports/REMOTE_RELEASE_STATUS_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1xb_SyGeE5_vWnKEmRNtwd6u4ZZExc5RR/view?usp=drivesdk)
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
- Remote validation: 5 dimensions, 9 facts, 15 relationships, 6 report pages and 18 QA tests — PASS.
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

- [Definition-of-done evidence audit](docs/DEFINITION_OF_DONE_AUDIT.md) · [Drive copy](https://drive.google.com/file/d/1moblqlk6_MApvkIBSdluDBnxhqhwTqxI/view)

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


## One-page CV draft

- [Finance Analyst / Junior FP&A CV draft](docs/FINANCE_ANALYST_CV_ONE_PAGE.md) · [Drive copy](https://drive.google.com/file/d/1rRpc9qNKcia0MeckGhqzrVnJ_iyed7RB/view)
- Bullets are restricted to validated evidence and explicitly label synthetic/public-guidance outputs; replace bracketed personal fields before use.


## Master-plan evidence matrix

- [Machine-readable evidence matrix](data/master_plan_evidence_matrix.csv) · [Validator](scripts/validate_master_plan_evidence_matrix.mjs) · [QA report](reports/MASTER_PLAN_EVIDENCE_MATRIX_QA.md)
- [Drive matrix](https://drive.google.com/file/d/1yqiUFL1p6KT2WeXQNP2nIW1RXnO5PlyX/view) · [Drive validator](https://drive.google.com/file/d/1gz9jURxhEqkunS-z8lE_O2FNhfoxZHHI/view) · [Drive QA](https://drive.google.com/file/d/1-tQP0Dmj7n-LVSj154DF-iUP2KffBFcn/view)
- Current audit: 28 requirement rows, 20 mandatory-core rows, two external gates intentionally pending; validator PASS.


## Website strategic-finance release

- [Release note](reports/SITE_STRATEGIC_FINANCE_RELEASE_2026-08-30.md) · [Drive release note](https://drive.google.com/file/d/19mW_MT81z1CMeU9v39fBHBdiIcoLkEiQ/view)
- Production site version 3 now includes Strategic Finance / M&A and CV quick-tour cards: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- Local build PASS; deployment succeeded. Shared UI-library lint warnings remain pre-existing and do not include new page-level errors.
- [Drive build archive](https://drive.google.com/file/d/1mfx-4W0cfZvGlcZv6TONO36H3rKXgqib/view) · [v3 page source](https://drive.google.com/file/d/1gJZOyXQKPoOuEHDmRLQezSn3GgULp0f-/view) · [v3 CSS source](https://drive.google.com/file/d/136FgoZ8gzarzNZAtXWmsHpMi6PYj53fb/view)


## Website runtime QA

- [Runtime/access-boundary QA](reports/SITE_RUNTIME_QA_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1z1LGW43fG94bEkFgbPZP3QVYQvYwxZt-/view)
- Source/build/deployment checks PASS for Sites version 3. The site intentionally remains owner-only; unauthenticated requests receive the sign-in screen. Visual click-through requires the owner session.


## Archived master plan

- [Corporate Financial Analyst / FP&A master plan](docs/CORPORATE_FINANCIAL_ANALYST_FPA_MASTER_PLAN.md)
- [Drive archive](https://drive.google.com/file/d/1blpG-4CKWkjPpuwXwOFRkwI038XXMOnK/view)
- The detailed plan is now stored remotely; no local output copy is retained.


## Market-fit role alignment (30 Aug 2026)

- [Role-alignment matrix](docs/ROLE_ALIGNMENT_MATRIX.md) · [machine-readable CSV](data/role_alignment_matrix.csv) · [validator](scripts/validate_role_alignment_matrix.mjs)
- [Drive matrix](https://drive.google.com/file/d/1ngIE4Nw4-P-F6xtmxXvhUfVJPsOPVV6D/view) · [Drive CSV](https://drive.google.com/file/d/1kTabGOJ66UbXbWxv1bsbJwHqJmbKcoot/view) · [Drive validator](https://drive.google.com/file/d/1jsNPUb-F8mvESYmyUnT6Q3xlt5aFg9cu/view)
- Research maps recurring Vietnam hiring signals—planning/forecasting, variance/PVM, profitability, working capital, business partnering, commercial ROI, modelling, controls, Power BI and communication—to concrete artifacts and CV phrases. Gate A and Gate B remain explicitly caveated.
