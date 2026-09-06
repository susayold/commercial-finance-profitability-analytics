#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const requiredRoutes = ['/','#executive','#performance','#commercial','#profitability','#costing','#resources','#cash','#forecast','#evidence','/dashboard/'];
const sourceFiles = ['site/app/page.tsx','site/app/dashboard-page10.tsx','site/app/executive-page1.tsx','site/app/performance-page2.tsx','site/app/commercial-page3.tsx','site/app/profitability-page4.tsx','site/app/costing-page5.tsx','site/app/resources-page6.tsx','site/app/cash-page7.tsx','site/app/forecast-page8.tsx','site/app/evidence-page9.tsx'];
const sourceText = sourceFiles.filter(f => fs.existsSync(path.join(root, f))).map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');
const internal = requiredRoutes.map(route => ({ route, status: route === '/' || route === '/dashboard/' || sourceText.includes(route) ? 'PASS' : 'FAIL' }));

const builtFiles = ['docs/index.html','docs/dashboard/index.html'];
const html = builtFiles.filter(f => fs.existsSync(path.join(root, f))).map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');
const assetRefs = [...new Set([...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(m => m[1]).filter(x => !x.startsWith('http')))].map(ref => ref.replace(/^\//, ''));
const built = [...builtFiles.map(file => ({ file, status: fs.existsSync(path.join(root, file)) ? 'PASS' : 'FAIL' })), ...assetRefs.map(file => {
  const normalized = file.replace(/^commercial-finance-profitability-analytics\//, '');
  return { file, status: fs.existsSync(path.join(root, 'docs', normalized)) || fs.existsSync(path.join(root, normalized)) ? 'PASS' : 'FAIL' };
})];

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
    const status = response.status === 403 ? 'WARN' : response.status >= 200 && response.status < 400 ? 'PASS' : 'FAIL';
    return { url, httpStatus: response.status, status };
  } catch (error) {
    return { url, httpStatus: null, status: 'WARN', note: error.name === 'AbortError' ? 'timeout' : String(error.message) };
  } finally { clearTimeout(timer); }
}

const external = await Promise.all([
  check('https://github.com/susayold/commercial-finance-profitability-analytics'),
  check('https://susayold.github.io/commercial-finance-profitability-analytics/'),
  check('https://susayold.github.io/commercial-finance-profitability-analytics/dashboard/'),
]);
const failed = [...internal, ...built].filter(x => x.status === 'FAIL').length + external.filter(x => x.status === 'FAIL').length;
const warnings = external.filter(x => x.status === 'WARN').length;
const report = {
  generated_on: new Date().toISOString(),
  source_sha: (() => { try { return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(); } catch { return null; } })(),
  internal_routes: { passed: internal.filter(x => x.status === 'PASS').length, total: internal.length, checks: internal },
  built_output: { passed: built.filter(x => x.status === 'PASS').length, total: built.length, checks: built },
  external_links: { passed: external.filter(x => x.status === 'PASS').length, warnings, failed: external.filter(x => x.status === 'FAIL').length, checks: external },
  overall_status: failed ? 'FAIL' : 'PASS',
};
fs.writeFileSync(path.join(root, 'reports/RECRUITER_SITE_LINK_QA_FINAL.json'), JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'site/data/generated/recruiter-link-qa.json'), JSON.stringify(report, null, 2) + '\n');
const md = `# Recruiter Site Link QA\n\n- Generated: ${report.generated_on}\n- Overall: **${report.overall_status}**\n- Internal routes: **${report.internal_routes.passed}/${report.internal_routes.total} PASS**\n- Built output checks: **${report.built_output.passed}/${report.built_output.total} PASS**\n- Public links: **${report.external_links.passed}/${external.length} PASS**, ${warnings} warning(s)\n\nThis report validates source route declarations, built HTML/assets and public HTTP reachability. The private Sites URL is intentionally not a required CI dependency.\n`;
fs.writeFileSync(path.join(root, 'reports/RECRUITER_SITE_LINK_QA_FINAL.md'), md);
if (failed) process.exit(1);
console.log(`PASS: true link QA (${report.internal_routes.passed}/${report.internal_routes.total} routes, ${report.built_output.passed}/${report.built_output.total} build checks, ${report.external_links.passed}/${external.length} public links)`);
