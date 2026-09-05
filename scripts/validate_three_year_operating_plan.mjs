#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const fail = (m) => { console.error(`FAIL: ${m}`); process.exitCode = 1; };
const contractPath = path.join(root, "data/planning/operating_plan_input_contract.json");
const summaryPath = path.join(root, "data/planning/three_year_operating_plan_summary.json");
const recPath = path.join(root, "data/planning/operating_plan_reconciliation.csv");
if (!fs.existsSync(contractPath)) fail("input contract missing");
if (!fs.existsSync(summaryPath)) fail("plan summary missing");
if (!fs.existsSync(recPath)) fail("independent reconciliation missing");
if (fs.existsSync(summaryPath)) {
  const b = JSON.parse(fs.readFileSync(summaryPath, "utf8")).baseline;
  for (const [k, expected] of [["revenue_vnd",82.5138],["gross_profit_vnd",26.915],["opex_vnd",14.0194],["ebitda_proxy_vnd",12.8956],["contribution_vnd",24.2074],["ccc_days",54]]) if (Math.abs(Number(b[k]) - expected) > .001) fail(`${k} expected ${expected}, got ${b[k]}`);
}
const rec = fs.readFileSync(recPath, "utf8");
if (!rec.includes("BASE,FY2026,Revenue") || !rec.includes("PASS")) fail("independent FY2026 reconciliation is incomplete");
const rows = rec.trim().split(/\r?\n/).slice(1);
if (rows.some(r => r.split(",")[9] === "FAIL")) fail("reconciliation contains FAIL rows");
const plan = fs.readFileSync(path.join(root, "data/planning/three_year_operating_plan.csv"), "utf8");
if (!plan.includes("WITHHELD") || !plan.includes("OPENING_STATE_RECONCILIATION_PENDING")) fail("long-range liquidity must be explicitly withheld");
if (fs.readFileSync(path.join(root, "scripts/build_three_year_operating_plan.mjs"), "utf8").includes("monthly_income_statement.csv")) fail("deprecated monthly statement used as plan baseline");
if (!process.exitCode) console.log("PASS: three-year operating plan contract and independent reconciliation");
