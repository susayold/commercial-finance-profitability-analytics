# Power BI Desktop Runbook — VNFinance Commercial Finance v2

## Purpose

This runbook converts the remote model contract into a native PBIX/PBIP deliverable. The Excel v2 workbook remains the finance calculation and audit source; Power BI is the management consumption layer.

## Remote inputs

1. Download the v2 workbook from https://docs.google.com/spreadsheets/d/1-DAMs7zqQr8a6Otimm3WgkAIsX3kazpm/edit.
2. Download the approved peer CSV from https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/data/peer_benchmark_approved_2016_2025.csv.
3. Keep raw official reports in the private Drive archive; do not copy them into the public repository.
4. Open the model contract, measures and QA matrix:
   - powerbi/model_contract.json
   - powerbi/measures.dax
   - powerbi/QA_TEST_MATRIX.md
   - powerbi/qa_validation_queries.dax

## Desktop setup

1. Install the current Power BI Desktop release.
2. Enable Power BI Project (.pbip) preview. Optionally enable enhanced report format (PBIR) and TMDL if source-controlled authoring is required.
3. Create a short local working path such as C:\VNFinancePBIP to avoid Windows path-length issues.
4. Save the project as VNFinance_Commercial_Finance.pbip. The local copy is disposable; remote GitHub and Drive copies are authoritative after upload.

## Import sequence

1. Get Data → Excel → select the downloaded v2 workbook.
2. Load the contract tables: Calendar, Product_Master, Customer_Master, Channel_Master, Sales_Fact, Commercial_Costs, Inventory, AR, AP, Budget, Forecast_Versions, Peer_Benchmark and Peer_Review_Queue.
3. Import the approved peer CSV as Peer_Benchmark_Approved if the workbook table is not available. Keep the original Source_Status, Source_Layer, Revenue_Basis, Page_Anchor, Comparability_Note and Source_URL columns.
4. Set data types before creating measures:
   - DateKey = Date
   - FiscalYear = Whole number
   - IDs = Text
   - VND amounts = Decimal number
   - Units = Whole number
   - Rates and margins = Decimal number
5. Disable automatic date/time if it creates hidden date tables that conflict with Calendar.

## Relationship rules

Create one-to-many, single-direction relationships from dimensions to facts:

- Calendar[DateKey] → every monthly fact DateKey
- Product_Master[ProductID] → Sales_Fact and Inventory
- Customer_Master[CustomerID] → Sales_Fact and AR
- Channel_Master[ChannelID] → Sales_Fact, Commercial_Costs, Budget and Forecast_Versions

Do not create fact-to-fact relationships. Keep Scenario Selector disconnected. Mark Calendar as the date table only after DateKey is unique and contiguous.

## Measures and formatting

1. Paste powerbi/measures.dax into the model, then resolve table names if the imported workbook adds a prefix.
2. Format VND measures as VND bn or VND mm consistently; never mix units on a visual.
3. Format margin, growth, variance and coverage measures as percentages.
4. Add a visible subtitle: “VietNova operating facts are synthetic; peer facts are reported and source-linked.”
5. Add a refresh timestamp and model version to the Controls & Evidence page.

## Page build order

### 1. Executive Output

Cards: Net Revenue, Gross Profit, Contribution Margin %, Operating Profit proxy, CCC. Add Base/Upside/Downside slicer, risk flag and an action table with owner, financial mechanism and monitoring KPI.

### 2. P&L / Variance

Use a line or clustered column chart for Actual vs Budget vs Forecast. Add a waterfall for Revenue Variance and a table of the top drivers. Keep favorable/unfavorable labels separate from source signs.

### 3. PVM Bridge

Use the reconciled PVM_Bridge output. Show Price, Volume, Mix, Discount, Returns, Unit COGS and residual. Display the comparison period and the VND 100m deterministic rounding tolerance.

### 4. Channel & Customer Profitability

Show channel contribution margin, a 25% hurdle reference, customer drill-through and SKU detail. Flag below-hurdle growth with Below Hurdle Flag.

### 5. Working Capital & Liquidity

Show DSO, DIO, DPO, CCC, AR ageing, inventory cover, debt/liquidity stress and cash-release actions. State the monthly 365/12 convention.

### 6. Controls & Evidence

Show row counts, tie-outs, negative-sales count, evidence coverage, source URL/page anchor, peer queue status, synthetic-vs-reported legend, refresh timestamp and failed-control owner.

## QA execution

1. Run QA-01 through QA-18 in powerbi/QA_TEST_MATRIX.md.
2. Run powerbi/qa_validation_queries.dax as a DAX query or reproduce its measures on the Controls page.
3. Record observed values, reviewer initials, timestamp and remediation for any failure.
4. Do not filter away failed rows. A release is PASS only when QA-01–QA-17 pass and QA-18 is demonstrated.
5. Confirm peer trends exclude review-required rows and that the current queue baseline is 25/25 reported_statement_verified.
6. Confirm VNM FY2006 is labelled a VAS 25 restated comparative and FY2007 PAT > PBT is supported by the reconciliation note.

## Save and remote archive

1. Save the native PBIX.
2. Save as PBIP/PBIR if source-controlled project files are desired.
3. Upload the PBIX binary and, if used, the PBIP folder to the project Drive folder: https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR.
4. Commit only text metadata, model definitions and safe synthetic extracts to GitHub. Keep raw private reports out of Git history.
5. Update docs/FINAL_QA_AND_HANDOFF_2026-08-30.md with the PBIX file link, Desktop version, refresh timestamp and QA results.
6. Delete the local working copy after confirming both remote uploads.

## Recruiter walkthrough

Start on Executive Output. State the decision, change the scenario, trace the largest variance to PVM, drill into channel/customer economics, show the working-capital action and finish on Controls & Evidence. Target duration: five minutes.
