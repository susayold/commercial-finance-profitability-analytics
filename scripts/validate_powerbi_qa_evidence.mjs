#!/usr/bin/env node
/** Validate the machine-readable QA-01..QA-18 evidence log contract. */
import fs from "node:fs";

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
    else if (ch === ',') { row.push(field); field = ""; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const header = (rows.shift() || []).map(x => x.trim());
  return rows.filter(r => r.some(x => x !== "")).map(r => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

const [inputPath] = process.argv.slice(2);
if (!inputPath) throw new Error("Usage: node validate_powerbi_qa_evidence.mjs input.csv");
const rows = parseCsv(fs.readFileSync(inputPath, "utf8"));
const required = ["id","test","expected_result","tolerance","observed_value","evidence_reference","reviewer","executed_at","status","owner","remediation","retest_date"];
const checks = [];
const add = (name, pass, detail) => checks.push({name,pass:Boolean(pass),detail});
add("Required headers", required.every(h => Object.keys(rows[0] || {}).includes(h)), "missing=" + required.filter(h => !Object.keys(rows[0] || {}).includes(h)).join("|"));
const ids = rows.map(r => r.id);
const expectedIds = Array.from({length:18}, (_,i) => `QA-${String(i+1).padStart(2,"0")}`);
add("Exactly QA-01 to QA-18", rows.length === 18 && expectedIds.every(id => ids.includes(id)) && new Set(ids).size === 18, "rows=" + rows.length + "; missing=" + expectedIds.filter(id => !ids.includes(id)).join("|"));
const allowed = new Set(["OPEN","PASS","FAIL"]);
add("Allowed statuses", rows.every(r => allowed.has(r.status)), "invalid=" + rows.filter(r => !allowed.has(r.status)).length);
add("PASS evidence complete", rows.filter(r => r.status === "PASS").every(r => r.observed_value && r.evidence_reference && r.reviewer && r.executed_at), "incomplete_pass=" + rows.filter(r => r.status === "PASS" && !(r.observed_value && r.evidence_reference && r.reviewer && r.executed_at)).length);
add("FAIL remediation complete", rows.filter(r => r.status === "FAIL").every(r => r.evidence_reference && r.owner && r.remediation && r.retest_date), "incomplete_fail=" + rows.filter(r => r.status === "FAIL" && !(r.evidence_reference && r.owner && r.remediation && r.retest_date)).length);
add("Scaffold remains open", rows.every(r => r.status === "OPEN"), "non_open_rows=" + rows.filter(r => r.status !== "OPEN").length);
const passed = checks.filter(c => c.pass).length;
console.log(JSON.stringify({status:passed === checks.length ? "PASS" : "FAIL",rows:rows.length,checks:checks.length,passed,details:checks}, null, 2));
if (passed !== checks.length) process.exit(1);
