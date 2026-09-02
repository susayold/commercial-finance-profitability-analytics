# VNFinance non-Power-BI FP&A release manifest — 2026-09-02

> Scope lock: this is the active FP&A / Financial Analyst release. Power BI is archived and excluded from acceptance.

## Release identity

- Release date: **2026-09-02**
- Release name: **VNFINANCE-FPA-2026-09-02-FINAL**
- Release tag: **PENDING_INPUT_GATED_CLOSURE**
- Release status: **CLOSURE_CANDIDATE_INPUT_GATED**
- Payload commit at manifest generation: `4fdcf1a55b6d63c3286c7596978b2f9906a98076`
- Current period: **FY2025**
- Operating input: `data/operating_inputs/manifest.json` (seed `20260829`, 36 months)
- Evidence: operating data is SIMULATED/DERIVED; public-company data is separate OBSERVED/CALCULATED_PUBLIC; valuation/M&A/Monte Carlo are SYNTHETIC_REHEARSAL.
- Recruiter website: Sites **v26**, source commit `f1d0c6fcc180bcc5a033062b0a49b1d7816202bb`, private production deployment.
- GitHub policy: **PUBLIC_SAFE_PORTFOLIO_REPOSITORY**; private raw filings remain in Drive.
- GitHub Pages: **https://susayold.github.io/commercial-finance-profitability-analytics/** via `main:/docs` (static_vite_build_from_site_component).

## Quality gates

- Core non-BI QA: **55/55 PASS**.
- Release file gate: **52/52 PASS**.
- Recruiter website external-link QA: **42/42 PASS**.
- Gate A: **PENDING_EXTERNAL_INPUT** — an approved internal pre-close forecast snapshot plus post-close actuals is still required before claiming live forecast accuracy.
- Candidate personalization: **INPUT-GATED** — replace CV placeholders and add genuine identity/experience before submission.

## Active artifact inventory

| Artifact | Purpose | Evidence boundary |
|---|---|---|
| `data/finance_model/final_v1/` | Controlled finance schedules | SIMULATED / DERIVED |
| `data/financial_statements/` + `data/accounting/` | Linked three statements, TB, GL mapping and close controls | SIMULATED / DERIVED |
| `data/costing/` + `data/macros/` | Standard costing, reserve policy and macro cutoff | SIMULATED / ASSUMPTION |
| `data/planning/` + `data/forecast/` | Three-year plan and forecast v2/backtest rehearsal | SIMULATED / DERIVED |
| `output/pptx/VNFINANCE_NONBI_FPA_MBR_2026-09-01.pptx` | Editable management pack | Derived case output |
| `output/pdf/VNFINANCE_FPA_CASE_SUMMARY_ONE_PAGE.pdf` | One-page recruiter summary | Derived case output |
| `docs/*CV*` + interview scripts | Recruiter positioning and walkthrough package | Evidence-labelled; candidate facts remain input-gated |
| `output/pdf/FINANCE_ANALYST_CV_ONE_PAGE_V3.pdf` | One-page finance-first CV PDF | Template; candidate facts remain input-gated |
| `data/governance/candidate_profile_intake.json` + validator | Safe candidate-facts intake contract | INPUT-GATED by design |
| `data/governance/recording_handoff.json` + validator | Safe manual walkthrough handoff contract | INPUT-GATED by design |
| `reports/NONBI_SCOPE_BOUNDARY_QA_2026-09-02.json` | Active non-BI source/path boundary control | PASS evidence |
| `site/` | Recruiter website and evidence navigation | No unsupported live-impact claim |

## Recruiter handoff links

- Website: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- GitHub: https://github.com/susayold/commercial-finance-profitability-analytics
- Case summary PDF: https://drive.google.com/file/d/19rzyxjeIWWDus1LzPiYzcvtM3yK3yxkO/view?usp=drivesdk
- Drive folder: https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR

## File hashes

| Path | Bytes | SHA-256 |
|---|---:|---|
| `.github/workflows/deploy-github-pages.yml` | 1,224 | `FFED81139B0AB1AD6C8FC12E576AB2594BB004DCFE32FCF896B4A16CB88CD7DD` |
| `docs/index.html` | 622 | `D865259FAD9D5B361165B9F8AA2BB1666AE9AE085EB948CF9F73EAAFD78CEEC0` |
| `docs/.nojekyll` | 0 | `E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855` |
| `docs/assets/index-CVXkxgmt.js` | 247,445 | `F2C0F4638DA04E57C395A9B896790625C973CD206E7ED8C57BF100F256775E0D` |
| `docs/assets/index-DoOme-Br.css` | 147,345 | `C89E4E32948F4039F16FB0A3976B07068C4A16FA6308B0A695AE4ADDD8AA266C` |
| `site/index.html` | 448 | `ECD37FE44878257D40B53D58DA495196B15FEB297957B6F17F2C77C05FF814B7` |
| `site/github-pages.main.tsx` | 331 | `8C753F7A683872AE17FD8067B53111BCEDAAE6F3ECA02A72CAC63133F10E97E3` |
| `site/github-pages.vite.config.ts` | 397 | `75B798C28DA9FCFED0530B48F517E07AC821E06D9523580A441E92C8436CFB49` |
| `site/package.json` | 1,661 | `01F184EDC5813CA3F02B75630BC753733A97DBD6DF36F611A4AE10B96B057848` |
| `site/package-lock.json` | 331,216 | `E5322A6F319085A53B9F3BF42B67EDF016D4EC26D65B8C315A45D2C4118E8F66` |
| `data/governance/release_identity_nonbi.json` | 1,438 | `3F5DB797317F4048DFD93074CAEDBD2D25FAA013872A73915FBF9354671B51BC` |
| `reports/GITHUB_PUBLIC_SAFE_SCAN_2026-09-02.md` | 3,007 | `D59014E0C7146F65DE673E5D84C5F3E9D3E22BE7387003562480AA20ADB5C034` |
| `scripts/validate_release_identity_nonbi.mjs` | 4,535 | `A30CEC5007FA93BF47CF2192705D469396DB7498CF2121C3FADF1441F42531C9` |
| `reports/RELEASE_IDENTITY_NONBI_QA_2026-09-03.json` | 2,583 | `5908827B19BA8706A796DD967D1741086E0C97CE3418E209D30CE5C1F2B74B67` |
| `data/operating_inputs/manifest.json` | 312 | `153C9FFD6793A811F6542F51B9217E9468A6508623B1A8C5919C45CFB39A06E3` |
| `data/finance_model/final_v1/source_manifest.csv` | 6,806 | `DAFE1B0D0249B39742A89996BF0A4C14C5EBCB8D421E105F343E74232E915EFB` |
| `data/governance/finance_metric_registry.csv` | 6,404 | `6835BE030C44723EFA675A958C9310FF8E05EC83A8D1D56BB5A2596336206FAE` |
| `data/governance/exported_metric_snapshot.csv` | 2,415 | `D7E5EB190184959D0D084E49385B04D3328A6803D65AFA233317C949230D9E80` |
| `data/governance/recruiter_metric_snapshot.json` | 4,301 | `4F353BEC882B6A8E998F05E9DA5A77787BDBB24FB6A644FA3066D3111CD568A6` |
| `data/financial_statements/monthly_income_statement.csv` | 12,101 | `23226481B8821E384FD70944168F2A45ED8F58D0BD2B1AB4423C13CC9C9DAC01` |
| `data/financial_statements/monthly_balance_sheet.csv` | 9,832 | `F97957340383E4C07BA029A57FD449B64E956F6CD93340D640E932C36005437F` |
| `data/financial_statements/monthly_cash_flow.csv` | 9,543 | `23C4B212ECF5E15C80A2DEB6CC7DC9039456C507227E75765746F25994493FC5` |
| `data/accounting/trial_balance_monthly.csv` | 29,535 | `AF43011A801101466D9450AD248D45E846245DD6839098A7288AFEA0A2CCCA5F` |
| `data/accounting/gl_management_mapping.csv` | 2,344 | `B5CA1E69E7F6B420B7E87EE15AB44A437ECD9989310506DD3F34E5FC462433E7` |
| `data/costing/cost_variance_monthly.csv` | 213,750 | `3A8664BB74DC9EBA35F38AA58EEC66A3928E6A0337540A7FE911DA6B71129383` |
| `data/forecast/forecast_versioned_snapshots_v2.csv` | 75,012 | `E90824EFC74FBF2A5FDAAFDF0177A80D46C73D2C46D27EA805AB110F203FA7ED` |
| `data/planning/three_year_operating_plan.csv` | 24,448 | `3E2AAF7189C3C81F883ECB0FF6563570B94DD266BAE4A0883D699007CD43DDC8` |
| `output/pptx/VNFINANCE_NONBI_FPA_MBR_2026-09-01.pptx` | 60,841 | `9AB883EA338348530064F35969A592FB00F048FAD0767C20B9964CAB74829CA9` |
| `output/pdf/VNFINANCE_FPA_CASE_SUMMARY_ONE_PAGE.pdf` | 6,054 | `837024C9E4809A8ACFCA897AF3D8B3B2DE7803484ADC979DF0C931858BA9D52D` |
| `reports/NON_POWERBI_FINAL_QA_2026-09-01.md` | 1,304 | `05FCA80E781B1A1C8C984BEF92B7B57B27E0472E9FB7ADBE29ED5747916E132B` |
| `reports/NON_POWERBI_RELEASE_GATE_2026-09-01.json` | 5,765 | `2907BFE965B4D963A98D56E6E38C1EB85D211EC07324A40011DC8CC7632FA8B9` |
| `reports/RECRUITER_SITE_LINK_QA_2026-09-02.json` | 20,017 | `91215AEF0962E9465B0606FBAEBB6D4B3A789335A10C29F8B84A715605DC067A` |
| `docs/FINANCE_ANALYST_CV_ONE_PAGE_V3.md` | 3,858 | `F4438C71C5A79FF7B080C9C3E9E068F2EE151F91A9D197BE1917CC8F1895B058` |
| `docs/CANDIDATE_APPLICATION_INTAKE_AND_CV_BUILD_PACK.md` | 9,902 | `7B890CD5F4BDE1DD451A1EDE1478A6D3530D81A9B529BDF8FD51FE9192C9DA17` |
| `docs/CV_ROLE_VARIANTS_V2.md` | 5,045 | `6E14C0FEB51F9EB3C47F26A1CEA27EAF80A6992D7EFB16540B75E585401337C4` |
| `docs/CV_EVIDENCE_MAP.md` | 16,088 | `5904711474ABE460B6AAED766623835F46C2DA9959B2E925E4556DE434127AED` |
| `docs/FINANCE_ANALYST_CV_BULLET_BANK_2026-08-30.md` | 7,958 | `5D6DB7FCC5BCE44C2E94588D50DC4342317CCF9FED5032701EBEFC0F9464F17A` |
| `docs/FINANCE_ANALYST_INTERVIEW_TALK_TRACK.md` | 10,559 | `84482109B5D5E376F8D1EC99F3BC69830060C16FADCA3F7C4D4C2C22C1ABD3E6` |
| `docs/INTERVIEW_WALKTHROUGH_FINANCE_ANALYST_2026-08-30.md` | 7,125 | `BAD35A615184E0C71B9E74E4402153F38834E54D17BCC18CC6CEE31A718C4589` |
| `reports/CV_V3_QA.md` | 1,584 | `94FE0D470DD21A340E9F41365637725680611B1F36231599687C8EC9FC516E04` |
| `scripts/validate_cv_v3.mjs` | 4,758 | `A86B39EC939A4247D7F36AC9522789F30E610B67B053A8694437A243D6CE9930` |
| `output/pdf/FINANCE_ANALYST_CV_ONE_PAGE_V3.pdf` | 4,639 | `1960081768DAB14DF03A35772263332CACFF68BA95F1D3014F7DF905A960E178` |
| `scripts/render_cv_v3_pdf.py` | 7,912 | `8CCBEB12DE5ED2C8A0812F6B62AC5D77942D2430C28694486DF17DC0BFCBBD19` |
| `scripts/validate_cv_v3_pdf.py` | 1,555 | `4012B397B92399F71AB9419D7A0042B1F57AA6A9A752F6B0C6385A023600F0C6` |
| `reports/FINANCE_ANALYST_CV_V3_PDF_QA.md` | 963 | `13F40E398024D6CCCD998F7D4301A8EF992E001137FA95096E4EE579508EDD1F` |
| `data/governance/candidate_profile_intake.json` | 1,938 | `124B8CCD60CD6BA757BEB7E127D856506195C1B5FF8669F9806D5E5928192E63` |
| `scripts/validate_candidate_profile.mjs` | 4,840 | `0D052D48299268A790F1C687F32C59B210DCE28E377EE5FCC4A910120F980A6B` |
| `reports/CANDIDATE_PROFILE_INTAKE_QA_2026-09-02.md` | 1,005 | `394DF7B2AF1281268E81DA4393D048173D5F27631B54EDD38D41D67E47C9E3F9` |
| `data/governance/recording_handoff.json` | 1,278 | `3BF8150BC9FD50F7220D3B19D12CD03BCE7630027230410C90B093E15A2CBDB0` |
| `scripts/validate_recording_handoff.mjs` | 3,541 | `CE3B98AEDE05BE5F4905EA272E281A597ADCAC67BBF360F1BA1A13B3CEF120B6` |
| `reports/RECORDING_HANDOFF_QA_2026-09-02.md` | 1,029 | `4C9879E15607635570D5E400D630559E0E09B6C49A821D08B420B0FA9A92C41B` |
| `reports/NON_POWERBI_HANDOFF_INDEX_2026-09-01.md` | 7,046 | `74D28A5611CBC5D56CA92986CCBF4DB8AA2143F8A00BCD6756D5554CD9A446F3` |
| `reports/BOSS_HANDOFF_PACK_2026-08-31.md` | 8,012 | `0138673137B4A52997EDEBEA5CDD5F6DA4038134B0675E0A19325363E8830554` |
| `docs/DEFINITION_OF_DONE_AUDIT.md` | 28,514 | `7BD411877DEB461C6983B6F53F6BCAC8B4E25C1F42937FD99296F783F5B8715C` |
| `scripts/validate_nonbi_scope_boundary.mjs` | 5,023 | `1842E00CD52FFEF5F9B3368A79AFA6A2A34B42D4C95F1080760080A6C22A84DA` |
| `reports/NONBI_SCOPE_BOUNDARY_QA_2026-09-02.json` | 3,613 | `33CEA884B1F7FAF4D74F97631FE520ADF07D2D1E99AAD01C3DA055294A3BDFD2` |

## Reproduction

```text
python scripts/build_recruiter_metric_snapshot.py
node scripts/validate_recruiter_metric_snapshot.mjs
node scripts/run_finance_qa.mjs --nonbi
python scripts/run_non_powerbi_release_gate.py
```

## Excluded historical path

Power BI PBIP/PBIT/Desktop material remains in the repository archive for traceability only. It is not an active source, not part of this manifest's acceptance gate and not a recruiter claim.
