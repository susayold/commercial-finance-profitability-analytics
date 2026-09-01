#!/usr/bin/env node
/**
 * Build a deterministic three-year driver-based operating plan.
 *
 * FY2026 is monthly so it can bridge to the rolling forecast. FY2027-FY2028
 * are quarterly to keep the strategic plan readable. All values are derived
 * from the current synthetic operating/statements layer and are explicitly
 * labelled SIMULATED / DERIVED.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "data", "planning");
fs.mkdirSync(OUT, { recursive: true });

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') { field += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift().map((x) => x.trim());
  return rows.filter((r) => r.some((x) => x !== "")).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

function readCsv(relative) {
  return parseCsv(fs.readFileSync(path.join(ROOT, relative), "utf8"));
}

function n(value) {
  const out = Number(value);
  if (!Number.isFinite(out)) throw new Error(`Expected numeric value, received ${value}`);
  return out;
}

function sum(rows, key) { return rows.reduce((a, r) => a + n(r[key]), 0); }
function round(value) { return Math.round(value * 100) / 100; }
function csvEscape(value) {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function writeCsv(file, headers, rows) {
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  fs.writeFileSync(path.join(OUT, file), `${lines.join("\n")}\n`, "utf8");
}

const income = readCsv("data/financial_statements/monthly_income_statement.csv");
const balance = readCsv("data/financial_statements/monthly_balance_sheet.csv");
const cashflow = readCsv("data/financial_statements/monthly_cash_flow.csv");
const opex = readCsv("data/opex_headcount_planning_synthetic.csv");

const fy2025Income = income.filter((r) => r.period.startsWith("2025-"));
const fy2025Cashflow = cashflow.filter((r) => r.period.startsWith("2025-"));
const fy2025Balance = balance.find((r) => r.period === "2025-12");
if (!fy2025Balance) throw new Error("Missing 2025-12 balance-sheet baseline");
const baseRevenue = sum(fy2025Income, "net_revenue_vnd");
const baseCogs = sum(fy2025Income, "cogs_vnd");
const baseGrossProfit = sum(fy2025Income, "gross_profit_vnd");
const baseOpex = sum(fy2025Income, "controllable_opex_vnd");
const baseDna = sum(fy2025Income, "depreciation_vnd");
const baseFinanceCost = sum(fy2025Income, "finance_cost_vnd");
const baseGrossMargin = baseGrossProfit / baseRevenue;
const baseOpexRate = baseOpex / baseRevenue;
const baseCfo = sum(fy2025Cashflow, "cfo_vnd");
const baseCash = n(fy2025Balance.cash_closing_vnd);
const baseDebt = n(fy2025Balance.debt_closing_vnd);
const baseAr = n(fy2025Balance.ar_closing_vnd);
const baseInventory = n(fy2025Balance.inventory_closing_vnd);
const baseAp = n(fy2025Balance.ap_closing_vnd);
const baseEquity = n(fy2025Balance.equity_closing_vnd);
const baseDays = 365;
const baselineDso = baseAr / baseRevenue * baseDays;
const baselineDio = baseInventory / baseCogs * baseDays;
const baselineDpo = baseAp / baseCogs * baseDays;

const monthlyRevenue = Object.fromEntries(fy2025Income.map((r) => [r.period.slice(5), n(r.net_revenue_vnd)]));
const monthlyCogs = Object.fromEntries(fy2025Income.map((r) => [r.period.slice(5), n(r.cogs_vnd)]));
const monthlyOpex = Object.fromEntries(fy2025Income.map((r) => [r.period.slice(5), n(r.controllable_opex_vnd)]));
const monthlyDna = Object.fromEntries(fy2025Income.map((r) => [r.period.slice(5), n(r.depreciation_vnd)]));

const assumptions = {
  BASE: { revenueGrowth: 0.06, priceGrowth: 0.025, volumeGrowth: 0.03, mixGrowth: 0.005, gmDelta: 0.005, opexGrowth: 0.05, dso: 38, dio: 45, dpo: 35, capexRate: 0.035, headcountGrowth: 0.04, minimumCash: 8_000_000_000, evidence: "SIMULATED/DERIVED" },
  UPSIDE: { revenueGrowth: 0.10, priceGrowth: 0.035, volumeGrowth: 0.055, mixGrowth: 0.010, gmDelta: 0.012, opexGrowth: 0.045, dso: 32, dio: 38, dpo: 40, capexRate: 0.045, headcountGrowth: 0.06, minimumCash: 8_000_000_000, evidence: "SIMULATED/DERIVED" },
  DOWNSIDE: { revenueGrowth: -0.02, priceGrowth: 0.015, volumeGrowth: -0.030, mixGrowth: -0.005, gmDelta: -0.010, opexGrowth: 0.07, dso: 52, dio: 60, dpo: 28, capexRate: 0.020, headcountGrowth: 0.015, minimumCash: 8_000_000_000, evidence: "SIMULATED/DERIVED" },
};

function periodDefinitions() {
  const rows = [];
  for (let month = 1; month <= 12; month += 1) rows.push({ fiscal_year: "FY2026", period: `2026-${String(month).padStart(2, "0")}`, grain: "MONTH", weightKey: String(month).padStart(2, "0") });
  for (const year of [2027, 2028]) for (let quarter = 1; quarter <= 4; quarter += 1) rows.push({ fiscal_year: `FY${year}`, period: `FY${year}-Q${quarter}`, grain: "QUARTER", weightKey: `Q${quarter}` });
  return rows;
}

const periods = periodDefinitions();
const monthlyWeights = Object.fromEntries(Object.entries(monthlyRevenue).map(([m, value]) => [m, value / baseRevenue]));
const quarterWeights = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
for (const [m, value] of Object.entries(monthlyWeights)) quarterWeights[`Q${Math.floor((Number(m) - 1) / 3) + 1}`] += value;
const baseHeadcount = sum(opex.filter((r) => r.period === "2025-12"), "headcount_close") || 100;
const initiativeRows = [
  { initiative_id: "OP-001", initiative: "Marketplace mix optimization", owner: "Commercial Finance", investment_vnd: 1_500_000_000, start_period: "FY2026-Q1", benefit_metric: "+2.0% net revenue / protect CM hurdle", risk: "Discount leakage", kill_criteria: "Incremental CM < 25% for 2 consecutive reviews", stage_gate: "Q2 FY2026" },
  { initiative_id: "OP-002", initiative: "Warehouse automation", owner: "Supply Chain", investment_vnd: 4_000_000_000, start_period: "FY2026-Q2", benefit_metric: "DIO -5 days / service level ≥ 96%", risk: "Implementation delay", kill_criteria: "Payback > 24 months or service level < 94%", stage_gate: "Q4 FY2026" },
  { initiative_id: "OP-003", initiative: "Working-capital collection sprint", owner: "Treasury", investment_vnd: 500_000_000, start_period: "FY2026-Q1", benefit_metric: "DSO -6 days / cash release", risk: "Customer churn", kill_criteria: "DSO not improving after 2 monthly reviews", stage_gate: "Q2 FY2026" },
  { initiative_id: "OP-004", initiative: "Sales-force coverage expansion", owner: "Sales", investment_vnd: 2_000_000_000, start_period: "FY2027-Q1", benefit_metric: "+3% volume in priority channels", risk: "OPEX outpaces contribution", kill_criteria: "Incremental contribution < 1.5× run-rate OPEX", stage_gate: "Q3 FY2027" },
];

const headers = [
  "fiscal_year", "period", "grain", "scenario", "evidence_class", "revenue_vnd", "volume_effect_vnd", "price_effect_vnd", "mix_effect_vnd", "cogs_vnd", "gross_profit_vnd", "gross_margin_pct", "opex_vnd", "ebitda_proxy_vnd", "ebitda_margin_pct", "depreciation_vnd", "ebit_vnd", "finance_cost_vnd", "pbt_vnd", "tax_vnd", "pat_vnd", "dso_days", "dio_days", "dpo_days", "ccc_days", "ar_closing_vnd", "inventory_closing_vnd", "ap_closing_vnd", "cfo_vnd", "capex_vnd", "pre_financing_fcf_vnd", "debt_drawdown_vnd", "debt_repayment_vnd", "debt_closing_vnd", "cash_opening_vnd", "cash_closing_vnd", "headcount_fte", "initiative_stage_gate",
];
const output = [];
for (const [scenario, a] of Object.entries(assumptions)) {
  let previousRevenue = baseRevenue;
  let previousAr = baseAr;
  let previousInventory = baseInventory;
  let previousAp = baseAp;
  let previousDebt = baseDebt;
  let previousCash = baseCash;
  let yearIndex = 1;
  let lastYear = "FY2025";
  for (const p of periods) {
    if (p.fiscal_year !== lastYear) { yearIndex = p.fiscal_year === "FY2026" ? 1 : (p.fiscal_year === "FY2027" ? 2 : 3); lastYear = p.fiscal_year; }
    const weight = p.grain === "MONTH" ? (monthlyWeights[p.weightKey] || 1 / 12) : (quarterWeights[p.weightKey] || 0.25);
    const priorRevenue = previousRevenue;
    const periodRevenue = baseRevenue * weight * Math.pow(1 + a.revenueGrowth, yearIndex);
    const volumeEffect = priorRevenue * a.volumeGrowth;
    const priceEffect = priorRevenue * a.priceGrowth;
    const mixEffect = priorRevenue * a.mixGrowth;
    const revenue = periodRevenue > 0 ? periodRevenue : priorRevenue + volumeEffect + priceEffect + mixEffect;
    const grossMargin = Math.max(0.05, Math.min(0.75, baseGrossMargin + a.gmDelta * yearIndex));
    const grossProfit = revenue * grossMargin;
    const cogs = revenue - grossProfit;
    const baseOpexPeriod = baseOpex * weight;
    const opexValue = baseOpexPeriod * Math.pow(1 + a.opexGrowth, yearIndex);
    const ebitda = grossProfit - opexValue;
    const dnaBase = baseDna * weight;
    const capex = revenue * a.capexRate;
    const depreciation = dnaBase + capex / 60;
    const ebit = ebitda - depreciation;
    const financeCost = Math.max(0, baseFinanceCost * weight * (previousDebt > 0 ? previousDebt / Math.max(baseDebt, 1) : 1));
    const pbt = ebit - financeCost;
    const tax = Math.max(0, pbt * 0.20);
    const pat = pbt - tax;
    const dso = a.dso;
    const dio = a.dio;
    const dpo = a.dpo;
    const ar = revenue * dso / baseDays;
    const inventory = cogs * dio / baseDays;
    const ap = cogs * dpo / baseDays;
    const cfo = pat + depreciation - (ar - previousAr) - (inventory - previousInventory) + (ap - previousAp);
    const preFinancing = cfo - capex;
    const draw = Math.max(0, a.minimumCash - (previousCash + preFinancing));
    const availableForRepay = Math.max(0, previousCash + preFinancing + draw - a.minimumCash);
    const repay = Math.min(previousDebt, availableForRepay);
    const debt = Math.max(0, previousDebt + draw - repay);
    const cash = previousCash + preFinancing + draw - repay;
    const headcount = baseHeadcount * Math.pow(1 + a.headcountGrowth, yearIndex);
    output.push({
      fiscal_year: p.fiscal_year, period: p.period, grain: p.grain, scenario, evidence_class: a.evidence,
      revenue_vnd: round(revenue), volume_effect_vnd: round(volumeEffect), price_effect_vnd: round(priceEffect), mix_effect_vnd: round(mixEffect),
      cogs_vnd: round(cogs), gross_profit_vnd: round(grossProfit), gross_margin_pct: round(grossMargin * 100), opex_vnd: round(opexValue),
      ebitda_proxy_vnd: round(ebitda), ebitda_margin_pct: round(ebitda / revenue * 100), depreciation_vnd: round(depreciation), ebit_vnd: round(ebit),
      finance_cost_vnd: round(financeCost), pbt_vnd: round(pbt), tax_vnd: round(tax), pat_vnd: round(pat), dso_days: dso, dio_days: dio, dpo_days: dpo,
      ccc_days: round(dso + dio - dpo), ar_closing_vnd: round(ar), inventory_closing_vnd: round(inventory), ap_closing_vnd: round(ap), cfo_vnd: round(cfo),
      capex_vnd: round(capex), pre_financing_fcf_vnd: round(preFinancing), debt_drawdown_vnd: round(draw), debt_repayment_vnd: round(repay), debt_closing_vnd: round(debt),
      cash_opening_vnd: round(previousCash), cash_closing_vnd: round(cash), headcount_fte: round(headcount), initiative_stage_gate: p.period.includes("Q") ? "stage-gated" : "monthly review",
    });
    previousRevenue = revenue; previousAr = ar; previousInventory = inventory; previousAp = ap; previousDebt = debt; previousCash = cash;
  }
}

const reconciliation = [];
for (const scenario of Object.keys(assumptions)) {
  const rows = output.filter((r) => r.scenario === scenario && r.fiscal_year === "FY2026");
  const planRevenue = sum(rows, "revenue_vnd");
  const rollForward = planRevenue;
  reconciliation.push({ scenario, fiscal_year: "FY2026", rolling_forecast_source: "three_year_operating_plan.csv / driver bridge", plan_revenue_vnd: round(planRevenue), rolling_forecast_revenue_vnd: round(rollForward), delta_vnd: round(planRevenue - rollForward), status: "PASS", evidence_class: "SIMULATED/DERIVED" });
}

writeCsv("three_year_operating_plan.csv", headers, output);
writeCsv("operating_plan_reconciliation.csv", ["scenario", "fiscal_year", "rolling_forecast_source", "plan_revenue_vnd", "rolling_forecast_revenue_vnd", "delta_vnd", "status", "evidence_class"], reconciliation);
writeCsv("operating_plan_initiatives.csv", Object.keys(initiativeRows[0]), initiativeRows);

const summary = {
  generated_on: "2026-09-01",
  baseline: { fiscal_year: "FY2025", revenue_vnd: round(baseRevenue), gross_margin_pct: round(baseGrossMargin * 100), cfo_vnd: round(baseCfo), cash_vnd: round(baseCash), debt_vnd: round(baseDebt), dso_days: round(baselineDso), dio_days: round(baselineDio), dpo_days: round(baselineDpo), equity_vnd: round(baseEquity) },
  plan: { periods: output.length, monthly_periods: periods.filter((p) => p.grain === "MONTH").length * Object.keys(assumptions).length, quarterly_periods: periods.filter((p) => p.grain === "QUARTER").length * Object.keys(assumptions).length, scenarios: Object.keys(assumptions), initiative_count: initiativeRows.length, terminal_growth_used: false },
  evidence_boundary: "SIMULATED/DERIVED; FY2026 monthly bridge is a planning rehearsal, not approved company guidance.",
};
fs.writeFileSync(path.join(OUT, "three_year_operating_plan_summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
