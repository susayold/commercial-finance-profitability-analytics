# Gate A / Gate B User Input Checklist

Date: 2026-08-30

This checklist is the smallest evidence bundle needed to close the two remaining external gates. It is an intake guide, not a substitute for the evidence itself.

## Gate A — real internal forecast accuracy

### Minimum data file

Provide one or more CSV files at the grain forecast_version × target_period × company × brand × channel. Required fields:

- snapshot_id, forecast_version_id, source_model_version
- forecast_created_at, forecast_cutoff_at, actual_period_close_date, actual_available_at
- snapshot_status (FROZEN for eligible rows)
- evidence_class = LIVE_INTERNAL
- company_id, brand_id, channel_id, target_period
- forecast_revenue_vnd, actual_revenue_vnd
- approver_name, approver_role, approval_reference
- source_system, source_export_uri, actuals_source_uri
- gate_a_eligible, exclusion_reason, mapping_note

### Evidence files

1. Immutable pre-close forecast export or screenshot showing the cutoff timestamp and model version.
2. Approval evidence naming the approver and role.
3. Closed-period actual export and the date it became available to FP&A.
4. Scope/currency mapping note proving forecast and actual use the same basis.
5. SHA-256 or Drive metadata for the frozen file.

Redact customer names, prices or other confidential fields if needed; preserve the period, version, scope and values required for the control. Never overwrite the frozen forecast after actuals arrive.

### Acceptance output

The repository validator must run in live mode and produce a report labelled LIVE_OBSERVED with eligible rows, excluded rows, as-of date, model version, Bias, WAPE, MAPE diagnostic and a management action. Any missing approval, cutoff, close date or actual-availability date blocks release.

## Gate B — native Power BI Desktop

### Build inputs

- Latest remote VietNova FP&A v2 workbook.
- PBIP source manifest, model contract, DAX measures and six-page build guide.
- Approved peer panel and evidence labels.

### Evidence files

1. Native Commercial_Finance_Profitability_Analytics.pbix.
2. Completed powerbi/QA_EVIDENCE_LOG_TEMPLATE.csv for QA-01–QA-18.
3. PDF export or page screenshots showing all six report pages.
4. Refresh timestamp, model version, reviewer and execution timestamp.
5. PBIX SHA-256 and Drive metadata.

### Acceptance rule

Every QA row needs an observed value, expected value, evidence reference, reviewer and execution timestamp. A PASS without evidence is invalid; a FAIL needs owner, remediation and retest date. Visual totals must reconcile to Excel v2 before the binary is released.

## Remote handoff sequence

1. Upload the redacted input/evidence files to the private [Drive project folder](https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR).
2. Add the Drive IDs/URLs to the matching CSV fields and preserve the original immutable file.
3. Run the existing Gate A or Gate B validator from the GitHub repository.
4. Commit the validator output and release report to GitHub; mirror the report and binary/evidence to Drive.
5. Update the final status overlay and CV only after the relevant acceptance rule passes.

Until these steps are completed, keep the project labels FIXTURE_PASS_NOT_LIVE and PBIP_SOURCE_SCAFFOLD exactly as written.

## Gate A full intake implementation

Use the machine-readable contract before submitting real data:

- [Gate A JSON schema](../schemas/forecast_snapshot_gate_a.schema.json)
- [Gate A intake template](../data/forecast_snapshot_gate_a_intake_template.csv)
- [Gate A deterministic unit fixture](../data/forecast_snapshot_gate_a_unit_test.csv)
- [Gate A intake validator](../scripts/validate_gate_a_intake_contract.mjs)
- [Gate A intake QA](../reports/GATE_A_INTAKE_CONTRACT_QA.md)

Run template mode first, then replace the fixture with the redacted internal CSV and run --mode=live. The live mode requires HTTPS source evidence, LIVE_INTERNAL classification, a pre-close cutoff, closed actuals, approval metadata, SHA-256 and at least one eligible FROZEN row.
