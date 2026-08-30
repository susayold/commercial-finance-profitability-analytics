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
