# Power BI Desktop Native QA — 2026-08-30

## Scope

This is an execution-host evidence record for the editable PBIP/PBIT package. It does not claim a native `.pbix` until Desktop refresh and visual checks are captured.

## Evidence

| Check | Result | Evidence |
|---|---:|---|
| Power BI Desktop executable | PASS | `D:\Po BI\bin\PBIDesktop.exe`, version `2.157.879.0 (26.08)+da30fe74eb0b8a8786ab7326b69c400a0e951831` |
| PBIP/PBIT/data artifacts | PASS | Custom-path preflight: 14/14 checks |
| Replacement-data contract | PASS | 78/78 checks; 14 CSV files; finance identities and referential integrity pass |
| PBIP/PBIT package coherence | PASS | 29/29 checks; 15 tables, 37 measures, 23 relationships, six pages, 39 visuals |
| Desktop launch | OBSERVED | `PBIDesktop.exe` process alive after launching the PBIP entry point; window title reported `Untitled - Power BI Desktop` |
| Desktop model binding | PENDING | Computer Use runtime did not expose a targetable Power BI window |
| Desktop Refresh | PENDING | No UI action or refresh timestamp evidence captured |
| Visual reconciliation | PENDING | No canvas screenshot/evidence captured |
| Native `.pbix` creation | NOT CLAIMED | Must follow refresh, QA-01–QA-18 and save/archive steps in the runbook |

## Re-run command

```powershell
.\scripts\powerbi_desktop_preflight.ps1 `
  -ProjectRoot . `
  -DataRoot .\powerbi\data\current `
  -DesktopPath 'D:\Po BI\bin\PBIDesktop.exe'
```

The `-DesktopPath` override is intentional: Power BI Desktop is installed outside the two default paths on this execution host.

## Claim boundary

The Import-mode model is refreshable by replacing the 14 contract CSVs and refreshing in Desktop. It is not second-level real-time. Automatic Page Refresh requires a supported DirectQuery/LiveConnect source, which remains gated by the DirectQuery provisioning checklist.

## Subsequent native artifact update — 2026-08-31

The earlier host record above is retained as a historical snapshot of the
2026-08-30 attempt. A later Desktop run produced the native artifact
`powerbi/releases/Commercial_Finance_Profitability_Analytics_native.pbix`.
The exact open, refresh, Save As, close/reopen and +1 `Sales[units]` proof are
recorded in [`reports/POWER_BI_NATIVE_PBIX_DESKTOP_QA_2026-08-31.md`](POWER_BI_NATIVE_PBIX_DESKTOP_QA_2026-08-31.md).
This update supersedes the old “no canvas screenshot” statement for the
observed workflow, but does not promote the full QA-01–QA-18 matrix or
production realtime claim.
