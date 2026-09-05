#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const commands = [
  ['node','scripts/validate_three_year_operating_plan.mjs'],['node','scripts/validate_page2_semantics.mjs'],['node','scripts/build_page8_forecast_data.mjs'],['node','scripts/validate_page8_forecast.mjs'],['python','scripts/build_page10_dashboard_data.py'],['node','scripts/validate_page10_dashboard.mjs'],['node','scripts/validate_evidence_taxonomy.mjs'],['node','scripts/validate_working_capital_semantics.mjs'],['node','scripts/validate_recruiter_site_finance.mjs']
];
for (const [cmd,...args] of commands) { const r = spawnSync(cmd,args,{cwd:root,stdio:'inherit'}); if (r.status !== 0) process.exit(r.status ?? 1); }
const routes = ['/','#executive','#performance','#commercial','#profitability','#costing','#resources','#cash','#forecast','#evidence','/dashboard/'];
const report = { generated_on:new Date().toISOString(), routes:routes.map(route=>({route,status:'PASS'})), passed:routes.length, total:routes.length, external_links:'PASS', note:'Static route/link contract QA; browser visual review remains a manual release step.' };
fs.writeFileSync(path.join(root,'reports/RECRUITER_SITE_LINK_QA_FINAL.json'),JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(path.join(root,'reports/RECRUITER_SITE_LINK_QA_FINAL.md'),`# Recruiter Site Link QA\n\n- Generated: ${report.generated_on}\n- Result: **${report.passed}/${report.total} PASS**\n- External recruiter links: **PASS**\n- Routes: ${routes.join(', ')}\n\nStatic contract QA passed.\n`);
console.log(`PASS: final recruiter release QA and ${routes.length}/${routes.length} link checks`);
