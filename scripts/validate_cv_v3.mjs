#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const cvPath = 'docs/FINANCE_ANALYST_CV_ONE_PAGE_V3.md';
const cv = read(cvPath);
const variants = read('docs/CV_ROLE_VARIANTS_V2.md');
const evidence = read('docs/CV_EVIDENCE_MAP.md');
const talkTrack = read('docs/FINANCE_ANALYST_INTERVIEW_TALK_TRACK.md');
const checks = [];
const check = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail });
const bullets = (cv.match(/^[-*] /gm) ?? []).length;
const lineCount = cv.split(/\r?\n/).length;
const forbidden = ['delivered savings', 'internal forecast accuracy achieved', 'broker target price'];

check('cv_exists', cv.length > 0, `characters=${cv.length}`);
check('finance_first_positioning', cv.includes('Finance Analyst / Junior FP&A') && cv.includes('management P&L') && cv.includes('decision support'), 'title, profile and finance scope');
check('core_skill_coverage', ['FP&A', 'budgeting', 'rolling forecast', 'PVM', 'working capital', 'financial statement analysis'].every((term) => cv.toLowerCase().includes(term.toLowerCase())), 'primary Finance Analyst keywords present');
check('project_bullet_count', bullets === 5, `project_bullets=${bullets}`);
check('one_page_shape', lineCount <= 90, `lines=${lineCount}`);
check('fpna_evidence_numbers', cv.includes('28-tab') && cv.includes('2,160 invoice lines') && cv.includes('25% contribution hurdle'), 'operating model scale and decision control');
check('public_research_numbers', cv.includes('9.24%') && cv.includes('10.34%') && cv.includes('31.52%') && cv.includes('22/22 QA'), 'MCH public-finance evidence');
check('valuation_numbers', cv.includes('VND 40,673.8bn–101,614.9bn EV') && cv.includes('EV-only'), 'valuation frame and output boundary');
check('evidence_classes', ['SIMULATED', 'PUBLIC / CALCULATED', 'ANALYST_ASSUMPTION_REHEARSAL'].every((term) => cv.includes(term)), 'claim classes visible');
check('external_gate_boundary', cv.includes('internal forecast accuracy') && cv.includes('approved live evidence') && cv.includes('realised business impact'), 'unsupported live claims explicitly blocked; BI tooling remains outside active scope');
check('recruiter_links', cv.includes('github.com/susayold/commercial-finance-profitability-analytics') && cv.includes('vn-finance-fpa-case.sangkenny200.chatgpt.site'), 'GitHub and portfolio links');
check('no_overclaim_terms', forbidden.every((term) => !cv.toLowerCase().includes(term)), `forbidden_hits=${forbidden.filter((term) => cv.toLowerCase().includes(term)).join(',') || 'none'}`);
check('role_variant_coverage', ['Variant A — Junior FP&A', 'Variant B — Business Finance', 'Variant C — Finance Data Analyst', 'Variant D — Fundamental / Equity Research Analyst'].every((term) => variants.includes(term)), 'four role variants present');
check('role_variant_integrity', variants.toLowerCase().includes('real internal forecast accuracy') && variants.toLowerCase().includes('realised company impact'), 'variant boundary line present');
check('evidence_map_research_addon', evidence.includes('Equity research / valuation add-on') && evidence.includes('MCH_EQUITY_RESEARCH_REHEARSAL.md'), 'new research artifacts mapped to CV claims');
check('interview_research_talk_track', talkTrack.includes('Equity-research extension (5-minute optional path)') && talkTrack.includes('CFO/PAT'), 'research interview conversion path');

const passed = checks.filter((item) => item.pass).length;
const status = passed === checks.length ? 'PASS' : 'FAIL';
const qaPath = path.join(root, 'reports', 'CV_V3_QA.md');
const qa = `# Finance Analyst CV V3 QA\n\n**Status:** ${status}  \n**Checks:** ${passed}/${checks.length} passed  \n**Scope:** one-page shape, Finance Analyst keyword coverage, evidence tie-outs, role variants, interview conversion and claim boundary.\n\n| Check | Status | Detail |\n|---|---|---|\n${checks.map((item) => `| ${item.name} | ${item.pass ? 'PASS' : 'FAIL'} | ${String(item.detail).replaceAll('|', '\\|')} |`).join('\n')}\n\nThe CV remains a template until bracketed candidate fields are replaced. Project claims are restricted to the evidence classes stated in the CV and do not claim live internal forecast accuracy or realised company impact. Power BI is excluded from the active recruiter path.\n`;
fs.writeFileSync(qaPath, qa.replaceAll('native PBIX completion', 'BI tooling completion').replaceAll('Power BI is excluded', 'BI tooling is excluded'));
console.log(JSON.stringify({ status, checks: checks.length, passed, failures: checks.filter((item) => !item.pass), details: checks }, null, 2));
if (status !== 'PASS') process.exit(1);
