'use client';

import { BarChart3, Download, ExternalLink, FileSpreadsheet } from 'lucide-react';
import '../excel-page11.css';

const BASE = '/commercial-finance-profitability-analytics';
const fileName = '02_Management_Reporting_MBR_Aberdeen_Style_v5_Charts_Fixed.xlsx';
const DRIVE_FILE_ID = '1MECC6kxUpYgiDz0bcpnirqFsxbWouNGE';
const driveUrl = `https://docs.google.com/spreadsheets/d/${DRIVE_FILE_ID}/edit`;
const drivePreviewUrl = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`;
const driveDownloadUrl = `https://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`;
const sha256 = 'd6a31f6fcf203f9a1cbc0082170fd54892f14bde3c581480884a0fadc5862889';

const reportPages = [
  ['Executive', 'executive'],
  ['Performance', 'performance'],
  ['Commercial', 'commercial'],
  ['Profitability', 'profitability'],
  ['Costing', 'costing'],
  ['Resources', 'resources'],
  ['Cash & WC', 'cash'],
  ['Forecast', 'forecast'],
  ['Evidence', 'evidence'],
] as const;

export default function ExcelShowcasePage() {
  return (
    <main className="excel-live-page" id="excel-model">
      <header className="report-nav excel-live-nav">
        <a className="report-brand" href={`${BASE}/#executive`}>
          <span>VN<span className="report-brand-slash">/</span>FINANCE</span>
          <small>Commercial Finance &amp; FP&amp;A</small>
        </a>
        <span className="report-entity"><BarChart3 size={17} /> VietNova Consumer JSC</span>
        <nav aria-label="Primary navigation">
          {reportPages.map(([label, id]) => <a key={id} href={`${BASE}/#${id}`}>{label}</a>)}
          <a href={`${BASE}/dashboard/`}>Dashboard</a>
          <a className="active" aria-current="page" href={`${BASE}/excel/`}>Excel</a>
        </nav>
        <a className="report-dashboard-link" href={driveDownloadUrl} target="_blank" rel="noreferrer">
          Download latest Excel <Download size={14} />
        </a>
      </header>

      <section className="excel-live-filebar" aria-label="Excel workbook controls">
        <div className="excel-live-file">
          <FileSpreadsheet size={22} />
          <span>
            <strong>Management Reporting &amp; MBR — Aberdeen Style v5</strong>
            <small>{fileName} · 17 sheets · 15 charts · chart QA &amp; legibility fixed</small>
          </span>
        </div>
        <div className="excel-live-actions">
          <a href={driveUrl} target="_blank" rel="noreferrer">Open full screen <ExternalLink size={14} /></a>
          <a href={driveDownloadUrl} target="_blank" rel="noreferrer">Download .xlsx <Download size={14} /></a>
        </div>
      </section>

      <section className="excel-live-viewer" aria-label="Live Excel workbook">
        <iframe
          src={drivePreviewUrl}
          title="Management Reporting MBR Aberdeen Style v5 — Charts Fixed"
          loading="eager"
          allowFullScreen
        />
      </section>

      <div className="excel-viewer-fallback">
        Latest approved workbook · 17 sheets · 15 charts · Aberdeen-style financial-model formatting · chart QA and legibility fixed · SHA-256 <code>{sha256}</code>. If the embedded Drive preview is restricted by your browser, <a href={driveUrl} target="_blank" rel="noreferrer">open the latest workbook directly on Drive</a>.
      </div>
    </main>
  );
}
