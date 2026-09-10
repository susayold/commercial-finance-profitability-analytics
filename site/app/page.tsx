import { FileSpreadsheet } from 'lucide-react';
import ReportPage from './report-page';

const BASE = '/commercial-finance-profitability-analytics';

export default function Home() {
  return <>
    <ReportPage />
    <a
      href={`${BASE}/excel/`}
      aria-label="Open Excel FP&A model showcase"
      style={{
        position: 'fixed', right: 18, bottom: 18, zIndex: 80,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '11px 15px', borderRadius: 999,
        background: '#0b2f4f', color: '#fff', textDecoration: 'none',
        fontSize: 13, fontWeight: 800,
        boxShadow: '0 10px 28px rgba(11,47,79,.25)',
        border: '1px solid rgba(255,255,255,.18)'
      }}
    ><FileSpreadsheet size={16} /> Excel Model</a>
  </>;
}
