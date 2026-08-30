# External Gate Readiness — 2026-08-31

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
- Compact native `.pbix`: observed and archived; its SHA-256 is recorded in `data/external_gate_readiness.json` and the native Desktop QA record.
- Page-render evidence captured: 6/18 required visual QA rows (one capture for each report page).
- Remaining evidence: QA-01 through QA-18 observed values, reviewer/timestamp, visual tie-out to Excel and a separately reviewed extended-scope native PBIX if that scope is promoted.

The portable semantic contract and DAX are reviewable design evidence; the compact binary is observed workflow evidence, while the extended package is still not claimed as a native PBIX.

## Decision rule

The current allowed claim is:

> Synthetic rehearsal, editable source and a compact native PBIX workflow are review-ready; formal QA-01–QA-18 and production gates remain open.

The machine-readable source is [external_gate_readiness.json](../data/external_gate_readiness.json), validated by [validate_external_gate_readiness.mjs](../scripts/validate_external_gate_readiness.mjs).
