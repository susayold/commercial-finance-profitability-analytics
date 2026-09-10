# Commercial Finance & FP&A Portfolio

Recruiter-ready Commercial Finance / Financial Planning & Analysis (FP&A) case built around a fictional Vietnam FMCG company, **VietNova Consumer JSC**.

The project demonstrates how a Finance Analyst can move from controlled operating data to reconciled financial outputs, explain performance drivers, test forecast/scenario assumptions, convert findings into management decisions, and preserve an auditable evidence boundary.

## Recruiter start

- Current controlled release: **`VNFINANCE-FPA-v1.1.1`** · tag **`fpa-portfolio-v1.1.1`**
- [Recruiter start-here guide](RECRUITER_START_HERE.md)
- [GitHub Pages](https://susayold.github.io/commercial-finance-profitability-analytics/)
- [Executive Dashboard](https://susayold.github.io/commercial-finance-profitability-analytics/dashboard/)
- [Excel FP&A Model Showcase](https://susayold.github.io/commercial-finance-profitability-analytics/excel/)
- [Downloadable recruiter Excel workbook](site/public/downloads/VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx)
- [Private recruiter portfolio](https://vn-finance-fpa-case.sangkenny200.chatgpt.site/) — **version 52**
- [One-page FP&A case summary PDF](output/pdf/VNFINANCE_FPA_CASE_SUMMARY_ONE_PAGE.pdf)
- [Monthly Business Review / CFO operating pack](reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md)
- [Rolling-origin forecast backtest](reports/ROLLING_ORIGIN_FORECAST_BACKTEST_2026-09-08.md)
- [v1.1.1 final recruiter release](reports/FINAL_RECRUITER_RELEASE_V1.1.1_2026-09-08.md)

## Business question

**Which growth, margin and working-capital drivers should management act on next month?**

The case demonstrates three core finance decisions:

1. Reconcile invoice-level operating data to a management P&L and explain plan/performance movement.
2. Rank channel, customer, SKU and promotion economics after COGS, fees, trade spend and other commercial costs.
3. Translate working-capital, forecast and scenario evidence into actions with owners, value equations, guardrails and review dates.

## Excel proof of skill

The public recruiter site now includes a dedicated **Excel Model** page and downloadable workbook. The workbook is intentionally structured like a reviewable finance deliverable rather than a one-tab exercise: **12 sheets** separating assumptions, actuals, P&L variance, commercial analysis, working capital, scenarios, forecast accuracy, costing, controls, recruiter skills summary and change history.

It demonstrates formula-driven analysis and spreadsheet controls including `SUM`, `IF`, `IFERROR`, `SUMIFS`, `INDEX/MATCH`, cross-sheet links, data validation, conditional formatting, charts, finance-style input/formula conventions, reconciliation checks and explicit model versioning.

The recruiter workbook uses controlled simulated / derived project data. Historical forecast performance remains labelled **`SIMULATED_HISTORICAL_BACKTEST`** and live forecast accuracy remains Gate A **OPEN by design**.

## Current controlled status

| Area | Status | Meaning |
|---|---|---|
| Finance truth | **DONE** | Core finance model and reconciliations are controlled |
| Commercial / profitability | **DONE** | Channel, customer, SKU and promotion economics are decision-linked |
| Three statements / close controls | **DONE** | P&L, balance sheet, cash flow, subledgers and roll-forwards reconcile |
| Historical forecast backtest | **PASS** | Leakage-safe rolling-origin OOS evidence on simulated history |
| Website Pages 1–10 | **PASS** | Every page is checked against its governed finance module and evidence boundary |
| Excel recruiter showcase | **PASS** | Downloadable 12-sheet workbook and public `/excel/` recruiter page |
| Finance core CI | **GREEN** | Automated recruiter-release QA passes |
| GitHub Pages | **GREEN** | Production site build is validated before release |
| Gate A — live forecast accuracy | **OPEN BY DESIGN** | Genuine pre-close frozen forecast + post-close actual still required |
| Page 6 OPEX bridge | **OPEN BY DESIGN** | Open reconciliation is disclosed rather than hidden |
| Power BI | **OUT OF ACTIVE SCOPE** | Historical BI artifacts are archived and not part of this release |

Canonical release identity: [data/governance/release_identity_nonbi.json](data/governance/release_identity_nonbi.json).  
Canonical project status: [data/governance/project_status_nonbi.json](data/governance/project_status_nonbi.json).

The release contract records a **tested source freeze, stable metadata anchor and immutable release tag**. It intentionally does not try to store the moving live `main` SHA inside its own committed metadata.

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

## Forecast evidence — what is proven

The project includes a true **rolling-origin out-of-sample revenue backtest** over the 36-month simulated/derived history from 2023-01 to 2025-12. Each forecast is generated using only information available through its historical origin; target actuals are attached afterward for scoring.

The pre-specified primary model is a transparent 12-month seasonal-naive benchmark:

| Horizon | Eligible OOS forecasts | Bias | WAPE |
|---:|---:|---:|---:|
| 1M | 24 | +0.2510% | **1.1734%** |
| 3M | 22 | +0.1558% | **1.1554%** |
| 6M | 19 | +0.1125% | **1.1782%** |

It beats both a 12-month linear-trend challenger and a 50/50 ensemble on WAPE across all three horizons. The evidence class is **`SIMULATED_HISTORICAL_BACKTEST`**.

This supports the recruiter-facing claim: **“Out-of-sample rolling-origin revenue backtest on simulated historical operating data.”** It does **not** support a claim of live company/employer forecast accuracy. The low WAPE reflects stable recurring seasonality in the synthetic history and should not be generalized to real-world FMCG performance.

See [Forecast Accuracy Backtest methodology](docs/FORECAST_ACCURACY_BACKTEST.md) and the [full rolling-origin report](reports/ROLLING_ORIGIN_FORECAST_BACKTEST_2026-09-08.md).

## Website content contract

The recruiter website is not an independent storytelling layer. Pages 1–10 are checked against the same governed finance contracts used by the repository. The Excel showcase is an additional recruiter-proof route and does not redefine the core finance truth.

The v1.1.1 audit specifically enforces:

- Page 1: Historical OOS `PASS` is separate from live Gate A `OPEN`.
- Page 2: simulated monthly actual-ledger comparators remain separate from the canonical FY2025 Base scenario.
- Page 3: Modern Trade, Marketplace and D2C are the three channels below the 25% contribution-margin hurdle; Wholesale clears it.
- Page 4: customer profitability remains an explicitly standalone synthetic economics rehearsal.
- Page 5: no real plant BOM / PO / production-hour evidence is implied.
- Page 6: 15.9% non-payroll OPEX mix is distinct from the 75.6% non-payroll share of the Q4-vs-Q1 increase.
- Page 7: cash and working-capital evidence is labelled simulated/derived plus stress rehearsal.
- Page 8: rolling-origin OOS results are the primary historical accuracy evidence; long-range cash remains withheld and the 8.0bn level remains a planning guardrail.
- Page 9: `SIMULATED_HISTORICAL_BACKTEST` is visible; Historical OOS `PASS` and live Gate A `OPEN` are separate; Power BI is not an active visible control.
- Page 10: the dashboard consumes owner-page contracts, including Historical OOS `PASS` and Live Gate A `OPEN`.
- Excel showcase: the public `/excel/` route exposes a reviewable 12-sheet `.xlsx` workbook, formula/skill map, modelling standards and evidence boundary for recruiter inspection.

Validators: [scripts/validate_website_content_alignment.mjs](scripts/validate_website_content_alignment.mjs) and [scripts/validate_excel_recruiter_showcase.mjs](scripts/validate_excel_recruiter_showcase.mjs).

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
          MBR / CFO memo / website / Excel proof
                         |
                         v
             Cross-artifact QA / gate
```

Architecture note: [docs/ARCHITECTURE_NON_POWERBI.md](docs/ARCHITECTURE_NON_POWERBI.md).

## Core finance model

### Management P&L and commercial profitability

The operating ledger is translated into gross sales, discounts, returns, net revenue, COGS, gross profit, channel fees, trade spend, contribution profit, controllable OPEX and explicitly labelled EBITDA proxies. Profitability is reviewed by channel, customer, SKU and promotion; revenue growth is not treated as economically good when contribution, promo ROI, cost-to-serve or cash consequences fail the governed hurdles.

GL bridge: [docs/GL_TO_MANAGEMENT_PNL_BRIDGE.md](docs/GL_TO_MANAGEMENT_PNL_BRIDGE.md).

### Integrated three statements and close controls

The case links the operating model into a management income statement, balance sheet, indirect cash-flow statement, trial balance and subledger controls. Key checks include assets = liabilities + equity, cash-flow closing cash = balance-sheet cash, retained-earnings movement = PAT proxy, AR/inventory/AP/PP&E/debt subledger ties, debt roll-forward and PP&E roll-forward.

Methodology: [docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md](docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md).

### Price–Volume–Mix, working capital and standard costing

- PVM separates price, volume, mix and trade-spend effects and reconciles them to the headline movement.
- DSO, DIO, DPO and CCC are translated into liquidity actions, cash-release equations and management triggers.
- FMCG standard costing decomposes COGS variance into material-price, usage/yield and conversion effects while explicitly disclosing the absence of real plant BOM/PO/production-hour evidence.

Costing methodology: [docs/FMCG_STANDARD_COSTING_AND_VARIANCE.md](docs/FMCG_STANDARD_COSTING_AND_VARIANCE.md).

## Management decision layer

The Monthly Business Review uses **decision → owner → value equation → guardrail → review date**. Examples include repricing low-contribution channels, redesigning low-ROI promotions, containing customer concentration, accelerating collections, reducing slow-moving inventory and rephasing CAPEX/discretionary spend when liquidity headroom is threatened.

See [reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md](reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md).

## Evidence boundary

The repository separates evidence classes instead of blending them:

- **SIMULATED / DERIVED** — VietNova operating ledger, management finance model and scenario outputs;
- **SIMULATED_HISTORICAL_BACKTEST** — leakage-safe rolling-origin forecast performance on simulated history;
- **OBSERVED / CALCULATED_PUBLIC** — public-company filing-based analysis kept separate from VietNova actuals;
- **SYNTHETIC_REHEARSAL** — valuation, M&A and Monte Carlo appendices;
- **PENDING_EXTERNAL_INPUT** — claims requiring genuine external/internal evidence, especially live forecast accuracy.

The project does **not** claim statutory close ownership, live ERP access, realized employer savings or live forecast performance.

## QA and release governance

Current controlled evidence includes:

- [v1.1.1 final recruiter release](reports/FINAL_RECRUITER_RELEASE_V1.1.1_2026-09-08.md)
- [Rolling-origin forecast backtest](reports/ROLLING_ORIGIN_FORECAST_BACKTEST_2026-09-08.md)
- [Rolling-origin summary JSON](data/forecast/rolling_origin_revenue_backtest_summary.json)
- [Website Page 1–10 content validator](scripts/validate_website_content_alignment.mjs)
- [Excel recruiter showcase validator](scripts/validate_excel_recruiter_showcase.mjs)
- [True route / link QA](reports/RECRUITER_SITE_LINK_QA_FINAL.md)
- [Three-statement reconciliation](reports/THREE_STATEMENT_RECONCILIATION_2026-09-01.md)
- [FMCG standard-cost reconciliation](reports/FMCG_STANDARD_COSTING_RECONCILIATION_2026-09-01.md)

Validate Excel recruiter proof:

```bash
node scripts/validate_excel_recruiter_showcase.mjs
```

Rebuild forecast evidence:

```bash
node scripts/build_rolling_origin_revenue_backtest.mjs
node scripts/validate_rolling_origin_revenue_backtest.mjs
```

Validate website content alignment:

```bash
node scripts/validate_website_content_alignment.mjs
```

Finance recruiter-release QA:

```bash
node scripts/run_final_recruiter_release_qa.mjs
```

## Core technical entrypoints

- Finance architecture: [docs/ARCHITECTURE_NON_POWERBI.md](docs/ARCHITECTURE_NON_POWERBI.md)
- Three-statement methodology: [docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md](docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md)
- Forecast methodology: [docs/FORECAST_ACCURACY_BACKTEST.md](docs/FORECAST_ACCURACY_BACKTEST.md)
- Rolling-origin builder: [scripts/build_rolling_origin_revenue_backtest.mjs](scripts/build_rolling_origin_revenue_backtest.mjs)
- Website content validator: [scripts/validate_website_content_alignment.mjs](scripts/validate_website_content_alignment.mjs)
- Excel showcase validator: [scripts/validate_excel_recruiter_showcase.mjs](scripts/validate_excel_recruiter_showcase.mjs)
- Standard costing: [docs/FMCG_STANDARD_COSTING_AND_VARIANCE.md](docs/FMCG_STANDARD_COSTING_AND_VARIANCE.md)
- UAT/change control: [docs/UAT_AND_MODEL_CHANGE_CONTROL.md](docs/UAT_AND_MODEL_CHANGE_CONTROL.md)
- Metric registry: [data/governance/finance_metric_registry.csv](data/governance/finance_metric_registry.csv)
- Unit contract: [schemas/unit_contract.csv](schemas/unit_contract.csv)
- Claim registry: [data/governance/claim_registry.csv](data/governance/claim_registry.csv)

## Historical material

Earlier build logs, immutable `fpa-portfolio-v1.0`, `fpa-portfolio-v1.0.1` and `fpa-portfolio-v1.1.0` releases, Power BI experiments and implementation notes remain versioned for traceability. They are historical artifacts, not the canonical current recruiter path.

For review, start with [RECRUITER_START_HERE.md](RECRUITER_START_HERE.md).
