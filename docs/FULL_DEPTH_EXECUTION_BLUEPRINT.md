# FULL-DEPTH EXECUTION BLUEPRINT

## 1. Quyết định thiết kế

Project giữ toàn bộ scope Commercial Finance, FP&A, profitability, working capital, liquidity, risk, pricing, promotion, budget allocation, peer benchmark và strategic stretch.

Độ rộng chỉ được tính là lợi thế khi mỗi module có đủ 5 thành phần:

1. business question rõ;
2. dữ liệu và metric dictionary;
3. calculation có control;
4. insight có bằng chứng và mức confidence;
5. management action có quantified impact.

Project không cố giả lập rằng public filings có sẵn dữ liệu SKU, customer hay promotion. Public data dùng để calibrate economics và peer benchmark. Dữ liệu vận hành chi tiết của VietNova Consumer là synthetic nhưng deterministic, reconcile được và có hidden truth.

## 2. Career signal cần chứng minh

Candidate có thể:

- đọc và normalize financial statements dài hạn;
- hiểu business model FMCG thay vì chỉ dựng chart;
- xây management P&L từ gross sales đến EBIT và cash;
- giải thích Actual vs Budget vs Forecast bằng drivers;
- phân tích product, SKU, channel và customer profitability;
- xây price-volume-mix bridge có reconciliation;
- đánh giá promotion ROI và pricing decision;
- xây rolling forecast, scenario và Monte Carlo;
- quản trị working capital, liquidity và revolver;
- đưa recommendation có owner, timing, risk và control;
- giao tiếp như Finance Business Partner với Sales, Marketing và Supply Chain;
- trình bày một case nhất quán qua Excel, Power BI, memo, deck và website.

## 3. Kiến trúc bằng chứng ba tầng

### Tier A - Long-run public financial history

Mục tiêu: nhìn structural change, cyclicality, margin regime, capital intensity, cash conversion và balance-sheet resilience.

Coverage hiện có:

- VNM: Annual Reports 2006-2025;
- QNS: Annual Reports 2016-2025;
- KDC: Annual Reports 2016-2025;
- MCH: Annual Reports 2018, 2019, 2021-2025;
- gap chính thức được giữ trong registry, không backfill bằng file không xác minh.

Tier A dùng cho:

- revenue and profit CAGR;
- gross, EBITDA, EBIT và net margin;
- SG&A intensity;
- asset turnover;
- ROIC proxy;
- DSO, DIO, DPO và CCC;
- capex intensity;
- net debt and liquidity;
- cash conversion;
- impairment, restructuring và one-off event mapping.

### Tier B - Comparable category, channel and strategic disclosures

Mục tiêu: hiểu economics theo ngành và calibrate synthetic company.

Chỉ dùng các năm có definition đủ rõ. Không kéo một disclosure một năm thành time series giả.

Các disclosure được ưu tiên:

- MCH: seasonings, convenience foods, beverages, coffee, HPC, power brands, GT/MT/e-commerce, distribution transformation;
- VNM: domestic, overseas, export, subsidiaries, product portfolio, farm and manufacturing capacity;
- QNS: soy milk, sugar, biomass, beverage and other operations;
- KDC: edible oils, food, confectionery, ice cream and restructuring events.

Mỗi metric Tier B phải có:

- source document;
- page or section;
- original label;
- normalized label;
- unit;
- scope;
- period;
- reported / calculated status;
- comparability flag;
- caveat.

### Tier C - Synthetic operating ledger

Mục tiêu: tạo dữ liệu đủ granular để chạy Corporate Financial Analyst work mà public filings không cung cấp.

Synthetic company: VietNova Consumer JSC.

Core categories:

- VietSpice - seasonings;
- QuickBowl - convenience foods;
- PulseUp - beverages.

Operating dimensions:

- 36 SKUs;
- 5 channels: General Trade, Modern Trade, Marketplace, D2C, Wholesale;
- 3 regions: North, Central, South;
- 24 named customers plus long-tail customer groups;
- 36 months Actual: January 2023 to December 2025;
- FY2025 Original Budget;
- monthly frozen Forecast versions;
- FY2026 Base, Upside and Downside scenarios;
- weekly inventory snapshots;
- AR and AP invoice-level ledgers;
- promotion event table;
- marketing spend table;
- debt and liquidity schedules.

Target data volume:

- sales fact: 150,000-300,000 rows;
- inventory movement: 80,000-150,000 rows;
- AR invoices: 12,000-25,000 rows;
- AP invoices: 5,000-12,000 rows;
- promotions: 150-300 campaigns;
- forecast snapshots: at least 12 frozen versions.

Synthetic does not mean arbitrary. Generator must reproduce target revenue scale, gross margin, channel economics, seasonality, working-capital behavior and selected peer ranges.

## 4. Company selection

### MCH - primary commercial-finance anchor

Why:

- closest fit to branded packaged foods and beverages;
- strong category, brand, premiumization and distribution narrative;
- good reference for gross-to-net, mix, innovation and route-to-market questions;
- best anchor for management storytelling.

Limitations:

- historical attachment migration creates source gaps;
- category disclosure can change by year;
- no public SKU, customer or promotion ledger.

Use:

- business design;
- category mix;
- margin calibration;
- GT/MT/e-commerce strategy;
- power-brand and innovation framing.

### VNM - financial-quality and long-history benchmark

Why:

- official annual-report archive covers 2006-2025;
- strong audited disclosure and long comparable history;
- useful for margin, cash, capex, overseas mix and balance-sheet discipline.

Limitations:

- dairy economics include farms, cold chain and biological assets;
- not a pure packaged-food peer.

Use:

- long-run financial quality;
- capex and cash conversion;
- benchmark discipline;
- stress-case boundary.

### QNS - input-cost and plant-economics benchmark

Why:

- soy milk is relevant to branded beverage;
- sugar exposure creates a useful commodity-cost stress laboratory;
- segment disclosures support plant and input-cost analysis.

Limitations:

- sugar and biomass distort consolidated comparison;
- category margins may not be separately disclosed every year.

Use:

- raw-material sensitivity;
- segment bridge;
- inventory and commodity scenarios;
- manufacturing economics.

### KDC - strategic-change and portfolio benchmark

Why:

- useful long history from 2016;
- portfolio, distribution and restructuring events create a strong comparability case;
- supports discussion of one-offs and changing business perimeter.

Limitations:

- restructuring reduces clean year-on-year comparability;
- not a primary margin anchor.

Use:

- comparability flags;
- one-off normalization;
- portfolio change;
- strategic stretch context.

## 5. Remote-first storage policy

### GitHub

Repository: susayold/commercial-finance-profitability-analytics

GitHub stores:

- source registry and manifest;
- scripts;
- schemas;
- metric dictionary;
- data contracts;
- normalized calculated datasets that pass licensing review;
- synthetic generator;
- tests and controls;
- documentation;
- website source;
- lightweight deliverables.

GitHub does not store:

- raw annual-report PDFs;
- restricted third-party data;
- credentials;
- large binary Excel or Power BI working files unless a release strategy is approved;
- data without redistribution rights.

### Google Drive

Project folder stores:

- raw annual reports;
- extraction intermediates;
- large datasets;
- Excel and Power BI binaries;
- management deck;
- CFO memo;
- final PDF exports;
- archived versions.

Local disk is staging only. A staged file is deleted only after:

1. Drive upload returns success;
2. remote metadata readback shows expected title and parent folder;
3. file count reconciles to source registry;
4. checksum or size control is captured where available.

## 6. Source acquisition program

### Phase 1 - annual reports

Status at first commit:

- 47 official annual-report PDFs uploaded;
- VNM complete 2006-2025;
- QNS complete 2016-2025;
- KDC complete 2016-2025;
- MCH 7 verified years uploaded;
- false QNS 2015 duplicate rejected after text extraction showed 2016 content.

### Phase 2 - audited consolidated financial statements

Acquire every official year available.

Priority order:

1. audited consolidated financial statements;
2. audited separate statements only when reconciliation or parent-company analysis requires them;
3. restated versions supersede originals but both remain in archive;
4. auditor report and key audit matters are retained.

Required metadata:

- company;
- ticker;
- period start and end;
- report type;
- consolidated / separate;
- audited / reviewed / unaudited;
- currency;
- scale;
- accounting standard;
- filing date;
- auditor;
- opinion;
- restatement flag;
- original URL;
- Drive ID;
- extraction status.

### Phase 3 - quarterly and half-year statements

Use for recent trend and forecast backtesting.

Default analytical window:

- all available quarterlies are archived;
- core quarterly model emphasizes 2019-2025;
- earlier quarterlies remain in raw layer and are modeled only if definitions reconcile.

### Phase 4 - investor presentations and earnings releases

Collect only decision-useful releases:

- results presentation;
- annual business plan;
- category or channel disclosure;
- capacity expansion;
- major restructuring;
- material M&A;
- financing and dividend policy.

Governance notices unrelated to financial drivers are not part of the analytical corpus.

### Phase 5 - macro and commodity drivers

Official or primary sources only:

- Vietnam National Statistics Office: CPI, retail sales and industrial indicators;
- World Bank Pink Sheet: sugar, coffee, edible oils, energy and packaging-related proxies;
- State Bank of Vietnam or official market sources: rates and FX;
- company disclosures: category-specific input commentary.

Each driver must include frequency, lag rule, unit, transformation and intended model use.

## 7. Normalized peer financial dataset

### Core tables

dim_company:

- company_id;
- ticker;
- company_name;
- peer_role;
- fiscal_year_end;
- reporting_currency;
- sector;
- subsector.

dim_period:

- period_id;
- period_type;
- fiscal_year;
- fiscal_quarter;
- start_date;
- end_date;
- months_in_period.

fact_financial_statement:

- company_id;
- period_id;
- statement_type;
- line_item_original;
- line_item_normalized;
- value_original;
- currency;
- scale;
- value_vnd_bn;
- reported_or_calculated;
- source_document_id;
- source_page;
- confidence.

fact_segment:

- company_id;
- period_id;
- segment_original;
- segment_normalized;
- revenue;
- profit;
- assets;
- scope;
- comparability_status.

fact_disclosure:

- disclosure_id;
- company_id;
- period_id;
- theme;
- metric_name;
- metric_value;
- unit;
- exact_or_directional;
- source;
- caveat.

dim_source_document:

- source_document_id;
- company;
- report_year;
- document_type;
- language;
- official_url;
- Drive ID;
- SHA-256;
- page_count;
- extraction_method;
- QA status.

### Normalization policy

Never silently overwrite original labels.

Every normalized value retains:

- original label;
- original value;
- original scale;
- transformation;
- mapping version;
- source;
- reviewer status.

Restatements:

- retain originally filed number;
- retain restated number;
- mark current authoritative value;
- log restatement reason;
- prevent mixed-basis trends.

Business-perimeter changes:

- flag acquisition, divestment, discontinued operation and major restructuring;
- calculate reported growth;
- calculate normalized growth only when adjustment is supportable;
- never describe reported growth as organic without evidence.

## 8. VietNova hidden-truth generator

The generator creates a coherent operating story before dashboards are built.

### Required embedded events

1. raw-material inflation hits beverage and convenience-food COGS;
2. marketplace volume grows but platform fees dilute contribution margin;
3. one large promotion produces revenue lift but negative incremental contribution;
4. a strategic customer grows sales while destroying margin through discount, returns and service cost;
5. premium seasoning mix raises gross margin;
6. slow-moving beverage SKU creates inventory reserve;
7. customer payment delay produces DSO shock;
8. supplier terms tighten;
9. marketing CAC rises in D2C;
10. forecast misses because teams extrapolate revenue without channel mix and cost assumptions.

### Truth table

For every event define:

- root cause;
- affected rows;
- accounting impact;
- operational metric impact;
- expected analytical signal;
- misleading alternative explanation;
- management decision;
- quantified benefit or avoided loss;
- validation test.

### Generator controls

- gross sales equals sum of invoice lines;
- net sales equals gross sales less discount, rebate and returns;
- COGS equals volume times standard or actual unit cost according to the model;
- inventory roll-forward reconciles;
- AR roll-forward reconciles;
- AP roll-forward reconciles;
- P&L connects to cash flow;
- opening plus movement equals closing for all balance schedules;
- seeded randomness reproduces identical output;
- hidden truth remains outside recruiter-facing outputs.

## 9. Commercial P&L

Required structure:

- gross sales;
- invoice discount;
- rebate;
- returns;
- net sales;
- material cost;
- conversion cost;
- freight and warehousing;
- gross profit;
- trade marketing;
- selling expense;
- contribution margin;
- brand marketing;
- fixed overhead;
- EBITDA;
- depreciation and amortization;
- EBIT;
- finance cost;
- profit before tax;
- tax;
- net income.

Views:

- month;
- quarter;
- year;
- brand;
- category;
- SKU;
- channel;
- customer;
- region;
- Actual, Budget, Forecast and Prior Year.

All views must reconcile to company total.

## 10. Analytical modules

### A. Monthly performance reporting

Outputs:

- Actual vs Budget;
- Actual vs Forecast;
- Actual vs Prior Year;
- YTD and full-year outlook;
- top five favorable and unfavorable drivers;
- action tracker.

### B. Price-volume-mix and margin bridge

Effects:

- volume;
- price;
- product mix;
- channel mix;
- customer mix;
- discount;
- returns;
- material cost;
- conversion cost;
- logistics;
- FX where applicable.

Control: bridge start plus effects equals bridge end within tolerance.

### C. Product and SKU profitability

Outputs:

- net sales;
- gross margin;
- contribution margin;
- velocity;
- inventory days;
- return rate;
- promotion dependence;
- lifecycle classification;
- invest / maintain / fix / exit matrix.

### D. Channel profitability

Channel P&L includes:

- gross sales;
- trade terms;
- returns;
- platform or distributor fees;
- logistics and fulfillment;
- contribution;
- working-capital burden.

### E. Customer profitability

Customer P&L includes:

- net sales;
- gross margin;
- discounts and rebates;
- returns;
- service cost;
- logistics;
- bad-debt risk;
- capital charge proxy;
- contribution after cost-to-serve.

### F. Operational drivers and unit economics

Driver trees connect:

- distribution;
- active outlets;
- orders;
- units per order;
- average selling price;
- mix;
- returns;
- variable cost;
- fulfillment cost;
- contribution.

D2C adds CAC, repeat rate, cohort revenue and contribution payback. It is not used to pretend the company operates owned stores.

### G. Promotion ROI

Pre-evaluation:

- baseline volume;
- expected uplift;
- cannibalization;
- pull-forward;
- incremental gross-to-net;
- incremental variable cost;
- hurdle rate;
- break-even volume.

Post-evaluation:

- observed uplift;
- matched control or time-series baseline;
- incremental contribution;
- ROI;
- payback;
- confidence and limitations.

### H. Pricing simulator

Inputs:

- current price;
- proposed price;
- elasticity;
- competitor response;
- channel mix;
- discount leakage;
- cost inflation.

Outputs:

- volume impact;
- net sales;
- gross margin;
- contribution;
- break-even elasticity;
- customer and channel risk.

### I. Budget and rolling forecast

Requirements:

- annual budget built from drivers;
- 12-month rolling forecast;
- monthly frozen versions;
- forecast-vs-actual backtest;
- bias and MAPE where appropriate;
- assumption log;
- override log;
- base, upside and downside.

### J. Working capital

Outputs:

- DSO;
- DIO;
- DPO;
- CCC;
- AR aging;
- inventory aging;
- AP maturity;
- cash release bridge;
- action by owner.

### K. Liquidity and revolver stress

Cases:

- DSO stress;
- inventory stress;
- supplier pressure;
- combined downside.

Outputs:

- minimum cash;
- peak revolver draw;
- headroom;
- interest burden;
- covenant proxy;
- recovery action.

### L. Monte Carlo risk overlay

Drivers may include:

- demand;
- price realization;
- raw-material cost;
- discount;
- returns;
- DSO;
- DIO;
- FX.

Outputs:

- probability of missing EBIT;
- probability of negative free cash flow;
- P5, P50 and P95;
- cash-at-risk;
- driver sensitivity;
- scenario explanation.

### M. Scenario and sensitivity

At minimum:

- Base;
- Upside;
- Downside;
- commodity shock;
- channel mix shift;
- price elasticity grid;
- working-capital shock.

### N. Budget reallocation

Objective: maximize incremental contribution under budget, capacity, risk and strategic constraints.

Outputs:

- current allocation;
- recommended allocation;
- marginal ROI;
- expected EBIT impact;
- risk and guardrails.

### O. Industry and peer benchmark

Dimensions:

- growth;
- gross margin;
- operating margin;
- SG&A intensity;
- asset turnover;
- CCC;
- capex intensity;
- cash conversion;
- leverage;
- category and channel strategy.

### P. Management recommendations

Every recommendation includes:

- decision;
- quantified impact;
- calculation;
- evidence label;
- confidence;
- owner;
- timing;
- leading indicator;
- risk;
- guardrail;
- next review date.

## 11. Excel model specification

Workbook sheets:

1. Cover_Control;
2. ReadMe;
3. Source_Register;
4. Assumptions;
5. Calendar;
6. Product_Master;
7. Customer_Master;
8. Channel_Master;
9. Sales_Fact;
10. Commercial_Costs;
11. Inventory;
12. AR;
13. AP;
14. Debt_Liquidity;
15. Budget;
16. Forecast_Versions;
17. PnL;
18. Variance_Bridge;
19. PVM;
20. Product_Profitability;
21. Channel_Customer;
22. Promotion_Pricing;
23. Working_Capital;
24. Scenario_MonteCarlo;
25. Budget_Allocation;
26. Peer_Benchmark;
27. Checks;
28. Executive_Output.

Model standards:

- inputs blue;
- formulas black;
- links green;
- errors red;
- no hard-coded numbers inside calculation formulas;
- consistent sign convention;
- units shown in headers;
- version and refresh timestamp;
- zero unresolved checks;
- sensitivity cells separated from base assumptions.

## 12. Power BI

Pages:

1. CFO Executive Summary;
2. Revenue and Margin Drivers;
3. Product, Channel and Customer Profitability;
4. Promotion, Pricing and Budget Allocation;
5. Forecast, Scenario and Risk;
6. Inventory, Working Capital and Liquidity.

Every page must answer one management question. Tooltips include metric definition and data timestamp. Drill-through preserves context. Visual totals reconcile to Excel.

## 13. Management communication

Deliverables:

- 10-12 slide management deck;
- two-page CFO decision memo;
- three departmental negotiation battle cards;
- recruiter quick-tour page;
- technical methodology appendix;
- source and assumptions appendix.

Battle cards:

- Marketing asks for 15% more budget;
- Sales asks for deeper customer discount;
- Supply Chain asks for a higher inventory buffer.

Each card contains request, financial impact, counter-question, acceptable range, guardrail, compromise and escalation condition.

## 14. Website

The website is decision-first, not a gallery of charts.

Sections:

- business problem;
- role simulated;
- company and data design;
- three headline findings;
- recommended actions;
- quantified simulated impact;
- interactive dashboard preview;
- Excel model map;
- methodology;
- evidence and limitations;
- download links;
- recruiter quick tour.

The first screen must communicate within 30 seconds:

- what decision was made;
- what financial impact was identified;
- why the analysis is credible;
- what the candidate personally built.

## 15. Quality gates

### Gate 1 - Source integrity

- official source;
- correct company;
- correct year;
- correct document type;
- valid PDF;
- no duplicate masquerading as another year;
- remote copy verified.

### Gate 2 - Accounting integrity

- balance sheet balances;
- cash-flow movement reconciles;
- subtotals recalculate;
- restatements handled;
- consolidated and separate statements never mixed.

### Gate 3 - Dimensional integrity

- company total equals sum of brand;
- brand equals sum of SKU;
- channel and customer views reconcile;
- no orphan master-data key.

### Gate 4 - Analytical integrity

- PVM reconciles;
- promotion baseline documented;
- pricing elasticity is an assumption, not a reported fact;
- forecast versions are frozen;
- Monte Carlo is reproducible;
- optimization constraints are explicit.

### Gate 5 - Claim integrity

Every claim labeled as one of:

- reported fact;
- calculated fact;
- synthetic fact;
- assumption;
- inference;
- recommendation.

No causal language without design capable of supporting causality.

### Gate 6 - Recruiter usability

- one clear story;
- no broken links;
- executive outputs open without special setup;
- technical appendix available but not forced into first read;
- CV bullets map to artifacts and quantified outcomes.

## 16. Execution roadmap

### Sprint 0 - Remote infrastructure and source registry

Exit:

- private GitHub repo;
- Drive hierarchy;
- initial annual-report archive;
- registry;
- missing-source log;
- storage policy.

### Sprint 1 - Complete official source crawl

Exit:

- annual reports;
- audited consolidated statements;
- quarterlies;
- key results releases;
- macro drivers;
- duplicate and version controls.

### Sprint 2 - Extraction framework

Exit:

- document manifest;
- text and table extraction;
- page-level lineage;
- validation samples;
- failed-extraction queue.

### Sprint 3 - Long-run peer model

Exit:

- normalized P&L, balance sheet and cash flow;
- 10-20 year trend where available;
- restatement log;
- peer scorecard;
- structural-break timeline.

### Sprint 4 - Business design and hidden truth

Exit:

- VietNova scope;
- 36 SKUs;
- channels and customers;
- event truth table;
- target economics;
- generator specification.

### Sprint 5 - Synthetic ledger generation

Exit:

- sales;
- commercial costs;
- inventory;
- AR;
- AP;
- promotions;
- marketing;
- debt;
- budget;
- forecast versions;
- all base reconciliations pass.

### Sprint 6 - Core management P&L

Exit:

- monthly reporting;
- Actual vs Budget, Forecast and Prior Year;
- financial-driver tree;
- executive scorecard.

### Sprint 7 - PVM and profitability

Exit:

- PVM bridge;
- SKU matrix;
- channel P&L;
- customer P&L;
- cost-to-serve.

### Sprint 8 - Promotion and pricing

Exit:

- pre- and post-promotion evaluation;
- pricing simulator;
- break-even tools;
- promotion recommendation.

### Sprint 9 - Forecast

Exit:

- driver-based budget;
- 12-month rolling forecast;
- version freeze;
- backtest;
- bias analysis.

### Sprint 10 - Working capital and liquidity

Exit:

- CCC;
- aging;
- cash bridge;
- revolver stress;
- minimum cash and headroom.

### Sprint 11 - Risk and optimization

Exit:

- deterministic scenarios;
- seeded Monte Carlo;
- probability outputs;
- budget reallocation model;
- guardrails.

### Sprint 12 - Strategic stretch

Exit:

- organic build case;
- acquisition case;
- DCF or transaction logic as relevant;
- accretion/dilution;
- decision memo.

### Sprint 13 - Excel hardening

Exit:

- all model sheets;
- formula audit;
- no unresolved check;
- navigation and formatting;
- executive outputs.

### Sprint 14 - Power BI

Exit:

- six pages;
- metric tooltips;
- drill-through;
- reconciled totals;
- performance QA.

### Sprint 15 - Management pack

Exit:

- deck;
- memo;
- battle cards;
- action tracker;
- appendix.

### Sprint 16 - Website and CV packaging

Exit:

- recruiter quick tour;
- downloads;
- methodology;
- limitations;
- one-page English CV bullets;
- interview walkthrough.

## 17. Definition of outstanding

The project is outstanding only when a reviewer can verify:

- more historical source depth than a normal portfolio project;
- no silent data-quality shortcuts;
- clear difference between reported, calculated and synthetic evidence;
- accounting model and operational model reconcile;
- recommendations change a management decision;
- downside and liquidity are modeled, not ignored;
- cross-functional pushback is anticipated;
- outputs are usable by both CFO and recruiter;
- repository is reproducible;
- Drive archive preserves lineage;
- every CV claim links to an artifact.

Breadth is therefore retained. The control system is what converts breadth into credibility.
