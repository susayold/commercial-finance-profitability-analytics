# Block A Design Lock — VietNova Consumer Finance Analyst Case

**Date:** 2026-08-30  
**Status:** PROPOSED — awaiting candidate approval  
**Purpose:** convert the master-plan Block A decisions into one auditable contract before any future re-generation of the operating model. Existing repository artifacts were built from this proposal, but no row below should be described as a real-company fact.

## Decision register

| # | Decision | Proposed design | Why this is the finance-analyst fit | Evidence / implementation anchor | Approval |
|---:|---|---|---|---|---|
| 1 | FMCG / consumer sub-sector | Branded packaged foods and beverages with repeat-purchase demand | Supports commercial P&L, gross-to-net, pricing, promotion, mix and working-capital analysis | `docs/FULL_DEPTH_EXECUTION_BLUEPRINT.md`; synthetic operating ledger | PENDING |
| 2 | Owned physical stores | No owned-store network in the core case | Keeps SSSG, sales/m² and store payback out of the main model; avoids forcing retail KPIs that do not fit the business | Store module remains conditional in the master plan | PENDING |
| 3 | SSSG / sales per m² | Not applicable to core case | Prevents a misleading store-economics narrative; may be activated only in a separate owned-store scenario | Conditional-retail rule in master plan | PENDING |
| 4 | Company | VietNova Consumer JSC (synthetic company) | Provides granular operating data without implying private employer data | Synthetic-data governance and source registry | PENDING |
| 5 | Brands / categories | VietSpice (seasonings), QuickBowl (convenience foods), PulseUp (beverages) | Gives distinct margin, price elasticity, seasonality and channel stories | `data/operational_driver_tree_unit_economics.csv` | PENDING |
| 6 | SKU depth | 36 SKUs across the three brands | Enough granularity for SKU P&L, mix, rationalization, inventory and promotion analysis | Synthetic ledger design target | PENDING |
| 7 | Channels | General Trade, Modern Trade, Marketplace, D2C, Wholesale | Creates visible channel economics: discounts, trade spend, platform fee, fulfillment and payment terms | `data/finance_analyst_kpi_dictionary.csv`; channel P&L methodology | PENDING |
| 8 | Customer structure | 24 named customers plus long-tail groups | Enables customer contribution, concentration, rebate intensity and collection-delay proxy | Customer P&L and AR schedule specification | PENDING |
| 9 | Geography | North, Central, South | Enables regional variance, service-cost and inventory comparisons without excessive dimensionality | Operating-ledger dimensions | PENDING |
| 10 | Commercial P&L | Gross Sales → discounts/returns → Net Sales → COGS → Gross Profit → trade spend/A&P/platform/fulfillment/variable selling costs → Contribution Profit → OPEX → Operating Profit | Makes the bridge from commercial activity to management P&L explicit and auditable | `docs/FINANCE_ANALYST_KPI_DICTIONARY.md`; Excel v2 model contract | PENDING |
| 11 | Operating-driver tree | Revenue = active customers/outlets × order frequency × units per order × net price; contribution = revenue − product cost − commercial investment − variable fulfillment/selling cost | Connects operating levers to financial outcomes and supports business partnering | `docs/OPERATIONAL_DRIVER_TREE_UNIT_ECONOMICS.md` | PENDING |
| 12 | Working capital | Invoice-level AR/AP, weekly inventory snapshots, DSO/DIO/DPO, CCC, aging and write-off/shrinkage fields | Demonstrates that profitable growth can still create cash pressure | `docs/FORECAST_METHODOLOGY.md`; `docs/POWER_BI_BUILD_SPEC.md` | PENDING |
| 13 | Liquidity / debt | Minimum-cash policy, revolver limit/rate, scheduled principal and stress scenarios; no unsupported covenant claim | Supports cash bridge, revolver draw and liquidity-risk recommendation | `docs/REMAINING_GATES_HANDOFF_2026-08-30.md`; liquidity schedule | PENDING |
| 14 | Management questions | 20-question set covering growth-to-profit, variance drivers, structural vs temporary gaps, pricing, promotion, SKU/channel/customer economics, inventory, CCC, forecast risk, liquidity and resource allocation | Mirrors the questions a Junior FP&A / Business Finance analyst must answer, not just dashboard metrics | `docs/BUSINESS_CASE.md`; interview walkthrough | PENDING |
| 15 | Peer set | MCH primary commercial anchor; VNM long-run financial-quality benchmark; QNS input-cost/plant benchmark; KDC portfolio-change context | Four peers provide category context while preserving basis/perimeter caveats | `docs/PEER_COMPARABILITY_DECISION_2026-08-30.md` | PENDING |
| 16 | External sources | Official annual reports and exchange filings only; reported values retain page/section/unit/scope/basis; no aggregator backfill | Protects the credibility of a finance-analyst portfolio and keeps public calibration separate from synthetic operations | `data/source_registry.csv`; [MCH FY2017 official report](https://masanconsumer.com/wp-content/uploads/2024/05/Bao-cao-thuong-nien-nam-2017.pdf) | PENDING |
| 17 | Claim governance | `OBSERVED`, `SIMULATED`, `DERIVED`, `ASSUMPTION`, `INDEXED_ONLY`; no paid-employment, private-data, causal-uplift or LIVE_INTERNAL claim without gate evidence | Makes the project defensible in recruiter and interviewer review | `docs/CLAIM_GOVERNANCE.md`; Gate A/B checklist | PENDING |
| 18 | Hidden-truth events | Deterministic hidden events include price realization leakage, promotion cannibalization, stockout/wastage, mix shift, DSO stretch and forecast bias; truth stays separate from visible outputs | Tests whether QA can detect business drivers rather than merely reproduce a chart | `docs/HIDDEN_TRUTH_GENERATOR_SPEC.md`; QA runner | PENDING |
| 19 | Promotion evaluation | Pre/post ROI with baseline, incremental volume, discount/trade spend, campaign cost, cannibalization, incremental contribution and stop-loss hurdle; causal language prohibited without counterfactual | Shows commercial judgment and budget discipline | `docs/PROMOTION_PRICING_ALLOCATION_METHODOLOGY.md`; promotion QA | PENDING |
| 20 | Pricing decision framework | List-price and net-realization scenarios with elasticity, unit-cost inflation, competitor case, CM bridge, break-even price and target-margin price | Converts a price request into a quantified profit decision | `data/pricing_simulator_synthetic.csv`; pricing QA | PENDING |

## Approval protocol

The candidate should respond with one of:

- **APPROVE AS PROPOSED** — keep the design and proceed to the next execution block.
- **APPROVE WITH CHANGES** — list row numbers and replacement decisions.
- **REJECT / REDESIGN** — explain the target company or operating model that should replace VietNova.

Once approved, freeze this document with an approval date and reviewer name. Any later change to rows 1–20 must create a new dated revision and trigger the QA runner.

## Release implications

- This lock does **not** close Gate A or Gate B.
- It does **not** convert synthetic operating data into employer data.
- MCH FY2017 remains `INDEXED_ONLY` until official PDF bytes, hash and page anchors are archived.
- A final one-page CV still requires the candidate's identity, education, experience and links.
- Durable copies belong in GitHub and the Drive project archive; local files are temporary staging only.

## Immediate next action after approval

1. Freeze the approved Block A revision.
2. Re-run the deterministic finance QA runner.
3. Regenerate only the affected model tabs/outputs if a decision changed.
4. Refresh the website quick-tour and CV evidence map.
5. Preserve the previous revision for audit chronology.
