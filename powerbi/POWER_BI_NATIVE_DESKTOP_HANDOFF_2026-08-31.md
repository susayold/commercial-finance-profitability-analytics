# Native Power BI Desktop handoff — VNFinance Commercial Finance

This is the last-mile execution sheet for producing a genuine native PBIX. PBIP/PBIT are real editable and reproducible artifacts; only Power BI Desktop can prove observed refresh, rendering, close/reopen and native PBIX save.

## Inputs

| Item | Value |
|---|---|
| Source | [GitHub main](https://github.com/susayold/commercial-finance-profitability-analytics/tree/main) |
| Bundle | [Drive file](https://drive.google.com/file/d/1PAOAS0D60Ueh20b26i9MqBaZB9st3tiX/view?usp=drivesdk) |
| PBIP | powerbi/native/VNFinance_PBIP/VNFinance_Commercial_Finance.pbip |
| PBIT | powerbi/releases/Commercial_Finance_Profitability_Analytics.pbit |
| Data | powerbi/data/current, 14 CSV contracts |
| Topology | 15 tables, 37 measures, 23 relationships, 6 pages, 39 visuals |
| Desktop | D:/Po BI/bin/PBIDesktop.exe |

## 1. Preflight

Run this from the repository root before opening Desktop:

    python scripts/run_powerbi_release_gate.py
      --repo-root .
      --input-dir powerbi/data/current
      --data-root C:/PBI/VNFinance/data/current
      --desktop-path D:/Po BI/bin/PBIDesktop.exe
      --report C:/PBI/evidence/release_gate.json

The deterministic result must be PASS. Retain the JSON; it does not prove native rendering.

## 2. Open and bind

1. Open the PBIP entry point or PBIT. Set DataRoot to the absolute 14-file input folder.
2. Choose Transform data → Edit parameters → Refresh Preview → Close & Apply. Record File → About Power BI version.
3. Run QA-01–QA-18 in powerbi/QA_TEST_MATRIX.md and record observed values, page/visual, timestamp, reviewer and screenshots in powerbi/PBIX_RELEASE_EVIDENCE_TEMPLATE.md.
4. Capture Executive Output, scenarios, P&L/variance, PVM, channel/customer, working-capital and Controls & Evidence pages.
5. Hard-stop on visual errors, missing measures/relationships, finance-control failure, stale controls, scenario changes to actuals or unapproved peer trend rows.

For a supported external-evidence route, see
`POWER_BI_DESKTOP_BRIDGE_HANDOFF_2026-08-31.md`. The Bridge can discover the
open PBIP, reload saved PBIP/PBIR edits and capture page PNGs; it does not
replace the native Desktop refresh, Save As or QA sign-off steps below.

## 3. Replace-data-only proof

1. Copy baseline inputs to a dated candidate and change exactly one valid value, recommended first Sales units plus one.
2. Run prepare_powerbi_refresh.py with --apply, then select Home → Refresh in Desktop.
3. Capture before/after Units, Net Revenue, Contribution Margin, source hash and Controls & Evidence timestamp. Expected unit delta is +1.
4. Close without saving the test change or restore the baseline. This proves repeatable Import refresh, not second-level realtime.

## 4. Save native PBIX

After all 18 QA rows pass, save VNFinance_Commercial_Finance_YYYYMMDD_native.pbix, close/reopen that exact file, record SHA-256/size/version/DataRoot/timestamp, and upload PBIX plus evidence to private Drive. Never commit cache.abf, localSettings.json, credentials or personal paths.

To audit the saved file before upload, run `scripts/validate_native_pbix_release.py` with `--pbix`, `--qa-csv`, `--desktop-version`, `--data-root`, `--refresh-timestamp` and `--report`. It returns `READY_TO_CLAIM` only when the PBIX container is valid, all 18 QA rows are observed `PASS`, and the Desktop metadata is populated; exit code `2` means `PENDING_EXTERNAL_EVIDENCE`, while an invalid/disguised artifact returns exit code `1`. The validator never edits the repository manifest.

## 5. Separate realtime gate

Import refresh is not realtime. Follow powerbi/directquery/PRODUCTION_ACCEPTANCE_MATRIX.md: provision Azure SQL/SQL Server/Fabric, load UTC-watermarked batches, migrate all 14 partitions to DirectQuery, publish through approved gateway/capacity, measure freshness and p50/p95 latency, configure Automatic Page Refresh, and capture a changed batch after the APR cycle. Promote realtime_claim only after every production gate has observed evidence.

| Gate | Status |
|---|---|
| Contract/package/release gate | PASS |
| LocalDB two-batch and latency rehearsal | PASS, local only |
| Native Desktop open/refresh/render/save | PENDING, targetable Desktop UI required |
| Production DirectQuery/APR | PENDING, cloud database and capacity evidence required |
