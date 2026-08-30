# MCH Valuation Rehearsal — Methodology

## Purpose

This module extends the MCH Finance Analyst Lens from historical statement analysis into a disciplined public-company valuation rehearsal. It demonstrates how an analyst can move from reported operating economics to an explicit FCFF forecast, discount-rate discipline and sensitivity analysis.

It is **not** a live recommendation, price target or investment advice. The historical anchor is public and page-reviewed where stated; all forward assumptions are `ANALYST_ASSUMPTION_REHEARSAL`.

## Evidence hierarchy

| Layer | Evidence class | Use |
|---|---|---|
| FY2016–FY2025 statements | `PUBLIC_REPORTED` | Historical revenue, operating margin, PAT margin, CFO/PAT and source notes |
| FY2026–FY2030 forecast | `ANALYST_ASSUMPTION_REHEARSAL` | Scenario mechanics only |
| DCF sensitivity | `ANALYST_ASSUMPTION_REHEARSAL` | WACC/terminal-growth robustness only |
| Equity value / price target | Not calculated | Net debt, diluted shares and current market price are not approved inputs |

## Historical anchor

The model starts with MCH FY2025 net revenue of **VND 30,556.5bn** from the approved MCH trend layer. FY2025 operating margin is **25.41%**, PAT margin is **22.14%**, and CFO/PAT is **31.52%**. The last ratio is treated as a cash-conversion warning, not as a forecast input or causal conclusion.

The FY2017 row remains sourced from audited FY2018 comparative/corresponding columns and retains its medium-confidence caveat in the underlying data.

## Forecast mechanics

The forecast uses five annual periods, FY2026–FY2030. For each scenario:

```text
Revenue_t = Revenue_(t−1) × (1 + revenue CAGR)
EBIT_t = Revenue_t × EBIT margin
NOPAT_t = EBIT_t × (1 − tax rate)
FCFF_t = NOPAT_t + D&A_t − Capex_t − ΔNWC_t
PV(FCFF_t) = FCFF_t / (1 + WACC)^t
Terminal value = FCFF_2030 × (1 + g) / (WACC − g)
Enterprise value = Σ PV(FCFF_t) + PV(Terminal value)
```

All monetary values in the output CSV are VND billions. Percentages are stored as decimals in the machine-readable files and displayed as percentages in the report.

## Scenario assumptions

| Scenario | Revenue CAGR | EBIT margin | Tax rate | D&A / revenue | Capex / revenue | ΔNWC / revenue | WACC | Terminal growth |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Base | 6.0% | 25.0% | 20.0% | 1.5% | 1.8% | 0.5% | 12.0% | 3.0% |
| Upside | 8.0% | 27.0% | 20.0% | 1.5% | 1.8% | 0.3% | 11.0% | 3.0% |
| Downside | 2.0% | 22.0% | 22.0% | 1.5% | 2.2% | 0.8% | 14.0% | 2.0% |

The scenario spread is intentionally interpretable: growth, margin, reinvestment intensity, cash drag and discount rate move together. It is a planning sensitivity, not a probability-weighted valuation.

## Sensitivity design

The Base case is tested on a 5×5 grid:

- WACC: 10.0%, 11.0%, 12.0%, 13.0%, 14.0%.
- Terminal growth: 2.0%, 2.5%, 3.0%, 3.5%, 4.0%.

Every cell satisfies `WACC > terminal growth`. The sensitivity is intentionally EV-only because equity bridge inputs are not yet approved.

## Why the module stops at EV

The approved statement layer does not yet provide a complete, consistent set of net debt/net cash, diluted shares outstanding and current market price inputs. Converting enterprise value into equity value or a per-share target without those inputs would be false precision. The correct analyst action is to keep the EV output, list the missing bridge inputs and request them during diligence.

## Production conversion path

To convert this rehearsal into a real research note:

1. Replace analyst assumptions with an approved management consensus or a documented bottom-up forecast.
2. Build a capex and working-capital history from cash-flow and balance-sheet notes.
3. Reconcile NOPAT to a consistent tax and non-operating-item policy.
4. Source net debt/net cash at the valuation date, including lease treatment.
5. Source diluted shares and a timestamped market price.
6. Add a trading-comps cross-check with a consistent earnings basis.
7. Run a reviewer challenge on WACC, terminal growth and terminal-value concentration.

