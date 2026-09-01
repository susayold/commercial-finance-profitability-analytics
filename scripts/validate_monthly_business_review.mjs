import fs from "node:fs";

const reportPath = process.argv[2] || "reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md";
const csvPath = process.argv[3] || "data/monthly_business_review_kpi_pack_2026-08-30.csv";
const scenarioPath = process.argv[4] || "data/scenarios/scenario_summary.csv";
const report = fs.readFileSync(reportPath, "utf8");
const csv = fs.readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
const scenarioRows = fs.readFileSync(scenarioPath, "utf8").trim().split(/\r?\n/).slice(1).map(line => {
  const [period, scenario, revenue, grossProfit, opex, ebitdaProxy, ebitdaMargin, contribution, ccc] = line.split(",");
  return {period, scenario, revenue: Number(revenue), ebitdaProxy: Number(ebitdaProxy), ccc: Number(ccc)};
});
const checks = [];
const must = (name, ok) => checks.push({name, ok: Boolean(ok)});
must("report_exists_and_nontrivial", report.length > 4000);
for (const phrase of ["## Evidence boundary","## 1. Executive answer","## 3. Price–volume–mix (PVM) operating view","## 5. Working-capital and liquidity review","## 6. Scenario stress test","## 7. Action tracker","data/scenarios/scenario_summary.csv"]) must("contains_" + phrase.slice(3,18).replace(/[^A-Za-z0-9]+/g,"_"), report.includes(phrase));
const expectedScenarioText = scenarioRows.flatMap(row => [
  row.revenue.toFixed(1),
  row.ebitdaProxy.toFixed(1),
  row.ccc.toFixed(1),
]);
must("scenario_source_rows", scenarioRows.length === 3 && ["BASE", "UPSIDE", "DOWNSIDE"].every(s => scenarioRows.some(row => row.scenario === s)));
must("scenario_values_present", expectedScenarioText.every(v => report.includes(v)));
must("scenario_values_are_current", !["80.1", "83.3", "54.8", "48.8", "68.8"].some(v => report.includes(v)));
must("csv_header", csv[0] === "section,metric,period,scenario,value,unit,evidence_class,source,decision_use");
const rows = csv.slice(1).map(line=>line.split(","));
must("csv_row_count", rows.length === 16);
must("csv_exec_rows", rows.filter(r=>r[0] === "executive").length === 12);
must("csv_source_and_evidence", rows.every(r=>r.length === 9 && r[6] && r[7]));
const scenarios = new Set(rows.filter(r=>r[0] === "executive").map(r=>r[3]));
must("csv_scenarios", ["Base","Upside","Downside"].every(s=>scenarios.has(s)));
const failed = checks.filter(c=>!c.ok);
for (const c of checks) console.log((c.ok ? "PASS " : "FAIL ") + c.name);
console.log("Overall status: " + (failed.length ? "FAIL" : "PASS") + " (" + (checks.length - failed.length) + "/" + checks.length + " checks passed)");
if (failed.length) process.exit(1);
