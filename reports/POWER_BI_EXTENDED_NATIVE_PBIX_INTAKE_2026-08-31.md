# Power BI extended native PBIX intake — 2026-08-31

## Status

`PENDING_EXTERNAL_EVIDENCE` — a real native `.pbix` container was produced by
Power BI Desktop and archived to the private Drive project folder, but the
formal QA-01–QA-18 evidence log and reviewer sign-off are still open.

## Artifact

| Field | Value |
|---|---|
| File | `Commercial_Finance_Profitability_Analytics_extended_native_candidate.pbix` |
| Drive | [Open native PBIX candidate](https://drive.google.com/file/d/1mqZ_ZkMqCXu7qnpO3L6gZ5L0U1TybmGE/view) |
| Size | 1,491,858 bytes |
| SHA-256 | `0C1706E65A1EF9AA6FD84A7C8508995F6C9CB826A1A01F626D6CF1AB666B5E5C` |
| Desktop | `2.157.879.0 (26.08)` at `D:\Po BI\bin\PBIDesktop.exe` |
| DataRoot recorded | `powerbi/data/current` |
| Refresh timestamp recorded | `2026-08-31T04:00:02+07:00` |
| Source PBIT | `powerbi/releases/Commercial_Finance_Profitability_Analytics_extended.pbit` |

## Container validation

`scripts/validate_native_pbix_release.py` returned `PENDING_EXTERNAL_EVIDENCE`
with all artifact checks passing:

- `.pbix` extension and non-trivial size: PASS
- PBIX and extended PBIT hashes differ: PASS
- readable ZIP container with 59 members: PASS
- CRC integrity: PASS
- no obvious cache, secret or credential members: PASS
- report and model/metadata container signals: PASS
- Desktop version, DataRoot and refresh timestamp metadata: PASS

The pending status is deliberate: no observed QA CSV was supplied, so the
validator will not promote the file to `READY_TO_CLAIM`. Complete the native
Desktop QA-01–QA-18 checklist, capture page screenshots/tie-outs and rerun the
validator with the observed QA CSV before changing the release boundary.

## Claim boundary

This file is a real native PBIX candidate, not a renamed PBIT or a fabricated
ZIP. Its existence does not by itself prove that all extended tables and
visuals rendered correctly, that the scenario slicer was visually verified,
or that production DirectQuery/Automatic Page Refresh is configured. The
portable PBIP/PBIT source and deterministic release gate remain the
reproducible source of truth until the external QA packet is complete.
