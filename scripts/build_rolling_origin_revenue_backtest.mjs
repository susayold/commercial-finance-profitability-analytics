#!/usr/bin/env node
/**
 * Leakage-safe rolling-origin backtest on VietNova simulated monthly revenue.
 *
 * This is historical out-of-sample evidence on SIMULATED/DERIVED operating data.
 * It is NOT live company forecast accuracy and does not close Gate A.
 *
 * Primary model is pre-specified: SEASONAL_NAIVE_12.
 * Challengers: LINEAR_TREND_12 and ENSEMBLE_50_50.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const INPUT = path.join(ROOT, 'data', 'financial_statements', 'monthly_income_statement.csv');
const OUT_DIR = path.join(ROOT, 'data', 'forecast');
const REPORT = path.join(ROOT, 'reports', 'ROLLING_ORIGIN_FORECAST_BACKTEST_2026-09-08.md');
const HORIZONS = [1, 3, 6];
const MIN_HISTORY = 12;
const PRIMARY_MODEL = 'SEASONAL_NAIVE_12';
const EVIDENCE_CLASS = 'SIMULATED_HISTORICAL_BACKTEST';

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(REPORT), { recursive: true });

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

const n = (v) => {
  const x = Number(v);
  if (!Number.isFinite(x)) throw new Error(`Expected numeric value, got ${v}`);
  return x;
};
const round = (v, d = 4) => Number(v.toFixed(d));
const csvEscape = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const writeCsv = (file, headers, rows) => {
  const body = [headers.join(','), ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(','))].join('\n');
  fs.writeFileSync(path.join(OUT_DIR, file), `${body}\n`, 'utf8');
};

const source = parseCsv(fs.readFileSync(INPUT, 'utf8'))
  .map((r) => ({ period: r.period, value: n(r.net_revenue_vnd), evidence_class: r.evidence_class }))
  .sort((a, b) => a.period.localeCompare(b.period));

if (source.length !== 36) throw new Error(`Expected 36 monthly periods, got ${source.length}`);
if (source[0].period !== '2023-01' || source.at(-1).period !== '2025-12') {
  throw new Error(`Unexpected history window: ${source[0].period}..${source.at(-1).period}`);
}

function linearTrendForecast(history12, horizon) {
  const xs = history12.map((_, i) => i);
  const ys = history12.map((r) => r.value);
  const xMean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const yMean = ys.reduce((a, b) => a + b, 0) / ys.length;
  const cov = xs.reduce((a, x, i) => a + (x - xMean) * (ys[i] - yMean), 0);
  const variance = xs.reduce((a, x) => a + (x - xMean) ** 2, 0);
  const slope = variance === 0 ? 0 : cov / variance;
  const intercept = yMean - slope * xMean;
  return intercept + slope * (history12.length - 1 + horizon);
}

const detail = [];
for (const horizon of HORIZONS) {
  for (let originIdx = MIN_HISTORY - 1; originIdx + horizon < source.length; originIdx += 1) {
    const targetIdx = originIdx + horizon;
    const history12 = source.slice(originIdx - 11, originIdx + 1);
    const seasonalSourceIdx = targetIdx - 12;
    if (seasonalSourceIdx > originIdx) throw new Error('Leakage detected in seasonal source index');

    const seasonal = source[seasonalSourceIdx].value;
    const trend = linearTrendForecast(history12, horizon);
    const ensemble = (seasonal + trend) / 2;
    const actual = source[targetIdx].value;
    const forecasts = {
      SEASONAL_NAIVE_12: seasonal,
      LINEAR_TREND_12: trend,
      ENSEMBLE_50_50: ensemble,
    };

    for (const [model, forecast] of Object.entries(forecasts)) {
      detail.push({
        origin_period: source[originIdx].period,
        target_period: source[targetIdx].period,
        horizon_months: horizon,
        model_id: model,
        is_primary_model: model === PRIMARY_MODEL,
        training_start_period: history12[0].period,
        training_end_period: history12.at(-1).period,
        seasonal_reference_period: source[seasonalSourceIdx].period,
        forecast_value_vnd: round(forecast, 2),
        actual_value_vnd: round(actual, 2),
        error_vnd: round(forecast - actual, 2),
        abs_error_vnd: round(Math.abs(forecast - actual), 2),
        evidence_class: EVIDENCE_CLASS,
        live_accuracy_claim_allowed: false,
      });
    }
  }
}

const summaryRows = [];
for (const horizon of HORIZONS) {
  for (const model of [PRIMARY_MODEL, 'ENSEMBLE_50_50', 'LINEAR_TREND_12']) {
    const rows = detail.filter((r) => r.horizon_months === horizon && r.model_id === model);
    const forecastTotal = rows.reduce((a, r) => a + r.forecast_value_vnd, 0);
    const actualTotal = rows.reduce((a, r) => a + r.actual_value_vnd, 0);
    const absError = rows.reduce((a, r) => a + r.abs_error_vnd, 0);
    summaryRows.push({
      horizon_months: horizon,
      model_id: model,
      is_primary_model: model === PRIMARY_MODEL,
      eligible_forecasts: rows.length,
      forecast_total_vnd: round(forecastTotal, 2),
      actual_total_vnd: round(actualTotal, 2),
      bias_pct: round(((forecastTotal - actualTotal) / actualTotal) * 100, 4),
      wape_pct: round((absError / Math.abs(actualTotal)) * 100, 4),
      mae_vnd: round(absError / rows.length, 2),
      evidence_class: EVIDENCE_CLASS,
    });
  }
}

const detailHeaders = [
  'origin_period', 'target_period', 'horizon_months', 'model_id', 'is_primary_model',
  'training_start_period', 'training_end_period', 'seasonal_reference_period',
  'forecast_value_vnd', 'actual_value_vnd', 'error_vnd', 'abs_error_vnd',
  'evidence_class', 'live_accuracy_claim_allowed',
];
writeCsv('rolling_origin_revenue_backtest.csv', detailHeaders, detail);
writeCsv(
  'rolling_origin_revenue_backtest_metrics.csv',
  ['horizon_months', 'model_id', 'is_primary_model', 'eligible_forecasts', 'forecast_total_vnd', 'actual_total_vnd', 'bias_pct', 'wape_pct', 'mae_vnd', 'evidence_class'],
  summaryRows,
);

const summary = {
  generated_on: '2026-09-08',
  input: 'data/financial_statements/monthly_income_statement.csv',
  metric: 'net_revenue_vnd',
  history_window: { start: source[0].period, end: source.at(-1).period, months: source.length },
  evaluation: 'rolling_origin_out_of_sample',
  minimum_history_months: MIN_HISTORY,
  horizons_months: HORIZONS,
  primary_model: PRIMARY_MODEL,
  challenger_models: ['ENSEMBLE_50_50', 'LINEAR_TREND_12'],
  origin_target_pairs: detail.length / 3,
  detail_rows: detail.length,
  evidence_class: EVIDENCE_CLASS,
  gate_a_status: 'OPEN_PENDING_GENUINE_PRE_CLOSE_FORECAST_AND_POST_CLOSE_ACTUAL',
  live_accuracy_claim_allowed: false,
  approved_claim: 'Out-of-sample rolling-origin revenue backtest on simulated historical operating data.',
  prohibited_claim: 'Live company or employer forecast accuracy.',
  results: summaryRows,
};
fs.writeFileSync(path.join(OUT_DIR, 'rolling_origin_revenue_backtest_summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

const primary = summaryRows.filter((r) => r.model_id === PRIMARY_MODEL);
const lines = [
  '# Rolling-Origin Revenue Forecast Backtest — Simulated Historical Evidence',
  '',
  'Date: 2026-09-08',
  '',
  '## Executive result',
  '',
  'A leakage-safe rolling-origin backtest was run on the 36-month simulated/derived monthly net-revenue history (2023-01 to 2025-12). The pre-specified primary model is a transparent 12-month seasonal-naive baseline; a 12-month linear trend and a 50/50 ensemble are challengers.',
  '',
  '| Horizon | Primary model | Eligible forecasts | Bias | WAPE | MAE (VND m) |',
  '|---:|---|---:|---:|---:|---:|',
  ...primary.map((r) => `| ${r.horizon_months}M | ${r.model_id} | ${r.eligible_forecasts} | ${r.bias_pct.toFixed(4)}% | ${r.wape_pct.toFixed(4)}% | ${(r.mae_vnd / 1e6).toFixed(2)} |`),
  '',
  'The primary seasonal baseline outperforms both challengers on WAPE across 1M, 3M and 6M horizons in this controlled synthetic history. That is a useful forecast-value-add result: complexity is not promoted when it does not beat a transparent benchmark.',
  '',
  '## Model comparison',
  '',
  '| Horizon | Model | Bias | WAPE |',
  '|---:|---|---:|---:|',
  ...summaryRows.map((r) => `| ${r.horizon_months}M | ${r.model_id} | ${r.bias_pct.toFixed(4)}% | ${r.wape_pct.toFixed(4)}% |`),
  '',
  '## Leakage control',
  '',
  '- Each forecast origin uses only observations available through that origin month.',
  '- The seasonal-naive reference is the same target month one year earlier and is always known at the origin for the governed 1M/3M/6M horizons.',
  '- The trend challenger is fitted only on the latest 12 observations available at the origin.',
  '- Target actuals are attached only after forecasts are produced, solely for scoring.',
  '- No future actual is multiplied by a preset offset to create these forecasts.',
  '',
  '## Evidence boundary and Gate A',
  '',
  `Evidence class: **${EVIDENCE_CLASS}**.`,
  '',
  '**Approved recruiter-facing claim:** “Out-of-sample rolling-origin revenue backtest on simulated historical operating data.”',
  '',
  '**Not permitted:** claiming these WAPE/Bias figures as live company, employer or production forecast accuracy.',
  '',
  'Gate A therefore remains **OPEN**. It can close only with a genuine forecast snapshot frozen before close plus post-close actuals and the required approval metadata.',
  '',
  'The unusually low WAPE of the seasonal baseline reflects the stable recurring seasonality embedded in this synthetic history. It should not be generalized to real FMCG forecast performance.',
  '',
  '## Rebuild and validation',
  '',
  '```bash',
  'node scripts/build_rolling_origin_revenue_backtest.mjs',
  'node scripts/validate_rolling_origin_revenue_backtest.mjs',
  '```',
  '',
  'Generated outputs:',
  '',
  '- `data/forecast/rolling_origin_revenue_backtest.csv`',
  '- `data/forecast/rolling_origin_revenue_backtest_metrics.csv`',
  '- `data/forecast/rolling_origin_revenue_backtest_summary.json`',
];
fs.writeFileSync(REPORT, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ status: 'BUILT', detail_rows: detail.length, origin_target_pairs: detail.length / 3, primary_results: primary, report: path.relative(ROOT, REPORT) }, null, 2));
