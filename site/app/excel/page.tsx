'use client';

import { BarChart3, Download, ExternalLink, FileSpreadsheet } from 'lucide-react';
import '../excel-page11.css';

const BASE = '/commercial-finance-profitability-analytics';
const PROJECT_NAME = 'Management Reporting & MBR';
const XLSX_FILE_ID = '1MECC6kxUpYgiDz0bcpnirqFsxbWouNGE';
const PREVIEW_SHEET_ID = '1M3pRiCbc3CNJdjpuzcfiL4kPDVkQA3RsPWIyXNEmF2U';
const workbookUrl = `https://docs.google.com/spreadsheets/d/${XLSX_FILE_ID}/edit`;
const previewUrl = `https://docs.google.com/spreadsheets/d/${PREVIEW_SHEET_ID}/preview?rm=minimal&widget=true&headers=false`;
const previewFullUrl = `https://docs.google.com/spreadsheets/d/${PREVIEW_SHEET_ID}/edit`;
const downloadUrl = `https://drive.google.com/uc?export=download&id=${XLSX_FILE_ID}`;
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
        <a className="report-dashboard-link" href={downloadUrl} target="_blank" rel="noreferrer">
          Download Excel <Download size={14} />
        </a>
      </header>

      <section className="excel-live-filebar" aria-label="Excel workbook controls">
        <div className="excel-live-file">
          <FileSpreadsheet size={22} />
          <span>
            <strong>{PROJECT_NAME}</strong>
            <small>17 sheets · 15 charts</small>
          </span>
        </div>
        <div className="excel-live-actions">
          <a href={previewFullUrl} target="_blank" rel="noreferrer">Open full screen <ExternalLink size={14} /></a>
          <a href={downloadUrl} target="_blank" rel="noreferrer">Download .xlsx <Download size={14} /></a>
        </div>
      </section>

      <section className="excel-live-viewer" aria-label="Management Reporting & MBR workbook preview">
        <iframe
          src={previewUrl}
          title={PROJECT_NAME}
          loading="eager"
          allowFullScreen
        />
      </section>

      <div className="excel-viewer-fallback">
        Web preview uses a chart-preserving Google Sheets conversion of the approved workbook. The original Excel source remains available through <a href={workbookUrl} target="_blank" rel="noreferrer">Drive</a> or <a href={downloadUrl} target="_blank" rel="noreferrer">Download .xlsx</a>. SHA-256 <code>{sha256}</code>.
      </div>
    </main>
  );
}
