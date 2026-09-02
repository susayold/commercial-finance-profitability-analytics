#!/usr/bin/env node
/** Validate the manual walkthrough handoff without fabricating external evidence. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const inputPath = path.join(root, 'data', 'governance', 'recording_handoff.json');
const reportPath = path.join(root, 'reports', 'RECORDING_HANDOFF_QA_2026-09-02.md');
const payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const checks = [];
const add = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail: String(detail) });
const exists = (relative) => fs.existsSync(path.join(root, relative));
const hasHttp = (value) => typeof value === 'string' && /^https?:\/\//i.test(value);
const hasSha = (value) => typeof value === 'string' && /^[A-Fa-f0-9]{64}$/.test(value);
const statusAllowed = ['INPUT_GATED', 'READY_FOR_REVIEW', 'APPROVED'];

add('input_file_exists', fs.existsSync(inputPath), 'data/governance/recording_handoff.json');
add('status_allowed', statusAllowed.includes(payload.status), `status=${payload.status}`);
add('script_exists', exists(payload.script_path), payload.script_path);
add('editable_deck_exists', exists(payload.deck_path), payload.deck_path);
add('duration_guardrail', payload.expected_duration_seconds >= payload.rendering_rules.duration_min_seconds && payload.expected_duration_seconds <= payload.rendering_rules.duration_max_seconds,
  `${payload.rendering_rules.duration_min_seconds}-${payload.rendering_rules.duration_max_seconds}s window`);
add('required_segments_present', Array.isArray(payload.required_segments) && payload.required_segments.length >= 8, `${payload.required_segments?.length ?? 0} segments`);
add('scope_rules_present', payload.rendering_rules.must_state_synthetic_boundary === true && payload.rendering_rules.power_bi_claims_allowed === false,
  'synthetic boundary and no BI claims');

if (payload.status === 'INPUT_GATED') {
  add('pending_has_no_fake_url', payload.recording_url === null, 'recording_url is null until user records');
  add('pending_has_no_fake_hash', payload.recording_sha256 === null, 'recording_sha256 is null until file exists');
  add('pending_has_no_fake_review', payload.review?.reviewer === null && payload.review?.status === 'NOT_REVIEWED', 'review is not inferred');
} else {
  add('recording_url_valid', hasHttp(payload.recording_url), 'HTTPS/HTTP recording URL');
  add('recording_hash_valid', hasSha(payload.recording_sha256), 'SHA-256 recorded');
  add('review_fields_present', Boolean(payload.review?.reviewer && payload.review?.reviewed_at), 'reviewer and timestamp');
}

const passed = checks.filter((item) => item.pass).length;
const status = passed === checks.length ? (payload.status === 'INPUT_GATED' ? 'HANDOFF_TEMPLATE_PASS' : payload.status) : 'FAIL';
const lines = [
  '# Walkthrough Recording Handoff QA — 2026-09-02',
  '',
  `**Status:** ${status}  `,
  `**Checks:** ${passed}/${checks.length} passed  `,
  `**Handoff status:** ${payload.status}  `,
  '',
  '| Check | Status | Detail |',
  '|---|---|---|',
  ...checks.map((item) => `| ${item.name} | ${item.pass ? 'PASS' : 'FAIL'} | ${item.detail.replaceAll('|', '\\|')} |`),
  '',
  'Policy: this file proves that the recording handoff is specified and ready; it does not claim that a recording or independent review exists while status is INPUT_GATED.',
];
fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ status, checks: checks.length, passed, report: reportPath }, null, 2));
if (status === 'FAIL') process.exit(1);
