# External Gate Readiness — 2026-08-30

**Overall status:** REVIEW-READY / NOT PRODUCTION

This report makes the two external release gates explicit and machine-checkable. It is a governance artifact, not a substitute for the missing evidence.

## Gate A — internal forecast accuracy

**Status:** PENDING_EXTERNAL_INPUT

- Template contract: PASS.
- Fixture contract: PASS.
- Live internal rows present: 0.
- Eligible live rows: 0.
- Minimum required: at least one approved `LIVE_INTERNAL` row created before actual close.
- Required evidence: immutable forecast version, cutoff timestamp, source-model version, approver, actual-availability date and closed actuals tie-out.

The repository may demonstrate mechanics with `DEMO_FIXTURE_ONLY` and public-guidance proxy data, but it must not publish company Bias/WAPE until the live row is approved and eligible.

## Gate B — native Power BI release

**Status:** PENDING_EXTERNAL_DESKTOP

- Portable PBIP source scaffold: present.
- Native `.pbix`: absent.
- Visual evidence captured: 0/18.
- Required evidence: Power BI Desktop refresh, QA-01 through QA-18 execution, visual tie-out to Excel, saved native PBIX and archived screenshots/PDF.

The portable semantic contract and DAX are reviewable design evidence; they do not constitute a native PBIX claim.

## Decision rule

The current allowed claim is:

> Synthetic rehearsal and portable source/QA design are review-ready; external gates remain open.

The machine-readable source is [external_gate_readiness.json](../data/external_gate_readiness.json), validated by [validate_external_gate_readiness.mjs](../scripts/validate_external_gate_readiness.mjs).
