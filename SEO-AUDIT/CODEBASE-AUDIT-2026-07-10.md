# TopTenUAE codebase and content audit — 10 July 2026

## Scope and production baseline

- Shared Studio: `00-Shared-Core/universal-studio`, TopTen workspace registered in `sanity.config.ts` and `schemaTypes/topten/index.ts`.
- Frontend: Astro SSR on Cloudflare via `astro.config.mjs`; public Sanity reads use the published perspective in `src/sanity/lib/client.ts`.
- Published dataset: 88 `product`, 12 `topTenList`, 26 `category`, 15 `howTo`, 5 `deal`, 5 `holiday`, 3 `tool`, and 1 `author` document. There are currently no published `review` or `buyerGuide` documents.
- Existing document keys, `_type` values, slugs, and routes were retained. All schema additions in this change are optional.

## Findings by priority

### Critical

1. The repository-layer refactor did not type-check. `src/sanity/lib/fetchers.ts` re-exported names that the new repositories did not export; `src/repositories/search.repository.ts` and `src/repositories/sitemap.repository.ts` imported missing queries/types. The initial `pnpm run build` stopped with 10 errors. These seams are now repaired and the build passes.
2. Primary content in `src/pages/[category]/[slug].astro`, `src/pages/reviews/[slug].astro`, and `src/pages/top-ten/[slug].astro` used page-wide `client:load`. Astro SSR produced HTML, but the directive shipped a large hydration island for static article content. The directive is removed and `src/components/views/ArticleView.tsx` now uses direct server imports.
3. `src/lib/schemaGenerator.ts` fabricated `reviewCount: 1` when a list product had a rating without a count. The fallback is removed; aggregate ratings are emitted only when both values exist.

### High priority

1. Live reviews still use the legacy `product` type, not the newly-added `review` type. Schema work that only targets `review` would affect zero current pages. `schemaTypes/topten/product.ts` and `topTenList.ts` now carry the optional trust, evidence, freshness, UAE, audience, alternative, and disclosure fields consumed by the frontend.
2. 69 of 88 products have no author reference. `src/components/EditorialTrust.tsx` renders authors/reviewers and dates when populated, but this needs content backfill.
3. 23 of 88 product bodies contain fewer than 500 plain-text characters; 40 contain fewer than 1,000. Nine products have no `seo.metaDescription`. These are editorial thin-content risks, not problems code can truthfully fill automatically.
4. `src/pages/reviews/index.astro` claimed “100% Independent Testing” and stated that every item was bought and tested. The dataset does not substantiate that universal claim. Copy now describes editorial research and asks individual reviews to disclose their actual method.
5. `scripts/generate-sitemap.mjs` omitted all 26 category documents and ignored `seo.noIndex`. It now includes categories, excludes explicit noindex documents, escapes XML values, and generated 165 URL entries from 149 Sanity documents plus static routes.
6. Product and list GROQ projections omitted the complete `seo` object, author/reviewer, evidence, methodology, regional context, and new internal-linking fields. `src/sanity/queries/product.queries.ts` and `topten.queries.ts` now project them with old-document fallbacks.

### Medium priority

1. `src/pages/search.astro` omitted products and linked every result to `/{slug}`, which is wrong for products, lists, holidays, tools, and how-tos. Type-aware crawlable result links are now used. Search remains noindex.
2. `src/layouts/BaseLayout.astro` has good canonical and robots defaults, but `src/utils/seo-manager.ts` contains year-specific fallback copy (“updated for 2026”) that will become stale. Replace those fallbacks with timeless, factual language before 2027.
3. `src/pages/reviews/index.astro` and `src/pages/top-ten/index.astro` are fixed-size archives without pagination. They currently fit the dataset, but add server-rendered pagination before the product/list count makes the pages unwieldy.
4. The author schema now supports expertise and credentials, but there is no `/author/[slug]` route. Keep author references inline until enough verified profiles exist; then add indexable profile pages and update `Person.url`.
5. The Studio contains a legacy published `topTenCategory` type but no registered TopTen schema for it. Do not delete it; inventory references and plan a non-destructive migration to `category` if those documents are still needed.

### Optional

1. Replace deprecated image helpers reported by Astro check in `ArticleHero.tsx`, `ArticleSchema.tsx`, `PortableText.tsx`, `QuickSummaryTable.tsx`, `InstitutionCard.tsx`, `ProductCard.tsx`, and the category archive.
2. Remove stale Next.js/Vercel content from `README.md`; the actual application is Astro/Cloudflare.
3. Split the large `src/lib/schemaGenerator.ts` by visible page entity only after structured-data regression tests exist.

## File-by-file next actions

### Immediate

- `schemaTypes/topten/product.ts`: populate `author`, `lastReviewedAt`, `researchType`, `testingMethodology`, `sources`, and `uaeCommerce` for high-impression products.
- `schemaTypes/topten/topTenList.ts`: populate `methodology`, `keyTakeaways`, `sources`, `uaeContext`, and reviewer fields for all 12 live lists.
- `schemaTypes/topten/author.ts`: complete the one current author's bio, role, expertise, substantiated credentials, and image metadata.
- Sanity content: expand the 23 product reviews under 500 characters and write the nine missing SEO descriptions without changing slugs.
- Search Console: resubmit `/sitemap.xml` after the next normal production release and validate the product/list canonical clusters.

### Next

- `src/pages/reviews/index.astro` and `src/pages/top-ten/index.astro`: add SSR pagination and descriptive archive copy sourced from Sanity settings when content volume grows.
- `src/pages/[category]/index.astro`: add parent/child category navigation and related-guide links from existing category data.
- `src/components/EditorialTrust.tsx`: add links to author profiles only after a real route exists.
- `src/lib/schemaGenerator.ts`: add automated fixtures for Product, ItemList, Article, BreadcrumbList, and FAQPage and assert that no price, rating, or count is invented.
- `scripts/generate-sitemap.mjs`: generate a sitemap index and split files when URL volume warrants it; keep noindex filtering aligned with page queries.

### Later

- Add a safe, dry-run-only audit script that reports missing trust/region fields by document ID; review CSV output before any mutation.
- Introduce published `buyerGuide` pages only after their route, query, sitemap mapping, template, and internal-link strategy are complete.
- Evaluate legacy `topTenCategory` references and write an explicit migration/redirect plan if consolidation is worthwhile.

## Safe backfill order

1. Export document IDs/slugs and missing-field flags only; make no writes.
2. Fill the existing author profile, then attach `author` to the 69 missing products in reviewed batches.
3. Prioritise pages with impressions, backlinks, or commercial value. Add source records and a truthful `researchType` first.
4. Add UAE availability, VAT, warranty, shipping, compatibility, and `lastPriceCheckedAt` only after merchant verification.
5. Expand thin bodies and add unique SEO descriptions. Keep every current slug and canonical route.
6. Populate alternatives and related content after checking that each target is published and contextually useful.
7. Use Sanity revisions and small batches; do not bulk-publish automatically.
