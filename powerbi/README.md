# Power BI semantic model

## Refreshable release

The repository now includes generated native source under `powerbi/native/` and the compiled editable template under `powerbi/releases/Commercial_Finance_Profitability_Analytics.pbit`.

- Open `powerbi/native/VNFinance_PBIP/VNFinance_Commercial_Finance.pbip` in Power BI Desktop to edit the project.
- Set the `DataRoot` parameter to the folder containing the 14 contract CSV files.
- A QA-approved baseline fixture is committed at `powerbi/data/current/` (14 CSV inputs plus `manifest.json`); the same fixture is included in the Drive release bundle.
- Replace CSV data without changing filenames or headers, then select **Refresh**; measures and visuals recalculate without rebuilding the report.
- For a published Import dataset, `scripts/trigger_powerbi_service_refresh.py` can trigger and poll an on-demand Service refresh after the data swap. It is dry-run by default; `--apply` requires a caller-supplied `PBI_ACCESS_TOKEN` and never stores a token in Git.
- `.github/workflows/powerbi-service-refresh.yml` provides the automatic hook: a push that changes `powerbi/data/current/**` validates the contract and then triggers the published dataset when the repository has `PBI_WORKSPACE_ID`, `PBI_DATASET_ID` and `PBI_ACCESS_TOKEN` GitHub Secrets. Without those secrets it records `SKIPPED` evidence and makes no network call. The deployed dataset must point to the same cloud-accessible source that receives the data swap; a GitHub CSV change alone cannot update a dataset still bound to a local Desktop path.
- `scripts/run_finance_refresh.py` is the single-command operator flow: it validates and prepares the Import swap, and can additionally apply the DirectQuery load and/or trigger the Service refresh when those explicit flags and runtime credentials are supplied. It writes one combined evidence JSON and never stores tokens or connection strings.
- `scripts/watch_powerbi_refresh.py` is the optional CSV-drop watcher: it hashes all 14 contract files, waits for a stable copy and delegates to the same orchestrator. It is dry-run by default and explicitly documents that a watcher does not make Import mode second-level realtime.
- `scripts/run_powerbi_release_gate.py` runs the deterministic contract, package, coherence and claim-boundary checks in one command; on Windows it adds Desktop preflight and returns `PASS_WITH_EXTERNAL_PENDING` when native Desktop evidence is still open.
- `scripts/validate_native_pbix_release.py` audits a supplied native PBIX container, SHA-256/size, QA-01–QA-18 CSV and observed Desktop metadata; it returns `READY_TO_CLAIM`, `PENDING_EXTERNAL_EVIDENCE` or `FAIL` without mutating the repository manifest.
- `POWER_BI_NATIVE_DESKTOP_HANDOFF_2026-08-31.md` is the final operator sheet for Desktop open/bind/refresh/QA/save, the replace-data-only proof and the separate DirectQuery/APR gate.
- `POWER_BI_DESKTOP_BRIDGE_HANDOFF_2026-08-31.md` documents the official preview Bridge CLI route for Desktop status, PBIP reload and page screenshots; it keeps native Save As/refresh claims separate.
- `reports/POWER_BI_CURRENT_RELEASE_STATUS_2026-08-31.md` is the current release record with evidence links and explicit native-PBIX/realtime claim boundaries.
- `reports/POWER_BI_WATCHER_TWO_BATCH_QA_2026-08-31.md` records a two-batch watcher test where the contract hash changed and the target DataRoot updated from 121 to 122 units.
- See `docs/POWER_BI_REFRESH_ARCHITECTURE.md` for the exact refresh contract and the DirectQuery path for true real-time behavior.
- See `powerbi/directquery/README.md`, `powerbi/directquery/VNFinance_DirectQuery_Schema.sql`, `powerbi/directquery/VNFinance_DirectQuery_Health.sql`, `scripts/load_directquery_sqlserver.py` and `scripts/check_directquery_source.ps1` for the database migration package; `powerbi/DIRECTQUERY_READINESS.json` keeps the realtime claim gated until measured evidence exists.
- Rebuild both source formats with `scripts/build_powerbi_refreshable_project.py` and validate the package with `scripts/validate_powerbi_refreshable_project.py`.
- Validate any replacement dataset first with `scripts/validate_powerbi_input_contract.py`; the CI workflow validates both the committed fixture and the generated package before package QA.
- On a Windows execution host, run `scripts/powerbi_desktop_preflight.ps1 -ProjectRoot . -DataRoot <folder>` to check Desktop installation, package paths and input readiness before opening PBIP/PBIT.
- Add `-Report reports/POWER_BI_DESKTOP_PREFLIGHT_YYYY-MM-DD.json` to retain the exact host/data gate output; `PENDING` means Desktop is absent or a required input is missing, not that native PBIX QA passed.
- `scripts/validate_powerbi_artifact_coherence.py` checks the generated PBIP/PBIT topology directly (15 tables, 37 measures, 23 relationships, 6 pages and 39 visuals) against `package_inventory` in `PBIP_SOURCE_MANIFEST.json`.
- `scripts/validate_powerbi_docs_contract.py` checks that the runbook, Power Query references and committed fixture all use the same 14 canonical CSV filenames.

Automated package QA currently passes 29/29 checks. Native Desktop open/refresh/render QA remains a separate gate and is not inferred from source validation.

The committed fixture is synthetic and reproducible. Regenerate it with
`python scripts/generate_vietnova_data.py --output-dir powerbi/data/current`,
then rerun the input and package validators before replacing the Drive bundle.

This folder is the implementation layer for the Power BI report described in `docs/POWER_BI_BUILD_SPEC.md`.

- `model_contract.json` defines table grain, dimensions, relationships, page questions and acceptance tests.
- `measures.dax` defines the reusable finance measure contract.
- Excel v2 is the calculation/audit source; Power BI is the presentation and drill-through layer.
- The peer panel is loaded only from approved rows in `data/peer_financial_panel_2021_2025.csv` and the remote review sheet.

Build order:

1. Import the v2 workbook tables.
2. Create dimensions and single-direction relationships from the contract.
3. Add measures in `measures.dax`.
4. Create the six pages in contract order.
5. Apply the acceptance tests before publishing.
