# Power BI current release status — 2026-08-31

This is the current handoff record for the VNFinance commercial-finance
portfolio project. The source of truth is the public GitHub `main` branch; the
binary/source bundle is mirrored in the private Drive file linked below.

## Release identity

| Item | Current value |
|---|---|
| GitHub repository | [commercial-finance-profitability-analytics](https://github.com/susayold/commercial-finance-profitability-analytics) |
| Handoff commit | [`607e329`](https://github.com/susayold/commercial-finance-profitability-analytics/commit/607e329969d5c0238f5c37740953529a4345abf7) |
| Latest validated CI | [Finance model QA](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33327789127) — PASS |
| Latest local release gate | `b4f0c42` — PASS; ten deterministic stages and Desktop preflight 14/14 |
| Drive bundle | [VNFinance Power BI refreshable package](https://drive.google.com/file/d/1PAOAS0D60Ueh20b26i9MqBaZB9st3tiX/view?usp=drivesdk) |
| Power BI Desktop host | `D:\Po BI\bin\PBIDesktop.exe` |
| Desktop version recorded by preflight | `2.157.879.0 (26.08)` |
| Current operating mode | `Import_replace_and_refresh` |

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
| Native PBIX | Formal QA-01–QA-18 evidence sheet and full visual sign-off remain open | PENDING |
| Production realtime | Requires cloud database, gateway/capacity and APR measurements | PENDING |

## Data replacement contract

The report is decoupled from a laptop-specific folder through one `DataRoot`
parameter. A replacement batch must preserve the 14 filenames, headers, keys,
types and finance identities. The controlled path is:

```text
candidate CSV drop
  -> validate_powerbi_input_contract.py
  -> watch_powerbi_refresh.py (stable-copy hash)
  -> prepare_powerbi_refresh.py --apply
  -> Power BI Desktop Home > Refresh (or approved Service refresh)
  -> Controls & Evidence timestamp and source hashes
```

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
2. If production second-level freshness is required, provision the database,
   gateway/capacity and DirectQuery/APR acceptance path in the matrix.
3. Keep credentials, cache files and personal paths out of GitHub; the
   checked-in PBIP/PBIT and observed PBIX are the reproducible handoff.
