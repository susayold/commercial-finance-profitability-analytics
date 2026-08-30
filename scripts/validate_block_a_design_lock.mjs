#!/usr/bin/env node
/**
 * Validate the structured Block A approval register.
 *
 * The register is intentionally PROPOSED until the candidate approves it.
 * This validator checks completeness and auditability; it never auto-approves
 * a row and never treats a proposed design as a real-company fact.
 */
import fs from 'node:fs';

const input = process.argv[2] || 'data/block_a_design_lock.csv';
const output = process.argv[3] || null;
const text = fs.readFileSync(input, 'utf8').replace(/^\uFEFF/, '');
const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);

function parseLine(line) {
  const cells = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (ch === ',' && !quoted) {
      cells.push(cell);
      cell = '';
    } else {
      cell += ch;
    }
  }
  cells.push(cell);
  return cells;
}

const headers = parseLine(lines[0]);
const required = ['decision_id', 'decision', 'proposed_design', 'approval_status', 'approved_design', 'approver', 'approved_at', 'change_reason'];
const missingHeaders = required.filter((header) => !headers.includes(header));
if (missingHeaders.length > 0) throw new Error('Missing headers: ' + missingHeaders.join(', '));

const rows = lines.slice(1).map((line) => {
  const values = parseLine(line);
  return Object.fromEntries(headers.map((header, index) => [header, (values[index] || '').trim()]));
});

const checks = [];
checks.push({ name: 'row_count_20', pass: rows.length === 20, detail: 'rows=' + rows.length });
const ids = rows.map((row) => Number(row.decision_id));
checks.push({ name: 'sequential_ids_1_to_20', pass: ids.every((id, index) => id === index + 1), detail: ids.join(',') });
checks.push({ name: 'unique_decision_ids', pass: new Set(ids).size === rows.length, detail: 'unique=' + new Set(ids).size });
checks.push({ name: 'required_text_present', pass: rows.every((row) => row.decision && row.proposed_design), detail: 'decision and proposed_design populated' });

const allowed = new Set(['PROPOSED', 'APPROVED', 'CHANGED', 'REJECTED']);
checks.push({ name: 'allowed_statuses', pass: rows.every((row) => allowed.has(row.approval_status)), detail: Array.from(new Set(rows.map((row) => row.approval_status))).join(',') || 'none' });
checks.push({
  name: 'approved_rows_have_audit_fields',
  pass: rows.filter((row) => row.approval_status !== 'PROPOSED').every((row) => row.approver && row.approved_at && row.approved_design),
  detail: 'non-PROPOSED rows require approver, approved_at and approved_design',
});

const passCount = checks.filter((check) => check.pass).length;
const overallPass = checks.every((check) => check.pass);
const status = rows.every((row) => row.approval_status === 'PROPOSED') ? 'PROPOSED_APPROVAL_PENDING' : 'MIXED_OR_APPROVED';
const summary = 'Block A design lock QA: ' + passCount + '/' + checks.length + ' structural checks PASS; status=' + status + '; rows=' + rows.length;
console.log(summary);
for (const check of checks) console.log((check.pass ? 'PASS ' : 'FAIL ') + check.name + ' — ' + check.detail);

if (output) {
  const markdown = [
    '# Block A Design Lock QA',
    '',
    '- Overall: **' + (overallPass ? 'PASS' : 'FAIL') + '**',
    '- Status: **' + status + '**',
    '- Register rows: **' + rows.length + '**',
    '- Summary: ' + summary,
    '',
    '## Checks',
    '',
    ...checks.map((check) => '- ' + (check.pass ? 'PASS' : 'FAIL') + ' — ' + check.name + ': ' + check.detail),
    '',
    'The validator does not approve decisions and does not turn proposed synthetic design into real-company evidence.',
    '',
  ].join('\n');
  fs.writeFileSync(output, markdown);
}
if (!overallPass) process.exit(1);
