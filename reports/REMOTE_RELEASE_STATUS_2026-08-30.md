# Remote Release Status — 2026-08-30

## Storage policy

All project data, source code, QA scripts and reviewer-facing artifacts are committed to the GitHub repository and/or mirrored to the Google Drive project archive. The repository excludes raw official reports; those remain in the private Drive archive.

## Latest remote sync

The latest GitHub `main` content includes the site gate-contract release and the refreshed release index (see the repository commit history for the current SHA). The recruiter site operating-finance-system release is Sites version 8. V8 release record: [GitHub](reports/SITE_V8_RELEASE_RECORD_2026-08-30.md) · [Drive](https://drive.google.com/file/d/1p3gSEo7gkH_skLniiMFK96SgBnk1aSaO/view?usp=drivesdk). The V8 source archive is [VN_FINANCE_SITE_V8_OPERATING_FINANCE_SYSTEM_2026-08-30.tar](https://drive.google.com/file/d/1o7GqTKvV3K5uLu4rQ9R-0A8n32pqte4L/view?usp=drivesdk); normalized peer additions and later QA updates remain mirrored individually in GitHub and Drive.

## Newly closed evidence in this release

| Area | GitHub evidence | Drive evidence | Status |
|---|---|---|---|
| VNM public-guidance proxy | data/vnm_public_guidance_proxy_2018_2025.csv, docs/VNM_PUBLIC_GUIDANCE_PROXY.md, scripts/validate_public_guidance_proxy.mjs, reports/VNM_PUBLIC_GUIDANCE_PROXY_QA.md | CSV, methodology, validator and QA report | PASS; 16 observations, Bias -2.63%, WAPE 3.14%; not Gate-A eligible |
| D2C unit economics | data/d2c_unit_economics_synthetic.csv, docs/D2C_UNIT_ECONOMICS.md, scripts/validate_d2c_unit_economics.mjs | Native Sheet plus CSV, methodology, validator and QA report | PASS; six native controls |
| Portable Power BI handoff | powerbi/PBIP_SOURCE_MANIFEST.json, powerbi/PBIP_SOURCE_HANDOFF.md, scripts/validate_pbip_source_manifest.mjs | Manifest, handoff and validator copies | PASS; 5 dimensions, 9 facts, 17 relationships, 6 pages, 18 QA definitions |
| Continuous QA | .github/workflows/finance-qa.yml | CI rehearsal report | PASS; CI now runs forecast leakage, frozen archive, peer, VNM, D2C, public-guidance, PBIP manifest and contract checks |
| MCH credit screening | reports/MCH_CREDIT_MEMO_FINANCE_ANALYST.md, reports/MCH_CREDIT_MEMO_QA.md, scripts/validate_mch_credit_memo.mjs | Memo, QA report and validator are mirrored to Drive | PASS; lender-style WATCH / CONDITIONAL SUPPORT with explicit debt-service limitation; trend QA 15/15 |
| QNS/KDC basis bridge | reports/PEER_BASIS_PERIMETER_BRIDGE_2026-08-30.md, data/peer_basis_perimeter_bridge_2016_2025.csv, scripts/validate_peer_basis_perimeter_bridge.mjs, reports/PEER_BASIS_PERIMETER_BRIDGE_QA.md | Report, native Sheet, validator and QA report mirrored to Drive | PASS; 12/12 controls; segmented within-basis CAGRs; full-period splice remains blocked |
| QNS/KDC adjustment feasibility | reports/PEER_BASIS_ADJUSTMENT_FEASIBILITY_2026-08-30.md, data/peer_basis_adjustment_feasibility_2026-08-30.csv, scripts/validate_peer_basis_adjustment_feasibility.mjs, reports/PEER_BASIS_ADJUSTMENT_FEASIBILITY_QA.md | Report, native ledger Sheet, validator and QA report mirrored to Drive | PASS; 10/10 controls; exact missing bridges documented; adjusted full-period CAGR remains blocked |
| Gate A/B intake | docs/GATE_A_B_USER_INPUT_CHECKLIST.md | User-input checklist mirrored to Drive | READY; exact fields, evidence files and acceptance rules documented; gates remain external |

## Current archive authority

The reviewer should use the [Drive Archive Authority Map](../docs/DRIVE_ARCHIVE_AUTHORITY_MAP_2026-08-30.md) and the [current Deliverable Index](../docs/DELIVERABLE_INDEX_2026-08-29.md) as the entry points. Historical Site V6/V7 records and earlier raw handoffs remain retained for audit chronology only.

## MCH FY2017 indexed evidence

The official company FY2017 report is preserved as an `INDEXED_ONLY` eight-metric evidence layer with 8/8 QA; standalone bytes/hash and page-level tie-outs remain pending. [GitHub memo](MCH_FY2017_WEB_INDEX_EVIDENCE.md) · [CSV](../data/mch_fy2017_web_index_evidence.csv) · [QA](MCH_FY2017_WEB_INDEX_EVIDENCE_QA.md) · [Drive memo](https://drive.google.com/file/d/12fNf-xOHSYsnGxlmoVCQse-g-DSJse8y/view?usp=drivesdk) · [Drive CSV](https://drive.google.com/file/d/12DzqLsaAIHxWvVcaI06zjxW2j5YeoRI9/view?usp=drivesdk) · [source runbook](../docs/MCH_SOURCE_VERIFICATION_RUNBOOK_2026-08-30.md).

## Explicit remaining gates

1. Gate A: add at least one approved real-company forecast snapshot created before actual close, with model version, cutoff timestamp, approver and actual-availability date. Until then, the public-guidance proxy and synthetic fixture must not be described as internal forecast accuracy.
2. Gate B: open the model in Power BI Desktop, execute QA-01 through QA-18, save the native .pbix and upload the binary plus visual evidence to Drive. The PBIP manifest is a portable source scaffold, not a native PBIX.

## Market-fit role alignment

The 30 Aug release adds a source-backed Vietnam hiring matrix for Junior FP&A/Finance Analyst, Business Finance/Commercial Finance Analyst and Finance Data Analyst signals. [GitHub matrix](../docs/ROLE_ALIGNMENT_MATRIX.md) · [CSV](../data/role_alignment_matrix.csv) · [Drive copy](https://drive.google.com/file/d/1ngIE4Nw4-P-F6xtmxXvhUfVJPsOPVV6D/view). The matrix preserves the same evidence boundary as the model: synthetic and public-guidance work are labelled, while Gate A and Gate B remain open.

Role-targeted CV variants are also archived for the same three role families: [GitHub](../docs/CV_ROLE_VARIANTS.md) · [Drive](https://drive.google.com/file/d/1nfaqwK6J8_1A0O5wpLZhmakhXLrWgObh/view).

The repository now includes a cross-platform [finance QA runner](../scripts/run_finance_qa.mjs) and [usage guide](../docs/REPRODUCIBLE_QA_RUNNER.md) (Drive copies: [script](https://drive.google.com/file/d/13TxmloAohyUMgor4IJyuJnyxVCt0DJtR/view), [guide](https://drive.google.com/file/d/1A0oiAWHr2E2DpLPapQneAzKTKF6D5w-H/view)). The runner definition now includes 19 repository-local checks, including the MCH OCR workbench, approved/template normalized-peer and QNS/KDC adjustment-feasibility validators. The established pre-addition rehearsal passed 15/15; the workbench validator separately passes the 59-row template and correctly fails an approval row missing reviewer/evidence, while the normalized-peer validators pass the 240-row approved export and 80-row blocked MCH template. Run the full 19-check runner on the next clean clone; it intentionally does not fabricate Gate A or Gate B.

- MCH OCR optional evidence expansion: [triage report](MCH_OCR_REVIEW_TRIAGE_2026-08-30.md), [flag CSV](../data/mch_ocr_triage_flags.csv) and [review workbench template](../data/mch_ocr_review_workbench_template.csv) are archived; the Drive triage document and Workbench Sheet retain page-level reviewer/correction fields. No OCR row is approved automatically. Drive also contains the [workbench CSV](https://drive.google.com/file/d/1t2qH7YEmGxJNROT4VXRHrUTqAH-zFV1a/view), [validator](https://drive.google.com/file/d/1rXeXg9mCkgoPHim5yK7U-9pmYDJdeNp-/view) and [triage flags CSV](https://drive.google.com/file/d/1D4AZBz-IK4TrenRLtgtBcN5csnmC4m6Z/view).

## Peer comparability decision

The approved panel is now governed by a comparability decision memo: [GitHub memo](PEER_COMPARABILITY_DECISION_2026-08-30.md) · [Drive memo](https://docs.google.com/document/d/184FPk4ZcPaWVtWm4qqRsvsG3RO0D_Lv9tS46yKXqCGk/edit?usp=drivesdk). VNM is the clean long-run benchmark; QNS and KDC remain bounded context because revenue basis/perimeter changes prevent an unqualified full-period CAGR; MCH remains outside the 240-row core peer panel, but its separate FY2016–FY2025 statement supplement is now page-reviewed and approved with an explicit FY2017 comparative caveat.

## Normalized peer panel evidence

The peer panel now has a long-form, source-lineage-preserving export: [approved 240-row CSV](../data/normalized_peer_panel_approved_2016_2025.csv), [KDC FY2024–FY2025 exact statement supplement](../data/kdc_statement_metrics_2024_2025.csv) and [blocked 80-row MCH intake](../data/normalized_peer_panel_intake_template.csv). The [methodology](../docs/NORMALIZED_PEER_PANEL_METHODOLOGY.md) defines the company × FY × metric grain, blank-value semantics, source retention and comparability rules. The [validator](../scripts/validate_normalized_peer_panel.mjs) passes the approved export 18/18 and the template 14/14; the template remains intentionally blocked until page-level MCH review. Drive mirrors: [native approved Sheet](https://docs.google.com/spreadsheets/d/11v8XpRNMCkaWkhqakjxh1Ao3E0yTP4cLP3Z3Jmg7Owg/edit?usp=drivesdk), [approved CSV](https://drive.google.com/file/d/10TEXjoohSV4J75TpmTFvoWt8nVXgPnrd/view), [KDC supplement](https://drive.google.com/file/d/16TZWVvN6XgVneG_jlubnHa9jeFhXZVqR/view), [MCH template](https://drive.google.com/file/d/1oZS-UL-Z1oDPH4QJOLH1_JToTE9bUqN-/view), [methodology](https://drive.google.com/file/d/1ezRb7YYtgX13suCgF7ztwWvAoeCuaTW3/view), [approved QA](https://drive.google.com/file/d/1fCdlkBmkHrQOE4T9Mb2m59oTS5Ad_n3V/view) and [template QA](https://drive.google.com/file/d/1nHQV-8QtRwuGloCAGy4HfL19Cws_K0WQ/view).

The commercial stretch modules are now hardened:The commercial stretch modules are now hardened: [promotion ROI](../data/promotion_roi_synthetic.csv) subtracts promotion spend and applies a hurdle, [budget reallocation](../data/budget_reallocation_synthetic.csv) proves fixed-budget conservation, and [pricing simulator](../data/pricing_simulator_synthetic.csv) exposes elasticity, CM delta and break-even price. [Methodology](../docs/PROMOTION_PRICING_ALLOCATION_METHODOLOGY.md) · [QA report](../reports/COMMERCIAL_STRETCH_MODULE_QA_2026-08-30.md) · [Drive QA](https://drive.google.com/file/d/1j-n0VoDMdzEZTWgV_C5jQVeQX7mtBttO/view).

## Reviewer path

1. Start with README.md and the production website.
2. Open the Excel v2 CFO_Output and Checks tabs.
3. Trace a KPI to the source registry and methodology.
4. Inspect the frozen forecast archive and exclusion controls.
5. Open the PBIP handoff and run the validator.
6. Treat the two gates above as intentionally open external controls.


## Added in the forecast-performance extension

## Website release

The production recruiter site is now Sites version 8. It adds an Operating Finance System section linking MBR/KPI controls, the recommendation register, the WD-5→WD+5 close cadence and risk/planning extensions; the Forecast Performance section still keeps public-guidance metrics explicitly Gate-A-excluded. [V8 release evidence](reports/SITE_V8_RELEASE_RECORD_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1p3gSEo7gkH_skLniiMFK96SgBnk1aSaO/view?usp=drivesdk).

## PBIP Desktop execution checklist

## Interview conversion pack

A recruiter/interviewer-facing [Finance Analyst / FP&A talk track](../docs/FINANCE_ANALYST_INTERVIEW_TALK_TRACK.md) is now archived with a 90-second pitch, 15-minute walkthrough, STAR stories, evidence mapping and pushback answers. [Drive copy](https://drive.google.com/file/d/1qyKG5FJW5_EdKyu10l-xWUyOU9i5tLRy/view).

A detailed external-execution checklist is now archived: [GitHub checklist](../powerbi/PBIP_DESKTOP_EXECUTION_CHECKLIST.md) · [Drive checklist](https://drive.google.com/file/d/1DHh9LTaI0hnfd4Ebx62hChUIXuWr_IAG/view). It covers prerequisites, PBIP topology, semantic mapping, six pages, QA-01–QA-18, evidence naming and Gate-B release criteria.

The production recruiter site now has a Forecast Performance section with the public-guidance metrics and integrity boundary. [Release note](SITE_FORECAST_SECTION_RELEASE_2026-08-30.md) · [Drive release note](https://drive.google.com/file/d/1Cz5Hl0HH9YLLklKBHJ2FBlTdEyQWz6u9/view) · [source/build archive](https://drive.google.com/file/d/112Fy_UXh1LDXqZp6Dtv480rB03mxmZ8K/view).

- VNM public-guidance analysis report, deterministic JSON output, generator, validator and QA report are now committed and mirrored to Drive: [report](https://drive.google.com/file/d/1G7XgCuQ3MLza4NjetaCwRajPKdLsZQWN/view), [JSON](https://drive.google.com/file/d/1xF72I7FYa7T68e-NfC1aIeAnEXXRByht/view), [generator](https://drive.google.com/file/d/1bvA-P3ihQbf10BZxc1C_IBOwZYgZyjng/view), [validator](https://drive.google.com/file/d/1UU6Ln2p2lnOb_oZ-pre5v_u5TMuv4O-5/view), [QA](https://drive.google.com/file/d/1aFj7k9rL8ERfcNzEbOq5D_9g5y5P0Kck/view).
- The extension reports metric/regime splits, Bias, WAPE, MAPE, within-2% rate, descriptive error bands and ranked misses; it remains public-guidance evidence and does not close Gate A.
- CI now regenerates and validates the analysis output from the source CSV on every push and pull request.


## M&A / strategic-stretch extension

The repository now includes a fully documented synthetic acquisition screen: [methodology memo](../docs/MNA_ACCRETION_DILUTION.md), [forecast data](../data/mna_accretion_dilution_synthetic.csv), [sensitivity grid](../data/mna_accretion_dilution_sensitivity.csv), [validator](../scripts/validate_mna_accretion_dilution.mjs) and [QA report](MNA_ACCRETION_DILUTION_QA.md). The base case is Year-2 EPS accretive by 17.16% and produces deal NPV of VND 28.39bn, while Year 1 is dilutive by -0.46% after integration costs. This is SYNTHETIC / REHEARSAL evidence and is not a substitute for live internal snapshots or a native PBIX.


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
- Gate A is now executable through the [governance schema](../schemas/forecast_snapshot_live.schema.json), [unit fixture](../data/forecast_snapshot_live_unit_test.csv) and [live validator](../scripts/validate_live_forecast_submission.mjs). Gate B is now executable through the [machine-readable QA evidence log](../powerbi/QA_EVIDENCE_LOG_TEMPLATE.csv) and [evidence validator](../scripts/validate_powerbi_qa_evidence.mjs).
- The historical repository source at commit `ac27e10` is retained as an earlier Drive ZIP snapshot(https://drive.google.com/file/d/1zNXpV56WwOlk3A4PD-PNoQScRDsfBnjO/view); the individual Gate A/B intake files are mirrored in the project root for quick review.


## One-page CV draft

- [Finance Analyst / Junior FP&A CV draft](docs/FINANCE_ANALYST_CV_ONE_PAGE.md) · [Drive copy](https://drive.google.com/file/d/1rRpc9qNKcia0MeckGhqzrVnJ_iyed7RB/view)
- Bullets are restricted to validated evidence and explicitly label synthetic/public-guidance outputs; replace bracketed personal fields before use.


## Master-plan evidence matrix

- [Machine-readable evidence matrix](data/master_plan_evidence_matrix.csv) · [Validator](scripts/validate_master_plan_evidence_matrix.mjs) · [QA report](reports/MASTER_PLAN_EVIDENCE_MATRIX_QA.md)
- [Drive matrix](https://drive.google.com/file/d/1yqiUFL1p6KT2WeXQNP2nIW1RXnO5PlyX/view) · [Drive validator](https://drive.google.com/file/d/1gz9jURxhEqkunS-z8lE_O2FNhfoxZHHI/view) · [Drive QA](https://drive.google.com/file/d/1-tQP0Dmj7n-LVSj154DF-iUP2KffBFcn/view)
- Current audit: 28 requirement rows, 20 mandatory-core rows, two external gates intentionally pending; validator PASS.


## Website strategic-finance release

- [Release note](reports/SITE_STRATEGIC_FINANCE_RELEASE_2026-08-30.md) · [Drive release note](https://drive.google.com/file/d/19mW_MT81z1CMeU9v39fBHBdiIcoLkEiQ/view)
- Production site version 8 includes Strategic Finance / M&A, the Operating Finance System, CV quick-tour cards and direct Gate A/B contract links: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- Local build PASS; deployment succeeded. Shared UI-library lint warnings remain pre-existing and do not include new page-level errors.
- [Drive build archive](https://drive.google.com/file/d/1mfx-4W0cfZvGlcZv6TONO36H3rKXgqib/view) · [v3 page source](https://drive.google.com/file/d/1gJZOyXQKPoOuEHDmRLQezSn3GgULp0f-/view) · [v3 CSS source](https://drive.google.com/file/d/136FgoZ8gzarzNZAtXWmsHpMi6PYj53fb/view)


## Website runtime QA

- [Runtime/access-boundary QA](reports/SITE_RUNTIME_QA_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1z1LGW43fG94bEkFgbPZP3QVYQvYwxZt-/view)
- Source/build/deployment checks PASS for Sites version 8. The site intentionally remains owner-only; unauthenticated requests receive the sign-in screen. Visual click-through requires the owner session. See [V8 release evidence](SITE_V8_RELEASE_RECORD_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1p3gSEo7gkH_skLniiMFK96SgBnk1aSaO/view?usp=drivesdk).


## Archived master plan

- [Corporate Financial Analyst / FP&A master plan](docs/CORPORATE_FINANCIAL_ANALYST_FPA_MASTER_PLAN.md)
- [Drive archive](https://drive.google.com/file/d/1blpG-4CKWkjPpuwXwOFRkwI038XXMOnK/view)
- The detailed plan is now stored remotely; no local output copy is retained.



### QNS reported-summary enrichment

QNS FY2021–FY2025 gross profit and owners' equity are now populated from the FY2025 annual-report management summary (pages 27–28). The evidence tier is explicit: reported annual-report summary, partially comparable, not audited statement-line extraction. Companion CSV/report are mirrored to Drive alongside the updated normalized panel.
- QNS evidence memo (Drive): https://docs.google.com/document/d/1gH1Gd9PR4-h-Q0tB-VzdXgFKn5LfjcGDEwzHI_lsU7g/edit
- QNS summary Sheet (Drive): https://docs.google.com/spreadsheets/d/1N5Vwwp60war25MIBwpoPz2YaoB9d6OYDsgmJ6lqnXBo/edit
- Updated normalized panel Sheet (Drive): https://docs.google.com/spreadsheets/d/11v8XpRNMCkaWkhqakjxh1Ao3E0yTP4cLP3Z3Jmg7Owg/edit
- QNS FY2020 gross profit (VND 2,051bn) and owners' equity (VND 6,605bn) were added as a separately sourced page-32 cross-check; no audited-statement claim is made.


- MCH remains intentionally blocked from the approved panel after a 59-row OCR review; the promotion gate and Drive memo are published for human follow-up.

- MCH FY2024–FY2025 candidate layer published: 16 rows, all eight normalized metrics, statement/balance-sheet tie-outs passing; visual sign-off remains pending. [MCH candidate reconciliation](reports/MCH_STATEMENT_CANDIDATE_RECONCILIATION_2024_2025.md) · [candidate CSV](data/mch_statement_candidates_2024_2025.csv) · [Drive candidate Sheet](https://docs.google.com/spreadsheets/d/1L8sRGR-4DI3bxE7ODqzjo9Bq18d4UjvADVUPjUDZKBE/edit) · [Drive reconciliation memo](https://docs.google.com/document/d/1HHWzjsW0I4PjyJYBsCawGx7_e141gLSESbodhpadU5s/edit)

- MCH FY2024–FY2025 approved supplement released after visual page review and tie-outs; it remains separate from the 240-row core panel; the separate FY2016–FY2025 supplement is now approved with the FY2017 comparative caveat.

- MCH approved supplement extended through FY2016–FY2025: 80 rows across ten years, all eight metrics, visual review, tie-outs and cash-flow confirmation complete. FY2017 retains the comparative/corresponding-column caveat from the audited FY2018 filing. [approved CSV](../data/mch_statement_metrics_2024_2025_approved.csv) · [reconciliation report](MCH_APPROVED_STATEMENT_SUPPLEMENT_2024_2025.md) · [Drive Sheet](https://docs.google.com/spreadsheets/d/1a3crr3Je3U1q7tnCMgYH--ZimJFfh7EdCmdhsKQNbz8/edit)

## Current status overlay

See [Final Status Overlay](reports/FINAL_STATUS_OVERLAY_2026-08-30.md) for the authoritative current-state index; it supersedes stale historical progress paragraphs where needed.

## Authoritative current-state corrections (2026-08-30)

The paragraphs above retain historical release notes for audit trail. Use this section and `reports/FINAL_STATUS_OVERLAY_2026-08-30.md` for current claims.

- Power BI portable contract: 5 dimensions, 9 facts, 17 relationships, 6 pages and 18 QA definitions. Native PBIX/Desktop evidence is still Gate B pending.
- Recruiter site: Sites version 8 is the current deployment; older version 5/6/7 paragraphs are historical notes.
- MCH FY2020 annual report: official HNX signed PDF archived in Drive (file `1ReM6B9SAprOJYsJd6hrLI7ycU_73rOOU`, 67 pages, 8,940,859 bytes, SHA-256 `3BB42FB2A5FC251075497885A66668C96311D8BABF32D85622C971DFE58B8366`), page-reviewed at PDF pages 30–34 / printed pages 59–67, and `APPROVED` in the source registry.
- MCH FY2017 annual report: remains `INDEXED_ONLY`; the official PDF bytes are not yet retrievable in this runtime. The audited FY2018 comparative/corresponding evidence remains the approved basis.
- [MCH source-verification runbook](../docs/MCH_SOURCE_VERIFICATION_RUNBOOK_2026-08-30.md) · [Drive mirror](https://docs.google.com/document/d/1dQLpARQ3nV4qkt4DbFU4yCVVHQ7zSYO7rH-8c9C-Xtk/edit?usp=drivesdk)
- [Remaining-gates handoff](../docs/REMAINING_GATES_HANDOFF_2026-08-30.md) · [Drive](https://docs.google.com/document/d/1UNB4HHdVQJWOyaLo3W1szCd2v-tlYx4JWf1ItVur9cQ/edit?usp=drivesdk)
- [Finance Analyst interview walkthrough](../docs/INTERVIEW_WALKTHROUGH_FINANCE_ANALYST_2026-08-30.md) · [Drive](https://drive.google.com/file/d/16JeKPtMA_0kbz6n8376xemYznp3WUQ4H/view)
- External gates remain: Gate A real internal snapshot/observed Bias-WAPE; Gate B native PBIX and QA-01–QA-18; CV personalization.
