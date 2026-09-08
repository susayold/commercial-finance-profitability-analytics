# VNFINANCE-FPA-v1.1.1 — Final Recruiter Release

Date: 2026-09-08

## Release identity

- Release name: `VNFINANCE-FPA-v1.1.1`
- Release tag: `fpa-portfolio-v1.1.1`
- Tested website/source freeze: `fcfe112f58552ec0d1c03b55d33746d5fd9710aa`
- Private recruiter site version: `52` (unchanged)
- GitHub Pages: https://susayold.github.io/commercial-finance-profitability-analytics/
- Metadata anchor: the commit that creates this report; its SHA is recorded canonically in `data/governance/release_identity_nonbi.json`.

## Why v1.1.1 exists

`v1.1.1` is a recruiter-website content-alignment patch. It does not add a new finance module and does not change the controlled FY2025 scenario truth.

The ten website pages were audited against their governed finance modules, evidence classes and cross-page scope boundaries. The patch resolves stale or ambiguous presentation while preserving intentional standalone lenses.

## Page-by-page closure

1. **Executive** — surfaces historical OOS forecast evidence as `PASS` while keeping live Gate A `OPEN`.
2. **Performance** — clarifies that simulated monthly actual-ledger comparators are separate from the canonical FY2025 Base scenario and are not live forecast-accuracy evidence.
3. **Commercial** — corrects the 25% contribution-margin hurdle statement: Modern Trade, Marketplace and D2C are below the hurdle; Wholesale clears it. Also clarifies detailed-ledger vs canonical-headline scope.
4. **Profitability** — retained unchanged because its 24-customer universe is explicitly a standalone synthetic rehearsal and is not additive to Pages 1–3.
5. **Costing** — removes any implication that real plant BOM / purchase-order / production-hour evidence exists; slow-moving inventory and extreme DIO are explicitly modeled rehearsal outputs.
6. **Resources** — distinguishes 15.9% non-payroll OPEX mix from the 75.6% non-payroll share of the Q4-vs-Q1 increase; restores navigation to Cash & Working Capital.
7. **Cash & Working Capital** — replaces ambiguous `Actuals / Modeled / Simulated` wording with `Simulated / Derived + Stress Rehearsal`.
8. **Forecast** — replaces the old demo Bias/WAPE fixture as the primary accuracy display with leakage-safe rolling-origin OOS evidence at 1M / 3M / 6M; Gate A remains open for live company accuracy; the 8.0bn cash threshold remains a planning guardrail and long-range cash stays withheld.
9. **Evidence** — adds `SIMULATED_HISTORICAL_BACKTEST`, Historical OOS `PASS`, live Gate A `OPEN`, current release identity and removes Power BI from active visible website controls. A hidden `OUT_OF_ACTIVE_SCOPE` marker remains in the JSON contract solely for scope QA.
10. **Dashboard** — surfaces Historical OOS `PASS` and Live Gate A `OPEN`, consumes the Page 8 forecast-backtest contract and labels the monthly performance trend as simulated actual-ledger proxy evidence.

## Controlled finance truth unchanged

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

- P-006 Energy Retrofit: `1.300` VND bn budget, `22` month payback.
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

## Validation

The tested source freeze passed:

- rolling-origin backtest validation;
- Page 2 semantics validation;
- Page 6 CAPEX/OPEX contract validation;
- Page 8 forecast/evidence validation;
- Page 10 synthesis validation;
- new Page 1–10 cross-page content-alignment validation;
- scope-boundary validation;
- evidence-taxonomy validation;
- working-capital semantics validation;
- final recruiter release QA;
- production GitHub Pages build.

## Open items by design

- **Live Gate A:** OPEN — genuine pre-close frozen forecast plus post-close actual required.
- **Page 6 OPEX bridge:** OPEN — +496.1m planning-vs-core reconciliation remains explicitly disclosed.
- **Power BI:** OUT OF ACTIVE SCOPE — not part of the active website/recruiter acceptance path.

## Freeze rule

After the immutable `fpa-portfolio-v1.1.1` tag is created and final main QA/deployment are green, treat the repository as feature-frozen for recruiter use. Further changes should be limited to genuine new evidence, factual corrections, broken links, or dependency/security maintenance.
