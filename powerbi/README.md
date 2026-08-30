# Power BI semantic model

## Refreshable release

The repository now includes generated native source under `powerbi/native/` and the compiled editable template under `powerbi/releases/Commercial_Finance_Profitability_Analytics.pbit`.

- Open `powerbi/native/VNFinance_PBIP/VNFinance_Commercial_Finance.pbip` in Power BI Desktop to edit the project.
- Set the `DataRoot` parameter to the folder containing the 14 contract CSV files.
- A QA-approved baseline fixture is committed at `powerbi/data/current/` (14 CSV inputs plus `manifest.json`); the same fixture is included in the Drive release bundle.
- Replace CSV data without changing filenames or headers, then select **Refresh**; measures and visuals recalculate without rebuilding the report.
- See `docs/POWER_BI_REFRESH_ARCHITECTURE.md` for the exact refresh contract and the DirectQuery path for true real-time behavior.
- See `powerbi/directquery/README.md` and `powerbi/directquery/VNFinance_DirectQuery_Schema.sql` for the database migration package; `powerbi/DIRECTQUERY_READINESS.json` keeps the realtime claim gated until measured evidence exists.
- Rebuild both source formats with `scripts/build_powerbi_refreshable_project.py` and validate the package with `scripts/validate_powerbi_refreshable_project.py`.
- Validate any replacement dataset first with `scripts/validate_powerbi_input_contract.py`; the CI workflow validates both the committed fixture and the generated package before package QA.
- On a Windows execution host, run `scripts/powerbi_desktop_preflight.ps1 -ProjectRoot . -DataRoot <folder>` to check Desktop installation, package paths and input readiness before opening PBIP/PBIT.
- `scripts/validate_powerbi_artifact_coherence.py` checks the generated PBIP/PBIT topology directly (15 tables, 37 measures, 23 relationships, 6 pages and 39 visuals) against `package_inventory` in `PBIP_SOURCE_MANIFEST.json`.

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
