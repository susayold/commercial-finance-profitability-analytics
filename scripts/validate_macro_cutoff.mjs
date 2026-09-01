#!/usr/bin/env node
/** Validate macro-driver metadata and no-look-ahead cutoff discipline. */
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const file = process.argv[2] ?? path.join(root, 'data', 'macros', 'macro_driver_book.csv');
const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
const headers = lines.shift().split(',');
const rows = lines.filter(Boolean).map(line => { const values = line.split(','); return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ''])); });
const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
const checks = [];
const add = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail });
add('rows_present', rows.length >= 6, `rows=${rows.length}`);
add('required_fields', ['driver', 'reference_period', 'publication_date', 'forecast_cutoff', 'source_url', 'evidence_class', 'base_value', 'upside_value', 'downside_value', 'impacted_line', 'owner'].every(h => headers.includes(h)), 'metadata columns');
add('valid_dates', rows.every(row => validDate(row.publication_date) && validDate(row.forecast_cutoff)), 'publication_date and forecast_cutoff');
add('no_public_lookahead', rows.filter(row => row.evidence_class === 'PUBLIC_REFERENCE').every(row => row.publication_date <= row.forecast_cutoff), 'public publication date <= cutoff');
add('source_urls', rows.every(row => /^https?:\/\//.test(row.source_url)), 'source URL present');
add('scenario_values_numeric', rows.every(row => [row.base_value, row.upside_value, row.downside_value].every(value => Number.isFinite(Number(value)))), 'base/upside/downside numeric');
add('scenario_directions', rows.every(row => row.base_value !== '' && row.upside_value !== '' && row.downside_value !== ''), 'scenario values populated');
add('line_mapping', rows.every(row => row.impacted_line && row.owner), 'impacted line and owner');
for (const row of checks) console.log(`${row.pass ? 'PASS' : 'FAIL'} ${row.name} — ${row.detail}`);
const failures = checks.filter(row => !row.pass);
console.log(`Overall status: ${failures.length ? 'FAIL' : 'PASS'} (${checks.length - failures.length}/${checks.length} checks passed)`);
if (failures.length) process.exit(1);
