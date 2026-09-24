# Calculator category routing — 2026-09-24

## Pre-change audit (reported before implementation)

Base: `6f009b69b3fbf44673e62bfaf44c469e0b7bd1aa`.

`ROUTE_PREFIX_BY_TYPE` in `src/lib/contentRoute.ts:19` mapped topTenList to
top-ten, product to reviews, howTo to how-to-guides, tool to finance-tools,
holiday/event to events-holidays. The constant was private to buildContentPath.
Its callers were the generic slug dispatcher, generic category flat-slug
redirect, reviews fallback, homepage links, TopTen related links and ToolLayout
breadcrumb. The sitemap builder, category cards, search, report and tool
SoftwareApplication URL bypassed the helper. BaseLayout receives the dispatcher
canonical and uses it for canonical/OG metadata.

Category-to-prefix routing is feasible without schema changes. Only registered
tool hubs are accepted; missing/unknown categories keep the old finance prefix.
Using `calculators` avoids the existing health-fitness-to-lifestyle normalization
and makes the generic category route the hub. Future tools need only that primary
category assignment; no BMI/Age allowlist is used in production routing.

The generic dispatcher finds documents by slug independently of the requested
prefix. Its frontmatter was executed in memory with category fixtures during the
read-only audit: both old paths returned 301 to calculators, while new paths
continued rendering. Actual HTTP GET/HEAD tests subsequently confirmed this.
No explicit redirects were needed.

Authenticated raw Sanity query included drafts: no existing calculators/health
category candidate. BMI and Age slugs exactly matched bmi-calculator-uae and
age-calculator-uae. Both had the finance category reference before migration.

The post query omitted heroTags AND relatedTools entirely, not merely their
dereferencing. Five tools had both fields populated; Age had neither. Age content
was left unchanged pending approval to add tags. The shared renderer now uses
populated tags, curated related links and the original fallback when unset/empty.

## Literal finance-tools inventory at the audited base

`git grep -n finance-tools HEAD`: 102 matching lines. File:line inventory:

```
CLAUDE.md:39,139
SEO-AUDIT/GSC-PROPOSED-EXPLICIT-REDIRECTS-2026-09-13.csv:39,57,59,96
SEO-AUDIT/GSC-REDIRECT-INDEXABILITY-AUDIT-2026-09-13.md:328
SEO-AUDIT/GSC-REMEDIATION-MATRIX-2026-09-13.csv:78,135,179,182,254
SEO-AUDIT/gsc-exports/crawled-currently-not-indexed.csv:19,73
SEO-AUDIT/gsc-exports/discovered-currently-not-indexed.csv:2
SEO-AUDIT/gsc-exports/indexed.csv:36,54,72
SEO-AUDIT/gsc-exports/sitemap-url-list copy.csv:7,50,51,52
SEO-AUDIT/phase1-architecture.md:276,324,466,553,587,592,613,633,720,721,722,723,758
SEO-AUDIT/phase4-gsc-forensic.md:15,46,51,91,132,146
_backup_nextjs/Footer.tsx:77,78,79,81
_backup_nextjs/app/[category]/[slug]/page.tsx:111,151
_backup_nextjs/app/[category]/page.tsx:255
_backup_nextjs/app/api/revalidate/route.ts:56
_backup_nextjs/app/not-found.tsx:66
_backup_nextjs/app/page.tsx:41
_backup_nextjs/app/ramadan-2026/page.tsx:177,278
_backup_nextjs/app/report/page.tsx:40,170,175
_backup_nextjs/app/reviews/[slug]/page.tsx:137
_backup_nextjs/next.config.ts:128,129
public/sitemap.xml:35,313,613,847
scripts/generate-sitemap.mjs:55,118
scripts/publish-age-calculator-uae.mjs:22,84,88
scripts/publish-bmi-calculator-uae.mjs:22,89,93
scripts/verify-redirect-indexability.mjs:126
src/components/Footer.astro:68,69,70,72
src/components/Header.astro:8
src/components/tools/RelatedTools.tsx:15,24,33
src/layouts/ToolLayout.astro:48,232
src/lib/contentRoute.ts:23
src/lib/schemaGenerator.ts:306
src/lib/seo/legacy-redirects.ts:47,65,67,104,137
src/pages/404.astro:40
src/pages/[category]/[slug].astro:42
src/pages/[category]/index.astro:72,105
src/pages/ramadan-2026.astro:151,223
src/pages/report.astro:32,163,165
src/pages/search.astro:46
src/repositories/home.repository.ts:24
tests/legacy-redirects.test.mjs:55,56
```

Historical records/backups and valid links to unmoved finance tools were retained.
Existing BMI/Age creation scripts were not rerun: they refuse to overwrite the
existing published tools. The generated sitemap is intentionally not committed;
the production build regenerates it from the revised helper and live categories.

## Sanity change

Created `topten-category-calculators`, slug `calculators`, title
`Health & Everyday Calculators UAE`, menuLabel `Health & Everyday`.
Changed only BMI/Age categories to reference it. The revision-guarded transaction
and post-write revision comparison confirmed no writes to the other four tools.
No schema definitions or calculator content/formulas changed.

## Implementation

The pure JS route implementation is shared with the Node sitemap builder; its
typed TS public API remains. Category data now reaches every updated link surface.
ToolLayout passes category to its breadcrumb helper; SoftwareApplication URLs,
canonical/OG metadata, hub cards, homepage section links, search, report, sitemap
repository and build-time sitemap all use the same tool-routing policy.

The new hub reuses existing calculator cards. Hero tags use wrapping badge-style
pills. Curated related references are dereferenced with title/slug/primary category
and preserve their authored order. Empty/unset lists use the previous fallback.

## Local verification

- Tests: 40/40 pass, including arbitrary future-tool category routing.
- Production build: exit 0; Astro 0 errors, 0 warnings, 18 hints. Build toolchain
  warnings: 22, matching previous release; normalized new-warning set empty.
- Raw HTML: all six 200, exactly one correct BreadcrumbList each, canonical/OG
  and SoftwareApplication URL correct, FAQ HTML/schema counts 7/4/4/12/14/4.
- Both old paths: GET and HEAD return 301 to their new canonical paths.
- Hubs: finance exactly four; calculators exactly BMI/Age.
- Sitemap: six canonical tool paths plus calculators hub; old BMI/Age absent.
- Search/report links use new paths.
- Interactive: gratuity 10,000 basic, 2021-01-01 to 2022-01-01 gives 7,000;
  VAT 1,000 gives gross 1,050; Zakat cash 100,000 gives 2,500;
  EMI 100,000/5%/60 gives 1,887.12, interest 13,227.40, total 113,227.40;
  BMI 70/175 gives 22.9 Normal; Age 1990-05-15 gives 36y4m9d as of 2026-09-24.
- Tags: counts 3/3/3/3/5/0; Age is a missing-content exception, not a renderer error.
- Related lists: curated on five tools; original fallback on Age.

Production deployment and live verification are reported separately after release.
