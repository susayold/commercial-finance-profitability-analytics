# Correlated Monte Carlo Risk Overlay v2 — VietNova FP&A

**Status:** COMPLETE AS SIMULATED APPENDIX  
**Simulation:** 5,000 deterministic draws, seed 20260902  
**Scope:** Non-Power-BI FP&A risk overlay; no live forecast accuracy claim

## Purpose

This appendix upgrades the archived independent v1 overlay with an explicit correlation matrix, deterministic Cholesky sampling, expected-shortfall measures and directional downside-driver attribution. The output is a rehearsal for communicating uncertainty around the driver-based forecast; it is not a probability-calibrated production risk model.

## Model assumptions

| Driver | Treatment | Evidence boundary |
|---|---|---|
| Revenue shock | Correlated normal shock around VND 82.5138bn | Synthetic assumption |
| Margin shock | Correlated normal shock around 15.6284%, reduced by cost inflation | Synthetic assumption |
| CCC shock | Correlated normal shock around 54 days, with cost-inflation overlay | Synthetic assumption |
| Cost inflation shock | Correlated normal shock; affects margin and CCC | Synthetic assumption |

The matrix is documented in data/monte_carlo_correlation_matrix_v2.csv. It is positive definite for this deterministic build, but it is not estimated from approved history.

## Watch thresholds and output

- Revenue watch threshold: **VND 76.9bn** (below).
- EBITDA-proxy watch threshold: **VND 9.0bn** (below).
- EBITDA-margin watch threshold: **12.0%** (below).
- CCC watch threshold: **68.0 days** (above).
- Joint watch: revenue < 76.9bn, EBITDA proxy < 9.0bn and CCC > 68.0 days.
- P05/P50/P95, breach probability and worst-5% expected-shortfall gap are stored in the summary CSV.

Illustrative distribution checks: EBITDA proxy P05 = **9.5820bn**, revenue P05 = **77.4637bn**, CCC P95 = **66.7831 days**, and joint watch probability = **0.08%**.

## Finance interpretation

1. Correlation makes the tail more decision-relevant than four independent toy distributions because revenue, margin, working capital and input-cost pressure can move together.
2. Expected shortfall answers “how bad is the adverse tail when a guardrail is breached?”; it does not forecast an accounting result.
3. Attribution shares identify which normalized adverse components dominate the joint tail. They are directional diagnostics, not causal proof.

## Decision rules

- Keep the base plan while all core KPIs remain inside guardrails.
- Trigger a management review when any breach probability or realized monthly indicator crosses the agreed threshold.
- Escalate working-capital actions when CCC stretch and revenue shortfall appear in the same scenario.
- Re-estimate the matrix from approved forecast errors and actual operating history before production use.

## Limitations and handoff

- VietNova inputs are deterministic synthetic data; correlation parameters are judgmental assumptions.
- No Monte Carlo output closes Gate A. An approved internal pre-close forecast and post-close actuals are still required for live Bias/WAPE.
- The v1 independent overlay remains archived for reproducibility; v2 is the recommended appendix for interviews.

### Files

- data/monte_carlo_risk_overlay_v2_2026-09-02.csv — summary statistics, breach probabilities, expected shortfall and attribution.
- data/monte_carlo_risk_overlay_v2_draws_2026-09-02.csv — 5,000 draw-level outputs.
- data/monte_carlo_correlation_matrix_v2.csv — documented driver matrix.
- scripts/build_correlated_monte_carlo_v2.mjs — deterministic builder.
