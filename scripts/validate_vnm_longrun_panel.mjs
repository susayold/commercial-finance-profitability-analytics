#!/usr/bin/env node
import fs from "node:fs";

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) throw new Error("Usage: node validate_vnm_longrun_panel.mjs input.csv output.md");

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
  return { header, rows: rows.filter(r => r.some(x => x !== "")).map(r => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])))};
}

const { header, rows } = parseCsv(fs.readFileSync(inputPath, "utf8"));
const required = ["company","ticker","fiscal_year","net_revenue_vnd_bn","gross_profit_vnd_bn","operating_profit_vnd_bn","profit_before_tax_vnd_bn","profit_after_tax_vnd_bn","total_assets_vnd_bn","owners_equity_vnd_bn","operating_cash_flow_vnd_bn","source_status","source_layer","source_url","comparability_flag","gross_margin_pct","operating_margin_pct","pbt_margin_pct","pat_margin_pct","cfo_to_pat_pct","asset_turnover","equity_ratio"];
const checks = [];
const add = (name, pass, detail) => checks.push({ name, pass, detail });
const numeric = x => x === "" ? null : Number(x);
const ratio = (a, b) => { const x = numeric(a), y = numeric(b); return x !== null && y !== null && y !== 0 ? x / y : null; };
const close = (actual, expected) => actual === null && expected === null ? true : actual !== null && expected !== null && Math.abs(actual - expected) < 0.000002;

add("Required headers", required.every(x => header.includes(x)), `missing=${required.filter(x => !header.includes(x)).join("|") || "none"}`);
add("Row count", rows.length === 20, `rows=${rows.length}; expected=20`);
const years = rows.map(r => Number(r.fiscal_year));
add("Contiguous FY2006-FY2025", years.every((y, i) => y === 2006 + i), `first=${years[0]}; last=${years[years.length - 1]}`);
const keys = rows.map(r => `${r.ticker}|${r.fiscal_year}`);
add("No duplicate ticker-year", new Set(keys).size === keys.length, `duplicates=${keys.filter((k, i) => keys.indexOf(k) !== i).join("|") || "none"}`);
add("Source URLs present", rows.every(r => r.source_url.startsWith("https://")), `missing=${rows.filter(r => !r.source_url.startsWith("https://")).length}`);
add("Statement layer FY2006-FY2020", rows.filter(r => Number(r.fiscal_year) <= 2020).every(r => r.source_status === "reported_statement_verified" && r.source_layer === "statement"), "all pre-2021 rows must be statement verified");
add("Summary layer FY2021-FY2025", rows.filter(r => Number(r.fiscal_year) >= 2021).every(r => r.source_status === "reported_summary_verified" && r.source_layer === "summary"), "all 2021+ rows must be summary verified");
add("FY2021 basis-break flag", rows.find(r => Number(r.fiscal_year) === 2021)?.comparability_flag === "basis_break_review", "FY2021 is the statement-to-summary boundary");
add("FY2006 restatement note", /restated/i.test(rows.find(r => Number(r.fiscal_year) === 2006)?.comparability_note || ""), "FY2006 must retain restated-comparative caveat");

const ratioFields = [["gross_margin_pct","gross_profit_vnd_bn","net_revenue_vnd_bn"],["operating_margin_pct","operating_profit_vnd_bn","net_revenue_vnd_bn"],["pbt_margin_pct","profit_before_tax_vnd_bn","net_revenue_vnd_bn"],["pat_margin_pct","profit_after_tax_vnd_bn","net_revenue_vnd_bn"],["cfo_to_pat_pct","operating_cash_flow_vnd_bn","profit_after_tax_vnd_bn"],["asset_turnover","net_revenue_vnd_bn","total_assets_vnd_bn"],["equity_ratio","owners_equity_vnd_bn","total_assets_vnd_bn"]];
for (const [field, numerator, denominator] of ratioFields) {
  const bad = rows.filter(r => !close(numeric(r[field]), ratio(r[numerator], r[denominator])));
  add(`Derived ${field}`, bad.length === 0, `mismatches=${bad.map(r => r.fiscal_year).join("|") || "none"}`);
}
const summaryRows = rows.filter(r => Number(r.fiscal_year) >= 2021);
add("Missing values remain blank", summaryRows.every(r => r.gross_profit_vnd_bn === "" && r.operating_cash_flow_vnd_bn === "" && r.gross_margin_pct === "" && r.cfo_to_pat_pct === "" && r.equity_ratio === ""), "summary-only fields are blank, not zero");

const pass = checks.filter(x => x.pass).length, fail = checks.length - pass;
const lines = [
  "# VNM Long-Run Panel QA Report",
  "",
  "Run date: 2026-08-30",
  "",
  `**Overall status: ${fail === 0 ? "PASS" : "FAIL"}** (${pass}/${checks.length} checks passed)`,
  "",
  "| Check | Status | Detail |",
  "|---|---|---|",
  ...checks.map(c => `| ${c.name} | ${c.pass ? "PASS" : "FAIL"} | ${c.detail} |`),
  "",
  "## Interpretation",
  "",
  "The panel intentionally combines statement-verified FY2006–FY2020 with summary-verified FY2021–FY2025. Missing gross profit, operating cash flow and their dependent ratios remain blank; zero is never used as a substitute for unavailable evidence. FY2006 and the FY2021 boundary remain explicit comparability flags.",
  "",
  "## Release rule",
  "",
  "Do not use the panel for cross-window ranking if any check fails or if a reviewer removes the restatement/basis-break caveats."
];
fs.writeFileSync(outputPath, lines.join("\n") + "\n", "utf8");
console.log(JSON.stringify({ status: fail === 0 ? "PASS" : "FAIL", pass, fail, rows: rows.length }));
