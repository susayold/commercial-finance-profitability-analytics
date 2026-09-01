#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const dataPath = process.argv[2] || 'data/governance/commentary_draft_2026-09-02.csv';
const reportPath = process.argv[3] || 'reports/MONTHLY_COMMENTARY_DRAFT_2026-09-02.md';
const approvalPath = process.argv[4] || 'reports/MONTHLY_COMMENTARY_APPROVAL_LOG_2026-09-02.csv';
const parse = file => { const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').trim().split(/\r?\n/); const headers = lines.shift().split(','); return { headers, rows: lines.map(line => Object.fromEntries(headers.map((header, i) => [header, line.split(',')[i] ?? '']))) }; };
const checks = []; const add = (name, ok, detail = '') => checks.push({ name, ok: Boolean(ok), detail });
const data = parse(dataPath); const report = fs.readFileSync(path.join(ROOT, reportPath), 'utf8'); const approval = parse(approvalPath);
add('header', data.headers.join(',') === 'metric,label,base_value,upside_value,downside_value,downside_gap,unit,evidence_class,review_status,draft_commentary');
add('metric_count', data.rows.length === 4, `rows=${data.rows.length}`);
add('scenario_values', data.rows.every(row => [row.base_value, row.upside_value, row.downside_value, row.downside_gap].every(value => value !== '' && Number.isFinite(Number(value)))));
add('review_status', data.rows.every(row => row.review_status === 'NEEDS_REVIEW'));
add('evidence_boundary', data.rows.every(row => row.evidence_class === 'PROXY_DERIVED'));
add('bounded_language', data.rows.every(row => !/\bcaused by\b|\bdue to\b|\bproves?\b/i.test(row.draft_commentary)));
add('report_sections', ['## Draft commentary', '## Reviewer checklist', '## Prohibited claims'].every(section => report.includes(section)));
add('human_gate', report.includes('HUMAN REVIEW REQUIRED') && report.includes('automation cannot approve'));
add('approval_log', approval.rows.length === 1 && approval.rows[0].approval_status === 'NEEDS_REVIEW' && !approval.rows[0].reviewer && !approval.rows[0].approved_at);
const failed = checks.filter(check => !check.ok);
for (const check of checks) console.log(`${check.ok ? 'PASS' : 'FAIL'} ${check.name}${check.detail ? ` (${check.detail})` : ''}`);
console.log(`Overall status: ${failed.length ? 'FAIL' : 'PASS'} (${checks.length - failed.length}/${checks.length} checks passed)`);
if (failed.length) process.exit(1);
