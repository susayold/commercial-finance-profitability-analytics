#!/usr/bin/env node
/**
 * Validate inventory aging, write-off and shrinkage controls.
 * Evidence is synthetic rehearsal only; no physical-count conclusion is implied.
 */
import fs from 'node:fs';

const input = process.argv[2] || 'data/inventory_quality_synthetic.csv';
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
      if (quoted && line[i + 1] === '"') { value += '"'; i += 1; }
      else quoted = !quoted;
    } else if (ch === ',' && !quoted) { cells.push(value); value = ''; }
    else value += ch;
  }
  cells.push(value);
  return cells;
}

const headers = parseLine(lines[0]);
const required = [
  'month','category','opening_units','purchases_units','sales_units','transfers_in_units',
  'transfers_out_units','writeoff_units','shrinkage_units','closing_units','unit_cost_vnd',
  'closing_inventory_value_vnd','aging_0_30_vnd','aging_31_60_vnd','aging_61_90_vnd',
  'aging_90_plus_vnd','obsolete_reserve_vnd','wastage_rate_pct','shrinkage_rate_pct',
];
const missing = required.filter((name) => !headers.includes(name));
if (missing.length) throw new Error('Missing headers: ' + missing.join(', '));

const rows = lines.slice(1).map((line) => {
  const values = parseLine(line);
  const row = Object.fromEntries(headers.map((header, index) => [header, (values[index] || '').trim()]));
  for (const key of required.slice(2)) row[key] = Number(row[key]);
  return row;
});
const close = (a, b) => Math.abs(a - b) <= 0.01;
const categories = ['VietSpice', 'QuickBowl', 'PulseUp'];
const reserveRate = { VietSpice: 0.4, QuickBowl: 0.6, PulseUp: 0.5 };
const checks = [];
checks.push({ name: 'row_count_36', pass: rows.length === 36, detail: 'rows=' + rows.length });
checks.push({ name: 'category_month_coverage', pass: categories.every((category) => rows.filter((row) => row.category === category).length === 12), detail: categories.map((category) => category + '=' + rows.filter((row) => row.category === category).length).join('; ') });
checks.push({ name: 'opening_roll_forward', pass: categories.every((category) => {
  const group = rows.filter((row) => row.category === category);
  return group.every((row, index) => index === 0 || close(row.opening_units, group[index - 1].closing_units));
}), detail: 'opening units tie to prior closing units' });
checks.push({ name: 'inventory_roll_forward', pass: rows.every((row) => row.closing_units >= 0 && close(row.closing_units, row.opening_units + row.purchases_units + row.transfers_in_units - row.transfers_out_units - row.sales_units - row.writeoff_units - row.shrinkage_units)), detail: 'closing units formula and non-negative stock' });
checks.push({ name: 'inventory_value_tie_out', pass: rows.every((row) => close(row.closing_inventory_value_vnd, row.closing_units * row.unit_cost_vnd)), detail: 'closing value = closing units × unit cost' });
checks.push({ name: 'aging_bucket_tie_out', pass: rows.every((row) => close(row.closing_inventory_value_vnd, row.aging_0_30_vnd + row.aging_31_60_vnd + row.aging_61_90_vnd + row.aging_90_plus_vnd) && [row.aging_0_30_vnd, row.aging_31_60_vnd, row.aging_61_90_vnd, row.aging_90_plus_vnd].every((value) => value >= 0)), detail: 'four aging buckets sum to closing value' });
checks.push({ name: 'reserve_tie_out', pass: rows.every((row) => close(row.obsolete_reserve_vnd, row.aging_90_plus_vnd * reserveRate[row.category])), detail: '>90-day reserve rate by category' });
checks.push({ name: 'quality_rates_tie_out', pass: rows.every((row) => {
  const available = row.opening_units + row.purchases_units + row.transfers_in_units - row.transfers_out_units;
  return available > 0 && close(row.wastage_rate_pct, row.writeoff_units / available * 100) && close(row.shrinkage_rate_pct, row.shrinkage_units / available * 100);
}), detail: 'write-off and shrinkage rates recalculate from available units' });
checks.push({ name: 'quickbowl_aged_risk_visible', pass: rows.filter((row) => row.category === 'QuickBowl' && row.month >= '2026-07-01').every((row) => close(row.aging_90_plus_vnd / row.closing_inventory_value_vnd, 0.18)), detail: 'QuickBowl >90-day share is 18% from July onward' });

const passed = checks.filter((check) => check.pass).length;
const overall = checks.every((check) => check.pass);
const summary = 'Inventory quality QA: ' + passed + '/' + checks.length + ' checks PASS; status=' + (overall ? 'PASS' : 'FAIL') + '; evidence=SYNTHETIC_REHEARSAL';
console.log(summary);
for (const check of checks) console.log((check.pass ? 'PASS ' : 'FAIL ') + check.name + ' — ' + check.detail);
if (output) {
  const markdown = [
    '# Inventory Quality QA',
    '',
    '- Overall: **' + (overall ? 'PASS' : 'FAIL') + '**',
    '- Evidence class: **SYNTHETIC_REHEARSAL**',
    '- Summary: ' + summary,
    '',
    '## Checks',
    '',
    ...checks.map((check) => '- ' + (check.pass ? 'PASS' : 'FAIL') + ' — ' + check.name + ': ' + check.detail),
    '',
    'A physical-count, expiry or reserve conclusion still requires controlled warehouse and accounting evidence.',
    '',
  ].join('\n');
  fs.writeFileSync(output, markdown);
}
if (!overall) process.exit(1);
