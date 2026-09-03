# GitHub Public-Safe Scan — 2026-09-02

## Decision

**Policy:** `PUBLIC_SAFE_PORTFOLIO_REPOSITORY` (Option A in the final closure plan).

The repository is reachable through an anonymous `git ls-remote` check. It is therefore treated as a public source repository containing synthetic and public-safe evidence. Private raw reports remain in Google Drive and are not committed to Git history.

Repository visibility is now **public**, and GitHub Pages is configured from `main:/docs`. CV-ready entrypoint: <https://susayold.github.io/commercial-finance-profitability-analytics/>. The single-page FP&A dashboard is available at <https://susayold.github.io/commercial-finance-profitability-analytics/dashboard/>. Pages serves a static Vite build of the recruiter portfolio component; external model/Drive links remain available from the page.

## Scope of scan

- Tracked repository content was checked with the current working tree excluded from the result.
- Historical `powerbi/` material was excluded from the active recruiter surface; it remains archived for traceability.
- Candidate profile fields remain blank and `INPUT_GATED`; no personal contact data is promoted by this release.
- The scan checked for private-key blocks, password assignments, bearer tokens, literal API-key assignments and Windows absolute user paths.

## Results

| Check | Result | Interpretation |
|---|---|---|
| Anonymous Git access | PASS | `git ls-remote` returns the public `main` ref |
| Private-key block | PASS | No PEM/OpenSSH private-key block detected |
| Password assignment | PASS | No literal password assignment detected |
| Bearer token | PASS | No bearer token pattern detected |
| Literal API-key assignment | PASS | Only CI variable placeholders such as `${{ secrets.* }}` remain |
| Absolute local user path in active files | PASS | 0 matches after validator reports were changed to relative paths |
| Restricted raw filings in Git | PASS | Raw filing archive is maintained in Drive, not Git history |
| Candidate personal facts | PASS | Intake contract is blank and explicitly input-gated |

## Public deployment

| Check | Result | Interpretation |
|---|---|---|
| Repository visibility | PASS | GitHub API reports `visibility=public` |
| Pages source | PASS | `main` branch, `/docs` path |
| CV entrypoint | PASS | `susayold.github.io/commercial-finance-profitability-analytics` serves the static portfolio build |

## Wording to use

Use:

> GitHub is a public source repository containing reproducible synthetic and public-safe evidence.

Do not use:

- “private repository”;
- “confidential company data”;
- “live employer impact”;
- “live forecast accuracy”;
- “Power BI production deployment”.

## Reproduction

```text
git ls-remote https://github.com/susayold/commercial-finance-profitability-analytics.git HEAD
rg -l -i --hidden -g '!.git/**' -g '!powerbi/**' \
  'BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|password\\s*[:=]|Bearer\\s+|api[_-]?key\\s*[:=]|(C|D):\\\\Users\\\\' .
```

This scan supports the public-safe policy; it does not replace the separate Gate A, candidate-facts or recording handoffs.
