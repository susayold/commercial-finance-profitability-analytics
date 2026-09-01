#!/usr/bin/env node
/** Validate integrated statements, trial balance, journals and subledgers. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const readCsv = file => { const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/); const headers = lines.shift().split(','); return lines.filter(Boolean).map(line => { const values = line.split(','); return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ''])); }); };
const n = value => Number(value || 0);
const absOk = value => Math.abs(n(value)) <= 1;
const check = [];
const add = (name, ok, detail) => check.push({ name, ok: Boolean(ok), detail });
const stmt = path.join(ROOT, 'data', 'financial_statements');
const acct = path.join(ROOT, 'data', 'accounting');
const income = readCsv(path.join(stmt, 'monthly_income_statement.csv'));
const balance = readCsv(path.join(stmt, 'monthly_balance_sheet.csv'));
const cashflow = readCsv(path.join(stmt, 'monthly_cash_flow.csv'));
const recon = readCsv(path.join(stmt, 'three_statement_reconciliation.csv'));
const tb = readCsv(path.join(acct, 'trial_balance_monthly.csv'));
const tbChecks = readCsv(path.join(acct, 'trial_balance_checks.csv'));
const journals = readCsv(path.join(acct, 'journal_adjustments.csv'));
const subledger = readCsv(path.join(acct, 'subledger_reconciliation.csv'));
const mapping = readCsv(path.join(acct, 'gl_management_mapping.csv'));
const periods = income.map(row => row.period);
add('statement_files_present', income.length > 0 && income.length === balance.length && income.length === cashflow.length, `income=${income.length}; balance=${balance.length}; cashflow=${cashflow.length}`);
add('36_months', income.length === 36, `periods=${income.length}`);
add('periods_unique_and_sorted', new Set(periods).size === periods.length && periods.every((period, i) => i === 0 || period > periods[i - 1]), 'monthly grain');
add('balance_sheet_controls', recon.filter(row => row.control_id === 'BS_BALANCE').every(row => row.status === 'PASS' && absOk(row.residual_vnd)), `checks=${recon.filter(row => row.control_id === 'BS_BALANCE').length}`);
add('cash_tie_controls', recon.filter(row => row.control_id === 'CASH_TIE').every(row => row.status === 'PASS' && absOk(row.residual_vnd)), 'cash flow to balance sheet');
add('retained_earnings_controls', recon.filter(row => row.control_id === 'PAT_RETAINED_EARNINGS').every(row => row.status === 'PASS' && absOk(row.residual_vnd)), 'PAT movement');
add('trial_balance_balances', tbChecks.length === 36 && tbChecks.every(row => row.status === 'PASS' && absOk(row.residual_vnd)), `rows=${tbChecks.length}`);
add('subledger_controls', subledger.length === 180 && subledger.every(row => row.status === 'PASS' && absOk(row.residual_vnd)), `rows=${subledger.length}`);
add('gl_management_mapping', mapping.length === 20 && mapping.every(row => row.account && row.management_line && row.cost_center_rule && row.mapping_status === 'APPROVED_SIMULATED'), `rows=${mapping.length}`);
const journalGroups = new Map();
for (const row of journals) { if (!journalGroups.has(row.entry_id)) journalGroups.set(row.entry_id, []); journalGroups.get(row.entry_id).push(row); }
add('journal_double_entry', journalGroups.size === 36 && [...journalGroups.values()].every(rows => absOk(rows.reduce((a, row) => a + n(row.debit_vnd) - n(row.credit_vnd), 0))), `entries=${journalGroups.size}`);
add('journal_approval_fields', journals.every(row => row.preparer && row.approver && row.approval_status === 'APPROVED_SIMULATED'), 'owner and approval present');
add('cash_roll_forward', cashflow.every((row, i) => i === 0 || absOk(n(row.cash_opening_vnd) - n(cashflow[i - 1].cash_closing_vnd))), 'opening cash equals prior closing cash');
add('debt_roll_forward', balance.every((row, i) => i === 0 || n(row.debt_closing_vnd) >= 0), 'debt closing non-negative');
add('evidence_boundary', income.every(row => row.evidence_class === 'SIMULATED/DERIVED') && journals.every(row => row.evidence_class === 'SIMULATED'), 'synthetic/derived labels present');
const failures = check.filter(row => !row.ok);
for (const row of check) console.log(`${row.ok ? 'PASS' : 'FAIL'} ${row.name} — ${row.detail}`);
console.log(`Overall status: ${failures.length ? 'FAIL' : 'PASS'} (${check.length - failures.length}/${check.length} checks passed)`);
if (failures.length) process.exit(1);
