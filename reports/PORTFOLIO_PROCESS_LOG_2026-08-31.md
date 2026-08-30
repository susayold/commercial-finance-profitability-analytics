# Portfolio process log — 2026-08-31

## Scope

This log records the latest Power BI execution work after the 2026-08-30
release. It separates verified repository changes from external gates that
still need a real Power BI Desktop or cloud workspace.

## Completed this cycle

1. Confirmed `PBIDesktop.exe` is present at `D:\Po BI\bin\PBIDesktop.exe` and
   recorded a custom-path preflight result of 14/14 checks.
2. Added `-Report` to `scripts/powerbi_desktop_preflight.ps1` so host/data
   readiness can be archived as JSON without implying native QA.
3. Added `powerbi/directquery/PRODUCTION_ACCEPTANCE_MATRIX.md` with nine
   production gates, freshness fields, security/capacity controls and rollback.
4. Added `scripts/watch_powerbi_refresh.py`, which hashes all 14 contract files,
   waits for stable copies, validates the source and delegates to the unified
   refresh orchestrator. Failed hashes remain unacknowledged and retry.
5. Executed a two-batch watcher QA on disposable copies: baseline contract hash
   `bbca96cd...f574`, changed hash `1009a053...6144a`, and `Sales[units]` changed
   from 121 to 122 in the target DataRoot. Both batches returned `PASS`.
6. Linked the acceptance matrix from the private recruiter site and deployed
   Sites version 15. The site remains owner-only.
7. Pushed the complete source/data/evidence state to GitHub and replaced the
   Drive bundle in place. All temporary test clones, archives and input folders
   were removed after verification.
8. Added `scripts/run_powerbi_release_gate.py`, a single deterministic command
   that runs input-contract, refresh dry-run, package, artifact-coherence,
   claim-boundary and Windows Desktop preflight checks. The current fixture
   returned `PASS` across all six stages; the command never treats a missing
   cloud workspace or native UI evidence as a hidden success.
9. Reran `scripts/run_directquery_localdb_smoke.py` and found the prior
   hard-coded watermark had aged into `WARN_STALE`; fixed the harness to use a
   runtime UTC watermark, reran the two-batch load, and recorded **PASS** for
   both health controls, the +1 units delta and ephemeral-instance cleanup.
10. Wired the unified release gate into `.github/workflows/finance-qa.yml` and
    uploaded its JSON evidence with the existing Power BI QA artifact. Linux CI
    reports `PASS_WITH_EXTERNAL_PENDING` for the unavailable Windows Desktop
    stage while still failing closed on deterministic contract/package checks.
11. Ran the cross-platform finance QA runner after the change: **49/49 PASS**,
    including PBIP source coherence and DirectQuery readiness.
12. Verified GitHub Actions run [33325806466](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33325806466): the new release-gate step and the full Finance model QA job completed successfully; CI correctly records the Windows Desktop stage as `EXTERNAL_PENDING` on Ubuntu.
13. Extended the LocalDB smoke harness with a configurable post-commit health
    latency sample. The current 10-sample run recorded p50 `0.0134s` and p95
    `0.0153s`; this baseline is explicitly labelled local rehearsal evidence.
14. Added `powerbi/POWER_BI_NATIVE_DESKTOP_HANDOFF_2026-08-31.md`, a single
    operator sheet for Desktop preflight, binding, QA-01–QA-18, replace-data-only
    proof, native PBIX save/reopen and the separate realtime migration gate.
15. Added `scripts/validate_native_pbix_release.py` and tested both paths with
    disposable ZIP fixtures: complete QA/metadata returns `READY_TO_CLAIM`,
    missing external evidence returns `PENDING_EXTERNAL_EVIDENCE` (exit 2),
    and a PBIT passed as PBIX is rejected (exit 1).

## Evidence boundaries

| Capability | Current evidence | Claim |
|---|---|---|
| Editable model | PBIP/PBIR/TMDL source + PBIT | PASS |
| Contract refresh | 78/78 input checks + watcher two-batch QA | PASS |
| Local DirectQuery mechanics | LocalDB two-batch smoke | Rehearsal only |
| Native PBIX | Desktop executable exists; UI kernel failed before target window | PENDING |
| Production realtime | Cloud DB, gateway/capacity and APR not provisioned | PENDING |

The next executable action is to open the PBIP/PBIT in Power BI Desktop, set
`DataRoot`, refresh, capture QA-01–QA-18 and save the native `.pbix`. Only after
that evidence exists should `native_desktop_qa` or the realtime claim be
promoted.
