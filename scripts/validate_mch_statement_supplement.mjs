#!/usr/bin/env node
import fs from "node:fs";

const file = process.argv[2] ?? "data/mch_statement_metrics_2024_2025_approved.csv";
const text = fs.readFileSync(file, "utf8").trimEnd();
const rows = text.split(/\r?\n/).map(line => line.split(","));
const header = rows.shift();
const idx = Object.fromEntries(header.map((name, i) => [name, i]));
const required = ["company_id","fiscal_year","metric","value","value_vnd_bn","audited_status","restatement_status","source_page","comparability_status","review_status"];
const metrics = new Set(["net_revenue_vnd_bn","gross_profit_vnd_bn","operating_profit_vnd_bn","profit_before_tax_vnd_bn","profit_after_tax_vnd_bn","total_assets_vnd_bn","owners_equity_vnd_bn","operating_cash_flow_vnd_bn"]);
const fail = (msg) => { console.error("FAIL:", msg); process.exitCode = 1; };
for (const col of required) if (!(col in idx)) fail("missing column " + col);
if (rows.length !== 80) fail(`expected 80 rows, got ${rows.length}`);
const keys = new Set();
for (const row of rows) {
  if (row.length !== header.length) fail("column-count mismatch");
  const key = [row[idx.company_id], row[idx.fiscal_year], row[idx.metric]].join("|");
  if (keys.has(key)) fail("duplicate key " + key); keys.add(key);
  if (row[idx.company_id] !== "MCH") fail("company_id is not MCH");
  if (!metrics.has(row[idx.metric])) fail("unexpected metric " + row[idx.metric]);
  if (!/^20(16|17|18|19|20|21|22|23|24|25)$/.test(row[idx.fiscal_year])) fail("unexpected fiscal year");
  if (row[idx.review_status] !== "approved") fail("non-approved row");
  if (!/^\d+(\.\d+)?$/.test(row[idx.value])) fail("non-numeric value");
  if (!/^\d+(\.\d+)?$/.test(row[idx.value_vnd_bn])) fail("non-numeric normalized value");
  if (!["6","7","8","10"].includes(row[idx.source_page])) fail("unexpected source page");
}
const fy = new Set(rows.map(r => r[idx.fiscal_year]));
if (fy.size !== 10) fail("not exactly 10 fiscal years");
const fy17 = rows.filter(r => r[idx.fiscal_year] === "2017");
if (fy17.length !== 8 || fy17.some(r => r[idx.audited_status] !== "audited_comparative" || r[idx.restatement_status] !== "corresponding_column" || r[idx.comparability_status] !== "partially_comparable")) fail("FY2017 comparative caveat not consistently tagged");
if (!process.exitCode) console.log("PASS: 80 rows; 10 FY; 8 metrics/FY; unique keys; numeric values; approved status; FY2017 caveat tagged");
