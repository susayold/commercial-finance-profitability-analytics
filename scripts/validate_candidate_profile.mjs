#!/usr/bin/env node
/**
 * Validate the personal-facts intake contract without inventing candidate data.
 * INPUT_GATED is a valid state when all required personal fields are intentionally blank.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const inputPath = path.join(root, 'data', 'governance', 'candidate_profile_intake.json');
const reportPath = path.join(root, 'reports', 'CANDIDATE_PROFILE_INTAKE_QA_2026-09-02.md');
const profile = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const checks = [];
const add = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail: String(detail) });
const required = profile.required_fields ?? {};
const requiredKeys = [
  'full_name', 'city_country', 'work_authorization', 'email', 'phone',
  'linkedin_url', 'github_url', 'education', 'experience',
  'tools_used_in_real_work', 'languages', 'availability',
];
const isBlank = (value) => value === null || value === '' || (Array.isArray(value) && value.length === 0);
const isHttpUrl = (value) => typeof value === 'string' && /^https?:\/\//i.test(value);
const hasPlaceholder = (value) => typeof value === 'string' && /\[[^\]]+\]|\bTODO\b|\bTBD\b/i.test(value);
const stringValues = (value) => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(stringValues);
  if (value && typeof value === 'object') return Object.values(value).flatMap(stringValues);
  return [];
};

add('input_file_exists', fs.existsSync(inputPath), 'data/governance/candidate_profile_intake.json');
add('schema_keys_present', requiredKeys.every((key) => Object.prototype.hasOwnProperty.call(required, key)),
  `missing=${requiredKeys.filter((key) => !Object.prototype.hasOwnProperty.call(required, key)).join('|') || 'none'}`);
add('status_allowed', ['INPUT_GATED', 'READY_FOR_RENDER'].includes(profile.status), `status=${profile.status}`);
add('do_not_invent_policy', profile.do_not_invent === true, `do_not_invent=${profile.do_not_invent}`);
add('rendering_rules_present', profile.rendering_rules?.cv_one_page === true && profile.rendering_rules?.power_bi_claims_allowed === false,
  'one-page CV and no BI claim policy');

const allRequiredBlank = requiredKeys.every((key) => isBlank(required[key]));
if (profile.status === 'INPUT_GATED') {
  add('gated_template_has_no_personal_facts', allRequiredBlank, `non_blank_required_fields=${requiredKeys.filter((key) => !isBlank(required[key])).join('|') || 'none'}`);
} else {
  add('ready_profile_has_required_facts', requiredKeys.every((key) => !isBlank(required[key])), 'all required fields populated');
  add('contact_urls_valid', isHttpUrl(required.linkedin_url) && isHttpUrl(required.github_url), 'LinkedIn/GitHub URLs use http(s)');
  add('email_shape_valid', typeof required.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(required.email), 'email format');
}

const placeholders = stringValues(profile).filter(hasPlaceholder);
add('no_placeholder_personal_values', placeholders.length === 0, `placeholder_values=${placeholders.length}`);
add('education_schema_declared', ['degree', 'major', 'institution', 'city_country', 'start_year', 'end_year', 'evidence_reference'].every((key) => Object.prototype.hasOwnProperty.call(profile.education_item_schema ?? {}, key)), 'education fields declared');
add('experience_schema_declared', ['employer', 'title', 'city_country', 'start_date', 'end_date', 'bullets', 'quantified_result', 'evidence_reference'].every((key) => Object.prototype.hasOwnProperty.call(profile.experience_item_schema ?? {}, key)), 'experience fields declared');
add('claim_boundary_declared', Array.isArray(profile.blocked_claims_without_external_evidence) && profile.blocked_claims_without_external_evidence.length >= 5,
  `${profile.blocked_claims_without_external_evidence?.length ?? 0} blocked claims`);

const passed = checks.filter((item) => item.pass).length;
const status = passed === checks.length ? (profile.status === 'INPUT_GATED' ? 'INTAKE_TEMPLATE_PASS' : 'READY_FOR_RENDER') : 'FAIL';
const lines = [
  '# Candidate Profile Intake QA — 2026-09-02',
  '',
  `**Status:** ${status}  `,
  `**Checks:** ${passed}/${checks.length} passed  `,
  `**Profile status:** ${profile.status}  `,
  '',
  '| Check | Status | Detail |',
  '|---|---|---|',
  ...checks.map((item) => `| ${item.name} | ${item.pass ? 'PASS' : 'FAIL'} | ${item.detail.replaceAll('|', '\\|')} |`),
  '',
  'Policy: blank required fields are intentional until the candidate supplies verified facts. Portfolio outputs must remain under Projects; personal employment claims require candidate evidence.',
];
fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ status, checks: checks.length, passed, report: reportPath }, null, 2));
if (status === 'FAIL') process.exit(1);
