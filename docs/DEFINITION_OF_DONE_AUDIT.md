# Definition-of-Done Audit — Commercial Finance & Profitability Analytics

Audit date: 2026-08-30  
Repository: `susayold/commercial-finance-profitability-analytics`  
Primary archive: [Google Drive project root](https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR)

This audit maps the user-provided master plan to evidence that a recruiter or finance reviewer can inspect. `Complete` means the artifact exists remotely and has passed the documented checks. `Pending external` means the design and handoff are ready but require an external input or desktop application; it is not represented as complete.

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
| Recommendations have quantified simulated impact | `Recommendations`, CFO memo, management deck | Complete | Impact is labelled simulated and tied to assumptions |
| Excel contains visible QA controls | v2 `Checks`, [QA matrix](../powerbi/QA_TEST_MATRIX.md) | Complete | Controls cover tie-outs, mappings, inventory and signs |
| Power BI model matches Excel | [semantic contract](../powerbi/model_contract.json), [DAX](../powerbi/measures.dax), QA queries | Pending external | Native PBIX still requires Power BI Desktop and final visual tie-out |
| Management deck and CFO memo match the model | Remote deck/memo and validation report | Complete | Cross-output spot checks documented |
| Synthetic and external data are distinguished | [claim governance](CLAIM_GOVERNANCE.md) | Complete | OBSERVED / SIMULATED / DERIVED / ASSUMPTION labels are required |
| External sources are traceable | Source registry, Drive raw-report archive, peer queue | Complete | Official report URLs, pages and basis notes retained |
| Limitations are visible | [assumptions and limitations](ASSUMPTIONS_AND_LIMITATIONS.md), validation report | Complete | Comparability and synthetic-data caveats are explicit |
| Recruiter understands project in 60 seconds | [production website](https://vn-finance-fpa-case.sangkenny200.chatgpt.site), README, CV draft | Complete | Business finding appears before technical implementation detail |
| Interviewer can inspect depth for 15–20 minutes | Build guide, Desktop runbook, methodology pack, QA matrix | Complete | Walkthrough path is documented from CFO page to controls |

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

Open the v2 workbook in Power BI Desktop, follow `powerbi/POWER_BI_DESKTOP_RUNBOOK.md`, execute QA-01 through QA-18, save the native `.pbix`, export a PDF or screenshots for visual QA and upload the binary to Drive. The repository intentionally keeps the portable semantic contract and DAX rather than claiming a placeholder PBIX.

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

The repository now includes a machine-readable [PBIP source manifest](../powerbi/PBIP_SOURCE_MANIFEST.json), a [handoff guide](../powerbi/PBIP_SOURCE_HANDOFF.md) and an executable [manifest validator](../scripts/validate_pbip_source_manifest.mjs). Remote validation passes for 5 dimensions, 9 facts, 15 relationships, 6 report pages and 18 QA test definitions. This artifact is intentionally a portable source scaffold; it is not a native .pbix and does not close Gate B.


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
