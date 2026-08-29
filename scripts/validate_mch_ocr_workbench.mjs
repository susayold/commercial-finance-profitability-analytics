#!/usr/bin/env node
import fs from "node:fs";

const input = process.argv[2] || "data/mch_ocr_review_workbench_template.csv";
const text = fs.readFileSync(input, "utf8");

function parseCsv(value) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < value.length; i += 1) {
    const ch = value[i];
    if (quoted) {
      if (ch === '"' && value[i + 1] === '"') { field += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  const headers = rows.shift() || [];
  return { headers, rows: rows.filter((r) => r.some((v) => v !== "")) };
}

const { headers, rows } = parseCsv(text);
const required = [
  "company_id","ticker","report_year","period_type","scope","metric",
  "metric_original_label","value","comparative_value","unit",
  "reported_or_calculated","source_file","source_page","source_url",
  "extraction_method","confidence","review_status","extraction_timestamp_utc",
  "note","review_decision","corrected_value","reviewer_name","reviewed_at",
  "evidence_reference","reviewer_note"
];
const failures = [];
for (const name of required) if (!headers.includes(name)) failures.push(`missing_header:${name}`);
const index = Object.fromEntries(headers.map((h, i) => [h, i]));
const allowedStatus = new Set(["needs_human_review", "approved", "rejected", "needs_second_review"]);
const allowedDecision = new Set(["approved", "rejected", "needs_second_review"]);
const keys = new Set();
let approved = 0, rejected = 0, open = 0;
for (let n = 0; n < rows.length; n += 1) {
  const r = rows[n];
  const get = (name) => String(r[index[name]] ?? "").trim();
  const rowNo = n + 2;
  const key = [get("report_year"), get("metric"), get("source_file"), get("source_page")].join("|");
  if (keys.has(key)) failures.push(`duplicate_key:row_${rowNo}:${key}`);
  keys.add(key);
  const status = get("review_status");
  const decision = get("review_decision");
  if (!allowedStatus.has(status)) failures.push(`invalid_review_status:row_${rowNo}`);
  if (decision && !allowedDecision.has(decision)) failures.push(`invalid_review_decision:row_${rowNo}`);
  if (decision === "approved") {
    approved += 1;
    for (const name of ["reviewer_name","reviewed_at","evidence_reference"]) if (!get(name)) failures.push(`approved_missing_${name}:row_${rowNo}`);
    if (get("corrected_value") && !Number.isFinite(Number(get("corrected_value")))) failures.push(`non_numeric_correction:row_${rowNo}`);
  } else if (decision === "rejected") {
    rejected += 1;
    for (const name of ["reviewer_name","reviewed_at","evidence_reference","reviewer_note"]) if (!get(name)) failures.push(`rejected_missing_${name}:row_${rowNo}`);
  } else {
    open += 1;
  }
  if (status === "needs_human_review" && decision === "approved") failures.push(`status_decision_conflict:row_${rowNo}`);
}
const result = {
  status: failures.length ? "FAIL" : "PASS",
  input,
  rows: rows.length,
  approved,
  rejected,
  open,
  checks: required.length + 5,
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
