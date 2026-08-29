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

- Peer evidence QA: [validator](../scripts/validate_peer_evidence.mjs) and [21/21 PASS report](../reports/PEER_EVIDENCE_QA.md).


## 8. Forecast capture control extension

The native forecast Sheet now includes governance columns (`Snapshot_Status`, `Source_Model_Version`, `Approver`, `Actual_Period_Close_Date`, `Exception_Note`), strict status validation, frozen headers and conditional leakage highlights. This closes the operational-design portion of Gate A; only genuine approved snapshots remain outstanding.

- Native capture Sheet QA: [report](../reports/FORECAST_CAPTURE_SHEET_QA.md) · [Drive copy](https://drive.google.com/file/d/16oxmO8IdsfXhZxngLmnGYu2CtCUJW3UO/view).

- Freeze-gate behavior has been tested in the native Sheet: DRAFT rows return `WAITING_FOR_FROZEN_SNAPSHOT`; only FROZEN rows can produce Bias/WAPE and `READY`.
