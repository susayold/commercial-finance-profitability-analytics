# VNFINANCE-FPA-v1.1.1 — Final Recruiter Release

Date: 2026-09-08

## Release identity

- Release name: `VNFINANCE-FPA-v1.1.1`
- Release tag: `fpa-portfolio-v1.1.1`
- Tested finance / website source freeze: `3fe18579feb849788527051b2ccdcc303144787b`
- Private recruiter site version: `52` (unchanged)
- GitHub Pages: https://susayold.github.io/commercial-finance-profitability-analytics/
- Metadata anchor: the commit that creates this report; its SHA is recorded canonically in `data/governance/release_identity_nonbi.json`.

## Why v1.1.1 exists

`v1.1.1` is the final recruiter-website consistency release. It does not add a new finance module and does not change the canonical FY2025 Base scenario. It closes the remaining website presentation issues found during a page-by-page audit and makes Page 5 source-driven instead of relying on stale hard-coded inventory rows.

## Final page-by-page closure

1. **Executive** — changes the candidate-facing authority wording from `Approve` to `Recommend`; Historical OOS remains `PASS`, live Gate A remains `OPEN`.
2. **Performance** — keeps simulated actual-ledger comparators visibly separate from the canonical FY2025 Base scenario and from live forecast-accuracy claims.
3. **Commercial** — retains the corrected channel hurdle statement: Modern Trade, Marketplace and D2C are below the 25% contribution-margin hurdle; Wholesale clears it.
4. **Profitability** — strengthens the standalone boundary: the 24-customer synthetic economics rehearsal is not additive to the core company P&L.
5. **Costing & Inventory** — rebuilds the displayed contract from governed costing sources. Dec-2025 inventory now shows the actual non-zero source rows only: `SKU018`, `SKU034`, `SKU035`; all three are source-flagged slow-moving. The stale duplicate `SKU033`, stale inventory table and stale 72.8-day display are removed. The page retains the explicit `NOT_CORE_COGS` scope marker.
6. **Resources** — retains the corrected distinction between 15.9% non-payroll OPEX mix and 75.6% non-payroll share of the Q4-vs-Q1 increase; the +496.1m planning-vs-core OPEX bridge remains visibly open.
7. **Cash & Working Capital** — keeps the Dec-2025 core working-capital view separate from the FY2026 synthetic liquidity-stress rehearsal.
8. **Forecast** — changes `Favorable assumptions proven` to the safer `Upside trigger conditions met`; rolling-origin historical OOS remains the primary historical accuracy evidence and live Gate A remains open.
9. **Evidence** — uses canonical `SIMULATED_HISTORICAL_BACKTEST`, aligns taxonomy status with the CLOSED governance control and removes Power BI references from the visible recruiter website. The backend governance marker remains `OUT_OF_ACTIVE_SCOPE` solely to prevent accidental re-entry into the active release.
10. **Dashboard** — places monthly Revenue and Gross Margin on the same forecast-comparator basis, while continuing to surface Historical OOS `PASS` and Live Gate A `OPEN`.

## Page 5 source-driven costing contract

The Page 5 builder now reads:

- `data/costing/standard_cost_reconciliation.csv`
- `data/costing/cost_variance_monthly.csv`
- `data/costing/inventory_reserve_monthly.csv`

Controlled FY2025 costing totals remain:

- Standard COGS: ~`6.3582` VND bn
- Modeled Actual COGS: ~`6.6076` VND bn
- Total unfavorable variance: ~`249.4` VND m
- Material-price share of variance: ~`82.0%`
- Monthly reconciliation: `12 / 12 PASS`

Controlled Dec-2025 detailed inventory snapshot:

- Gross inventory: `3.266386` VND bn
- Reserve: ~`0.489958` VND bn
- Net inventory: ~`2.776428` VND bn
- Non-zero inventory SKUs: `3`
- Slow-moving source-flagged SKUs: `SKU018`, `SKU034`, `SKU035`
- `SKU034` remains the dominant inventory exposure at approximately `91.8%` of gross inventory.

This is a **SIMULATED / DERIVED detailed 36-SKU costing rehearsal** and is explicitly not the core Page 2 COGS universe.

## Canonical finance truth unchanged

FY2025 Base remains:

- Revenue: `82.5138` VND bn
- Gross profit: `26.9150` VND bn
- EBITDA proxy: `12.8956` VND bn
- EBITDA proxy margin: `15.6284%`
- Contribution: `24.2074` VND bn
- Cash conversion cycle: `54` days

Commercial semantics remain:

- Four negative-contribution promotion cases.
- One positive-contribution promotion below the ROI hurdle.
- Three channels below the 25% contribution-margin hurdle.

CAPEX semantics remain:

- P-006 Energy Retrofit: `1.300` VND bn project budget, `22` month payback.
- Six-project CAPEX envelope: `6.550` VND bn, `58.74%` utilization.

## Forecast evidence unchanged in substance

Primary model: `SEASONAL_NAIVE_12` on simulated historical operating data.

| Horizon | Eligible OOS forecasts | Bias | WAPE |
|---:|---:|---:|---:|
| 1M | 24 | +0.2510% | 1.1734% |
| 3M | 22 | +0.1558% | 1.1554% |
| 6M | 19 | +0.1125% | 1.1782% |

Evidence class: `SIMULATED_HISTORICAL_BACKTEST`.

These figures are not live employer/company forecast accuracy. Gate A remains `OPEN / PENDING_EXTERNAL_INPUT` until a genuine forecast is frozen before close and compared with post-close actuals.

## Validation evidence

The tested source freeze `3fe18579feb849788527051b2ccdcc303144787b` completed successfully through the final website workflow:

- Page 5 source build: PASS
- Page 5 costing/inventory validation: PASS
- Page 6 CAPEX/OPEX contract: PASS
- Rolling-origin backtest validation: `21 / 21 PASS`
- Page 8 forecast contract: PASS
- true route / link QA: `11 / 11` routes, `4 / 4` build checks, `3 / 3` public links
- Page 10 synthesis: `19` checks PASS
- Page 1–10 cross-page content alignment: PASS
- scope-boundary validation: PASS
- evidence-taxonomy validation: PASS
- working-capital semantics validation: PASS
- final recruiter release QA: SUCCESS
- production GitHub Pages build: SUCCESS

The final diff from the prior clean website source is limited to website pages, Page 5 source contracts/builders, Page 10 contract consumption and related QA. No unrelated public-company dataset or historical report noise is included.

## Open items by design

- **Live Gate A:** OPEN — genuine pre-close frozen forecast plus post-close actual required.
- **Page 6 OPEX bridge:** OPEN — +496.1m planning-vs-core reconciliation remains explicitly disclosed.
- **Power BI:** backend governance marker remains `OUT_OF_ACTIVE_SCOPE`; it is not displayed as an active recruiter-website subject.

## Freeze rule

After the immutable `fpa-portfolio-v1.1.1` tag is created and final `main` QA / GitHub Pages deployment are green, treat the repository as feature-frozen for recruiter use. Further work should be limited to genuine new evidence, factual corrections, broken links or dependency/security maintenance.
