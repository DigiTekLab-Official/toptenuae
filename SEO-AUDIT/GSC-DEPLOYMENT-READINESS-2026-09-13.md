# GSC Deployment Readiness — 2026-09-13

## Decision

**READY FOR DEPLOYMENT — remediation clean; only documented pre-existing repository lint debt remains.**

This report does not authorize or perform a deployment.

## SEO remediation gate: PASS

- `pnpm build`: pass.
- `pnpm exec astro check`: pass; 0 errors, 0 warnings, 19 informational hints.
- Remediation-owned ESLint: pass.
- `pnpm test`: 22/22 pass.
- Cloudflare Pages production-like HTTP regression: pass.
- 97 exact redirect pairs, each tested through 8 GET/HEAD variants: pass.
- 62 unique canonical redirect targets return direct 200: pass.
- 12 explicit known-gone paths return direct 410: pass.
- Unknown review, top-ten and generic paths return direct 404: pass.
- 286 current sitemap URLs return direct 200, are self-canonical and indexable: pass.
- Sitemap redirects, duplicate URLs, redirect loops, multi-hop chains and 5xx responses: none.
- Total final HTTP assertions/requests: 1,184.

The previous run contained 1,183 requests and 285 sitemap URLs. The final build fetched one additional published Sanity document, so the current run contains 1,184 requests and 286 sitemap URLs. The additional URL also passed. This is content growth, not a regression.

## Repository health gate: PRE-EXISTING DEBT

`pnpm exec eslint .` exits 1 with 205 failures across 54 files.

Rule totals:

- `@typescript-eslint/no-explicit-any`: 173
- `@typescript-eslint/no-unused-vars`: 16
- `@typescript-eslint/ban-ts-comment`: 7
- `@typescript-eslint/no-require-imports`: 2
- `@typescript-eslint/no-empty-object-type`: 2
- `@typescript-eslint/triple-slash-reference`: 1
- `prefer-rest-params`: 1
- `no-var`: 1
- `prefer-const`: 1
- parser error in the pre-existing inline speculation-rules JSON: 1

Attribution against the pre-remediation state:

- 197 failures have an identical offending source line in committed `HEAD`.
- 8 failures are in scripts that were already untracked in the captured pre-remediation working tree.
- 0 remaining failures were introduced by the GSC remediation.
- 0 current failures are generated-output related. `.next/` and `.wrangler/` are now treated as generated outputs, alongside the existing `dist/`, `.astro/` and `node_modules/` exclusions.

The pre-remediation ESLint flat config itself was invalid under ESLint 9 because it used an `extends` key inside a flat-config object. Correcting the config exposed the existing source debt; it did not create those violations. No lint rule was suppressed, disabled or downgraded.

## Remediation-touched-file proof

The full run reports 30 failures in application files that the remediation also touched. Every one of those 30 offending lines exists identically in `HEAD`; the remediation changed different lines in those files:

- `src/components/sanity/PortableText.tsx`: 10 pre-existing `no-explicit-any` findings.
- `src/layouts/BaseLayout.astro`: 2 pre-existing `no-explicit-any` findings and 1 pre-existing parser finding.
- `src/pages/[category]/[slug].astro`: 2 pre-existing `no-explicit-any` findings.
- `src/pages/[category]/index.astro`: 10 pre-existing `no-explicit-any` findings.
- `src/pages/reviews/[slug].astro`: 4 pre-existing `no-explicit-any` findings.
- `src/pages/top-ten/[slug].astro`: 1 pre-existing `no-explicit-any` finding.

The investigation initially found one remediation-introduced `as any` cast in `src/pages/[category]/index.astro`. It was replaced with the existing `SupportedContentType` type, after which the repository total fell from 206 to 205 and no introduced finding remained.

The newly created redirect map, unit test and HTTP regression harness, plus `src/middleware.ts`, `astro.config.mjs` and the corrected ESLint config, report zero ESLint failures.

## Evidence

Every remaining failure, including file, line, column, rule, message, classification and comparison evidence, is recorded in `GSC-ESLINT-FAILURES-2026-09-13.csv`.

## Smallest safe repository-health follow-up

Handle the 205 findings as a separate lint-debt change, preserving strict rules. Start with the single parser incompatibility, then replace explicit `any` types and resolve unused values in small, reviewable batches. No SEO remediation code needs to change.
