#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const pagePath = path.join(root, 'site/app/excel/page.tsx');
const mainPath = path.join(root, 'site/github-pages.main.tsx');
const copyPath = path.join(root, 'site/copy-dashboard-entry.mjs');
const homePath = path.join(root, 'site/app/page.tsx');
const readmePath = path.join(root, 'README.md');
const recruiterPath = path.join(root, 'RECRUITER_START_HERE.md');
const workbookRel = 'site/public/downloads/VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx';
const workbookPath = path.join(root, workbookRel);
const expectedWorkbookSha256 = 'f37f38bc42500868e0af90e36d71312e29c85502cb0e62d453b4d05a906f8474';
const expectedSheets = ['00_Cover','01_Assumptions','02_Actuals','03_PnL_Variance','04_Commercial','05_Working_Capital','06_Scenario','07_Forecast_Accuracy','08_Costing','09_Controls','10_Skills','11_Change_Log'];

const failures = [];
const need = (cond, msg) => { if (!cond) failures.push(msg); };
const read = (p) => fs.readFileSync(p, 'utf8');

for (const p of [pagePath, mainPath, copyPath, homePath, readmePath, recruiterPath]) {
  need(fs.existsSync(p), `Missing required file: ${path.relative(root, p)}`);
}
need(fs.existsSync(workbookPath), `Missing workbook: ${workbookRel}`);
if (fs.existsSync(workbookPath)) {
  const buf = fs.readFileSync(workbookPath);
  const stat = fs.statSync(workbookPath);
  need(stat.size === 56805, `Workbook size mismatch: ${stat.size} bytes`);
  need(buf.subarray(0, 4).toString('hex') === '504b0304', 'Workbook is not a valid ZIP/XLSX container');
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  need(hash === expectedWorkbookSha256, `Workbook SHA-256 mismatch: ${hash}`);

  const py = `import sys,zipfile,xml.etree.ElementTree as ET\np=sys.argv[1]\nns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}\nwith zipfile.ZipFile(p) as z:\n r=ET.fromstring(z.read('xl/workbook.xml'))\n print('\\n'.join(x.attrib['name'] for x in r.findall('.//m:sheets/m:sheet',ns)))`;
  let probe = spawnSync('python', ['-c', py, workbookPath], { encoding: 'utf8' });
  if (probe.error || probe.status !== 0) probe = spawnSync('python3', ['-c', py, workbookPath], { encoding: 'utf8' });
  need(!probe.error && probe.status === 0, `Could not inspect workbook sheet structure: ${probe.stderr || probe.error || 'unknown error'}`);
  if (!probe.error && probe.status === 0) {
    const sheets = probe.stdout.trim().split(/\r?\n/).filter(Boolean);
    need(JSON.stringify(sheets) === JSON.stringify(expectedSheets), `Workbook sheet list mismatch: ${JSON.stringify(sheets)}`);
  }
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
need(copy.includes("['dashboard', 'excel']") && copy.includes("path.join(routeDir, 'index.html')"), 'Static build route loop does not create /excel/index.html');
need(home.includes('/excel/') && home.includes('Excel Model'), 'Main recruiter page has no Excel showcase entrypoint');
need(readme.includes('Excel FP&A Model Showcase') && readme.includes(workbookRel), 'README Excel recruiter entrypoint missing');
need(recruiter.includes('Excel proof of skill') && recruiter.includes('12 sheets'), 'Recruiter Start Here Excel guidance missing');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('PASS: recruiter Excel showcase route, workbook binary, 12-sheet structure, content and evidence boundary');
