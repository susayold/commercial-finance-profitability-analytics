#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(root, 'site/app/excel/page.tsx');
const mainPath = path.join(root, 'site/github-pages.main.tsx');
const copyPath = path.join(root, 'site/copy-dashboard-entry.mjs');
const homePath = path.join(root, 'site/app/page.tsx');
const readmePath = path.join(root, 'README.md');
const recruiterPath = path.join(root, 'RECRUITER_START_HERE.md');
const workbookRel = 'site/public/downloads/VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx';
const workbookPath = path.join(root, workbookRel);

const failures = [];
const need = (cond, msg) => { if (!cond) failures.push(msg); };
const read = (p) => fs.readFileSync(p, 'utf8');

for (const p of [pagePath, mainPath, copyPath, homePath, readmePath, recruiterPath]) {
  need(fs.existsSync(p), `Missing required file: ${path.relative(root, p)}`);
}
need(fs.existsSync(workbookPath), `Missing workbook: ${workbookRel}`);
if (fs.existsSync(workbookPath)) {
  const stat = fs.statSync(workbookPath);
  need(stat.size > 20000, `Workbook is unexpectedly small: ${stat.size} bytes`);
  const sig = fs.readFileSync(workbookPath).subarray(0, 4).toString('hex');
  need(sig === '504b0304', `Workbook is not a valid ZIP/XLSX container signature: ${sig}`);
}

const page = read(pagePath);
const main = read(mainPath);
const copy = read(copyPath);
const home = read(homePath);
const readme = read(readmePath);
const recruiter = read(recruiterPath);

need(page.includes('VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx'), 'Excel page workbook filename mismatch');
need(page.includes('12 sheets'), 'Excel page must disclose 12-sheet architecture');
need(page.includes('SUMIFS') && page.includes('INDEX + MATCH'), 'Excel page must surface core Excel functions');
need(page.includes('SIMULATED_HISTORICAL_BACKTEST') && page.includes('OPEN by design'), 'Excel page evidence boundary is incomplete');
need(page.includes('ICAEW spreadsheet principles') && page.includes('CFI model documentation'), 'Excel modelling standards references missing');
need(page.includes('82.514') && page.includes('12.896') && page.includes('54 days'), 'Excel page controlled Base scenario snapshot missing');
need(page.includes('1.1734%') && page.includes('1.1554%') && page.includes('1.1782%'), 'Excel page historical OOS metrics mismatch');
need(main.includes("path.includes('/excel')") && main.includes('<ExcelShowcasePage />'), 'GitHub Pages router does not serve /excel');
need(copy.includes("'docs', 'excel'") && copy.includes('excel/index.html'), 'Static build does not create /excel/index.html');
need(home.includes('/excel/') && home.includes('Excel Model'), 'Main recruiter page has no Excel showcase entrypoint');
need(readme.includes('Excel FP&A Model Showcase') && readme.includes(workbookRel), 'README Excel recruiter entrypoint missing');
need(recruiter.includes('Excel proof of skill') && recruiter.includes('12 sheets'), 'Recruiter Start Here Excel guidance missing');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('PASS: recruiter Excel showcase route, workbook, content and evidence boundary');
