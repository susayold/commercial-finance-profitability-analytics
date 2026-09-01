# Integrated Three-Statement Reconciliation — VietNova

**Status:** PASS  
**Scope:** 36 synthetic monthly periods, non-BI finance-core layer

## Purpose

This release adds a linked income statement, balance sheet, indirect cash flow, trial balance, journal-control layer and subledger reconciliation. The operating source is deterministic synthetic data; the output is a finance-methodology rehearsal, not a statutory filing.

## Model chain

~~~text
Sales / commercial costs / OPEX / CAPEX / debt / AR / inventory / AP
                 -> monthly P&L
                 -> working-capital and fixed-asset schedules
                 -> cash flow and debt movement
                 -> balance sheet and retained earnings
                 -> trial balance / subledger / close controls
~~~

## Core equations

- CFO = PAT proxy + D&A − ΔAR − ΔInventory + ΔAP.
- Pre-financing FCF = CFO − CAPEX.
- Closing cash = Opening cash + CFO − CAPEX + debt drawdown − debt repayment.
- Net PP&E = Opening PP&E + CAPEX − D&A.
- Closing equity = Opening equity + PAT proxy.
- Balance check = Total Assets − Total Liabilities − Closing Equity.
- The project-approved EBITDA proxy is Gross Profit − controllable OPEX; it is not statutory EBITDA. The accounting-linked statement EBITDA proxy is Contribution Profit − controllable OPEX so commercial variable costs are included in the full P&L and trial balance.

## Result

- Periods: **36**
- Trial-balance periods: **36**
- Reconciliation rows: **396**
- Failed controls: **0**
- Latest-period balance check (VND): **0**
- Latest-period closing cash (VND): **-30756981747**

## Close controls

| Control | Rule | Result |
|---|---|---|
| Trial balance | Debit = Credit each month | PASS |
| Balance sheet | Assets = Liabilities + Equity | PASS |
| Cash tie | Cash flow closing cash = balance sheet cash | PASS |
| Retained earnings | Equity movement = PAT proxy | PASS |
| Subledgers | AR, inventory, AP, PP&E, debt tie to controls | PASS |

## Evidence boundary

- SIMULATED: source ledger, chart of accounts, trial balance, journal approvals and opening balances.
- DERIVED: statements, cash flow, ratios and all tie-outs.
- No audited statutory result, employer impact or live ERP experience is claimed.
