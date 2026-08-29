# M&A Accretion / Dilution Case — NovaBite Foods (Synthetic)

## Purpose

This case is the optional strategic-stretch module for the commercial-finance portfolio. It tests whether a fictional acquisition creates value and whether the transaction is EPS-accretive after financing, synergy ramp and integration costs. It is deliberately labelled SYNTHETIC and is not presented as a live investment recommendation.

## Decision headline

- Base entry valuation: 8.5x FY2025 target EBITDA.
- Target FY2025 revenue: VND 18.0bn; EBITDA margin: 20.0%; standalone EBITDA: VND 3.6bn.
- Enterprise value: VND 30.6bn; less target net debt VND 4.0bn gives equity purchase price VND 26.6bn.
- Funding: 60% cash (VND 15.96bn) and 40% new debt (VND 10.64bn) at 9.0%; incremental annual interest is VND 0.958bn.
- Base-case Year-2 EPS accretion: 17.16%; Year-1 dilution: -0.46% because of VND 3.0bn integration cost.
- Incremental deal NPV at 10.5% WACC and 2.5% terminal growth: VND 28.39bn.
- Decision gate: PASS for the synthetic base case, subject to confirmatory diligence. The case should be shown as an illustrative screening model, not as proof that the transaction should close.

## Model architecture

1. Standalone target: revenue grows 10.0% annually; EBITDA margin expands by 50 bps each year from 20.0%; D&A grows 8.0% from a VND 1.0bn base; capex starts at VND 1.1bn and grows 8.0%.
2. Revenue synergy: 1.5% of target revenue in Year 1, increasing by 50 bps per year; synergy EBITDA margin is 35.0%.
3. Cost synergy: VND 0.8bn, 1.4bn, 2.0bn, 2.0bn and 2.0bn across Years 1–5.
4. Integration cost: VND 3.0bn in Year 1 and VND 1.0bn in Year 2.
5. Financing: cash plus debt funding is based on equity purchase price; no share issuance is assumed, so EPS dilution comes only from transaction economics and financing interest.
6. Acquirer standalone net income starts at VND 12.0bn and grows 8.0% annually; diluted shares are held at 120.0m.
7. Tax rate is 20.0%; WACC is 10.5%; terminal growth is 2.5%.

## Core formulas

- Target EBITDA = target revenue × target EBITDA margin.
- Incremental EBIT = target EBIT + revenue-synergy EBIT + cost synergy − integration cost.
- Incremental net income = (incremental EBIT − incremental interest) × (1 − tax rate).
- Pro-forma net income = acquirer standalone net income + incremental net income.
- EPS accretion = pro-forma EPS ÷ standalone EPS − 1.
- Incremental FCFF = incremental EBIT × (1 − tax rate) + D&A − capex − incremental NWC.
- Deal NPV = discounted Years 1–5 incremental FCFF + discounted terminal value − enterprise value.

## Base-case output

| Year | Target revenue (VND bn) | Incremental EBIT | Pro-forma EPS (VND) | EPS accretion | Incremental FCFF (VND bn) |
|---|---:|---:|---:|---:|---:|
| 1 | 19.80 | 0.883 | 107.50 | -0.46% | 0.632 |
| 2 | 21.78 | 3.960 | 136.66 | 17.16% | 3.087 |
| 3 | 23.96 | 6.101 | 160.26 | 27.22% | 4.792 |
| 4 | 26.35 | 6.714 | 174.43 | 28.21% | 5.274 |
| 5 | 28.99 | 7.408 | 189.94 | 29.27% | 5.820 |

## Sensitivity interpretation

The sensitivity file spans 7.0x, 8.5x and 10.0x entry EBITDA multiples and 50%, 75%, 100% and 125% synergy realization. Even the 10.0x / 50% case remains positive in this simplified screen (NPV VND 12.99bn; Year-2 accretion 11.61%), but this should not be read as a robust downside proof because leverage, working-capital stress, revenue cannibalisation, stranded costs and purchase-accounting effects are not modelled.

## What is intentionally not modelled

- Purchase-price allocation, goodwill, deferred tax and amortisation.
- Debt amortisation, refinancing, minimum cash and covenant headroom.
- Management rollover, earn-outs, option dilution or share issuance.
- Customer churn, cannibalisation, one-time revenue synergies and stranded corporate costs.
- Monthly phasing, seasonality, FX, VAT and legal/regulatory approvals.
- A real target's audited statements or management guidance.

## Interview-ready takeaway

I built a transparent accretion/dilution screen rather than jumping straight to a headline multiple. The model isolates standalone performance, revenue and cost synergies, integration costs and financing interest, then links the same assumptions to EPS accretion and incremental FCFF. The key judgement is that the deal is slightly dilutive in Year 1 but becomes accretive from Year 2; I would therefore gate the recommendation on confirmatory diligence of synergy ownership, debt capacity and purchase accounting.

## Evidence and storage

- Forecast data: data/mna_accretion_dilution_synthetic.csv.
- Sensitivity grid: data/mna_accretion_dilution_sensitivity.csv.
- QA script: scripts/validate_mna_accretion_dilution.mjs.
- QA report: reports/MNA_ACCRETION_DILUTION_QA.md.
- Evidence class: SYNTHETIC / REHEARSAL, not Gate A internal forecast evidence.