# Power BI final build QA

**Status:** `PASS`

| ID | Check | Result | Evidence |
|---|---|---|---|
| QA-X09 | Every semantic table has a source file | **PASS** | tables=30 |
| QA-X10 | Every visual field resolves to model metadata | **PASS** | 192 visuals resolved |
| QA-X11 | Visual names are unique per page | **PASS** | no duplicates |
| QA-X12 | All visuals stay inside the declared canvas | **PASS** | 1672 × 941 geometry |
| QA-X13 | Relationship endpoints resolve | **PASS** | relationships=34 |
| QA-X14 | PBIP report pages use reference canvas | **PASS** | pages=19 |
| QA-X15 | PBIT container model/layout topology matches PBIP | **PASS** | UTF-16LE DataModelSchema + Report/Layout |
