#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
const root = process.cwd();
const run = (cmd, args) => {
  const result = spawnSync(cmd, args, { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

run('node', ['scripts/validate_three_year_operating_plan.mjs']);
run('node', ['scripts/validate_page2_semantics.mjs']);
run('python', ['scripts/build_page6_resources_data.py']);
run('node', ['scripts/validate_page6_resources.mjs']);
run('node', ['scripts/build_page8_forecast_data.mjs']);
run('node', ['scripts/validate_page8_forecast.mjs']);
run('python', ['scripts/build_page10_dashboard_data.py']);
// Link QA is source/built-output/public validation, then Page 10 consumes its fresh result.
run('node', ['scripts/run_true_link_qa.mjs']);
run('python', ['scripts/build_page10_dashboard_data.py']);
run('node', ['scripts/validate_page10_dashboard.mjs']);
run('node', ['scripts/validate_site_finance_literals.mjs']);
run('node', ['scripts/validate_scope_boundaries.mjs']);
run('node', ['scripts/validate_evidence_taxonomy.mjs']);
run('node', ['scripts/validate_working_capital_semantics.mjs']);
run('node', ['scripts/validate_release_identity_nonbi.mjs']);
run('node', ['scripts/validate_recruiter_site_finance.mjs']);
console.log('PASS: final recruiter release QA');
