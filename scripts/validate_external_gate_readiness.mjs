#!/usr/bin/env node
import fs from 'node:fs';

const file = process.argv[2] || 'data/external_gate_readiness.json';
const readiness = JSON.parse(fs.readFileSync(file, 'utf8'));
const checks = [];
const add = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail });
add('overall_boundary', readiness.overall_status === 'REVIEW_READY_NOT_PRODUCTION' && readiness.release_policy.publish_live_forecast_accuracy === false && readiness.release_policy.publish_native_pbix_claim === false, 'no unqualified production claim');
add('gate_a_pending', readiness.gate_a.status === 'PENDING_EXTERNAL_INPUT', readiness.gate_a.status);
add('gate_a_no_live_rows', readiness.gate_a.live_internal_rows_present === 0 && readiness.gate_a.eligible_live_rows === 0, 'live_internal_rows=0; eligible_live_rows=0');
add('gate_a_minimum', readiness.gate_a.minimum_live_rows_required >= 1, 'minimum live rows=' + readiness.gate_a.minimum_live_rows_required);
add('gate_a_contracts', readiness.gate_a.template_contract === 'PASS' && readiness.gate_a.fixture_contract === 'PASS', 'template and fixture contracts pass');
add('gate_a_blockers', Array.isArray(readiness.gate_a.blockers) && readiness.gate_a.blockers.length >= 3, 'blockers=' + readiness.gate_a.blockers.length);
add('gate_b_pending', readiness.gate_b.status === 'PENDING_EXTERNAL_DESKTOP', readiness.gate_b.status);
add('gate_b_scaffold_only', readiness.gate_b.pbip_source_scaffold_present === true && readiness.gate_b.native_pbix_present === false, 'PBIP scaffold=true; native_pbix=false');
add('gate_b_visual_gap', readiness.gate_b.visual_evidence_rows_present === 0 && readiness.gate_b.minimum_visual_evidence_rows_required === 18, 'visual evidence=0/18');
add('gate_b_blockers', Array.isArray(readiness.gate_b.blockers) && readiness.gate_b.blockers.length >= 3, 'blockers=' + readiness.gate_b.blockers.length);
const passed = checks.filter((x) => x.pass).length;
const overall = checks.every((x) => x.pass);
console.log('External gate readiness QA: ' + passed + '/' + checks.length + ' checks PASS; status=' + (overall ? 'PASS' : 'FAIL'));
for (const check of checks) console.log((check.pass ? 'PASS ' : 'FAIL ') + check.name + ' — ' + check.detail);
if (!overall) process.exit(1);
