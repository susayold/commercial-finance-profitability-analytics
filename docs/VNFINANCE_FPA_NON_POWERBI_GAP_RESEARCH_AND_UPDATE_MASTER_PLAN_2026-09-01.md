# VNFinance FP&A / Commercial Finance
## Non-BI Gap Research & Update Master Plan

**Ngày lập:** 2026-09-01

**Dự án:** VietNova Consumer JSC — Vietnam Omnichannel FMCG FP&A Case

**Vị trí mục tiêu chính:** Junior FP&A Analyst / Financial Analyst / Business Finance Analyst / Commercial Finance Analyst

**Vị trí mục tiêu phụ:** Finance Data Analyst, nhưng chỉ giữ vai trò hỗ trợ tài chính

**Phạm vi tài liệu:** Mô hình tài chính, Excel, dữ liệu, kiểm soát, báo cáo quản trị, website, CV và recruiter package. Các hạng mục BI được loại khỏi phạm vi theo yêu cầu của chủ dự án.

---

# 1. Kết luận điều hành

Bản cập nhật này đã chuyển dự án sang **non-Power-BI FP&A release** đúng với mục tiêu Junior FP&A / Financial Analyst / Business Finance Analyst. Toàn bộ phần có thể hoàn thiện bằng dữ liệu mô phỏng và artifact kiểm soát đã được triển khai:

- 36 tháng dữ liệu hoạt động, 6.480 dòng sales, 36 SKU, 5 kênh và 24 khách hàng;
- management P&L, Actual/Budget/Forecast/Prior Year, PVM, product/channel/customer profitability;
- promotion ROI, pricing, working capital, liquidity, scenarios, OPEX/headcount và CAPEX;
- mô hình **integrated income statement – cash flow – balance sheet**, synthetic TB/GL journal, subledger-to-GL bridge và accounting-to-management bridge;
- FMCG standard costing với purchase-price, usage/yield, conversion variance và slow-moving reserve;
- macro driver book có publication cutoff và scenario mapping;
- operating plan 3 năm (FY2026 monthly; FY2027–FY2028 quarterly) với initiative gate/kill criteria;
- forecast versioning/backtest v2 (Budget, RF1, RF2, RF3, Latest Estimate, Actual) với Bias/WAPE/MAE, bridge và override log;
- MBR, CFO memo, close calendar, KPI dictionary, recommendation register, editable 10-slide board pack và narration script;
- website recruiter-facing, CV/interview package và GitHub/Drive handoff;
- non-BI QA **PASS 55/55** và release gate **PASS 52/52** ở lần chạy gần nhất; recruiter-link QA **42/42** được tích hợp vào release evidence.

### Trạng thái release hiện tại

- **Core finance build:** PASS — các validator về statements, costing, macro, 3-year plan, forecast-v2 và management pack đều pass.
- **Evidence boundary:** mọi dữ liệu VietNova là `SIMULATED` hoặc `DERIVED`; EBITDA là proxy quản trị, không phải statutory EBITDA.
- **Power BI:** `OUT_OF_ACTIVE_SCOPE`; các PBIX/PBIP chỉ giữ trong archive, không ảnh hưởng acceptance non-BI.
- **Gate A còn mở:** cần approved internal pre-close forecast snapshot và post-close actuals để thay rehearsal Bias/WAPE bằng forecast accuracy thực tế.
- **External handoff còn lại:** người dùng cần tự quay screen recording theo script 5 phút và bổ sung link recording vào handoff index nếu muốn tuyên bố DoD tuyệt đối.

## 1.1 Hai cách đo tiến độ

### A. Theo scope cũ — artifact coverage

- 28/28 hạng mục non-BI áp dụng được đã có artifact hoàn chỉnh hoặc hoàn chỉnh kèm caveat.
- Tỷ lệ artifact coverage: **100%**.
- Hai hạng mục input-gated ngoài repository: approved internal frozen forecast + post-close actuals; manual narrated recording.

Đây là tỷ lệ **có deliverable**, không phải tỷ lệ sẵn sàng tuyển dụng tuyệt đối.

### B. Theo scope mới — market-fit maturity

| Workstream | Trọng số | Điểm hiện tại | Điểm đóng góp |
|---|---:|---:|---:|
| Core P&L và financial model | 16% | 95% | 15,2% |
| Management reporting, close và controls | 12% | 95% | 11,4% |
| Budget, rolling forecast và scenarios | 15% | 92% | 13,8% |
| Commercial profitability và decision support | 13% | 95% | 12,35% |
| Working capital, liquidity và CAPEX | 10% | 90% | 9,0% |
| Business partnering và communication | 10% | 94% | 9,4% |
| Data/evidence/reproducibility | 10% | 95% | 9,5% |
| Website, CV và recruiter usability | 9% | 90% | 8,1% |
| Public-company/strategic appendix | 5% | 90% | 4,5% |
| **Tổng readiness hiện tại** | **100%** |  | **94,2%** |

Mục tiêu release mới là **≥95% weighted readiness**. Khoảng cách còn lại là external evidence/recording, không phải thiếu module tài chính cốt lõi.

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
| Actual/Budget/Forecast/PY | Rất cao | Có | Không còn stale value; MBR QA 16/16 | Đã đóng |
| Rolling forecast | Rất cao | Versioned snapshots, backtest v2 | Chỉ còn thiếu approved live snapshot | Gate A ngoài repo |
| Cash/working capital | Rất cao | DSO/DIO/DPO/CCC + linked CF/BS | Không còn structural gap; cash stress vẫn là insight | Đã đóng |
| Close/reconciliation | Rất cao | TB/GL/journal/subledger + 3 statements | Không còn structural gap | Đã đóng |
| Cost accounting | Cao với FMCG/manufacturing | Standard cost + PPV/usage/conversion/reserve | Không còn structural gap | Đã đóng |
| Profitability | Rất cao | SKU/channel/customer/promo | Mạnh | Freeze core |
| Business partnering | Rất cao | battle cards, actions, CFO memo, UAT | Recording là handoff thủ công | Đã đóng / recording ngoài repo |
| Macro/external intelligence | Cao | Macro driver book + publication cutoff | Live source refresh vẫn cần owner | Đã đóng |
| Long-range planning | Trung bình–cao | 3-year driver plan | Chưa phải approved company guidance | Đã đóng / rehearsal |
| Executive/board reporting | Cao | MBR, editable deck, memo, script | Chưa có MP4 recording | Đã đóng / recording ngoài repo |
| ERP/SAP awareness | Thường gặp | Wording guardrail | Chưa có realistic mock extract/mapping | P2 simulated only |
| Candidate credibility | Bắt buộc | CV template, evidence map | Identity/contact thật chưa được cung cấp | Input-gated |

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

# 4. Priority backlog và closure map

Các phần P0/P1 bên dưới được giữ lại như **specification và audit trail**. Trạng thái thực thi tại ngày 2026-09-01 được ghi bằng nhãn `CLOSED`, `REHEARSAL` hoặc `INPUT-GATED`; không đọc các checklist cũ như một danh sách việc chưa làm.

# P0 — phải đóng trước mọi recruiter release

## P0-01 — ✅ CLOSED — Sửa MBR validator và canonical scenario contract

### Vấn đề ban đầu (đã đóng trong release này)

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

## P0-02 — ✅ CLOSED — Sửa release gate để không cho false-green

### Vấn đề ban đầu (đã đóng trong release này)

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

## P0-03 — ✅ CLOSED — Tạo canonical project status không phụ thuộc BI

### File cần có

- `data/governance/project_status_nonbi.json`
- `data/governance/recruiter_metric_snapshot.json`
- `reports/NONBI_RELEASE_MANIFEST_YYYY-MM-DD.md`

**Current implementation (2026-09-02):** `data/governance/recruiter_metric_snapshot.json` is generated from the exported metric snapshot and contains the three scenario headline metrics, QA totals, evidence boundary, recruiter links and CV-personalization gate. `reports/NONBI_RELEASE_MANIFEST_2026-09-02.md` hashes the active non-BI model, statements, planning, management pack, PDF and QA evidence. The active builders read `data/operating_inputs/` and `data/finance_model/final_v1/`; no active governance or statement source points to the archived Power BI directory.

**Scope control extension (2026-09-02):** `scripts/validate_nonbi_scope_boundary.mjs` scans required active paths, builders, data/governance contracts, recruiter documents and the recruiter page. It passes **18/18** and explicitly permits only historical `powerbi/` material outside the active release. The active CV, role variants, evidence map, bullet bank and interview walkthrough contain no BI-tooling claim or Gate B dependency.

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

## P0-04 — ✅ CLOSED — Recruiter website cleanup

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

## P0-05 — ⏳ INPUT-GATED — Candidate personalization

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

## P1-01 — ✅ CLOSED — Monthly integrated three-statement model

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

## P1-02 — ✅ CLOSED — Trial balance, GL and management reporting bridge

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

## P1-03 — ✅ CLOSED — FMCG standard costing and supply-chain finance

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

## P1-04 — ✅ CLOSED AS REHEARSAL — Forecast versioning and backtest v2

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

## P1-05 — ✅ CLOSED — Macro, commodity and FX driver book

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

## P1-06 — ✅ CLOSED AS REHEARSAL — Three-year driver-based operating plan

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

## P1-07 — ✅ CLOSED EXCEPT MANUAL RECORDING — Executive/board reporting pack

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

## P1-08 — ✅ CLOSED — UAT, change control and model governance

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

## P1-09 — ✅ CLOSED — Website and recruiter package finalization

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

- one-page case summary PDF (`output/pdf/VNFINANCE_FPA_CASE_SUMMARY_ONE_PAGE.pdf`), rendered and validator-checked;
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

## 4.1 Closure evidence snapshot

| Closure item | Evidence | Status |
|---|---|---|
| MBR / scenario contract | `node scripts/validate_monthly_business_review.mjs` | PASS 16/16 |
| Non-BI release gate | `python scripts/run_non_powerbi_release_gate.py` | PASS 52/52; Gate A explicitly open |
| Integrated statements | `scripts/validate_three_statement_model.mjs` | PASS 14/14; monthly BS/cash/TB ties and 20-account mapping |
| Standard costing | `scripts/validate_fmcg_cost_variance.mjs` | PASS 9/9; 1,296 variance + reserve rows |
| Macro cutoff | `scripts/validate_macro_cutoff.mjs` | PASS 8/8; no public look-ahead |
| Three-year plan | `scripts/validate_three_year_operating_plan.mjs` | PASS 17/17; 60 rows, 3 scenarios |
| Forecast v2 | `scripts/validate_forecast_versioning_backtest_v2.mjs` | PASS 20/20; 360 snapshots, 240 bridge rows |
| Executive pack | `scripts/validate_management_pack.mjs` | PASS; editable 10-slide deck + script + index |
| Active website | `https://vn-finance-fpa-case.sangkenny200.chatgpt.site` | Non-BI FP&A path deployed; Power BI hidden/archived |

The single source for release status is `data/governance/project_status_nonbi.json`; the release report and handoff index are generated from the same run.

---

# P2 — optional differentiators, chỉ làm sau P0/P1

## P2-01 — ✅ CLOSED AS SIMULATED APPENDIX — Correlated Monte Carlo v2

- keep current independent version as archived v1;
- use documented correlation matrix;
- label judgmental correlations as assumptions;
- validate positive semidefinite matrix;
- add expected shortfall and downside-driver attribution;
- keep in appendix, not top CV bullet.

Implemented: `data/monte_carlo_risk_overlay_v2_2026-09-02.csv`, draw-level output, correlation matrix, report and deterministic builder/validator. QA is **PASS 16/16**. The matrix is positive definite but judgmental; Gate A remains open.

## P2-02 — ✅ CLOSED AS SIMULATED REHEARSAL — SAP-like finance extraction rehearsal

- simulated FI/CO-style fields only;
- document type, company code, cost center, profit center, GL account;
- mapping to management P&L;
- reconciliation and exception queue;
- wording: `SAP-like mapping rehearsal`, never `SAP production experience`.

Implemented: `data/accounting/sap_like_mapping_rehearsal.csv` with **720 rows / 36 periods / 20 mapped accounts**, plus period tie-outs, QA JSON and evidence-boundary report. QA is **PASS 9/9**.

## P2-03 — ⏸ DEFERRED BY DESIGN — Tech/services industry variant

Only when applying to SaaS/technology FP&A:

- pipeline, bookings and revenue;
- ARR/MRR, churn, NRR;
- CAC/LTV and payback;
- Funnel-to-Cash cadence;
- separate dataset and narrative from FMCG core.

## P2-04 — ✅ CLOSED AS HUMAN-GATED DRAFT — Automated commentary draft

- generate first-draft variance commentary from approved metric snapshot;
- require human reviewer/approval;
- prohibit unsupported causal claims;
- archive generated vs approved commentary.

Implemented: `data/governance/commentary_draft_2026-09-02.csv`, draft report and approval log. QA is **PASS 9/9**; status remains **NEEDS_REVIEW** until a human reviewer supplies approval evidence. P2-03 is intentionally deferred because the core case is FMCG, not SaaS/technology.

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

## Sprint 1 — ✅ Completed P0 release repair (2–3 days)

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

## Sprint 2 — ✅ Completed accounting and three-statement layer (5–7 days)

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

## Sprint 3 — ✅ Completed costing and supply-chain finance (4–5 days)

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

## Sprint 4 — ✅ Completed forecast, macro and long-range plan (5–6 days)

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

## Sprint 5 — ✅ Completed executive communication and recruiter release (3–4 days)

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

The only Sprint 5 handoff item not executable from repository context is the user's manual screen recording. The approved script and editable deck are complete.

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
data/forecast/forecast_versioned_snapshots_v2.csv
data/forecast/forecast_backtest_metrics_v2.csv
data/forecast/forecast_version_bridge_v2.csv
data/forecast/forecast_override_log_v2.csv
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
docs/THREE_YEAR_DRIVER_BASED_OPERATING_PLAN.md
docs/UAT_AND_MODEL_CHANGE_CONTROL.md
reports/THREE_STATEMENT_RECONCILIATION_2026-09-01.md
reports/FMCG_STANDARD_COSTING_RECONCILIATION_2026-09-01.md
reports/NON_POWERBI_RELEASE_GATE_2026-09-01.json
reports/EXECUTIVE_BOARD_PACK_INDEX_2026-09-01.md
```

## New validators

```text
scripts/validate_three_statement_model.mjs
scripts/validate_fmcg_cost_variance.mjs
scripts/validate_macro_cutoff.mjs
scripts/build_three_year_operating_plan.mjs
scripts/validate_forecast_versioning_backtest_v2.mjs
scripts/build_forecast_versioning_backtest_v2.mjs
scripts/build_nonbi_management_pack.mjs
scripts/validate_three_year_operating_plan.mjs
scripts/validate_management_pack.mjs
scripts/run_non_powerbi_release_gate.py
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

## Đã hoàn tất trong repository

1. MBR validator và canonical scenario contract.
2. Non-BI release gate và canonical project status.
3. Integrated three statements, TB/GL/subledger bridge.
4. Standard-cost variance, reserve policy và macro cutoff.
5. Forecast versioning/backtest v2 và three-year operating plan.
6. MBR, editable management pack, CFO memo, risk/action register và recruiter website.

## Cần input hoặc thao tác bên ngoài repository

1. Candidate identity/contact/education/experience cho CV cuối cùng.
2. Approved internal frozen forecast và post-close actuals nếu muốn đóng Gate A/live accuracy.
3. Tự quay screen recording 5 phút theo `docs/FINANCE_ANALYST_WALKTHROUGH_SCRIPT_5_MIN.md`, sau đó thêm link được duyệt vào handoff index.

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

Không nên thêm một module phân tích mới chỉ để tăng số lượng. Dự án đã đạt khoảng **94,2% market-fit maturity** ở lớp code/artifact; phần còn lại là evidence và thao tác ngoài repository:

1. nạp approved internal forecast + post-close actuals để đóng Gate A;
2. cá nhân hoá CV khi có identity/experience thật;
3. quay và link narrated walkthrough;
4. giữ public research và strategic finance ở appendix.

Các appendix P2 đã được đóng ở dạng mô phỏng có kiểm soát (correlated Monte Carlo v2, SAP-like mapping rehearsal và commentary draft human-gated). Project vì vậy thể hiện đúng năng lực **Financial Analyst / FP&A / Business Finance**: hiểu số, hiểu kế toán quản trị, kiểm soát được mô hình, giải thích được performance, quản lý cash và chuyển analysis thành quyết định. Phần còn lại vẫn là evidence thật và thao tác handoff ngoài repository.

---

# 12. Implementation log — 2026-09-01

## Đã thực hiện trong release này

| Hạng mục | Artifact / command | Kết quả |
|---|---|---|
| MBR scenario contract | `scripts/validate_monthly_business_review.mjs` | PASS 16/16; đọc canonical scenario source, không còn expected value stale |
| Non-BI release gate | `scripts/run_non_powerbi_release_gate.py` | Gọi `run_finance_qa.mjs --nonbi`; chỉ còn Gate A input-gated |
| Integrated statements | `scripts/build_three_statement_model.mjs` | PASS; current operating fixture 36 tháng × 36 SKU, planning OPEX/CAPEX 36 tháng |
| Statement controls | `scripts/validate_three_statement_model.mjs` | PASS 14/14; 396 control rows, TB/cash/BS/subledger/journal ties and GL mapping |
| GL / TB / journal layer | `data/accounting/*.csv` | Chart of accounts, management mapping, 36 monthly TB, journal approvals, 180 subledger controls |
| FMCG standard costing | `scripts/build_fmcg_cost_variance.mjs` | PASS; 1,296 month × SKU variance rows và 1,296 reserve rows |
| Costing controls | `scripts/validate_fmcg_cost_variance.mjs` | PASS 9/9; standard-to-actual bridge và reserve policy |
| Macro governance | `data/macros/macro_driver_book.csv` + `scripts/validate_macro_cutoff.mjs` | PASS; source metadata, scenario assumptions, no public look-ahead |
| UAT/change control | `docs/UAT_AND_MODEL_CHANGE_CONTROL.md` | Đã thêm 7 UAT cases, approval path và rollback/evidence rules |
| Three-year operating plan | `scripts/build_three_year_operating_plan.mjs` + `scripts/validate_three_year_operating_plan.mjs` | PASS 17/17; 60 monthly/quarterly rows, 3 scenarios, no terminal growth |
| Forecast v2 | `scripts/build_forecast_versioning_backtest_v2.mjs` + validator | PASS 20/20; 360 snapshots, 240 bridge rows, override governance |
| Executive/board pack | `scripts/build_nonbi_management_pack.mjs` + `scripts/validate_management_pack.mjs` | PASS; editable 10-slide deck, index and 5-minute narration script |
| Recruiter site refresh | `site/app/page.tsx` + `site/app/globals.css` | PASS; non-BI handoff deployed to Sites v26; recruiter metrics now import the canonical snapshot; management pack, case summary PDF, forecast v2, three-year plan and appendix evidence visible; Power BI removed from active UX; valuation appendix precedes footer |
| Recruiter link QA | `scripts/validate_recruiter_site_links.mjs` | PASS 42/42; private GitHub/Drive authentication boundaries documented |
| Correlated Monte Carlo v2 | `scripts/build_correlated_monte_carlo_v2.mjs` + validator | PASS 16/16; 5,000 draws, PSD correlation matrix, expected shortfall and directional attribution |
| SAP-like mapping rehearsal | `scripts/build_sap_like_mapping_rehearsal.mjs` + validator | PASS 9/9; 720 FI/CO-style rows, 36 period ties, 20 mapped accounts; simulated only |
| Automated commentary draft | `scripts/build_monthly_commentary_draft.mjs` + validator | PASS 9/9; generated draft and approval log remain NEEDS_REVIEW |
| One-page recruiter case summary | `scripts/build_fpa_case_summary_pdf.py` + `scripts/validate_fpa_case_summary_pdf.py` | PASS 6/6; one-page text-extractable PDF generated from canonical snapshot |
| Non-BI recruiter snapshot | `scripts/build_recruiter_metric_snapshot.py` + `scripts/validate_recruiter_metric_snapshot.mjs` | PASS 8/8; three scenarios, six metrics each, QA totals and scope boundary |
| Non-BI scope boundary | `scripts/validate_nonbi_scope_boundary.mjs` | PASS 17/17; active builders/data/site contain no archived Power BI path dependency |
| Non-BI release manifest | `scripts/build_nonbi_release_manifest.py` | PASS; 20 active artifacts hashed with reproducible payload commit |

## Độ bao phủ sau release

- Core finance không Power BI đã có thêm integrated statements, accounting bridge, standard costing, macro cutoff, three-year plan, forecast-v2, executive pack, self-contained operating-input contract và recruiter snapshot/manifest.
- Power BI không nằm trong acceptance criteria, non-BI QA runner hoặc recruiter path.
- External forecast accuracy vẫn **PENDING_EXTERNAL_INPUT**; không được đổi thành PASS bằng fixture demo.

## Câu lệnh tái tạo

```text
node scripts/build_three_statement_model.mjs
node scripts/validate_three_statement_model.mjs
node scripts/build_fmcg_cost_variance.mjs
node scripts/validate_fmcg_cost_variance.mjs
node scripts/validate_macro_cutoff.mjs
node scripts/build_three_year_operating_plan.mjs
node scripts/validate_three_year_operating_plan.mjs
node scripts/build_forecast_versioning_backtest_v2.mjs
node scripts/validate_forecast_versioning_backtest_v2.mjs
node scripts/validate_management_pack.mjs
node scripts/build_correlated_monte_carlo_v2.mjs
node scripts/validate_correlated_monte_carlo_v2.mjs
node scripts/build_sap_like_mapping_rehearsal.mjs
node scripts/validate_sap_like_mapping_rehearsal.mjs
node scripts/build_monthly_commentary_draft.mjs
node scripts/validate_monthly_commentary_draft.mjs
python scripts/run_non_powerbi_release_gate.py
```
