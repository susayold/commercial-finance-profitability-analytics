# VNFinance — recruiter start here

**Business question.** Which growth, margin and working-capital drivers should management act on next month?

**Three decisions demonstrated.**

1. Reconcile invoice-level sales to a management P&L and explain plan variance.
2. Rank channel/customer economics after fees, trade spend and cash cost.
3. Convert DSO/DIO/DPO, forecast and scenario stress into owners, guardrails and review dates.

**Current release.** `VNFINANCE-FPA-v1.1.1` · immutable tag `fpa-portfolio-v1.1.1` after release closure.

**Core deliverables.**

- [10-page recruiter website](https://susayold.github.io/commercial-finance-profitability-analytics/)
- [Executive dashboard](https://susayold.github.io/commercial-finance-profitability-analytics/dashboard/)
- [MBR finance analyst pack](reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md)
- [Leakage-safe rolling-origin revenue backtest](reports/ROLLING_ORIGIN_FORECAST_BACKTEST_2026-09-08.md)
- [Page 5 source-driven costing contract](site/data/generated/page5-costing.json)
- [Integrated three-statement reconciliation](reports/THREE_STATEMENT_RECONCILIATION_2026-09-01.md)
- [FMCG standard-cost reconciliation](reports/FMCG_STANDARD_COSTING_RECONCILIATION_2026-09-01.md)
- [Final v1.1.1 release record](reports/FINAL_RECRUITER_RELEASE_V1.1.1_2026-09-08.md)

**Website contract.** Pages 1–10 are validated against the same finance and evidence contracts used by the repository. Page 4 and Page 5 remain intentionally standalone rehearsals rather than being forced into false reconciliation with the core P&L. Page 5 is now source-driven from governed costing and inventory files; Dec-2025 slow-moving SKUs are `SKU018`, `SKU034`, and `SKU035`.

**Forecast evidence.** The project includes a true rolling-origin out-of-sample revenue backtest over the 36-month simulated operating history. The pre-specified 12-month seasonal-naive benchmark records WAPE of **1.1734% / 1.1554% / 1.1782%** at 1M / 3M / 6M horizons and beats the trend and ensemble challengers. These are **SIMULATED_HISTORICAL_BACKTEST** results, not live company performance. Forecast Gate A therefore remains open until a genuine pre-close frozen forecast and post-close actual are supplied.

**Evidence boundary.** The operating ledger and detailed costing are simulated/derived; public-company metrics are filing-based and basis-controlled; standalone customer economics and strategic appendices are rehearsals; EBITDA remains an explicitly labelled proxy; live forecast accuracy is input-gated.

**Technical appendix.** [Metric registry](data/governance/finance_metric_registry.csv), [unit contract](schemas/unit_contract.csv), [scenario source](data/scenarios/scenario_summary.csv), [Page 5 builder](scripts/build_page5_costing_data.mjs), [Page 5 validator](scripts/validate_page5_costing.mjs), [forecast backtest summary](data/forecast/rolling_origin_revenue_backtest_summary.json), [website validator](scripts/validate_website_content_alignment.mjs), and [architecture](docs/ARCHITECTURE_NON_POWERBI.md).
