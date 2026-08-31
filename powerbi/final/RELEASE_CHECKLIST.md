# Release checklist

- [x] Rebuild deterministic v2 universe at the documented final_v1 grain.
- [x] Correct physical Units (`GrossSalesVND / UnitPriceVND`) before any visual.
- [x] Allocate COGS to authoritative month × channel totals and reconcile.
- [x] Produce dimensions, operating facts, planning facts, public facts and strategic facts.
- [x] Add explicit evidence class to headline facts and visible source-control table.
- [x] Generate 11 primary pages, 4 drillthrough pages and 4 tooltip pages.
- [x] Generate 88 finance-owned measures with folders and formats.
- [x] Generate 34 relationships and remove fact-to-fact dependencies.
- [x] Export `VISUAL_COORDINATES.csv` for geometry review.
- [x] Build and structurally inspect editable PBIT (`30` tables, `88` measures, `34` relationships, `19` pages).
- [ ] Open final PBIT/PBIP in Power BI Desktop, refresh from `pDataRoot`, and capture native QA evidence.
- [ ] Replace synthetic operating inputs with approved internal forecast evidence (Gate A).
- [ ] Validate scheduled refresh/APR and deployment permissions in the target workspace.
