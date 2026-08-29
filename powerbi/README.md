# Power BI semantic model

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
