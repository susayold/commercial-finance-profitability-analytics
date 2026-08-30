#!/usr/bin/env node
/**
 * Validate customer-level gross-to-net, contribution and working-capital overlays.
 * Evidence is synthetic rehearsal only.
 */
import fs from 'node:fs';

const input = process.argv[2] || 'data/customer_profitability_synthetic.csv';
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
  'customer_id','customer_name','channel','region','payment_terms_days','gross_sales_vnd_mn',
  'discounts_vnd_mn','rebates_vnd_mn','returns_vnd_mn','net_sales_vnd_mn','cogs_vnd_mn',
  'delivery_vnd_mn','customer_support_vnd_mn','contribution_vnd_mn','contribution_margin_pct',
  'ar_balance_vnd_mn','dso_days','working_capital_cost_vnd_mn',
  'contribution_after_wc_cost_vnd_mn','strategic_flag',
];
const missing = required.filter((name) => !headers.includes(name));
if (missing.length) throw new Error('Missing headers: ' + missing.join(', '));

const rows = lines.slice(1).map((line) => {
  const values = parseLine(line);
  const row = Object.fromEntries(headers.map((header, index) => [header, (values[index] || '').trim()]));
  for (const key of required.slice(4)) row[key] = Number(row[key]);
  return row;
});
const close = (a, b) => Math.abs(a - b) <= 0.02;
const closeRounded = (a, b) => Math.abs(a - b) <= 0.5;
const checks = [];
checks.push({ name: 'row_count_24', pass: rows.length === 24, detail: 'rows=' + rows.length });
checks.push({ name: 'unique_customer_ids', pass: new Set(rows.map((row) => row.customer_id)).size === rows.length, detail: 'unique=' + new Set(rows.map((row) => row.customer_id)).size });
checks.push({ name: 'channel_coverage', pass: ['General Trade','Modern Trade','Marketplace','D2C','Wholesale'].every((channel) => rows.some((row) => row.channel === channel)), detail: 'all five channels present' });
checks.push({ name: 'gross_to_net_bridge', pass: rows.every((row) => close(row.net_sales_vnd_mn, row.gross_sales_vnd_mn - row.discounts_vnd_mn - row.rebates_vnd_mn - row.returns_vnd_mn)), detail: 'net sales bridge' });
checks.push({ name: 'contribution_bridge', pass: rows.every((row) => close(row.contribution_vnd_mn, row.net_sales_vnd_mn - row.cogs_vnd_mn - row.delivery_vnd_mn - row.customer_support_vnd_mn)), detail: 'customer contribution bridge' });
checks.push({ name: 'margin_recompute', pass: rows.every((row) => row.net_sales_vnd_mn > 0 && close(row.contribution_margin_pct, row.contribution_vnd_mn / row.net_sales_vnd_mn * 100)), detail: 'contribution margin' });
checks.push({ name: 'dso_recompute', pass: rows.every((row) => row.net_sales_vnd_mn > 0 && close(row.dso_days, row.ar_balance_vnd_mn / row.net_sales_vnd_mn * 365)), detail: 'DSO from AR and net sales' });
checks.push({ name: 'working_capital_overlay', pass: rows.every((row) => closeRounded(row.working_capital_cost_vnd_mn, row.ar_balance_vnd_mn * 0.1) && closeRounded(row.contribution_after_wc_cost_vnd_mn, row.contribution_vnd_mn - row.working_capital_cost_vnd_mn)), detail: '10% carrying-cost proxy and after-WC contribution' });
checks.push({ name: 'no_negative_economics_inputs', pass: rows.every((row) => [row.gross_sales_vnd_mn,row.net_sales_vnd_mn,row.cogs_vnd_mn,row.ar_balance_vnd_mn].every((value) => value >= 0)), detail: 'sales, costs and AR non-negative' });
const national = rows.find((row) => row.customer_id === 'C06');
checks.push({ name: 'high_revenue_low_margin_signal', pass: Boolean(national && national.gross_sales_vnd_mn >= 18000 && national.contribution_margin_pct < 20 && national.dso_days > 80), detail: national ? 'C06 margin=' + national.contribution_margin_pct + '%; DSO=' + national.dso_days : 'C06 missing' });

const passed = checks.filter((check) => check.pass).length;
const overall = checks.every((check) => check.pass);
const summary = 'Customer profitability QA: ' + passed + '/' + checks.length + ' checks PASS; status=' + (overall ? 'PASS' : 'FAIL') + '; evidence=SYNTHETIC_REHEARSAL';
console.log(summary);
for (const check of checks) console.log((check.pass ? 'PASS ' : 'FAIL ') + check.name + ' — ' + check.detail);
if (output) {
  const markdown = [
    '# Customer Profitability QA',
    '',
    '- Overall: **' + (overall ? 'PASS' : 'FAIL') + '**',
    '- Evidence class: **SYNTHETIC_REHEARSAL**',
    '- Summary: ' + summary,
    '',
    '## Checks',
    '',
    ...checks.map((check) => '- ' + (check.pass ? 'PASS' : 'FAIL') + ' — ' + check.name + ': ' + check.detail),
    '',
    'C06 is intentionally visible as a high-revenue / low-margin / long-DSO review account; this is not a real customer conclusion.',
    '',
  ].join('\n');
  fs.writeFileSync(output, markdown);
}
if (!overall) process.exit(1);
