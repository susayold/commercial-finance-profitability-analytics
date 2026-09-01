# Integrated Three-Statement FP&A Methodology (Non-BI)

## Objective

Convert the monthly operating ledger into a reviewable management income statement, balance sheet, indirect cash-flow statement, trial balance and close-control pack. The model is deliberately labelled synthetic/derived; it is a finance-methodology rehearsal rather than statutory reporting.

## Source hierarchy

| Layer | Source | Grain | Treatment |
|---|---|---:|---|
| Operating actuals | `powerbi/data/current/sales_fact.csv` | line × month | 6,480 rows, 36 SKU, 36 months |
| Commercial costs | `powerbi/data/current/commercial_costs.csv` | line × month | commission, payment fee, listing fee, freight, trade spend, rebate, write-off |
| Working capital | `receivables.csv`, `inventory.csv`, `payables.csv` | customer/SKU/warehouse/supplier × month | aggregated to monthly control balances |
| Financing | `debt.csv` | facility × month | rolled forward from prior closing debt |
| Planning schedules | `powerbi/data/final_v1/fact_opex_headcount.csv`, `fact_capex.csv` | cost centre/project × month | matched 36-month planning horizon |

## Statement construction

1. Gross sales, discounts and returns are read from the sales ledger; net revenue and COGS are summed at month level.
2. Commercial variable costs are separated into channel fees and trade spend. The management contribution line is `Net revenue − COGS − commercial variable costs`.
3. Controllable OPEX, CAPEX and depreciation are sourced from the planning schedules.
4. The project EBITDA proxy remains `Gross profit − controllable OPEX`. The accounting-linked EBITDA proxy is `Contribution profit − controllable OPEX`; both labels are explicit because no statutory EBITDA bridge is available.
5. Finance cost is linked to the debt schedule. Tax is a 20% proxy applied only to positive PBT.
6. Working capital is calculated as monthly closing AR, inventory and AP balances. Inventory opening value is calculated from opening warehouse units × weighted unit cost.
7. Cash flow uses the indirect method and debt movement; closing cash feeds the balance sheet.
8. Retained earnings rolls forward by PAT proxy, so the balance sheet and trial balance can be tied each month.

## Close controls

- Trial balance: total debits equal total credits for every month.
- Balance sheet: total assets equal liabilities plus equity within VND 1 tolerance.
- Cash tie: cash-flow closing cash equals balance-sheet cash.
- Retained earnings: equity movement equals PAT proxy.
- Subledger-to-GL: AR, inventory, AP, PP&E and debt each tie to their balance-sheet control value.
- Debt roll-forward: opening debt + drawdown − repayment = closing debt.
- Fixed asset roll-forward: opening PP&E + CAPEX − D&A = closing PP&E.

## Evidence policy

`SIMULATED` identifies source data, opening balances, chart of accounts and journal approvals. `DERIVED` identifies calculations and reconciliations. A recruiter-facing claim must never imply statutory close ownership, live ERP access or realized savings.

## Rebuild and validation

```text
node scripts/build_three_statement_model.mjs
node scripts/validate_three_statement_model.mjs
```

The validator expects 36 monthly periods, a 36-month trial balance, 180 subledger controls and zero residual failures. The release report is `reports/THREE_STATEMENT_RECONCILIATION_2026-09-01.md`.
