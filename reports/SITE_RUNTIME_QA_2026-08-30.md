# Website Runtime QA — 2026-08-30

## Deployment evidence

- Sites project: appgprj_6a930a2f81f48191b1e015f1fa938c69
- Sites version: 3
- Source commit: 89611ec4bb2aa56a637d743d7c0968a41080a084
- Production URL: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- Deployment status: succeeded
- Access policy: custom owner-only; external visitor count 0

## Checks

| Check | Result | Evidence |
|---|---|---|
| Source mirror contains Strategic Finance anchor | PASS | site/app/page.tsx includes id=strategic |
| Source mirror contains M&A metrics and CV link | PASS | page source includes 17.16%, VND 28.39bn and Open CV draft |
| CSS contains strategic-card styles | PASS | site/app/globals.css |
| Local production build | PASS | npm run build / vinext build completed |
| Saved version provenance | PASS | version 3 points to source commit above |
| Production deployment | PASS | Sites deployment status succeeded |
| Unauthenticated HTTP response | EXPECTED GATE | owner-only policy returns sign-in screen |

## Interpretation

The endpoint is intentionally private. The sign-in response is not a deployment failure; it confirms the access boundary is active. A visual click-through should be performed from the owner account or an explicitly approved viewer session. No public-access change was made.

## Reviewer path

1. Sign in with the owner account.
2. Open the production URL and confirm the Strategic Finance navigation anchor.
3. Click the M&A model and memo links.
4. Confirm the integrity note remains visible.
5. Record any visual issue in a follow-up release note.

## Evidence boundary

This QA proves build, source provenance, deployment state and access behavior. It does not claim that a public unauthenticated viewer can inspect the site.