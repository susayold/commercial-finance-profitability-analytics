# QNS/KDC Basis-Adjustment Feasibility QA — 2026-08-30

**Overall status: PASS** (10/10 controls passed)

## Scope

Validated `data/peer_basis_adjustment_feasibility_2026-08-30.csv` with `scripts/validate_peer_basis_adjustment_feasibility.mjs`.

## Results

- 4 break-register rows parsed.
- Unique break IDs: PASS.
- Numeric start/end values and observed deltas: PASS.
- Delta recomputation tolerance (±0.02 percentage points): PASS.
- Controlled adjustment status vocabulary: PASS.
- Explicit missing-field notes for blocked adjustments: PASS.
- Source URL presence: PASS.
- QNS blocked decision present: PASS.
- KDC blocked decision present: PASS.
- No row labels an adjustment status as organic; caveats may explicitly state that reported growth is **not** organic: PASS.
- Ledger remains a separate feasibility layer and does not modify the approved 240-row peer panel: PASS.

## Interpretation

The artifact closes the optional **feasibility** step, not the adjustment itself. QNS and KDC full-period adjusted CAGRs remain blocked until entity-level, gross-to-net and consolidation bridges are sourced and tied to reported revenue.

Evidence class: DERIVED / CONTROLLED; no new reported financial value is introduced.
