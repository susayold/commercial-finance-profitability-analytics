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
];

const result = { status: 'PASS', runner: 'run_finance_qa.mjs', checks: [] };
try {
  for (const [name, args] of tasks) {
    const run = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
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
} finally {
  fs.rmSync(transient, { recursive: true, force: true });
}

console.log(JSON.stringify(result, null, 2));
if (result.status !== 'PASS') process.exit(1);
