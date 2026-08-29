# D2C Unit Economics — CAC, LTV and Payback

## Purpose

This module closes the D2C branch in the commercial-finance case. It translates acquisition spend and repeat behavior into a finance decision: whether to scale, hold, or stop incremental D2C investment. The companion native Sheet is the reviewable calculation surface:

[Open native D2C Unit Economics Sheet](https://docs.google.com/spreadsheets/d/1nTEJJ9iBvxne0hCjGSDoHKaWgR_pqiMqgXYaTqGgbik/edit?usp=drivesdk)

All operating inputs in this module are synthetic. Public-company filings are not used to claim CAC, LTV or customer behavior for VietNova or any real company.

## Decision logic

1. Compute CAC from paid-marketing spend divided by newly acquired customers.
2. Compute contribution per order after product gross profit, fulfillment, payment fees and returns/refunds.
3. Convert repeat orders into customer-level LTV contribution.
4. Compare LTV/CAC with a documented hurdle and inspect payback orders.
5. Test downside and upside scenarios before recommending scale.

The base output is illustrative: CAC = VND 130,000, LTV contribution = VND 93,600, LTV/CAC = 0.72x and payback = 3.33 orders. With the current illustrative 0.30x hurdle, the scenario passes mechanically, but the recommendation remains “scale with CAC and repeat-rate guardrails.” A real company should replace the hurdle with its approved capital-allocation policy and include retention cohorts, channel attribution and cash timing.

## Definitions and formulas

- CAC = marketing spend / new customers.
- Revenue per customer = AOV × orders per customer.
- Payment fee per order = AOV × payment fee rate.
- Return/refund cost per order = AOV × return/refund rate.
- Contribution per order = AOV × gross margin − fulfillment per order − payment fee per order − return/refund cost per order.
- LTV contribution = contribution per order × orders per customer.
- LTV/CAC = LTV contribution / CAC.
- Payback orders = CAC / contribution per order.
- Annual D2C revenue proxy = new customers × revenue per customer.
- Annual contribution proxy = new customers × LTV contribution.

The data extract is [data/d2c_unit_economics_synthetic.csv](../data/d2c_unit_economics_synthetic.csv). Values are labelled `SYNTHETIC`, `ASSUMPTION` or `DERIVED` so a reviewer can distinguish input evidence from calculation.

## Scenario design

| Scenario | Acquisition | Demand / repeat | Unit economics | LTV/CAC |
|---|---|---|---|---:|
| Base | VND 650m spend; 5,000 customers | VND 110k AOV; 2.4 orders/customer | 55% GM; VND 16k fulfillment/order | 0.72x |
| Downside | VND 780m spend; 4,500 customers | VND 105k AOV; 2.0 orders/customer | 52% GM; VND 18k fulfillment/order | 0.34x |
| Upside | VND 520m spend; 6,000 customers | VND 115k AOV; 2.8 orders/customer | 58% GM; VND 15k fulfillment/order | 1.52x |

The scenario table is not a forecast of a real business. It is a transparent sensitivity that shows how customer acquisition efficiency and repeat behavior drive the investment decision.

## Controls and reviewability

The native Sheet contains five tabs:

- `Instructions`: evidence boundary, workflow and release label.
- `Assumptions`: editable Base/Downside/Upside drivers.
- `Unit_Economics`: formula-driven CAC, contribution, LTV, payback and decision outputs.
- `Sensitivity`: scenario comparison.
- `Checks`: arithmetic tie-outs, hurdle linkage, scenario coverage and divide-by-zero control.

The current Checks tab returns PASS for all six controls. The automated validator is [scripts/validate_d2c_unit_economics.mjs](../scripts/validate_d2c_unit_economics.mjs). It protects the committed CSV from accidental changes and is executed in GitHub Actions.

## Production upgrade path

To convert this synthetic module into a real-company finance artifact:

- replace synthetic acquisition and order inputs with paid-media invoices, platform orders, refunds and contribution-cost mappings;
- use cohort-level retention rather than a single average orders-per-customer assumption;
- define customer, channel and campaign attribution rules before calculating CAC;
- reconcile contribution to the management P&L and cash timing;
- add finance owner, source-model version and period-close evidence;
- calibrate hurdle rates to approved ROIC / payback policy;
- freeze each monthly snapshot before actuals are loaded, consistent with the forecast close-calendar control.

## CV-safe wording

> Built a formula-driven D2C unit-economics module linking acquisition spend, repeat orders, gross margin and variable service costs to CAC, LTV/CAC, payback and scale/hold decisions; included Base/Downside/Upside sensitivities and six automated control checks (synthetic case).
