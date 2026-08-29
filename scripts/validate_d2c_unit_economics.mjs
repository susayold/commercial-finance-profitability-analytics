import fs from "node:fs";

const [inputPath = "data/d2c_unit_economics_synthetic.csv"] = process.argv.slice(2);
const csv = fs.readFileSync(inputPath, "utf8").trim();
const lines = csv.split(/\r?\n/);
const header = lines.shift().split(",");
const rows = lines.map((line) => {
  const values = line.split(",");
  return Object.fromEntries(header.map((key, i) => [key, values[i]]));
});
const failures = [];
const requiredScenarios = ["Base", "Downside", "Upside"];
for (const scenario of requiredScenarios) {
  if (!rows.some((r) => r.scenario === scenario)) failures.push(`missing scenario: ${scenario}`);
}
const value = (scenario, metric) => {
  const row = rows.find((r) => r.scenario === scenario && r.metric === metric);
  return row ? Number(row.value) : NaN;
};
const approx = (a, b, tolerance) => Number.isFinite(a) && Math.abs(a - b) <= tolerance;
if (!approx(value("Base", "cac"), 130000, 0.01)) failures.push("Base CAC mismatch");
if (!approx(value("Base", "contribution_per_order"), 39000, 0.01)) failures.push("Base contribution/order mismatch");
if (!approx(value("Base", "ltv_contribution"), 93600, 0.01)) failures.push("Base LTV mismatch");
if (!approx(value("Base", "ltv_cac"), 0.72, 0.0001)) failures.push("Base LTV/CAC mismatch");
if (!approx(value("Base", "payback_orders"), 3.333333, 0.0001)) failures.push("Base payback mismatch");
if (!approx(value("Downside", "ltv_cac"), 0.343558, 0.0001)) failures.push("Downside sensitivity mismatch");
if (!approx(value("Upside", "ltv_cac"), 1.521692, 0.0001)) failures.push("Upside sensitivity mismatch");
const evidenceClasses = new Set(rows.map((r) => r.evidence_class));
for (const required of ["SYNTHETIC", "ASSUMPTION", "DERIVED"]) {
  if (!evidenceClasses.has(required)) failures.push(`missing evidence class: ${required}`);
}
const status = failures.length ? "FAIL" : "PASS";
console.log(JSON.stringify({status, rows: rows.length, scenarios: requiredScenarios.length, checks: 10, failures}, null, 2));
if (failures.length) process.exit(1);
