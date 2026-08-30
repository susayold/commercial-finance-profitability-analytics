# Block A Design Lock QA

**Date:** 2026-08-30  
**Input:** `data/block_a_design_lock.csv`  
**Validator:** `scripts/validate_block_a_design_lock.mjs`

- Overall: **PASS**
- Status: **PROPOSED_APPROVAL_PENDING**
- Register rows: **20**
- Summary: Block A design lock QA: 6/6 structural checks PASS; status=PROPOSED_APPROVAL_PENDING; rows=20

## Checks

- PASS — row_count_20: rows=20
- PASS — sequential_ids_1_to_20: 1 through 20
- PASS — unique_decision_ids: unique=20
- PASS — required_text_present: decision and proposed_design populated
- PASS — allowed_statuses: PROPOSED
- PASS — approved_rows_have_audit_fields: no non-PROPOSED rows

The validator does not approve decisions and does not turn proposed synthetic design into real-company evidence. Any APPROVED, CHANGED or REJECTED row must include approved_design, approver and approved_at.
