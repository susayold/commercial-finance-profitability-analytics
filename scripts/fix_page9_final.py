from pathlib import Path

p = Path('site/app/evidence-page9.tsx')
s = p.read_text(encoding='utf-8')

replacements = [
    (
        'PROXY_DERIVED is a calculated metric that is explicitly proxy-based. Keep the public proxy label and derivation lineage visible until the alias map is promoted.',
        'PROXY_DERIVED is a calculated proxy metric. Its governance alias is already registered; keep the public proxy label and derivation lineage visible.'
    ),
    (
        '<div><span>Power BI</span><Status tone="slate">OUT OF ACTIVE SCOPE</Status></div>',
        ''
    ),
    (
        'The active non-Power-BI FP&amp;A release passes',
        'The active FP&amp;A / Commercial Finance release passes'
    ),
    (
        'Current fixes remain disclosed: +496.1m OPEX bridge, evidence-class normalization, DIO label alignment and fresh link/navigation QA.',
        'The remaining internal open item is the +496.1m OPEX bridge; taxonomy aliases, DIO labels and link/navigation QA are controlled and closed.'
    ),
    (
        ' · Power BI: OUT_OF_ACTIVE_SCOPE',
        ''
    ),
]

for old, new in replacements:
    if old not in s:
        raise SystemExit(f'Missing Page 9 cleanup anchor: {old[:100]}')
    s = s.replace(old, new)

if 'Power BI' in s:
    raise SystemExit('Visible Power BI reference remains on Page 9')
if 'OPEN CONTROL · Add `evidence_class_aliases.csv`' in s:
    raise SystemExit('Stale taxonomy OPEN CONTROL remains on Page 9')
if 'SIMULATED HISTORICAL OOS' in s:
    raise SystemExit('Non-canonical historical backtest label remains on Page 9')

p.write_text(s, encoding='utf-8')
print('Page 9 final cleanup applied')
