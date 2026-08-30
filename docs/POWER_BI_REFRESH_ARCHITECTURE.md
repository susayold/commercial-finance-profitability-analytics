# Power BI Refresh Architecture

## Release outcome

This release contains a real, editable Power BI source project (`.pbip`) and a compiled Power BI Template (`.pbit`). The compact baseline has 15 tables, 37 finance measures, 23 relationships, six pages and 39 visual containers. The extended finance-analyst package adds scenario, OPEX/headcount, CAPEX/payback, approved peer and review-control layers for 20 tables, 60 measures, 25 relationships and 42 visuals.

The default mode is **replace-and-refresh**:

1. Keep the 14 CSV filenames and column headers unchanged.
2. Replace the files inside the active `powerbi/data/current` folder.
3. In Power BI Desktop, set the `DataRoot` parameter to that folder once.
4. Select **Home > Refresh** after each data replacement.
5. Measures and visuals recalculate from the refreshed semantic model; no report rebuild is required.

Before step 4, run `scripts/validate_powerbi_input_contract.py --input-dir <folder>`. It rejects header/type drift, blank cells, duplicate dimension keys, broken fact-to-dimension references and broken gross-to-net/contribution identities.

## Source contract

All Power Query partitions use one required Text parameter:

```text
DataRoot = C:\VNFinancePowerBI\powerbi\data\current
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
- `marketing_spend.csv`
- `promotions.csv`
- `product_master.csv`
- `customer_master.csv`
- `channel_master.csv`
- `source_control.csv`

The Calendar table is generated in Power Query from the minimum and maximum month in `sales_fact.csv`.

The extended package keeps the same 14 operating files and adds five inputs:
`scenario_selector.csv`, `peer_benchmark_approved_2016_2025.csv`,
`peer_extraction_queue.csv`, `opex_headcount_planning_synthetic.csv` and
`capex_fixed_asset_planning_synthetic.csv`. Bind the extended PBIP/PBIT to
the same `DataRoot` and preserve all 19 files. Peer numeric blanks mean the
approved public source did not disclose that line item; they are kept as
Power BI blanks rather than imputed as zero.

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

The concrete migration pack is in `powerbi/directquery/`: it includes an Azure SQL/Fabric-compatible schema, query-path indexes, a transactional SQL Server-compatible loader, a freshness/control query and machine-readable external gates in `powerbi/DIRECTQUERY_READINESS.json`. The loader is dry-run by default and records a source hash, row counts, batch status and UTC watermark in `finance.Refresh_Control` when explicitly applied.

`powerbi/directquery/DIRECTQUERY_MIGRATION_CONTRACT.json` is the explicit
20-table mapping for the migration (the compact 15-table baseline plus the
five extended planning/evidence tables). Run
`python scripts/validate_directquery_mapping.py` before changing storage mode;
it checks that the mapping, DDL and PBIP table files agree and that the
60-measure/25-relationship/6-page preservation counts remain locked.

For a published Import dataset, `scripts/trigger_powerbi_service_refresh.py` provides a separate on-demand orchestration path: it can POST a refresh request and poll the dataset's refresh history, using a caller-supplied `PBI_ACCESS_TOKEN`. It is dry-run by default and does not change the realtime boundary; replacing CSVs plus an Import refresh is still not DirectQuery Automatic Page Refresh.

The service helper is intentionally separate from the DirectQuery migration:
the former is useful when a recruiter-facing published report should refresh
after a controlled file replacement, while the latter is required when visuals
must query a live source. The helper requires the operator to supply dataset
write permission at runtime and returns a terminal refresh result; it does not
publish credentials or tenant identifiers.

The DirectQuery pack now includes a two-batch LocalDB harness and evidence
report. It loads the baseline, mutates one source value in a temporary copy,
loads the second batch and checks that the latest `Refresh_Control` row and
source metric change together. This is source-side freshness evidence only;
Desktop visual refresh and production Automatic Page Refresh remain separate
release gates.

Do not label a CSV Import report “real-time.” Power BI automatic page refresh applies to DirectQuery and supported LiveConnect models, not ordinary Import-mode CSVs.

## Open and edit

- Open `VNFinance_Commercial_Finance.pbip` to edit the source-controlled project.
- Open `Commercial_Finance_Profitability_Analytics.pbit` to instantiate a new editable report and set `DataRoot` when prompted.
- Save from Power BI Desktop as `.pbix` only after a successful refresh and visual QA.

## Release gates

Automated package QA validates structure, JSON/TMDL parsing, counts, source references and a controlled VND 1,000,000 data-swap test. Power BI Desktop must still pass the native open, credential, refresh, DAX execution and visual-rendering checks before a `.pbix` is claimed.

