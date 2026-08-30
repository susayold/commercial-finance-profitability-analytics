#!/usr/bin/env node
/**
 * Cross-platform deterministic QA runner for the finance portfolio.
 *
 * It runs only repository-local validators and writes transient reports under
 * the operating-system temp directory. The temp directory is removed in the
 * finally block, so no generated QA output becomes an authoritative artifact.
 * External gates (real internal forecast snapshots and native PBIX/Desktop QA)
 * are intentionally not fabricated by this runner.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const transient = fs.mkdtempSync(path.join(os.tmpdir(), 'vietnova-finance-qa-'));
const tasks = [
  ['evidence_matrix', ['scripts/validate_master_plan_evidence_matrix.mjs']],
  ['external_gate_readiness', ['scripts/validate_external_gate_readiness.mjs', 'data/external_gate_readiness.json']],
  ['customer_profitability', ['scripts/validate_customer_profitability.mjs', 'data/customer_profitability_synthetic.csv']],
  ['customer_profitability_analysis', ['scripts/validate_customer_profitability_analysis.mjs', 'data/customer_profitability_synthetic.csv', 'data/customer_profitability_summary.json']],
  ['battle_cards_v2', ['scripts/validate_battle_cards_v2.mjs', 'docs/BATTLE_CARDS_V2.md', 'data/battle_cards_v2.csv']],
  ['capex_fixed_asset_planning', ['scripts/validate_capex_fixed_asset_planning.mjs', 'data/capex_fixed_asset_planning_synthetic.csv', 'docs/CAPEX_FIXED_ASSET_PLANNING_MODULE.md', path.join(transient, 'capex_QA.md')]],
  ['finance_analyst_kpi_dictionary', ['scripts/validate_finance_analyst_kpi_dictionary.mjs', 'docs/FINANCE_ANALYST_KPI_DICTIONARY.md', 'data/finance_analyst_kpi_dictionary.csv']],
  ['forecast_capture_archive', ['scripts/validate_forecast_capture_archive.mjs', 'data/forecast_snapshot_capture_demo_frozen.csv', path.join(transient, 'forecast_capture_archive_QA.md')]],
  ['gate_a_intake_template', ['scripts/validate_gate_a_intake_contract.mjs', 'data/forecast_snapshot_gate_a_intake_template.csv', path.join(transient, 'gate_a_template_QA.md'), '--mode=template']],
  ['gate_a_intake_fixture', ['scripts/validate_gate_a_intake_contract.mjs', 'data/forecast_snapshot_gate_a_unit_test.csv', path.join(transient, 'gate_a_fixture_QA.md'), '--mode=fixture']],
  ['management_recommendation_register', ['scripts/validate_management_recommendation_register.mjs', 'reports/MANAGEMENT_RECOMMENDATION_REGISTER_2026-08-30.md', 'data/management_recommendation_register_2026-08-30.csv']],
  ['mch_credit_memo', ['scripts/validate_mch_credit_memo.mjs', 'data/mch_finance_analyst_trend_2016_2025.csv', path.join(transient, 'mch_credit_memo_QA.md')]],
  ['mch_financial_statement_analysis', ['scripts/validate_mch_financial_statement_analysis.mjs', 'data/mch_financial_statement_analysis_2016_2025.csv']],
  ['mch_statement_supplement', ['scripts/validate_mch_statement_supplement.mjs', 'data/mch_statement_metrics_2024_2025_approved.csv']],
  ['monte_carlo_risk_overlay', ['scripts/validate_monte_carlo_risk_overlay.mjs', 'reports/MONTE_CARLO_RISK_OVERLAY_2026-08-30.md', 'data/monte_carlo_risk_overlay_2026-08-30.csv']],
  ['monthly_business_review', ['scripts/validate_monthly_business_review.mjs', 'reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md', 'data/monthly_business_review_kpi_pack_2026-08-30.csv']],
  ['monthly_close_calendar', ['scripts/validate_monthly_close_calendar.mjs', 'docs/MONTHLY_CLOSE_FORECAST_BUSINESS_PARTNERING_CALENDAR.md', 'data/monthly_close_forecast_business_partnering_calendar.csv']],
  ['operational_driver_tree', ['scripts/validate_operational_driver_tree.mjs', 'docs/OPERATIONAL_DRIVER_TREE_UNIT_ECONOMICS.md', 'data/operational_driver_tree_unit_economics.csv']],
  ['opex_headcount_planning', ['scripts/validate_opex_headcount_planning.mjs', 'data/opex_headcount_planning_synthetic.csv', 'docs/OPEX_HEADCOUNT_PLANNING_MODULE.md', path.join(transient, 'opex_QA.md')]],
  ['peer_basis_perimeter_bridge', ['scripts/validate_peer_basis_perimeter_bridge.mjs', 'data/peer_basis_perimeter_bridge_2016_2025.csv']],
  ['peer_financial_quality_scorecard', ['scripts/validate_peer_financial_quality_scorecard.mjs', 'data/peer_financial_quality_scorecard_2020_2025.csv']],
  ['powerbi_source_coherence', ['scripts/validate_powerbi_source_coherence.mjs', 'powerbi/PBIP_SOURCE_MANIFEST.json', 'powerbi/model_contract.json', 'powerbi/measures.dax', 'powerbi/QA_TEST_MATRIX.md', 'powerbi/QA_EVIDENCE_LOG_TEMPLATE.csv']],
  ['inventory_quality', ['scripts/validate_inventory_quality.mjs', 'data/inventory_quality_synthetic.csv']],
  ['liquidity_stress', ['scripts/validate_liquidity_stress.mjs', 'data/liquidity_stress_synthetic.csv']],
  ['block_a_design_lock', ['scripts/validate_block_a_design_lock.mjs', 'data/block_a_design_lock.csv']],
  ['role_alignment', ['scripts/validate_role_alignment_matrix.mjs']],
  ['promotion_roi', ['scripts/validate_promotion_roi.mjs', 'data/promotion_roi_synthetic.csv']],
  ['budget_reallocation', ['scripts/validate_budget_reallocation.mjs', 'data/budget_reallocation_synthetic.csv']],
  ['pricing_simulator', ['scripts/validate_pricing_simulator.mjs', 'data/pricing_simulator_synthetic.csv']],
  ['forecast_snapshot_contract', ['scripts/validate_live_forecast_submission.mjs', 'data/forecast_snapshot_live_unit_test.csv', path.join(transient, 'forecast_live_gate_QA.md'), '--mode=fixture']],
  ['powerbi_qa_evidence_template', ['scripts/validate_powerbi_qa_evidence.mjs', 'powerbi/QA_EVIDENCE_LOG_TEMPLATE.csv']],
  ['pbip_manifest', ['scripts/validate_pbip_source_manifest.mjs']],
  ['powerbi_measure_column_collisions', ['scripts/validate_powerbi_measure_column_collisions.py']],
  ['mna', ['scripts/validate_mna_accretion_dilution.mjs']],
  ['d2c', ['scripts/validate_d2c_unit_economics.mjs', 'data/d2c_unit_economics_synthetic.csv']],
  ['public_guidance', ['scripts/validate_public_guidance_proxy.mjs', 'data/vnm_public_guidance_proxy_2018_2025.csv']],
  ['public_guidance_analysis', ['scripts/validate_public_guidance_proxy_analysis.mjs', 'data/vnm_public_guidance_proxy_analysis.json']],
  ['vnm_longrun', ['scripts/validate_vnm_longrun_panel.mjs', 'data/vnm_longrun_panel_2006_2025.csv', path.join(transient, 'vnm_longrun_QA.md')]],
  ['peer_evidence', ['scripts/validate_peer_evidence.mjs', 'data/peer_benchmark_approved_2016_2025.csv', 'data/peer_extraction_queue.csv', 'data/vnm_statement_metrics_2006_2020.csv', path.join(transient, 'peer_QA.md')]],
  ['mch_fy2017_web_index', ['scripts/validate_mch_fy2017_web_evidence.mjs', 'data/mch_fy2017_web_index_evidence.csv', 'reports/MCH_FY2017_WEB_INDEX_EVIDENCE_QA.md']],
  ['mch_ocr_workbench', ['scripts/validate_mch_ocr_workbench.mjs', 'data/mch_ocr_review_workbench_template.csv']],
  ['normalized_peer_approved', ['scripts/validate_normalized_peer_panel.mjs', 'data/normalized_peer_panel_approved_2016_2025.csv', '--mode=approved']],
  ['normalized_peer_template', ['scripts/validate_normalized_peer_panel.mjs', 'data/normalized_peer_panel_intake_template.csv', '--mode=template']],
  ['peer_basis_adjustment_feasibility', ['scripts/validate_peer_basis_adjustment_feasibility.mjs']],
  ['next_execution_sprint', ['scripts/validate_next_execution_sprint.mjs']],
  ['mch_valuation_rehearsal', ['scripts/validate_mch_valuation_rehearsal.mjs']],
  ['mch_equity_research_rehearsal', ['scripts/validate_mch_equity_research_rehearsal.mjs']],
  ['cv_v3_package', ['scripts/validate_cv_v3.mjs']],
];

const result = { status: 'PASS', runner: 'run_finance_qa.mjs', checks: [] };
try {
  for (const [name, args] of tasks) {
    // Most validators are Node scripts, but a few repository gates are
    // intentionally Python so they can share the same implementation with
    // the release gate. Dispatch by script suffix instead of asking Node to
    // parse Python source (which would create a false QA failure).
    const interpreter = args[0]?.endsWith('.py')
      ? (process.platform === 'win32' ? 'python' : 'python3')
      : process.execPath;
    const run = spawnSync(interpreter, args, { cwd: root, encoding: 'utf8' });
    const output = `${run.stdout ?? ''}${run.stderr ?? ''}`.trim();
    const check = { name, status: run.status === 0 ? 'PASS' : 'FAIL' };
    if (output) check.output_tail = output.split(/\r?\n/).slice(-6).join('\n');
    result.checks.push(check);
    if (run.status !== 0) result.status = 'FAIL';
  }

  const contract = JSON.parse(fs.readFileSync(path.join(root, 'powerbi', 'model_contract.json'), 'utf8'));
  const contractOk = [contract.dimensions, contract.facts, contract.pages, contract.relationships].every(Array.isArray);
  result.checks.push({
    name: 'powerbi_contract_shape',
    status: contractOk ? 'PASS' : 'FAIL',
    dimensions: contract.dimensions?.length ?? 0,
    facts: contract.facts?.length ?? 0,
    pages: contract.pages?.length ?? 0,
    relationships: contract.relationships?.length ?? 0,
  });
  if (!contractOk) result.status = 'FAIL';

  const python = process.platform === 'win32' ? 'python' : 'python3';
  const directQuery = spawnSync(python, ['scripts/validate_directquery_readiness.py'], { cwd: root, encoding: 'utf8' });
  const directQueryOutput = `${directQuery.stdout ?? ''}${directQuery.stderr ?? ''}`.trim();
  const directQueryCheck = { name: 'directquery_readiness', status: directQuery.status === 0 ? 'PASS' : 'FAIL' };
  if (directQueryOutput) directQueryCheck.output_tail = directQueryOutput.split(/\r?\n/).slice(-6).join('\n');
  result.checks.push(directQueryCheck);
  if (directQuery.status !== 0) result.status = 'FAIL';

  const directQueryMapping = spawnSync(python, ['scripts/validate_directquery_mapping.py'], { cwd: root, encoding: 'utf8' });
  const directQueryMappingOutput = `${directQueryMapping.stdout ?? ''}${directQueryMapping.stderr ?? ''}`.trim();
  const directQueryMappingCheck = { name: 'directquery_mapping', status: directQueryMapping.status === 0 ? 'PASS' : 'FAIL' };
  if (directQueryMappingOutput) directQueryMappingCheck.output_tail = directQueryMappingOutput.split(/\r?\n/).slice(-6).join('\n');
  result.checks.push(directQueryMappingCheck);
  if (directQueryMapping.status !== 0) result.status = 'FAIL';

  const directQueryHealthContract = spawnSync(python, ['scripts/validate_directquery_health_contract.py'], { cwd: root, encoding: 'utf8' });
  const directQueryHealthOutput = `${directQueryHealthContract.stdout ?? ''}${directQueryHealthContract.stderr ?? ''}`.trim();
  const directQueryHealthCheck = { name: 'directquery_health_contract', status: directQueryHealthContract.status === 0 ? 'PASS' : 'FAIL' };
  if (directQueryHealthOutput) directQueryHealthCheck.output_tail = directQueryHealthOutput.split(/\r?\n/).slice(-6).join('\n');
  result.checks.push(directQueryHealthCheck);
  if (directQueryHealthContract.status !== 0) result.status = 'FAIL';

  const releaseRecord = spawnSync(python, ['scripts/validate_powerbi_release_record.py'], { cwd: root, encoding: 'utf8' });
  const releaseRecordOutput = `${releaseRecord.stdout ?? ''}${releaseRecord.stderr ?? ''}`.trim();
  const releaseRecordCheck = { name: 'powerbi_release_record', status: releaseRecord.status === 0 ? 'PASS' : 'FAIL' };
  if (releaseRecordOutput) releaseRecordCheck.output_tail = releaseRecordOutput.split(/\r?\n/).slice(-6).join('\n');
  result.checks.push(releaseRecordCheck);
  if (releaseRecord.status !== 0) result.status = 'FAIL';
} finally {
  fs.rmSync(transient, { recursive: true, force: true });
}

console.log(JSON.stringify(result, null, 2));
if (result.status !== 'PASS') process.exit(1);
