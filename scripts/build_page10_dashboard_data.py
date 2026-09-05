import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
page10 = json.loads((root / 'site/data/generated/page10-dashboard.json').read_text(encoding='utf-8'))
page8 = json.loads((root / 'site/data/generated/page8-forecast.json').read_text(encoding='utf-8'))
page10['plan'] = [
    {'year': r['year'], 'scenario': r['scenario'], 'revenue': round(r['revenue'], 4), 'ebitda': round(r['ebitda'], 4), 'cash': None, 'cashStatus': r['cashStatus']}
    for r in page8['longRangeOutlook'] if r['scenario'] == 'BASE'
]
page10['planStatus'] = page8['liquidity']
page10['sources'] = {
    'base': {'source_page': 'Page 2', 'source_file': 'data/governance/recruiter_metric_snapshot.json', 'evidence_class': 'PROXY_DERIVED'},
    'performanceTrend': {'source_page': 'Page 2', 'source_file': 'site/data/generated/page2-performance.json'},
    'commercial': {'source_page': 'Page 3', 'source_file': 'site/data/generated/page3-commercial.json'},
    'profitability': {'source_page': 'Page 4', 'source_file': 'site/data/generated/page4-profitability.json'},
    'costing': {'source_page': 'Page 5', 'source_file': 'site/data/generated/page5-costing.json'},
    'resources': {'source_page': 'Page 6', 'source_file': 'site/data/generated/page6-resources.json'},
    'cash': {'source_page': 'Page 7', 'source_file': 'site/data/generated/page7-cash-wc.json', 'evidence_class': 'PROXY_DERIVED'},
    'plan': {'source_page': 'Page 8', 'source_file': 'site/data/generated/page8-forecast.json', 'evidence_class': 'SIMULATED/DERIVED'},
    'controls': {'source_page': 'Page 9', 'source_file': 'site/data/generated/page9-evidence.json'},
    'actions': {'source_page': 'Recommendation register', 'source_file': 'data/management_recommendation_register_2026-08-30.csv'}
}
page10['actions'] = [
    {'id':'REC-04','priority':1,'decision':'Collect overdue accounts','owner':'AR lead','guardrail':'DSO <= Base + 5d','review':'Weekly cash call','route':'#cash'},
    {'id':'REC-05','priority':2,'decision':'Reduce slow-SKU inventory','owner':'Supply-chain finance','guardrail':'Service level >= 95%','review':'Weekly S&OP','route':'#cash'},
    {'id':'REC-01','priority':3,'decision':'Reallocate promotion budget','owner':'Commercial finance','guardrail':'ROI >= 25%; CM% >= 25%','review':'Next monthly close','route':'#commercial'},
    {'id':'REC-06','priority':4,'decision':'Gate Upside case','owner':'FP&A lead','guardrail':'Two closes above hurdle','review':'Forecast cycle','route':'#forecast'},
    {'id':'REC-11','priority':5,'decision':'Capture frozen forecast snapshot','owner':'FP&A lead','guardrail':'Approver version dates present','review':'Before next close','route':'#evidence'}
]
page10['cashRoute'] = '#cash'
(root / 'site/data/generated/page10-dashboard.json').write_text(json.dumps(page10, indent=2) + '\n', encoding='utf-8')
print('Updated page10-dashboard.json from Page 8 contract')
