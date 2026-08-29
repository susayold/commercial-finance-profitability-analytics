#!/usr/bin/env node
import fs from "node:fs";

const [benchmarkPath, queuePath, vnmPath, outputPath] = process.argv.slice(2);
if (!benchmarkPath || !queuePath || !vnmPath || !outputPath) throw new Error("Usage: node validate_peer_evidence.mjs benchmark.csv queue.csv vnm.csv output.md");

function parseCsv(text) {
  const rows = []; let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ""; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift().map(x => x.trim());
  return { header, rows: rows.filter(r => r.some(x => x !== "")).map(r => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()]))) };
}

const checks = [];
const add = (name, pass, detail) => checks.push({ name, pass, detail });
const load = path => parseCsv(fs.readFileSync(path, "utf8"));
const benchmark = load(benchmarkPath), queue = load(queuePath), vnm = load(vnmPath);
const statementMetrics = ["net_revenue_vnd_bn","gross_profit_vnd_bn","operating_profit_vnd_bn","profit_before_tax_vnd_bn","profit_after_tax_vnd_bn","total_assets_vnd_bn","owners_equity_vnd_bn","operating_cash_flow_vnd_bn"];
const benchRequired = ["company","ticker","fiscal_year",...statementMetrics,"source_status","source_layer","revenue_basis","source_document","source_url","page_anchor"];
const queueRequired = ["company","ticker","fiscal_year","source_document","source_layer","review_status","required_metrics","source_url","page_anchor","reported_basis"];
const vnmRequired = ["company","ticker","fiscal_year",...statementMetrics,"source_document","source_url","page_anchor","source_status"];
add("Benchmark headers", benchRequired.every(x => benchmark.header.includes(x)), `missing=${benchRequired.filter(x => !benchmark.header.includes(x)).join("|") || "none"}`);
add("Queue headers", queueRequired.every(x => queue.header.includes(x)), `missing=${queueRequired.filter(x => !queue.header.includes(x)).join("|") || "none"}`);
add("VNM headers", vnmRequired.every(x => vnm.header.includes(x)), `missing=${vnmRequired.filter(x => !vnm.header.includes(x)).join("|") || "none"}`);
add("Benchmark row count", benchmark.rows.length === 30, `rows=${benchmark.rows.length}; expected=30`);
add("Queue row count", queue.rows.length === 25, `rows=${queue.rows.length}; expected=25`);
add("VNM row count", vnm.rows.length === 15, `rows=${vnm.rows.length}; expected=15`);

const keys = rows => rows.map(r => `${r.ticker}|${r.fiscal_year}`);
const duplicated = rows => { const k = keys(rows); return k.filter((x, i) => k.indexOf(x) !== i); };
add("Benchmark unique ticker-years", duplicated(benchmark.rows).length === 0, `duplicates=${duplicated(benchmark.rows).join("|") || "none"}`);
add("Queue unique ticker-years", duplicated(queue.rows).length === 0, `duplicates=${duplicated(queue.rows).join("|") || "none"}`);
add("VNM unique years", duplicated(vnm.rows).length === 0, `duplicates=${duplicated(vnm.rows).join("|") || "none"}`);
const expectedYears = Array.from({ length: 10 }, (_, i) => String(2016 + i));
for (const ticker of ["VNM", "QNS", "KDC"]) {
  const years = benchmark.rows.filter(r => r.ticker === ticker).map(r => r.fiscal_year).sort();
  add(`Benchmark ${ticker} FY2016-FY2025`, JSON.stringify(years) === JSON.stringify(expectedYears), `years=${years.join("|")}`);
}
add("VNM statement FY2006-FY2020", JSON.stringify(vnm.rows.map(r => r.fiscal_year)) === JSON.stringify(Array.from({ length: 15 }, (_, i) => String(2006 + i))), `years=${vnm.rows.map(r => r.fiscal_year).join("|")}`);
add("Benchmark status is approved", benchmark.rows.every(r => r.source_status === "reported_statement_verified" || r.source_status === "reported_summary_verified"), `invalid=${benchmark.rows.filter(r => !["reported_statement_verified","reported_summary_verified"].includes(r.source_status)).length}`);
add("Queue all rows statement-verified", queue.rows.every(r => r.review_status === "reported_statement_verified" && ["official_audited_statement","official_annual_report"].includes(r.source_layer)), `invalid=${queue.rows.filter(r => r.review_status !== "reported_statement_verified" || !["official_audited_statement","official_annual_report"].includes(r.source_layer)).length}`);
add("VNM all rows statement-verified", vnm.rows.every(r => r.source_status === "reported_statement_verified"), `invalid=${vnm.rows.filter(r => r.source_status !== "reported_statement_verified").length}`);
add("Benchmark source evidence", benchmark.rows.every(r => r.source_document && r.source_url.startsWith("https://") && (r.source_layer === "summary" || r.page_anchor)), `invalid=${benchmark.rows.filter(r => !r.source_document || !r.source_url.startsWith("https://") || (r.source_layer !== "summary" && !r.page_anchor)).length}`);
add("Queue source evidence", queue.rows.every(r => r.source_document && r.source_url.startsWith("https://") && r.page_anchor && r.reported_basis), `invalid=${queue.rows.filter(r => !r.source_document || !r.source_url.startsWith("https://") || !r.page_anchor || !r.reported_basis).length}`);
add("VNM source evidence", vnm.rows.every(r => r.source_document && r.source_url.startsWith("https://") && r.page_anchor), `invalid=${vnm.rows.filter(r => !r.source_document || !r.source_url.startsWith("https://") || !r.page_anchor).length}`);
add("Queue required metrics complete", queue.rows.every(r => r.required_metrics.split("|").length === 8), `invalid=${queue.rows.filter(r => r.required_metrics.split("|").length !== 8).length}`);
add("VNM statement metrics populated", vnm.rows.every(r => statementMetrics.every(m => r[m] !== "" && Number.isFinite(Number(r[m])))), `invalid=${vnm.rows.filter(r => statementMetrics.some(m => r[m] === "" || !Number.isFinite(Number(r[m])))).length}`);

const pass = checks.filter(x => x.pass).length, fail = checks.length - pass;
const lines = ["# Peer Evidence QA Report", "", "Run date: 2026-08-30", "", `**Overall status: ${fail === 0 ? "PASS" : "FAIL"}** (${pass}/${checks.length} checks passed)`, "", "| Check | Status | Detail |", "|---|---|---|", ...checks.map(c => `| ${c.name} | ${c.pass ? "PASS" : "FAIL"} | ${c.detail} |`), "", "## Release rule", "", "Only rows that pass this evidence gate may feed the approved peer benchmark or recruiter-facing claims. Review-required candidates remain outside the approved dataset."];
fs.writeFileSync(outputPath, lines.join("\n") + "\n", "utf8");
console.log(JSON.stringify({ status: fail === 0 ? "PASS" : "FAIL", pass, fail, benchmark_rows: benchmark.rows.length, queue_rows: queue.rows.length, vnm_rows: vnm.rows.length }));
