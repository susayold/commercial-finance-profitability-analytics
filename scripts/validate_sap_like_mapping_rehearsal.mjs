#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const dataPath = process.argv[2] || 'data/accounting/sap_like_mapping_rehearsal.csv';
const reportPath = process.argv[3] || 'reports/SAP_LIKE_MAPPING_REHEARSAL_2026-09-02.md';
const qaPath = process.argv[4] || 'reports/SAP_LIKE_MAPPING_REHEARSAL_QA_2026-09-02.json';
const parse = file => { const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').trim().split(/\r?\n/); const headers = lines.shift().split(','); return { headers, rows: lines.map(line => Object.fromEntries(headers.map((header, i) => [header, line.split(',')[i] ?? '']))) }; };
const checks = []; const add = (name, ok, detail = '') => checks.push({ name, ok: Boolean(ok), detail });
const data = parse(dataPath); const report = fs.readFileSync(path.join(ROOT, reportPath), 'utf8'); const qa = JSON.parse(fs.readFileSync(path.join(ROOT, qaPath), 'utf8'));
const expected = 'posting_id,document_type,company_code,posting_date,period,currency,cost_center,profit_center,gl_account,gl_account_name,management_line,debit_vnd,credit_vnd,signed_amount_vnd,source_system,source_table,mapping_version,mapping_status,exception_status,evidence_class';
add('header', data.headers.join(',') === expected);
add('row_count', data.rows.length === 720, `rows=${data.rows.length}`);
add('period_count', new Set(data.rows.map(row => row.period)).size === 36);
add('account_count', new Set(data.rows.map(row => row.gl_account)).size === 20);
add('required_fields', data.rows.every(row => [row.document_type, row.company_code, row.posting_date, row.cost_center, row.profit_center, row.gl_account, row.management_line, row.mapping_version].every(Boolean)));
add('mapping_status', data.rows.every(row => row.mapping_status === 'APPROVED_SIMULATED' && row.exception_status === 'NO_EXCEPTION'));
add('evidence_boundary', data.rows.every(row => row.evidence_class === 'SIMULATED_DERIVED' && row.source_system === 'SYNTHETIC_LEDGER'));
add('period_ties', qa.status === 'PASS' && qa.period_checks.every(row => Math.abs(Number(row.residual)) <= 1 && row.status === 'PASS'));
add('report_boundary', report.includes('SAP-like mapping rehearsal') && report.includes('no SAP production experience'));
const failed = checks.filter(check => !check.ok);
for (const check of checks) console.log(`${check.ok ? 'PASS' : 'FAIL'} ${check.name}${check.detail ? ` (${check.detail})` : ''}`);
console.log(`Overall status: ${failed.length ? 'FAIL' : 'PASS'} (${checks.length - failed.length}/${checks.length} checks passed)`);
if (failed.length) process.exit(1);
