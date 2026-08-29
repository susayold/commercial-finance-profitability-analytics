# Real Forecast Snapshot Onboarding Pack

Status: ready for external data handoff; not a claim that live company data is available.  
Owner: FP&A / Finance Analyst  
Purpose: replace the controlled DEMO_FIXTURE_v1 with an approved pre-close forecast snapshot without changing the backtest logic.

## 1. Required grain

One row per:

forecast version × target month × company × brand × channel

The snapshot must be captured before the target period closes. It must be immutable after approval; corrections require a new version or a documented exception.

## 2. Required field contract

| Field | Type | Required | Definition | Validation |
|---|---|---:|---|---|
| forecast_version | text | Yes | Immutable version ID, e.g. FE-2026-09 | Unique with created date and target grain |
| forecast_created_date | ISO date/time | Yes | Timestamp when the forecast was frozen | Must be before actual close and actual availability |
| target_month | YYYY-MM | Yes | Month being forecast | Must be a valid calendar month |
| company | text | Yes | Legal entity / management perimeter | Match approved entity master |
| brand | text | Yes | Brand or portfolio bucket | Match brand master; use ALL only by explicit policy |
| channel | text | Yes | Commercial channel | Match channel master |
| forecast_revenue_vnd | decimal | Yes | Frozen revenue forecast in VND | Non-negative; preserve source precision |
| actual_revenue_vnd | decimal | Yes after close | Actual net revenue in VND | Tied to closed P&L / revenue ledger |
| actual_available_date | ISO date/time | Yes after close | Date actual became available to the analyst | Must not precede forecast creation timestamp |
| as_of_date | ISO date | Yes | Backtest cutoff date | Actuals after cutoff are excluded |
| snapshot_status | enum | Yes | DRAFT / FROZEN / EXCEPTION | Only FROZEN + ELIGIBLE feed Bias/WAPE |
| source_model_version | text | Yes | Version/hash of source planning model | Must be traceable to archive |
| approver | text | Yes for FROZEN | Named approver and role | Blank approver blocks release |
| actual_period_close_date | ISO date | Yes | Accounting close date for target month | Must match close calendar |
| exception_note | text | Conditional | Reason for EXCEPTION or DRAFT | Required for every exclusion |

## 3. Close-calendar protocol

1. **WD-5:** FP&A locks the latest estimate and records forecast_created_date.
2. **WD-4 to WD-1:** commercial and supply-chain owners review drivers; no overwrite of frozen rows.
3. **Month-end:** Accounting closes the revenue ledger and records actual_period_close_date.
4. **Month+1 close:** actual_revenue_vnd becomes available; record actual_available_date.
5. **Month+1 + 1 working day:** run the leakage-safe backtest with the agreed as-of date.
6. **Review:** explain Bias/WAPE by forecast version and channel; retain exclusions.
7. **Archive:** append the immutable CSV, QA report and approver evidence to GitHub/Drive.

## 4. RACI

| Activity | FP&A | Accounting | Commercial | Supply Chain | Finance Lead |
|---|---|---|---|---|---|
| Freeze forecast | R | C | C | C | A |
| Confirm entity / channel mapping | R | C | A | C | I |
| Close actual revenue | C | A/R | I | I | I |
| Record actual availability | R | A | I | I | I |
| Review exclusions | A/R | C | C | C | I |
| Publish Bias/WAPE | R | C | I | I | A |

R = Responsible, A = Accountable, C = Consulted, I = Informed.

## 5. Acceptance tests before publishing live accuracy

- At least one FROZEN row exists for an approved version.
- Every FROZEN row is ELIGIBLE under the leakage rule.
- No row has forecast_created_date after actual_available_date.
- Actuals after as_of_date are excluded and counted as NOT_ELIGIBLE.
- Source model version, approver and period-close date are populated.
- Revenue ties to the closed P&L at the approved tolerance.
- Bias/WAPE output includes as_of_date, eligible row count and excluded-row reasons.
- The Controls & Evidence page and the archive CSV show the same counts.
- The metric label distinguishes LIVE_OBSERVED from DEMO_FIXTURE.

## 6. Minimal handoff CSV

Use the existing forecast_accuracy_input_template.csv for the analytical fields. Add the governance columns in the native capture Sheet or use forecast_snapshot_capture_demo_frozen.csv as the fully expanded example.

## 7. Release labels

- DEMO_FIXTURE_ONLY: controlled synthetic evidence; useful for testing mechanics.
- LIVE_OBSERVED: approved real source, pre-close freeze and actual close evidence all present.
- NOT_ELIGIBLE: actual is not available by the as-of date.
- FUTURE_LEAKAGE: forecast was created after actual availability; never include in metrics.
- EXCEPTION: excluded row requiring documented owner and resolution.

Never promote DEMO_FIXTURE_ONLY to LIVE_OBSERVED by changing a label alone; the source evidence and approval trail must exist.
