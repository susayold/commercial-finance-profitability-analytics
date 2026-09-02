#!/usr/bin/env node
/** Validate the recruiter-facing non-Power-BI metric/status snapshot. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const snapshotPath = path.join(root, 'data', 'governance', 'recruiter_metric_snapshot.json');
const exportedPath = path.join(root, 'data', 'governance', 'exported_metric_snapshot.csv');
const failures = [];
const checks = [];
const add = (id, name, ok, detail = '') => { checks.push({ id, name, status: ok ? 'PASS' : 'FAIL', detail }); if (!ok) failures.push(id); };

let payload;
try { payload = JSON.parse(fs.readFileSync(snapshotPath, 'utf8')); add('RMS-01', 'Snapshot parses', true); }
catch (error) { add('RMS-01', 'Snapshot parses', false, String(error)); }

if (payload) {
  add('RMS-02', 'Non-Power-BI scope declared', payload.scope === 'recruiter_metric_snapshot_non_powerbi' && payload.evidence_boundary?.power_bi === 'OUT_OF_ACTIVE_SCOPE — historical archive only');
  const scenarios = Object.keys(payload.scenarios ?? {});
  add('RMS-03', 'Base/upside/downside scenarios present', ['BASE', 'UPSIDE', 'DOWNSIDE'].every((name) => scenarios.includes(name)), scenarios.join(','));
  add('RMS-04', 'Six headline metrics per scenario', scenarios.every((name) => Object.keys(payload.scenarios[name] ?? {}).length === 6));
  add('RMS-05', 'Quality totals declared', payload.qa?.expected_core_checks?.passed === 54 && payload.qa?.expected_core_checks?.total === 54 && payload.qa?.expected_release_checks?.passed === 50 && payload.qa?.expected_release_checks?.total === 50);
  add('RMS-06', 'External gate remains input-gated', String(payload.evidence_boundary?.forecast_accuracy ?? '').includes('PENDING_EXTERNAL_INPUT'));
  add('RMS-07', 'Source boundary has no Power BI path', !JSON.stringify(payload).toLowerCase().includes('powerbi/'));

  const lines = fs.readFileSync(exportedPath, 'utf8').trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  const exported = lines.map((line) => Object.fromEntries(line.split(',').map((value, index) => [headers[index], value]))).filter((row) => row.segment === 'ALL');
  const matches = exported.every((row) => Number(payload.scenarios?.[row.scenario]?.[row.metric_id]?.value) === Number(row.value));
  add('RMS-08', 'Headline values tie to exported snapshot', matches);
}

const result = { status: failures.length ? 'FAIL' : 'PASS', checks, checked_file: 'data/governance/recruiter_metric_snapshot.json' };
fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'reports', 'RECRUITER_METRIC_SNAPSHOT_QA_2026-09-02.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
