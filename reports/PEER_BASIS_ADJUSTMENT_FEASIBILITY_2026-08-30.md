# QNS/KDC Perimeter & Basis-Adjustment Feasibility — 2026-08-30

## Purpose

The existing QNS/KDC bridge correctly segments revenue at documented breaks. This companion ledger answers the next finance-analyst question: **what evidence would be required before an adjusted full-period series could be published?**

It is a feasibility control, not an adjusted financial series. No number below is presented as organic growth.

## Decision

- **QNS:** the older 2016–2019 series is total revenue, while the later series is consolidated net revenue. The observed 2019-to-2020 movement is a line-item-basis discontinuity, not a clean operating decline. Without gross-sales, discount, rebate and return bridges on both sides, no adjustment is supportable.
- **KDC:** the 2016 pre-consolidation anchor and the 2017–2018 Vocarimex/TAC transition are perimeter events. The 2016-to-2017 jump is a reported change in scale, not evidence of organic growth. Removing acquired-entity revenue would require entity-level contribution and consolidation-elimination schedules.
- **Publication rule:** publish within-basis descriptive CAGRs and a break diagnostic; publish a full-period adjusted CAGR only when every adjustment row has source, period, entity scope, sign, reviewer and tie-out to reported revenue.

## Break register

| Ticker | Break | Observed movement | Why it is not an adjustment |
|---|---|---:|---|
| QNS | FY2019 total revenue → FY2020 consolidated net revenue | VND 7,894bn → VND 6,490bn (**-17.79%**) | Gross-to-net deductions and scope bridge are unavailable in the approved evidence layer. |
| KDC | FY2016 pre-consolidation → FY2017 transition | VND 2,239bn → VND 7,016bn (**+213.35%**) | Vocarimex/TAC consolidation and perimeter change dominate the movement. |
| KDC | FY2017 → FY2018 transition/restated basis | VND 7,016bn → VND 7,608.6bn (**+8.45%**) | Transition/restatement context remains; not organic. |
| KDC | FY2020 → FY2025 later portfolio series | VND 8,324bn → VND 9,054.5bn (**+8.78% total; 1.70% CAGR**) | Later portfolio changes remain; reported growth is descriptive only. |

## Required adjustment ledger

Before any normalized CAGR is released, populate one row per entity and period with:

- company and fiscal year;
- entity included/excluded;
- reported revenue line and basis;
- acquired/disposed contribution;
- consolidation eliminations;
- gross-to-net deductions;
- continuing-operations bridge;
- source document and printed page;
- reviewer and review date;
- tie-out: normalized revenue + excluded perimeter + eliminations = reported revenue;
- confidence and unresolved caveat.

A blank adjustment is not zero. It is **unknown** and must keep the adjusted series blocked.

## Feasibility status

| Candidate adjustment | QNS | KDC |
|---|---|---|
| Gross-to-net bridge | Not supportable from current approved layer | Not the primary issue |
| Acquired/disposed entity bridge | No documented event in current bridge | Required for Vocarimex/TAC and later portfolio events |
| Consolidation eliminations | Not available | Required |
| Continuing-operations revenue | Not available | Not available |
| Adjusted full-period CAGR | **BLOCKED** | **BLOCKED** |

## Safe recruiter/interview language

> “I did not force a QNS/KDC full-period CAGR. I segmented the series at the revenue-basis and perimeter breaks, showed the within-basis growth, and documented the exact line-item and entity bridges required before an adjusted series could be published.”

## QA controls

The companion validator checks:

1. every break row has a unique ID;
2. numeric values are parseable;
3. observed delta recomputes from start/end values;
4. adjustment status is from the controlled vocabulary;
5. blocked rows do not claim adjusted CAGR;
6. each row retains at least one source URL;
7. QNS and KDC both have an explicit blocked full-period decision;
8. no row uses the word organic as a status;
9. required-missing-field notes are non-empty where status is blocked;
10. the ledger remains separate from the approved 240-row peer panel.

## Linked evidence

- [Within-basis bridge report](PEER_BASIS_PERIMETER_BRIDGE_2026-08-30.md)
- [Machine-readable bridge](../data/peer_basis_perimeter_bridge_2016_2025.csv)
- [Bridge QA](PEER_BASIS_PERIMETER_BRIDGE_QA.md)
- [Comparability decision memo](PEER_COMPARABILITY_DECISION_2026-08-30.md)
- [Machine-readable feasibility ledger](../data/peer_basis_adjustment_feasibility_2026-08-30.csv)
- [Validator](../scripts/validate_peer_basis_adjustment_feasibility.mjs)

This artifact does not close Gate A or Gate B and does not alter the approved peer panel.
