# Forecast Snapshot Close Calendar (Operating Control)

**Purpose:** convert the Forecast Snapshot Capture Sheet from a template into a repeatable FP&A control. Every submitted forecast must be frozen at a known point in time, reconciled to the approved model, and evaluated only against actuals that were not available at the snapshot cutoff.

## 1. Monthly operating calendar

| Timing | Activity | Primary owner | Required evidence | Gate |
|---|---|---|---|---|
| WD-5 | Refresh actuals through prior month; lock source extracts | Finance Analyst | Source file links, refresh timestamp, row-count check | No missing periods or duplicate company-period rows |
| WD-4 | Update driver assumptions (volume, price/mix, gross margin, opex, working capital) | Business Finance Analyst | Assumption table with prior/current values and rationale | Every changed driver has an owner and comment |
| WD-3 | Run base/upside/downside forecast and PVM bridge | FP&A Analyst | Forecast version, scenario table, PVM bridge | Revenue, gross profit and EBIT bridge to approved prior view |
| WD-2 | Management challenge and revisions | Finance Manager / business owner | Review notes and decision log | Open challenges either resolved or explicitly accepted |
| WD-1 17:00 local | Freeze forecast snapshot | FP&A Analyst | Snapshot ID, as-of date/time, workbook/report version, approver | `snapshot_status = FROZEN`; no post-cutoff edits |
| WD+1 to WD+3 | Publish outlook and actions | Finance Manager | One-page readout, action tracker, distribution list | All material variances have an action or documented watch item |
| Month+1 WD-3 | Load actuals and calculate Bias/WAPE | Finance Analyst | Actuals extract, formula output, exception log | Forecast error is leakage-safe: actuals must be after cutoff |
| Month+1 WD-5 | Review accuracy and root causes | FP&A Manager | Accuracy review, driver attribution, model changes | Recurring bias mapped to an owner and corrective action |
| Quarter-end +10 WD | Rebaseline assumptions and model governance | Head of Finance | Quarterly model review and change log | Material definition/logic changes versioned and approved |

## 2. Minimum snapshot record

Each snapshot row must contain the following fields before it can be marked `FROZEN`:

- `snapshot_id`: immutable key such as `FE-2025-01`.
- `as_of_date` and `as_of_timestamp`: local date and time at which the view was frozen.
- `fiscal_year`, `fiscal_period`, `company`, `metric`, `scenario` and `forecast_value`.
- `source_model_version`: Git commit, workbook version, or PBIX/PBIP version.
- `approver`: named finance owner who accepted the snapshot.
- `source_status`: `approved`, `draft`, or `exception`; only `approved` rows are used for observed accuracy.
- `actual_value`: populated only after the actual close; never overwrite the original forecast.
- `actual_period_close_date`: date on which the actual became available.
- `eligibility_check`: must equal `ELIGIBLE` only when `actual_period_close_date > as_of_date`.
- `exception_note`: mandatory for late actuals, restatements, non-GAAP metrics, or missing source evidence.

## 3. Freeze protocol

1. Duplicate the approved forecast view into a dated snapshot. Do not rely on a live formula linked to a changing forecast tab.
2. Assign a new `snapshot_id`; never recycle an ID after publication.
3. Store the source model version and a read-only export (CSV/XLSX/PBIX/PBIP commit) in the remote archive.
4. Obtain approver sign-off in the decision log. A verbal review without a dated record is not sufficient evidence.
5. Lock the row range. Corrections are additive: append a new revision and explain the superseded record; do not silently edit history.
6. After actual close, populate `actual_value` and `actual_period_close_date` in a separate update. Re-run the leakage check and Bias/WAPE formulas.

## 4. Accuracy and exception policy

### Eligibility

An observation is eligible when the actual became available strictly after the snapshot cutoff. Same-day actuals are treated as ineligible unless the time zone and publication timestamp prove the actual was unavailable at freeze time.

### Metrics

- **Bias:** `(forecast - actual) / actual`; positive means over-forecast.
- **Absolute error:** `ABS(forecast - actual)`.
- **WAPE:** `SUM(absolute error) / SUM(ABS(actual))` at the requested aggregation level.
- Exclude ineligible rows from both numerator and denominator. Do not substitute zero for missing actuals.

### Exceptions

| Exception | Treatment | Evidence |
|---|---|---|
| Actual was available before freeze | Exclude from backtest | Publication timestamp or close log |
| Restated actual | Keep original result; append restated result as a new version | Restatement notice and version IDs |
| Metric definition changed | Do not mix periods; create a new metric key | KPI dictionary change log |
| Missing actual | Leave blank and report coverage gap | Data availability note |
| Non-GAAP / management metric | Report separately from statutory metric | Reconciliation to reported statement |
| Manual override | Preserve pre-override and post-override values | Override reason, owner, approval |

## 5. RACI and sign-off checklist

| Control | R | A | C | I |
|---|---|---|---|---|
| Source refresh and row-count QA | Finance Analyst | FP&A Manager | Data owner | Business lead |
| Driver assumptions | FP&A Analyst | Finance Manager | Sales / operations | CFO |
| Snapshot freeze | FP&A Analyst | Finance Manager | Business owner | CFO |
| Actual load and eligibility | Finance Analyst | FP&A Manager | Accounting | Business owner |
| Accuracy review | FP&A Analyst | Head of FP&A | Finance Manager | CFO |
| Methodology/model change | Model owner | Head of Finance | Internal audit / controllership | Users |

Before sign-off, confirm:

- [ ] All required fields are populated.
- [ ] Forecast totals tie to the approved management view.
- [ ] Revenue, gross profit and EBIT reconcile to the P&L bridge.
- [ ] No actual date is on or before the snapshot cutoff for an eligible row.
- [ ] Bias/WAPE output shows coverage count and no hidden errors.
- [ ] Material exceptions have an owner, due date and evidence link.
- [ ] Remote archive contains the snapshot export and change log.

## 6. What to show a recruiter

Demonstrate one completed cycle rather than only a dashboard screenshot:

1. A frozen snapshot with immutable ID and cutoff timestamp.
2. The approved forecast-to-actual bridge with leakage-safe eligibility logic.
3. Bias/WAPE by metric and period, plus a root-cause action for the largest miss.
4. The control log showing who prepared, reviewed and approved the view.

This evidence proves FP&A judgment, forecast governance and business communication—not just spreadsheet or visualization ability.
