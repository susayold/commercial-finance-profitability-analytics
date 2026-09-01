#!/usr/bin/env node
/** Generate a human-reviewable variance commentary draft from the canonical snapshot. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const input = path.join(ROOT, 'data', 'monthly_business_review_kpi_pack_2026-08-30.csv');
const DATA = path.join(ROOT, 'data', 'governance');
const REPORTS = path.join(ROOT, 'reports');
const lines = fs.readFileSync(input, 'utf8').trim().split(/\r?\n/);
const headers = lines.shift().split(',');
const rows = lines.map(line => Object.fromEntries(headers.map((header, i) => [header, line.split(',')[i] ?? ''])));
const metrics = ['revenue', 'ebitda_proxy', 'ebitda_proxy_margin', 'ccc'];
const labels = { revenue: 'Revenue', ebitda_proxy: 'EBITDA proxy', ebitda_proxy_margin: 'EBITDA proxy margin', ccc: 'Cash conversion cycle' };
const unit = { revenue: 'VND bn', ebitda_proxy: 'VND bn', ebitda_proxy_margin: '%', ccc: 'days' };
const grouped = metrics.map(metric => {
  const entries = rows.filter(row => row.metric === metric);
  const values = Object.fromEntries(entries.map(row => [row.scenario.toLowerCase(), Number(row.value)]));
  const base = values.base; const upside = values.upside; const downside = values.downside;
  const delta = base - downside;
  const draft = `${labels[metric]} base is ${base.toFixed(1)} ${unit[metric]}; the approved scenario envelope spans ${downside.toFixed(1)} to ${upside.toFixed(1)} ${unit[metric]}. The downside gap versus base is ${delta.toFixed(1)} ${unit[metric]}. Review the underlying volume; mix; price; cost and working-capital assumptions before issuing management commentary.`;
  return { metric, label: labels[metric], base_value: base, upside_value: upside, downside_value: downside, downside_gap: delta, unit: unit[metric], evidence_class: entries[0]?.evidence_class || 'PROXY_DERIVED', review_status: 'NEEDS_REVIEW', draft_commentary: draft };
});
const esc = value => { const text = String(value ?? ''); return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; };
const csvHeaders = ['metric', 'label', 'base_value', 'upside_value', 'downside_value', 'downside_gap', 'unit', 'evidence_class', 'review_status', 'draft_commentary'];
fs.mkdirSync(DATA, { recursive: true });
fs.writeFileSync(path.join(DATA, 'commentary_draft_2026-09-02.csv'), [csvHeaders.join(','), ...grouped.map(row => csvHeaders.map(header => esc(row[header])).join(','))].join('\n') + '\n', 'utf8');
const draftText = `# Monthly Commentary Draft — VietNova FP&A\n\n**Status:** GENERATED — HUMAN REVIEW REQUIRED  \n**Source:** data/monthly_business_review_kpi_pack_2026-08-30.csv  \n**Evidence boundary:** synthetic / proxy-derived scenario snapshot\n\nThis file is an auditable first draft for a monthly business review. It deliberately uses bounded language and does not infer causality from scenario deltas. A finance owner must confirm the period, source mapping, drivers and action owners before distribution.\n\n## Draft commentary\n\n${grouped.map(row => `### ${row.label}\n\n- Base: **${row.base_value.toFixed(1)} ${row.unit}**; upside: **${row.upside_value.toFixed(1)} ${row.unit}**; downside: **${row.downside_value.toFixed(1)} ${row.unit}**.\n- Draft: ${row.draft_commentary}\n- Review status: **NEEDS_REVIEW**\n`).join('\n')}\n## Reviewer checklist\n\n- [ ] Confirm approved budget / forecast version and reporting period.\n- [ ] Confirm P&L, balance-sheet, cash-flow and subledger tie-outs are PASS.\n- [ ] Replace generic driver prompts with evidence-backed volume, price/mix, cost and working-capital drivers.\n- [ ] Add owner, action, target date and expected financial impact.\n- [ ] Record human approval in the companion approval log; automation cannot approve commentary.\n\n## Prohibited claims\n\nDo not state that a scenario movement was caused by a driver unless the approved source ledger and bridge support that conclusion. Do not call the output a live forecast or employer-impact result.\n`;
fs.mkdirSync(REPORTS, { recursive: true });
fs.writeFileSync(path.join(REPORTS, 'MONTHLY_COMMENTARY_DRAFT_2026-09-02.md'), draftText, 'utf8');
const hash = crypto.createHash('sha256').update(draftText).digest('hex');
const approval = 'artifact,generated_file,generated_sha256,approval_status,reviewer,approved_at,notes\nMONTHLY_COMMENTARY,MONTHLY_COMMENTARY_DRAFT_2026-09-02.md,' + hash + ',NEEDS_REVIEW,,,Human approval required before distribution\n';
fs.writeFileSync(path.join(REPORTS, 'MONTHLY_COMMENTARY_APPROVAL_LOG_2026-09-02.csv'), approval, 'utf8');
console.log(JSON.stringify({ status: 'PASS', metrics: grouped.length, approval_status: 'NEEDS_REVIEW', sha256: hash }, null, 2));
