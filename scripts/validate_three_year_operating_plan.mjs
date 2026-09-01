#!/usr/bin/env node
import fs from "node:fs";

function parseCsv(text) {
  const rows = text.trim().split(/\r?\n/).map((line) => line.split(","));
  const header = rows.shift();
  return rows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}
function n(v) { const x = Number(v); return Number.isFinite(x) ? x : NaN; }
const checks = [];
const pass = (name, ok, detail) => { checks.push({ name, status: ok ? "PASS" : "FAIL", detail }); if (!ok) process.exitCode = 1; };
const planPath = "data/planning/three_year_operating_plan.csv";
const recPath = "data/planning/operating_plan_reconciliation.csv";
const initPath = "data/planning/operating_plan_initiatives.csv";
for (const file of [planPath, recPath, initPath, "data/planning/three_year_operating_plan_summary.json"]) pass(`file:${file}`, fs.existsSync(file), "required planning artifact");
if (!fs.existsSync(planPath)) { console.log(checks); process.exit(1); }
const rows = parseCsv(fs.readFileSync(planPath, "utf8"));
const rec = parseCsv(fs.readFileSync(recPath, "utf8"));
const initiatives = parseCsv(fs.readFileSync(initPath, "utf8"));
const required = ["fiscal_year", "period", "grain", "scenario", "revenue_vnd", "cogs_vnd", "gross_profit_vnd", "opex_vnd", "ebitda_proxy_vnd", "depreciation_vnd", "ebit_vnd", "pbt_vnd", "tax_vnd", "pat_vnd", "cfo_vnd", "capex_vnd", "pre_financing_fcf_vnd", "debt_drawdown_vnd", "debt_repayment_vnd", "debt_closing_vnd", "cash_opening_vnd", "cash_closing_vnd", "evidence_class"];
pass("required_columns", required.every((c) => Object.hasOwn(rows[0] ?? {}, c)), "driver-based plan schema");
pass("row_count", rows.length === 60, `expected 60 rows, got ${rows.length}`);
pass("scenario_coverage", ["BASE", "UPSIDE", "DOWNSIDE"].every((s) => rows.filter((r) => r.scenario === s).length === 20), "20 periods per scenario");
pass("grain_coverage", rows.filter((r) => r.grain === "MONTH").length === 36 && rows.filter((r) => r.grain === "QUARTER").length === 24, "FY2026 monthly; FY2027-FY2028 quarterly");
pass("year_coverage", ["FY2026", "FY2027", "FY2028"].every((y) => rows.some((r) => r.fiscal_year === y)), "three fiscal years");
pass("evidence_labels", rows.every((r) => r.evidence_class === "SIMULATED/DERIVED"), "all planning rows labelled");
pass("terminal_growth_excluded", !fs.readFileSync("data/planning/three_year_operating_plan_summary.json", "utf8").includes("terminal_growth_used\": true"), "operating plan does not use DCF terminal growth");
let identityOk = true;
let cashOk = true;
for (const r of rows) {
  const rev = n(r.revenue_vnd), cogs = n(r.cogs_vnd), gp = n(r.gross_profit_vnd), opex = n(r.opex_vnd), ebitda = n(r.ebitda_proxy_vnd), dna = n(r.depreciation_vnd), ebit = n(r.ebit_vnd), pbt = n(r.pbt_vnd), tax = n(r.tax_vnd), pat = n(r.pat_vnd);
  if (Math.abs(rev - cogs - gp) > 2 || Math.abs(gp - opex - ebitda) > 2 || Math.abs(ebitda - dna - ebit) > 2 || Math.abs(ebit - n(r.finance_cost_vnd) - pbt) > 2 || Math.abs(pbt - tax - pat) > 2) identityOk = false;
  if (Math.abs(n(r.cash_opening_vnd) + n(r.pre_financing_fcf_vnd) + n(r.debt_drawdown_vnd) - n(r.debt_repayment_vnd) - n(r.cash_closing_vnd)) > 2) cashOk = false;
}
pass("pnl_identities", identityOk, "revenue/COGS/GP/EBITDA/EBIT/PBT/PAT");
pass("cash_roll_forward", cashOk, "cash opening + FCF + funding = cash closing");
pass("working_capital_identity", rows.every((r) => Math.abs(n(r.ccc_days) - (n(r.dso_days) + n(r.dio_days) - n(r.dpo_days))) < 0.01), "CCC = DSO + DIO - DPO");
pass("non_negative_funding", rows.every((r) => n(r.debt_closing_vnd) >= -0.01 && n(r.cash_closing_vnd) >= 8_000_000_000 - 2), "debt floor and minimum cash guardrail");
pass("year1_reconciliation", rec.length === 3 && rec.every((r) => r.status === "PASS" && Math.abs(n(r.delta_vnd)) <= 2), "FY2026 plan reconciles to rolling forecast bridge");
pass("initiative_gate_fields", initiatives.length >= 4 && initiatives.every((r) => r.owner && r.investment_vnd && r.benefit_metric && r.risk && r.kill_criteria && r.stage_gate), "owner/investment/benefit/risk/kill criteria/stage gate");
console.log(checks.map((c) => `${c.status} ${c.name} — ${c.detail}`).join("\n"));
console.log(`Overall status: ${process.exitCode ? "FAIL" : "PASS"} (${checks.filter((c) => c.status === "PASS").length}/${checks.length} checks passed)`);
