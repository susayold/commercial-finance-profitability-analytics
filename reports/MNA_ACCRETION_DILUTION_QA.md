# M&A Accretion / Dilution QA

Date: 2026-08-30
Evidence class: SYNTHETIC / REHEARSAL

## Automated validation

Validator: scripts/validate_mna_accretion_dilution.mjs

| Check | Result |
|---|---|
| Forecast rows = 5 | PASS |
| Sensitivity cells = 12 | PASS |
| Year sequence 1–5 | PASS |
| Target EBIT arithmetic | PASS |
| Synergy EBIT arithmetic | PASS |
| Incremental EBIT arithmetic | PASS |
| Incremental net income arithmetic | PASS |
| Pro-forma EPS arithmetic | PASS |
| Year-1 dilution / Year-2 accretion gates | PASS |
| Base NPV tie-out | PASS |

Expected base outputs:

- Year-2 EPS accretion: 17.159694%.
- Year-5 incremental FCFF: VND 5.82041272bn.
- Deal NPV: VND 28.38906474bn.
- Minimum sensitivity NPV: VND 12.98906285bn at 10.0x entry and 50% synergy realization.

## Review notes

- The model is internally reproducible from the two CSV inputs and the documented formulas.
- Sensitivity is directional rather than a probability-weighted forecast.
- The positive downside grid is not sufficient for a real recommendation because purchase accounting, leverage paydown, churn, cannibalisation and regulatory diligence are intentionally excluded.
- This artifact must not be used to satisfy the internal forecast Gate A; it is a synthetic case-study module.

## Reviewer sign-off template

- [ ] Confirm target financials are clearly labelled synthetic.
- [ ] Re-perform entry EV and funding bridge.
- [ ] Re-perform Year-1 integration-cost dilution.
- [ ] Challenge synergy ownership and timing.
- [ ] Add debt amortisation and purchase accounting before any real-world use.