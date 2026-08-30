# Power BI current release status — 2026-08-31

This is the current handoff record for the VNFinance commercial-finance
portfolio project. The source of truth is the public GitHub `main` branch; the
binary/source bundle is mirrored in the private Drive file linked below.

## Release identity

| Item | Current value |
|---|---|
| GitHub repository | [commercial-finance-profitability-analytics](https://github.com/susayold/commercial-finance-profitability-analytics) |
| Handoff commit | [`25f8278`](https://github.com/susayold/commercial-finance-profitability-analytics/commit/25f827855feeec25ad1d3e187be7d987ead4e830) — last fully gated handoff |
| Current repository head | [`9519647`](https://github.com/susayold/commercial-finance-profitability-analytics/commit/95196471a310692fda5576f6eb8bb43da8a85177) — editable scenario drivers + extended PBIT/DirectQuery QA |
| Latest validated CI | [Finance model QA](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33327789127) — PASS |
| Latest local release gate | [Compact gate](POWER_BI_COMPACT_RELEASE_GATE_2026-08-31.json) + [extended gate](POWER_BI_EXTENDED_RELEASE_GATE_2026-08-31.json) — PASS; Desktop preflight 14/14 |
| Drive bundle | [VNFinance Commercial Finance project archive](https://drive.google.com/file/d/1PAOAS0D60Ueh20b26i9MqBaZB9st3tiX/view?usp=drivesdk) |
| Native PBIX on Drive | [VNFinance Commercial Finance native PBIX](https://drive.google.com/file/d/15wJmM8POBNonWIfslSAdh8ihSUZZNc3W/view?usp=drivesdk) |
| Power BI Desktop host | `D:\Po BI\bin\PBIDesktop.exe` |
| Desktop version recorded by preflight | `2.157.879.0 (26.08)` |
| Current operating mode | `Import_replace_and_refresh` |
| Extended scope package | 20 tables / 60 measures / 25 relationships / 6 pages / 42 visuals; extended PBIT + PBIP validated in Desktop |

## Delivered and verified

| Capability | Evidence | Status |
|---|---|---|
| Editable report source | PBIP + TMDL + PBIR under `powerbi/native/VNFinance_PBIP/` | PASS |
| Reusable template | `powerbi/releases/Commercial_Finance_Profitability_Analytics.pbit` | PASS |
| Model topology | 15 tables, 37 measures, 23 relationships, 6 pages, 39 visuals | PASS |
| Input contract | 14 CSV partitions, 78/78 deterministic checks | PASS |
| Data replacement | Two-batch LocalDB QA; `Sales[units]` 1,256,859 → 1,256,860; 20 health samples | PASS |
| Refresh orchestration | `run_finance_refresh.py` + `prepare_powerbi_refresh.py` | PASS |
| DirectQuery mechanics | Ephemeral LocalDB two-batch, 20-sample latency and 5-state health QA | PASS — local only |
| Native PBIX observed artifact | `powerbi/releases/Commercial_Finance_Profitability_Analytics_native.pbix`; Desktop open, refresh, Save As and reopen observed | PASS — observed workflow |
| Native page captures | Six report pages captured from the reopened PBIX; [capture index](POWER_BI_NATIVE_PAGE_CAPTURE_INDEX_2026-08-31.md) | PASS — visual evidence |
| Row-level native QA coverage | [Partial evidence map](POWER_BI_NATIVE_QA_PARTIAL_EVIDENCE_2026-08-31.md) separates observed/source-backed rows from pending reviewer rows | PASS — scoped evidence |
| Extended planning/evidence scope | [Extended Desktop QA](POWER_BI_EXTENDED_SCOPE_DESKTOP_QA_2026-08-31.md); Scenario, OPEX, CAPEX, approved peers and review queue hydrated from 19-file DataRoot | PASS — extended PBIT/PBIP; native PBIX not claimed |
| Scenario driver sensitivity | [Scenario-driver QA](POWER_BI_SCENARIO_DRIVER_QA_2026-08-31.md); five rows, base-case selection, revenue/COGS/OPEX multipliers and arithmetic output | PASS — static source-level rehearsal; native visual sign-off remains separate |
| Native PBIX | Compact workflow observed; formal QA-01–QA-18 evidence sheet and full visual sign-off remain open | PENDING |
| Production realtime | Requires cloud database, gateway/capacity and APR measurements | PENDING |

## Data replacement contract

The report is decoupled from a laptop-specific folder through one `DataRoot`
parameter. The compact baseline replacement batch must preserve the 14 filenames, headers, keys,
types and finance identities. The controlled path is:

```text
candidate CSV drop
  -> validate_powerbi_input_contract.py
  -> watch_powerbi_refresh.py (stable-copy hash)
  -> prepare_powerbi_refresh.py --apply
  -> Power BI Desktop Home > Refresh (or approved Service refresh)
  -> Controls & Evidence timestamp and source hashes
```

The extended package uses the same parameter and adds five files:
`scenario_selector.csv`, `opex_headcount_planning_synthetic.csv`,
`capex_fixed_asset_planning_synthetic.csv`,
`peer_benchmark_approved_2016_2025.csv` and `peer_extraction_queue.csv`.
Keep all 19 files when binding the extended PBIT/PBIP; replacing any file with
the same schema and selecting **Refresh** updates the dependent measures and
visuals automatically.

The watcher deliberately does not claim second-level realtime: Import mode
still needs a Desktop/API refresh. The model design, measures, relationships
and visuals are not rebuilt when the data files change.

The DirectQuery health query additionally returns `control_reason` beside
`control_status`, allowing the Controls & Evidence page to distinguish a
current batch from stale, rejected-row, failed-load or no-load states.

## Native PBIX gate

Use [the native Desktop handoff](../powerbi/POWER_BI_NATIVE_DESKTOP_HANDOFF_2026-08-31.md)
to set `DataRoot`, execute QA-01 through QA-18, perform the one-value
replace-data proof, then save and reopen a native `.pbix`. Run
`scripts/validate_native_pbix_release.py` against that exact file. It returns
`READY_TO_CLAIM` only when the PBIX container, all observed QA rows and Desktop
metadata are present; a PBIT renamed to PBIX is rejected.

The observed native file is now checked in and mirrored to Drive. Desktop
opened the repaired PBIT, saved a native PBIX, reopened it, refreshed it, and
showed the `Units Total` +1 proof (`1,256,859 → 1,256,860`) after changing only
the CSV input. The formal QA-01–QA-18 matrix remains pending because this
release does not promote a partial screenshot set to a full visual sign-off.

## Production realtime gate

The DirectQuery migration pack keeps the same table and measure contract. The
production sequence is: provision Azure SQL/SQL Server/Fabric, load UTC
watermarked batches, reconcile against Import, switch the duplicate report to
DirectQuery, publish through an approved gateway/capacity, measure p50/p95
latency and freshness, then enable Automatic Page Refresh. The canonical
acceptance matrix is `powerbi/directquery/PRODUCTION_ACCEPTANCE_MATRIX.md`.

Until those external gates pass, describe the project as **refreshable Import
analytics with a DirectQuery migration path**, not as production streaming
realtime.

## Operator next action

1. Execute and record the remaining QA-01–QA-18 visual matrix on a review
   workstation.
2. If promoting the extended scope to a native PBIX, save/reopen the extended
   PBIT after its full QA matrix and record a separate binary hash.
3. If production second-level freshness is required, provision the database,
   gateway/capacity and DirectQuery/APR acceptance path in the matrix.
4. Keep credentials, cache files and personal paths out of GitHub; the
   checked-in PBIP/PBIT and observed PBIX are the reproducible handoff.
