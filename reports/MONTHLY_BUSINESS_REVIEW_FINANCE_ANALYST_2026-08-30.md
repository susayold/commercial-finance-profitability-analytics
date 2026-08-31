# Monthly Business Review / CFO Operating Pack — VietNova Consumer JSC

Date: 2026-08-30  
Purpose: recruiter-facing demonstration of how a Finance Analyst turns a monthly close and forecast cycle into a decision pack.

## Evidence boundary

- **SIMULATED**: VietNova operating ledger, P&L, channel economics, working-capital and scenario outputs.
- **PROXY / DERIVED**: executive KPI values surfaced by the v2 site/model scenario lens.
- **OBSERVED**: public-company context (MCH/VNM/QNS/KDC) is not mixed into VietNova management actuals.
- This is not an audited forecast, a statutory close or a real company recommendation. Production use requires chart-of-accounts mapping, approved budget versions, locked forecast snapshots and finance-owner sign-off.

## 1. Executive answer

| KPI | Base | Upside | Downside | Unit | Decision meaning |
|---|---:|---:|---:|---|---|
| Revenue | 82.5 | 85.7 | 76.9 | VND bn | FY2025 scenario source of truth |
| EBITDA proxy | 12.9 | 17.4 | 3.5 | VND bn | Gross profit less controllable OPEX; not reported EBITDA |
| EBITDA proxy margin | 15.6% | 20.4% | 4.5% | % | Derived as EBITDA proxy / scenario revenue |
| Cash conversion cycle | 54.0 | 48.0 | 68.0 | days | Liquidity risk lens; lower is better |

**Management call:** stay in Base until promotion ROI, channel contribution and cash-release owners are confirmed. Move toward Upside only when the 25% contribution-margin hurdle and the working-capital guardrails are both met. Trigger Downside playbook if demand, margin or collections breach the stop-loss rules below.

## 2. Actual vs budget / forecast bridge design

The pack is designed to be refreshed from locked snapshots, even though this release uses synthetic proxy values.

| Bridge | Formula | Required input | Current release status |
|---|---|---|---|
| Revenue variance | Actual − Budget | period, version, revenue | **OPEN** — live internal snapshot required |
| Gross-profit variance | Actual GP − Budget GP | net revenue, COGS | **OPEN** — live internal snapshot required |
| EBITDA-proxy variance | Actual proxy − Budget proxy | proxy P&L lines | **OPEN** — replace proxy Opex/OCF with CoA mapping |
| Forecast bias | (Forecast − Actual) / Actual | FROZEN forecast snapshot | **OPEN / Gate A; Gate B remains open** |
| WAPE | sum(abs(Forecast−Actual)) / sum(abs(Actual)) | eligible frozen history | **OPEN / Gate A** |

The evidence contract intentionally refuses to call a DRAFT snapshot “forecast accuracy”. See docs/FORECAST_ACCURACY_BACKTEST.md and the Gate A intake schema.

## 3. Price–volume–mix (PVM) operating view

For each SKU × channel × month, the analyst should reconcile the change in net sales:

1. **Price** = (current ASP − prior ASP) × prior units.
2. **Volume** = (current units − prior units) × prior ASP.
3. **Mix** = residual after price and volume, allocated by SKU/channel mix shift.
4. **Trade-spend residual** = change in trade spend that is not already embedded in ASP.
5. **Control** = price + volume + mix + trade-spend residual must reconcile to headline movement within the disclosed rounding tolerance.

Decision rule: a revenue-positive bridge is not automatically good. Escalate any channel where volume growth is purchased with contribution margin below the 25% hurdle.

## 4. Commercial profitability agenda

| Lens | Question | Owner | Guardrail / trigger | Action |
|---|---|---|---|---|
| Channel | Which channel generated the growth? | Commercial finance | CM% < 25% | Reprice, reduce discount or redesign trade terms |
| Customer | Is growth concentrated in one account? | Account owner | Top-3 customer share rises > 5pp | Review concentration and payment terms |
| SKU | Which pack-size or SKU diluted mix? | Category finance | Mix contribution < 0 | Shift visibility to higher-CM SKU |
| Promotion | Did incremental GP exceed trade spend? | Revenue growth manager | Promo ROI < 25% hurdle | Stop/modify next wave |
| Marketplace/D2C | Do fees and fulfilment erase contribution? | E-commerce finance | Net CM after fees < 25% | Enforce floor price / bundle economics |

## 5. Working-capital and liquidity review

The monthly cash agenda uses:

- **DSO** = average trade receivables / net credit sales × days.
- **DIO** = average inventory / COGS × days.
- **DPO** = average trade payables / purchases (or COGS proxy) × days.
- **CCC** = DSO + DIO − DPO.

Base CCC is 54.0 days; the Downside scenario is 68.0 days. The analyst should translate each one-day improvement into a cash-release estimate using the approved annualized sales/COGS denominator—not a generic percentage. Values are sourced from `data/scenarios/scenario_summary.csv`.

| Trigger | Owner | Immediate containment | Review cadence |
|---|---|---|---|
| DSO +5 days vs Base | AR lead | Stop new discretionary credit, collect top overdue accounts | Weekly |
| DIO +7 days vs Base | Supply-chain finance | Freeze slow-SKU replenishment; markdown decision | Weekly |
| DPO −5 days vs Base | Procurement finance | Re-negotiate terms; protect critical suppliers | Fortnightly |
| Liquidity headroom below approved buffer | Treasurer/CFO | Rephase capex and discretionary trade spend | Weekly cash call |

## 6. Scenario stress test

| Scenario | Operating interpretation | Pre-condition to use |
|---|---|---|
| Base | Balanced growth, stable cost-to-serve and 54.0-day CCC | Default planning case |
| Upside | Higher demand, lower COGS and 48.0-day CCC | Two consecutive closes above CM hurdle; no service-level breach |
| Downside | Demand pressure, cost inflation and 68.0-day CCC | Revenue or CM miss plus collections/inventory deterioration |

Do not average scenarios into a fake “most likely” number. Present the Base as the planning case and keep Upside/Downside as explicit decision boundaries.

## 7. Action tracker (owner → value equation → guardrail → date)

| ID | Owner | Decision | Value equation | Guardrail | Next review |
|---|---|---|---|---|---|
| MBR-01 | Commercial finance | Reallocate promo budget to positive-ROI channels | Incremental CM − trade spend | ROI ≥ 25%; CM% ≥ 25% | Next monthly close |
| MBR-02 | Sales / AR | Collect top overdue accounts | Cash release = DSO reduction × approved daily sales | DSO ≤ Base + 5 days | Weekly cash call |
| MBR-03 | Supply-chain finance | Reduce slow-SKU inventory | Cash release = DIO reduction × approved daily COGS | Service level ≥ 95% | Weekly S&OP |
| MBR-04 | Revenue manager | Reprice fee-heavy marketplace SKUs | CM uplift = price uplift − variable cost | No volume drop > 3% | 2-week test |
| MBR-05 | FP&A | Freeze Base budget version | Plan integrity = locked assumptions + sign-off | No post-close overwrite | Before forecast cycle |
| MBR-06 | Finance systems | Map proxy Opex/OCF to CoA | Traceability = mapped lines / total lines | Coverage ≥ 98% | Month-end close |
| MBR-07 | FP&A lead | Capture FROZEN forecast snapshot | Accuracy = Bias and WAPE on eligible rows | Gate A schema + approval | Before next close |
| MBR-08 | CFO / reviewer | Execute Power BI QA-01–18 | Release confidence = passed tests / 18 | Evidence, reviewer, timestamp | Before public release |

## 8. Review script (15 minutes)

1. Start with Base KPIs and state the decision requested.
2. Explain revenue variance using PVM; identify the largest controllable driver.
3. Drill to channel/customer/SKU and test the 25% CM hurdle.
4. Translate DSO/DIO/DPO movement into cash actions and owners.
5. Show scenario boundary; state what evidence would move the plan to Upside or Downside.
6. Finish on Controls & Evidence; call out open Gate A and Gate B rather than hiding them.

## Release checklist

- [ ] Actual, budget and forecast versions locked and signed off.
- [ ] Revenue/GP/EBITDA-proxy bridges reconcile within disclosed tolerance.
- [ ] PVM residual reviewed and explained.
- [ ] Promo ROI and channel CM hurdle tested.
- [ ] DSO/DIO/DPO and liquidity buffer refreshed.
- [ ] Every action has owner, value equation, guardrail and next review date.
- [ ] Evidence class is visible on every headline KPI.
- [ ] Gate A/B status remains open until external evidence is supplied.

## Linked evidence

- v2 model: https://docs.google.com/spreadsheets/d/1-DAMs7zqQr8a6Otimm3WgkAIsX3kazpm/edit
- Executive output reconciliation: reports/EXECUTIVE_OUTPUT_RECONCILIATION.md
- Forecast capture / Gate A contract: docs/FORECAST_ACCURACY_BACKTEST.md
- Power BI QA matrix: powerbi/QA_TEST_MATRIX.md
- MCH financial-statement analysis: reports/MCH_FINANCIAL_STATEMENT_ANALYSIS_2026-08-30.md
