# VietNova hidden-truth generator specification

## Purpose

VietNova is a synthetic case company for demonstrating commercial-finance judgment without inventing real-company facts. The generator creates Jan-2023 to Dec-2025 operating data: daily order-line detail plus monthly working-capital, budget, forecast, debt and marketing snapshots.

The case is designed around Finance Analyst / Business Finance Analyst decisions: explain revenue and contribution-margin variance; separate price, volume, mix, discount, COGS and channel effects; identify trade-spend leakage and promotion ROI; reconcile inventory, receivables, payables and cash conversion; compare budget/latest estimate/actual; produce an auditable forecast bridge; and document controls and limitations.

## Reproducibility contract

- Seed: 20260829.
- Calendar: 2023-01-01 through 2025-12-31 inclusive.
- Currency: VND. Monetary values are integer VND unless a view divides by million/billion.
- Event calendar and parameter dictionary are versioned. No hidden random seed or manual post-processing.
- Dataset version: v1.0.0. The README must state that the company and all transactions are fictional.
- A rerun passes only when row counts, event flags and aggregate control totals match the manifest.

## Operating model

- 36 SKUs across Dairy, Beverages, Condiments and Convenience Foods.
- 5 channels: Modern Trade, General Trade, E-commerce, Convenience and Food Service.
- 3 regions: North, Central and South.
- 24 customers (8 modern-trade accounts, 8 distributors, 5 e-commerce accounts, 3 food-service accounts).
- 4 suppliers and 2 warehouses.
- Sales = price x units less discount and returns. Contribution margin deducts COGS, freight, payment fees, commission and commercial spend.
- Actuals, budget and forecast are separate tables. Budget is never overwritten by actuals.

## Hidden-truth events

| ID | Period | Event | Intended signal | Finance response |
|---|---|---|---|---|
| E01 | 2023-04 | Modern-trade listing wins +10% distribution points for two hero SKUs | Volume and trade-spend rise; net margin initially flat | Quantify incremental gross profit versus listing fee |
| E02 | 2023-08 | Dairy input-cost shock +12% | COGS rate expands; gross margin compresses | Price-pack / mix / supplier action |
| E03 | 2024-01 | E-commerce platform fee rises +2.5pp | Channel contribution drops despite stable demand | Reallocate channel investment |
| E04 | 2024-05 | Forecast optimism: plan +18% above achievable baseline | Forecast bias and inventory build | Reset forecast and receipts |
| E05 | 2024-09 | Low-margin promotion: +30% units but +22% discount | Revenue rises while contribution dilutes | Stop or reshape promotion |
| E06 | 2025-02 | Two distributor accounts stretch +25 days | DSO and overdue AR rise; OCF lags EBITDA | Credit limits and collections |
| E07 | 2025-04 | Warehouse disruption causes a 7-day stockout | Lost sales, expedite freight, fill-rate decline | Estimate lost margin and service response |
| E08 | 2025-06 | Trade-spend accrual under-recorded by 20% for one channel | Reported margin overstates true margin | Accrual true-up and control fix |
| E09 | 2025-08 | FX-linked packaging cost +8% for beverage SKUs | Margin pressure without unit change | Hedge or renegotiate supplier |
| E10 | 2025-10 | Working-capital release campaign | DSO/DIO/DPO and cash conversion improve | Quantify cash unlocked and sustainability |

## Validation equations

The QA notebook/script must test at minimum:

- net_sales = gross_sales - discount - returns
- contribution_margin = net_sales - cogs - freight - payment_fee - commission - trade_spend - listing_fee - rebate - writeoff
- closing_inventory = opening_inventory + receipts - sales - expiry_writeoff
- closing_ar = opening_ar + invoiced - cash_collected - credit_note
- closing_ap = opening_ap + purchases - cash_paid
- closing_debt = opening_balance + drawdown - repayment
- DSO = closing_ar / trailing_12m_net_sales x 365
- DIO = closing_inventory / trailing_12m_cogs x 365
- DPO = closing_ap / trailing_12m_cogs x 365
- CCC = DSO + DIO - DPO
- promotion_roi = incremental_contribution / promo_spend, with explicit baseline methodology
- ROAS = attributed_net_sales / spend

## Expected analytical outputs

1. Executive bridge: Revenue -> Gross Profit -> Contribution Profit -> EBITDA proxy -> Operating Cash Flow proxy.
2. Driver tree by price, volume, mix, discount, COGS, freight, channel fee, trade spend and working capital.
3. Monthly actual-vs-budget-vs-forecast with forecast-bias diagnostics.
4. Channel/SKU/customer profitability with waterfall and Pareto views.
5. Promotion scorecard with incremental lift, margin dilution, ROI and post-promo decay.
6. Working-capital cockpit with DSO/DIO/DPO/CCC and cash-release actions.
7. Controls page with data dictionary, reconciliation checks, source/assumption tags and known limitations.
