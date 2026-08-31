# Power BI final release index — 2026-08-31

## One-click review

- GitHub commit: https://github.com/susayold/commercial-finance-profitability-analytics/commit/2895f925aeccf64084107bada85dce9cf6e9353b
- PBIP source: https://github.com/susayold/commercial-finance-profitability-analytics/tree/main/powerbi/final/VNFinance_Commercial_Finance_FINAL
- PBIT template: https://drive.google.com/file/d/1qCGpBNX65h82LhnQlAvjfH94bVT2dUJH/view?usp=drivesdk
- Full source/data/code archive: https://drive.google.com/file/d/1hr7u-S_BiGf0mRFdF_IXMIZ9WnDHk_cc/view?usp=drivesdk
- Build QA: https://drive.google.com/file/d/1WjRiHKj2a0c5ELJmmtEghfnlkSikeXZA/view?usp=drivesdk
- Data QA: https://drive.google.com/file/d/1VRr1ZJkwWi98lUizE3UN8U4TVNt9KdeX/view?usp=drivesdk

## Scope delivered

- 30 semantic tables, 88 explicit finance measures, 34 relationships.
- 11 primary pages, 4 hidden drillthrough pages and 4 tooltip pages.
- 192 visuals on a 1,672 × 941 canvas, with reference screenshots retained in `powerbi/final/references/`.
- 36 monthly periods, 2,160 corrected invoice lines, 6,480 forecast rows, separate public-company and strategic subject areas.
- Units/price identity, gross-to-net, COGS authority, product/customer/channel ties, contribution identity and evidence coverage: PASS.

## Review boundary

This is a real editable `.pbit` plus PBIP source, not a fabricated native `.pbix`. Open it in Power BI Desktop, set `pDataRoot` to a controlled copy of `powerbi/data/final_v1`, refresh, and complete native visual/interactivity QA. VietNova operating data is synthetic/derived; public figures are separate observed evidence; valuation is EV-only and not a price target. Gate A internal forecast evidence and production refresh/APR remain open.
