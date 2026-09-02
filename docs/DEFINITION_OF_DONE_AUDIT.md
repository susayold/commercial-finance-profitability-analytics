# Definition-of-Done Audit — Commercial Finance & Profitability Analytics

> **Scope notice (2026-09-02):** This document is a historical audit retained for provenance. The active release is governed by the [Non-Power-BI handoff index](../reports/NON_POWERBI_HANDOFF_INDEX_2026-09-01.md) and [active execution plan](VNFINANCE_FPA_ACTIVE_EXECUTION_PLAN_NO_POWERBI_2026-09-02.md). References below to native Power BI / Gate B describe historical work only and do not block the current FP&A release.

Audit date: 2026-08-30  
Repository: `susayold/commercial-finance-profitability-analytics`  
Primary archive: [Google Drive project root](https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR)

This audit maps the user-provided master plan to evidence that a recruiter or finance reviewer can inspect. `Complete` means the artifact exists remotely and has passed the documented checks. `Pending external` means the design and handoff are ready but require an external input or desktop application; it is not represented as complete.

## Latest status overlay — 2026-08-30

- Historical peer extraction is closed for VNM FY2006–FY2020, QNS FY2016–FY2020 and KDC FY2016–FY2020; all 25 queue rows have statement metrics, page anchors and basis notes. Long-run ranking still requires the documented QNS revenue-basis and KDC perimeter caveats.
- The market-fit layer is complete: [role-alignment matrix](ROLE_ALIGNMENT_MATRIX.md), [machine-readable CSV](../data/role_alignment_matrix.csv) and [role-targeted CV variants](CV_ROLE_VARIANTS.md) are committed and mirrored to Drive.
- The current remote QA run passes the evidence matrix, role matrix, PBIP manifest, M&A, D2C, public-guidance, VNM long-run and peer validators. The recruiter site is deployed as Sites version 8 and the candidate application/CV and external-gates execution packs are now linked from the README. Gate A (genuine internal snapshot) and Gate B (native PBIX/Desktop QA) remain the only external release gates.
- Promotion ROI and fixed-budget allocation are now independently inspectable: spend is included in ROI, negative-CM stop-loss events are visible, and recommended channel budgets conserve the approved total. See [stretch-module QA](../reports/COMMERCIAL_STRETCH_MODULE_QA_2026-08-30.md).

## 1. Definition-of-done matrix

| Requirement | Evidence | Status | Verification note |
|---|---|---|---|
| Commercial P&L is formula-driven and reconciled | Excel v2, `Checks`, `CFO_Output`, [model contract](../powerbi/model_contract.json) | Complete | Nine model controls PASS; formula-error scan is zero |
| Actual, budget, forecast and prior year are separated | v2 tabs `Budget`, `Forecast_Versions`, `P&L`, `Variance_Bridge` | Complete | Scenario and version fields remain explicit |
| Product, customer, channel and region views reconcile | v2 profitability tabs + QA matrix QA-03 to QA-06 | Complete | Allocation and unattributed-balance treatment documented |
| PVM and margin bridges reconcile | `PVM_Bridge`, [PVM methodology](PVM_METHODOLOGY.md) | Complete | Residual is controlled and disclosed |
| Forecast is driver-based and version-controlled | `Forecast_Versions`, [forecast methodology](FORECAST_METHODOLOGY.md) | Complete | Freeze protocol is now documented in the close calendar |
| Forecast accuracy avoids future leakage | [Bias/WAPE script](../scripts/compute_forecast_accuracy.mjs), unit test, frozen demo fixture | Complete for synthetic fixture; live data pending | Native Sheet now has 27 FROZEN demo rows plus explicit leakage/not-eligible rows; live company snapshots must replace fixtures |
| Scenarios have explicit assumptions and sensitivities | `Scenario_Analysis`, [assumptions and limitations](ASSUMPTIONS_AND_LIMITATIONS.md) | Complete | Base, growth, margin-pressure and downside cases are labelled |
| Liquidity stress produces traceable cash / revolver impact | [liquidity methodology](LIQUIDITY_STRESS_METHODOLOGY.md), synthetic schedule and [9/9 QA](../reports/LIQUIDITY_STRESS_QA.md) | Complete for synthetic rehearsal; live financing terms pending | Base/downside cash roll-forward, facility caps and negative-headroom breach are explicit |
| Recommendations have quantified simulated impact | `Recommendations`, CFO memo, management deck | Complete | Impact is labelled simulated and tied to assumptions |
| Customer profitability and concentration | [customer methodology](CUSTOMER_PROFITABILITY_METHODOLOGY.md), synthetic P&L and [10/10 QA](../reports/CUSTOMER_PROFITABILITY_QA.md) | Complete for synthetic rehearsal; real customer contracts/invoice aging pending | Gross-to-net, contribution, DSO, WC cost and high-revenue/low-margin signal are explicit |
| Customer profitability summary and concentration | [analysis report](CUSTOMER_PROFITABILITY_ANALYSIS.md), summary JSON and [14/14 QA](../reports/CUSTOMER_PROFITABILITY_ANALYSIS_QA.md) | Complete for synthetic rehearsal; real account evidence pending | Top-five concentration, channel roll-ups, portfolio DSO/margins and C06 review path are recomputed |
| Excel contains visible QA controls | v2 `Checks`, [QA matrix](../powerbi/QA_TEST_MATRIX.md) | Complete | Controls cover tie-outs, mappings, inventory and signs |
| External-gates execution is field-level and reproducible | [external-gates execution pack](EXTERNAL_GATES_EXECUTION_PACK.md), schemas, validators and QA log | Complete for design; external inputs pending | Intake grain, eligibility, RACI, six-page PBIX contract and release bundle are explicit |\n| Power BI model matches Excel | [semantic contract](../powerbi/model_contract.json), [DAX](../powerbi/measures.dax), QA queries | Pending external | Native PBIX still requires Power BI Desktop and final visual tie-out |
| Management deck and CFO memo match the model | Remote deck/memo and validation report | Complete | Cross-output spot checks documented |
| Synthetic and external data are distinguished | [claim governance](CLAIM_GOVERNANCE.md) | Complete | OBSERVED / SIMULATED / DERIVED / ASSUMPTION labels are required |
| External sources are traceable | Source registry, Drive raw-report archive, peer queue | Complete | Official report URLs, pages and basis notes retained |
| Limitations are visible | [assumptions and limitations](ASSUMPTIONS_AND_LIMITATIONS.md), validation report | Complete | Comparability and synthetic-data caveats are explicit |
| Recruiter understands project in 60 seconds | [production website](https://vn-finance-fpa-case.sangkenny200.chatgpt.site), README, CV draft | Complete | Business finding appears before technical implementation detail |
| Interviewer can inspect depth for 15–20 minutes | Build guide, Desktop runbook, methodology pack, QA matrix | Complete | Walkthrough path is documented from CFO page to controls |

- MCH OCR triage: [review report](../reports/MCH_OCR_REVIEW_TRIAGE_2026-08-30.md) · [Drive document](https://docs.google.com/document/d/1MRy5T3IC19X77agxXheJ74mZQjAz__IeMbavaJkYQ8I/edit?usp=drivesdk). The 120-row queue is prioritized, but remains unapproved until page-level human review. Machine-readable flags are also available at [CSV](../data/mch_ocr_triage_flags.csv) and [Drive Sheet](https://docs.google.com/spreadsheets/d/1UvYD22jwFh1UaolxC_jH7HkpJ8Csi6qS6aTtSBbI4Dw/edit?usp=drivesdk). The [page-level review workbench](../data/mch_ocr_review_workbench_template.csv) and [Drive Workbench](https://docs.google.com/spreadsheets/d/1eRWrYLyiXNsGQuqsPwXAjT3rodJJMzI9dmjj6OkcJRY/edit?usp=drivesdk) add decision, correction, reviewer and evidence columns for each candidate. The [workbench validator](../scripts/validate_mch_ocr_workbench.mjs) blocks incomplete approvals and duplicate keys.

## 2. Remote evidence inventory

### GitHub

- Data, schemas and scripts: `data/`, `schemas/`, `scripts/`.
- Finance model and DAX controls: `powerbi/`.
- Business and methodology documentation: `docs/` and `reports/`.
- Recruiter-facing site source: `site/`.
- Multi-version backtest demo: `data/forecast_accuracy_demo_input.csv` and `data/forecast_accuracy_demo_output.csv`.

### Google Drive

- Raw official reports: `01_Raw_Reports`.
- Extracted and synthetic data: `02_Extracted_Data`.
- Native forecast capture Sheet: [VietNova Forecast Snapshot Capture & Bias WAPE Backtest](https://docs.google.com/spreadsheets/d/1jv9rl49WDkwmRx8p41C10P0epbPY-Oq8AlihxQGJMfg/edit).
- Native Sheet tabs: `Instructions`, `Forecast_Snapshot_Input`, `Backtest_Output`, `Close_Calendar`.
- Close-calendar control: [FORECAST_SNAPSHOT_CLOSE_CALENDAR.md](https://drive.google.com/file/d/12jAEwrXTeUmz5lzu9aUh1Ay6MUvsMu88/view).
- Real snapshot onboarding: [GitHub pack](REAL_SNAPSHOT_ONBOARDING_PACK.md) · [Drive pack](https://drive.google.com/file/d/1gjdrHk6T4xnsv9SFaGoCIsd9CLRLl5oc/view) · native Sheet tab `Real_Snapshot_Onboarding`.
- Demo backtest input: [Drive CSV](https://drive.google.com/file/d/1LBORkBVD02V_2HS-a70vK6SKDgGxcp7i/view).
- Demo backtest output: [Drive CSV](https://drive.google.com/file/d/1NxiZJ-1hlS0L8pPmj-QfUi5mjPH8LPi3/view).
- Frozen capture archive: [GitHub CSV](../data/forecast_snapshot_capture_demo_frozen.csv) · [Drive CSV](https://drive.google.com/file/d/1EBX9s3C16ZRkbLDpwfYVmgV_7Tw3LRCn/view) · [14/14 QA report](../reports/FORECAST_CAPTURE_ARCHIVE_QA.md) · [Drive QA](https://drive.google.com/file/d/1EODWWBJxWVPxhCGjjQ6qYXfMlUawKE94/view).

## 3. Remaining release gates

### Gate A — genuine frozen forecast snapshots

The native Sheet now demonstrates the mechanics with 27 FROZEN `DEMO_FIXTURE_v1` rows, one FUTURE_LEAKAGE exception and one NOT_ELIGIBLE draft row. The remaining external step is to add at least one approved real forecast version created before actual close, with cutoff timestamp, source-model version, approver and actual-availability date. Run the script, review exclusion counts and archive the resulting observed output. Until then, do not publish Bias/WAPE as company performance.

### Gate B — native Power BI Desktop release

Open the v2 workbook in Power BI Desktop, follow `powerbi/POWER_BI_DESKTOP_RUNBOOK.md` and the [external-gates execution pack](EXTERNAL_GATES_EXECUTION_PACK.md), execute QA-01 through QA-18, save the native `.pbix`, export a PDF or screenshots for visual QA and upload the binary to Drive. The repository intentionally keeps the portable semantic contract and DAX rather than claiming a placeholder PBIX.

## 4. Reviewer acceptance checklist

- [ ] Open the website and understand the decision question in one minute.
- [ ] Inspect the Excel `Checks` and `CFO_Output` tabs.
- [ ] Trace one recommendation to its assumption, formula and KPI.
- [ ] Confirm synthetic labels and public-source citations.
- [ ] Inspect one frozen forecast snapshot and its cutoff evidence (demo fixture now available; replace with real snapshot for production claim).
- [ ] Re-run the Bias/WAPE script and inspect exclusion reasons.
- [ ] Open Power BI and confirm totals tie to Excel after the native PBIX gate is completed.

## 5. Audit conclusion

The finance model, evidence governance, public peer layer, forecast-control template, frozen synthetic backtest demonstration and recruiter packaging are complete and remotely archived. The project is **release-ready for review**, but not yet a fully closed production-style case until Gate A is evidenced with a real snapshot record and Gate B with a native PBIX file.


## 6. Historical peer-depth extension

The VNM panel now spans FY2006–FY2025 in `data/vnm_longrun_panel_2006_2025.csv`, with derived revenue growth, profitability margins, cash conversion and asset efficiency. FY2006 is flagged as a restated comparative and FY2021 as a statement-to-summary basis break; this extension is evidence of depth, not permission to ignore comparability controls. See [methodology](VNM_LONGRUN_PANEL.md) and [Drive CSV](https://drive.google.com/file/d/1R0ruyyRRLl7bFWuzKlhpihor2_4Qu4Hv/view).


## 7. Long-run panel QA evidence

The VNM FY2006–FY2025 panel has an executable [validator](../scripts/validate_vnm_longrun_panel.mjs) and [17/17 PASS report](../reports/VNM_LONGRUN_PANEL_QA.md). The validator checks headers, row count, contiguous years, duplicate keys, source URLs, layer/status separation, restatement/basis-break flags, ratio recomputation and blank preservation.


## Continuous QA

The repository includes [GitHub Actions finance QA](../.github/workflows/finance-qa.yml) that re-runs the forecast leakage fixture, the VNM long-run panel validator and the Power BI contract JSON checks on every push and pull request. This protects the evidence layer from silent regressions.

- CI rehearsal evidence: [GitHub report](../reports/CI_QA_LOCAL_REHEARSAL_2026-08-30.md) · [Drive report](https://drive.google.com/file/d/1CUWzZ4PClwQPEMXgNvn679uufSnTntmQ/view).
- CI now also runs the [PBIP source-manifest validator](../scripts/validate_pbip_source_manifest.mjs) and the public-guidance analysis validator on push and pull request.

- Peer evidence QA: [validator](../scripts/validate_peer_evidence.mjs) and [21/21 PASS report](../reports/PEER_EVIDENCE_QA.md).


## 8. Forecast capture control extension

The native forecast Sheet now includes governance columns (`Snapshot_Status`, `Source_Model_Version`, `Approver`, `Actual_Period_Close_Date`, `Exception_Note`), strict status validation, frozen headers and conditional leakage highlights. This closes the operational-design portion of Gate A; only genuine approved snapshots remain outstanding.

- Native capture Sheet QA: [report](../reports/FORECAST_CAPTURE_SHEET_QA.md) · [Drive copy](https://drive.google.com/file/d/16oxmO8IdsfXhZxngLmnGYu2CtCUJW3UO/view).

- PBIP external gate preparation: [Desktop execution checklist](../powerbi/PBIP_DESKTOP_EXECUTION_CHECKLIST.md) covers the exact topology, data mapping, QA-01–QA-18 sequence and archive naming; it does not claim a native PBIX.

- Freeze-gate behavior has been tested in the native Sheet: DRAFT rows return `WAITING_FOR_FROZEN_SNAPSHOT`; only FROZEN rows can produce Bias/WAPE and `READY`.


## 9. D2C unit-economics extension

The D2C branch is now implemented as a reviewable native Sheet with editable Base/Downside/Upside assumptions, formula-driven CAC, contribution, LTV/CAC and payback, and six visible control checks. The synthetic extract is committed to GitHub and mirrored to Drive; all inputs are explicitly labelled synthetic or illustrative.

- [Methodology](D2C_UNIT_ECONOMICS.md) · [Synthetic dataset](../data/d2c_unit_economics_synthetic.csv) · [Validator](../scripts/validate_d2c_unit_economics.mjs)
- [Native D2C Unit Economics Sheet](https://docs.google.com/spreadsheets/d/1nTEJJ9iBvxne0hCjGSDoHKaWgR_pqiMqgXYaTqGgbik/edit?usp=drivesdk)
- Base illustration: CAC VND130k, LTV contribution VND93.6k, LTV/CAC 0.72x and payback 3.33 orders; native Checks tab = PASS.
- Production conversion remains explicit: replace synthetic acquisition, order, refund and cost inputs with approved company sources and cohort retention evidence before presenting as observed performance.


## 10. Public guidance proxy extension

A separate VNM FY2018–FY2025 public-guidance proxy is now archived. It contains 16 AGM/IR guidance-versus-actual observations, an explicit total-consolidated-revenue basis, row-level source URLs/pages and an executable validator. Aggregate proxy Bias is -2.63% and WAPE is 3.14%. This evidence improves forecast-versus-actual communication but does not close Gate A: every row is marked PUBLIC_GUIDANCE_PROXY and gate_a_eligible=NO because public AGM guidance has no internal model version, immutable cutoff timestamp or internal approver.

- [Methodology](VNM_PUBLIC_GUIDANCE_PROXY.md) · [Dataset](../data/vnm_public_guidance_proxy_2018_2025.csv) · [Validator](../scripts/validate_public_guidance_proxy.mjs) · [QA](../reports/VNM_PUBLIC_GUIDANCE_PROXY_QA.md) · [Drive QA](https://drive.google.com/file/d/17QXfKkUS127vGkdfn1Jx0zpIrPrmld7I/view)
- Drive archive: [CSV](https://drive.google.com/file/d/1BW6zGnxS-m67lLPLKfZuJn-5M-d4elw-/view) · [Methodology](https://drive.google.com/file/d/1LOmPrCcFGBFUXsdw3hi7WXziebKxHRJL/view) · [Validator](https://drive.google.com/file/d/1Y1nBInfRASnSankqfgmvjzcx7KP7EFq_/view)


## 11. Portable Power BI source handoff

The repository now includes a machine-readable [PBIP source manifest](../powerbi/PBIP_SOURCE_MANIFEST.json), a [handoff guide](../powerbi/PBIP_SOURCE_HANDOFF.md) and an executable [manifest validator](../scripts/validate_pbip_source_manifest.mjs). Remote validation passes for 5 dimensions, 9 facts, 17 relationships, 6 report pages and 18 QA test definitions. This artifact is intentionally a portable source scaffold; it is not a native .pbix and does not close Gate B.


## 12. Public-guidance performance research extension

The VNM public-guidance proxy now has a deterministic analysis output with metric and regime splits, Bias/WAPE/MAPE, within-2% rates, descriptive error bands and ranked misses. The analysis is covered by a dedicated validator and CI step. It improves the finance-analyst narrative but remains explicitly excluded from Gate A because the evidence is public AGM/IR guidance rather than an internal pre-close snapshot.

- [Analyst report](../reports/VNM_PUBLIC_GUIDANCE_ANALYSIS.md) · [Analysis JSON](../data/vnm_public_guidance_proxy_analysis.json) · [QA](../reports/VNM_PUBLIC_GUIDANCE_ANALYSIS_QA.md)


## 13. Interview conversion evidence

The project now includes a recruiter/interviewer-facing talk track covering the 90-second positioning, a 15-minute evidence walkthrough, three STAR stories, common pushback and the production handoff. This converts the model depth into a repeatable finance-analyst communication artifact without changing the evidence labels.

- [Finance Analyst / FP&A talk track](FINANCE_ANALYST_INTERVIEW_TALK_TRACK.md) · [Drive copy](https://drive.google.com/file/d/1qyKG5FJW5_EdKyu10l-xWUyOU9i5tLRy/view).


## 14. M&A / strategic-stretch extension

A synthetic Buy-vs-Build acquisition screen is now implemented with standalone target economics, revenue and cost synergies, integration costs, financing interest, EPS accretion/dilution, incremental FCFF, NPV and a 12-cell entry-multiple / synergy-realization sensitivity grid. The case is explicitly synthetic and does not close the internal forecast Gate A or Power BI Gate B.

- [Methodology and decision memo](MNA_ACCRETION_DILUTION.md)
- [Forecast CSV](../data/mna_accretion_dilution_synthetic.csv) · [Sensitivity CSV](../data/mna_accretion_dilution_sensitivity.csv)
- [Validator](../scripts/validate_mna_accretion_dilution.mjs) · [QA report](../reports/MNA_ACCRETION_DILUTION_QA.md)
- Base output: Year-2 EPS accretion 17.16%; deal NPV VND 28.39bn; Year-1 EPS dilution -0.46%.


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

- [Finance Analyst / Junior FP&A CV V2](docs/FINANCE_ANALYST_CV_ONE_PAGE_V2.md) · [Drive copy](https://docs.google.com/document/d/1pf5jUlWAajDPUj4Rs4GL6xnWyAKi_kXPLVLy59lIviU/edit?usp=drivesdk)
- Bullets are restricted to validated evidence and explicitly label synthetic/public-guidance outputs; replace bracketed personal fields before use.


## Master-plan evidence matrix

- [Machine-readable evidence matrix](data/master_plan_evidence_matrix.csv) · [Validator](scripts/validate_master_plan_evidence_matrix.mjs) · [QA report](reports/MASTER_PLAN_EVIDENCE_MATRIX_QA.md)
- [Drive matrix](https://drive.google.com/file/d/1yqiUFL1p6KT2WeXQNP2nIW1RXnO5PlyX/view) · [Drive validator](https://drive.google.com/file/d/1gz9jURxhEqkunS-z8lE_O2FNhfoxZHHI/view) · [Drive QA](https://drive.google.com/file/d/1-tQP0Dmj7n-LVSj154DF-iUP2KffBFcn/view)
- Current audit: 28 requirement rows, 20 mandatory-core rows, two external gates intentionally pending; validator PASS.


## Website strategic-finance release

- [Release note](reports/SITE_STRATEGIC_FINANCE_RELEASE_2026-08-30.md) · [Drive release note](https://drive.google.com/file/d/19mW_MT81z1CMeU9v39fBHBdiIcoLkEiQ/view)
- Production site version 8 includes Strategic Finance / M&A, MCH Finance Analyst Lens, the Operating Finance System, CV quick-tour cards and direct Gate A/B contract links: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- Local build PASS; deployment succeeded. Shared UI-library lint warnings remain pre-existing and do not include new page-level errors.
- [Drive build archive](https://drive.google.com/file/d/1mfx-4W0cfZvGlcZv6TONO36H3rKXgqib/view) · [v3 page source](https://drive.google.com/file/d/1gJZOyXQKPoOuEHDmRLQezSn3GgULp0f-/view) · [v3 CSS source](https://drive.google.com/file/d/136FgoZ8gzarzNZAtXWmsHpMi6PYj53fb/view)


## Website runtime QA

- [Runtime/access-boundary QA](reports/SITE_RUNTIME_QA_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1z1LGW43fG94bEkFgbPZP3QVYQvYwxZt-/view)
- Source/build/deployment checks PASS for Sites version 8. The site intentionally remains owner-only; unauthenticated requests receive the sign-in screen. Visual click-through requires the owner session. V8 provenance: https://drive.google.com/file/d/1p3gSEo7gkH_skLniiMFK96SgBnk1aSaO/view?usp=drivesdk


## Archived master plan

- [Corporate Financial Analyst / FP&A master plan](docs/CORPORATE_FINANCIAL_ANALYST_FPA_MASTER_PLAN.md)
- [Drive archive](https://drive.google.com/file/d/1blpG-4CKWkjPpuwXwOFRkwI038XXMOnK/view)
- The detailed plan is now stored remotely; no local output copy is retained.


## Peer comparability decision memo

The peer panel is intentionally scoped by evidence quality: VNM supports a long-run FY2016–FY2025 trend claim; QNS and KDC are bounded cross-sectional/context benchmarks until revenue-basis and perimeter controls are closed; MCH OCR candidates remain human-review only. See [memo](../reports/PEER_COMPARABILITY_DECISION_2026-08-30.md) · [Drive copy](https://docs.google.com/document/d/184FPk4ZcPaWVtWm4qqRsvsG3RO0D_Lv9tS46yKXqCGk/edit?usp=drivesdk).

## Normalized peer evidence layer

The long-form peer export now preserves one company × FY × metric row with source lineage, blank-value controls, role mapping and comparability flags. The approved VNM/QNS/KDC export passes 18/18 checks across 240 rows; the MCH intake template passes 14/14 structural checks and remains intentionally separate from the approved 80-row MCH statement supplement. See [methodology](NORMALIZED_PEER_PANEL_METHODOLOGY.md), [validator](../scripts/validate_normalized_peer_panel.mjs), [approved QA](../reports/NORMALIZED_PEER_PANEL_QA.md), [template QA](../reports/NORMALIZED_PEER_PANEL_TEMPLATE_QA.md) and [Drive native Sheet](https://docs.google.com/spreadsheets/d/11v8XpRNMCkaWkhqakjxh1Ao3E0yTP4cLP3Z3Jmg7Owg/edit?usp=drivesdk).

## 15. Application conversion pack

The candidate application and CV build pack is now linked from the repository README and mirrored to Drive. It contains the candidate-fact intake, validated evidence inventory, three role variants, ATS matrix, interview conversion matrix and Gate-dependent wording rules: [GitHub pack](CANDIDATE_APPLICATION_INTAKE_AND_CV_BUILD_PACK.md) · [Drive copy](https://drive.google.com/file/d/1vZmLitH1CI-uVAoJmLil1P_tVHZ0MvwT/view).


### QNS evidence-layer enrichment
FY2021–FY2025 gross profit and owners' equity were promoted from the readable QNS FY2025 management summary (pages 27–28), with evidence-tier flags preserved. The evidence memo and Drive native Sheet are linked from the release artifacts; operating profit and operating cash flow remain explicitly unavailable.

### MCH OCR control
MCH remains separate from the 240-row core panel, but the 80-row FY2016–FY2025 supplement is approved after page-level review; only the FY2017 comparative/corresponding-column caveat remains.

### MCH latest-year supplement
FY2024–FY2025 MCH statements were visually reviewed and tie-outs passed; the approved eight-metric supplement has since been extended to FY2016–FY2025. The core peer panel remains 240 rows and the MCH supplement is maintained separately for comparability control.

### MCH FY2016–FY2025 completion
FY2016 and FY2018–FY2025 were visually reviewed (including cash-flow statements) and tie-outs passed; FY2017 was validated from the audited FY2018 comparative/corresponding columns. The approved MCH supplement now covers FY2016–FY2025 (80 rows, all eight metrics) with the FY2017 caveat retained.

## QNS/KDC adjustment-feasibility extension

The optional feasibility step is now complete: four QNS/KDC break-register rows, a machine-readable ledger and a validator pass 10/10 controls. The artifact documents the exact entity, consolidation and gross-to-net bridges required before an adjusted full-period CAGR can be published. The adjusted series itself remains blocked; no unqualified organic-growth claim is introduced. See [feasibility report](../reports/PEER_BASIS_ADJUSTMENT_FEASIBILITY_2026-08-30.md), [QA](../reports/PEER_BASIS_ADJUSTMENT_FEASIBILITY_QA.md) and [Drive mirror](https://docs.google.com/document/d/1j4n34qdg3L4wlCcsf2KlQfakMzw3zqNIAVCnoO21eLM/edit?usp=drivesdk).

## Current status overlay

See [Final Status Overlay](reports/FINAL_STATUS_OVERLAY_2026-08-30.md) for the authoritative current-state index; it supersedes stale historical progress paragraphs where needed.

## Latest QA sync — 2026-08-30

- CI run [#719](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33300357901) passed after the MCH FY2017 indexed-evidence validator was added to both the GitHub workflow and the cross-platform runner.
- The runner now reports 20 total checks: 19 repository-local validators plus Power BI contract-shape validation. FY2017 remains a controlled `INDEXED_ONLY` layer; no standalone PDF-byte claim is made.
- Updated Drive runner archive: https://drive.google.com/file/d/1vuv3EsRSRR3GnGCnrkNPdCNJy5F7oUGW/view?usp=drivesdk


## Latest full-run QA sync — 2026-08-30

The cross-platform finance runner now covers all 42 validator invocations across 40 unique repository-local validator files plus the Power BI contract-shape check (43 total checks; Gate A runs in template and fixture modes). [CI run #778](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33302213464) passed. Older historical check-count paragraphs remain for audit history only and are superseded by this overlay.


## Website V9 release

Site V9 is deployed at https://vn-finance-fpa-case.sangkenny200.chatgpt.site with a customer-economics decision callout. [Release record](../reports/SITE_V9_RELEASE_RECORD_2026-08-30.md) and Drive archive retain the source commit, build archive hash and deployment status. This changes presentation only; all customer values remain synthetic rehearsal evidence.


## External gate readiness artifact

The release boundary is now machine-readable in [external_gate_readiness.json](../data/external_gate_readiness.json) with a [10/10 governance validator](../reports/EXTERNAL_GATE_READINESS_QA.md). Drive mirrors: [report](https://drive.google.com/file/d/19va7iv_Y2VqruqEtAIID2ptogyMXZWvF/view?usp=drivesdk), [JSON](https://drive.google.com/file/d/1v4FUyvjqmO7Iw1F8FCS-ebwKf43OcFTe/view?usp=drivesdk), [QA](https://drive.google.com/file/d/1MBAe9s2geemTe1F9MmoX266TVAarfcxz/view?usp=drivesdk). It explicitly records Gate A as pending live internal evidence and Gate B as pending native PBIX/Desktop evidence; no production claim is enabled.
