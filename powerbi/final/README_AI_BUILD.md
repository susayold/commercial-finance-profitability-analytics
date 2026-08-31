# VNFinance Commercial Finance Decision Cockpit — final build

This folder is the plan-aligned, editable Power BI source for the Finance Analyst / FP&A portfolio case. It is intentionally built as a CFO operating system: **what happened → why → what now → who owns the action → value → evidence**.

## Deliverables

| Artifact | Purpose |
|---|---|
| `VNFinance_Commercial_Finance_FINAL/` | PBIP text source: report layout, model TMDL, Power Query M, theme references |
| `../native/VNFinance_PbixProj_FINAL/` | Power BI project companion / diagram layout |
| `../releases/VNFinance_Commercial_Finance_FINAL.pbit` | Editable Power BI template built from the final_v1 semantic model |
| `VISUAL_COORDINATES.csv` | Machine-readable geometry for every primary, drillthrough and tooltip visual |
| `../data/final_v1/` | Reconciled star-schema CSV contract and source manifest |
| `../../reports/POWER_BI_FINAL_V1_DATA_QA_2026-08-31.md` | Data QA evidence (23/23 PASS) |

## Build and refresh

```powershell
$py = 'C:\Users\sangk\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
& $py scripts/build_powerbi_final_v1.py --output-dir powerbi/data/final_v1 --qa-report reports/POWER_BI_FINAL_V1_DATA_QA_2026-08-31.md --qa-json reports/POWER_BI_FINAL_V1_DATA_QA_2026-08-31.json
& $py scripts/build_powerbi_final.py
& $py scripts/build_powerbi_extended_pbit.py --base powerbi/releases/Commercial_Finance_Profitability_Analytics_extended.pbit --builder scripts/build_powerbi_final.py --pbixproj powerbi/native/VNFinance_PbixProj_FINAL --output powerbi/releases/VNFinance_Commercial_Finance_FINAL.pbit
```

The report uses the `pDataRoot` / `DataRoot` parameter. Replace CSVs with the same schema, refresh, and all measures/visuals recalculate. The release does not embed a personal OneDrive path; Desktop users should point the parameter to a controlled local copy of `powerbi/data/final_v1` while GitHub/Drive remain the source archive.

## Page inventory

1. `00 Executive Decision Cockpit` — management message, actual/budget/LE, revenue gap, working-capital action queue.
2. `01 P&L & Variance` — management P&L, budget variance waterfall, monthly trend, margin bridge.
3. `02 Revenue, Gross-to-Net & PVM` — gross-to-net leakage, price/volume/mix bridge, ASP and unit trend.
4. `03 Commercial Profitability` — channel portfolio map, customer contribution after WC, strategic actions.
5. `04 Pricing, Promotion & Resource Allocation` — promotion ROI, pricing cases, budget reallocation and guardrails.
6. `05 Forecast & Scenario` — Base/Upside/Downside scenario comparison, driver table, forecast eligibility banner.
7. `06 Working Capital & Liquidity` — DSO/DIO/DPO/CCC, balances, liquidity headroom and cash-release opportunity.
8. `07 OPEX, Headcount & CAPEX` — cost-center variance, headcount bridge, projects and payback.
9. `08 MCH & Peer Financial Quality` — public reported/derived peer view, conversion and evidence caveat.
10. `09 Valuation & Strategic Finance` — EV-only DCF sensitivity and synthetic M&A accretion/dilution rehearsal.
11. `10 Controls, Evidence & Release` — source-control status, evidence classes, version and tie-out cards.

Hidden pages: `D01` customer, `D02` product, `D03` channel and `D04` KPI source trace; tooltips: Financial Metric, PVM, Commercial and Evidence.

## Visual system

The attached reference screenshots were used as a geometry/style specification, not as a static-data source: 1,672 × 941 canvas, navy header and section bars, white card surfaces, teal accent, green positive and red risk states, compact filter strip, evidence footer and consistent Segoe UI typography. Dynamic values are measures/queries, never baked into a background image.

## Evidence boundary and open gates

- VietNova operating facts are synthetic/derived from the deterministic v2 formula universe, not statutory accounts.
- Public-company rows are observed/derived from approved filings and stay in a separate subject area; they cannot aggregate into VietNova totals.
- Valuation is EV-only and assumption-led; it is not a price target. M&A is a synthetic strategic rehearsal.
- Gate A (a genuine internal forecast snapshot), native Power BI Desktop visual QA, and production refresh/APR evidence remain explicitly open. They are not silently represented as passed.
