# Finance Analyst KPI Dictionary and Control Contract

Date: 2026-08-30  
Scope: VietNova commercial-finance / FP&A case, with MCH public-company and strategic-finance extensions.

## How to use this dictionary

Every KPI must have five attributes before it appears in a management pack:

1. A finance definition that is stable across periods.
2. A declared numerator, denominator and data grain.
3. A source layer and evidence class.
4. A reconciliation or reasonableness control.
5. A management decision, owner and guardrail.

The dictionary deliberately separates reported facts, calculated ratios, synthetic management outputs, proxy metrics and assumptions.

## 1. P&L and planning KPIs

| KPI | Definition / formula | Grain | Source layer | Evidence class | Control | Management use |
|---|---|---|---|---|---|---|
| Net revenue | Gross invoice value − discounts − returns − tax | Invoice line × month | Sales fact + commercial cost | SIMULATED | Tie to P&L and negative-revenue check | Revenue plan and growth bridge |
| Gross profit | Net revenue − COGS | SKU × channel × month | Sales fact + COGS | CALCULATED | Sum to P&L within tolerance | Price, mix and sourcing decisions |
| Gross margin % | Gross profit / net revenue | Month / channel / SKU | Gross-profit output | CALCULATED | 0–100% range and denominator check | Margin quality |
| Operating profit | Gross profit − operating expenses | Month | P&L model | CALCULATED | P&L subtotal tie-out | Cost discipline |
| EBITDA proxy | Operating profit + proxy depreciation/adjustments | Month / scenario | Management model | PROXY_DERIVED | Never label as reported EBITDA | Scenario comparison only |
| Budget variance | Actual − approved budget | Metric × month × version | Actuals + locked budget | DERIVED | Version and period lock | Close commentary |
| Forecast variance | Actual − frozen forecast | Metric × month × forecast version | Actuals + FROZEN snapshot | DERIVED | Leakage and timestamp test | Forecast learning |
| Revenue CAGR | (Ending revenue / beginning revenue)^(1/years) − 1 | Company × fiscal period | Approved public panel | OBSERVED_DERIVED | Basis/perimeter flag | Long-run context |

## 2. Commercial profitability KPIs

| KPI | Definition / formula | Grain | Source layer | Evidence class | Control | Management use |
|---|---|---|---|---|---|---|
| Contribution profit | Net revenue − COGS − channel fees − trade spend − variable fulfilment | SKU × channel × customer × month | Commercial cost facts | CALCULATED | Channel sum to total | Fund growth that pays back |
| Contribution margin % | Contribution profit / net revenue | SKU / channel / customer | Profitability output | CALCULATED | Compare with 25% hurdle | Protect profitable growth |
| Price realization | Net revenue / units sold | SKU × channel × month | Invoice fact | CALCULATED | ASP outlier review | Repricing and discount control |
| Volume growth | Current units / prior units − 1 | SKU × channel × month | Invoice fact | CALCULATED | Prior-period availability | Demand diagnosis |
| Mix contribution | Residual effect of share shift after price and volume | SKU × channel × month | PVM bridge | DERIVED | PVM residual reconciliation | Portfolio mix decisions |
| Promotion ROI | Incremental contribution profit / trade spend | Promotion event | Promotion table + profitability | CALCULATED | Spend included; hurdle ≥25% | Stop / scale campaigns |
| Break-even price | Price where contribution profit reaches hurdle | SKU × channel | Pricing simulator | DERIVED | Variable cost and fee sensitivity | Price-floor decisions |
| Customer concentration | Top-N customer revenue / total revenue | Month / quarter | Customer profitability | CALCULATED | Top-3 share change trigger | Concentration risk |

## 3. Working capital and liquidity KPIs

| KPI | Definition / formula | Grain | Source layer | Evidence class | Control | Management use |
|---|---|---|---|---|---|---|
| DSO | Average AR / net credit sales × days | Month | AR + sales | CALCULATED | Denominator and aging tie-out | Collections target |
| DIO | Average inventory / COGS × days | Month | Inventory + COGS | CALCULATED | Inventory-to-ledger tie-out | Stock and cash release |
| DPO | Average AP / purchases proxy × days | Month | AP + purchases | CALCULATED | Supplier balance tie-out | Payment-term decisions |
| CCC | DSO + DIO − DPO | Month | WC outputs | CALCULATED | Component arithmetic check | Cash conversion |
| Cash release | Days improvement × approved daily sales/COGS denominator | Action × month | WC bridge | DERIVED | Denominator explicitly approved | Quantify action value |
| Liquidity headroom | Available cash + undrawn facility − minimum buffer | Week / month | Cash and debt schedule | DERIVED | Debt terms and buffer approved | Escalation trigger |
| CFO/PAT | Cash flow from operations / profit after tax | Fiscal year | Public audited statement | OBSERVED_DERIVED | Statement-period tie-out | Earnings quality / credit |

## 4. Forecast, control and evidence KPIs

| KPI | Definition / formula | Grain | Source layer | Evidence class | Control | Management use |
|---|---|---|---|---|---|---|
| Forecast bias | Sum(forecast − actual) / sum(actual) | Metric × horizon | FROZEN snapshots | DERIVED | Future-leakage exclusion | Systematic over/under-forecast |
| WAPE | Sum(abs(forecast − actual)) / sum(abs(actual)) | Metric × horizon | FROZEN snapshots | DERIVED | Eligible-row count | Accuracy magnitude |
| Snapshot eligibility rate | Eligible frozen rows / submitted rows | Forecast batch | Governance schema | DERIVED | Status, dates, approver | Forecast process health |
| Reconciliation coverage | Validated output lines / total output lines | Close batch | QA logs | DERIVED | No silent exclusions | Close confidence |
| Evidence coverage | Rows with source URL, page/period and evidence class / total rows | Dataset | Source registry | DERIVED | Missing lineage flag | Auditability |
| Basis-break rate | Rows marked basis/perimeter break / comparable rows | Peer panel | Peer bridge | DERIVED | Cross-period comparability | Prevent false ranking |

## 5. Credit and strategic-finance KPIs

| KPI | Definition / formula | Grain | Source layer | Evidence class | Control | Management use |
|---|---|---|---|---|---|---|
| Equity ratio | Total equity / total assets | Fiscal year | Audited statements | OBSERVED_DERIVED | Balance-sheet check | Solvency |
| Debt / equity proxy | Interest-bearing debt / equity | Fiscal year | Audited statements or approved schedule | OBSERVED_DERIVED | Debt perimeter declared | Leverage screen |
| Interest coverage | EBIT / cash interest | Fiscal year | Approved debt and P&L schedules | DERIVED | Interest schedule required | Credit capacity |
| Entry EBITDA multiple | Purchase enterprise value / target EBITDA | Deal case | M&A assumptions | SYNTHETIC_DERIVED | EV bridge and units check | Acquisition valuation |
| EPS accretion / dilution | Pro forma EPS / standalone EPS − 1 | Deal case × year | M&A model | SYNTHETIC_DERIVED | Shares, synergies and interest | Capital-allocation decision |
| Deal NPV | Present value of incremental cash flows − purchase price | Deal case | M&A model | SYNTHETIC_DERIVED | Discount rate and terminal logic | Go / no-go screen |

## 6. Evidence and release rules

- A ratio without a denominator definition is not release-ready.
- A public-company metric with a basis break is context-only until the bridge is complete.
- A synthetic or proxy number may support method demonstration, not a claim about a real company.
- A forecast metric requires a frozen snapshot created before actual availability.
- A credit conclusion requires debt, interest and maturity evidence; equity ratio alone is insufficient.
- A valuation conclusion requires target perimeter, financing, purchase accounting and sensitivity evidence.
- Every released KPI must be traceable to a source artifact and a validator or reviewer sign-off.

## 7. Reviewer checklist

- Can the reviewer reproduce the numerator and denominator?
- Is the grain correct for the decision?
- Is the period and version locked?
- Is the evidence class visible?
- Does the KPI reconcile to a higher-level total?
- Is there a threshold, owner and next action?
- Are missing fields blank rather than silently imputed?

This dictionary is the semantic contract behind the FP&A model, MBR pack, peer panel, credit memo and M&A case.
