#!/usr/bin/env node
/**
 * Validate the deterministic customer profitability summary against its source schedule.
 * Evidence is synthetic rehearsal only; rounded VND million fields use a 0.5 tolerance.
 */
import fs from 'node:fs';

const csvPath = process.argv[2] || 'data/customer_profitability_synthetic.csv';
const summaryPath = process.argv[3] || 'data/customer_profitability_summary.json';
const csv = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
const lines = csv.split(/\r?\n/).filter((line) => line.trim());
const parse = (line) => line.split(',');
const headers = parse(lines[0]);
const rows = lines.slice(1).map((line) => {
  const a = parse(line);
  const row = Object.fromEntries(headers.map((h, i) => [h, (a[i] || '').trim()]));
  for (const key of ['gross_sales_vnd_mn','net_sales_vnd_mn','contribution_vnd_mn','working_capital_cost_vnd_mn','contribution_after_wc_cost_vnd_mn','ar_balance_vnd_mn']) row[key] = Number(row[key]);
  return row;
});
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const close = (a, b) => Math.abs(a - b) <= 0.5;
const sum = (key, subset = rows) => subset.reduce((total, row) => total + row[key], 0);
const top5 = (key) => rows.slice().sort((a, b) => b[key] - a[key]).slice(0, 5);
const checks = [];
checks.push({ name: 'evidence_label', pass: summary.evidence_class === 'SYNTHETIC_REHEARSAL' && summary.period === 'FY2025', detail: summary.evidence_class + ' / ' + summary.period });
checks.push({ name: 'row_count', pass: summary.row_count === rows.length && rows.length === 24, detail: 'rows=' + rows.length });
for (const key of ['gross_sales_vnd_mn','net_sales_vnd_mn','contribution_vnd_mn','working_capital_cost_vnd_mn','contribution_after_wc_cost_vnd_mn','ar_balance_vnd_mn']) {
  checks.push({ name: 'total_' + key, pass: close(summary.totals[key], sum(key)), detail: 'summary=' + summary.totals[key] + '; source=' + sum(key) });
}
checks.push({ name: 'portfolio_margin', pass: close(summary.derived.net_sales_margin_pct, sum('contribution_vnd_mn') / sum('net_sales_vnd_mn') * 100) && close(summary.derived.after_wc_margin_pct, sum('contribution_after_wc_cost_vnd_mn') / sum('net_sales_vnd_mn') * 100), detail: 'margin recomputation' });
checks.push({ name: 'portfolio_dso', pass: close(summary.derived.dso_days, sum('ar_balance_vnd_mn') / sum('net_sales_vnd_mn') * 365), detail: 'DSO recomputation' });
checks.push({ name: 'top5_concentration', pass: close(summary.derived.top5_gross_sales_share_pct, sum('gross_sales_vnd_mn', top5('gross_sales_vnd_mn')) / sum('gross_sales_vnd_mn') * 100) && close(summary.derived.top5_after_wc_contribution_share_pct, sum('contribution_after_wc_cost_vnd_mn', top5('contribution_after_wc_cost_vnd_mn')) / sum('contribution_after_wc_cost_vnd_mn') * 100), detail: 'top-five revenue and after-WC contribution shares' });
checks.push({ name: 'channel_rollup', pass: ['General Trade','Modern Trade','Marketplace','D2C','Wholesale'].every((channel) => summary.channel_summary[channel]?.customer_count > 0) && close(Object.values(summary.channel_summary).reduce((t, x) => t + x.net_sales_vnd_mn, 0), sum('net_sales_vnd_mn')), detail: 'five channels and net-sales tie-out' });
const c06 = rows.find((row) => row.customer_id === 'C06');
checks.push({ name: 'c06_review_signal', pass: summary.review_flags?.some((flag) => flag.customer_id === 'C06') && c06?.contribution_margin_pct < 20 && c06?.dso_days > 80, detail: c06 ? 'margin=' + c06.contribution_margin_pct + '%; DSO=' + c06.dso_days : 'C06 missing' });
checks.push({ name: 'no_negative_inputs', pass: rows.every((row) => ['gross_sales_vnd_mn','net_sales_vnd_mn','contribution_vnd_mn','ar_balance_vnd_mn'].every((key) => row[key] >= 0)), detail: 'economics inputs non-negative' });

const passed = checks.filter((check) => check.pass).length;
const overall = checks.every((check) => check.pass);
console.log('Customer profitability analysis QA: ' + passed + '/' + checks.length + ' checks PASS; status=' + (overall ? 'PASS' : 'FAIL') + '; evidence=SYNTHETIC_REHEARSAL');
for (const check of checks) console.log((check.pass ? 'PASS ' : 'FAIL ') + check.name + ' — ' + check.detail);
if (!overall) process.exit(1);
