#!/usr/bin/env node
/**
 * Validate the governance-labelled forecast capture archive.
 *
 * Usage:
 *   node validate_forecast_capture_archive.mjs archive.csv report.md
 */
import fs from "node:fs";

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift().map(x => x.trim());
  return rows.filter(r => r.some(x => x !== "")).map(r => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

const [inputPath, reportPath] = process.argv.slice(2);
if (!inputPath || !reportPath) throw new Error("Usage: node validate_forecast_capture_archive.mjs archive.csv report.md");
const rows = parseCsv(fs.readFileSync(inputPath, "utf8"));
const required = [
  "forecast_version","forecast_created_date","target_month","company","brand","channel",
  "forecast_revenue_vnd","actual_revenue_vnd","actual_available_date","as_of_date",
  "eligibility_status","error_vnd","abs_error_vnd","snapshot_status","source_model_version",
  "approver","actual_period_close_date","exception_note"
];
const checks = [];
const add = (name, pass, detail) => checks.push({name, pass, detail});
add("Required headers", required.every(h => Object.keys(rows[0] || {}).includes(h)), "missing=" + required.filter(h => !Object.keys(rows[0] || {}).includes(h)).join("|"));
add("Row count", rows.length === 29, "rows=" + rows.length + "; expected=29");

const counts = rows.reduce((a, r) => { a[r.snapshot_status] = (a[r.snapshot_status] || 0) + 1; return a; }, {});
add("Snapshot status counts", counts.FROZEN === 27 && counts.EXCEPTION === 1 && counts.DRAFT === 1, JSON.stringify(counts));

const parseDate = s => { const d = new Date(s + "T00:00:00Z"); return Number.isNaN(d.getTime()) ? null : d; };
const expectedEligibility = r => {
  const created = parseDate(r.forecast_created_date);
  const actualAvailable = parseDate(r.actual_available_date);
  const asOf = parseDate(r.as_of_date);
  if (!created || !actualAvailable || !asOf) return "INVALID_INPUT";
  if (created > actualAvailable) return "FUTURE_LEAKAGE";
  if (actualAvailable > asOf) return "NOT_ELIGIBLE";
  return "ELIGIBLE";
};
add("Eligibility recomputation", rows.every(r => r.eligibility_status === expectedEligibility(r)), "mismatches=" + rows.filter(r => r.eligibility_status !== expectedEligibility(r)).length);
add("Frozen rows are eligible", rows.filter(r => r.snapshot_status === "FROZEN").every(r => r.eligibility_status === "ELIGIBLE"), "violations=" + rows.filter(r => r.snapshot_status === "FROZEN" && r.eligibility_status !== "ELIGIBLE").length);
add("Exception is documented", rows.filter(r => r.snapshot_status === "EXCEPTION").every(r => r.exception_note.length > 0 && r.eligibility_status === "FUTURE_LEAKAGE"), "exceptions=" + rows.filter(r => r.snapshot_status === "EXCEPTION").length);
add("Draft is held", rows.filter(r => r.snapshot_status === "DRAFT").every(r => r.eligibility_status === "NOT_ELIGIBLE" && r.exception_note.length > 0), "drafts=" + rows.filter(r => r.snapshot_status === "DRAFT").length);
add("Frozen governance fields", rows.filter(r => r.snapshot_status === "FROZEN").every(r => r.source_model_version && r.approver && r.actual_period_close_date), "violations=" + rows.filter(r => r.snapshot_status === "FROZEN" && (!r.source_model_version || !r.approver || !r.actual_period_close_date)).length);
add("Error arithmetic", rows.every(r => Math.abs(Number(r.error_vnd) - (Number(r.forecast_revenue_vnd) - Number(r.actual_revenue_vnd))) < 1e-9 && Math.abs(Number(r.abs_error_vnd) - Math.abs(Number(r.error_vnd))) < 1e-9), "mismatches=" + rows.filter(r => Math.abs(Number(r.error_vnd) - (Number(r.forecast_revenue_vnd) - Number(r.actual_revenue_vnd))) >= 1e-9).length);

const groups = new Map();
for (const r of rows.filter(r => r.snapshot_status === "FROZEN" && r.eligibility_status === "ELIGIBLE")) {
  const g = groups.get(r.forecast_version) || {rows:0, forecast:0, actual:0, abs:0};
  const f = Number(r.forecast_revenue_vnd), a = Number(r.actual_revenue_vnd);
  g.rows++; g.forecast += f; g.actual += a; g.abs += Math.abs(f-a); groups.set(r.forecast_version, g);
}
const expected = {
  "FE-2025-01": {rows:12, bias:0.05, wape:0.05},
  "FE-2025-04": {rows:9, bias:-0.02, wape:0.02},
  "FE-2025-07": {rows:6, bias:0.10, wape:0.10}
};
for (const [version, exp] of Object.entries(expected)) {
  const g = groups.get(version);
  const bias = g ? (g.forecast-g.actual)/g.actual : NaN;
  const wape = g ? g.abs/Math.abs(g.actual) : NaN;
  add(version + " backtest metrics", Boolean(g && g.rows === exp.rows && Math.abs(bias-exp.bias) < 1e-9 && Math.abs(wape-exp.wape) < 1e-9), g ? "rows=" + g.rows + "; bias=" + bias + "; wape=" + wape : "missing group");
}
add("Leakage exclusion count", rows.filter(r => r.eligibility_status === "FUTURE_LEAKAGE").length === 1, "future_leakage=" + rows.filter(r => r.eligibility_status === "FUTURE_LEAKAGE").length);
add("Late-actual exclusion count", rows.filter(r => r.eligibility_status === "NOT_ELIGIBLE").length === 1, "not_eligible=" + rows.filter(r => r.eligibility_status === "NOT_ELIGIBLE").length);

const passed = checks.filter(c => c.pass).length;
const lines = [
  "# Forecast Capture Archive QA Report",
  "",
  "As-of date: 2025-12-31  ",
  "Evidence class: DEMO_FIXTURE_v1 (synthetic control evidence; not live company performance).",
  "",
  "**Overall status: " + (passed === checks.length ? "PASS" : "FAIL") + "** (" + passed + "/" + checks.length + " checks passed)",
  "",
  "| Check | Status | Detail |",
  "|---|---|---|",
  ...checks.map(c => "| " + c.name + " | " + (c.pass ? "PASS" : "FAIL") + " | " + c.detail.replace(/\|/g, "\\|") + " |"),
  "",
  "## Interpretation",
  "",
  "Only rows with snapshot_status=FROZEN and eligibility_status=ELIGIBLE feed the grouped Bias/WAPE metrics. The archive intentionally retains one future-leakage exception and one late-actual draft so exclusion behavior is visible and testable.",
  ""
];
fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
if (passed !== checks.length) process.exitCode = 1;
console.error(JSON.stringify({rows:rows.length, checks:checks.length, passed}));
