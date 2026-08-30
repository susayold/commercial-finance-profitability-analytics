# Power BI Desktop Runbook — VNFinance Commercial Finance

**Purpose.** This runbook is the execution guide for the real, editable Power BI package in this repository. It separates three capabilities that are often incorrectly conflated:

| Capability | Current package | What the user does |
|---|---|---|
| Editable report/model source | `VNFinance_Commercial_Finance.pbip` | Open the PBIP project in Power BI Desktop and edit visuals, model metadata and DAX. |
| Reusable template | `Commercial_Finance_Profitability_Analytics.pbit` | Open the template, bind `DataRoot`, then save a new `.pbix`. |
| Extended finance-analyst scope | `VNFinance_PBIP_Extended` / `Commercial_Finance_Profitability_Analytics_extended.pbit` | Adds scenario selection, OPEX/headcount, CAPEX/payback, approved peer benchmark and review queue tables. |
| Continuous realtime | DirectQuery readiness pack only | Provision a SQL/Fabric source, migrate the partitions, then enable Automatic Page Refresh. |

The checked-in source is real PBIP/PBIR/TMDL, the compiled artifact is a real
PBIT archive, and `powerbi/releases/Commercial_Finance_Profitability_Analytics_native.pbix`
is an observed Desktop Save As output. The native file proves the open,
refresh, save/reopen and data-only replacement workflow; the formal QA-01–QA-18
visual gate remains separate and is not inferred from a partial screenshot set.

## 1. Get the authoritative package

Use the latest GitHub `main` branch and the Drive bundle. Do not use an old local clone as the source of truth.

- GitHub repository: `https://github.com/susayold/commercial-finance-profitability-analytics`
- Drive project folder: `https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR`
- Editable PBIP entry point: `powerbi/native/VNFinance_PBIP/VNFinance_Commercial_Finance.pbip`
- Compiled template: `powerbi/releases/Commercial_Finance_Profitability_Analytics.pbit`
- Legacy pbi-tools source: `powerbi/native/VNFinance_PbixProj`
- Package manifest: `powerbi/PBIP_SOURCE_MANIFEST.json`
- Generated-artifact coherence validator: `scripts/validate_powerbi_artifact_coherence.py`
- Refresh architecture: `docs/POWER_BI_REFRESH_ARCHITECTURE.md`
- Data contract validator: `scripts/validate_powerbi_input_contract.py`
- Controlled data-swap runner: `scripts/prepare_powerbi_refresh.py`
- Realtime/native claim-boundary validator: `scripts/validate_powerbi_claim_boundary.py`
- DirectQuery mapping and health validators: `scripts/validate_directquery_mapping.py` and `scripts/validate_directquery_health_contract.py`
- Native binary boundary note: `powerbi/POWER_BI_NATIVE_BINARY_BOUNDARY.md`
- Desktop QA matrix: `powerbi/QA_TEST_MATRIX.md`
- Release evidence template: `powerbi/PBIX_RELEASE_EVIDENCE_TEMPLATE.md`
- Native Desktop handoff: `powerbi/POWER_BI_NATIVE_DESKTOP_HANDOFF_2026-08-31.md`

Before Desktop work, verify the package and data locally:

```powershell
python scripts/validate_powerbi_input_contract.py --input-dir powerbi/data/current
python scripts/validate_powerbi_refreshable_project.py `
  --pbit powerbi/releases/Commercial_Finance_Profitability_Analytics.pbit `
  --pbip powerbi/native/VNFinance_PBIP `
  --pbixproj powerbi/native/VNFinance_PbixProj `
  --data-dir powerbi/data/current `
  --report reports/POWER_BI_REFRESHABLE_PACKAGE_QA.md
```

Both commands must return `PASS` before opening Desktop.

The manifest also declares a `scope_contract`: the broader `model_contract.json` is the full Excel design, while `package_inventory` is the compact PBIP/PBIT topology actually opened by Desktop. Run the artifact-coherence validator whenever the generator or compiled template changes.

The extended package is a separate, source-controlled PBIP/PBIT topology with 20
tables, 60 measures, 25 relationships, 6 pages and 42 visuals. It has been
opened and hydrated in Desktop against the 19-file contract. A real native PBIX
candidate is archived and intake-validated, but it is not promoted to a full
extended native release until a separate Save As/reopen and QA-01–QA-18 evidence
cycle is captured on that exact scope.

On a Windows execution host, the one-command preflight also checks the Desktop executable, package paths and (when supplied) the 14-file input folder:

```powershell
.\scripts\powerbi_desktop_preflight.ps1 -ProjectRoot . -DataRoot .\powerbi\data\current
```

To retain the host/data gate as machine-readable release evidence, add
`-Report` (the command still exits `2` while Desktop is not installed):

```powershell
.\scripts\powerbi_desktop_preflight.ps1 `
  -ProjectRoot . `
  -DataRoot .\powerbi\data\current `
  -Report .\reports\POWER_BI_DESKTOP_PREFLIGHT_YYYY-MM-DD.json
```

If Desktop is installed outside the two default Windows locations, pass the executable explicitly:

```powershell
.\scripts\powerbi_desktop_preflight.ps1 -ProjectRoot . -DataRoot .\powerbi\data\current -DesktopPath 'D:\Po BI\bin\PBIDesktop.exe'
```

`PASS` means the host is ready for native execution. `PENDING` is an actionable host/data gate; it is not evidence that a PBIX was opened or refreshed.

For the extended package, pass `-Scope extended`; the preflight then expects the
five additional CSVs and the extended PBIP/PBIT paths:

```powershell
.\scripts\powerbi_desktop_preflight.ps1 -Scope extended -ProjectRoot . -DataRoot .\powerbi\data\current -DesktopPath 'D:\Po BI\bin\PBIDesktop.exe'
```

## 2. Desktop host preflight

1. Install a current Power BI Desktop release on the execution host. This host must have the Desktop executable; a ZIP, PBIT or PBIP file alone cannot execute native refresh/render QA.
2. Enable **Power BI Project (.pbip)** under **File > Options and settings > Options > Preview features**. Enable PBIR/TMDL only if the installed build exposes those options.
3. Use a short path such as `C:\PBI\VNFinance_Commercial_Finance` when extracting the Drive bundle. Keep the GitHub/Drive copies authoritative and treat the Desktop checkout as disposable.
4. Close any stale copy of the report. Do not mix a `.pbit` opened from Downloads with a PBIP opened from another folder; this is the most common cause of an apparently “unchanged” refresh.
5. Record the exact Desktop version from **File > About Power BI** in the release evidence file.

## 3. Import mode: replace data, keep the report

This is the supported no-database workflow. The model uses one Text parameter, `DataRoot`, and every CSV partition resolves its file from that folder. Keep the filenames, headers, types and key rules unchanged.

### Required input files (14)

`sales_fact.csv`, `commercial_costs.csv`, `inventory.csv`, `receivables.csv`, `payables.csv`, `debt.csv`, `budget.csv`, `forecast.csv`, `marketing_spend.csv`, `promotions.csv`, `product_master.csv`, `customer_master.csv`, `channel_master.csv`, and `source_control.csv`.

`Calendar` is generated by Power Query from the minimum and maximum month in `sales_fact.csv`; it is not a fifteenth CSV input.

The extended scope keeps these 14 files and adds five same-schema inputs:
`scenario_selector.csv`, `peer_benchmark_approved_2016_2025.csv`,
`peer_extraction_queue.csv`, `opex_headcount_planning_synthetic.csv`, and
`capex_fixed_asset_planning_synthetic.csv` (19 CSVs total). Peer numeric blanks
are intentionally retained as model blanks where the approved public source
does not disclose a line item; they are not imputed as zero.

### One-time binding

1. Open the PBIT (new report) or the PBIP (source-controlled project).
2. When prompted, set `DataRoot` to the absolute path of the active input folder, for example `C:\PBI\VNFinance\data\current`.
3. In **Transform data > Edit parameters**, confirm the value, then select **Refresh Preview** and **Close & Apply**.
4. If Desktop asks for credentials, choose the local-file permission level appropriate for the folder. Do not hard-code a personal Downloads path into a query.
5. Save a working `.pbix` only after the first successful refresh. The `.pbix` is an execution output; the PBIP/PBIT remains the reproducible source.

### Repeatable data replacement

1. Put the replacement CSVs in a candidate folder, preserving the 14 filenames.
2. Run the controlled runner. It validates the candidate and records hashes/row counts; add `--apply` only when the candidate should replace the active `DataRoot`:

```powershell
python scripts/prepare_powerbi_refresh.py `
  --input-dir C:\PBI\incoming\2025Q4 `
  --data-root C:\PBI\VNFinance\data\current `
  --report C:\PBI\evidence\refresh_swap_2025Q4.json `
  --apply
```

If validation fails, no target file is copied. The runner invokes `validate_powerbi_input_contract.py`, which checks headers, required/nullable cells, numeric/date/boolean types, primary-key uniqueness, foreign-key coverage, gross-to-net identity and contribution identity.
3. In the open report select **Home > Refresh**. No page, visual or measure rebuild is required.
4. Check the refresh timestamp and row/control counts on **Controls and Evidence**.
5. Save the `.pbix` if you need a point-in-time handoff. For a controlled change test, retain the runner manifest plus expected delta in the release evidence file.

The deterministic package QA already proves the contract with a `+VND 1,000,000` data swap. Native Desktop QA must still confirm that the canvas actually changes after refresh.

### Published Import refresh (no Desktop interaction)

When the report is published as an **Import** semantic model, the data-swap
runner can be followed by `scripts/trigger_powerbi_service_refresh.py`. Run it
without `--apply` first to inspect the endpoint and polling plan. For a real
workspace, put a short-lived token with the required dataset write permission
in the process environment and run:

```powershell
$env:PBI_ACCESS_TOKEN = '<token supplied by the operator>'
python scripts/trigger_powerbi_service_refresh.py `
  --workspace-id <workspace-guid> `
  --dataset-id <dataset-guid> `
  --apply `
  --report C:\PBI\evidence\service_refresh.json
```

The helper POSTs an on-demand refresh, polls refresh history and returns
`APPLY_PASS` only after a terminal `Completed` result. It never stores the
token, workspace ID or dataset ID in Git. This automates Import refresh after a
data replacement; it is not DirectQuery Automatic Page Refresh or second-level
realtime.

### GitHub-triggered Service refresh

`.github/workflows/powerbi-service-refresh.yml` is the repeatable automation
hook for a published Import dataset. It runs the input-contract checks whenever
`powerbi/data/current/**` changes on `main`, then calls the same refresh helper
when these repository Secrets are present:

- `PBI_WORKSPACE_ID`
- `PBI_DATASET_ID`
- `PBI_ACCESS_TOKEN`

The workflow writes a refresh-evidence artifact for each run. If any Secret is
missing, it records `SKIPPED` and does not call Power BI. Before enabling it,
make sure the published dataset reads from the cloud copy that is updated by
the data-swap process; the Power BI Service cannot read a developer's local
`DataRoot` folder.

### One-command operator flow

For a controlled handoff, use `scripts/run_finance_refresh.py` to keep the
Import, DirectQuery and Service evidence in one JSON file. A safe dry-run is:

```powershell
python scripts/run_finance_refresh.py `
  --input-dir powerbi/data/current `
  --data-root C:\PBI\data\current `
  --report C:\PBI\evidence\finance_refresh.json
```

Add `--apply` to copy the validated Import files. Add
`--directquery-apply` only when `VNFINANCE_SQL_CONNECTION` points to the
approved SQL source. Add `--service-apply --workspace-id <guid>
--dataset-id <guid>` only for a published dataset and provide
`PBI_ACCESS_TOKEN` in the process environment. The command fails closed when a
requested credential or connection is missing.

For recurring CSV drops, `scripts/watch_powerbi_refresh.py` hashes the compact
14-file or extended 19-file contract (`--scope auto` detects the extended files),
waits for a stable copy and delegates to the same orchestrator. It is dry-run by default; use `--apply` to copy the validated files and add
`--service-apply` only when the published dataset and runtime secrets are
configured. A watcher can automate the trigger, but it does not turn Import
mode into second-level realtime: the Desktop/API refresh and the DirectQuery /
Automatic Page Refresh production gates still apply.

```powershell
python scripts/watch_powerbi_refresh.py `
  --scope extended `
  --input-dir C:\PBI\incoming `
  --data-root C:\PBI\data\current `
  --report C:\PBI\evidence\watch_refresh.json `
  --interval-seconds 30 `
  --settle-seconds 3 `
  --apply
```

## 4. Model inventory and expected topology

The compact baseline contains **15 tables, 37 measures, 23 relationships, 6 pages and 39 visual containers**. The extended finance-analyst package contains **20 tables, 60 measures, 25 relationships, 6 pages and 42 visual containers**.

Tables are `Calendar`, `Product`, `Customer`, `Channel`, `Sales`, `Commercial_Costs`, `Inventory`, `Receivables`, `Payables`, `Debt`, `Budget`, `Forecast`, `Marketing`, `Promotions` and `Source_Control`.

Use a star-like filter direction:

- `Calendar[month]` → monthly facts (`Sales`, `Commercial_Costs`, `Inventory`, `Receivables`, `Payables`, `Debt`, `Budget`, `Forecast`, `Marketing`)
- `Product[sku_id]` → `Sales`, `Commercial_Costs`, `Inventory`, `Budget`, `Forecast`, `Promotions`
- `Customer[customer_id]` → `Sales`, `Receivables`
- `Channel[channel_id]` → `Sales`, `Commercial_Costs`, `Budget`, `Forecast`, `Marketing`, `Promotions`
- `Scenario Selector` remains disconnected for scenario measures. Its `base_case`,
  `revenue_multiplier`, `cogs_multiplier`, and `opex_multiplier` columns are
  finance-owned inputs: edit the CSV, refresh, and the scenario revenue and
  EBITDA proxy and CCC recalculate without rebuilding the report.

The extended layer adds `Peer_Benchmark`, `Peer_Review_Queue`, `OPEX_Headcount`
and `CAPEX_Projects` as evidence/planning facts. Their model-native measures
include scenario revenue/EBITDA proxy, OPEX actual-vs-budget, headcount,
CAPEX committed/cash/payback, peer PAT margin/CFO conversion and review queue
counts. This layer is designed to be edited in the extended PBIP/PBIT; it is
not a claim that synthetic planning rows are company actuals.

Do not create fact-to-fact joins. Do not “fix” duplicate keys by deleting rows; fail the input contract and repair the source.

## 5. Open/bind sequence (two valid paths)

### Path A — PBIP editing

1. Open `VNFinance_Commercial_Finance.pbip`.
2. Confirm the Report points to `VNFinance_Commercial_Finance.SemanticModel`.
3. Confirm `DataRoot` in the semantic model expressions and set it through Desktop if the path differs on the host.
4. Refresh, then edit pages/measures as required.
5. Save the text project. Commit only intentional text changes; ignore `.pbi/cache.abf` and `.pbi/localSettings.json`.

### Path B — PBIT instantiation

1. Open `Commercial_Finance_Profitability_Analytics.pbit`.
2. Set `DataRoot` when prompted.
3. Refresh and validate the six pages.
4. **File > Save As** a new `.pbix` with a dated name.
5. Keep the PBIT checksum and the input contract result next to the PBIX evidence.

## 6. Page-by-page finance review

| Page | Review action | Minimum result |
|---|---|---|
| Executive Output | Change Base/Upside/Downside and inspect cards/action table. | Revenue, contribution, revenue-vs-budget and CCC respond to the scenario. |
| P&L and Variance | Compare actual, budget and forecast by month; inspect variance table. | Variances reconcile to the source rows and use consistent VND units. |
| PVM Bridge | Select a period/SKU and inspect price, volume and mix impacts. | Residual is within the stated VND 100m tolerance. |
| Channel and Customer Profitability | Filter channel/segment/customer and inspect hurdle flag. | Below-hurdle growth is visible rather than hidden by a filter. |
| Working Capital and Liquidity | Trend DSO, DIO, DPO, CCC, AR/AP and debt. | Monthly 365/12 convention and cash-release action are visible. |
| Controls and Evidence | Inspect source rows, status, evidence class and refresh timestamp. | Synthetic vs reported data and unresolved gates are explicit. |

Every page should retain a unit/evidence subtitle: operating data are synthetic; peer facts are reported and source-linked.

## 7. Native QA and evidence

Execute `QA-01` through `QA-18` in order. Record observed value, expected value, reviewer, Desktop version, timestamp, screenshot filename and remediation for every exception. Release rule:

- `QA-01`–`QA-17`: PASS;
- `QA-18`: five-minute recruiter walkthrough demonstrated;
- no failed row may be hidden by a visual filter;
- the VND 100m PVM tolerance is disclosed;
- peer visuals exclude review-required rows;
- VNM FY2006 is labelled as a VAS 25 restated comparative and FY2007 PAT > PBT has its reconciliation note.

Recommended evidence names:

```text
VNFinance_Commercial_Finance_v2.pbix
VNFinance_PBIX_RELEASE_EVIDENCE_YYYY-MM-DD.md
VNFinance_PBIX_QA_SCREENSHOTS_YYYY-MM-DD.pdf
VNFinance_PBIX_VISUAL_TIEOUT_YYYY-MM-DD.md
```

## 8. Realtime boundary and DirectQuery route

CSV Import is refreshable, not second-level realtime. Replacing files does not push values into an already-open canvas until a refresh runs. Power BI Automatic Page Refresh applies to supported DirectQuery/LiveConnect models.

For the realtime variant:

1. Provision Azure SQL, SQL Server or Microsoft Fabric with `powerbi/directquery/VNFinance_DirectQuery_Schema.sql`.
2. Run the loader in dry-run mode, review its per-file row counts and SHA-256 evidence, then run `python scripts/load_directquery_sqlserver.py --apply --connection-string ...` on a controlled SQL Server-compatible host. For Azure SQL/Fabric, use an approved managed pipeline with the same contract.
3. Run `scripts/validate_directquery_mapping.py` and `scripts/validate_directquery_health_contract.py`, then run `powerbi/directquery/VNFinance_DirectQuery_Health.sql`; retain the `Refresh_Control` batch, watermark, latency, `control_status` and `control_reason` output.
   On a Windows rehearsal host, `python scripts/run_directquery_localdb_smoke.py --report <evidence.json>` proves the two-batch source update and cleans up its ephemeral LocalDB instance automatically.
4. Replace each CSV partition with a DirectQuery table in Desktop; keep the same measures and relationships.
5. Validate query latency, source freshness, gateway/network and capacity limits.
6. Enable **Automatic Page Refresh** only after those checks and document the interval and source timestamp.
7. Mark the realtime claim `PASS` only with a live database, a successful Desktop/Service refresh test and evidence screenshots. Until then keep `PENDING_DATABASE_AND_DESKTOP_EVIDENCE`.

The migration schema and machine-readable gates are intentionally included now so the project can move to realtime without redesigning the finance model.

## 9. Archive and recruiter handoff

Upload the PBIP source, PBIT, any verified PBIX and evidence pack to the private Drive project folder. Push text/source metadata and safe synthetic extracts to GitHub; never publish private raw company reports. Update the release record with Git commit, PBIT SHA256, Drive file ID, Desktop version, refresh timestamp and QA status.

The five-minute walkthrough is: **Executive Output → scenario change → largest variance → PVM driver → channel/customer economics → working-capital action → Controls and Evidence**.
