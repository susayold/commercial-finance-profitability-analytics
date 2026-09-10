#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packPath = path.join(root, 'reports', 'RECRUITER_INTERVIEW_PACK_V1.2.0_2026-09-10.md');
const startPath = path.join(root, 'RECRUITER_START_HERE.md');
const excelPath = path.join(root, 'site', 'public', 'downloads', 'VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx');

const failures = [];
const need = (cond, msg) => { if (!cond) failures.push(msg); };

need(fs.existsSync(packPath), 'Recruiter interview pack missing');
need(fs.existsSync(startPath), 'RECRUITER_START_HERE.md missing');
need(fs.existsSync(excelPath), 'Recruiter Excel workbook missing');

if (fs.existsSync(packPath) && fs.existsSync(startPath)) {
  const pack = fs.readFileSync(packPath, 'utf8');
  const start = fs.readFileSync(startPath, 'utf8');

  for (const marker of [
    '60-second project pitch',
    '3-minute management walkthrough',
    '10-minute technical / financial walkthrough',
    'CV-ready project bullets',
    'Interview Q&A',
    'Claim-safe language',
    'Freeze rule',
  ]) need(pack.includes(marker), `Recruiter pack section missing: ${marker}`);

  for (const metric of ['1.1734%', '1.1554%', '1.1782%']) {
    need(pack.includes(metric), `Recruiter pack forecast metric missing: ${metric}`);
  }

  need(pack.includes('SIMULATED_HISTORICAL_BACKTEST'), 'Recruiter pack must label historical forecast evidence class');
  need(pack.includes('Gate A remains OPEN by design'), 'Recruiter pack must keep live forecast Gate A open');
  need(pack.includes('No live ERP access') && pack.includes('statutory-close ownership') && pack.includes('employer impact'), 'Recruiter pack evidence boundary is incomplete');
  need(pack.includes('FP&A and Commercial Finance') && pack.includes('not positioned as a dedicated M&A or Project Finance project'), 'Recruiter pack role positioning is incomplete');
  need(pack.includes('reconcile → explain → decide → assign → control → reproduce'), 'Recruiter pack operating spine missing');
  need(pack.includes('Do **not** add unrelated modules, Power BI scope, M&A valuation, project-finance debt sculpting'), 'Feature-freeze exclusions missing');

  const packRel = 'reports/RECRUITER_INTERVIEW_PACK_V1.2.0_2026-09-10.md';
  need(start.includes(packRel), 'Recruiter start guide does not link interview pack');
  need(start.includes('60-second pitch') && start.includes('3-minute management walkthrough') && start.includes('10-minute technical / financial walkthrough'), 'Recruiter start guide does not explain interview-pack usage');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('PASS: recruiter interview pack structure, role positioning, forecast evidence boundary and freeze rule');
