# Power BI Native Reviewer Walkthrough — VNFinance Commercial Finance v2

Status: PREPARED_FOR_DESKTOP_EXECUTION — not a native PBIX claim.

## Reviewer objective

Within five minutes, move from the CFO headline to the operational driver, owner, guardrail and evidence status. The walkthrough is designed for a finance hiring manager, not a BI developer.

## Page-by-page script

| Page | Start state | Action | Expected finance answer | QA links |
|---|---|---|---|---|
| Executive Output | Scenario = Base | Read revenue, contribution margin, CCC and risk flag; select one action row | State the largest P&L/cash decision and its owner | QA-07, QA-11, QA-18 |
| P&L and Variance | Base period selected | Open actual vs budget vs forecast and variance waterfall | Quantify the miss/beat and identify price, volume, mix or cost driver | QA-02, QA-03, QA-08 |
| PVM Bridge | Same period | Hover price, volume, mix and trade-spend components | Explain why revenue moved and confirm bridge residual is within VND 100m | QA-09 |
| Channel and Customer Profitability | All channels | Sort contribution margin; drill to customer/SKU | Name below-hurdle growth and the commercial action | QA-04, QA-10, QA-12, QA-14 |
| Working Capital and Liquidity | Latest closed month | Read DSO, DIO, DPO, CCC, aging and inventory cover | Convert days into a cash-release action with owner/date | QA-11, QA-17 |
| Controls and Evidence | No filters hidden | Show tie-outs, row counts, evidence classes, refresh and queue | Prove the number is reproducible and exclusions are visible | QA-01, QA-05, QA-06, QA-13, QA-15, QA-16 |

## Reviewer prompts

1. “What moved versus plan?”
2. “Which operational node caused it?”
3. “What is the contribution or cash consequence?”
4. “Who owns the fix and what is the guardrail?”
5. “Which source or evidence class supports the number?”
6. “What would make this recommendation unsafe to release?”

## Evidence capture standard

For each QA row, save the observed value, page/visual name, reviewer initials and ISO execution timestamp. Use one screenshot or PDF page reference per visual tie-out. A green card without a recorded observed value is not evidence.

## Native release boundary

This walkthrough validates readiness of the source scaffold only. Gate B remains OPEN until Power BI Desktop creates and reopens the native PBIX, QA-01 through QA-17 are PASS, QA-18 is demonstrated, visual tie-outs are archived and the PBIX hash is stored.
