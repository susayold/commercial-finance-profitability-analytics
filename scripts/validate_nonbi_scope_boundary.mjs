#!/usr/bin/env node
/**
 * Verify that the active recruiter release is self-contained and non-Power-BI.
 * Historical Power BI artifacts may remain in the repository, but active
 * builders, source contracts, governance and website code must not depend on
 * the archived path.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];
const add = (id, name, ok, detail = '') => checks.push({ id, name, status: ok ? 'PASS' : 'FAIL', detail });
const exists = (relative) => fs.existsSync(path.join(root, relative));
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

const requiredPaths = [
  'data/operating_inputs/manifest.json',
  'data/operating_inputs/sales_fact.csv',
  'data/finance_model/README.md',
  'data/finance_model/final_v1/source_manifest.csv',
  'data/governance/project_status_nonbi.json',
  'data/governance/recruiter_metric_snapshot.json',
  'reports/NONBI_RELEASE_MANIFEST_2026-09-02.md',
  'site/app/page.tsx',
];
for (const relative of requiredPaths) add(`SCOPE-${checks.length + 1}`, `Required active path exists: ${relative}`, exists(relative));

const status = JSON.parse(read('data/governance/project_status_nonbi.json'));
add('SCOPE-STATUS', 'Canonical status declares non-Power-BI active scope',
  status.power_bi_status === 'OUT_OF_ACTIVE_SCOPE' && status.active_source_contract?.power_bi === 'ARCHIVED / OUT_OF_ACTIVE_SCOPE',
  `power_bi_status=${status.power_bi_status}`);

const manifest = read('reports/NONBI_RELEASE_MANIFEST_2026-09-02.md');
add('SCOPE-MANIFEST', 'Release manifest locks Power BI as archived/excluded',
  /Power BI is archived and excluded from acceptance/i.test(manifest) && /Excluded historical path/i.test(manifest),
  'manifest boundary text present');

const activeBuilders = [
  'scripts/build_non_powerbi_governance.py',
  'scripts/build_three_statement_model.mjs',
  'scripts/build_recruiter_metric_snapshot.py',
  'scripts/build_nonbi_release_manifest.py',
  'site/app/page.tsx',
];
for (const relative of activeBuilders) {
  const text = read(relative);
  const forbidden = /(?:^|[\\/])powerbi[\\/]/i.test(text);
  add(`SCOPE-BUILDER-${activeBuilders.indexOf(relative) + 1}`, `Active builder has no archived Power BI path: ${relative}`, !forbidden,
    forbidden ? 'found powerbi/ path reference' : 'no powerbi/ path reference');
}

const activeRecruiterDocs = [
  'docs/CANDIDATE_APPLICATION_INTAKE_AND_CV_BUILD_PACK.md',
  'docs/CV_EVIDENCE_MAP.md',
  'docs/CV_ROLE_VARIANTS_V2.md',
  'docs/FINANCE_ANALYST_CV_BULLET_BANK_2026-08-30.md',
  'docs/FINANCE_ANALYST_CV_ONE_PAGE_V3.md',
  'docs/FINANCE_ANALYST_INTERVIEW_TALK_TRACK.md',
  'docs/INTERVIEW_WALKTHROUGH_FINANCE_ANALYST_2026-08-30.md',
];
const recruiterDocHits = [];
for (const relative of activeRecruiterDocs) {
  if (!exists(relative)) {
    recruiterDocHits.push(`${relative} (missing)`);
    continue;
  }
  const text = read(relative);
  if (/(?:power\s*bi|\bpbix\b|\bpbip\b|\bpbit\b|\bgate\s+b\b)/i.test(text)) recruiterDocHits.push(relative);
}
add('SCOPE-RECRUITER-DOCS', 'Active recruiter documents contain no BI tooling claim or Gate B dependency', recruiterDocHits.length === 0,
  recruiterDocHits.length ? recruiterDocHits.join(', ') : `${activeRecruiterDocs.length} documents scanned`);

const activeDirs = ['data/governance', 'data/financial_statements', 'data/accounting', 'data/costing', 'data/macros', 'data/planning', 'data/forecast', 'data/operating_inputs', 'data/finance_model'];
const pathHits = [];
for (const relativeDir of activeDirs) {
  const dir = path.join(root, relativeDir);
  if (!fs.existsSync(dir)) continue;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const relative = path.join(relativeDir, entry.name).replaceAll('\\', '/');
    const text = fs.readFileSync(path.join(root, relative), 'utf8');
    if (/(?:^|[\\/])powerbi[\\/]/i.test(text)) pathHits.push(relative);
  }
}
add('SCOPE-ACTIVE-DATA', 'Active data/governance contracts have no Power BI path dependency', pathHits.length === 0,
  pathHits.length ? pathHits.join(', ') : '0 path references');

const page = read('site/app/page.tsx');
add('SCOPE-SITE', 'Recruiter website active page contains no Power BI navigation/content dependency',
  !/(?:powerbi|pbix|pbip|gate b)/i.test(page), 'active page scan complete');

const failures = checks.filter((check) => check.status === 'FAIL');
const report = {
  status: failures.length ? 'FAIL' : 'PASS',
  generated_at: new Date().toISOString(),
  scope: 'non_powerbi_active_release_boundary',
  checks,
  historical_note: 'Historical Power BI files may remain under powerbi/ for traceability; this validator only audits active non-BI paths.',
};
fs.writeFileSync(path.join(root, 'reports/NONBI_SCOPE_BOUNDARY_QA_2026-09-02.json'), JSON.stringify(report, null, 2));
console.log(`${report.status} non-BI scope boundary checks (${checks.length - failures.length}/${checks.length})`);
if (failures.length) process.exit(1);
