# Gate A Internal Forecast Data Request Template — 2026-08-30

Purpose: request the smallest redacted data package needed to close Gate A without exposing customer, employee or commercially sensitive identifiers.

## Copy/paste request

Subject: Request for redacted pre-close forecast snapshot for finance-model validation

Hi [Finance/FP&A owner],

I am validating a finance-analyst portfolio model and need one historical, pre-close forecast snapshot plus the corresponding closed actuals. Could you provide a redacted export covering one or more closed months?

Please preserve these fields: forecast_version_id, source_model_version, forecast_created_at, forecast_cutoff_at, actual_period_close_date, actual_available_at, snapshot_status, company/entity, brand or category, channel, target_period, forecast_revenue, actual_revenue, currency, approver name/role or an anonymized approval reference, source-system name, and export/reference URI.

Identifiers may be anonymized. Please remove customer names, employee names, account numbers, contract numbers, product descriptions, prices, discounts and any personal data unless they are required for the agreed aggregation grain. Keep the time period, version, scope, currency and numeric values unchanged so the forecast-bias control remains reproducible.

Please confirm in the accompanying note:

- the forecast was frozen before the target period closed;
- the actuals were first available after the forecast cutoff;
- the actual period is closed and reconciled to the relevant P&L/reporting source;
- the export is approved for this validation use;
- the values are not synthetic or public-guidance estimates.

Thank you,
[Name]

## Minimum redacted CSV grain

One row must represent one forecast_version_id × target_period × entity × brand/category × channel. Do not aggregate away the forecast version or cutoff timestamp.

Recommended columns:

`snapshot_id,forecast_version_id,source_model_version,forecast_created_at,forecast_cutoff_at,actual_period_close_date,actual_available_at,snapshot_status,evidence_class,company_id,brand_id,channel_id,target_period,forecast_revenue_vnd,actual_revenue_vnd,approver_name,approver_role,approval_reference,source_system,source_export_uri,actuals_source_uri,gate_a_eligible,exclusion_reason,mapping_note`

Use `LIVE_INTERNAL` only when the source is genuinely internal and approved. Keep `snapshot_status=FROZEN` for eligible rows. Do not overwrite `forecast_revenue_vnd` after actuals arrive; corrections require a new snapshot/version.

## Redaction mapping

| Original field | Acceptable redaction | Preserve |
|---|---|---|
| Customer name | Stable token such as CUST_001 | Customer grain only if needed |
| Employee/approver name | Anonymized reviewer ID plus role | Approval role and reference |
| SKU description | SKU_001 or category token | Category/brand mapping |
| Account number | Aggregated CoA code | Account/category mapping |
| Contract/order ID | Remove or stable row key | Period and version |
| Unit price/discount | Remove if not needed for revenue Gate A | Forecast and actual revenue |
| Source system URI | Private Drive URI or controlled reference | Source identity and hash |

Do not put credentials, API keys, personal contact data or unrestricted customer exports in GitHub. Store the redacted evidence in the private Drive project folder and commit only the schema-compatible, non-sensitive extract or a pointer.

## Submission checklist

- [ ] CSV passes `schemas/forecast_snapshot_live.schema.json`.
- [ ] `evidence_class=LIVE_INTERNAL` for production rows.
- [ ] Forecast cutoff precedes actual close and actual availability.
- [ ] `snapshot_status=FROZEN` and approval reference present.
- [ ] At least one eligible row remains after exclusions.
- [ ] Forecast and actual use the same entity, period, grain and currency.
- [ ] Source/export hash, Drive file ID and retrieval timestamp recorded.
- [ ] Approval note and actual-availability evidence stored in private Drive.

## What happens after submission

1. Run template/fixture mode first to catch shape errors.
2. Run live intake validation; resolve every deterministic exclusion reason.
3. Build the leakage-safe accuracy report with eligible/excluded counts, Bias, WAPE, MAPE diagnostic and as-of/model metadata.
4. Perform a P&L denominator tie-out and reviewer sign-off.
5. Archive the CSV, validation output, report and QA evidence in Drive; link the release bundle from GitHub.

## Privacy boundary

This request is intentionally minimal. A refusal to share row-level data is acceptable: a monthly aggregate by channel or category is sufficient if the forecast version, cutoff, approval and actual-availability metadata remain intact. If even numeric values cannot be shared, Gate A must remain pending rather than using invented data.