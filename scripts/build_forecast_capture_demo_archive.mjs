#!/usr/bin/env node
/**
 * Build a governance-labelled forecast snapshot archive from the controlled demo input.
 *
 * Usage:
 *   node build_forecast_capture_demo_archive.mjs input.csv output.csv 2025-12-31
 *
 * The output is a reproducible archive for the native Google Sheet capture tab.
 * DEMO_FIXTURE_v1 is synthetic evidence; it must not be presented as live company accuracy.
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

function csvEscape(value) {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function isoDate(value) {
  const d = new Date(value + (value.length === 10 ? "T00:00:00Z" : ""));
  if (Number.isNaN(d.getTime())) throw new Error("Invalid date: " + value);
  return d.toISOString().slice(0, 10);
}

function monthEnd(targetMonth) {
  const [year, month] = targetMonth.split("-").map(Number);
  return new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
}

const [inputPath, outputPath, asOfArg] = process.argv.slice(2);
if (!inputPath || !outputPath) throw new Error("Usage: node build_forecast_capture_demo_archive.mjs input.csv output.csv [as-of YYYY-MM-DD]");
const asOf = isoDate(asOfArg || "2025-12-31");
const rows = parseCsv(fs.readFileSync(inputPath, "utf8"));
const required = ["forecast_version","forecast_created_date","target_month","company","brand","channel","forecast_revenue_vnd","actual_revenue_vnd","actual_available_date"];
const missing = required.filter(c => !(c in (rows[0] || {})));
if (missing.length) throw new Error("Missing columns: " + missing.join(", "));

const output = rows.map(r => {
  const created = isoDate(r.forecast_created_date);
  const actualAvailable = isoDate(r.actual_available_date);
  const forecast = Number(r.forecast_revenue_vnd);
  const actual = Number(r.actual_revenue_vnd);
  if (![forecast, actual].every(Number.isFinite)) throw new Error("Non-numeric forecast/actual in " + r.forecast_version + " " + r.target_month);
  const leakage = created > actualAvailable;
  const notEligible = actualAvailable > asOf;
  const eligibility = leakage ? "FUTURE_LEAKAGE" : (notEligible ? "NOT_ELIGIBLE" : "ELIGIBLE");
  const snapshotStatus = leakage ? "EXCEPTION" : (notEligible ? "DRAFT" : "FROZEN");
  return {
    ...r,
    forecast_created_date: created,
    actual_available_date: actualAvailable,
    as_of_date: asOf,
    eligibility_status: eligibility,
    error_vnd: forecast - actual,
    abs_error_vnd: Math.abs(forecast - actual),
    snapshot_status: snapshotStatus,
    source_model_version: "DEMO_FIXTURE_v1",
    approver: snapshotStatus === "FROZEN" ? "Portfolio Owner (synthetic)" : "",
    actual_period_close_date: monthEnd(r.target_month),
    exception_note: leakage ? "Created after actual availability; exclude" : (notEligible ? "Actual available after as-of date; hold until close" : "")
  };
});

const headers = [
  "forecast_version","forecast_created_date","target_month","company","brand","channel",
  "forecast_revenue_vnd","actual_revenue_vnd","actual_available_date","as_of_date",
  "eligibility_status","error_vnd","abs_error_vnd","snapshot_status","source_model_version",
  "approver","actual_period_close_date","exception_note"
];
const lines = [headers.join(",")];
for (const r of output) lines.push(headers.map(h => csvEscape(r[h])).join(","));
fs.writeFileSync(outputPath, lines.join("\n") + "\n", "utf8");

const counts = output.reduce((a, r) => { a[r.snapshot_status] = (a[r.snapshot_status] || 0) + 1; return a; }, {});
console.error(JSON.stringify({as_of_date: asOf, input_rows: output.length, snapshot_status_counts: counts}));
