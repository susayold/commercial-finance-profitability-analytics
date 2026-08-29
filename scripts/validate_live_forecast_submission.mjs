#!/usr/bin/env node
/**
 * Validate a governance-complete forecast snapshot submission.
 *
 * Usage:
 *   node validate_live_forecast_submission.mjs input.csv report.md [--mode=fixture|live]
 *
 * Fixture mode proves the contract and exclusion mechanics without making a
 * live-performance claim. Live mode additionally requires LIVE_INTERNAL
 * evidence on every frozen/eligible row and rejects synthetic URIs.
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
    else if (ch === ',') { row.push(field); field = ""; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const header = (rows.shift() || []).map(x => x.trim());
  return rows.filter(r => r.some(x => x !== "")).map(r => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

const [inputPath, reportPath, ...flags] = process.argv.slice(2);
if (!inputPath || !reportPath) throw new Error("Usage: node validate_live_forecast_submission.mjs input.csv report.md [--mode=fixture|live]");
const mode = flags.includes("--mode=live") ? "live" : "fixture";
const rows = parseCsv(fs.readFileSync(inputPath, "utf8"));
const required = [
  "forecast_version","forecast_created_date","target_month","company","brand","channel",
  "forecast_revenue_vnd","actual_revenue_vnd","actual_available_date","as_of_date",
  "eligibility_status","error_vnd","abs_error_vnd","snapshot_status","source_model_version",
  "approver","actual_period_close_date","exception_note","evidence_class","source_evidence_uri"
];
const checks = [];
const add = (name, pass, detail) => checks.push({name, pass: Boolean(pass), detail});
const header = Object.keys(rows[0] || {});
add("Required headers", required.every(h => header.includes(h)), "missing=" + required.filter(h => !header.includes(h)).join("|"));
add("Non-empty submission", rows.length > 0, "rows=" + rows.length);

const parseDate = value => {
  const d = new Date(value);
  return value && !Number.isNaN(d.getTime()) ? d : null;
};
const validMonth = value => /^\d{4}-(0[1-9]|1[0-2])$/.test(value || "");
const validStatuses = new Set(["DRAFT", "FROZEN", "EXCEPTION"]);
const validEvidence = new Set(["LIVE_INTERNAL", "SIMULATED", "DEMO_FIXTURE_ONLY"]);
add("Date, month and numeric types", rows.every(r =>
  parseDate(r.forecast_created_date) && parseDate(r.actual_available_date) && parseDate(r.as_of_date) &&
  parseDate(r.actual_period_close_date) && validMonth(r.target_month) &&
  ["forecast_revenue_vnd","actual_revenue_vnd","error_vnd","abs_error_vnd"].every(k => Number.isFinite(Number(r[k])))
), "invalid_rows=" + rows.filter(r => !(parseDate(r.forecast_created_date) && parseDate(r.actual_available_date) && parseDate(r.as_of_date) && parseDate(r.actual_period_close_date) && validMonth(r.target_month))).length);
add("Allowed status and evidence values", rows.every(r => validStatuses.has(r.snapshot_status) && validEvidence.has(r.evidence_class)), "invalid_rows=" + rows.filter(r => !validStatuses.has(r.snapshot_status) || !validEvidence.has(r.evidence_class)).length);

const expectedEligibility = r => {
  const created = parseDate(r.forecast_created_date), available = parseDate(r.actual_available_date), asOf = parseDate(r.as_of_date);
  if (!created || !available || !asOf) return "INVALID_INPUT";
  if (created >= available) return "FUTURE_LEAKAGE";
  if (available > asOf) return "NOT_ELIGIBLE";
  return "ELIGIBLE";
};
add("Eligibility recomputation", rows.every(r => r.eligibility_status === expectedEligibility(r)), "mismatches=" + rows.filter(r => r.eligibility_status !== expectedEligibility(r)).length);

const grainKey = r => [r.forecast_version,r.target_month,r.company,r.brand,r.channel].join("|");
const keys = rows.map(grainKey);
add("Unique forecast grain", new Set(keys).size === keys.length, "duplicate_rows=" + (keys.length - new Set(keys).size));
add("Error arithmetic", rows.every(r => Math.abs(Number(r.error_vnd) - (Number(r.forecast_revenue_vnd) - Number(r.actual_revenue_vnd))) < 0.01 && Math.abs(Number(r.abs_error_vnd) - Math.abs(Number(r.error_vnd))) < 0.01), "mismatches=" + rows.filter(r => Math.abs(Number(r.error_vnd) - (Number(r.forecast_revenue_vnd) - Number(r.actual_revenue_vnd))) >= 0.01).length);
add("Frozen rows are eligible", rows.filter(r => r.snapshot_status === "FROZEN").every(r => r.eligibility_status === "ELIGIBLE"), "violations=" + rows.filter(r => r.snapshot_status === "FROZEN" && r.eligibility_status !== "ELIGIBLE").length);
add("Frozen governance fields", rows.filter(r => r.snapshot_status === "FROZEN").every(r => r.source_model_version && r.approver && r.actual_period_close_date && r.source_evidence_uri), "violations=" + rows.filter(r => r.snapshot_status === "FROZEN" && (!r.source_model_version || !r.approver || !r.actual_period_close_date || !r.source_evidence_uri)).length);
add("Exceptions and drafts documented", rows.filter(r => r.snapshot_status !== "FROZEN").every(r => r.exception_note.length > 0), "undocumented=" + rows.filter(r => r.snapshot_status !== "FROZEN" && !r.exception_note).length);
add("Non-negative revenue", rows.every(r => Number(r.forecast_revenue_vnd) >= 0 && Number(r.actual_revenue_vnd) >= 0), "violations=" + rows.filter(r => Number(r.forecast_revenue_vnd) < 0 || Number(r.actual_revenue_vnd) < 0).length);

if (mode === "live") {
  add("Live evidence class", rows.filter(r => r.snapshot_status === "FROZEN" && r.eligibility_status === "ELIGIBLE").every(r => r.evidence_class === "LIVE_INTERNAL"), "non_live=" + rows.filter(r => r.snapshot_status === "FROZEN" && r.eligibility_status === "ELIGIBLE" && r.evidence_class !== "LIVE_INTERNAL").length);
  add("Live evidence URI", rows.filter(r => r.snapshot_status === "FROZEN" && r.eligibility_status === "ELIGIBLE").every(r => !/^synthetic:/i.test(r.source_evidence_uri) && /^https?:/i.test(r.source_evidence_uri)), "synthetic_or_invalid=" + rows.filter(r => r.snapshot_status === "FROZEN" && r.eligibility_status === "ELIGIBLE" && (!/^https?:/i.test(r.source_evidence_uri) || /^synthetic:/i.test(r.source_evidence_uri))).length);
  add("At least one live eligible row", rows.some(r => r.snapshot_status === "FROZEN" && r.eligibility_status === "ELIGIBLE" && r.evidence_class === "LIVE_INTERNAL"), "eligible_live_rows=" + rows.filter(r => r.snapshot_status === "FROZEN" && r.eligibility_status === "ELIGIBLE" && r.evidence_class === "LIVE_INTERNAL").length);
} else {
  add("Fixture is not mislabelled live", rows.every(r => r.evidence_class !== "LIVE_INTERNAL"), "live-labelled_fixture_rows=" + rows.filter(r => r.evidence_class === "LIVE_INTERNAL").length);
}

const groups = new Map();
for (const r of rows.filter(r => r.snapshot_status === "FROZEN" && r.eligibility_status === "ELIGIBLE")) {
  const key = [r.forecast_version,r.company,r.brand,r.channel].join("|");
  const g = groups.get(key) || {forecast_version:r.forecast_version,company:r.company,brand:r.brand,channel:r.channel,eligible_rows:0,forecast_vnd:0,actual_vnd:0,abs_error_vnd:0,as_of_date:r.as_of_date};
  const f = Number(r.forecast_revenue_vnd), a = Number(r.actual_revenue_vnd);
  g.eligible_rows++; g.forecast_vnd += f; g.actual_vnd += a; g.abs_error_vnd += Math.abs(f-a); groups.set(key, g);
}
const metrics = [...groups.values()].map(g => ({...g,bias:g.actual_vnd ? (g.forecast_vnd-g.actual_vnd)/g.actual_vnd : "",wape:g.actual_vnd ? g.abs_error_vnd/Math.abs(g.actual_vnd) : ""}));

const passed = checks.filter(c => c.pass).length;
const releaseReady = mode === "live" && passed === checks.length && metrics.length > 0;
const status = releaseReady ? "LIVE_OBSERVED_READY" : (mode === "fixture" && passed === checks.length ? "FIXTURE_PASS_NOT_LIVE" : "FAIL");
const lines = [
  "# Live Forecast Submission QA",
  "",
  `Mode: ${mode.toUpperCase()}  `,
  `Release status: **${status}**  `,
  "",
  `**Checks: ${passed}/${checks.length} passed**  `,
  "",
  "| Check | Status | Detail |",
  "|---|---|---|",
  ...checks.map(c => `| ${c.name} | ${c.pass ? "PASS" : "FAIL"} | ${String(c.detail).replace(/\|/g, "\\|")} |`),
  "",
  "## Eligible Bias/WAPE output",
  "",
  "| Forecast version | Company | Brand | Channel | Eligible rows | Forecast VND | Actual VND | Bias | WAPE | As-of date |",
  "|---|---|---|---:|---:|---:|---:|---:|---:|---|",
  ...metrics.map(g => `| ${g.forecast_version} | ${g.company} | ${g.brand} | ${g.channel} | ${g.eligible_rows} | ${g.forecast_vnd} | ${g.actual_vnd} | ${g.bias} | ${g.wape} | ${g.as_of_date} |`),
  "",
  mode === "fixture" ? "This is controlled structural evidence only. It must not be described as observed company performance." : "LIVE_OBSERVED_READY is permitted only when the source URI, approval trail and closed-P&L tie-out are independently archived."
];
fs.writeFileSync(reportPath, lines.join("\n") + "\n", "utf8");
console.error(JSON.stringify({mode,status,rows:rows.length,eligible_rows:rows.filter(r => r.snapshot_status === "FROZEN" && r.eligibility_status === "ELIGIBLE").length,metrics:metrics.length,checks:checks.length,passed}));
if (status === "FAIL") process.exitCode = 1;
