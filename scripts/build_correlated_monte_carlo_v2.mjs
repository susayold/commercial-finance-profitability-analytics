#!/usr/bin/env node
/** Build a deterministic, correlated Monte Carlo appendix for the FP&A case. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const REPORTS = path.join(ROOT, 'reports');
const SEED = 20260902;
const N = 5000;
const money = value => Math.round(value * 10000) / 10000;
const esc = value => {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
const writeCsv = (file, headers, rows) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => esc(row[h])).join(','))].join('\n') + '\n', 'utf8');
};
const writeMd = (file, text) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text.endsWith('\n') ? text : `${text}\n`, 'utf8');
};

// The matrix is an explicit modelling assumption, not a historical calibration.
const drivers = ['revenue_shock', 'margin_shock', 'ccc_shock', 'cost_inflation_shock'];
const correlation = [
  [1.00, 0.35, -0.30, -0.20],
  [0.35, 1.00, -0.20, -0.45],
  [-0.30, -0.20, 1.00, 0.30],
  [-0.20, -0.45, 0.30, 1.00],
];

// Cholesky factor with a defensive positive-semidefinite check.
const cholesky = matrix => {
  const L = matrix.map(row => row.map(() => 0));
  for (let i = 0; i < matrix.length; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      let sum = matrix[i][j];
      for (let k = 0; k < j; k += 1) sum -= L[i][k] * L[j][k];
      if (i === j) {
        if (sum <= 0) throw new Error(`Correlation matrix is not positive definite at ${i}: ${sum}`);
        L[i][j] = Math.sqrt(sum);
      } else {
        L[i][j] = sum / L[j][j];
      }
    }
  }
  return L;
};
const L = cholesky(correlation);

let seed = SEED;
const rnd = () => {
  seed |= 0;
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return ((seed >>> 0) + 1) / 4294967297;
};
const normal = () => {
  let u = 0; let v = 0;
  while (u === 0) u = rnd();
  while (v === 0) v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const correlatedNormal = () => {
  const z = drivers.map(() => normal());
  return L.map((row, i) => row.reduce((sum, value, j) => sum + value * z[j], 0));
};

// FY2025 BASE centers are the same canonical centers used in v1. Values are VND bn, %, days.
const rows = [];
for (let i = 0; i < N; i += 1) {
  const [revenueShock, marginShock, cccShock, costInflationShock] = correlatedNormal();
  const revenue = 82.5138 + 3.0 * revenueShock;
  const margin = 15.6284 + 1.8 * marginShock - 0.8 * costInflationShock;
  const ebitda = revenue * margin / 100;
  const ccc = Math.max(20, 54 + 7 * cccShock + 2 * costInflationShock);
  rows.push({
    draw_id: i + 1,
    revenue_vnd_bn: money(revenue),
    ebitda_proxy_vnd_bn: money(ebitda),
    ebitda_margin_pct: money(margin),
    ccc_days: money(ccc),
    revenue_shock: money(revenueShock),
    margin_shock: money(marginShock),
    ccc_shock: money(cccShock),
    cost_inflation_shock: money(costInflationShock),
  });
}

// Watch thresholds are decision guardrails for the rehearsal, not a live budget approval.
const thresholds = {
  revenue_vnd_bn: { value: 76.9, direction: 'below' },
  ebitda_proxy_vnd_bn: { value: 9.0, direction: 'below' },
  ebitda_margin_pct: { value: 12.0, direction: 'below' },
  ccc_days: { value: 68.0, direction: 'above' },
};
const metricMeta = {
  revenue_vnd_bn: { unit: 'VND_bn', label: 'Revenue' },
  ebitda_proxy_vnd_bn: { unit: 'VND_bn', label: 'EBITDA proxy' },
  ebitda_margin_pct: { unit: 'percent', label: 'EBITDA margin' },
  ccc_days: { unit: 'days', label: 'CCC' },
};
const percentile = (values, q) => {
  const ordered = [...values].sort((a, b) => a - b);
  return ordered[Math.floor(q * (ordered.length - 1))];
};
const expectedShortfallGap = (values, threshold, direction) => {
  const ordered = [...values].sort((a, b) => direction === 'below' ? a - b : b - a);
  const tail = ordered.slice(0, Math.max(1, Math.ceil(values.length * 0.05)));
  const average = tail.reduce((sum, value) => sum + value, 0) / tail.length;
  return direction === 'below' ? threshold - average : average - threshold;
};
const summary = [];
for (const [metric, cfg] of Object.entries(thresholds)) {
  const values = rows.map(row => Number(row[metric]));
  for (const q of [0.05, 0.25, 0.50, 0.75, 0.95]) {
    summary.push({ metric, statistic: `p${String(q * 100).padStart(2, '0')}`, value: money(percentile(values, q)), unit: metricMeta[metric].unit, threshold: cfg.value, threshold_direction: cfg.direction, simulation_count: N, seed: SEED, evidence_class: 'SIMULATED_DERIVED', method: 'Correlated normal shocks + deterministic transforms', notes: 'Percentile of simulated outcome' });
  }
  const breach = rows.filter(row => cfg.direction === 'below' ? row[metric] < cfg.value : row[metric] > cfg.value).length / N;
  summary.push({ metric, statistic: 'probability_breach', value: money(breach), unit: 'probability', threshold: cfg.value, threshold_direction: cfg.direction, simulation_count: N, seed: SEED, evidence_class: 'SIMULATED_DERIVED', method: 'Correlated normal shocks + deterministic transforms', notes: 'Watch-threshold breach probability' });
  summary.push({ metric, statistic: 'expected_shortfall_05', value: money(expectedShortfallGap(values, cfg.value, cfg.direction)), unit: metricMeta[metric].unit, threshold: cfg.value, threshold_direction: cfg.direction, simulation_count: N, seed: SEED, evidence_class: 'SIMULATED_DERIVED', method: 'Mean adverse gap in worst 5% tail', notes: 'Positive adverse gap versus watch threshold' });
}
const joint = rows.filter(row => row.revenue_vnd_bn < thresholds.revenue_vnd_bn.value && row.ebitda_proxy_vnd_bn < thresholds.ebitda_proxy_vnd_bn.value && row.ccc_days > thresholds.ccc_days.value);
summary.push({ metric: 'joint_downside', statistic: 'probability_breach', value: money(joint.length / N), unit: 'probability', threshold: 'revenue<76.9 & EBITDA<9.0 & CCC>68.0', threshold_direction: 'joint', simulation_count: N, seed: SEED, evidence_class: 'SIMULATED_DERIVED', method: 'Joint watch-threshold test', notes: `${joint.length} joint draws` });
const jointSeverity = joint.map(row => Math.max(0, (thresholds.revenue_vnd_bn.value - row.revenue_vnd_bn) / 3) + Math.max(0, (thresholds.ebitda_proxy_vnd_bn.value - row.ebitda_proxy_vnd_bn) / 2) + Math.max(0, (row.ccc_days - thresholds.ccc_days.value) / 7));
summary.push({ metric: 'joint_downside', statistic: 'expected_shortfall_05', value: money(jointSeverity.length ? jointSeverity.sort((a, b) => b - a).slice(0, Math.max(1, Math.ceil(jointSeverity.length * 0.05))).reduce((sum, value) => sum + value, 0) / Math.max(1, Math.ceil(jointSeverity.length * 0.05)) : 0), unit: 'severity_index', threshold: 'joint_downside', threshold_direction: 'joint', simulation_count: N, seed: SEED, evidence_class: 'SIMULATED_DERIVED', method: 'Mean joint severity in worst 5% joint tail', notes: 'Dimensionless index; not a valuation' });

const attributionDrivers = [
  ['revenue_shortfall', row => Math.max(0, (thresholds.revenue_vnd_bn.value - row.revenue_vnd_bn) / 3)],
  ['ebitda_shortfall', row => Math.max(0, (thresholds.ebitda_proxy_vnd_bn.value - row.ebitda_proxy_vnd_bn) / 2)],
  ['ccc_stretch', row => Math.max(0, (row.ccc_days - thresholds.ccc_days.value) / 7)],
  ['cost_inflation_shock', row => Math.max(0, row.cost_inflation_shock)],
];
const attributionTotals = Object.fromEntries(attributionDrivers.map(([name]) => [name, joint.reduce((sum, row) => sum + attributionDrivers.find(([driver]) => driver === name)[1](row), 0)]));
const totalAttribution = Object.values(attributionTotals).reduce((sum, value) => sum + value, 0);
for (const [driver] of attributionDrivers) summary.push({ metric: driver, statistic: 'driver_attribution_share', value: money(totalAttribution ? attributionTotals[driver] / totalAttribution : 0), unit: 'probability', threshold: 'joint_downside', threshold_direction: 'joint', simulation_count: N, seed: SEED, evidence_class: 'SIMULATED_DERIVED', method: 'Share of normalized adverse severity in joint draws', notes: 'Attribution is directional, not causal proof' });

const summaryHeaders = ['metric', 'statistic', 'value', 'unit', 'threshold', 'threshold_direction', 'simulation_count', 'seed', 'evidence_class', 'method', 'notes'];
const drawHeaders = ['draw_id', 'revenue_vnd_bn', 'ebitda_proxy_vnd_bn', 'ebitda_margin_pct', 'ccc_days', 'revenue_shock', 'margin_shock', 'ccc_shock', 'cost_inflation_shock'];
writeCsv(path.join(DATA, 'monte_carlo_risk_overlay_v2_2026-09-02.csv'), summaryHeaders, summary);
writeCsv(path.join(DATA, 'monte_carlo_risk_overlay_v2_draws_2026-09-02.csv'), drawHeaders, rows);
writeCsv(path.join(DATA, 'monte_carlo_correlation_matrix_v2.csv'), ['driver', ...drivers], drivers.map((driver, i) => Object.fromEntries([['driver', driver], ...drivers.map((name, j) => [name, correlation[i][j]])])));

const jointProbability = joint.length / N;
const sortedEbitda = rows.map(row => row.ebitda_proxy_vnd_bn).sort((a, b) => a - b);
const sortedRevenue = rows.map(row => row.revenue_vnd_bn).sort((a, b) => a - b);
const sortedCcc = rows.map(row => row.ccc_days).sort((a, b) => a - b);
writeMd(path.join(REPORTS, 'MONTE_CARLO_RISK_OVERLAY_V2_2026-09-02.md'), `# Correlated Monte Carlo Risk Overlay v2 — VietNova FP&A\n\n**Status:** COMPLETE AS SIMULATED APPENDIX  \n**Simulation:** ${N.toLocaleString('en-US')} deterministic draws, seed ${SEED}  \n**Scope:** Non-Power-BI FP&A risk overlay; no live forecast accuracy claim\n\n## Purpose\n\nThis appendix upgrades the archived independent v1 overlay with an explicit correlation matrix, deterministic Cholesky sampling, expected-shortfall measures and directional downside-driver attribution. The output is a rehearsal for communicating uncertainty around the driver-based forecast; it is not a probability-calibrated production risk model.\n\n## Model assumptions\n\n| Driver | Treatment | Evidence boundary |\n|---|---|---|\n| Revenue shock | Correlated normal shock around VND 82.5138bn | Synthetic assumption |\n| Margin shock | Correlated normal shock around 15.6284%, reduced by cost inflation | Synthetic assumption |\n| CCC shock | Correlated normal shock around 54 days, with cost-inflation overlay | Synthetic assumption |\n| Cost inflation shock | Correlated normal shock; affects margin and CCC | Synthetic assumption |\n\nThe matrix is documented in data/monte_carlo_correlation_matrix_v2.csv. It is positive definite for this deterministic build, but it is not estimated from approved history.\n\n## Watch thresholds and output\n\n- Revenue watch threshold: **VND 76.9bn** (below).\n- EBITDA-proxy watch threshold: **VND 9.0bn** (below).\n- EBITDA-margin watch threshold: **12.0%** (below).\n- CCC watch threshold: **68.0 days** (above).\n- Joint watch: revenue < 76.9bn, EBITDA proxy < 9.0bn and CCC > 68.0 days.\n- P05/P50/P95, breach probability and worst-5% expected-shortfall gap are stored in the summary CSV.\n\nIllustrative distribution checks: EBITDA proxy P05 = **${sortedEbitda[Math.floor(0.05 * (N - 1))].toFixed(4)}bn**, revenue P05 = **${sortedRevenue[Math.floor(0.05 * (N - 1))].toFixed(4)}bn**, CCC P95 = **${sortedCcc[Math.floor(0.95 * (N - 1))].toFixed(4)} days**, and joint watch probability = **${(jointProbability * 100).toFixed(2)}%**.\n\n## Finance interpretation\n\n1. Correlation makes the tail more decision-relevant than four independent toy distributions because revenue, margin, working capital and input-cost pressure can move together.\n2. Expected shortfall answers “how bad is the adverse tail when a guardrail is breached?”; it does not forecast an accounting result.\n3. Attribution shares identify which normalized adverse components dominate the joint tail. They are directional diagnostics, not causal proof.\n\n## Decision rules\n\n- Keep the base plan while all core KPIs remain inside guardrails.\n- Trigger a management review when any breach probability or realized monthly indicator crosses the agreed threshold.\n- Escalate working-capital actions when CCC stretch and revenue shortfall appear in the same scenario.\n- Re-estimate the matrix from approved forecast errors and actual operating history before production use.\n\n## Limitations and handoff\n\n- VietNova inputs are deterministic synthetic data; correlation parameters are judgmental assumptions.\n- No Monte Carlo output closes Gate A. An approved internal pre-close forecast and post-close actuals are still required for live Bias/WAPE.\n- The v1 independent overlay remains archived for reproducibility; v2 is the recommended appendix for interviews.\n\n### Files\n\n- data/monte_carlo_risk_overlay_v2_2026-09-02.csv — summary statistics, breach probabilities, expected shortfall and attribution.\n- data/monte_carlo_risk_overlay_v2_draws_2026-09-02.csv — ${N.toLocaleString('en-US')} draw-level outputs.\n- data/monte_carlo_correlation_matrix_v2.csv — documented driver matrix.\n- scripts/build_correlated_monte_carlo_v2.mjs — deterministic builder.\n`);
console.log(JSON.stringify({ status: 'PASS', draws: N, seed: SEED, joint_downside_probability: jointProbability, summary_rows: summary.length }, null, 2));
