# Finance QA Workflow Rehearsal — 2026-08-30

The commands in `.github/workflows/finance-qa.yml` were rehearsed against the current remote files before relying on the workflow as a release control.

| Check | Result |
|---|---|
| Forecast accuracy fixture | PASS — 4 input rows, 3 eligible, 1 `FUTURE_LEAKAGE`; output exactly matched expected CSV |
| VNM long-run panel validator | PASS — 17/17 checks, 20 rows FY2006–FY2025 |
| Peer evidence validator | PASS — 21/21 checks; benchmark 30 rows, queue 25 rows, VNM statement layer 15 rows |
| Power BI model contract JSON | PASS — 5 dimensions, 9 facts, 6 pages, 14 relationships |
| Local staging cleanup | PASS — `work/` empty after rehearsal |

This is a reproducibility rehearsal, not evidence of observed forecast performance. The forecast fixture remains synthetic until genuine frozen snapshots are supplied.

