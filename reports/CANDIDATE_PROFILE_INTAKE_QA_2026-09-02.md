# Candidate Profile Intake QA — 2026-09-02

**Status:** INTAKE_TEMPLATE_PASS  
**Checks:** 10/10 passed  
**Profile status:** INPUT_GATED  

| Check | Status | Detail |
|---|---|---|
| input_file_exists | PASS | data/governance/candidate_profile_intake.json |
| schema_keys_present | PASS | missing=none |
| status_allowed | PASS | status=INPUT_GATED |
| do_not_invent_policy | PASS | do_not_invent=true |
| rendering_rules_present | PASS | one-page CV and no BI claim policy |
| gated_template_has_no_personal_facts | PASS | non_blank_required_fields=none |
| no_placeholder_personal_values | PASS | placeholder_values=0 |
| education_schema_declared | PASS | education fields declared |
| experience_schema_declared | PASS | experience fields declared |
| claim_boundary_declared | PASS | 5 blocked claims |

Policy: blank required fields are intentional until the candidate supplies verified facts. Portfolio outputs must remain under Projects; personal employment claims require candidate evidence.
