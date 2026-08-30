# Customer Profitability & Concentration Methodology

**Status:** SYNTHETIC / REHEARSAL  
**Coverage:** 24 customer-year rows for FY2025  
**Unit:** VND million unless stated

## Decision question

Which customers create incremental economic value after gross-to-net leakage, COGS, delivery, support and the cash cost of extended payment terms?

## Customer P&L

For each customer:

```text
Net sales
= Gross sales − Discounts − Rebates − Returns
```

```text
Contribution profit
= Net sales − COGS − Delivery − Customer support
```

```text
Contribution margin %
= Contribution profit ÷ Net sales
```

The schedule keeps discounts, rebates and returns separate so commercial leakage is visible and negotiable.

## Working-capital overlay

```text
DSO
= AR balance ÷ Net sales × 365
```

```text
Working-capital cost proxy
= AR balance × 10% annual carrying-cost assumption
```

```text
Contribution after WC cost
= Contribution profit − Working-capital cost proxy
```

The 10% rate is an illustrative hurdle, not a financing quote. A real company analysis must replace it with approved funding/carrying-cost assumptions.

## Concentration and classification

Use the customer table to calculate:

- top-5 revenue concentration;
- top-5 contribution concentration;
- rebate intensity;
- returns intensity;
- DSO and overdue-balance risk;
- contribution margin hurdle;
- contribution after WC cost.

Classify accounts as **Invest**, **Protect/Harvest**, **Fix Economics**, **Review/Rationalize** or **Strategic Loss Leader**. A high-revenue account with weak contribution margin or high DSO should not be ranked solely by sales.

## Deliberate case signal

The synthetic `MT National Account` is a high-revenue, strategic customer with elevated discounts/rebates, a 14.58% contribution margin and approximately 89-day DSO. It is included to rehearse a Finance Business Partner conversation: protect strategic volume only if trade terms, service cost and payment terms clear the agreed hurdle.

This is a controlled synthetic example, not a claim about a named real customer.

## Controls

1. One row per customer with 24 unique IDs.
2. Gross-to-net bridge reconciles.
3. Customer contribution reconciles.
4. Contribution margin recomputes from contribution and net sales.
5. DSO recomputes from AR and net sales.
6. Working-capital cost proxy and after-WC contribution reconcile.
7. No negative net sales or AR balance.
8. The high-revenue / low-margin account remains visible for review.

## Limitations

No contract, invoice-level aging, service-level agreement, rebate approval, customer P&L allocation policy or transfer-pricing evidence is supplied. The layer is suitable for demonstrating analysis mechanics and business-partnering questions, not for a real account decision.
