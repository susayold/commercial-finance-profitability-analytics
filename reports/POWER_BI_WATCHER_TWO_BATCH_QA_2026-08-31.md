# Power BI CSV watcher two-batch QA — 2026-08-31

## Purpose

Prove that a CSV drop is detected by `scripts/watch_powerbi_refresh.py`,
validated through the existing finance contract and applied to a separate
DataRoot without rebuilding the report. This is an operator/Import-refresh
test; it is not a DirectQuery or second-level realtime claim.

## Controlled test

The test used a disposable copy of the committed 14-file fixture as the input
directory and a separate disposable DataRoot. The first run used `--once
--settle-seconds 0 --apply`; the second run changed only `Sales[units]` for the
first line from `121` to `122`, which does not alter the gross-to-net or
contribution identities.

| Batch | Contract hash | Watcher result | DataRoot result |
|---|---|---|---|
| 1 / baseline | `bbca96cdadd97c90c2110f2a5639512f835ae740025ebfbc1c60f0ee8e6cf574` | `PASS`; delegated orchestrator exit `0` | 14 validated files copied |
| 2 / changed | `1009a053566d15c69122fd531b00f064b7e5c915753e6a8398695c15df96144a` | `PASS`; delegated orchestrator exit `0` | first Sales line units `121 → 122` |

Both runs used the validated refresh path. The watcher output also retained the
claim boundary that Import refresh still requires a Desktop/API refresh, while
DirectQuery/APR production evidence remains a separate gate.

## Acceptance

- Contract hash changed after the data edit: **PASS**.
- Both batches passed the delegated finance refresh orchestrator: **PASS**.
- Replacement reached the target DataRoot: **PASS**.
- Report topology/measures were not rebuilt: **PASS by design**; the watcher only
  replaces the contract data and delegates refresh.
- Production realtime claim: **PENDING**; this fixture test does not provide a
  cloud database, capacity, gateway or Automatic Page Refresh evidence.

Disposable input and target folders were deleted after the run. The reproducible
command is documented in `powerbi/POWER_BI_DESKTOP_RUNBOOK.md`.
