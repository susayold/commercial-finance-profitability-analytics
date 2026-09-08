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
add('RI-02', 'Canonical release name', identity.release_name === 'VNFINANCE-FPA-v1.0.1', identity.release_name);
add(
  'RI-03',
  'Identity and project status release metadata agree',
  identity.release_status === status.release_status
    && identity.release_name === status.release_name
    && identity.release_tag === status.release_tag
    && identity.release_source_sha === status.release_source_sha
    && identity.release_metadata_commit === status.release_metadata_commit
    && identity.website_version === status.private_site_version,
  `${identity.release_name}/${identity.release_tag}/${identity.release_source_sha}/${identity.release_metadata_commit}/site-v${identity.website_version}`,
);
add(
  'RI-04',
  'Release tag/SHA are stable and gated',
  identity.release_status === 'RECRUITER_READY_WITH_OPEN_EXTERNAL_CLAIM_GATES'
    && identity.release_tag === 'fpa-portfolio-v1.0.1'
    && /^[0-9a-f]{40}$/.test(identity.release_source_sha ?? '')
    && /^[0-9a-f]{40}$/.test(identity.release_metadata_commit ?? ''),
  `tag=${identity.release_tag ?? 'null'}; source=${identity.release_source_sha ?? 'null'}; metadata=${identity.release_metadata_commit ?? 'null'}`,
);
add('RI-05', 'Project status points to identity', status.release_identity === 'data/governance/release_identity_nonbi.json', status.release_identity);
add('RI-06', 'GitHub visibility policy is consistent', identity.github_visibility_policy === status.github_visibility_policy && identity.github_visibility_policy === 'PUBLIC_SAFE_PORTFOLIO_REPOSITORY', identity.github_visibility_policy);
add('RI-07', 'Power BI remains out of active scope', identity.power_bi_status === 'OUT_OF_ACTIVE_SCOPE' && status.power_bi_status === 'OUT_OF_ACTIVE_SCOPE' && plan.includes('Power BI không phải deliverable'), `${identity.power_bi_status}/${status.power_bi_status}`);
add('RI-08', 'Manifest carries release identity', manifest.includes('VNFINANCE-FPA') && manifest.includes('Power BI'), 'release family and scope present');
add('RI-09', 'Handoff carries release identity', handoff.includes('VNFINANCE') && handoff.includes('Power BI'), 'release family and scope present');
add('RI-10', 'External claim inputs are explicit', Array.isArray(identity.external_claim_inputs) && identity.external_claim_inputs.length === 3 && !('finalization_blockers' in identity), `inputs=${identity.external_claim_inputs?.length ?? 0}`);
add('RI-10B', 'Self-referential main SHA is absent', !('current_main_sha' in identity) && !('current_main_sha' in status) && !/Current main SHA:/i.test(fs.readFileSync(path.join(ROOT, 'reports', 'FINAL_RECRUITER_RELEASE_2026-09-05.md'), 'utf8')), 'stable release identity fields only');
add('RI-11', 'Repository is explicitly public', identity.github_repo_visibility === 'public', identity.github_repo_visibility);
add('RI-12', 'GitHub Pages source is declared', identity.github_pages_url === 'https://susayold.github.io/commercial-finance-profitability-analytics/' && identity.github_pages_source?.branch === 'main' && identity.github_pages_source?.path === '/docs', `${identity.github_pages_source?.branch ?? 'missing'}:${identity.github_pages_source?.path ?? 'missing'}`);
add('RI-13', 'GitHub Pages build mode is declared', identity.github_pages_mode === 'static_vite_build_from_site_component', identity.github_pages_mode);

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
  release_source_sha: identity.release_source_sha,
  release_metadata_commit: identity.release_metadata_commit,
  website_version: identity.website_version,
  checks,
};
const outputPath = path.join(ROOT, 'reports', 'RELEASE_IDENTITY_NONBI_QA_V1.0.1_2026-09-08.json');
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: report.status, checks: checks.length, passed, report: 'reports/RELEASE_IDENTITY_NONBI_QA_V1.0.1_2026-09-08.json' }, null, 2));
process.exitCode = report.status === 'PASS' ? 0 : 1;
