import fs from 'node:fs';

const inputPath = process.argv[2] ?? 'data/mch_finance_analyst_trend_2016_2025.csv';
const outputPath = process.argv[3] ?? null;

function parseCsvLine(line) {
  const cells = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (ch === ',' && !quoted) {
      cells.push(value);
      value = '';
    } else {
      value += ch;
    }
  }
  cells.push(value);
  return cells;
}

function parseCsv(csv) {
  const lines = csv.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  const headers = parseCsvLine(lines.shift());
  return lines.filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

const csv = fs.readFileSync(inputPath, 'utf8');
const rows = parseCsv(csv);
const checks = [];
const check = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail });

const required = [
  'fiscal_year', 'net_revenue_vnd_bn', 'gross_profit_vnd_bn',
  'operating_profit_vnd_bn', 'profit_after_tax_vnd_bn',
  'operating_cash_flow_vnd_bn', 'revenue_yoy_pct', 'pat_yoy_pct',
  'gross_margin_pct', 'operating_margin_pct', 'pat_margin_pct',
  'cfo_to_pat_pct', 'equity_ratio_pct', 'roa_proxy_pct', 'data_quality_note',
];
check('required headers', required.every((header) => Object.hasOwn(rows[0] ?? {}, header)), 'trend schema present');
check('row count', rows.length === 10, `expected 10 rows, got ${rows.length}`);

const years = rows.map((row) => Number(String(row.fiscal_year).replace('FY', '')));
check('contiguous FY2016-FY2025', years.every((year, index) => year === 2016 + index), years.join(', '));
check('unique fiscal years', new Set(years).size === years.length, `unique=${new Set(years).size}`);

const numericFields = required.filter((field) => field !== 'fiscal_year' && field !== 'data_quality_note');
check('numeric fields finite', rows.every((row) => numericFields.every((field) => Number.isFinite(Number(row[field])))), 'all derived values parse as numbers');

const byYear = (year) => rows.find((row) => Number(String(row.fiscal_year).replace('FY', '')) === year);
const fy2016 = byYear(2016);
const fy2017 = byYear(2017);
const fy2024 = byYear(2024);
const fy2025 = byYear(2025);

const close = (actual, expected, tolerance) => Math.abs(Number(actual) - expected) <= tolerance;
check('FY2025 revenue tie-out', close(fy2025?.net_revenue_vnd_bn, 30556.536605941, 0.01), String(fy2025?.net_revenue_vnd_bn));
check('FY2025 PAT tie-out', close(fy2025?.profit_after_tax_vnd_bn, 6764.148714587, 0.01), String(fy2025?.profit_after_tax_vnd_bn));
check('FY2025 CFO tie-out', close(fy2025?.operating_cash_flow_vnd_bn, 2132.330611639, 0.01), String(fy2025?.operating_cash_flow_vnd_bn));
check('FY2025 CFO/PAT recompute', close(fy2025?.cfo_to_pat_pct, Number(fy2025?.operating_cash_flow_vnd_bn) / Number(fy2025?.profit_after_tax_vnd_bn) * 100, 0.05), String(fy2025?.cfo_to_pat_pct));
check('FY2024 CFO/PAT recompute', close(fy2024?.cfo_to_pat_pct, Number(fy2024?.operating_cash_flow_vnd_bn) / Number(fy2024?.profit_after_tax_vnd_bn) * 100, 0.05), String(fy2024?.cfo_to_pat_pct));
const cagr = (Number(fy2025?.net_revenue_vnd_bn) / Number(fy2016?.net_revenue_vnd_bn)) ** (1 / 9) - 1;
check('descriptive revenue CAGR', close(cagr * 100, 9.24, 0.05), `${(cagr * 100).toFixed(2)}%`);
check('FY2017 provenance caveat', /comparative|corresponding/i.test(fy2017?.data_quality_note ?? ''), fy2017?.data_quality_note ?? '');
check('FY2025 margin compression', Number(fy2025?.operating_margin_pct) < Number(fy2024?.operating_margin_pct), `${fy2024?.operating_margin_pct}% -> ${fy2025?.operating_margin_pct}%`);
check('FY2025 PAT decline', Number(fy2025?.pat_yoy_pct) < -10, String(fy2025?.pat_yoy_pct));
check('FY2025 cash-conversion warning', Number(fy2025?.cfo_to_pat_pct) < 60, String(fy2025?.cfo_to_pat_pct));

const passed = checks.filter((item) => item.pass).length;
const lines = [
  '# MCH Credit Memo QA',
  '',
  `Input: ${inputPath}`,
  `**Overall status: ${passed === checks.length ? 'PASS' : 'FAIL'}** (${passed}/${checks.length} checks passed)`,
  '',
  '| Check | Status | Detail |',
  '|---|---|---|',
  ...checks.map((item) => `| ${item.name} | ${item.pass ? 'PASS' : 'FAIL'} | ${item.detail} |`),
  '',
  'The validator checks the approved MCH trend layer used by the credit memo. It does not create a debt-service ratio when gross debt, interest and maturities are unavailable.',
];
const output = lines.join('\n') + '\n';
if (outputPath) fs.writeFileSync(outputPath, output);
console.log(output);
if (passed !== checks.length) process.exitCode = 1;
