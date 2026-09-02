# Controlled synthetic operating inputs

These files are the active non-Power-BI operating extract for the VietNova
FP&A case. They are reproducible from `scripts/generate_vietnova_data.py`
using seed `20260829`, cover 36 monthly periods from 2023-01 through 2025-12,
and are labelled synthetic. The OPEX and CAPEX planning fixtures are included
alongside the generated ledger for the integrated statements and planning
modules.

The files do not represent a live ERP export, audited accounts or employer
data. Rebuilds must preserve the documented schema and rerun the non-BI QA
and release gate.
