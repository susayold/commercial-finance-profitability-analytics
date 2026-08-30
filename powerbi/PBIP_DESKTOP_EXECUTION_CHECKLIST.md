# PBIP Desktop Execution Checklist — VNFinance Commercial Finance v2

Status: READY FOR EXTERNAL POWER BI DESKTOP EXECUTION  
Owner: portfolio author  
Source of truth: PBIP_SOURCE_MANIFEST.json

This checklist closes the preparation work for the native Power BI gate. It does not claim that a native PBIX exists. Power BI Desktop must still create/save the binary and execute the visual tests.

## 0. Prerequisites and evidence policy

- Use a current Power BI Desktop build that supports Power BI Projects (PBIP). PBIP is still a preview feature in Microsoft's documentation.
- Keep the project root short (for example, C:\PBI\VNFinance_v2) to avoid Windows path-length failures.
- Enable Power BI Project (.pbip) save option under File > Options and settings > Options > Preview features.
- Optional: enable Store reports using enhanced metadata format (PBIR) if you want source-controlled report definition folders. Do not enable TMDL unless you are intentionally converting the semantic model format.
- Do not store cache.abf or localSettings.json in Git/Drive as evidence; they are machine-local state.
- Use the evidence labels already defined in docs/CLAIM_GOVERNANCE.md: OBSERVED, DERIVED, SIMULATED and ASSUMPTION.

Official references:  
[PBIP overview](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview) · [Report folder / PBIR](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-report) · [Semantic model folder](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-dataset)

## 1. Assemble the source package

Open these remote artifacts before starting:

1. PBIP_SOURCE_MANIFEST.json
2. model_contract.json
3. measures.dax
4. QA_TEST_MATRIX.md
5. POWER_BI_BUILD_GUIDE_V2.md
6. POWER_BI_DESKTOP_RUNBOOK.md
7. PBIX_RELEASE_EVIDENCE_TEMPLATE.md

Authoritative data inputs:

- VietNova FPA Model v2: https://docs.google.com/spreadsheets/d/1-DAMs7zqQr8a6Otimm3WgkAIsX3kazpm/edit
- Approved peer panel: data/peer_benchmark_approved_2016_2025.csv
- Controls-only queue: data/peer_extraction_queue.csv
- Public-guidance proxy (separate demo only): data/vnm_public_guidance_proxy_2018_2025.csv

## 2. Create and save the project

1. In Power BI Desktop, select File > Open or start a blank report.
2. Load the v2 workbook. Preserve the workbook's tab names and row grain; do not flatten all facts into one table.
3. Load the approved peer CSV as a separate fact table.
4. Load the review queue only as a controls table. Do not allow it into benchmark visuals.
5. Save As > Power BI Project and name the project VNFinance_Commercial_Finance_v2.
6. Confirm the expected topology:

   - VNFinance_Commercial_Finance_v2.pbip
   - VNFinance_Commercial_Finance_v2.Report/definition.pbir
   - VNFinance_Commercial_Finance_v2.SemanticModel/definition.pbism
   - report definition folder or report.json
   - semantic model definition folder or model.bim

7. Reopen the saved .pbip once before adding visuals. This catches path and source-connection problems early.

## 3. Model the semantic layer

Required dimensions: Calendar, Product_Master, Customer_Master, Channel_Master and Scenario Selector.

Required facts: Sales_Fact, Commercial_Costs, Inventory, AR, AP, Budget, Forecast_Versions, OPEX_Headcount, CAPEX_Projects, Peer_Benchmark and Peer_Review_Queue.

Required relationships: 15. Validate one-to-many direction and confirm the Scenario Selector remains disconnected.

Data-type controls:

- DateKey and FiscalYear are numeric/date-compatible.
- Revenue, cost and profit fields are numeric.
- Ticker and evidence-status fields remain text.
- Reported peer values are VND bn; synthetic operating values are labelled synthetic VND.
- Do not silently convert blanks to zero where a blank means “not validated”.

Paste measures from measures.dax, then confirm that the measure names used by the report pages exist.

## 4. Build the six report pages

| Page | Decision question | Minimum evidence |
|---|---|---|
| Executive Output | What decision should the CFO make this month? | Revenue, contribution, CCC, scenario selector, owner/action |
| P&L and Variance | Why did actuals miss or beat plan? | Actual vs budget/forecast and waterfall |
| PVM Bridge | Was growth price, volume, mix or spend? | Reconciled PVM bridge and residual |
| Channel and Customer Profitability | Which growth pays back after cost-to-serve? | Channel/customer matrix, hurdle flag, drill path |
| Working Capital and Liquidity | Where is cash trapped? | DSO, DIO, DPO, CCC, minimum cash/revolver |
| Controls and Evidence | Can a reviewer trust the number? | Tie-outs, refresh metadata, evidence status, queue count |

Every page must contain a subtitle or tooltip that states the relevant unit and evidence class.

## 5. Execute QA-01 through QA-18

Run the full QA matrix in order. Record observed value, expected value, reviewer initials, timestamp and retest status in PBIX_RELEASE_EVIDENCE_TEMPLATE.md.

The release rule is:

- QA-01 through QA-17: PASS
- QA-18: reviewer walkthrough demonstrated within five minutes
- Any failed test remains visible with owner, remediation and retest date
- The VND 100m tolerance is disclosed, not silently rounded away

## 6. Capture and archive evidence

Use this naming convention:

- VNFinance_Commercial_Finance_v2.pbix
- VNFinance_PBIX_RELEASE_EVIDENCE_YYYY-MM-DD.md
- VNFinance_PBIX_QA_SCREENSHOTS_YYYY-MM-DD.pdf
- VNFinance_PBIX_VISUAL_TIEOUT_YYYY-MM-DD.md

The visual tie-out should include:

- Executive Output vs Excel CFO_Output
- P&L totals vs Excel P&L
- OPEX actual/budget/forecast and headcount bridge vs opex_headcount_planning_synthetic.csv
- CAPEX actual/commitment/depreciation/payback and cash timing vs capex_fixed_asset_planning_synthetic.csv
- Channel total vs Excel channel profitability
- CCC vs Excel working-capital tab
- Peer trend vs approved peer CSV
- Controls page showing queue/evidence status

Upload the PBIX and visual evidence to the private Drive project folder. Commit only text/source metadata to GitHub; do not commit machine-local cache files.

## 7. Final release decision

Mark Gate B PASS only when:

1. The native PBIX opens after closing and reopening.
2. QA-01 through QA-17 are passing.
3. QA-18 walkthrough is demonstrated.
4. Visual tie-outs are archived.
5. The binary and evidence pack are uploaded to Drive.
6. The release record identifies the exact Power BI Desktop version and execution date.

Until these conditions are met, keep the repository status as PBIP_SOURCE_SCAFFOLD_NOT_NATIVE_PBIX.

## 8. Important boundary

The VNM public-guidance analysis is useful for forecast-versus-actual communication, but it is not an internal pre-close snapshot. It must remain separate from Forecast_Snapshot_Input and cannot close Gate A.

## 9. Automated preflight before opening Desktop

Run scripts/validate_powerbi_source_coherence.mjs against the manifest, model contract, DAX pack, QA matrix and evidence template. The preflight must return 13/13 PASS before Desktop execution. See reports/POWER_BI_SOURCE_COHERENCE_QA.md. This verifies source alignment only; it does not create a native PBIX.
