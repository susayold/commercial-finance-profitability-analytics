# Final External Gates Handoff

Status: design complete; two evidence gates remain external.

This handoff converts the remaining requirements into executable steps. Do not relabel synthetic fixtures as live evidence. The repository and Drive archive already contain the model logic, validators and evidence taxonomy; this pack defines the exact inputs needed to close the final gates.

## Gate A — genuine pre-close internal forecast snapshot

### Required source

Provide at least one approved forecast version created before the target accounting period closes. The source can be an exported planning-model CSV, a locked spreadsheet extract or an approved planning-system report, but it must retain the original version ID, creation timestamp and approver.

Use the [live submission template](../data/forecast_snapshot_live_submission_template.csv). Required grain is one row per forecast version × target month × company × brand × channel.

### Minimum evidence bundle

1. Completed CSV with frozen forecast revenue and, after close, actual net revenue.
2. Screenshot or export showing the source model version and freeze/approval timestamp.
3. Accounting close evidence showing actual_period_close_date.
4. Actual-availability evidence showing when actuals became available to FP&A.
5. Named approver and role.
6. Any mapping or tolerance note used to tie revenue to the closed P&L.

### Acceptance sequence

1. Freeze the forecast at WD-5 and record forecast_created_date.
2. Confirm forecast_created_date is earlier than actual_period_close_date and actual_available_date.
3. After close, populate actual_revenue_vnd without overwriting the frozen forecast.
4. Set snapshot_status to FROZEN only after approver and source_model_version are present.
5. Run scripts/compute_forecast_accuracy.mjs with the agreed as-of date.
6. Archive the immutable input, output and QA report in GitHub and Drive.
7. Publish Bias/WAPE only with the LIVE_OBSERVED label and eligible/excluded counts.

### Expected live output names

- data/forecast_snapshot_live_<version>_<period>.csv
- reports/FORECAST_ACCURACY_LIVE_<version>_<period>.md
- reports/FORECAST_ACCURACY_LIVE_<version>_<period>_QA.md
- supporting approval/close evidence in the private Drive raw-report folder.

### Hard stops

- Missing approver, source model version or close date.
- Forecast created after actual availability.
- Actuals not tied to the closed P&L.
- Any attempt to edit a frozen forecast row in place.
- Calling the public-guidance proxy or DEMO_FIXTURE_ONLY rows internal accuracy.

## Gate B — native Power BI Desktop release

### Prerequisites

- Windows machine with Power BI Desktop.
- Latest v2 workbook from the Drive archive.
- Portable source manifest and [Desktop checklist](../powerbi/PBIP_DESKTOP_EXECUTION_CHECKLIST.md).
- Access to the repository/Drive source files.

### Build and QA sequence

1. Import the v2 workbook and preserve the documented table names.
2. Apply the relationships and measures from powerbi/PBIP_SOURCE_MANIFEST.json and powerbi/measures.dax.
3. Build the six pages in the checklist: CFO Executive Summary; Revenue & Margin Drivers; Profitability & Unit Economics; Promotion, Pricing & Allocation; Forecast & Risk; Inventory, Working Capital & Liquidity.
4. Execute QA-01 through QA-18 in powerbi/QA_TEST_MATRIX.md.
5. Reconcile headline totals to Excel v2 and record any approved tolerance.
6. Export a PDF or page screenshots for visual evidence.
7. Save the native binary as Commercial_Finance_Profitability_Analytics.pbix.
8. Upload the PBIX, visual evidence, QA log and refresh metadata to Drive.
9. Record the final PBIX hash/version in the release-status record.

### Expected native release bundle

- Commercial_Finance_Profitability_Analytics.pbix
- reports/POWER_BI_NATIVE_QA_2026-08-30.md
- reports/POWER_BI_NATIVE_VISUAL_EVIDENCE_2026-08-30.pdf or screenshots/
- refresh timestamp, model version and reviewer sign-off.

### Hard stops

- Do not create a placeholder .pbix.
- Do not claim that a PBIP manifest is the native binary.
- Do not mark QA PASS without evidence for all 18 tests.
- Do not publish a visual that does not reconcile to Excel.

## Ownership handoff

| Gate | Current owner | What is needed next | Release decision |
|---|---|---|---|
| A — live forecast accuracy | FP&A / Finance Lead | Approved pre-close snapshot plus close/availability evidence | Publish LIVE_OBSERVED Bias/WAPE only after validator PASS |
| B — native Power BI | Analyst with Power BI Desktop | Build, 18-test QA, visual export and PBIX upload | Mark native release complete only after binary and evidence are archived |

## Current status

- Synthetic forecast fixture: complete and leakage-tested.
- Public-guidance proxy and analysis: complete but explicitly excluded from Gate A.
- Native capture Sheet and freeze protocol: complete.
- PBIP manifest, DAX, handoff and Desktop checklist: complete.
- Genuine live snapshot: pending external source.
- Native PBIX: pending Power BI Desktop.