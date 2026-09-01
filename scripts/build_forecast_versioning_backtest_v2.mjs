#!/usr/bin/env node
/**
 * Build a leakage-safe multi-metric forecast version/backtest rehearsal.
 * The controlled fixture demonstrates Budget -> RF1 -> RF2 -> RF3 -> LE
 * vintages, 1/2/3/6-month horizons, version bridges and override governance.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "data", "forecast");
fs.mkdirSync(OUT, { recursive: true });

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i], next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') { field += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift().map((x) => x.trim());
  return rows.filter((r) => r.some((x) => x !== "")).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}
function read(relative) { return parseCsv(fs.readFileSync(path.join(ROOT, relative), "utf8")); }
function n(v) { const x = Number(v); if (!Number.isFinite(x)) throw new Error(`Not numeric: ${v}`); return x; }
function round(v) { return Math.round(v * 100) / 100; }
function csvEscape(v) { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }
function write(file, headers, rows) {
  fs.writeFileSync(path.join(OUT, file), `${[headers.join(","), ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(","))].join("\n")}\n`, "utf8");
}
function addMonths(iso, delta) {
  const [y, m] = iso.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}
function monthEnd(ym) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
}

const income = read("data/financial_statements/monthly_income_statement.csv");
const balance = read("data/financial_statements/monthly_balance_sheet.csv");
const cashflow = read("data/financial_statements/monthly_cash_flow.csv");
const targetPeriods = Array.from({ length: 12 }, (_, i) => `2025-${String(i + 1).padStart(2, "0")}`);
const incomeBy = Object.fromEntries(income.map((r) => [r.period, r]));
const balanceBy = Object.fromEntries(balance.map((r) => [r.period, r]));
const cashflowBy = Object.fromEntries(cashflow.map((r) => [r.period, r]));
const metricValue = (period, metric) => {
  const i = incomeBy[period], b = balanceBy[period], c = cashflowBy[period];
  if (metric === "REVENUE") return n(i.net_revenue_vnd);
  if (metric === "GROSS_PROFIT") return n(i.gross_profit_vnd);
  if (metric === "EBITDA_PROXY") return n(i.ebitda_statement_proxy_vnd);
  if (metric === "CFO") return n(c.cfo_vnd);
  if (metric === "WORKING_CAPITAL") return n(b.ar_closing_vnd) + n(b.inventory_closing_vnd) - n(b.ap_closing_vnd);
  throw new Error(`Unsupported metric ${metric}`);
};

const versionConfig = [
  { id: "BUDGET", horizon: 6, offset: 0.080, owner: "FP&A", reason: "Annual operating budget baseline" },
  { id: "RF1", horizon: 3, offset: 0.050, owner: "FP&A", reason: "First quarterly reforecast; volume reset" },
  { id: "RF2", horizon: 2, offset: 0.030, owner: "Commercial Finance", reason: "Mix and trade-spend refresh" },
  { id: "RF3", horizon: 1, offset: 0.015, owner: "FP&A", reason: "Near-term close preparation" },
  { id: "LATEST_ESTIMATE", horizon: 1, offset: 0.010, owner: "Finance Director", reason: "Approved latest-estimate override" },
];
const metrics = ["REVENUE", "GROSS_PROFIT", "EBITDA_PROXY", "CFO", "WORKING_CAPITAL"];
const snapshots = [];
for (const target of targetPeriods) {
  for (const cfg of versionConfig) {
    const created = addMonths(target, -cfg.horizon);
    for (const metric of metrics) {
      const actual = metricValue(target, metric);
      const metricDirection = metric === "CFO" || metric === "WORKING_CAPITAL" ? -1 : 1;
      const forecast = actual * (1 + metricDirection * cfg.offset);
      snapshots.push({
        snapshot_id: `${cfg.id}-${target}-${metric}`,
        forecast_version: cfg.id,
        target_period: target,
        metric_id: metric,
        horizon_months: cfg.horizon,
        forecast_created_at: `${created}-05`,
        forecast_cutoff_at: monthEnd(created),
        actual_period_close_date: monthEnd(target),
        actual_available_at: `${addMonths(target, 1)}-15`,
        as_of_date: "2026-01-31",
        forecast_value_vnd: round(forecast),
        actual_value_vnd: round(actual),
        error_vnd: round(forecast - actual),
        abs_error_vnd: round(Math.abs(forecast - actual)),
        snapshot_status: "FROZEN",
        evidence_class: "SIMULATED_BACKTEST",
        source_model_version: "NONBI_FP&A_V2",
        approver: cfg.owner,
      });
    }
  }
  for (const metric of metrics) {
    const actual = metricValue(target, metric);
    snapshots.push({
      snapshot_id: `ACTUAL-${target}-${metric}`,
      forecast_version: "ACTUAL",
      target_period: target,
      metric_id: metric,
      horizon_months: 0,
      forecast_created_at: `${monthEnd(target)}T23:59:00Z`,
      forecast_cutoff_at: monthEnd(target),
      actual_period_close_date: monthEnd(target),
      actual_available_at: `${addMonths(target, 1)}-15`,
      as_of_date: "2026-01-31",
      forecast_value_vnd: round(actual),
      actual_value_vnd: round(actual),
      error_vnd: 0,
      abs_error_vnd: 0,
      snapshot_status: "ACTUAL",
      evidence_class: "SIMULATED_ACTUAL",
      source_model_version: "NONBI_FP&A_V2",
      approver: "Controlling (synthetic)",
    });
  }
}

const snapshotHeaders = ["snapshot_id", "forecast_version", "target_period", "metric_id", "horizon_months", "forecast_created_at", "forecast_cutoff_at", "actual_period_close_date", "actual_available_at", "as_of_date", "forecast_value_vnd", "actual_value_vnd", "error_vnd", "abs_error_vnd", "snapshot_status", "evidence_class", "source_model_version", "approver"];
write("forecast_versioned_snapshots_v2.csv", snapshotHeaders, snapshots);

const metricRows = [];
for (const cfg of [...versionConfig, { id: "ACTUAL", horizon: 0 }]) {
  for (const metric of metrics) {
    const group = snapshots.filter((r) => r.forecast_version === cfg.id && r.metric_id === metric);
    const actualTotal = group.reduce((a, r) => a + n(r.actual_value_vnd), 0);
    const forecastTotal = group.reduce((a, r) => a + n(r.forecast_value_vnd), 0);
    const absError = group.reduce((a, r) => a + n(r.abs_error_vnd), 0);
    const mae = group.length ? absError / group.length : 0;
    const wape = Math.abs(actualTotal) > 0 ? absError / Math.abs(actualTotal) : 0;
    const bias = Math.abs(actualTotal) > 0 ? (forecastTotal - actualTotal) / actualTotal : 0;
    const budget = snapshots.filter((r) => r.forecast_version === "BUDGET" && r.metric_id === metric);
    const budgetActual = budget.reduce((a, r) => a + n(r.actual_value_vnd), 0);
    const budgetAbs = budget.reduce((a, r) => a + n(r.abs_error_vnd), 0);
    const budgetWape = Math.abs(budgetActual) > 0 ? budgetAbs / Math.abs(budgetActual) : 0;
    metricRows.push({ forecast_version: cfg.id, metric_id: metric, horizon_months: cfg.horizon, eligible_rows: group.length, forecast_total_vnd: round(forecastTotal), actual_total_vnd: round(actualTotal), bias_pct: round(bias * 100), wape_pct: round(wape * 100), mae_vnd: round(mae), fva_vs_budget_pct: cfg.id === "BUDGET" ? 0 : round((budgetWape - wape) * 100), as_of_date: "2026-01-31", evidence_class: "SIMULATED_BACKTEST" });
  }
}
write("forecast_backtest_metrics_v2.csv", ["forecast_version", "metric_id", "horizon_months", "eligible_rows", "forecast_total_vnd", "actual_total_vnd", "bias_pct", "wape_pct", "mae_vnd", "fva_vs_budget_pct", "as_of_date", "evidence_class"], metricRows);

const transitions = [["BUDGET", "RF1"], ["RF1", "RF2"], ["RF2", "RF3"], ["RF3", "LATEST_ESTIMATE"]];
const bridgeRows = [];
for (const target of targetPeriods) for (const metric of metrics) for (const [from, to] of transitions) {
  const old = snapshots.find((r) => r.forecast_version === from && r.target_period === target && r.metric_id === metric);
  const next = snapshots.find((r) => r.forecast_version === to && r.target_period === target && r.metric_id === metric);
  const delta = n(next.forecast_value_vnd) - n(old.forecast_value_vnd);
  const effects = { volume_effect_vnd: delta * 0.40, price_effect_vnd: delta * 0.25, mix_effect_vnd: delta * 0.15, cost_effect_vnd: delta * 0.12, opex_effect_vnd: delta * 0.05, wc_effect_vnd: delta * 0.03 };
  bridgeRows.push({ target_period: target, metric_id: metric, from_version: from, to_version: to, baseline_value_vnd: n(old.forecast_value_vnd), override_value_vnd: n(next.forecast_value_vnd), ...Object.fromEntries(Object.entries(effects).map(([k, v]) => [k, round(v)])), total_change_vnd: round(delta), bridge_check_vnd: round(Object.values(effects).reduce((a, v) => a + v, 0) - delta), evidence_class: "SIMULATED_DERIVED" });
}
write("forecast_version_bridge_v2.csv", ["target_period", "metric_id", "from_version", "to_version", "baseline_value_vnd", "override_value_vnd", "volume_effect_vnd", "price_effect_vnd", "mix_effect_vnd", "cost_effect_vnd", "opex_effect_vnd", "wc_effect_vnd", "total_change_vnd", "bridge_check_vnd", "evidence_class"], bridgeRows);

const overrideRows = versionConfig.map((cfg, i) => ({ override_id: `OVR-${String(i + 1).padStart(3, "0")}`, forecast_version: cfg.id, override_date: `2025-${String(3 + i).padStart(2, "0")}-05`, owner: cfg.owner, reason: cfg.reason, baseline_version: i === 0 ? "N/A" : versionConfig[i - 1].id, affected_metrics: metrics.join("|"), approval_status: "APPROVED_SYNTHETIC", evidence_class: "SIMULATED_GOVERNANCE" }));
write("forecast_override_log_v2.csv", ["override_id", "forecast_version", "override_date", "owner", "reason", "baseline_version", "affected_metrics", "approval_status", "evidence_class"], overrideRows);

const summary = { generated_on: "2026-09-01", target_periods: targetPeriods.length, metric_count: metrics.length, frozen_versions: versionConfig.map((x) => x.id), actual_rows: targetPeriods.length * metrics.length, horizon_set: [1, 2, 3, 6], snapshot_rows: snapshots.length, bridge_rows: bridgeRows.length, override_rows: overrideRows.length, evidence_boundary: "SIMULATED_BACKTEST; live claims require approved real frozen snapshots and post-close actuals." };
fs.writeFileSync(path.join(OUT, "forecast_versioning_backtest_v2_summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
