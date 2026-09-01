# GL-to-Management P&L Bridge

## Why this exists

FP&A needs a management view that explains drivers, while Accounting needs a controlled chart of accounts. The bridge makes the difference explicit instead of hiding reclassifications inside a dashboard.

## Mapping

| GL account | Accounting class | Management line | Driver / control |
|---|---|---|---|
| 4000 Gross Sales | Revenue | Gross sales | Sales ledger by month/channel/SKU |
| 4010 Invoice Discounts | Contra revenue | Discounts | Invoice-level discounts |
| 4020 Returns | Contra revenue | Returns | Return/credit-note feed |
| 5000 COGS | Expense | COGS | Units × actual COGS from sales ledger |
| 5100 Channel Fees | Expense | Channel fees | Commission + payment + listing + freight |
| 5200 Trade Spend | Expense | Trade spend | Trade spend + rebate + write-off |
| 6000 Controllable OPEX | Expense | Controllable OPEX | Cost-centre planning schedule |
| 6100 Depreciation | Expense | D&A | CAPEX/fixed-asset schedule |
| 6200 Finance Cost | Expense | Finance cost | Debt facility schedule |
| 6300 Tax Proxy | Expense | Tax proxy | 20% of positive PBT proxy |

## Management bridge

```text
Gross sales
− discounts − returns
= Net revenue
− COGS
= Gross profit
− channel fees − trade spend
= Contribution profit
− controllable OPEX
= Statement EBITDA proxy
− D&A − finance cost − tax proxy
= PAT proxy
```

The separate project EBITDA proxy (`Gross profit − controllable OPEX`) is retained for continuity with the original KPI registry. It must not be presented as a statutory result or mixed with the accounting-linked statement proxy.

## Journal control

The release includes one transparent synthetic reclassification per month: 1% of trade spend is shown as a controllable-OPEX management adjustment and reversed from trade spend. Each journal has an entry ID, preparer, approver, approval status and evidence class in `data/accounting/journal_adjustments.csv`. This demonstrates control design; it does not claim a real posting to an ERP.

## Review questions

1. Is the source-to-GL mapping complete for the close period?
2. Are discounts, returns, rebates and trade spend consistently classified month to month?
3. Does every management adjustment have a reason, owner and approval?
4. Do P&L, balance sheet, cash flow and subledger controls reconcile before commentary is issued?
