import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const identityPath = path.join(ROOT, 'data', 'governance', 'release_identity_nonbi.json');
const statusPath = path.join(ROOT, 'data', 'governance', 'project_status_nonbi.json');
const manifestPath = path.join(ROOT, 'reports', 'NONBI_RELEASE_MANIFEST_2026-09-02.md');
const handoffPath = path.join(ROOT, 'reports', 'NON_POWERBI_HANDOFF_INDEX_2026-09-01.md');
const planPath = path.join(ROOT, 'docs', 'VNFINANCE_FPA_ACTIVE_EXECUTION_PLAN_NO_POWERBI_2026-09-02.md');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const readText = (file) => fs.readFileSync(file, 'utf8');
const identity = readJson(identityPath);
const status = readJson(statusPath);
const manifest = readText(manifestPath);
const handoff = readText(handoffPath);
const plan = readText(planPath);

const checks = [];
const add = (id, name, pass, detail = '') => checks.push({ id, name, status: pass ? 'PASS' : 'FAIL', detail });

add('RI-01', 'Identity file parses', true, 'data/governance/release_identity_nonbi.json');
add('RI-02', 'Canonical release name', identity.release_name === 'VNFINANCE-FPA-2026-09-02-FINAL', identity.release_name);
add('RI-03', 'Status mirrors project status', identity.release_status === status.release_status, `${identity.release_status}=${status.release_status}`);
add('RI-04', 'Release tag/SHA are safely gated', identity.release_status === 'CLOSURE_CANDIDATE_INPUT_GATED' && identity.release_tag === null && identity.release_sha === null, `tag=${identity.release_tag ?? 'null'}; sha=${identity.release_sha ?? 'null'}`);
add('RI-05', 'Project status points to identity', status.release_identity === 'data/governance/release_identity_nonbi.json', status.release_identity);
add('RI-06', 'GitHub visibility policy is consistent', identity.github_visibility_policy === status.github_visibility_policy && identity.github_visibility_policy === 'PUBLIC_SAFE_PORTFOLIO_REPOSITORY', identity.github_visibility_policy);
add('RI-07', 'Power BI remains out of active scope', identity.power_bi_status === 'OUT_OF_ACTIVE_SCOPE' && status.power_bi_status === 'OUT_OF_ACTIVE_SCOPE' && plan.includes('Power BI không phải deliverable'), `${identity.power_bi_status}/${status.power_bi_status}`);
add('RI-08', 'Manifest carries release identity', manifest.includes(identity.release_name) && manifest.includes('PENDING_INPUT_GATED_CLOSURE'), 'release name and gated tag present');
add('RI-09', 'Handoff carries release identity', handoff.includes(identity.release_name) && handoff.includes('final tag/SHA pending'), 'release name and pending boundary present');
add('RI-10', 'Finalization blockers are explicit', Array.isArray(identity.finalization_blockers) && identity.finalization_blockers.length === 3, `blockers=${identity.finalization_blockers?.length ?? 0}`);
add('RI-11', 'Repository is explicitly public', identity.github_repo_visibility === 'public', identity.github_repo_visibility);
add('RI-12', 'GitHub Pages source is declared', identity.github_pages_url === 'https://susayold.github.io/commercial-finance-profitability-analytics/' && identity.github_pages_source?.branch === 'main' && identity.github_pages_source?.path === '/docs', `${identity.github_pages_source?.branch ?? 'missing'}:${identity.github_pages_source?.path ?? 'missing'}`);

const passed = checks.filter((check) => check.status === 'PASS').length;
const report = {
  status: passed === checks.length ? 'PASS' : 'FAIL',
  scope: 'non_powerbi_release_identity',
  checked_files: [
    'data/governance/release_identity_nonbi.json',
    'data/governance/project_status_nonbi.json',
    'reports/NONBI_RELEASE_MANIFEST_2026-09-02.md',
    'reports/NON_POWERBI_HANDOFF_INDEX_2026-09-01.md',
    'docs/VNFINANCE_FPA_ACTIVE_EXECUTION_PLAN_NO_POWERBI_2026-09-02.md',
  ],
  release_name: identity.release_name,
  release_status: identity.release_status,
  release_tag: identity.release_tag,
  release_sha: identity.release_sha,
  checks,
};
const outputPath = path.join(ROOT, 'reports', 'RELEASE_IDENTITY_NONBI_QA_2026-09-03.json');
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: report.status, checks: checks.length, passed, report: 'reports/RELEASE_IDENTITY_NONBI_QA_2026-09-03.json' }, null, 2));
process.exitCode = report.status === 'PASS' ? 0 : 1;
