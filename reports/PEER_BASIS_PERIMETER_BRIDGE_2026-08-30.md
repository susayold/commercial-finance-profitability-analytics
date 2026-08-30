# QNS/KDC Basis & Perimeter Bridge — 2016–2025

**Purpose.** Make the remaining optional peer-depth work explicit without manufacturing an adjusted series. This artifact splits each company into internally interpretable revenue windows, calculates descriptive within-window growth, and blocks any full-period CAGR that crosses a line-item or perimeter break.

## Decision

- **QNS:** publish only the 2016–2019 total-revenue window (3.53% descriptive CAGR), the 2020–2025 consolidated net-revenue window (10.26%), and the existing 2021–2025 net-revenue window (9.58%). A naive 2016–2025 splice would be 4.50%, but it is **BLOCKED** because it joins total revenue to net revenue.
- **KDC:** keep a 2016 pre-consolidation anchor, isolate the 2017–2018 Vocarimex/TAC transition (8.45%), show 2018–2020 within-series growth (4.60%) and 2020–2025 later-series growth (1.70%). A naive 2016–2025 splice would be 16.79%, but it is **BLOCKED** because consolidation and later portfolio changes make it non-organic and non-comparable.
- No adjusted revenue is claimed. An adjustment would require line-item bridges for eliminations, acquired/disposed entities and accounting-basis changes.

## Method

1. Start from the approved normalized peer panel and select the net_revenue_vnd_bn rows.
2. Segment the series at documented basis/perimeter breaks.
3. Recompute each descriptive CAGR as (end / start)^(1 / intervals) - 1.
4. Preserve source document IDs and URLs for each segment.
5. Keep the forbidden full-period splice as a diagnostic only so a reviewer can see the size of the potential distortion.

## Segment register

| Company | Window | Revenue basis | Status | CAGR | Use |
|---|---|---|---|---:|---|
| QNS | 2016–2019 | Total revenue | Stable within segment | 3.53% | Descriptive only |
| QNS | 2020–2025 | Net revenue | Consolidated | 10.26% | Descriptive only; basis break before 2020 |
| QNS | 2021–2025 | Net revenue | Later comparable window | 9.58% | Existing bounded peer context |
| KDC | 2016 | Reported revenue | Pre Vocarimex/TAC | n/a | Single-year anchor |
| KDC | 2017–2018 | Reported revenue | Transition/restated | 8.45% | Transition diagnostic only |
| KDC | 2018–2020 | Reported revenue | Post-transition series | 4.60% | Descriptive only |
| KDC | 2020–2025 | Reported revenue | Later portfolio series | 1.70% | Descriptive with caveat |

## Control boundary

The bridge is not a restatement and does not convert QNS total revenue into net revenue or remove KDC acquired-entity revenue. It is a transparent segmentation layer. The approved peer summary remains unchanged, and the CV/site should continue to avoid a single QNS/KDC full-period CAGR.

Machine-readable companion: data/peer_basis_perimeter_bridge_2016_2025.csv.
