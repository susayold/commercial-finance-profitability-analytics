# VNFinance FP&A — Active Execution Plan (No Power BI)

**Ngày lập:** 2026-09-02  
**Dự án:** VietNova Consumer JSC — Vietnam Omnichannel FMCG FP&A Case  
**Định vị nghề nghiệp:** Junior FP&A Analyst / Financial Analyst / Business Finance Analyst / Commercial Finance Analyst  
**Phạm vi:** Finance-first, Excel/model-driven, có dữ liệu, kiểm soát, quản trị hiệu quả và business partnering.

> **Scope lock:** Power BI không phải deliverable của dự án này. Không có backlog, acceptance criterion, KPI hay recruiter claim nào phụ thuộc Power BI. Các file Power BI cũ chỉ được giữ ở khu vực archive để traceability và không nằm trong đường dẫn release.

---

## 1. Mục tiêu cuối cùng

Xây một case FP&A end-to-end có thể trình bày trong 5 phút và có thể audit lại từ dữ liệu tới quyết định:

1. Nhập dữ liệu vận hành có version, source và evidence class rõ ràng.
2. Chuyển driver vận hành thành P&L, balance sheet và cash flow liên kết.
3. So sánh Actual vs Budget vs Forecast vs Prior Year và giải thích variance.
4. Phân tích profitability theo SKU, channel, customer và promotion.
5. Quản trị working capital, liquidity, OPEX, headcount và CAPEX.
6. Chạy rolling forecast, scenario và sensitivity có guardrails.
7. Chuyển insight thành recommendation có owner, deadline, impact và status.
8. Xuất management pack, CFO memo, CV, website và evidence index nhất quán.

### Câu chuyện recruiter chuẩn

> I built a controlled monthly FP&A system for a fictional Vietnam omnichannel FMCG company. The model reconciles operating drivers to the P&L, balance sheet and cash flow, explains Actual vs Budget/Forecast variances, identifies profitability and working-capital actions, and converts the analysis into management decisions with auditable controls.

---

## 2. Scope và nguyên tắc kiểm soát

### 2.1 Active scope — bắt buộc

| Workstream | Kết quả cần có | Tỷ trọng readiness |
|---|---|---:|
| Data contract & governance | operating input contract, source manifest, evidence/claim boundary | 10% |
| Integrated financial model | P&L, BS, CF, schedules, TB/GL bridge | 20% |
| Planning & forecasting | budget, rolling forecast, scenario, backtest, override log | 20% |
| Commercial profitability | PVM, standard costing, promo ROI, price/mix, customer/channel | 15% |
| Cash, WC, OPEX & CAPEX | DSO/DIO/DPO/CCC, liquidity, headcount, asset planning | 10% |
| Management reporting & partnering | MBR, CFO memo, actions, close calendar, UAT | 15% |
| Recruiter packaging | case PDF, editable deck, website, CV, interview script, handoff | 10% |
| **Tổng** |  | **100%** |

### 2.2 Loại khỏi scope

- Power BI Desktop/Service, PBIX, PBIP, PBIT, DAX và refresh gateway.
- Claims về realtime dashboard, DirectQuery, automatic page refresh hoặc Power BI deployment.
- Đưa BI tooling vào CV, case summary hoặc phỏng vấn như năng lực đã dùng thật.

### 2.3 Evidence boundary

- VietNova operating data: `SIMULATED`.
- Tính toán trên dữ liệu mô phỏng: `DERIVED`.
- Public filings: `OBSERVED` / `CALCULATED_PUBLIC`.
- Forecast accuracy chưa có dữ liệu nội bộ được phê duyệt: `REHEARSAL`.
- EBITDA không có statutory bridge: ghi `EBITDA proxy`.
- M&A/valuation/equity research: `APPENDIX / SYNTHETIC REHEARSAL`, không lấn át FP&A core.

---

## 3. Roadmap thực thi

### Phase 0 — Scope lock và source-of-truth (P0)

**Mục tiêu:** chỉ còn một đường dẫn dữ liệu và một trạng thái release.

**Việc phải làm**

1. Chốt `data/operating_inputs/` là nguồn operating input active.
2. Chốt `data/finance_model/final_v1/` là contract mô hình active.
3. Chốt `data/governance/project_status_nonbi.json` là status machine-readable.
4. Tạo recruiter metric snapshot từ canonical exported metrics.
5. Gắn source, scenario, period, version và evidence class cho mọi output.
6. Kiểm tra active builders không đọc `powerbi/`.

**Acceptance**

- Một command tạo lại snapshot và status.
- Không có active source dependency vào Power BI.
- Mọi headline metric trên website/PDF/deck khớp snapshot.

**Artifact chính**

- `data/operating_inputs/manifest.json`
- `data/finance_model/final_v1/source_manifest.csv`
- `data/governance/recruiter_metric_snapshot.json`
- `data/governance/project_status_nonbi.json`
- `scripts/validate_nonbi_scope_boundary.mjs`

### Phase 1 — Operating data và model foundation (P0)

**Mục tiêu:** dữ liệu đủ chi tiết để giải thích revenue, cost, margin và cash.

**Data contract**

- 36 tháng lịch sử và kế hoạch.
- 6.480 dòng sales ở cấp tháng × SKU × channel × customer.
- 36 SKU, 5 channel, 24 customer.
- Budget, forecast, AR, AP, inventory, debt, promotion, OPEX/headcount và CAPEX.
- Primary key, data type, unit, currency, period, source file, evidence class.

**Driver tree**

```text
Units × ASP = Gross Sales
Gross Sales − discounts − returns − rebates = Net Revenue
Net Revenue − COGS = Gross Profit
Gross Profit − trade spend − variable selling cost = Contribution
Contribution − controllable OPEX = EBITDA proxy
EBITDA proxy − D&A − finance cost − tax = PAT
```

**Acceptance**

- Không có duplicate key hoặc missing required field.
- Unit/currency nhất quán (VND bn trong management outputs).
- Sales fact economic integrity và scenario metric consistency pass.

### Phase 2 — Integrated three-statement model (P0/P1)

**Mục tiêu:** chứng minh năng lực Financial Analyst, không chỉ commercial reporting.

**Income statement**

- Net Revenue, COGS, Gross Profit.
- Trade spend, variable selling cost, Contribution.
- Controllable OPEX, EBITDA proxy, D&A, EBIT.
- Finance cost, PBT, tax, PAT.

**Balance sheet**

- Cash, AR, inventory, other current assets.
- Gross PP&E, accumulated depreciation, net PP&E.
- AP, accruals, current debt, long-term debt.
- Equity and retained earnings.

**Indirect cash flow**

```text
PAT
+ D&A
− increase in AR/inventory/other operating assets
+ increase in AP/accruals
= CFO
− CAPEX
= pre-financing FCF
+ debt drawdown − repayment − interest/dividend cash
= net cash movement
```

**Supporting schedules**

1. AR opening + credit sales − collections − write-off = closing AR.
2. Inventory opening + purchases − COGS − write-off = closing inventory.
3. AP opening + purchases − supplier payment = closing AP.
4. PP&E roll-forward and depreciation schedule.
5. Debt drawdown, repayment, interest and current portion.
6. Retained earnings roll-forward.
7. Cash roll-forward.

**Controls**

- Assets = Liabilities + Equity every month.
- Cash flow closing cash = balance-sheet cash.
- PAT ties to retained earnings.
- D&A ties IS, CF and fixed asset schedule.
- Debt ties BS, interest and financing cash flow.
- No unexplained plug after the opening-balance setup.

**Acceptance**

- `validate_three_statement_model.mjs` PASS.
- TB/GL/subledger bridges reconcile to management outputs.
- 36 monthly periods are reproducible from the active contract.

### Phase 3 — Accounting, close và management bridge (P1)

**Mục tiêu:** thể hiện hiểu month-end close và giao diện giữa Accounting với FP&A.

**Build**

- Chart of accounts.
- Monthly trial balance.
- Cost center/profit center/channel/brand mapping.
- Standard, accrual, reclass và adjustment journal types.
- Document ID, posting date, preparer, approver và status.

**Bridge**

1. TB → accounting P&L.
2. Accounting P&L → management P&L.
3. Management P&L → contribution view.
4. AR/AP/inventory subledger → BS control totals.

**Close checklist**

- Revenue cut-off.
- COGS and inventory movement.
- Trade spend accrual.
- OPEX accrual and prepaid release.
- AR ageing and expected-loss reserve.
- AP completeness.
- Bank/cash and debt confirmation.
- CAPEX additions and depreciation.
- Tax and retained earnings review.

**Acceptance**

- Close calendar has owner, due date, evidence and escalation.
- All bridge differences are zero or explicitly explained.
- Journal adjustments have approval trail.

### Phase 4 — Performance management và variance analytics (P0/P1)

**Mục tiêu:** trả lời “điều gì xảy ra, tại sao, cần làm gì”.

**Required views**

- Actual vs Budget.
- Actual vs Latest Estimate.
- Actual vs Prior Year.
- YTD and full-year outlook.
- Monthly trend and run-rate.
- Revenue-to-profit bridge.
- Gross margin bridge.
- OPEX variance by cost type and cost center.

**PVM/P&L bridge**

- Volume effect.
- Price effect.
- Mix effect.
- Discount/rebate effect.
- Trade spend effect.
- COGS/unit and gross-margin effect.
- OPEX effect.
- Other/FX effect, nếu có evidence.

**Acceptance**

- MBR table, CFO memo và case PDF dùng cùng scenario source.
- Mỗi material variance có driver, magnitude, owner và action.
- Không dùng commentary mô tả một con số không tồn tại trong source.

### Phase 5 — Commercial profitability và cost accounting (P1)

**Mục tiêu:** đưa ra quyết định có tính kinh tế, không chỉ xếp hạng doanh thu.

**Phân tích**

1. SKU contribution và gross-to-net.
2. Channel economics: modern trade, general trade, e-commerce, wholesale, D2C rehearsal.
3. Customer profitability sau working-capital cost.
4. Promotion ROI và incremental contribution.
5. Price realization, volume/mix và elasticity rehearsal.
6. Standard cost vs actual cost.
7. Purchase-price, usage/yield, conversion variance.
8. Slow-moving inventory reserve và aged stock action.

**Decision rules**

- Scale: positive contribution, acceptable cash conversion và capacity.
- Optimize: high revenue nhưng margin/cash yếu.
- Reprice/renegotiate: price realization hoặc trade terms không đạt hurdle.
- Exit/hold: negative contribution hoặc inventory risk không có recovery path.

**Acceptance**

- Recommendation register có priority, owner, target date, impact và status.
- Reserve policy không làm mất traceability giữa physical stock và P&L.
- Promotion/price decisions có baseline và counterfactual rõ ràng.

### Phase 6 — Working capital, liquidity, OPEX, headcount và CAPEX (P1)

**Working capital**

- DSO = ending AR / credit sales × days.
- DIO = ending inventory / COGS × days.
- DPO = ending AP / purchases × days.
- CCC = DSO + DIO − DPO.
- Cash release bridge cho từng driver.

**Liquidity**

- Minimum cash buffer.
- Available liquidity và revolver headroom.
- Base/downside cash stress.
- 30/60/90-day collection and inventory actions.

**OPEX/headcount**

- Headcount opening, hires, exits, transfers và org changes.
- Salary, bonus, benefits, vacancy and annualization.
- OPEX actual/budget/LY by cost center.
- Variance threshold and action owner.

**CAPEX**

- Project ID, category, stage, owner and approval status.
- Budget, YTD spend, committed spend, remaining budget.
- Useful life, depreciation start and payback/NPV rehearsal.
- Kill criteria for delayed or low-return projects.

**Acceptance**

- Cash release actions reconcile to the three-statement cash flow.
- Headcount changes reconcile to OPEX.
- CAPEX commitments reconcile to PP&E and cash.

### Phase 7 — Budget, rolling forecast và scenario governance (P0/P1)

**Forecast versions**

- Budget.
- RF1/RF2/RF3.
- Latest Estimate.
- Actual.

**Forecast process**

1. Freeze cutoff date.
2. Lock actual periods.
3. Collect driver assumptions by owner.
4. Review volume, price, mix, cost, OPEX, WC and cash drivers.
5. Run base/upside/downside.
6. Record override reason, approver and expiry date.
7. Publish version and bridge to prior version.

**Quality metrics**

- Bias.
- WAPE.
- MAE.
- Directional accuracy.
- Forecast-to-actual bridge.

**Guardrails**

- No look-ahead after cutoff.
- No overwriting of prior snapshot.
- No scenario without explicit driver change.
- No “live accuracy” claim from synthetic fixture.

**Acceptance**

- Forecast v2 validator PASS.
- Scenario summary ties across model, memo, PDF and website.
- Gate A remains `PENDING_EXTERNAL_INPUT` until approved internal snapshot + post-close actuals are available.

### Phase 8 — Management communication và recruiter packaging (P0/P1)

**Management outputs**

- One-page case summary PDF.
- Editable 10-slide management/board pack.
- CFO memo with executive headline, drivers, risks and actions.
- Five-minute walkthrough script.
- Monthly close/forecast business-partnering calendar.
- UAT and model change-control log.

**Recruiter outputs**

- One-page English finance-first CV.
- Role variants for Junior FP&A, Business Finance và Finance Data Analyst (finance-controls emphasis).
- Evidence map: mỗi CV bullet → artifact → metric → evidence class.
- Interview talk track using Context → Analysis → Decision → Control → Result.
- Website path: Overview → Core model → Performance → Cash/WC → Controls → Evidence → Appendix → Contact.

**Acceptance**

- CV claim QA: 16/16 PASS.
- CV PDF QA: 6/6 PASS, one page, text extractable.
- Recruiter link QA: 42/42 PASS.
- Không có Power BI claim trong active CV, website hoặc interview script.

---

## 4. Trạng thái hiện tại

| Hạng mục | Trạng thái | Bằng chứng |
|---|---|---|
| Active data/model contract | ✅ PASS | `data/operating_inputs/`, `data/finance_model/final_v1/` |
| Integrated three statements | ✅ PASS | 14/14 statement controls |
| TB/GL/subledger bridge | ✅ PASS | accounting reconciliation artifacts |
| Standard costing & reserve | ✅ PASS | 9/9 costing QA |
| Budget/forecast/scenarios | ✅ PASS with rehearsal caveat | forecast-v2 20/20 |
| MBR/CFO/board pack | ✅ PASS | editable deck + memo + script |
| Working capital/liquidity/OPEX/CAPEX | ✅ PASS | linked schedules and QA |
| Website | ✅ DEPLOYED | Sites v26, finance-first path |
| CV/recruiter package | ✅ STRUCTURALLY PASS | CV 16/16, PDF 6/6 |
| Non-BI core QA | ✅ PASS | 55/55 |
| Release file gate | ✅ PASS | 52/52 |
| Recruiter links | ✅ PASS | 42/42 |
| Scope boundary | ✅ PASS | 18/18 |
| Weighted readiness | **94.2%** | remaining gaps are external/input-gated |

---

## 5. Việc còn lại theo thứ tự ưu tiên

### P0 — cần input thật từ chủ dự án

1. Cung cấp tên, contact, LinkedIn/GitHub, học vấn và kinh nghiệm thật để hoàn tất CV.
2. Nếu muốn tuyên bố forecast accuracy thực tế: cung cấp approved internal pre-close forecast snapshot và post-close actuals.
3. Tự quay walkthrough 5 phút theo `docs/FINANCE_ANALYST_WALKTHROUGH_SCRIPT_5_MIN.md`.

### P1 — nên làm sau khi có input

1. Chạy Gate A validator với dữ liệu được phê duyệt.
2. Thay placeholder CV và render lại PDF.
3. Gắn link recording vào handoff index.
4. Chạy full QA, rebuild manifest và cập nhật archive.

### P2 — tùy chọn, không làm loãng FP&A core

- Approve automated commentary draft.
- Thêm industry variant (tech/services) chỉ khi ứng tuyển đúng ngành.
- Mở rộng public-company/equity research/valuation/M&A như appendix riêng.

---

## 6. Definition of Done

Dự án được xem là recruiter-ready khi:

1. Core QA vẫn PASS 55/55 và release gate không false-green.
2. Ba báo cáo tài chính liên kết, cân bằng và có bridge tới TB/GL.
3. MBR giải thích được Actual vs Budget/Forecast/PY bằng driver lượng hóa.
4. Có ít nhất một cash/WC action và một profitability action có owner.
5. Forecast snapshot có version, cutoff, override log và scenario governance.
6. Case summary, deck, CFO memo, website và CV dùng cùng canonical metrics.
7. Mọi claim đều có evidence class; không biến dữ liệu mô phỏng thành kinh nghiệm thật.
8. CV một trang không còn placeholder sau khi nhận candidate facts.
9. Walkthrough recording được người dùng tự quay và kiểm tra.
10. GitHub/Drive handoff có release manifest, hashes, QA reports và archive.

---

## 7. Lệnh tái tạo non-Power-BI release

```text
python scripts/build_recruiter_metric_snapshot.py
node scripts/validate_recruiter_metric_snapshot.mjs
node scripts/build_three_statement_model.mjs
node scripts/validate_three_statement_model.mjs
node scripts/build_fmcg_cost_variance.mjs
node scripts/validate_fmcg_cost_variance.mjs
node scripts/build_three_year_operating_plan.mjs
node scripts/validate_three_year_operating_plan.mjs
node scripts/build_forecast_versioning_backtest_v2.mjs
node scripts/validate_forecast_versioning_backtest_v2.mjs
node scripts/validate_management_pack.mjs
python scripts/run_non_powerbi_release_gate.py
```

## 8. Handoff

- GitHub: https://github.com/susayold/commercial-finance-profitability-analytics
- Website: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- Drive folder: https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR
- Canonical status: `data/governance/project_status_nonbi.json`
- Release manifest: `reports/NONBI_RELEASE_MANIFEST_2026-09-02.md`

**Kết luận:** từ thời điểm này, mọi cập nhật tiếp theo chỉ làm trên Finance/FP&A core, evidence thật, CV và recruiter handoff. Power BI không còn là phần việc của dự án.
