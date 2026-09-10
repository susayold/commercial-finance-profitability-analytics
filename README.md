# Commercial Finance & FP&A Portfolio

Recruiter-ready Commercial Finance / Financial Planning & Analysis (FP&A) case built around a fictional Vietnam FMCG company, **VietNova Consumer JSC**.

The project demonstrates how a Finance Analyst can move from controlled operating data to reconciled financial outputs, explain performance drivers, test forecast/scenario assumptions, convert findings into management decisions, and preserve an auditable evidence boundary.

## Recruiter start

- Current controlled release: **`VNFINANCE-FPA-v1.1.1`** · tag **`fpa-portfolio-v1.1.1`**
- [Recruiter start-here guide](RECRUITER_START_HERE.md)
- [GitHub Pages](https://susayold.github.io/commercial-finance-profitability-analytics/)
- [Executive Dashboard](https://susayold.github.io/commercial-finance-profitability-analytics/dashboard/)
- [Excel FP&A Model Showcase](https://susayold.github.io/commercial-finance-profitability-analytics/excel/) — **12-sheet workbook v1.2.0**
- [Download Excel workbook](site/public/downloads/VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx)
- [Private recruiter portfolio](https://vn-finance-fpa-case.sangkenny200.chatgpt.site/) — **version 52**
- [Monthly Business Review / CFO operating pack](reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md)
- [Rolling-origin forecast backtest](reports/ROLLING_ORIGIN_FORECAST_BACKTEST_2026-09-08.md)
- [v1.1.1 final recruiter release](reports/FINAL_RECRUITER_RELEASE_V1.1.1_2026-09-08.md)

## Excel recruiter evidence

The additive Excel showcase is a recruiter proof-of-skill companion to the controlled finance release. The workbook contains **12 sheets** covering assumptions, monthly operating data, P&L variance, commercial economics, working capital, scenario analysis, forecast accuracy, costing, controls, skill communication and version/change history.

It demonstrates formula-driven modelling with `SUM`, `IF`, `IFERROR`, `SUMIFS`, `INDEX` / `MATCH`, cross-sheet links, data validation, conditional formatting, charts and explicit PASS / OPEN controls. Hardcoded inputs, formulas and cross-sheet references use finance-model conventions so a reviewer can distinguish assumptions from calculations and linked data.

The workbook is a **portfolio modelling demonstration using simulated / derived data**. Historical forecast performance remains labelled `SIMULATED_HISTORICAL_BACKTEST`; live forecast accuracy remains Gate A / OPEN by design. The Excel artifact does not change the controlled FY2025 finance truth.

## Business question

**Which growth, margin and working-capital drivers should management act on next month?**

The case demonstrates three core finance decisions:

1. Reconcile invoice-level operating data to a management P&L and explain plan/performance movement.
2. Rank channel, customer, SKU and promotion economics after COGS, fees, trade spend and other commercial costs.
3. Translate working-capital, forecast and scenario evidence into actions with owners, value equations, guardrails and review dates.

## Current controlled status

| Area | Status | Meaning |
|---|---|---|
| Finance truth | **DONE** | Core finance model and reconciliations are controlled |
| Commercial / profitability | **DONE** | Channel, customer, SKU and promotion economics are decision-linked |
| Three statements / close controls | **DONE** | P&L, balance sheet, cash flow, subledgers and roll-forwards reconcile |
| Page 5 costing & inventory | **PASS** | Source-driven 36-SKU detailed rehearsal; isolated from core COGS |
| Historical forecast backtest | **PASS** | Leakage-safe rolling-origin OOS evidence on simulated history |
| Website Pages 1–10 | **PASS** | Cross-page finance/evidence contract is validated |
| Excel recruiter showcase | **AVAILABLE** | Separate `/excel/` page + downloadable 12-sheet workbook; no change to finance truth |
| Finance core CI | **GREEN** | Automated recruiter-release QA passes |
| GitHub Pages build | **GREEN** | Production site build passes on the tested source freeze |
| Gate A — live forecast accuracy | **OPEN BY DESIGN** | Genuine pre-close frozen forecast + post-close actual still required |
| Page 6 OPEX bridge | **OPEN BY DESIGN** | +496.1m planning-vs-core bridge is disclosed rather than forced to zero |

Canonical release identity: [data/governance/release_identity_nonbi.json](data/governance/release_identity_nonbi.json).  
Canonical project status: [data/governance/project_status_nonbi.json](data/governance/project_status_nonbi.json).

The release contract records a **tested source freeze, stable metadata anchor and immutable release tag**. It intentionally does not try to store the moving live `main` SHA inside its own committed metadata. The Excel workbook v1.2.0 is an additive recruiter artifact rather than a replacement for the immutable v1.1.1 finance release.

## FY2025 controlled scenario snapshot

| KPI | Base | Upside | Downside |
|---|---:|---:|---:|
| Revenue | 82.5138 VND bn | 85.7182 VND bn | 76.9061 VND bn |
| Gross profit | 26.9150 VND bn | 31.1886 VND bn | 18.6342 VND bn |
| EBITDA proxy | 12.8956 VND bn | 17.4496 VND bn | 3.4933 VND bn |
| EBITDA proxy margin | 15.6284% | 20.3570% | 4.5423% |
| Contribution | 24.2074 VND bn | 28.4810 VND bn | 15.8724 VND bn |
| Cash conversion cycle | 54 days | 48 days | 68 days |

These are **PROXY_DERIVED** outputs from the controlled VietNova case, not reported results of a real company.

## Website Page 1–10 contract

The website is not treated as a separate storytelling layer. Each page is checked against the finance module and evidence boundary it represents.

- **Page 1 — Executive:** candidate-facing recommendation language; Historical OOS `PASS`; Live Gate A `OPEN`.
- **Page 2 — Performance:** simulated actual-ledger comparators are separate from the canonical FY2025 Base scenario.
- **Page 3 — Commercial:** Modern Trade, Marketplace and D2C are below the 25% contribution-margin hurdle; Wholesale clears it.
- **Page 4 — Profitability:** 24-customer synthetic economics rehearsal is explicitly standalone and not additive to core P&L.
- **Page 5 — Costing:** detailed 36-SKU source-driven rehearsal with `NOT_CORE_COGS` boundary.
- **Page 6 — Resources:** 15.9% non-payroll OPEX mix is separate from 75.6% share of the Q4-vs-Q1 increase; +496.1m OPEX bridge remains open.
- **Page 7 — Cash & WC:** Dec-2025 core working capital is separate from FY2026 liquidity stress.
- **Page 8 — Forecast:** rolling-origin historical OOS is the historical accuracy evidence; live Gate A remains open; long-range cash stays withheld pending opening-state reconciliation.
- **Page 9 — Evidence:** canonical `SIMULATED_HISTORICAL_BACKTEST` taxonomy and CLOSED alias control are visible; archived tooling is not surfaced as an active recruiter subject.
- **Page 10 — Dashboard:** Revenue and Gross Margin use the same forecast-comparator basis; owner-page scope boundaries remain visible.

The separate **Excel Model Showcase** page is a capability/evidence surface, not an eleventh finance truth set. It points recruiters to the downloadable workbook and explains the Excel skills demonstrated in it.

Validator: [scripts/validate_website_content_alignment.mjs](scripts/validate_website_content_alignment.mjs).

## Page 5 — source-driven costing & inventory

Page 5 no longer relies on a stale hard-coded inventory table. It is rebuilt from governed costing outputs:

- [standard-cost reconciliation](data/costing/standard_cost_reconciliation.csv)
- [cost-variance detail](data/costing/cost_variance_monthly.csv)
- [inventory reserve detail](data/costing/inventory_reserve_monthly.csv)

FY2025 controlled costing remains approximately:

- Standard COGS: **6.3582 VND bn**
- Modeled Actual COGS: **6.6076 VND bn**
- Unfavorable variance: **249.4 VND m**
- Material-price share: **82.0%**
- Monthly bridge: **12 / 12 PASS**

Dec-2025 detailed inventory now comes directly from source:

- Gross inventory: **3.266386 VND bn**
- Reserve: **~0.489958 VND bn**
- Net inventory: **~2.776428 VND bn**
- Source-flagged slow-moving SKUs: **SKU018, SKU034, SKU035**
- SKU034: approximately **91.8%** of gross detailed inventory

This detailed costing universe is **SIMULATED / DERIVED** and explicitly **not the core Page 2 COGS universe**.

Rebuild and validate:

```bash
node scripts/build_page5_costing_data.mjs
node scripts/validate_page5_costing.mjs
```

## Forecast evidence

The project includes a true **rolling-origin out-of-sample revenue backtest** over the 36-month simulated/derived history from 2023-01 to 2025-12. Each forecast is generated using only information available through its historical origin; target actuals are attached afterward for scoring.

Primary model: transparent 12-month seasonal-naive benchmark.

| Horizon | Eligible OOS forecasts | Bias | WAPE |
|---:|---:|---:|---:|
| 1M | 24 | +0.2510% | **1.1734%** |
| 3M | 22 | +0.1558% | **1.1554%** |
| 6M | 19 | +0.1125% | **1.1782%** |

It beats the linear-trend and 50/50 ensemble challengers on WAPE across all three governed horizons. Evidence class: **`SIMULATED_HISTORICAL_BACKTEST`**.

Approved recruiter-facing claim: **“Out-of-sample rolling-origin revenue backtest on simulated historical operating data.”** It is not evidence of live employer/company forecast accuracy.

See [forecast methodology](docs/FORECAST_ACCURACY_BACKTEST.md) and the [full backtest report](reports/ROLLING_ORIGIN_FORECAST_BACKTEST_2026-09-08.md).

## Finance architecture

```text
Controlled source extracts / synthetic generator
                    |
                    v
          Approved ledger + unit contract
                    |
                    v
       Finance metric registry + scenarios
          |              |              |
          v              v              v
      P&L / PVM      WC / liquidity   Forecast evidence
          |              |              |
          +-------> Decision modules <---+
                         |
                         v
          MBR / CFO memo / website
                         |
                         v
             Cross-artifact QA / gate
```

Architecture note: [docs/ARCHITECTURE_NON_POWERBI.md](docs/ARCHITECTURE_NON_POWERBI.md).

## Core finance model

### Management P&L and commercial profitability

The operating ledger is translated into gross sales, discounts, returns, net revenue, COGS, gross profit, channel fees, trade spend, contribution profit, controllable OPEX and explicitly labelled EBITDA proxies. Profitability is reviewed by channel, customer, SKU and promotion; revenue growth is not treated as economically good when contribution, promo ROI, cost-to-serve or cash consequences fail governed hurdles.

### Integrated three statements and close controls

The case links the operating model into a management income statement, balance sheet, indirect cash-flow statement, trial balance and subledger controls. Key checks include assets = liabilities + equity, cash-flow closing cash = balance-sheet cash, retained-earnings movement = PAT proxy, AR/inventory/AP/PP&E/debt subledger ties, debt roll-forward and PP&E roll-forward.

Methodology: [docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md](docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md).

### PVM, working capital and standard costing

- PVM separates price, volume, mix and trade-spend effects and reconciles them to the headline movement.
- DSO, DIO, DPO and CCC are translated into liquidity actions and management triggers.
- Standard costing decomposes COGS variance into material-price, usage/yield and conversion effects while disclosing the absence of real plant BOM/PO/production-hour evidence.

Costing methodology: [docs/FMCG_STANDARD_COSTING_AND_VARIANCE.md](docs/FMCG_STANDARD_COSTING_AND_VARIANCE.md).

## Management decision layer

The Monthly Business Review uses **decision → owner → value equation → guardrail → review date**. Examples include repricing low-contribution channels, redesigning low-ROI promotions, containing customer concentration, accelerating collections, reducing slow-moving inventory and rephasing CAPEX/discretionary spend when liquidity headroom is threatened.

See [reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md](reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md).

## Evidence boundary

- **SIMULATED / DERIVED** — VietNova operating ledger, management finance model, Page 5 detailed costing and scenario outputs.
- **SIMULATED_HISTORICAL_BACKTEST** — leakage-safe rolling-origin forecast performance on simulated history.
- **OBSERVED / CALCULATED_PUBLIC** — public-company filing-based analysis kept separate from VietNova operating facts.
- **SYNTHETIC_REHEARSAL** — standalone customer economics, valuation and other strategic rehearsals.
- **PENDING_EXTERNAL_INPUT** — claims requiring genuine external/internal evidence, especially live forecast accuracy.

The project does **not** claim statutory close ownership, live ERP access, realized employer savings or live forecast performance.

## QA and release governance

Current controlled evidence includes:

- [v1.1.1 final recruiter release](reports/FINAL_RECRUITER_RELEASE_V1.1.1_2026-09-08.md)
- [Page 5 costing validator](scripts/validate_page5_costing.mjs)
- [Website Page 1–10 validator](scripts/validate_website_content_alignment.mjs)
- [Rolling-origin forecast backtest](reports/ROLLING_ORIGIN_FORECAST_BACKTEST_2026-09-08.md)
- [True route / link QA](reports/RECRUITER_SITE_LINK_QA_FINAL.md)
- [Three-statement reconciliation](reports/THREE_STATEMENT_RECONCILIATION_2026-09-01.md)
- [FMCG standard-cost reconciliation](reports/FMCG_STANDARD_COSTING_RECONCILIATION_2026-09-01.md)

Full recruiter-release QA:

```bash
node scripts/run_final_recruiter_release_qa.mjs
```

## Core technical entrypoints

- Three-statement methodology: [docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md](docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md)
- Forecast methodology: [docs/FORECAST_ACCURACY_BACKTEST.md](docs/FORECAST_ACCURACY_BACKTEST.md)
- Page 5 builder: [scripts/build_page5_costing_data.mjs](scripts/build_page5_costing_data.mjs)
- Page 5 validator: [scripts/validate_page5_costing.mjs](scripts/validate_page5_costing.mjs)
- Website content validator: [scripts/validate_website_content_alignment.mjs](scripts/validate_website_content_alignment.mjs)
- Metric registry: [data/governance/finance_metric_registry.csv](data/governance/finance_metric_registry.csv)
- Unit contract: [schemas/unit_contract.csv](schemas/unit_contract.csv)
- Claim registry: [data/governance/claim_registry.csv](data/governance/claim_registry.csv)

## Historical material

Earlier build logs and immutable `fpa-portfolio-v1.0`, `fpa-portfolio-v1.0.1` and `fpa-portfolio-v1.1.0` releases remain versioned for traceability. They are historical artifacts, not the canonical current recruiter path.

For review, start with [RECRUITER_START_HERE.md](RECRUITER_START_HERE.md).
