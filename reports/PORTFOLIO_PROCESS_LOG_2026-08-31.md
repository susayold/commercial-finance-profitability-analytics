# Portfolio process log — 2026-08-31

## Scope

This log records the latest Power BI execution work after the 2026-08-30
release. It separates verified repository changes from external gates that
still need a real Power BI Desktop or cloud workspace.

## Completed this cycle

### Scenario planning logic made finance-editable (2026-08-31)

The extended Power BI planning layer previously contained five selector rows,
but its `Scenario Revenue` measure only mapped Budget/Forecast and otherwise
fell back to Actual. That made Upside/Downside labels visually present but not
decision-useful. I changed the controlled `scenario_selector.csv` contract to
carry `base_case`, revenue/COGS/OPEX multipliers, a working-capital day delta
and a scenario note. The DAX now resolves the selected base case and applies
the row's drivers to `Scenario Revenue`; `EBITDA Proxy` applies the same
drivers to base COGS and OPEX. The SQL DirectQuery DDL includes the fields and
an additive migration block for an existing rehearsal table.

The extended PBIP/PBIT was regenerated with the same 20-table / 60-measure /
25-relationship / 6-page / 42-visual topology. The extended scope validator
now checks the seven scenario columns, the five named rows and the presence of
a non-neutral sensitivity. Input contract QA remains 98/98, extended scope
QA is 15/15, artifact coherence is 15/15, release gate is PASS with Desktop
preflight 14/14, and DirectQuery readiness/mapping/health remain 41/41,
18/18 and 15/15. During the smoke rehearsal, the peer benchmark source's
nine-decimal normalized VND-bn values exposed a SQL `decimal(19,4)` scale
loss; the DDL was widened to `decimal(28,9)` and the two-batch LocalDB test
then returned **PASS** with 29,923 loaded rows, zero rejects, a +1 units
proof and p95 health-query latency of 0.017 seconds. This is still an
Import-refresh package; no realtime or native-PBIX claim is promoted by this
change.

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
12. Verified GitHub Actions run [33327789127](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33327789127): the new release-gate step and the full Finance model QA job completed successfully; CI correctly records the Windows Desktop stage as `EXTERNAL_PENDING` on Ubuntu.
13. Extended the LocalDB smoke harness with a configurable post-commit health
    latency sample. The latest 20-sample run recorded p50 `0.0135s` and p95
    `0.0156s` (min `0.0112s`, max `0.0172s`); this baseline is explicitly
    labelled local rehearsal evidence.
14. Added `powerbi/POWER_BI_NATIVE_DESKTOP_HANDOFF_2026-08-31.md`, a single
    operator sheet for Desktop preflight, binding, QA-01–QA-18, replace-data-only
    proof, native PBIX save/reopen and the separate realtime migration gate.
15. Added `scripts/validate_native_pbix_release.py` and tested both paths with
    disposable ZIP fixtures: complete QA/metadata returns `READY_TO_CLAIM`,
    missing external evidence returns `PENDING_EXTERNAL_EVIDENCE` (exit 2),
    and a PBIT passed as PBIX is rejected (exit 1).
16. Corrected the refresh architecture filename list to use the canonical
    `marketing_spend.csv` partition and added a claim-boundary regression check
    so the documentation cannot drift from the Power Query/source contract.
17. Added `scripts/validate_powerbi_docs_contract.py` and wired it into CI; it
    compares the canonical 14-file tuple, runbook list, PBIP/PbixProj
    `DataRoot` references and committed CSV fixture.
18. Tested the official Power BI Desktop Bridge CLI against the custom Desktop
    path. The Bridge returned its method manifest (`application.state.get/v1`,
    `report.snapshot.capture/v1` and `file.reload/v1`), but repeated status
    calls reported `Host is not ready to accept operations`; this is recorded as
    a host-readiness blocker, not as native render or PBIX evidence.
19. Reran `scripts/run_powerbi_release_gate.py` with
    `--desktop-path D:\\Po BI\\bin\\PBIDesktop.exe` on a clean clone. The
    command exited 0 and the Windows preflight returned 14/14 PASS; this proves
    package/host readiness only and does not promote native PBIX or production
    realtime claims.
20. Executed a fresh Power BI Service refresh dry-run against disposable IDs on
    `main` commit `2903d9f`. The helper returned `DRY_RUN_PASS`, emitted the
    documented Import refresh endpoint/payload and wrote JSON only to a
    temporary path. No token, network request or dataset side effect was used;
    the evidence is archived in
    `reports/POWER_BI_SERVICE_REFRESH_DRY_RUN_2026-08-31.md`.
21. Invoked the Service helper's `--apply` branch without a token using the
    same disposable IDs. It returned exit code `1` with the expected
    fail-closed message before writing an evidence file or making a network
    request; this guard is documented in the dated dry-run record.
22. Added an explicit DirectQuery migration contract and wired both its
    17-check validator and the 12-check Service workflow validator into the
    one-command Power BI release gate. This keeps storage-mode migration and
    data-drop automation in the same deterministic preflight rather than
    relying on documentation-only review.
23. Reran the release gate with the installed Desktop path. All eight
    pre-release-record deterministic stages passed (78/78 input checks, package/coherence/claim
    boundary, 17/17 DirectQuery mapping and 12/12 Service workflow checks);
    Desktop preflight was 14/14. The output still explicitly leaves native
    PBIX rendering and production APR as external evidence gates.
24. Hardened the DirectQuery health query with an explicit `control_reason`
    (`CURRENT`, `STALE_WATERMARK`, `REJECTED_ROWS`, `LOAD_FAILED`, `NO_LOAD`)
    and exercised all five states against disposable LocalDB control rows.
    The state-machine run returned **5/5 PASS** with cleanup PASS; the static
    health contract is now part of the one-command release gate.
25. Reran the two-batch DirectQuery LocalDB integration after the health-query
    change. Both batches remained `PASS`, `Sales[units]` moved `1,256,859 →
    1,256,860`, all 20 health samples exposed the changed batch and the
    latency baseline was p50 `0.0132s` / p95 `0.0153s`; cleanup was PASS.
26. Corrected the recruiter-facing release record from the older `3256972`
    handoff to current HEAD and added a release-record validator. The
    validator checks commit/Drive links, current Import mode, latest replacement
    delta, DirectQuery local-only boundary and explicit native/realtime pending
    gates; it is now part of both finance QA and the release gate.
27. Removed the Power BI Desktop load blocker caused by same-table measure and
    column name collisions (`COGS`/`cogs` and `Units`/`units`). The aggregate
    measures are now `COGS Total` and `Units Total`, and the new static
    `validate_powerbi_measure_column_collisions.py` gate runs in both Finance QA
    and the release gate. Desktop then loaded the repaired PBIT, saved a native
    PBIX, reopened it, refreshed it and showed the replace-data-only proof:
    `Sales[units]` 1,256,859 → 1,256,860 after changing only one CSV value.
    The baseline file was restored and the native PBIX was saved again. The
    observed native artifact and evidence sheet are checked in; the complete
    QA-01–QA-18 matrix remains a separate pending sign-off.
28. Committed the native PBIX as
    `powerbi/releases/Commercial_Finance_Profitability_Analytics_native.pbix`
    (1,456,507 bytes; SHA-256
    `DFA3EC096D46DF2DDCEDA9B3333FA5506FB98B8DE9414C5A792BFE558F301644`),
    pushed commit `ca38654` to GitHub and uploaded the same bytes to the private
    Drive file `15wJmM8POBNonWIfslSAdh8ihSUZZNc3W`. The release gate now returns
    PASS across ten deterministic stages plus the 14/14 Desktop preflight.
29. Reconciled the older Power BI status artifacts with the native run: the
    reviewer walkthrough, historical Desktop QA snapshot, package QA report,
    implementation status and validation report now point to the observed
    native PBIX evidence while keeping the complete QA-01–QA-18 sign-off and
    production DirectQuery/APR acceptance explicitly pending.
30. Reopened the committed PBIX in Desktop and captured all six report pages
    through the UI: Executive Output, P&L and Variance, PVM Bridge, Channel and
    Customer Profitability, Working Capital and Liquidity, and Controls and
    Evidence. The page-capture index records the visible KPI/table evidence and
    keeps the formal QA-01–QA-18 release rule separate.
31. Added a row-level native QA coverage map that records exact source totals,
    visible page values, screenshot references and the remaining reviewer/model
    gaps. QA-05/QA-06 are source-backed zero-violation checks; QA-01–QA-04,
    QA-09, QA-11 and QA-17 have scoped native observations; QA-07, QA-08,
    QA-10, QA-12–QA-16 and QA-18 remain pending rather than being inferred.

32. Extended the editable Power BI scope to the complete finance-analyst
    planning/evidence layer: disconnected Scenario Selector, OPEX/headcount,
    CAPEX/fixed assets, approved Peer_Benchmark and Peer_Review_Queue. The
    generated extended source contains 20 tables, 60 measures, 25 relationships,
    six pages and 42 visuals over a 19-file DataRoot contract. A UTF-16LE-safe
    PBIT packager was added; Desktop opened the extended PBIT, bound DataRoot,
    hydrated the five new tables and rendered scenario/planning values. The
    extended PBIP/PBIT evidence is linked in
    `reports/POWER_BI_EXTENDED_SCOPE_DESKTOP_QA_2026-08-31.md`; no extended
    native PBIX claim was made, and the compact observed PBIX remains unchanged.

33. Published the recruiter-site alignment polish as Sites version 16: the
    page rhythm, max-widths, navigation overflow, card baselines, focus/hover
    states, mobile controls and Valuation-to-footer order were corrected. The
    Power BI card now reflects the extended 20-table / 60-measure scope. The
    validated source was pushed to the Site repository, saved and deployed
    owner-only at the existing production URL.

34. Pushed the complete extended Power BI source/data/docs plus the site polish
    to GitHub `main`, refreshed the Drive project archive in place and uploaded
    the extended PBIT as a separate editable binary. The current repository
    head is `9cf71ef`; the formal native QA and production realtime boundaries
    remain unchanged.

35. Reconciled the machine-readable external-gate readiness layer with the
    evidence now present: the compact native PBIX is archived with its SHA-256
    and six page-render captures are recorded as scoped evidence (6/18), while
    the formal QA-01–QA-18 sign-off, extended native PBIX promotion and
    production DirectQuery/APR acceptance remain pending. The readiness
    validator and cross-platform Finance QA runner both return PASS without
    weakening the no-overclaim release policy.

## Evidence boundaries

| Capability | Current evidence | Claim |
|---|---|---|
| Editable model | PBIP/PBIR/TMDL source + PBIT | PASS |
| Contract refresh | 78/78 input checks + watcher two-batch QA | PASS |
| Local DirectQuery mechanics | LocalDB two-batch smoke | Rehearsal only |
| Native PBIX | Desktop open/refresh/Save As/reopen observed; `Units Total` +1 proof; full QA-01–QA-18 matrix not promoted | PASS — observed workflow; formal matrix PENDING |
| Production realtime | Cloud DB, gateway/capacity and APR not provisioned | PENDING |

The next executable action is to complete and review QA-01–QA-18 on a second
workstation (or promote only after an equivalent full evidence pack). The
production realtime claim still requires a provisioned cloud database,
gateway/capacity and measured DirectQuery/APR acceptance; the observed Import
PBIX does not imply second-level realtime.
