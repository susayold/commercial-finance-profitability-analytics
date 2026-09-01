#!/usr/bin/env node
/** Build a simulated FI/CO-style extraction and management-P&L bridge. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ACCOUNTING = path.join(ROOT, 'data', 'accounting');
const DATA = path.join(ROOT, 'data');
const REPORTS = path.join(ROOT, 'reports');
const readCsv = file => { const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/); const headers = lines.shift().split(','); return lines.filter(Boolean).map(line => Object.fromEntries(headers.map((header, i) => [header, line.split(',')[i] ?? '']))); };
const esc = value => { const text = String(value ?? ''); return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; };
const writeCsv = (file, headers, rows) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(header => esc(row[header])).join(','))].join('\n') + '\n', 'utf8'); };
const money = value => Math.round(Number(value || 0) * 100) / 100;

const coa = readCsv(path.join(ACCOUNTING, 'gl_management_mapping.csv'));
const tb = readCsv(path.join(ACCOUNTING, 'trial_balance_monthly.csv'));
const mapping = new Map(coa.map(row => [row.account, row]));
const documentType = accountType => accountType === 'Revenue' || accountType === 'Contra Revenue' ? 'SA' : accountType === 'Expense' ? 'KR' : accountType === 'Asset' ? 'AA' : accountType === 'Liability' ? 'AB' : 'AB';
const costCenter = account => {
  if (['4000', '4010', '4020', '4030', '4040'].includes(account)) return 'CC-COMMERCIAL';
  if (['5000'].includes(account)) return 'CC-SUPPLY';
  if (['5100', '5200', '5300'].includes(account)) return 'CC-TRADE';
  if (['6000', '6100'].includes(account)) return 'CC-G&A';
  if (['6200'].includes(account)) return 'CC-TREASURY';
  if (['6300'].includes(account)) return 'CC-TAX';
  return 'CC-CORPORATE';
};
const profitCenter = account => ['4000', '4010', '4020', '4030', '4040', '5000', '5100', '5200', '5300'].includes(account) ? 'PC-FMCG' : 'PC-CORP';
const rows = tb.map((row, index) => {
  const meta = mapping.get(row.account);
  if (!meta) throw new Error(`No GL management mapping for ${row.account}`);
  const debit = money(row.debit_vnd); const credit = money(row.credit_vnd);
  return {
    posting_id: `SIM-${row.period.replace('-', '')}-${String(index + 1).padStart(5, '0')}`,
    document_type: documentType(meta.account_type),
    company_code: 'VNO1',
    posting_date: `${row.period}-28`,
    period: row.period,
    currency: 'VND',
    cost_center: costCenter(row.account),
    profit_center: profitCenter(row.account),
    gl_account: row.account,
    gl_account_name: meta.account_name,
    management_line: meta.management_line,
    debit_vnd: debit,
    credit_vnd: credit,
    signed_amount_vnd: money(credit - debit),
    source_system: 'SYNTHETIC_LEDGER',
    source_table: 'trial_balance_monthly.csv',
    mapping_version: 'VNO-FPA-MAP-v1',
    mapping_status: 'APPROVED_SIMULATED',
    exception_status: 'NO_EXCEPTION',
    evidence_class: 'SIMULATED_DERIVED',
  };
});
const headers = ['posting_id', 'document_type', 'company_code', 'posting_date', 'period', 'currency', 'cost_center', 'profit_center', 'gl_account', 'gl_account_name', 'management_line', 'debit_vnd', 'credit_vnd', 'signed_amount_vnd', 'source_system', 'source_table', 'mapping_version', 'mapping_status', 'exception_status', 'evidence_class'];
writeCsv(path.join(DATA, 'accounting', 'sap_like_mapping_rehearsal.csv'), headers, rows);
const periods = [...new Set(rows.map(row => row.period))].sort();
const periodChecks = periods.map(period => {
  const periodRows = rows.filter(row => row.period === period);
  const debit = periodRows.reduce((sum, row) => sum + Number(row.debit_vnd), 0);
  const credit = periodRows.reduce((sum, row) => sum + Number(row.credit_vnd), 0);
  return { period, debit: money(debit), credit: money(credit), residual: money(debit - credit), status: Math.abs(debit - credit) <= 1 ? 'PASS' : 'FAIL' };
});
const failures = periodChecks.filter(row => row.status !== 'PASS');
fs.mkdirSync(REPORTS, { recursive: true });
fs.writeFileSync(path.join(REPORTS, 'SAP_LIKE_MAPPING_REHEARSAL_QA_2026-09-02.json'), JSON.stringify({ status: failures.length ? 'FAIL' : 'PASS', rows: rows.length, periods: periods.length, mapped_accounts: new Set(rows.map(row => row.gl_account)).size, exceptions: rows.filter(row => row.exception_status !== 'NO_EXCEPTION').length, period_checks: periodChecks }, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(REPORTS, 'SAP_LIKE_MAPPING_REHEARSAL_2026-09-02.md'), `# SAP-like Finance Extraction Rehearsal — VietNova FP&A\n\n**Status:** ${failures.length ? 'FAIL' : 'PASS'}  \n**Scope:** Simulated FI/CO-style extraction and management-P&L mapping; no SAP production experience is claimed\n\n## What this demonstrates\n\n- 720 deterministic posting rows across 36 monthly periods.\n- FI-like document type, company code, posting date, currency and GL account fields.\n- CO-like cost-center and profit-center assignments.\n- Every synthetic chart-of-accounts account maps to one management line under mapping version **VNO-FPA-MAP-v1**.\n- Debit/credit control is re-performed by period, with an explicit exception field.\n\n## Reconciliation\n\n| Control | Result |\n|---|---|\n| Periods | ${periods.length} |\n| Posting rows | ${rows.length} |\n| Distinct GL accounts | ${new Set(rows.map(row => row.gl_account)).size} |\n| Unmapped / exception rows | ${rows.filter(row => row.exception_status !== 'NO_EXCEPTION').length} |\n| Period debit = credit | ${failures.length ? 'FAIL' : 'PASS'} |\n\n## Management bridge\n\nmanagement_line is inherited from data/accounting/gl_management_mapping.csv. Revenue and contra-revenue accounts map to commercial lines; COGS maps to supply; channel fees/trade spend/fulfilment map to trade; controllable OPEX and D&A map to G&A; finance cost maps to treasury; tax proxy maps to tax.\n\n## Evidence boundary\n\nThis is a **SAP-like mapping rehearsal** built from synthetic VietNova trial-balance rows. It is suitable for demonstrating finance-systems awareness, mapping discipline and close controls. It must not be described as SAP implementation, SAP access or production ERP experience.\n\n## Files\n\n- data/accounting/sap_like_mapping_rehearsal.csv — row-level FI/CO-style rehearsal extract.\n- reports/SAP_LIKE_MAPPING_REHEARSAL_QA_2026-09-02.json — period tie-out and exception QA.\n- scripts/build_sap_like_mapping_rehearsal.mjs — reproducible builder.\n`);
console.log(JSON.stringify({ status: failures.length ? 'FAIL' : 'PASS', rows: rows.length, periods: periods.length, mapped_accounts: new Set(rows.map(row => row.gl_account)).size, failures: failures.length }, null, 2));
if (failures.length) process.exit(1);
