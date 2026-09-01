#!/usr/bin/env node
import fs from "node:fs";

function parse(text) { const rows = text.trim().split(/\r?\n/).map((x) => x.split(",")); const h = rows.shift(); return rows.map((r) => Object.fromEntries(h.map((k, i) => [k, r[i] ?? ""]))); }
function n(v) { const x = Number(v); return Number.isFinite(x) ? x : NaN; }
const checks = [];
const pass = (name, ok, detail) => { checks.push({ name, status: ok ? "PASS" : "FAIL", detail }); if (!ok) process.exitCode = 1; };
const files = ["data/forecast/forecast_versioned_snapshots_v2.csv", "data/forecast/forecast_backtest_metrics_v2.csv", "data/forecast/forecast_version_bridge_v2.csv", "data/forecast/forecast_override_log_v2.csv", "data/forecast/forecast_versioning_backtest_v2_summary.json"];
for (const file of files) pass(`file:${file}`, fs.existsSync(file), "required forecast-v2 artifact");
if (!fs.existsSync(files[0])) { console.log(checks); process.exit(1); }
const snapshots = parse(fs.readFileSync(files[0], "utf8"));
const metrics = parse(fs.readFileSync(files[1], "utf8"));
const bridge = parse(fs.readFileSync(files[2], "utf8"));
const overrides = parse(fs.readFileSync(files[3], "utf8"));
const versions = ["BUDGET", "RF1", "RF2", "RF3", "LATEST_ESTIMATE", "ACTUAL"];
const metricIds = ["REVENUE", "GROSS_PROFIT", "EBITDA_PROXY", "CFO", "WORKING_CAPITAL"];
pass("version_coverage", versions.every((v) => snapshots.some((r) => r.forecast_version === v)), "Budget/RF1/RF2/RF3/LE/Actual");
pass("metric_coverage", metricIds.every((m) => snapshots.some((r) => r.metric_id === m)), "revenue/GP/EBITDA/CFO/WC");
pass("horizon_coverage", ["0", "1", "2", "3", "6"].every((h) => snapshots.some((r) => r.horizon_months === h)), "0/1/2/3/6 month horizons");
pass("snapshot_row_count", snapshots.length === 360, `expected 360, got ${snapshots.length}`);
pass("freeze_before_actual", snapshots.every((r) => r.forecast_version === "ACTUAL" || new Date(r.forecast_created_at) < new Date(r.actual_available_at)), "freeze timestamp precedes actual availability");
pass("asof_eligibility", snapshots.every((r) => new Date(r.actual_available_at) <= new Date(r.as_of_date)), "all controlled fixture actuals eligible by as-of");
pass("evidence_labels", snapshots.every((r) => r.evidence_class.startsWith("SIMULATED")), "fixture labelled synthetic");
pass("metric_rows_numeric", snapshots.every((r) => [r.forecast_value_vnd, r.actual_value_vnd, r.error_vnd, r.abs_error_vnd].every((v) => Number.isFinite(n(v)))), "forecast/actual/error columns numeric");
pass("error_identity", snapshots.every((r) => Math.abs(n(r.error_vnd) - (n(r.forecast_value_vnd) - n(r.actual_value_vnd))) < 0.02 && Math.abs(n(r.abs_error_vnd) - Math.abs(n(r.error_vnd))) < 0.02), "error and absolute-error identities");
pass("backtest_metric_coverage", metrics.length === 30 && versions.every((v) => metrics.filter((r) => r.forecast_version === v).length === 5), "six versions × five metrics");
pass("wape_policy", metrics.every((r) => n(r.wape_pct) >= 0 && n(r.mae_vnd) >= 0), "non-negative WAPE/MAE with absolute actual denominator");
pass("bridge_coverage", bridge.length === 240, "12 periods × 5 metrics × 4 transitions");
pass("bridge_identity", bridge.every((r) => Math.abs(n(r.bridge_check_vnd)) < 0.02 && Math.abs(n(r.override_value_vnd) - n(r.baseline_value_vnd) - n(r.total_change_vnd)) < 0.02), "version bridge effects reconcile");
pass("override_governance", overrides.length === 5 && overrides.every((r) => r.owner && r.reason && r.override_date && r.approval_status), "owner/reason/date/approval fields");
pass("live_claim_boundary", fs.readFileSync(files[4], "utf8").includes("live claims require approved real frozen snapshots"), "live accuracy remains gated");
console.log(checks.map((c) => `${c.status} ${c.name} — ${c.detail}`).join("\n"));
console.log(`Overall status: ${process.exitCode ? "FAIL" : "PASS"} (${checks.filter((c) => c.status === "PASS").length}/${checks.length} checks passed)`);
