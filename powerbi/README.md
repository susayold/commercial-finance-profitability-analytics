# Power BI semantic model

## Refreshable release

The repository now includes generated native source under `powerbi/native/` and the compiled editable template under `powerbi/releases/Commercial_Finance_Profitability_Analytics.pbit`.

- Open `powerbi/native/VNFinance_PBIP/VNFinance_Commercial_Finance.pbip` in Power BI Desktop to edit the project.
- Set the `DataRoot` parameter to the folder containing the 14 contract CSV files.
- Replace CSV data without changing filenames or headers, then select **Refresh**; measures and visuals recalculate without rebuilding the report.
- See `docs/POWER_BI_REFRESH_ARCHITECTURE.md` for the exact refresh contract and the DirectQuery path for true real-time behavior.
- Rebuild both source formats with `scripts/build_powerbi_refreshable_project.py` and validate the package with `scripts/validate_powerbi_refreshable_project.py`.

Automated package QA currently passes 29/29 checks. Native Desktop open/refresh/render QA remains a separate gate and is not inferred from source validation.

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
