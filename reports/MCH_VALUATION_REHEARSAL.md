# MCH Valuation Rehearsal — Finance Analyst View

**As of:** 30 August 2026  
**Scope:** MCH public-company historical anchor plus an illustrative FY2026–FY2030 FCFF/DCF rehearsal  
**Units:** VND billions unless stated otherwise  
**Evidence class:** Historical rows are `PUBLIC_REPORTED`; forward rows are `ANALYST_ASSUMPTION_REHEARSAL`.

## Executive Summary

The valuation rehearsal produces an **EV-only range of VND 40,673.8bn to VND 101,614.9bn** across Downside, Base and Upside assumptions. The Base case is **VND 75,928.0bn**. The spread is driven by the combined effect of revenue growth, operating margin, cash reinvestment and WACC—not by a single terminal-growth choice.

The result is intentionally not a price target. The equity bridge is blocked until net debt/net cash, diluted shares, a valuation-date market price, and approved forward guidance are sourced. That stop is part of the analyst output: it prevents a clean-looking but unsupported per-share conclusion.

The strongest diligence question is cash conversion. MCH FY2025 reported CFO/PAT was **31.52%**, down sharply from FY2024 in the approved trend layer. The DCF therefore keeps ΔNWC and capex explicit instead of assuming that accounting profit automatically becomes distributable cash.

## 1. Historical anchor

| Metric | FY2025 | Evidence / interpretation |
|---|---:|---|
| Net revenue | 30,556.5 | Public reported; page-reviewed audited statement layer |
| Operating margin | 25.41% | Derived from reported operating profit / revenue |
| PAT margin | 22.14% | Derived from reported PAT / revenue |
| CFO / PAT | 31.52% | Derived cash-conversion diagnostic; not a causal conclusion |

The source note for FY2025 is `Page-reviewed audited statement source`. FY2017 remains a comparative/corresponding-column observation and is not silently promoted to standalone PDF provenance.

## 2. DCF scenario output

| Scenario | PV explicit FCFF | PV terminal value | Enterprise value | Terminal value / EV |
|---|---:|---:|---:|---:|
| Downside | 17,350.4 | 23,323.4 | **40,673.8** | 57.34% |
| Base | 24,943.3 | 50,984.6 | **75,928.0** | 67.15% |
| Upside | 29,574.8 | 72,040.1 | **101,614.9** | 70.90% |

The Base case reaches FY2030 revenue of **VND 40,891.5bn** and FCFF of **VND 7,851.2bn** under the stated assumptions. Terminal value is a material part of every scenario, so the sensitivity grid is required before a management or investment conclusion.

## 3. Base-case sensitivity

Enterprise value, VND bn:

| WACC \ g | 2.0% | 2.5% | 3.0% | 3.5% | 4.0% |
|---|---:|---:|---:|---:|---:|
| 10.0% | 88,440.9 | 92,909.6 | 98,016.7 | 103,909.6 | 110,784.5 |
| 11.0% | 78,405.7 | 81,785.9 | 85,588.7 | 89,898.6 | 94,824.1 |
| 12.0% | 70,384.0 | 73,010.1 | **75,928.0** | 79,189.1 | 82,857.9 |
| 13.0% | 63,826.5 | 65,911.1 | 68,204.1 | 70,738.4 | 73,554.4 |
| 14.0% | 58,367.0 | 60,051.2 | 61,888.6 | 63,900.9 | 66,114.5 |

The sensitivity spans **VND 58,367.0bn to VND 110,784.5bn**. A one-point WACC move changes value materially, which is why the report should not present the Base case as a precise intrinsic value.

## 4. Analyst interpretation

### Growth is not enough

The Upside case combines 8.0% revenue CAGR with a 27.0% EBIT margin and lighter ΔNWC drag. The value uplift is therefore a compound operating/cash assumption, not simply “more sales.” In an interview, the correct follow-up is to request evidence for price, volume, mix, cost-to-serve, trade spend and collection timing.

### Cash conversion is the watch item

The public history shows a sharp FY2025 CFO/PAT deterioration. The DCF addresses this by making capex and ΔNWC explicit. A finance analyst should bridge the deterioration into receivables, inventory, payables, taxes, provisions and one-off cash items before accepting a margin-led bull case.

### Terminal value concentration limits confidence

Terminal value represents 57%–71% of scenario EV. This is not a defect in the formula; it is a decision signal. The next diligence cycle should challenge WACC, terminal growth, reinvestment intensity and the durability of the operating margin rather than debate a single price target.

## 5. Decision and next diligence

**Decision:** use the Base case as a planning anchor only; do not publish an equity value or per-share target yet.

**Request next:**

1. Net debt/net cash and lease treatment at the valuation date.
2. Diluted shares outstanding and timestamped market price.
3. Approved management forecast or a documented bottom-up forecast bridge.
4. Capex, depreciation and working-capital history.
5. Trading-comps inputs on a consistent EBIT/FCFF basis.

**Monitoring:** FY2026 revenue growth, operating margin, CFO/PAT, DSO/DIO/DPO and capex intensity. Any recommendation should be refreshed when those drivers move outside the scenario guardrails.

## 6. Reproducibility and boundaries

- Builder: `scripts/build_mch_valuation_rehearsal.mjs`.
- Forecast output: `data/mch_valuation_rehearsal_forecast.csv`.
- Sensitivity output: `data/mch_valuation_rehearsal_sensitivity.csv`.
- Summary output: `data/mch_valuation_rehearsal_summary.json`.
- Validator: `scripts/validate_mch_valuation_rehearsal.mjs`.
- QA: `reports/MCH_VALUATION_REHEARSAL_QA.md`.

No current market price, diluted share count, net-debt bridge or realized company impact is claimed. This is a finance-analyst rehearsal built from public historical evidence and explicit forward assumptions.
