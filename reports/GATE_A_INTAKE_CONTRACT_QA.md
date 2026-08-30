# Gate A Intake Contract QA

Date: 2026-08-30

**Overall status: PASS**

The full Gate A intake contract is present and the deterministic unit fixture passes in fixture mode. The contract adds immutable snapshot identity, forecast cutoff, close and actual-availability timestamps, approver evidence, source export URIs, mapping note, SHA-256 and an explicit gate_a_eligible decision.

- Template mode: accepts the empty intake template and prevents accidental release.
- Fixture mode: accepts only SIMULATED/DEMO_FIXTURE_ONLY rows and returns FIXTURE_PASS_NOT_LIVE.
- Live mode: requires LIVE_INTERNAL rows, HTTPS source evidence and at least one eligible FROZEN row before returning LIVE_OBSERVED_READY.
- No synthetic or public-guidance row can close Gate A.
