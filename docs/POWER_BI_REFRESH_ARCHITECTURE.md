# Power BI Refresh Architecture

## Release outcome

This release contains a real, editable Power BI source project (`.pbip`) and a compiled Power BI Template (`.pbit`). The model has 15 tables, 37 finance measures, 23 relationships, six pages and 39 visual containers.

The default mode is **replace-and-refresh**:

1. Keep the 14 CSV filenames and column headers unchanged.
2. Replace the files inside the active `data/current` folder.
3. In Power BI Desktop, set the `DataRoot` parameter to that folder once.
4. Select **Home > Refresh** after each data replacement.
5. Measures and visuals recalculate from the refreshed semantic model; no report rebuild is required.

Before step 4, run `scripts/validate_powerbi_input_contract.py --input-dir <folder>`. It rejects header/type drift, blank cells, duplicate dimension keys, broken fact-to-dimension references and broken gross-to-net/contribution identities.

## Source contract

All Power Query partitions use one required Text parameter:

```text
DataRoot = C:\VNFinancePowerBI\data\current
```

Each query resolves a file as `File.Contents(DataRoot & "\\<filename>.csv")`. This separates the model from any one user's Downloads folder. The source package includes `source_control.csv` so the Controls & Evidence page exposes refresh mode, evidence class and unresolved gates.

Required CSV files:

- `sales_fact.csv`
- `commercial_costs.csv`
- `inventory.csv`
- `receivables.csv`
- `payables.csv`
- `debt.csv`
- `budget.csv`
- `forecast.csv`
- `marketing.csv`
- `promotions.csv`
- `product_master.csv`
- `customer_master.csv`
- `channel_master.csv`
- `source_control.csv`

The Calendar table is generated in Power Query from the minimum and maximum month in `sales_fact.csv`.

## What “automatic update” means

The current CSV design uses Power BI **Import mode**. Replacing source rows does not continuously push them onto an already-open canvas. The report changes when a refresh is executed in Desktop or by a configured refresh schedule in Power BI Service.

This package therefore claims:

- editable source: yes;
- reusable model: yes;
- change only data, keep report design: yes;
- deterministic replace-and-refresh: yes;
- streaming/second-level real-time: no.

## Upgrade path to true real-time

For automatic page refresh, migrate the fact tables to a supported DirectQuery source such as Azure SQL or Microsoft Fabric. Preserve table and column names, then replace each CSV Power Query partition with its DirectQuery table. Configure incremental refresh where appropriate and enable Automatic Page Refresh only after measuring source capacity and query latency.

The concrete migration pack is in `powerbi/directquery/`: it includes an Azure SQL/Fabric-compatible schema, query-path indexes, freshness controls and machine-readable external gates in `powerbi/DIRECTQUERY_READINESS.json`.

Do not label a CSV Import report “real-time.” Power BI automatic page refresh applies to DirectQuery and supported LiveConnect models, not ordinary Import-mode CSVs.

## Open and edit

- Open `VNFinance_Commercial_Finance.pbip` to edit the source-controlled project.
- Open `Commercial_Finance_Profitability_Analytics.pbit` to instantiate a new editable report and set `DataRoot` when prompted.
- Save from Power BI Desktop as `.pbix` only after a successful refresh and visual QA.

## Release gates

Automated package QA validates structure, JSON/TMDL parsing, counts, source references and a controlled VND 1,000,000 data-swap test. Power BI Desktop must still pass the native open, credential, refresh, DAX execution and visual-rendering checks before a `.pbix` is claimed.

