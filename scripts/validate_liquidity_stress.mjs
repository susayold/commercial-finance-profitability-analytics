#!/usr/bin/env node
/**
 * Validate the deterministic cash / revolver liquidity-stress schedule.
 * The schedule is synthetic rehearsal evidence, never LIVE_INTERNAL evidence.
 */
import fs from 'node:fs';

const input = process.argv[2] || 'data/liquidity_stress_synthetic.csv';
const output = process.argv[3] || null;
const raw = fs.readFileSync(input, 'utf8').replace(/^\uFEFF/, '');
const lines = raw.split(/\r?\n/).filter((line) => line.trim());

function parseLine(line) {
  const cells = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (ch === ',' && !quoted) {
      cells.push(value);
      value = '';
    } else {
      value += ch;
    }
  }
  cells.push(value);
  return cells;
}

const headers = parseLine(lines[0]);
const required = [
  'scenario','month','opening_cash_vnd_mn','operating_cash_flow_vnd_mn',
  'capex_vnd_mn','working_capital_cash_use_vnd_mn','interest_vnd_mn',
  'principal_vnd_mn','min_cash_policy_vnd_mn','revolver_limit_vnd_mn',
  'opening_revolver_vnd_mn','revolver_draw_vnd_mn','revolver_repayment_vnd_mn',
  'ending_cash_vnd_mn','closing_revolver_vnd_mn','liquidity_headroom_vnd_mn',
];
const missing = required.filter((name) => !headers.includes(name));
if (missing.length) throw new Error('Missing headers: ' + missing.join(', '));

const rows = lines.slice(1).map((line) => {
  const values = parseLine(line);
  const row = Object.fromEntries(headers.map((header, index) => [header, (values[index] || '').trim()]));
  for (const key of required.slice(2)) row[key] = Number(row[key]);
  return row;
});
const round = (value) => Math.round(value * 100) / 100;
const close = (a, b) => Math.abs(a - b) <= 0.01;
const checks = [];
checks.push({ name: 'row_count_24', pass: rows.length === 24, detail: 'rows=' + rows.length });
const scenarios = new Set(rows.map((row) => row.scenario));
checks.push({ name: 'base_and_downside_present', pass: scenarios.has('BASE') && scenarios.has('DOWNSIDE'), detail: Array.from(scenarios).join(',') });
checks.push({ name: '12_months_per_scenario', pass: ['BASE', 'DOWNSIDE'].every((s) => rows.filter((row) => row.scenario === s).length === 12), detail: 'BASE=' + rows.filter((row) => row.scenario === 'BASE').length + '; DOWNSIDE=' + rows.filter((row) => row.scenario === 'DOWNSIDE').length });
checks.push({ name: 'cash_and_revolver_roll_forward', pass: ['BASE', 'DOWNSIDE'].every((scenario) => {
  const group = rows.filter((row) => row.scenario === scenario);
  return group.every((row, index) => index === 0 || (close(row.opening_cash_vnd_mn, group[index - 1].ending_cash_vnd_mn) && close(row.opening_revolver_vnd_mn, group[index - 1].closing_revolver_vnd_mn)));
}), detail: 'opening balances tie to prior closing balances' });
checks.push({ name: 'cash_formula_tie_out', pass: rows.every((row) => {
  const pre = row.opening_cash_vnd_mn + row.operating_cash_flow_vnd_mn - row.capex_vnd_mn - row.working_capital_cash_use_vnd_mn - row.interest_vnd_mn - row.principal_vnd_mn;
  return close(row.ending_cash_vnd_mn, pre + row.revolver_draw_vnd_mn - row.revolver_repayment_vnd_mn);
}), detail: 'ending cash formula' });
checks.push({ name: 'revolver_formula_tie_out', pass: rows.every((row) => close(row.closing_revolver_vnd_mn, row.opening_revolver_vnd_mn + row.revolver_draw_vnd_mn - row.revolver_repayment_vnd_mn)), detail: 'closing revolver formula' });
checks.push({ name: 'facility_and_repayment_caps', pass: rows.every((row) => row.revolver_draw_vnd_mn >= -0.01 && row.revolver_draw_vnd_mn <= row.revolver_limit_vnd_mn - row.opening_revolver_vnd_mn + 0.01 && row.revolver_repayment_vnd_mn >= -0.01 && row.revolver_repayment_vnd_mn <= row.opening_revolver_vnd_mn + 0.01), detail: 'draw and repayment bounds' });
checks.push({ name: 'headroom_formula_tie_out', pass: rows.every((row) => close(row.liquidity_headroom_vnd_mn, row.ending_cash_vnd_mn + row.revolver_limit_vnd_mn - row.closing_revolver_vnd_mn - row.min_cash_policy_vnd_mn)), detail: 'policy headroom formula' });
checks.push({ name: 'stress_signal_visible', pass: rows.some((row) => row.scenario === 'DOWNSIDE' && row.liquidity_headroom_vnd_mn < 0) && rows.every((row) => row.scenario !== 'BASE' || row.liquidity_headroom_vnd_mn >= 0), detail: 'downside breach visible; base remains above policy' });

const passed = checks.filter((check) => check.pass).length;
const overall = checks.every((check) => check.pass);
const summary = 'Liquidity stress QA: ' + passed + '/' + checks.length + ' checks PASS; status=' + (overall ? 'PASS' : 'FAIL') + '; evidence=SYNTHETIC_REHEARSAL';
console.log(summary);
for (const check of checks) console.log((check.pass ? 'PASS ' : 'FAIL ') + check.name + ' — ' + check.detail);
if (output) {
  const markdown = [
    '# Liquidity Stress QA',
    '',
    '- Overall: **' + (overall ? 'PASS' : 'FAIL') + '**',
    '- Evidence class: **SYNTHETIC_REHEARSAL**',
    '- Summary: ' + summary,
    '',
    '## Checks',
    '',
    ...checks.map((check) => '- ' + (check.pass ? 'PASS' : 'FAIL') + ' — ' + check.name + ': ' + check.detail),
    '',
    'Negative headroom is intentionally surfaced as a downside breach and is not converted to zero.',
    '',
  ].join('\n');
  fs.writeFileSync(output, markdown);
}
if (!overall) process.exit(1);
