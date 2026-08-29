# Finance QA Workflow Rehearsal — 2026-08-30

The commands in `.github/workflows/finance-qa.yml` were rehearsed against the current remote files before relying on the workflow as a release control.

| Check | Result |
|---|---|
| Forecast accuracy fixture | PASS — 4 input rows, 3 eligible, 1 `FUTURE_LEAKAGE`; output exactly matched expected CSV |
| VNM long-run panel validator | PASS — 17/17 checks, 20 rows FY2006–FY2025 |
| Peer evidence validator | PASS — 21/21 checks; benchmark 30 rows, queue 25 rows, VNM statement layer 15 rows |
| Power BI model contract JSON | PASS — 5 dimensions, 9 facts, 6 pages, 15 relationships |
| PBIP source manifest | PASS — 5 dimensions, 9 facts, 15 relationships, 6 pages, 18 QA definitions |
| M&A accretion/dilution validator | PASS — 10 checks; base Year-2 accretion 17.16%, NPV VND 28.39bn |
| D2C unit economics validator | PASS — 35 rows, 3 scenarios, 10 checks |
| VNM public-guidance proxy + analysis | PASS — 16 observations; Bias -2.63%, WAPE 3.14%; not Gate-A eligible |
| Role-alignment matrix validator | PASS — 12 hiring-signal rows across three target role families |
| Promotion ROI validator | PASS — 8 events; four negative-CM stop-loss events; hurdle decisions recalculate |
| Fixed-budget reallocation validator | PASS — old/new total both VND 4.35bn; capacity and max-increase caps pass |
| Cross-platform finance QA runner | PASS — 12 repository-local checks; transient reports removed from OS temp directory |
| Local staging cleanup | PASS — `work/` empty after rehearsal |

This is a reproducibility rehearsal, not evidence of observed forecast performance. The forecast fixture remains synthetic until genuine frozen snapshots are supplied.

