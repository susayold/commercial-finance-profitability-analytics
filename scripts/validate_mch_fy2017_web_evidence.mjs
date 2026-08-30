import fs from 'node:fs';

const path = new URL('../data/mch_fy2017_web_index_evidence.csv', import.meta.url);
const text = fs.readFileSync(path, 'utf8').trim();
const lines = text.split(/\r?\n/);
const header = lines.shift().split(',');
const rows = lines.map((line) => {
  const values = line.split(',');
  return Object.fromEntries(header.map((key, index) => [key, values[index]]));
});
const expected = ['net_revenue', 'gross_profit', 'operating_profit', 'profit_before_tax', 'profit_after_tax', 'total_assets', 'equity', 'cfo'];
const sourceUrl = 'https://masanconsumer.com/wp-content/uploads/2024/05/Bao-cao-thuong-nien-nam-2017.pdf';
const errors = [];
if (rows.length !== 8) errors.push(`expected 8 rows, got ${rows.length}`);
if (JSON.stringify(rows.map((row) => row.metric)) !== JSON.stringify(expected)) errors.push('metric order/grain mismatch');
for (const row of rows) {
  if (row.company !== 'Masan Consumer' || row.ticker !== 'MCH' || row.fiscal_year !== '2017') errors.push(`identity mismatch for ${row.metric}`);
  if (row.source_url !== sourceUrl) errors.push(`source URL mismatch for ${row.metric}`);
  if (row.source_status !== 'INDEXED_ONLY' || row.confidence !== 'MEDIUM') errors.push(`boundary mismatch for ${row.metric}`);
  if (!Number.isFinite(Number(row.value_vnd_bn)) || Number(row.value_vnd_bn) <= 0) errors.push(`invalid value for ${row.metric}`);
  if (!/^\d+$/.test(row.pdf_page)) errors.push(`invalid page for ${row.metric}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('MCH FY2017 web-index evidence QA: 8/8 PASS (INDEXED_ONLY boundary retained)');

