# PBIP / PBIT Desktop Execution Checklist — VNFinance Commercial Finance

**Status:** READY FOR EXTERNAL POWER BI DESKTOP EXECUTION; native PBIX and realtime evidence remain pending.
**Source of truth:** `powerbi/PBIP_SOURCE_MANIFEST.json` plus the package QA reports.

Use this checklist on the execution host. Check a box only when the evidence exists; source/package checks do not substitute for native Desktop evidence.

## A. Host and release preflight

- [ ] Current Power BI Desktop is installed and opens.
- [ ] Exact Desktop version copied from **File > About Power BI**.
- [ ] PBIP preview enabled; PBIR/TMDL enabled only when supported by the build.
- [ ] Working path is short and disposable (`C:\PBI\...`).
- [ ] Latest GitHub commit and Drive bundle identified.
- [ ] PBIT SHA256 recorded.
- [ ] `validate_powerbi_input_contract.py` returns `PASS` for the active data folder.
- [ ] `validate_powerbi_refreshable_project.py` returns `PASS`.

## B. Open and bind

- [ ] PBIP entry point opens: `powerbi/native/VNFinance_PBIP/VNFinance_Commercial_Finance.pbip`.
- [ ] PBIT alternative opens: `powerbi/releases/Commercial_Finance_Profitability_Analytics.pbit`.
- [ ] `DataRoot` points to the intended folder, not Downloads or a stale clone.
- [ ] All 14 CSV files are present with the expected filenames.
- [ ] Refresh Preview / Close & Apply completes without credential or privacy errors.
- [ ] A dated working `.pbix` is saved only after the first successful refresh.

## C. Semantic model checks

- [ ] 15 tables are visible: `Calendar`, `Product`, `Customer`, `Channel`, `Sales`, `Commercial_Costs`, `Inventory`, `Receivables`, `Payables`, `Debt`, `Budget`, `Forecast`, `Marketing`, `Promotions`, `Source_Control`.
- [ ] 37 measures are present and no measure shows an error.
- [ ] 23 relationships exist and have the intended single-direction dimension-to-fact flow.
- [ ] No fact-to-fact relationship was introduced.
- [ ] Calendar month is unique/contiguous and used for time slicing.
- [ ] Scenario selector is disconnected.
- [ ] Numeric, date and boolean types remain unchanged.
- [ ] Blank `promo_id` remains nullable; other required identifiers are not silently blank.

## D. Page and visual checks

- [ ] Six pages exist with the expected names.
- [ ] 39 visual containers load without “visual has errors”.
- [ ] Executive Output: cards, scenario selector and action table respond.
- [ ] P&L and Variance: actual/budget/forecast and variance table reconcile.
- [ ] PVM Bridge: price/volume/mix and residual are visible; tolerance is disclosed.
- [ ] Channel and Customer Profitability: hurdle flag and drill path work.
- [ ] Working Capital and Liquidity: DSO/DIO/DPO/CCC, AR/AP and debt load.
- [ ] Controls and Evidence: row counts, source status, evidence class and refresh timestamp load.
- [ ] Every page states units and synthetic/reported evidence class.

## E. Controlled data-swap test

- [ ] Copy the current input folder to a dated test folder.
- [ ] Change exactly one valid numeric cell (recommended: first `Sales[net_sales]` and `Sales[contribution_margin]` by +VND 1,000,000).
- [ ] Run the input-contract validator on the changed folder.
- [ ] Point `DataRoot` to the changed folder and select **Refresh**.
- [ ] Capture before/after card values and the refresh timestamp.
- [ ] Confirm the expected VND 1,000,000 delta flows through the relevant visual/measure.
- [ ] Restore the baseline `DataRoot` or close without saving the test PBIX.

## F. QA-01–QA-18 release gate

- [ ] QA-01 through QA-04: model/row-count and source-contract checks.
- [ ] QA-05 through QA-08: P&L, budget/forecast and tie-out checks.
- [ ] QA-09 through QA-12: PVM, channel/customer profitability and hurdle checks.
- [ ] QA-13 through QA-16: working capital, liquidity, peer evidence and controls checks.
- [ ] QA-17: no material unresolved control failure; owner/remediation documented for exceptions.
- [ ] QA-18: five-minute recruiter walkthrough completed.
- [ ] VND 100m PVM tolerance shown on the page and in evidence.
- [ ] Review-required peer rows excluded from benchmark visuals.
- [ ] VNM FY2006 / FY2007 evidence notes visible where applicable.

## G. Realtime / DirectQuery gate (separate from Import PASS)

- [ ] Azure SQL, SQL Server or Fabric database is provisioned.
- [ ] `powerbi/directquery/VNFinance_DirectQuery_Schema.sql` applied successfully.
- [ ] All 15 logical tables are loaded with source freshness columns.
- [ ] Desktop partitions are DirectQuery, not CSV Import.
- [ ] Query latency, gateway/network and capacity checks pass.
- [ ] Automatic Page Refresh interval is configured and documented.
- [ ] Two refresh cycles show new source rows without manual file replacement.
- [ ] Realtime screenshots and source timestamp are archived.
- [ ] Only then change `realtime_claim` from `PENDING_DATABASE_AND_DESKTOP_EVIDENCE` to PASS.

## H. Archive / handoff

- [ ] Native PBIX opens after close and reopen.
- [ ] PBIP/PBIT source and PBIX evidence uploaded to Drive.
- [ ] GitHub contains only safe text/source metadata and synthetic extracts.
- [ ] Release evidence includes commit, PBIT SHA256, Drive file ID, Desktop version, date, QA results and screenshots.
- [ ] `.pbi/cache.abf` and `.pbi/localSettings.json` are absent from Git/Drive.
- [ ] Disposable Desktop working folder deleted after remote copies are verified.
- [ ] Repository status and manifest reflect the correct gate state.

## Evidence record template

| Field | Value |
|---|---|
| Desktop version | `TBD` |
| Git commit | `TBD` |
| PBIT SHA256 | `TBD` |
| DataRoot | `TBD` |
| Input-contract result | `PASS/FAIL` |
| Native refresh result | `PASS/FAIL/PENDING` |
| QA-01–QA-17 | `PASS/FAIL/PENDING` |
| QA-18 walkthrough | `PASS/PENDING` |
| DirectQuery/realtime | `PASS/PENDING` |
| Drive evidence link | `TBD` |
| Reviewer / timestamp | `TBD` |
