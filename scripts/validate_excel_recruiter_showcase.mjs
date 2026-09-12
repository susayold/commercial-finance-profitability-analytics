#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const pagePath = path.join(root, 'site/app/excel/page.tsx');
const reportPath = path.join(root, 'site/app/report-page.tsx');
const dashboardPath = path.join(root, 'site/app/dashboard-page10.tsx');
const mainPath = path.join(root, 'site/github-pages.main.tsx');
const copyPath = path.join(root, 'site/copy-dashboard-entry.mjs');
const homePath = path.join(root, 'site/app/page.tsx');
const readmePath = path.join(root, 'README.md');
const recruiterPath = path.join(root, 'RECRUITER_START_HERE.md');

// Keep the original governed 12-sheet workbook as a controlled repository baseline.
const workbookRel = 'site/public/downloads/VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx';
const workbookPath = path.join(root, workbookRel);
const expectedWorkbookSha256 = 'f37f38bc42500868e0af90e36d71312e29c85502cb0e62d453b4d05a906f8474';
const expectedSheets = ['00_Cover','01_Assumptions','02_Actuals','03_PnL_Variance','04_Commercial','05_Working_Capital','06_Scenario','07_Forecast_Accuracy','08_Costing','09_Controls','10_Skills','11_Change_Log'];

const liveModels = [
  ['Full FP&A Model','19xc_sxYIWHFniwnE5GSiWyQIxby0dOvJ','15oK-aqYic44JOpden_efIYBD2eygn2SjsPCOD23Jymc'],
  ['Management Reporting & MBR','1BAmzlMw2X-1HSqSurrML9iUZr9UcU_sv','14xSRpm4cL6E6ghJTgA0irKjy269PZswUn34knVa6iS8'],
  ['Commercial Profitability','1-PAT64gK5zaY7vkaypv4pV6gIi38FEL3','15wnlIXBMsuYocSjMmlOFAQfx6f-HSKsdLwQnUHVkRsE'],
  ['Working Capital & Liquidity','1zN8m9S3NS__qCU506hWm3BbtTRd1Jo2F','1J1uLgeFY0R-lKOFrGInLTx2I_IZH7rgUywG7cMGas7Y'],
  ['Costing & Variance','1RVZL2LIfEXNQhdHjNRPGSe8fJ0dKEqSa','1mBW_M1QpPhKHvQd_UjwOtLRjTV2TZPlz4a9iIk7_6tY'],
  ['Forecast & Scenario Planning','1J6PQa2jB6PrWLOjlT0t9-5QLV2IZyjRr','1hF2oSLkJD6puiFTy_PDIBfrUuypWZMbUhOOXdYxRYQA'],
];

const failures = [];
const need = (cond, msg) => { if (!cond) failures.push(msg); };
const read = (p) => fs.readFileSync(p, 'utf8');

for (const p of [pagePath, reportPath, dashboardPath, mainPath, copyPath, homePath, readmePath, recruiterPath]) {
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
const report = read(reportPath);
const dashboard = read(dashboardPath);
const main = read(mainPath);
const copy = read(copyPath);
const home = read(homePath);
const readme = read(readmePath);
const recruiter = read(recruiterPath);

for (const [name, driveId, previewId] of liveModels) {
  need(page.includes(name), `Excel library missing model: ${name}`);
  need(page.includes(driveId), `Excel library missing source XLSX Drive ID for: ${name}`);
  need(page.includes(previewId), `Excel library missing chart-preserving preview ID for: ${name}`);
}
need(page.includes('EXCEL FINANCIAL MODEL LIBRARY'), 'Excel page must expose the model-library hierarchy');
need(page.includes('Six controlled workbooks. One integrated finance story.'), 'Excel page library headline mismatch');
need(page.includes('<strong>6</strong>') && page.includes('<strong>99</strong>') && page.includes('<strong>55</strong>'), 'Excel library summary statistics mismatch');
need(page.includes("useState") && page.includes('aria-pressed') && page.includes('setActiveId'), 'Excel page must provide an interactive workbook selector');
need(page.includes('docs.google.com/spreadsheets') && page.includes('/preview') && page.includes('<iframe'), 'Excel page must embed chart-preserving Google Sheets previews');
need(page.includes('Download .xlsx') && page.includes('Open preview') && page.includes('Open source'), 'Excel page must retain preview/source/download controls');
need(page.includes('FLAGSHIP') && page.includes('DEEP DIVE'), 'Excel page must distinguish flagship and specialist models');
need(!page.includes('Aberdeen Style v5') && !page.includes('Charts_Fixed') && !page.includes('chart QA &'), 'Excel page must not expose implementation/version labels');
need(page.includes("aria-current=\"page\"") && page.includes('>Excel</a>'), 'Excel page must show Excel as the active primary-nav tab');
need(!page.includes('ICAEW spreadsheet principles'), 'Excel route should stay recruiter-first, not a long methodology page');
need(report.includes('/commercial-finance-profitability-analytics/excel/') && report.includes('>Excel</a>'), 'Main report navigation does not include Excel');
need(dashboard.includes('../excel/') && dashboard.includes('>Excel</a>'), 'Dashboard navigation does not include Excel');
need(!home.includes('position: \'fixed\'') && !home.includes('FileSpreadsheet'), 'Floating Excel shortcut should remain removed once Excel is in primary navigation');
need(main.includes("path.includes('/excel')") && main.includes('<ExcelShowcasePage />'), 'GitHub Pages router does not serve /excel');
need(copy.includes("['dashboard', 'excel']") && copy.includes("path.join(routeDir, 'index.html')"), 'Static build route loop does not create /excel/index.html');
need(readme.includes('Excel FP&A Model Showcase') && readme.includes(workbookRel), 'README Excel recruiter entrypoint missing');
need(recruiter.includes('Excel proof of skill') && recruiter.includes('12 sheets'), 'Recruiter Start Here baseline guidance missing');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('PASS: Excel route publishes a six-workbook recruiter model library with interactive chart-preserving previews; governed baseline remains controlled');
