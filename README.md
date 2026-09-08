# Commercial Finance & FP&A Portfolio

Recruiter-ready Commercial Finance / Financial Planning & Analysis (FP&A) case built around a fictional Vietnam FMCG company, **VietNova Consumer JSC**.

The project demonstrates how a Finance Analyst can move from controlled operating data to reconciled financial outputs, explain performance drivers, convert them into management decisions, and preserve an auditable evidence boundary.

## Recruiter start

- [GitHub Pages](https://susayold.github.io/commercial-finance-profitability-analytics/)
- [Executive Dashboard](https://susayold.github.io/commercial-finance-profitability-analytics/dashboard/)
- [Private recruiter portfolio](https://vn-finance-fpa-case.sangkenny200.chatgpt.site/) — **version 52**
- [Recruiter start-here guide](RECRUITER_START_HERE.md)
- [One-page FP&A case summary PDF](output/pdf/VNFINANCE_FPA_CASE_SUMMARY_ONE_PAGE.pdf)
- [Monthly Business Review / CFO operating pack](reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md)

## Business question

**Which growth, margin and working-capital drivers should management act on next month?**

The case demonstrates three core finance decisions:

1. Reconcile invoice-level operating data to a management P&L and explain plan/performance movement.
2. Rank channel, customer, SKU and promotion economics after COGS, fees, trade spend and other commercial costs.
3. Translate working-capital and scenario stress into actions with owners, value equations, guardrails and review dates.

## Current controlled status

| Area | Status | Meaning |
|---|---|---|
| Finance truth | **DONE** | Core finance model and reconciliations are controlled |
| 10-page recruiter site | **DONE** | Page semantics and cross-page logic are aligned |
| CAPEX semantics | **DONE** | P-006 project budget is separated from the portfolio CAPEX envelope |
| Commercial semantics | **DONE** | Negative contribution, below-ROI and below-CM cases are distinct |
| Finance core CI | **GREEN** | Core automated finance checks pass on the controlled release path |
| GitHub Pages | **GREEN** | Static recruiter site is deployed from the governed site source |
| Gate A | **OPEN BY DESIGN** | Genuine forecast-accuracy claims require approved pre-close forecast + post-close actuals |
| Page 6 OPEX bridge | **OPEN BY DESIGN** | Open reconciliation is disclosed rather than hidden |
| Power BI | **OUT OF ACTIVE SCOPE** | Historical BI artifacts are archived; they are not part of the active recruiter release |

Canonical release identity is governed in [data/governance/release_identity_nonbi.json](data/governance/release_identity_nonbi.json). The release contract records the **release source freeze, metadata commit and immutable release tag**; it intentionally does **not** mirror the moving live `main` HEAD into committed metadata.

Canonical project status: [data/governance/project_status_nonbi.json](data/governance/project_status_nonbi.json).

## FY2025 controlled scenario snapshot

| KPI | Base | Upside | Downside |
|---|---:|---:|---:|
| Revenue | 82.5138 VND bn | 85.7182 VND bn | 76.9061 VND bn |
| Gross profit | 26.9150 VND bn | 31.1886 VND bn | 18.6342 VND bn |
| EBITDA proxy | 12.8956 VND bn | 17.4496 VND bn | 3.4933 VND bn |
| EBITDA proxy margin | 15.6284% | 20.3570% | 4.5423% |
| Contribution | 24.2074 VND bn | 28.4810 VND bn | 15.8724 VND bn |
| Cash conversion cycle | 54 days | 48 days | 68 days |

These are **PROXY_DERIVED** outputs from the controlled VietNova case. They are not reported results of a real company.

Machine-readable recruiter snapshot: [data/governance/recruiter_metric_snapshot.json](data/governance/recruiter_metric_snapshot.json).

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
      P&L / PVM      WC / liquidity   Public-company panel
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

### Management P&L and profitability

The operating ledger is translated into management finance views including:

- gross sales, discounts, returns and net revenue;
- COGS and gross profit;
- channel fees, trade spend and commercial variable costs;
- contribution profit;
- controllable OPEX and explicitly labelled EBITDA proxies;
- channel, customer, SKU and promotion profitability.

A revenue-positive result is not automatically treated as economically good: contribution margin, promotion ROI, cost-to-serve and cash consequences remain visible.

### Integrated three statements and close controls

The case links the operating model into a reviewable income statement, balance sheet, indirect cash-flow statement, trial balance and subledger controls.

Key controls include:

- total assets = liabilities + equity;
- cash-flow closing cash = balance-sheet cash;
- retained-earnings movement = PAT proxy;
- AR, inventory, AP, PP&E and debt subledgers tie to control balances;
- opening debt + drawdown − repayment = closing debt;
- opening PP&E + CAPEX − depreciation = closing PP&E.

Methodology: [docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md](docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md).

### Price–Volume–Mix (PVM)

The operating bridge separates price, volume, mix and trade-spend effects and requires the components to reconcile to the headline movement within the governed tolerance.

### Working capital and liquidity

The case uses DSO, DIO, DPO and cash conversion cycle to connect operating performance to liquidity. Scenario outputs are translated into cash actions and explicit management triggers rather than displayed as descriptive KPIs only.

### Standard costing

The FMCG costing rehearsal decomposes COGS variance into material-price, usage/yield and conversion effects, with explicit disclosure that plant BOM, purchase-order prices and production-hour evidence are not present in the synthetic source.

Methodology: [docs/FMCG_STANDARD_COSTING_AND_VARIANCE.md](docs/FMCG_STANDARD_COSTING_AND_VARIANCE.md).

## Management decision layer

The Monthly Business Review is designed around **decision → owner → value equation → guardrail → review date**.

Examples include:

- contribution margin below the governed hurdle → pricing / discount / trade-term review;
- promotion ROI below hurdle → stop or redesign the next wave;
- customer concentration deterioration → account and payment-term review;
- DSO deterioration → collections / credit containment;
- DIO deterioration → slow-SKU replenishment and inventory action;
- liquidity headroom breach → CAPEX and discretionary-spend rephasing.

See [reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md](reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md).

## Forecast governance

Forecast accuracy is intentionally input-gated.

Bias / WAPE may be promoted only when the evidence contains an approved **FROZEN pre-close forecast snapshot**, a valid as-of date and post-close actuals. Draft or hindsight-adjusted forecasts are not relabelled as live forecast accuracy.

Gate A remains **OPEN / PENDING_EXTERNAL_INPUT** by design.

See [docs/FORECAST_ACCURACY_BACKTEST.md](docs/FORECAST_ACCURACY_BACKTEST.md).

## Evidence boundary

The repository separates evidence classes instead of blending them:

- **SIMULATED / DERIVED** — VietNova operating ledger, management finance model and scenario outputs;
- **OBSERVED / CALCULATED_PUBLIC** — public-company filing-based analysis kept in a separate subject area;
- **SYNTHETIC_REHEARSAL** — valuation, M&A and Monte Carlo appendices;
- **PENDING_EXTERNAL_INPUT** — claims that require genuine internal evidence, especially live forecast accuracy.

The project does **not** claim statutory close ownership, live ERP access, realized employer savings or live forecast performance.

## QA and release governance

Controlled release evidence includes:

- [Final recruiter release report](reports/FINAL_RECRUITER_RELEASE_2026-09-05.md)
- [True route / link QA](reports/RECRUITER_SITE_LINK_QA_FINAL.md)
- [Release identity QA](reports/RELEASE_IDENTITY_NONBI_QA_2026-09-03.json)
- [Non-Power-BI final QA](reports/NON_POWERBI_FINAL_QA_2026-09-01.md)
- [Three-statement reconciliation](reports/THREE_STATEMENT_RECONCILIATION_2026-09-01.md)
- [FMCG standard-cost reconciliation](reports/FMCG_STANDARD_COSTING_RECONCILIATION_2026-09-01.md)

Release identity validator:

```bash
node scripts/validate_release_identity_nonbi.mjs
```

Finance QA entrypoint:

```bash
node scripts/run_finance_qa.mjs --nonbi
```

## Core technical entrypoints

- Finance architecture: [docs/ARCHITECTURE_NON_POWERBI.md](docs/ARCHITECTURE_NON_POWERBI.md)
- Three-statement methodology: [docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md](docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md)
- Standard costing: [docs/FMCG_STANDARD_COSTING_AND_VARIANCE.md](docs/FMCG_STANDARD_COSTING_AND_VARIANCE.md)
- GL-to-management P&L bridge: [docs/GL_TO_MANAGEMENT_PNL_BRIDGE.md](docs/GL_TO_MANAGEMENT_PNL_BRIDGE.md)
- UAT and model change control: [docs/UAT_AND_MODEL_CHANGE_CONTROL.md](docs/UAT_AND_MODEL_CHANGE_CONTROL.md)
- Metric registry: [data/governance/finance_metric_registry.csv](data/governance/finance_metric_registry.csv)
- Unit contract: [schemas/unit_contract.csv](schemas/unit_contract.csv)
- Scenario source: [data/scenarios/scenario_summary.csv](data/scenarios/scenario_summary.csv)
- Claim registry: [data/governance/claim_registry.csv](data/governance/claim_registry.csv)

## Historical material

Earlier build logs, Power BI experiments, site-version records and implementation notes remain versioned under `reports/`, `docs/` and Git history for traceability. They are **historical artifacts**, not the canonical current-state recruiter path.

For review, start with [RECRUITER_START_HERE.md](RECRUITER_START_HERE.md) and the current website rather than historical progress logs.
