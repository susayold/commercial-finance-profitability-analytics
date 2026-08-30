# Native Power BI Desktop QA — 2026-08-31

## Observed artifact

| Field | Value |
|---|---|
| Native file | `powerbi/releases/Commercial_Finance_Profitability_Analytics_native.pbix` |
| File size | 1,456,507 bytes |
| SHA-256 | `DFA3EC096D46DF2DDCEDA9B3333FA5506FB98B8DE9414C5A792BFE558F301644` |
| Desktop executable | `D:\Po BI\bin\PBIDesktop.exe` |
| Desktop version | `2.157.879.0 (26.08)` |
| DataRoot used | `powerbi/data/current` in the disposable Desktop checkout |
| Operating mode | Import with `DataRoot` parameter and explicit refresh |
| Evidence timestamp | 2026-08-31 02:44:45 +07:00 |

## What was actually executed

1. Loaded the repaired PBIT in Power BI Desktop and supplied the `DataRoot`
   parameter. The report opened with six pages and the finance model visuals.
2. Saved the loaded report through Desktop **Save As** to a native `.pbix`.
3. Closed Desktop, reopened the exact native PBIX, and observed the report title
   `Commercial_Finance_Profitability_Analytics_native` with the Executive Output
   page and six page tabs visible.
4. Invoked Desktop **Refresh** against the current 14-file CSV contract and
   saved the native PBIX again.
5. Performed the replace-data-only proof: changed only the first row of
   `sales_fact.csv`, `units` 121 → 122, refreshed the open PBIX, and observed
   the `Units Total` total move from **1,256,859** to **1,256,860** on the PVM
   Bridge page. The original CSV was restored and the PBIX was refreshed and
   saved back at the baseline state.

## Evidence files

- [PBIT parameter load](evidence/POWER_BI_PBIT_PARAMETER_LOAD_2026-08-31.png)
- [Native PBIX reopened in Desktop](evidence/POWER_BI_NATIVE_PBIX_REOPEN_2026-08-31.png)
- [Executive Output after native save](evidence/POWER_BI_NATIVE_PBIX_EXECUTIVE_OUTPUT_2026-08-31.png)

## Claim boundary

This is direct evidence that the checked-in package can be instantiated,
refreshed, saved as a real native PBIX, reopened and updated after a
data-only CSV replacement. It does **not** claim the full QA-01–QA-18 matrix,
Power BI Service deployment, gateway connectivity, DirectQuery storage mode or
second-level Automatic Page Refresh. The release manifest intentionally keeps
the formal native QA and production realtime gates pending until those
separate external acceptance tests are completed.
