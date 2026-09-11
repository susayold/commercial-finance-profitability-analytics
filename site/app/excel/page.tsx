'use client';

import { BarChart3, Download, ExternalLink, FileSpreadsheet } from 'lucide-react';
import '../excel-page11.css';

const BASE = '/commercial-finance-profitability-analytics';
const fileName = 'VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx';
const workbookUrl = `${BASE}/downloads/${fileName}`;
const publicWorkbookUrl = `https://susayold.github.io${workbookUrl}`;
const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publicWorkbookUrl)}`;

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
        <a className="report-dashboard-link" href={workbookUrl} download>
          Download Excel <Download size={14} />
        </a>
      </header>

      <section className="excel-live-filebar" aria-label="Excel workbook controls">
        <div className="excel-live-file">
          <FileSpreadsheet size={22} />
          <span><strong>{fileName}</strong><small>12-sheet FP&amp;A / Commercial Finance workbook</small></span>
        </div>
        <div className="excel-live-actions">
          <a href={officeViewerUrl} target="_blank" rel="noreferrer">Open full screen <ExternalLink size={14} /></a>
          <a href={workbookUrl} download>Download .xlsx <Download size={14} /></a>
        </div>
      </section>

      <section className="excel-live-viewer" aria-label="Live Excel workbook">
        <iframe
          src={officeViewerUrl}
          title="VietNova FP&A Excel workbook viewer"
          loading="eager"
          allowFullScreen
        />
      </section>
    </main>
  );
}
