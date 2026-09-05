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
    'commercial': {'source_page': 'Page 3', 'source_file': 'site/data/generated/page3-commercial.json'},
    'cash': {'source_page': 'Page 7', 'source_file': 'site/data/generated/page7-cash-wc.json', 'evidence_class': 'PROXY_DERIVED'},
    'plan': {'source_page': 'Page 8', 'source_file': 'site/data/generated/page8-forecast.json', 'evidence_class': 'SIMULATED/DERIVED'},
    'controls': {'source_page': 'Page 9', 'source_file': 'site/data/generated/page9-evidence.json'}
}
page10['cashRoute'] = '#cash'
(root / 'site/data/generated/page10-dashboard.json').write_text(json.dumps(page10, indent=2) + '\n', encoding='utf-8')
print('Updated page10-dashboard.json from Page 8 contract')
