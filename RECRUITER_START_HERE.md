# VNFinance — recruiter start here

**Business question.** Which growth, margin and working-capital drivers should
management act on next month?

**Three decisions demonstrated.**

1. Reconcile invoice-level sales to a management P&L and explain plan variance.
2. Rank channel/customer economics after fees, trade spend and cash cost.
3. Convert DSO/DIO/DPO and scenario stress into owners, guardrails and review dates.

**Core deliverables.**

- [MBR finance analyst pack](reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md)
- [Leakage-safe rolling-origin revenue backtest](reports/ROLLING_ORIGIN_FORECAST_BACKTEST_2026-09-08.md)
- [CFO memo](docs/CFO_MEMO_V1.md)
- [Sales economic audit](reports/SALES_FACT_DIMENSIONAL_AUDIT_2026-08-31.md)
- [Integrated three-statement reconciliation](reports/THREE_STATEMENT_RECONCILIATION_2026-09-01.md)
- [FMCG standard-cost reconciliation](reports/FMCG_STANDARD_COSTING_RECONCILIATION_2026-09-01.md)
- [Canonical non-BI project status](data/governance/project_status_nonbi.json)
- [Recruiter metric snapshot](data/governance/recruiter_metric_snapshot.json)
- [Non-BI release manifest](reports/NONBI_RELEASE_MANIFEST_2026-09-02.md)

**Forecast evidence.** The project now includes a true rolling-origin out-of-sample
revenue backtest over the 36-month simulated operating history. The pre-specified
12-month seasonal-naive benchmark records WAPE of **1.1734% / 1.1554% / 1.1782%**
at 1M / 3M / 6M horizons and beats the trend and ensemble challengers. These are
**SIMULATED_HISTORICAL_BACKTEST** results, not live company performance. Forecast
Gate A therefore remains open until a genuine pre-close frozen forecast and
post-close actual are supplied.

**Evidence boundary.** The operating ledger is synthetic/rehearsal data; public
company metrics are filing-based and basis-controlled. EBITDA is a proxy, DCF
and M&A are screening rehearsals, and live Forecast Gate A remains input-gated.
Power BI is archived and outside this active recruiter path. The one-page case
summary is available in [PDF form](output/pdf/VNFINANCE_FPA_CASE_SUMMARY_ONE_PAGE.pdf).
See [claim registry](data/governance/claim_registry.csv).

**Technical appendix.** [Metric registry](data/governance/finance_metric_registry.csv),
[unit contract](schemas/unit_contract.csv), [scenario source](data/scenarios/scenario_summary.csv),
[forecast backtest summary](data/forecast/rolling_origin_revenue_backtest_summary.json),
[architecture](docs/ARCHITECTURE_NON_POWERBI.md), [UAT/change control](docs/UAT_AND_MODEL_CHANGE_CONTROL.md), and [final QA](reports/NON_POWERBI_FINAL_QA_2026-09-01.md).
