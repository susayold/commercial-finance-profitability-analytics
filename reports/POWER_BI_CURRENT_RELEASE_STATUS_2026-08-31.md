# Power BI current release status — 2026-08-31

This is the current handoff record for the VNFinance commercial-finance
portfolio project. The source of truth is the public GitHub `main` branch; the
binary/source bundle is mirrored in the private Drive file linked below.

## Release identity

| Item | Current value |
|---|---|
| GitHub repository | [commercial-finance-profitability-analytics](https://github.com/susayold/commercial-finance-profitability-analytics) |
| Latest validated CI | [Finance model QA](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33326658637) — PASS |
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
| Data replacement | Watcher two-batch QA; `Sales[units]` 121 → 122 | PASS |
| Refresh orchestration | `run_finance_refresh.py` + `prepare_powerbi_refresh.py` | PASS |
| DirectQuery mechanics | Ephemeral LocalDB two-batch and latency rehearsal | PASS — local only |
| Native PBIX | Requires Desktop open, refresh, render, save and reopen evidence | PENDING |
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

## Native PBIX gate

Use [the native Desktop handoff](../powerbi/POWER_BI_NATIVE_DESKTOP_HANDOFF_2026-08-31.md)
to set `DataRoot`, execute QA-01 through QA-18, perform the one-value
replace-data proof, then save and reopen a native `.pbix`. Run
`scripts/validate_native_pbix_release.py` against that exact file. It returns
`READY_TO_CLAIM` only when the PBIX container, all observed QA rows and Desktop
metadata are present; a PBIT renamed to PBIX is rejected.

No native PBIX is claimed in this release. The Computer Use runtime currently
fails before it can expose a targetable Desktop window, so no refresh/render
evidence has been invented or inferred from the source package.

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

1. Open the PBIP or PBIT on a working Power BI Desktop host.
2. Set `DataRoot` to the 14-file input folder and refresh.
3. Complete QA-01–QA-18 and the +1 units replace-data proof.
4. Save/reopen the native PBIX and upload the PBIX plus evidence to private
   Drive; keep credentials, cache files and personal paths out of GitHub.

