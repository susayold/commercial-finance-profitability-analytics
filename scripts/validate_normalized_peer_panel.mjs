#!/usr/bin/env node
import fs from "node:fs";

const args = process.argv.slice(2);
const modeArg = args.find(x => x.startsWith("--mode="));
const mode = modeArg ? modeArg.split("=")[1] : "approved";
const input = args.find(x => !x.startsWith("--"));
const output = args.includes("--output") ? args[args.indexOf("--output") + 1] : null;
if (!input) throw new Error("Usage: node validate_normalized_peer_panel.mjs <csv> [--mode=approved|template] [--output report.md]");

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const header = (rows.shift() || []).map(x => x.trim());
  return { header, rows: rows.filter(r => r.some(x => x !== "")).map(r => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()]))) };
}

const expectedHeaders = [
  "record_id","company_id","ticker","company_name","peer_role","period_type","fiscal_year",
  "fiscal_quarter","start_date","end_date","months_in_period","scope","audited_status","currency",
  "scale","accounting_standard","restatement_status","fiscal_year_end","metric","metric_original_label",
  "value","unit","value_vnd_bn","value_status","null_reason","reported_or_calculated",
  "calculation_definition","source_document_id","source_url","source_page","source_file_drive_id",
  "comparability_status","comparability_note","confidence","review_status","extraction_method",
  "extraction_timestamp_utc"
];
const metrics = [
  "net_revenue_vnd_bn","gross_profit_vnd_bn","operating_profit_vnd_bn","profit_before_tax_vnd_bn",
  "profit_after_tax_vnd_bn","total_assets_vnd_bn","owners_equity_vnd_bn","operating_cash_flow_vnd_bn"
];
const checks = [];
const add = (name, pass, detail) => checks.push({ name, pass, detail });
const data = parseCsv(fs.readFileSync(input, "utf8"));
add("Required headers", expectedHeaders.every(x => data.header.includes(x)), `missing=${expectedHeaders.filter(x => !data.header.includes(x)).join("|") || "none"}`);
add("No duplicate headers", new Set(data.header).size === data.header.length, `headers=${data.header.length}; unique=${new Set(data.header).size}`);

const key = r => `${r.company_id}|${r.fiscal_year}|${r.metric}`;
const duplicateKeys = data.rows.map(key).filter((x, i, a) => a.indexOf(x) !== i);
add("Unique company-year-metric keys", duplicateKeys.length === 0, `duplicates=${duplicateKeys.slice(0, 5).join("|") || "none"}`);
add("Allowed company IDs", data.rows.every(r => ["MCH","VNM","QNS","KDC"].includes(r.company_id)), `invalid=${data.rows.filter(r => !["MCH","VNM","QNS","KDC"].includes(r.company_id)).length}`);
add("Annual FY period", data.rows.every(r => r.period_type === "FY" && r.months_in_period === "12"), `invalid=${data.rows.filter(r => r.period_type !== "FY" || r.months_in_period !== "12").length}`);
add("Valid fiscal years", data.rows.every(r => /^20\d\d$/.test(r.fiscal_year) && Number(r.fiscal_year) >= 2016 && Number(r.fiscal_year) <= 2025), `invalid=${data.rows.filter(r => !/^20\d\d$/.test(r.fiscal_year) || Number(r.fiscal_year) < 2016 || Number(r.fiscal_year) > 2025).length}`);
add("Allowed metric set", data.rows.every(r => metrics.includes(r.metric)), `invalid=${data.rows.filter(r => !metrics.includes(r.metric)).length}`);
add("Calendar dates align", data.rows.every(r => r.start_date === `${r.fiscal_year}-01-01` && r.end_date === `${r.fiscal_year}-12-31` && r.fiscal_year_end === r.end_date), `invalid=${data.rows.filter(r => r.start_date !== `${r.fiscal_year}-01-01` || r.end_date !== `${r.fiscal_year}-12-31` || r.fiscal_year_end !== r.end_date).length}`);
add("Unit and scale", data.rows.every(r => r.unit === "VND_bn" && r.scale === "bn" && r.currency === "VND"), `invalid=${data.rows.filter(r => r.unit !== "VND_bn" || r.scale !== "bn" || r.currency !== "VND").length}`);

if (mode === "approved") {
  const expectedRows = 30 * metrics.length;
  add("Approved row count", data.rows.length === expectedRows, `rows=${data.rows.length}; expected=${expectedRows}`);
  const groups = new Map();
  for (const r of data.rows) { const g = `${r.company_id}|${r.fiscal_year}`; groups.set(g, (groups.get(g) || 0) + 1); }
  add("Eight metrics per company-year", [...groups.values()].every(n => n === metrics.length) && groups.size === 30, `groups=${groups.size}; bad_groups=${[...groups].filter(([, n]) => n !== metrics.length).length}`);
  add("Approved status", data.rows.every(r => r.review_status === "approved" && ["high","medium"].includes(r.confidence)), `invalid=${data.rows.filter(r => r.review_status !== "approved" || !["high","medium"].includes(r.confidence)).length}`);
  add("No placeholder provenance", data.rows.every(r => r.source_document_id && r.source_document_id !== "PENDING_SOURCE_DOCUMENT" && r.source_url.startsWith("https://") && !r.source_url.includes("PENDING_SOURCE_URL")), `invalid=${data.rows.filter(r => !r.source_document_id || r.source_document_id === "PENDING_SOURCE_DOCUMENT" || !r.source_url.startsWith("https://") || r.source_url.includes("PENDING_SOURCE_URL")).length}`);
  add("Blank-value control", data.rows.every(r => r.value === "" ? r.value_status === "not_available_in_source" && r.null_reason : r.value_status === "reported_value" && Number.isFinite(Number(r.value))), `invalid=${data.rows.filter(r => r.value === "" ? !(r.value_status === "not_available_in_source" && r.null_reason) : !(r.value_status === "reported_value" && Number.isFinite(Number(r.value)))).length}`);
  add("Value tie-out", data.rows.every(r => r.value === "" ? r.value_vnd_bn === "" : Number(r.value) === Number(r.value_vnd_bn)), `invalid=${data.rows.filter(r => r.value !== "" && Number(r.value) !== Number(r.value_vnd_bn)).length}`);
  add("Role mapping", data.rows.every(r => (r.company_id === "VNM" && r.peer_role === "financial_benchmark") || (r.company_id === "QNS" && r.peer_role === "input_cost_benchmark") || (r.company_id === "KDC" && r.peer_role === "strategic_context")), `invalid=${data.rows.filter(r => !((r.company_id === "VNM" && r.peer_role === "financial_benchmark") || (r.company_id === "QNS" && r.peer_role === "input_cost_benchmark") || (r.company_id === "KDC" && r.peer_role === "strategic_context"))).length}`);
  add("Comparability mapping", data.rows.every(r => (r.company_id === "VNM" && r.comparability_status === "comparable") || (["QNS","KDC"].includes(r.company_id) && r.comparability_status === "partially_comparable")), `invalid=${data.rows.filter(r => !((r.company_id === "VNM" && r.comparability_status === "comparable") || (["QNS","KDC"].includes(r.company_id) && r.comparability_status === "partially_comparable"))).length}`);
  add("No CAGR in row-level export", !data.header.includes("revenue_cagr_pct"), "CAGR is calculated only in the summary layer after comparability review");
} else if (mode === "template") {
  add("Template row count", data.rows.length === 10 * metrics.length, `rows=${data.rows.length}; expected=${10 * metrics.length}`);
  add("Template is MCH-only", data.rows.every(r => r.company_id === "MCH" && r.ticker === "MCH"), `invalid=${data.rows.filter(r => r.company_id !== "MCH" || r.ticker !== "MCH").length}`);
  add("Template has every FY/metric", new Set(data.rows.map(r => `${r.fiscal_year}|${r.metric}`)).size === 10 * metrics.length, "expected one row for every FY2016-FY2025 and metric");
  add("Template is blocked by default", data.rows.every(r => r.review_status === "unreviewed" && r.confidence === "blocked" && r.value === ""), `invalid=${data.rows.filter(r => r.review_status !== "unreviewed" || r.confidence !== "blocked" || r.value !== "").length}`);
  add("Template provenance is explicit", data.rows.every(r => r.source_document_id === "PENDING_SOURCE_DOCUMENT" && r.source_url === "PENDING_SOURCE_URL"), `invalid=${data.rows.filter(r => r.source_document_id !== "PENDING_SOURCE_DOCUMENT" || r.source_url !== "PENDING_SOURCE_URL").length}`);
}

const pass = checks.filter(x => x.pass).length, fail = checks.length - pass;
const report = [
  "# Normalized Peer Panel QA Report", "", `Mode: ${mode}`, `Input: ${input}`, "",
  `**Overall status: ${fail === 0 ? "PASS" : "FAIL"}** (${pass}/${checks.length} checks passed)`, "",
  "| Check | Status | Detail |", "|---|---|---|", ...checks.map(c => `| ${c.name} | ${c.pass ? "PASS" : "FAIL"} | ${c.detail} |`), "",
  "## Release rule", "",
  mode === "approved" ? "Only approved rows with explicit provenance may feed a peer benchmark. QNS/KDC comparability flags remain visible; the file does not calculate a CAGR." : "Template rows are intentionally blocked. Replace placeholders only after page-level source and reviewer evidence are captured."
].join("\n") + "\n";
if (output) fs.writeFileSync(output, report, "utf8");
console.log(JSON.stringify({ status: fail === 0 ? "PASS" : "FAIL", mode, rows: data.rows.length, pass, fail }));
if (fail > 0) process.exitCode = 1;
