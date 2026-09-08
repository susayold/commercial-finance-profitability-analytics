#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DETAIL = path.join(ROOT, 'data', 'forecast', 'rolling_origin_revenue_backtest.csv');
const SUMMARY = path.join(ROOT, 'data', 'forecast', 'rolling_origin_revenue_backtest_summary.json');
const REPORT = path.join(ROOT, 'reports', 'ROLLING_ORIGIN_FORECAST_BACKTEST_2026-09-08.md');

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i], next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') { field += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift().map((x) => x.trim());
  return rows.filter((r) => r.some((x) => x !== '')).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

const addMonths = (ym, delta) => {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
};
const approx = (a, b, tol = 0.0002) => Math.abs(Number(a) - Number(b)) <= tol;
const checks = [];
const add = (name, pass, detail = '') => checks.push({ name, status: pass ? 'PASS' : 'FAIL', detail });

if (![DETAIL, SUMMARY, REPORT].every(fs.existsSync)) {
  console.error('FAIL: rolling-origin outputs are missing; run build_rolling_origin_revenue_backtest.mjs first');
  process.exit(1);
}

const detail = parseCsv(fs.readFileSync(DETAIL, 'utf8'));
const summary = JSON.parse(fs.readFileSync(SUMMARY, 'utf8'));
const report = fs.readFileSync(REPORT, 'utf8');

add('detail row count', detail.length === 195, `rows=${detail.length}`);
add('origin-target pair count', summary.origin_target_pairs === 65 && summary.detail_rows === 195, `${summary.origin_target_pairs}/${summary.detail_rows}`);
add('history window', summary.history_window?.start === '2023-01' && summary.history_window?.end === '2025-12' && summary.history_window?.months === 36, JSON.stringify(summary.history_window));
add('evaluation type', summary.evaluation === 'rolling_origin_out_of_sample', summary.evaluation);
add('primary model pre-specified', summary.primary_model === 'SEASONAL_NAIVE_12', summary.primary_model);
add('Gate A stays open', String(summary.gate_a_status).startsWith('OPEN_') && summary.live_accuracy_claim_allowed === false, summary.gate_a_status);
add('evidence class controlled', summary.evidence_class === 'SIMULATED_HISTORICAL_BACKTEST', summary.evidence_class);
add('claim boundary explicit', /Out-of-sample rolling-origin/i.test(summary.approved_claim ?? '') && /Live company or employer forecast accuracy/i.test(summary.prohibited_claim ?? ''), 'approved/prohibited claims present');

let leakageSafe = true;
let evidenceSafe = true;
for (const r of detail) {
  const horizon = Number(r.horizon_months);
  if (addMonths(r.origin_period, horizon) !== r.target_period) leakageSafe = false;
  if (r.training_end_period !== r.origin_period) leakageSafe = false;
  if (addMonths(r.target_period, -12) !== r.seasonal_reference_period) leakageSafe = false;
  if (r.training_start_period > r.training_end_period || r.training_end_period >= r.target_period) leakageSafe = false;
  if (r.evidence_class !== 'SIMULATED_HISTORICAL_BACKTEST' || r.live_accuracy_claim_allowed !== 'false') evidenceSafe = false;
}
add('time ordering is leakage-safe', leakageSafe, 'training/reference periods precede every target');
add('detail claim boundary', evidenceSafe, 'all rows are simulated historical evidence; live claim false');

const expectedCounts = { 1: 24, 3: 22, 6: 19 };
for (const [h, expected] of Object.entries(expectedCounts)) {
  const rows = detail.filter((r) => Number(r.horizon_months) === Number(h));
  const models = ['SEASONAL_NAIVE_12', 'ENSEMBLE_50_50', 'LINEAR_TREND_12'];
  add(`${h}M row count`, rows.length === expected * 3 && models.every((m) => rows.filter((r) => r.model_id === m).length === expected), `rows=${rows.length}`);
}

const expectedPrimary = {
  1: { bias: 0.2510, wape: 1.1734, n: 24 },
  3: { bias: 0.1558, wape: 1.1554, n: 22 },
  6: { bias: 0.1125, wape: 1.1782, n: 19 },
};
for (const [h, exp] of Object.entries(expectedPrimary)) {
  const row = summary.results.find((r) => r.horizon_months === Number(h) && r.model_id === 'SEASONAL_NAIVE_12');
  add(`${h}M primary metrics`, Boolean(row) && row.eligible_forecasts === exp.n && approx(row.bias_pct, exp.bias) && approx(row.wape_pct, exp.wape), row ? `n=${row.eligible_forecasts}; bias=${row.bias_pct}; wape=${row.wape_pct}` : 'missing');
  const challengers = summary.results.filter((r) => r.horizon_months === Number(h) && r.model_id !== 'SEASONAL_NAIVE_12');
  add(`${h}M benchmark wins on WAPE`, Boolean(row) && challengers.length === 2 && challengers.every((r) => row.wape_pct < r.wape_pct), challengers.map((r) => `${r.model_id}:${r.wape_pct}`).join('; '));
}

add('report states simulated boundary', /SIMULATED_HISTORICAL_BACKTEST/.test(report) && /Gate A therefore remains \*\*OPEN\*\*/.test(report), 'report evidence boundary present');
add('report warns against generalization', /should not be generalized to real FMCG forecast performance/i.test(report), 'synthetic-history caveat present');

const passed = checks.filter((x) => x.status === 'PASS').length;
const status = passed === checks.length ? 'PASS' : 'FAIL';
console.log(JSON.stringify({ status, passed, total: checks.length, checks }, null, 2));
if (status !== 'PASS') process.exit(1);
