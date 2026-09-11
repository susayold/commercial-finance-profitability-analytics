from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = '/commercial-finance-profitability-analytics'


def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text(encoding='utf-8')
    if new in text:
        print(f'Already patched: {path.relative_to(ROOT)}')
        return
    if old not in text:
        raise SystemExit(f'Expected navigation marker not found in {path.relative_to(ROOT)}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8')
    print(f'Patched: {path.relative_to(ROOT)}')


report = ROOT / 'site' / 'app' / 'report-page.tsx'
old_report = '<a href="/commercial-finance-profitability-analytics/dashboard/" target="_blank" rel="noreferrer">Dashboard</a></nav>'
new_report = '<a href="/commercial-finance-profitability-analytics/dashboard/">Dashboard</a><a href="/commercial-finance-profitability-analytics/excel/">Excel</a></nav>'
replace_once(report, old_report, new_report)

dashboard = ROOT / 'site' / 'app' / 'dashboard-page10.tsx'
old_dashboard = '<a className="active" href="#dashboard">Dashboard</a></div><a className="p10-model"'
new_dashboard = '<a className="active" href="#dashboard">Dashboard</a><a href="../excel/">Excel</a></div><a className="p10-model"'
replace_once(dashboard, old_dashboard, new_dashboard)
