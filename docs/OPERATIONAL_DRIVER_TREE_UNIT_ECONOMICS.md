# Operational Driver Tree and Unit Economics Contract

Date: 2026-08-30  
Evidence class: SIMULATED / DERIVED unless explicitly marked otherwise.

## Purpose

A Finance Analyst should be able to walk from an operational event to a financial outcome without jumping straight to a headline margin. This tree defines the chain, the required grain, the owner and the decision rule.

## 1. Revenue driver tree

\`\`\`
Net Revenue
= Active customers × Orders per customer × Units per order × Net ASP
\`\`\`

For wholesale and General Trade, replace the customer-order branch with:

\`\`\`
Net Revenue
= Active outlets × Units per outlet × Net ASP
\`\`\`

| Node | Formula | Grain | Owner | Control | Decision |
|---|---|---|---|---|---|
| Active customers / outlets | Count with at least one invoice in period | Month × channel | Sales finance | Deduplicate IDs | Coverage and distribution |
| Orders / units | Invoice quantity or order count | Month × SKU × channel | Commercial finance | Quantity non-negative | Volume plan |
| Gross ASP | Gross sales / units | Month × SKU | Revenue manager | ASP outlier review | List price |
| Net ASP | Net revenue / units | Month × SKU × channel | Revenue manager | Gross-to-net bridge | Discount/price floor |
| Channel mix | Channel net revenue / total | Month | Commercial finance | Sum to 100% | Mix shift |
| Price realization | Current net ASP / prior net ASP − 1 | SKU × channel | FP&A | Prior-period availability | Price effect |

## 2. Gross-to-net waterfall

\`\`\`
Gross Sales
− Invoice Discounts
− Returns
− Rebates
= Net Revenue
\`\`\`

The bridge must be shown separately from COGS. A discount is not a volume driver, and a rebate should not disappear in an allocated overhead line.

| Driver | Required evidence | Diagnostic question |
|---|---|---|
| Invoice discount | Invoice-level discount reason and approval | Is the discount incremental or habitual? |
| Return | Return code, units and condition | Is the return rate concentrated by SKU/customer? |
| Rebate | Contract, accrual and settlement | Is the rebate earned by profitable volume? |
| Net ASP | Waterfall output | Did value growth survive gross-to-net leakage? |

## 3. Contribution-profit tree

\`\`\`
Contribution Profit
= Net Revenue
− COGS
− Channel Fees
− Trade Spend
− Variable Distribution / Fulfilment
− Other Variable Selling Costs
\`\`\`

| Driver | Unit economics | Owner | Guardrail | Decision |
|---|---|---|---|---|
| Unit COGS | COGS / units | Supply-chain finance | Cost inflation trigger | Re-source or reprice |
| Channel fee | Fees / channel revenue | E-commerce finance | Net CM ≥ 25% | Price floor |
| Trade spend | Spend / net revenue | Commercial finance | ROI ≥ 25% | Stop/scale |
| Fulfilment | Fulfilment cost / order | Operations finance | Cost per order cap | Change service model |
| Contribution per unit | Contribution profit / units | FP&A | Positive after all variable costs | SKU/channel prioritization |

## 4. Inventory and service tree

\`\`\`
Inventory Cash
= Units on hand × Unit COGS
\`\`\`

\`\`\`
DIO = Average Inventory / COGS × Days
CCC = DSO + DIO − DPO
\`\`\`

| Driver | Formula | Required data | Decision rule |
|---|---|---|---|
| Sell-through | Units sold / units available | Opening stock, receipts, sales | Replenish only where demand supports |
| Stock cover | On-hand units / average daily units | Inventory and demand | Cap slow-SKU cover |
| Aging | Days since receipt / batch age | Lot and receipt date | Markdown or channel shift |
| Service level | Orders fulfilled / orders requested | Orders and fill status | Maintain ≥95% for A SKUs |
| Cash tied in stock | On-hand × unit COGS | Unit cost and inventory | Release cash from slow items |

## 5. Customer and AR tree

\`\`\`
Customer Economic Value
= Net Revenue − Customer Variable Cost − Trade Support − Cash Cost
\`\`\`

\`\`\`
DSO = Average AR / Net Credit Sales × Days
\`\`\`

Required cuts:

- Customer contribution before and after discount.
- Top-3 concentration and change in percentage points.
- Overdue balance by account and aging bucket.
- Payment-term exception and approval.
- Cash-release estimate using the approved daily-sales denominator.

Decision rule: do not approve a deeper discount without a volume/mix commitment and a payment-date commitment.

## 6. D2C unit-economics tree

\`\`\`
Contribution LTV
= Orders per customer × Contribution per order × Expected active life
\`\`\`

\`\`\`
LTV / CAC = Contribution LTV ÷ Customer Acquisition Cost
\`\`\`

\`\`\`
Payback orders = CAC ÷ Contribution per order
\`\`\`

Current portfolio illustration is LTV/CAC 0.72x and payback 3.33 orders. These are synthetic and below the illustrative 1.0x scale hurdle.

Decision rule: improve repeat purchase, order contribution or CAC before scaling acquisition spend.

## 7. Conditional owned-retail branch

SSSG and sales per square meter are not activated because the case has no approved owned-store network. If store data becomes available:

- SSSG = comparable-store revenue growth.
- Sales per m² = store revenue / selling area.
- Store contribution = store revenue − store variable cost − store controllable opex.

Do not force store metrics into a manufacturer/distributor case.

## 8. Driver-to-decision checklist

Before publishing a driver insight, confirm:

1. The operational node has the correct grain.
2. The financial bridge includes every variable cost or deduction.
3. The evidence class is visible.
4. The owner can influence the driver.
5. The guardrail is measurable.
6. The recommendation states the next review date.
7. The value equation can be recalculated from source fields.

## Release boundary

This driver tree is a synthetic unit-economics and operating-control contract. It is not evidence of realized commercial impact. Replace synthetic inputs with approved ERP, promotion, inventory, AR/AP and cohort data before production use.


## 9. Source-to-metric data contract

The tree is only useful when the operational grain can be reconciled to the ledger. The minimum production contract is:

| Source | Required fields | Grain | Reconciliation |
|---|---|---|---|
| ERP / GL | account, cost centre, posting date, amount, currency | journal line | Net revenue and COGS tie to trial balance |
| Invoice fact | invoice ID, customer/outlet, SKU, quantity, gross value, discount, tax, return flag | invoice line | Invoice net value ties to ERP sales |
| Promotion ledger | event ID, customer, SKU, list price, funded discount, claim status | event × SKU × customer | Trade spend accrual ties to approved events |
| Inventory snapshot | SKU, location, opening units, receipts, closing units, unit cost, age bucket | day × SKU × location | Opening + receipts − sales − adjustments = closing |
| AR sub-ledger | customer, invoice date, due date, open amount, payment date | invoice | AR balance ties to GL control account |
| AP / purchase ledger | vendor, receipt date, due date, open amount | invoice | AP balance ties to GL control account |
| D2C cohort table | customer, first order date, orders, contribution, CAC source | customer × cohort | Cohort contribution reconciles to D2C P&L |

Every source must carry a source_system, extract_timestamp, period_status (OPEN/FROZEN), and evidence_class field. A FROZEN period is required before a management recommendation is treated as a historical fact.

## 10. Reconciliation and control formulas

Use these controls at month-end:

1. **Revenue control**: invoice net revenue = GL net sales ± approved timing/reclass items. Investigate any variance above 0.5% of monthly net revenue.
2. **Gross-to-net control**: gross sales − discounts − returns − rebates = invoice net sales. No deduction may be silently embedded in COGS.
3. **Inventory roll-forward**: opening units + receipts − invoiced units − approved adjustments = closing units. The same roll-forward is valued at approved standard or weighted-average cost.
4. **Contribution control**: contribution profit = net revenue − mapped variable costs. Every variable cost account must have a driver mapping or an explicit “unmapped” exception.
5. **Working-capital control**: AR/AP and inventory balances from sub-ledgers tie to the balance sheet. DSO/DIO/DPO use average balances and the same day-count convention.
6. **Cohort control**: first-order cohort revenue and contribution sum to the D2C P&L for the same period; CAC is tagged as paid, organic or partner-funded.

## 11. Worked bridge: an illustrative month

The following example is intentionally synthetic and demonstrates the bridge mechanics:

- 10,000 active customers, 1.8 orders/customer, 2.0 units/order and net ASP of $12.50 produce **$450,000 net revenue**.
- Gross sales of $500,000 less $25,000 invoice discounts, $10,000 returns and $15,000 rebates reconcile to the $450,000 net revenue.
- COGS of $247,500 (55% of net revenue), channel fees of $18,000, trade spend of $22,500 and fulfilment of $27,000 yield **$135,000 contribution profit**, or 30.0% contribution margin.
- If net ASP falls 4% with all other drivers unchanged, revenue and contribution decline by $18,000 and $18,000 respectively before any volume response.
- If fulfilment cost/order rises $0.30 across 36,000 orders, contribution declines $10,800. This is a controllable operations action, not a pricing variance.

The example is a calculation demonstration, not a claim about the case company.

## 12. Sensitivity and scenario use

A driver tree should support a one-variable-at-a-time bridge and a combined scenario:

- **Price**: change net ASP; hold units and mix constant to isolate price.
- **Volume**: change customers, orders/customer or units/order; hold ASP constant.
- **Mix**: shift channel weights and apply channel-specific ASP, fee and fulfilment assumptions.
- **Leakage**: flex discount, return or rebate rates; show gross-to-net impact separately.
- **Cost**: flex unit COGS, fulfilment and trade spend; show contribution impact.
- **Cash**: flex DSO/DIO/DPO; translate days into cash using the approved daily denominator.

For each scenario, label the output as SIMULATED, cite the assumption owner, and store base/upside/downside values. Do not present a sensitivity result as a forecast until the assumption is approved in the FROZEN snapshot.

## 13. Monthly finance operating cadence

| Timing | Finance action | Output |
|---|---|---|
| WD-5 to WD-2 | Validate extracts, price/volume/mix, promotion calendar and inventory | Pre-close driver pack |
| WD-1 | Confirm accruals, rebate estimates, returns and stock adjustments | Accrual bridge |
| WD+1 to WD+3 | Close GL and sub-ledgers; reconcile revenue, COGS, AR/AP and inventory | FROZEN actuals |
| WD+4 | Publish channel/SKU/customer contribution bridge | MBR driver page |
| WD+5 | Agree owner, guardrail and action for each material variance | Recommendation register |
| Weekly in open period | Refresh leading indicators and risk flags | Rolling forecast input |

## 14. Finance interview demonstration

A candidate can use this tree to answer a business-partnering case in five moves:

1. Start with the P&L line and quantify the variance.
2. Decompose it into operational drivers at the correct grain.
3. Reconcile the bridge to GL/sub-ledgers and declare evidence class.
4. Assign an owner and guardrail, then propose one controllable action.
5. State the next review date and the data needed to upgrade a synthetic assumption to approved evidence.

This is the expected behavior of a commercial finance analyst: explain what moved, why it moved, what can be controlled, and how cash/profit changes if the action is taken.
