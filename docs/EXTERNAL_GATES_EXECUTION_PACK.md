# External Gates Execution Pack

This pack is the final operating checklist for the two items that cannot be honestly closed from public or synthetic data. It is deliberately executable: a reviewer should be able to take the inputs, run the controls, and reproduce the release decision.

## 0. Evidence classes and release rule

| Class | Meaning | Can close a gate? |
|---|---|---|
| `PUBLIC_REPORTED` | Official annual report, filing, AGM guidance or investor presentation | No; context/calibration only |
| `CALCULATED_PUBLIC` | A ratio, CAGR, bridge or error metric calculated from public reported values | No; useful benchmark only |
| `DEMO_FIXTURE_ONLY` | Deterministic synthetic or structural unit-test data | No; tests the control logic only |
| `LIVE_INTERNAL` | Approved internal planning snapshot plus closed-period actuals | Gate A, after all controls pass |
| `PBIX_NATIVE` | Power BI Desktop binary with executed visual and model evidence | Gate B, after all 18 tests pass |

Never publish a `Bias` or `WAPE` headline without the evidence class, eligible-row count, excluded-row count and as-of date beside it.

## 1. Gate A — live forecast accuracy

### 1.1 Intake grain

One immutable row represents one `forecast_version_id × target_period × company × brand × channel`. Do not aggregate away version or cutoff timestamp. The frozen forecast value must never be overwritten when actuals arrive.

Required fields:

- `snapshot_id`, `forecast_version_id`, `source_model_version`;
- `forecast_created_at`, `forecast_cutoff_at`, `actual_period_close_date`, `actual_available_at`;
- `snapshot_status` (`DRAFT`, `FROZEN`, `SUPERSEDED`);
- `evidence_class` (`LIVE_INTERNAL` only for production evidence);
- `company_id`, `brand_id`, `channel_id`, `target_period`;
- `forecast_revenue_vnd`, `actual_revenue_vnd`;
- `approver_name`, `approver_role`, `approval_reference`;
- `source_system`, `source_export_uri`, `actuals_source_uri`;
- `gate_a_eligible`, `exclusion_reason`, `mapping_note`.

### 1.2 Pre-close freeze protocol

1. At WD-5, export the planning version without post-cutoff edits.
2. Record the exact timezone, cutoff timestamp, model version and approver.
3. Hash the export and store the immutable original in the private Drive evidence folder.
4. Run the schema validator in fixture mode first to catch shape errors.
5. After accounting close, append actuals to a new controlled revision; never edit the frozen forecast value.
6. Record the actual close date and the first timestamp at which actuals were available to FP&A.
7. Set `snapshot_status=FROZEN` only when approval, source version and dates are present.

### 1.3 Eligibility rules

A row is eligible only when all are true:

- `evidence_class=LIVE_INTERNAL`;
- forecast creation and cutoff precede actual close and actual availability;
- snapshot is `FROZEN`;
- forecast and actual are non-null and use the same scope, currency and period;
- source and approval references are populated;
- actual period is closed.

Otherwise set `gate_a_eligible=NO` and provide a deterministic exclusion reason. Future leakage, synthetic labels, public-guidance rows and post-close forecast versions are hard stops.

### 1.4 Accuracy calculation

For each eligible row:

- `error_vnd = forecast_revenue_vnd - actual_revenue_vnd`;
- `abs_error_vnd = ABS(error_vnd)`;
- `bias_pct = SUM(error_vnd) / SUM(actual_revenue_vnd)`;
- `wape_pct = SUM(abs_error_vnd) / SUM(actual_revenue_vnd)`;
- `mape_pct` is reported only as a diagnostic and excludes zero-actual rows with an explicit count.

Report overall, by month, by channel and by brand. Include eligible rows, excluded rows, zero-actual rows, as-of date and the model version. Reconcile the denominator to the closed P&L; any unexplained difference blocks release.

### 1.5 Gate A release bundle

- `data/forecast_snapshot_live_<version>_<period>.csv`;
- `reports/FORECAST_ACCURACY_LIVE_<version>_<period>.md`;
- `reports/FORECAST_ACCURACY_LIVE_<version>_<period>_QA.md`;
- approval/freeze screenshot or planning export;
- close and actual-availability evidence;
- validator output and SHA-256/Drive metadata.

The release report must state `LIVE_OBSERVED` and include a short management action (for example, channel-mix driver ownership or forecast-bias correction). A public-guidance proxy may be shown as a benchmark, never substituted for this bundle.

## 2. Gate B — native Power BI Desktop

### 2.1 Source and topology

Use the latest Excel v2 workbook, the PBIP source manifest and the documented 15-relationship topology. Preserve the table names and grain. Confirm `Customer_Master[CustomerID] → AR[CustomerID]` is present and that all dimensions filter facts single-directionally unless the checklist explicitly permits otherwise.

### 2.2 Six-page build contract

1. **CFO Executive Summary** — net sales, gross margin, EBITDA, cash, CCC, forecast status and a concise action panel.
2. **Revenue & Margin Drivers** — Actual/Budget/Forecast trend, PVM bridge, channel and category mix.
3. **Profitability & Unit Economics** — SKU, customer and channel contribution; D2C CAC/LTV guardrail.
4. **Promotion, Pricing & Allocation** — promotion ROI after spend, pricing elasticity/break-even, fixed-budget conservation.
5. **Forecast & Risk** — forecast versions, eligible/excluded rows, Bias/WAPE when Gate A is live, scenario and Monte Carlo ranges.
6. **Inventory, Working Capital & Liquidity** — DSO/DIO/DPO/CCC, AR aging, inventory reserve, revolver headroom and stress view.

Each page needs a visible period selector, evidence-class label and drill path back to the source table or methodology. Do not show a headline that cannot be reconciled to Excel v2.

### 2.3 QA-01–QA-18 execution sequence

1. Refresh the model and capture refresh timestamp/model version.
2. Run QA-01–QA-06 for schema, relationships and row-grain controls.
3. Run QA-07–QA-12 for totals, PVM, profitability, working capital and liquidity reconciliation.
4. Run QA-13–QA-15 for promotion ROI, pricing and budget allocation guardrails.
5. Run QA-16–QA-18 for forecast evidence boundaries, visual usability and source traceability.
6. For every row in `powerbi/QA_EVIDENCE_LOG_TEMPLATE.csv`, record observed value, expected value, evidence reference, reviewer, execution timestamp and result.
7. A `PASS` without an evidence reference is invalid. A `FAIL` requires owner, remediation and retest date.
8. Export PDF or page screenshots and retain the PBIX hash.

### 2.4 Native release bundle

- `Commercial_Finance_Profitability_Analytics.pbix`;
- `reports/POWER_BI_NATIVE_QA_2026-08-30.md`;
- `reports/POWER_BI_NATIVE_VISUAL_EVIDENCE_2026-08-30.pdf` or screenshots;
- completed `powerbi/QA_EVIDENCE_LOG_TEMPLATE.csv`;
- refresh metadata, reviewer sign-off and binary SHA-256.

The PBIP manifest, screenshots without a binary, or a renamed placeholder are not a native release.

## 3. Reviewer and CV conversion

Once both gates are closed, update the CV with only these four evidence-backed fields:

1. forecast horizon, eligible observations, Bias and WAPE, with `LIVE_OBSERVED` label;
2. native Power BI page count and `18/18 QA PASS` with PBIX/visual evidence link;
3. one quantified commercial decision (promotion, pricing or budget allocation) with the relevant hurdle/tolerance;
4. one quantified cash or working-capital action with owner and timing.

Until then, CV language must say `public-guidance proxy`, `synthetic rehearsal` or `PBIP source scaffold` exactly as labelled in the repository. Replace bracketed contact, education and experience fields with the candidate's real facts before applications.

## 4. RACI and cadence

| Activity | Analyst | FP&A/Finance Lead | Accounting | Sales/Marketing | Reviewer |
|---|---|---|---|---|---|
| Freeze forecast | R | A | C | C | I |
| Supply closed actuals | R | C | A | I | I |
| Validate Gate A | R | A | C | I | C |
| Build PBIX | R | C | I | C | I |
| Execute QA-01–18 | R | C | C | I | A |
| Approve release | C | A | C | I | R |

Recommended cadence: WD-5 freeze, WD+3 close tie-out, WD+5 actual availability confirmation, WD+7 accuracy readout, monthly Power BI refresh, quarterly control review.

## 5. Final hard stops

- No genuine internal source: remain `FIXTURE_PASS_NOT_LIVE`.
- Missing approver, model version, close date or actual-availability date: do not publish.
- Frozen forecast overwritten: invalidate the snapshot and re-export.
- Any QA PASS without evidence: mark OPEN and remediate.
- Any visual not tied to Excel v2: remove from release.
- Any unsupported CV claim: remove or add a direct artifact link.

