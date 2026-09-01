# VNFinance FP&A / Commercial Finance
## Non-BI Gap Research & Update Master Plan

**Ngày lập:** 2026-09-01

**Dự án:** VietNova Consumer JSC — Vietnam Omnichannel FMCG FP&A Case

**Vị trí mục tiêu chính:** Junior FP&A Analyst / Financial Analyst / Business Finance Analyst / Commercial Finance Analyst

**Vị trí mục tiêu phụ:** Finance Data Analyst, nhưng chỉ giữ vai trò hỗ trợ tài chính

**Phạm vi tài liệu:** Mô hình tài chính, Excel, dữ liệu, kiểm soát, báo cáo quản trị, website, CV và recruiter package. Các hạng mục BI được loại khỏi phạm vi theo yêu cầu của chủ dự án.

---

# 1. Kết luận điều hành

Dự án hiện tại đã mạnh hơn phần lớn portfolio junior ở độ rộng, kiểm soát bằng chứng và khả năng truy vết. Phần lõi đã có:

- 36 tháng dữ liệu hoạt động mô phỏng;
- 6.480 dòng sales, 36 SKU, 5 kênh và 24 khách hàng;
- Commercial P&L, Actual/Budget/Forecast/Prior Year, PVM, product/channel/customer profitability;
- promotion ROI, pricing, working capital, liquidity, scenarios, OPEX/headcount, CAPEX;
- Excel v2 gồm 28 tabs;
- MBR, CFO memo, close calendar, KPI dictionary, recommendation register và business-partnering battle cards;
- public-company evidence riêng biệt cho MCH/VNM/QNS/KDC;
- website, CV một trang và interview talk track;
- 10.152 kiểm tra dữ liệu nền tảng với 0 lỗi ở lần build đã lưu;
- non-BI release gate hẹp đang PASS 12/12.

Tuy nhiên, dự án **chưa nên được xem là hoàn tất tuyệt đối**. Audit ngày 2026-09-01 phát hiện:

1. Bộ QA tổng đang **FAIL** tại Monthly Business Review: 14/15 checks. Validator vẫn tìm bộ scenario cũ `80.1 / 83.3 / 76.9` và `54.8 / 48.8 / 68.8`, trong khi nguồn chuẩn hiện là `82.5138 / 85.7182 / 76.9061` và `54 / 48 / 68`.
2. Release gate hẹp vẫn báo PASS vì chưa gọi toàn bộ validator tài chính cốt lõi. Đây là lỗ hổng release-governance cần sửa.
3. Mô hình hiện thiên về management P&L và commercial decisions; chưa có monthly integrated income statement–balance sheet–cash flow đủ sâu.
4. Chưa có synthetic trial balance, GL mapping, journal adjustment, subledger-to-GL và accounting-to-management-P&L bridge đủ thực tế.
5. FMCG costing chưa thể hiện đầy đủ standard cost, purchase-price variance, material usage/yield, conversion/overhead absorption và slow-moving/obsolete reserve.
6. Forecast governance đã tốt ở schema/freeze/leakage control nhưng chưa có approved internal pre-close snapshot; do đó không được tuyên bố live forecast accuracy.
7. Website và recruiter package vẫn cần một nguồn metric tự động, loại bỏ nội dung/status cũ, sửa thứ tự section và hoàn tất thông tin cá nhân trên CV.
8. M&A, DCF và Monte Carlo là appendix có ích nhưng không nên lấn át câu chuyện FP&A cốt lõi.

## 1.1 Hai cách đo tiến độ

### A. Theo scope cũ — artifact coverage

- 25/26 hạng mục non-BI áp dụng được đã có artifact hoàn chỉnh hoặc hoàn chỉnh kèm caveat.
- Tỷ lệ: **96,2%**.
- Hạng mục duy nhất phụ thuộc dữ liệu ngoài: approved internal frozen forecast + post-close actuals.

Đây là tỷ lệ **có deliverable**, không phải tỷ lệ sẵn sàng tuyển dụng tuyệt đối.

### B. Theo scope mới — market-fit maturity

| Workstream | Trọng số | Điểm hiện tại | Điểm đóng góp |
|---|---:|---:|---:|
| Core P&L và financial model | 16% | 75% | 12,0% |
| Management reporting, close và controls | 12% | 75% | 9,0% |
| Budget, rolling forecast và scenarios | 15% | 80% | 12,0% |
| Commercial profitability và decision support | 13% | 95% | 12,35% |
| Working capital, liquidity và CAPEX | 10% | 90% | 9,0% |
| Business partnering và communication | 10% | 90% | 9,0% |
| Data/evidence/reproducibility | 10% | 88% | 8,8% |
| Website, CV và recruiter usability | 9% | 70% | 6,3% |
| Public-company/strategic appendix | 5% | 90% | 4,5% |
| **Tổng readiness hiện tại** | **100%** |  | **82,95% ≈ 83%** |

Mục tiêu release mới là **≥95% weighted readiness**, không có P0/P1 mở và chỉ còn external forecast evidence được ghi rõ là input-gated.

---

# 2. Research thị trường và ý nghĩa đối với project

Research ưu tiên nguồn chính thức, job đang hoạt động hoặc tài liệu nghề nghiệp có thời hạn rõ ràng.

## 2.1 Tín hiệu từ job FP&A/Commercial Finance năm 2026

### Unilever Vietnam — FP&A Manager, Cash & Trade Term Structure

Job tại TP.HCM, đăng 18/08/2026, nhấn mạnh:

- end-to-end cash forecasting và performance management;
- phối hợp Procurement, AP, AR, Supply Chain, Sales và Marketing;
- inventory, CAPEX, supplier strategy và cash collection;
- macro/external intelligence;
- cross-BU investment decisions;
- monthly channel target setting;
- biến dữ liệu thành actionable recommendations cho GM/CFO.

Nguồn: [Unilever careers — Financial Planning & Analysis Manager, Cash & Trade Term Structure](https://careers.unilever.com/fr/emploi/ho-chi-minh-ville/financial-planning-and-analysis-manager-cash-and-trade-term-structure/34155/99387089792)

**Hàm ý:** dự án đang đúng hướng ở working capital, CAPEX, business partnering và channel decisions; cần bổ sung macro-driver book, integrated cash bridge và executive-ready decision cadence.

### KMS Technology Vietnam — Revenue / Commercial FP&A

Job tại TP.HCM, đăng 15/07/2026, nhấn mạnh:

- pipeline-to-revenue và weekly Funnel-to-Cash cadence;
- Actual vs Forecast vs Budget;
- một linked financial model và single source of truth;
- standardized input schema và fixed cutoff;
- budgeting, LE updates, scenario modelling;
- CAC/LTV/churn/NRR cho tech/services;
- executive/board reporting và narrative coherence.

Nguồn: [KMS Technology careers — Revenue/Commercial FP&A](https://careers.kms-technology.com/job/financial-planning-analysis-manager-revenue-commercial-fpa-744000137837469/)

**Hàm ý:** single source of truth của project cần điều khiển website/MBR/CFO output tự động. Funnel-to-Cash chỉ nên là một optional industry variant, không pha vào case FMCG cốt lõi.

### Louis Dreyfus Company — Commercial Controlling

Role hiện hành nhấn mạnh:

- daily/weekly P&L reporting;
- month-end close, reconciliations và financial controls;
- profitability và variance analysis;
- phối hợp Commercial, Operations, Finance và Accounting;
- Advanced Excel, SAP, automation và continuous improvement.

Nguồn: [Louis Dreyfus Company — Controlling Senior Analyst](https://jobs.smartrecruiters.com/LouisDreyfusCompany/744000145364859-controlling-senior-analyst)

**Hàm ý:** project cần thể hiện rõ accounting close, GL mapping, reconciliation và controllership chứ không chỉ dashboard/analysis.

## 2.2 Chuẩn năng lực FP&A

AFP FPAC test specification áp dụng cho kỳ 2025B–2031A phân bổ:

- Financial concepts: 52–55%;
- Systems/technology: 15–20%;
- Business partnering: 28–34%;
- Analysis/projections: 40–50%;
- Models/analytics: 35–40%;
- Business communication: 13–17%.

Nội dung bao gồm budgets, rolling forecasts, close process, management accounting, cost accounting, macroeconomics, spreadsheet/database structures, version control, UAT, automation, financial projections và business communication.

Nguồn: [AFP — FPAC test specifications](https://fpacert.financialprofessionals.org/exam/specifications)

**Hàm ý:** một portfolio “outstanding” phải chứng minh tài chính, kế toán quản trị, dự báo và business partnering. Công cụ chỉ là lớp hỗ trợ.

## 2.3 Nguồn macro chính thức nên thêm

National Statistics Office of Vietnam đang công bố chuỗi CPI và USD price index theo tháng, ví dụ archive 2026 có release calendar và các kỳ tham chiếu rõ ràng.

Nguồn: [National Statistics Office — CPI archive](https://www.nso.gov.vn/en/cpi/)

**Hàm ý:** tạo macro-driver table có source date, reference period, publication lag, base/upside/downside mapping và không dùng dữ liệu xuất hiện sau forecast cutoff.

## 2.4 Năng lực thị trường và bằng chứng hiện tại

| Năng lực | Thị trường yêu cầu | Bằng chứng hiện tại | Gap | Quyết định |
|---|---|---|---|---|
| Management P&L | Rất cao | Commercial P&L, 28-tab Excel | Thấp | Giữ làm core |
| Actual/Budget/Forecast/PY | Rất cao | Có | MBR validator lỗi stale value | P0 sửa ngay |
| Rolling forecast | Rất cao | Schema, versions, demo backtest | Chưa có live internal snapshot | Giữ gate ngoài |
| Cash/working capital | Rất cao | DSO/DIO/DPO/CCC, liquidity | Thiếu full cash-flow reconciliation | P1 bổ sung |
| Close/reconciliation | Rất cao | Close calendar, checks | Thiếu TB/GL/subledger journal layer | P1 bổ sung |
| Cost accounting | Cao với FMCG/manufacturing | COGS, inventory, cost analysis | Thiếu standard-cost variance depth | P1 bổ sung |
| Profitability | Rất cao | SKU/channel/customer/promo | Mạnh | Freeze core |
| Business partnering | Rất cao | battle cards, actions, CFO memo | Cần UAT/sign-off evidence | P1 harden |
| Macro/external intelligence | Cao | Public-company layer | Chưa nối rõ vào forecast assumptions | P1 bổ sung |
| Long-range planning | Trung bình–cao | 12-month forecast, DCF appendix | Chưa có 3-year operating plan | P1 bổ sung nhẹ |
| Executive/board reporting | Cao | MBR, deck, memo | Chưa có 5-minute recorded walkthrough | P1 bổ sung |
| ERP/SAP awareness | Thường gặp | Wording guardrail | Chưa có realistic mock extract/mapping | P2 simulated only |
| Candidate credibility | Bắt buộc | CV template, evidence map | Còn placeholders | P0 input-gated |

---

# 3. Scope lock

## 3.1 Core story

> Acting as an FP&A / Commercial Finance Analyst for a fictional Vietnam omnichannel FMCG company, I built a controlled monthly planning and performance-management system that reconciles operating drivers to P&L, working capital and cash, explains deviations, and converts analysis into owned management actions.

## 3.2 Core recruiter path

Recruiter chỉ cần đi qua sáu bằng chứng:

1. One-page case summary.
2. Excel financial model.
3. MBR / CFO decision pack.
4. Three core analyses: PVM, profitability, working capital/cash.
5. Controls/evidence page.
6. One-page CV + interview walkthrough.

## 3.3 Appendix only

- public-company financial statement analysis;
- equity research rehearsal;
- credit memo;
- DCF/valuation rehearsal;
- M&A screening rehearsal;
- Monte Carlo advanced overlay;
- D2C/tech metric variant.

Không dùng appendix để làm loãng câu chuyện Junior FP&A.

## 3.4 Claim boundary

- VietNova operating data: `SIMULATED`.
- Calculations from synthetic data: `DERIVED`.
- Public-company filings: `OBSERVED` khi có nguồn chính thức.
- Forecast accuracy từ fixture: `REHEARSAL`, không phải live performance.
- EBITDA: luôn ghi `EBITDA proxy` nếu không có statutory reconciliation.
- M&A: luôn ghi `screening rehearsal`, không ghi full transaction model.
- Không tuyên bố realized savings, production impact, live SAP experience hoặc internal forecast accuracy nếu không có bằng chứng thật.

---

# 4. Priority backlog

# P0 — phải đóng trước mọi recruiter release

## P0-01 — Sửa MBR validator và canonical scenario contract

### Vấn đề

`validate_monthly_business_review.mjs` đang hard-code scenario cũ trong khi `data/scenarios/scenario_summary.csv` đã là nguồn chuẩn mới.

### Công việc

1. Xóa mọi expected value hard-code khỏi validator.
2. Validator đọc trực tiếp `scenario_summary.csv`.
3. Parse MBR table theo metric ID, period và scenario.
4. So sánh Revenue, Gross Profit, OPEX, EBITDA proxy, margin, Contribution và CCC.
5. Tolerance tiền: `0.01 VND bn`; ratio: `0.01 pp`; days: `0.1 day`.
6. Thêm test cố ý thay một giá trị MBR để chứng minh validator fail.
7. Regenerate `MONTHLY_BUSINESS_REVIEW_QA.md` từ validator, không viết tay.

### Acceptance

- MBR validator PASS 15/15.
- `run_finance_qa.mjs` không còn fail vì MBR.
- Không còn literal scenario number trong validator.
- MBR, website, CFO memo và metric snapshot cùng một value source.

## P0-02 — Sửa release gate để không cho false-green

### Vấn đề

Non-BI release gate PASS 12/12 trong khi full finance QA đang FAIL.

### Công việc

1. `run_non_powerbi_release_gate.py` phải gọi full core-finance validator registry.
2. Tách `core_required`, `appendix_required`, `external_input`.
3. Core fail bất kỳ -> `final_release_status = FAIL`.
4. Appendix fail -> `REVIEW_REQUIRED`, không nhất thiết chặn core release nếu appendix bị ẩn.
5. External forecast input -> `PENDING_EXTERNAL_INPUT`, không tính như code defect.
6. Xuất JSON và Markdown từ cùng một run.

### Acceptance

- Không thể có `release PASS` khi bất kỳ core validator nào fail.
- Status file ghi commit SHA, timestamp, script versions và tested artifact hashes.
- Clean clone chạy một lệnh cho cùng kết quả.

## P0-03 — Tạo canonical project status không phụ thuộc BI

### File cần có

- `data/governance/project_status_nonbi.json`
- `data/governance/recruiter_metric_snapshot.json`
- `reports/NONBI_RELEASE_MANIFEST_YYYY-MM-DD.md`

### Nội dung

- project version;
- source dataset version;
- current closed period;
- core/appendix/external status;
- headline scenario metrics;
- QA totals;
- evidence boundary;
- recruiter links;
- CV personalization status.

### Acceptance

- Website và release report đọc/generate từ status này.
- Không có hai nguồn status độc lập.

## P0-04 — Recruiter website cleanup

### Công việc

1. Xóa các panel, links và gate không nằm trong scope hiện tại khỏi recruiter path.
2. Sửa thứ tự DOM: valuation/appendix nằm trước recruiter quick tour; footer luôn cuối cùng.
3. Sửa project version/date theo manifest hiện hành.
4. Thay hard-coded headline metrics bằng generated JSON.
5. Chia navigation thành `FP&A Core`, `Evidence`, `Appendix`, `Contact`.
6. Trang đầu trong 30 giây phải trả lời: problem, decision, impact, model, evidence boundary.
7. Gắn nhãn appendix rõ ràng cho equity research, credit, DCF và M&A.
8. Kiểm tra mobile, keyboard navigation, contrast, broken links và download links.

### Acceptance

- 0 broken internal/external links trong automated link check.
- Footer cuối DOM.
- 0 stale metric so với canonical snapshot.
- Recruiter có đường đi ≤5 phút để hiểu project.
- Không có status/gate bị loại khỏi scope xuất hiện trên website chính.

## P0-05 — Candidate personalization

### Input cần chủ dự án cung cấp

- tên đầy đủ;
- city/country;
- email, phone;
- LinkedIn, GitHub;
- degree, major, university, graduation date;
- work/internship experience thật;
- English level;
- certification thật;
- job locations và industry ưu tiên.

### Acceptance

- 0 bracket placeholder trong CV/PDF/website.
- Mọi claim có evidence-map row.
- CV một trang tiếng Anh.
- Projects nằm trên Education nếu đây là bằng chứng mạnh nhất.

---

# P1 — finance depth bắt buộc để đạt ≥95%

## P1-01 — Monthly integrated three-statement model

### Mục tiêu

Nâng project từ commercial analytics thành corporate FP&A model có P&L, balance sheet và cash flow liên kết.

### Phạm vi

#### Income statement

- Net Revenue;
- COGS;
- Gross Profit;
- variable selling and trade spend;
- Contribution;
- controllable OPEX;
- EBITDA proxy;
- D&A;
- EBIT;
- finance cost;
- PBT;
- tax;
- PAT.

#### Balance sheet

- cash;
- AR;
- inventory;
- other current assets;
- PP&E gross, accumulated depreciation, net PP&E;
- AP;
- accruals;
- debt/current portion;
- equity/retained earnings.

#### Cash flow — indirect method

```text
PAT
+ D&A
/- working-capital movements
= CFO
- CAPEX
= pre-financing FCF
+/- debt drawdown/repayment
- interest/dividends where modeled
= net movement in cash
```

### Required schedules

- AR: opening + credit sales − collections − write-off = closing;
- inventory: opening + purchases/production − COGS − write-off = closing;
- AP: opening + purchases − supplier payment = closing;
- fixed assets: opening gross + CAPEX − disposals = closing gross;
- accumulated depreciation roll-forward;
- debt schedule and interest;
- retained earnings roll-forward;
- cash roll-forward.

### Controls

- Assets = Liabilities + Equity every month;
- cash-flow closing cash = balance-sheet cash;
- PAT ties between IS and retained earnings;
- D&A ties IS, cash flow and fixed-asset schedule;
- debt ties balance sheet, interest and financing cash flow;
- zero plug except a clearly disclosed initial opening-balance setup.

### Deliverables

- 8–10 new Excel schedules;
- three-statement methodology note;
- monthly three-statement CSV export;
- reconciliation report;
- one executive cash bridge.

## P1-02 — Trial balance, GL and management reporting bridge

### Mục tiêu

Thể hiện Financial Analyst hiểu close/accounting interface, không chỉ model outputs.

### Synthetic data layer

- chart of accounts;
- monthly trial balance;
- cost center, profit center, brand, channel mapping;
- source system and posting date;
- journal type: standard/accrual/reclass/adjustment;
- document ID and preparer/approver fields.

### Required bridges

1. Trial Balance -> statutory/accounting P&L.
2. Accounting P&L -> management P&L.
3. Management P&L -> contribution view.
4. AR/AP/inventory subledger -> GL control accounts.
5. Fixed asset register -> GL PP&E and depreciation.

### Sample close entries

- trade-spend accrual;
- rebate true-up;
- inventory reserve;
- freight accrual;
- prepaid marketing amortization;
- depreciation;
- FX revaluation where relevant;
- reclass between COGS/OPEX with approval trail.

### Acceptance

- debits = credits;
- every GL account mapped exactly once or listed in exception queue;
- all subledger control accounts reconcile within VND 1;
- journal adjustments carry owner, reason, support and approval status;
- close checklist uses WD-5 to WD+5 calendar.

## P1-03 — FMCG standard costing and supply-chain finance

### Required analytics

- standard material cost;
- actual purchase cost;
- purchase-price variance;
- material usage/yield variance;
- labor/conversion variance;
- fixed-overhead volume/absorption variance;
- freight variance;
- inventory revaluation;
- slow-moving/obsolete reserve;
- write-off and shrinkage;
- cost bridge Standard -> Actual COGS.

### Core formulas

```text
Purchase Price Variance = Actual Quantity × (Actual Price − Standard Price)
Usage Variance = Standard Price × (Actual Quantity − Standard Quantity for Actual Output)
Volume/Absorption Variance = Budget Fixed OH − Fixed OH Absorbed
Inventory Reserve = Aging Bucket Value × Approved Reserve Rate
```

### Acceptance

- all variances reconcile to Actual COGS vs Standard COGS;
- SKU/category/channel rollups tie to company;
- no favorable/unfavorable sign ambiguity;
- reserve rates have policy source and sensitivity;
- outputs feed P&L, inventory and cash flow.

## P1-04 — Forecast versioning and backtest v2

### Build now with synthetic evidence

- Budget, RF1, RF2, RF3, Latest Estimate and Actual;
- 1-, 2-, 3- and 6-month horizon;
- Bias, WAPE, MAE and forecast-value-add;
- revenue, gross profit, EBITDA proxy, cash and working-capital metrics;
- version bridge: price/volume/mix/cost/OPEX/WC;
- override log with reason/owner/date;
- baseline forecast vs analyst override.

### External input boundary

Một approved internal pre-close snapshot và post-close actuals vẫn cần để tuyên bố live accuracy. Synthetic backtest chỉ chứng minh phương pháp.

### Acceptance

- freeze timestamp < actual available timestamp;
- no future leakage;
- metrics by horizon and vintage;
- bias sign documented;
- WAPE denominator policy documented;
- live claims blocked unless evidence class = approved real frozen.

## P1-05 — Macro, commodity and FX driver book

### Table design

- driver_id;
- driver_name;
- reference period;
- publication date;
- forecast cutoff eligibility;
- source URL;
- observed value;
- base/upside/downside assumption;
- affected P&L/BS line;
- lag;
- pass-through rate;
- owner;
- last review date.

### Minimum drivers

- CPI;
- USD/VND proxy or official reference series;
- food/beverage input-cost proxy;
- fuel/logistics proxy;
- wage inflation assumption;
- interest-rate assumption;
- retail-sales growth context.

### Acceptance

- no value published after forecast cutoff enters that forecast version;
- source and reference period separated;
- macro drivers connect quantitatively to forecast assumptions;
- sensitivity shows impact on revenue, margin and cash.

## P1-06 — Three-year driver-based operating plan

### Scope

- Year 1 monthly;
- Years 2–3 quarterly or annual;
- volume, price, mix, channel, distribution and capacity drivers;
- gross margin and OPEX envelope;
- headcount;
- CAPEX and depreciation;
- working capital and cash;
- Base/Upside/Downside;
- strategic initiatives with stage gates.

### Acceptance

- strategic plan reconciles to year-one rolling forecast;
- every initiative has owner, investment, timing, benefit, risk and kill criteria;
- no terminal growth logic used in operating plan;
- cash and funding implications are explicit.

## P1-07 — Executive/board reporting pack

### Deliverables

1. One-page CFO scorecard.
2. 10–12 slide monthly operating review.
3. Two-page decision memo.
4. One-page risk/opportunity register.
5. One-page action realization tracker.
6. Five-minute recorded walkthrough or narrated screen capture.

### Narrative standard

Every insight uses:

```text
What happened -> Why -> Financial impact -> Decision -> Owner -> Deadline -> Guardrail
```

### Acceptance

- ≤5 headline decisions;
- every number traces to metric ID;
- every action has owner/date/status;
- no insight only describes a chart;
- deck opens independently of the model;
- walkthrough stays below six minutes.

## P1-08 — UAT, change control and model governance

### Artifacts

- model change log;
- assumption approval log;
- UAT cases by business persona;
- version/release policy;
- model-owner and reviewer RACI;
- control evidence archive;
- exception and remediation log.

### UAT personas

- CFO;
- Commercial Director;
- Sales;
- Marketing;
- Supply Chain;
- Accounting/Controlling.

### Acceptance

- each persona has at least three decision tests;
- expected result, observed result, reviewer and date present;
- material model changes require before/after output comparison;
- zero unresolved severity-1/2 issue at release.

## P1-09 — Website and recruiter package finalization

### Website hierarchy

1. Hero: one business question and three decisions.
2. Core FP&A model.
3. Variance/PVM.
4. Profitability.
5. Cash/working capital.
6. Forecast/scenario.
7. Close/control architecture.
8. Evidence boundary.
9. Appendix.
10. Downloads/contact.

### Download package

- one-page case summary PDF;
- Excel model;
- CFO memo;
- management deck;
- methodology and data dictionary;
- QA/release manifest;
- CV;
- GitHub repository.

### Acceptance

- first screen understandable in 30 seconds;
- core story reviewable in five minutes;
- full technical review in 20–30 minutes;
- all files open from GitHub/Drive;
- no local-only link;
- no candidate placeholder.

---

# P2 — optional differentiators, chỉ làm sau P0/P1

## P2-01 — Correlated Monte Carlo v2

- keep current independent version as archived v1;
- use documented correlation matrix;
- label judgmental correlations as assumptions;
- validate positive semidefinite matrix;
- add expected shortfall and downside-driver attribution;
- keep in appendix, not top CV bullet.

## P2-02 — SAP-like finance extraction rehearsal

- simulated FI/CO-style fields only;
- document type, company code, cost center, profit center, GL account;
- mapping to management P&L;
- reconciliation and exception queue;
- wording: `SAP-like mapping rehearsal`, never `SAP production experience`.

## P2-03 — Tech/services industry variant

Only when applying to SaaS/technology FP&A:

- pipeline, bookings and revenue;
- ARR/MRR, churn, NRR;
- CAC/LTV and payback;
- Funnel-to-Cash cadence;
- separate dataset and narrative from FMCG core.

## P2-04 — Automated commentary draft

- generate first-draft variance commentary from approved metric snapshot;
- require human reviewer/approval;
- prohibit unsupported causal claims;
- archive generated vs approved commentary.

---

# 5. Execution roadmap

## Sprint 0 — Scope and truth reset (1 day)

### Tasks

- freeze current repo SHA and release manifest;
- mark BI artifacts outside current recruiter scope;
- classify core vs appendix;
- capture current QA failures;
- approve this master plan.

### Exit

- one scope file;
- one status source;
- one prioritized backlog;
- no ambiguity between FP&A and Project Finance.

## Sprint 1 — P0 release repair (2–3 days)

### Tasks

- fix MBR validator;
- harden full release gate;
- generate canonical status JSON;
- clean website scope/status/order;
- prepare candidate intake.

### Exit

- full core QA PASS;
- non-BI release gate cannot false-green;
- website has no stale metric/status;
- CV personalization inputs listed.

## Sprint 2 — Accounting and three-statement layer (5–7 days)

### Tasks

- build CoA and synthetic trial balance;
- build journal/close layer;
- create P&L/BS/CF schedules;
- build subledger and fixed-asset tie-outs;
- connect retained earnings/debt/cash.

### Exit

- 36 months integrated statements;
- balance sheet balances monthly;
- cash ties exactly;
- close pack and reconciliation report PASS.

## Sprint 3 — Costing and supply-chain finance (4–5 days)

### Tasks

- standard-cost master;
- purchase/usage/absorption/freight variances;
- inventory reserve and write-off;
- COGS bridge;
- SKU/category/plant-like cost views.

### Exit

- Standard-to-Actual COGS bridge reconciles;
- inventory/P&L/cash effects linked;
- supply-chain finance decision memo complete.

## Sprint 4 — Forecast, macro and long-range plan (5–6 days)

### Tasks

- RF1/RF2/RF3/LE versions;
- multi-horizon backtest;
- override and forecast-value-add analysis;
- macro/FX/input-cost driver book;
- three-year operating plan.

### Exit

- synthetic forecast governance fully demonstrable;
- live-accuracy claim remains correctly gated;
- scenario and cash implications reconcile.

## Sprint 5 — Executive communication and recruiter release (3–4 days)

### Tasks

- refresh CFO scorecard, MBR, deck and memo;
- create one-page case PDF;
- record five-minute walkthrough;
- finalize website and CV;
- run UAT and broken-link checks;
- publish GitHub/Drive release.

### Exit

- weighted readiness ≥95%;
- 0 P0/P1 open;
- all recruiter files remotely accessible;
- one release index and one version number.

## Sprint 6 — Optional appendix (không chặn release)

- correlated Monte Carlo;
- ERP/SAP-like mapping;
- tech/services variant;
- commentary automation.

---

# 6. Detailed file plan

## New data

```text
data/accounting/chart_of_accounts.csv
data/accounting/trial_balance_monthly.csv
data/accounting/journal_adjustments.csv
data/accounting/gl_management_mapping.csv
data/accounting/subledger_reconciliation.csv
data/financial_statements/monthly_income_statement.csv
data/financial_statements/monthly_balance_sheet.csv
data/financial_statements/monthly_cash_flow.csv
data/costing/standard_cost_master.csv
data/costing/cost_variance_monthly.csv
data/macros/macro_driver_book.csv
data/forecast/forecast_vintages.csv
data/governance/project_status_nonbi.json
data/governance/recruiter_metric_snapshot.json
```

## New schemas

```text
schemas/chart_of_accounts.schema.json
schemas/trial_balance.schema.json
schemas/journal_adjustment.schema.json
schemas/three_statement_output.schema.json
schemas/standard_cost.schema.json
schemas/macro_driver.schema.json
```

## New/updated documentation

```text
docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md
docs/GL_TO_MANAGEMENT_PNL_BRIDGE.md
docs/FMCG_STANDARD_COSTING_AND_VARIANCE.md
docs/MACRO_DRIVER_AND_FORECAST_CUTOFF_POLICY.md
docs/THREE_YEAR_OPERATING_PLAN.md
docs/UAT_AND_MODEL_CHANGE_CONTROL.md
reports/CORE_FINANCE_RELEASE_GATE.md
reports/THREE_STATEMENT_RECONCILIATION.md
reports/COST_VARIANCE_RECONCILIATION.md
reports/NONBI_RELEASE_MANIFEST_YYYY-MM-DD.md
```

## New validators

```text
scripts/validate_trial_balance.mjs
scripts/validate_gl_management_mapping.mjs
scripts/validate_three_statement_model.mjs
scripts/validate_standard_cost_variances.mjs
scripts/validate_macro_cutoff.mjs
scripts/validate_forecast_vintages.mjs
scripts/validate_recruiter_snapshot.mjs
scripts/run_core_finance_release.mjs
```

---

# 7. QA matrix

| ID | Control | Tolerance / rule | Release severity |
|---|---|---|---|
| QA-F01 | Gross Sales = Units × Unit Price | VND 1 | P0 |
| QA-F02 | Net Sales bridge | VND 1 | P0 |
| QA-F03 | PVM start + effects = end | ≤0.01% of revenue | P0 |
| QA-F04 | Customer/channel/SKU = company | VND 1 | P0 |
| QA-F05 | Debit = Credit | VND 1 | P0 |
| QA-F06 | Subledger = GL | VND 1 | P0 |
| QA-F07 | Assets = Liabilities + Equity | VND 1 monthly | P0 |
| QA-F08 | Cash flow closing cash = BS cash | VND 1 monthly | P0 |
| QA-F09 | PAT/retained earnings tie | VND 1 | P0 |
| QA-F10 | Fixed asset/D&A tie | VND 1 | P0 |
| QA-F11 | Standard-to-Actual COGS bridge | VND 1 | P1 |
| QA-F12 | Inventory reserve recalculation | VND 1 | P1 |
| QA-F13 | Forecast freeze before actual availability | strict | P0 |
| QA-F14 | Forecast metrics by vintage/horizon | exact formula | P1 |
| QA-F15 | Macro data publication cutoff | no leakage | P0 |
| QA-F16 | Scenario identities | 1 bp / 0.1 day | P0 |
| QA-F17 | Cross-artifact metric equality | defined tolerance | P0 |
| QA-F18 | Claim boundary | zero forbidden claim | P0 |
| QA-F19 | Website link integrity | zero broken link | P1 |
| QA-F20 | CV placeholder scan | zero placeholder | P0 |
| QA-F21 | Clean-clone reproducibility | deterministic hash | P1 |
| QA-F22 | UAT severity 1/2 | zero open | P0 |

---

# 8. CV conversion plan

## 8.1 Core bullets after P1 completion

### Bullet 1 — Planning and performance

> Built a 36-month, driver-based FP&A model for a fictional Vietnam FMCG company, integrating monthly P&L, balance sheet and cash flow with Budget, rolling forecast, prior-year and scenario views; reconciled operating schedules through controlled finance checks.

### Bullet 2 — Commercial finance

> Explained revenue and margin performance through price-volume-mix, SKU/channel/customer profitability, promotion ROI and working-capital-aware contribution, converting findings into quantified actions, owners and guardrails.

### Bullet 3 — Close, costing and governance

> Designed a synthetic trial-balance-to-management-P&L bridge, standard-cost variance analysis, WD-5 to WD+5 close cadence, KPI dictionary and automated cross-artifact controls; maintained explicit boundaries between simulated, derived and public evidence.

Các bullet phải được rút gọn theo CV một trang và chỉ dùng số thực sự còn đúng sau final QA.

## 8.2 Interview proof

Ứng viên phải giải thích được:

- Why management P&L differs from accounting P&L;
- PVM formula and residual;
- why revenue growth can destroy cash;
- DSO/DIO/DPO and CCC;
- how forecast version leakage occurs;
- standard vs actual cost variances;
- how three statements connect;
- one management disagreement and negotiated guardrail;
- synthetic/public/derived evidence boundary;
- what would change with real company data.

---

# 9. Definition of done

Project đạt `RECRUITER_READY_NONBI` khi:

1. Full core finance QA PASS.
2. Release gate không thể PASS nếu core validator fail.
3. Monthly P&L, balance sheet và cash flow reconcile 36/36 months.
4. Trial balance, journals và subledgers reconcile.
5. Standard-to-Actual COGS bridge reconcile.
6. Budget/RF/LE/Actual versioning và synthetic backtest pass no-leakage tests.
7. External live forecast accuracy vẫn được ghi đúng là pending input nếu chưa có dữ liệu thật.
8. Website dùng canonical metric/status source, không có stale number.
9. Footer, navigation, core/appendix hierarchy đúng.
10. CV không có placeholder và mọi claim traceable.
11. One-page case, Excel, memo, deck, QA manifest và CV mở được từ GitHub/Drive.
12. Clean clone chạy một lệnh và tái tạo kết quả.
13. Không có local-only artifact.
14. M&A/DCF/Monte Carlo không lấn át core FP&A story.
15. Weighted readiness đạt tối thiểu 95%.

---

# 10. Immediate next actions

## Có thể làm ngay, không cần thêm input

1. Fix MBR validator stale values.
2. Fix false-green release gate.
3. Generate canonical non-BI status/metric JSON.
4. Build three-statement design and synthetic GL/TB architecture.
5. Build standard-cost variance specification.
6. Add macro-driver schema and cutoff controls.
7. Clean website scope/order/status and appendix hierarchy.
8. Prepare final recruiter release manifest.

## Cần input của chủ dự án

1. Candidate identity/contact/education/experience for final CV.
2. Industry preference ordering: FMCG/retail, manufacturing, technology/services or general corporate.
3. Approved internal frozen forecast and later actuals only if live forecast accuracy is desired.

## Không được tự suy diễn

- employer impact;
- realized savings;
- internal forecast accuracy;
- live ERP/SAP experience;
- production company data;
- statutory EBITDA;
- full live M&A diligence.

---

# 11. Final recommendation

Không nên thêm một module phân tích mới chỉ để tăng số lượng. Dự án đã đủ rộng. Con đường nâng từ **83% market-fit maturity lên ≥95%** là:

1. đóng lỗ hổng QA/release trước;
2. thêm integrated three-statement;
3. thêm TB/GL/close reconciliation;
4. thêm FMCG standard costing;
5. nâng forecast versioning, macro drivers và three-year plan;
6. hoàn tất website/CV/recruiter walkthrough;
7. giữ public research và strategic finance ở appendix.

Khi hoàn tất theo thứ tự này, project sẽ thể hiện đúng năng lực **Financial Analyst / FP&A / Business Finance**: hiểu số, hiểu kế toán quản trị, kiểm soát được mô hình, giải thích được performance, quản lý cash và chuyển analysis thành quyết định.
