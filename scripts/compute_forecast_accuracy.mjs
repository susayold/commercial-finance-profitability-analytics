#!/usr/bin/env node
/**
 * Compute forecast Bias and WAPE without future-period leakage.
 *
 * Usage:
 *   node compute_forecast_accuracy.mjs input.csv output.csv 2025-12-31
 *
 * Required columns:
 * forecast_version,forecast_created_date,target_month,company,brand,channel,
 * forecast_revenue_vnd,actual_revenue_vnd,actual_available_date
 *
 * Rows whose actual_available_date is after the as-of date are excluded and
 * reported as NOT_ELIGIBLE. This keeps the backtest honest.
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

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

const [inputPath, outputPath, asOfArg] = process.argv.slice(2);
if (!inputPath || !outputPath) throw new Error("Usage: node compute_forecast_accuracy.mjs input.csv output.csv [as-of YYYY-MM-DD]");
const asOf = new Date(asOfArg || new Date().toISOString().slice(0, 10));
if (Number.isNaN(asOf.getTime())) throw new Error("Invalid as-of date");

const rows = parseCsv(fs.readFileSync(inputPath, "utf8"));
const required = ["forecast_version","forecast_created_date","target_month","company","brand","channel","forecast_revenue_vnd","actual_revenue_vnd","actual_available_date"];
const missing = required.filter(c => !(c in (rows[0] || {})));
if (missing.length) throw new Error("Missing columns: " + missing.join(", "));

const eligible = [], excluded = [];
for (const r of rows) {
  const actualDate = new Date(r.actual_available_date);
  const created = new Date(r.forecast_created_date);
  const target = new Date(r.target_month + "-01");
  const forecast = Number(r.forecast_revenue_vnd);
  const actual = Number(r.actual_revenue_vnd);
  if ([created, target, actualDate].some(d => Number.isNaN(d.getTime())) || !Number.isFinite(forecast) || !Number.isFinite(actual)) {
    excluded.push({...r, eligibility_status:"INVALID_INPUT"}); continue;
  }
  if (actualDate > asOf) { excluded.push({...r, eligibility_status:"NOT_ELIGIBLE"}); continue; }
  if (created > actualDate) { excluded.push({...r, eligibility_status:"FUTURE_LEAKAGE"}); continue; }
  eligible.push({...r, forecast, actual});
}

const groups = new Map();
for (const r of eligible) {
  const key = [r.forecast_version,r.company,r.brand,r.channel].join("|");
  const g = groups.get(key) || {forecast_version:r.forecast_version,company:r.company,brand:r.brand,channel:r.channel,rows:0,sum_forecast:0,sum_actual:0,sum_abs_error:0};
  const diff = r.forecast - r.actual;
  g.rows++; g.sum_forecast += r.forecast; g.sum_actual += r.actual; g.sum_abs_error += Math.abs(diff);
  groups.set(key, g);
}
const out = [];
for (const g of groups.values()) {
  const denominator = Math.abs(g.sum_actual);
  out.push({
    forecast_version:g.forecast_version, company:g.company, brand:g.brand, channel:g.channel,
    eligible_rows:g.rows, forecast_vnd:g.sum_forecast, actual_vnd:g.sum_actual,
    bias: denominator ? (g.sum_forecast - g.sum_actual) / g.sum_actual : "",
    wape: denominator ? g.sum_abs_error / denominator : "",
    as_of_date: asOf.toISOString().slice(0,10), excluded_rows: excluded.length
  });
}
const outHeader = ["forecast_version","company","brand","channel","eligible_rows","forecast_vnd","actual_vnd","bias","wape","as_of_date","excluded_rows"];
const lines = [outHeader.join(",")];
for (const r of out) lines.push(outHeader.map(h => csvEscape(r[h])).join(","));
fs.writeFileSync(outputPath, lines.join("\n") + "\n", "utf8");
console.error(JSON.stringify({as_of_date:asOf.toISOString().slice(0,10),input_rows:rows.length,eligible_rows:eligible.length,excluded_rows:excluded.length,groups:out.length,excluded_reason_counts:excluded.reduce((a,r)=>(a[r.eligibility_status]=(a[r.eligibility_status]||0)+1,a),{})}));
