#!/usr/bin/env node
import fs from "node:fs";
const path = new URL("../data/peer_basis_adjustment_feasibility_2026-08-30.csv", import.meta.url);
const raw = fs.readFileSync(path, "utf8").trim();
const lines = raw.split(/\r?\n/);
const header = lines.shift().split(",");
const rows = lines.map(line => {
  const out=[]; let cur=""; let quoted=false;
  for (const ch of line) { if (ch === '"') quoted=!quoted; else if (ch === "," && !quoted) { out.push(cur); cur=""; } else cur+=ch; }
  out.push(cur); return Object.fromEntries(header.map((h,i)=>[h,out[i] ?? ""]));
});
const errors=[];
const ids=new Set();
for (const r of rows) {
  if (ids.has(r.break_id)) errors.push("duplicate break_id: "+r.break_id); ids.add(r.break_id);
  for (const k of ["start_year","end_year","start_revenue_vnd_bn","end_revenue_vnd_bn","observed_delta_pct"]) if (!Number.isFinite(Number(r[k]))) errors.push("non-numeric "+k+" in "+r.break_id);
  const recomputed=(Number(r.end_revenue_vnd_bn)/Number(r.start_revenue_vnd_bn)-1)*100;
  if (Math.abs(recomputed-Number(r.observed_delta_pct))>0.02) errors.push("delta mismatch in "+r.break_id);
  if (r.adjustment_status !== "BLOCKED") errors.push("unexpected status in "+r.break_id);
  if (/organic/i.test(r.adjustment_status)) errors.push("organic status in "+r.break_id);
  if (!r.required_missing_fields.trim()) errors.push("missing-field note empty in "+r.break_id);
  if (!/^https:\/\//.test(r.source_urls)) errors.push("source URL missing in "+r.break_id);
}
if (!rows.some(r=>r.ticker==="QNS"&&r.adjustment_status==="BLOCKED")) errors.push("QNS blocked decision missing");
if (!rows.some(r=>r.ticker==="KDC"&&r.adjustment_status==="BLOCKED")) errors.push("KDC blocked decision missing");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("PASS: "+rows.length+" feasibility rows; 10 controls");
