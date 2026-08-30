#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'docs', 'NEXT_EXECUTION_SPRINT_2026-08-30.md');
const text = fs.readFileSync(file, 'utf8');
const checks = [
  ['document_exists', fs.existsSync(file)],
  ['status_boundary', text.includes('REVIEW_READY_SYNTHETIC') && text.includes('PENDING_EXTERNAL')],
  ['candidate_personalization', text.includes('Workstream A — candidate personalization')],
  ['gate_a_packet', text.includes('Gate A internal forecast accuracy') && text.includes('forecast_snapshot_live_submission_template.csv')],
  ['gate_a_leakage_controls', text.includes('forecast cutoff < actual-availability timestamp') && text.includes('LIVE_OBSERVED_READY')],
  ['gate_a_metrics', text.includes('Bias') && text.includes('WAPE') && text.includes('MAPE')],
  ['gate_b_pages', text.includes('six pages') && text.includes('CFO Executive Summary') && text.includes('Inventory, Working Capital & Liquidity')],
  ['gate_b_qa', text.includes('QA-01 through QA-18') && text.includes('QA_EVIDENCE_LOG_FILLED.csv')],
  ['release_qa', text.includes('node scripts/run_finance_qa.mjs') && text.includes('release record')],
  ['fourteen_day_cadence', text.includes('Suggested 14-day cadence') && text.includes('Mock interview')],
  ['definition_of_done', text.includes('Final Definition of Done') && text.includes('application-ready')],
  ['no_unsupported_claims', text.includes('Do **not** write:') && text.includes('Do not create a placeholder `.pbix`')],
];

const passed = checks.filter(([, ok]) => ok).length;
const result = { status: passed === checks.length ? 'PASS' : 'FAIL', passed, total: checks.length, checks: checks.map(([name, ok]) => ({ name, status: ok ? 'PASS' : 'FAIL' })) };
console.log(JSON.stringify(result, null, 2));
if (result.status !== 'PASS') process.exit(1);
