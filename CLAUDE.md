Operating principles for this project:
- Understand architecture before proposing changes.
- Identify root causes, not symptoms.
- Evidence-based only: cite file paths and line numbers for every claim.
- Trace implementations through the codebase before concluding.
- For any fix (later phases): state expected impact, risk, and difficulty.
- Preserve existing functionality unless told otherwise.
- Never modify code in Phases 1–3.
- Persist findings to /SEO-AUDIT/ and keep CLAUDE.md updated.

Project layout:
- topten-uae: Astro frontend (routing, SEO, rendering)
- universal-studio: Sanity Studio backend (multi-project; toptenuae at project kxdjzy8e)
- topten: Sanity schema files (10 content types)

---

## Project Memory Summary (updated 2026-05-29)

### Stack
- Astro 6.4.1, SSR output, @astrojs/cloudflare adapter
- Cloudflare Pages + Workers (deploy: `pnpm build && wrangler pages deploy dist`)
- Sanity CMS (projectId: kxdjzy8e, dataset: production, apiVersion: 2025-12-01)
- React 19 islands, Tailwind CSS 4, pnpm >=9, Node >=20
- Site URL: https://toptenuae.com

### Routing (all SSR)
- `/` — Homepage
- `/top-ten`, `/top-ten/[slug]` — TopTenList content
- `/reviews`, `/reviews/[slug]` — Product reviews
- `/deals` — Aggregated deals feed (no individual deal pages)
- `/[category]` — Category listing hub (blocks 'reviews', 'deals')
- `/[category]/[slug]` — Multi-type dispatcher (topTenList/howTo/tool/holiday/article)
- `/api/*` — Cloudflare Workers (subscribe, revalidate, amazon-sync)

### Content Types (Sanity)
topTenList → /top-ten/{slug}
product    → /reviews/{slug}
tool       → /finance-tools/{slug}  (via [category]/[slug] dispatch)
howTo      → /how-to-guides/{slug}  (via [category]/[slug] dispatch)
holiday    → /events-holidays/{slug} (via [category]/[slug] dispatch)
category   → /{slug} (hub listing)
deal       → /deals (aggregated, no individual URL)
author, siteSettings, institution, aviationEntity (supporting types)

### Category normalization map ([category]/[slug].astro:29-36)
travel-tourism → events-holidays
health-fitness → lifestyle
baby-kid       → parenting-kids
buyers-guide   → reviews

### SEO implementation
- All meta/OG/Twitter/canonical: src/layouts/BaseLayout.astro
- JSON-LD (14 schema types, master dispatcher): src/lib/schemaGenerator.ts
- Organization schema on every page (BaseLayout.astro:36-66)
- Sitemap: SINGLE authoritative `/sitemap.xml` = `public/sitemap.xml`, generated from Sanity by `scripts/generate-sitemap.mjs`, now run in the build step (`package.json` build) so it AUTO-REGENERATES on every deploy. @astrojs/sitemap REMOVED (2026-05-31) — see dated note below. robots.txt → /sitemap.xml.
- robots.txt: public/robots.txt (strict; blocks /deals/, /api/, AI bots rate-limited)
- URL normalization/security headers: src/middleware.ts
- Cache headers: public/_headers

### Known technical risks (see /SEO-AUDIT/phase1-architecture.md §8)
1. HIGH: TopTenList canonical mismatch — /top-ten/{slug} and /{category}/{slug} can both resolve with different canonicals
2. MEDIUM: Dual-route overlap for topTenList content
3. MEDIUM: SSR on every request (Sanity CDN mitigates but crawl spikes could be slow)
4. LOW: /search page may be indexable (not in sitemap exclusions, noIndex not confirmed)
5. LOW: Thin category listing pages if few items exist

### Audit artifacts
- /SEO-AUDIT/phase1-architecture.md — Full architecture report (Phase 1, 2026-05-29)
- /SEO-AUDIT/phase4-gsc-forensic.md — Forensic GSC coverage audit (Phase 4, 2026-05-29)
- /SEO-AUDIT/phase6-schema-enablement.md — Schema enablement (Phase 6, 2026-05-30). CORRECTED RECORD: the audit's "topTenList.mainImage absent / highest-value gap" claim was WRONG — mainImage AND author both EXIST on topTenList (topTenList.ts:46-52, 102-116) and all 11 docs are populated. Only real gap = product.author (now added, optional). Null top-ten OG = data-population, NOT a schema gap. Verify schema presence against the on-disk source file by sha, not a derived artifact.

---

## Phase 4 GSC Forensic Findings (2026-05-29)

No GSC export truncated (largest non-sitemap = 95 rows, well under the 1000 cap), so all counts are complete. Diagnosis only — no code changed.

### Findings ranked by impact × URL volume
1. **CRITICAL — Product reviews not getting indexed.** 52 of 55 discovered-not-indexed URLs are `/reviews/` products; sitemap `/reviews/` indexed at 23/78 (29%) vs `/top-ten/` 91%. ~~Root cause: product↔list content duplication — `generateTopTenListSchema()` embeds the full product payload into the list schema (schemaGenerator.ts:284-348)~~ **← DUPLICATION THEORY REFUTED & CLOSED (see §T3.0 below).** Real root cause = **crawl demand** (Branch a): GSC URL Inspection shows 3/4 sampled products "Discovered – currently not indexed" with **Crawled: N/A (never crawled)** — a page Google never fetched cannot be judged a duplicate. **Do NOT touch schemaGenerator.ts:284-348 or TOP_TEN_LIST_QUERY.** Remediation = internal-linking + sitemap pruning + crawl-budget (§T3a in phase5-remediation-plan.md).
2. **HIGH — Redirect-error chains.** 19 URLs. Stacked 301s: middleware.ts normalization (www/lowercase/tracking-param strip, lines 34-52) followed by page-level 301s in reviews/[slug].astro:22-30 and [category]/[slug].astro:81-83.
3. ~~**MEDIUM-HIGH — Invalid `/tech/` category.** 14 URLs. `/tech/` is missing from the normalization map ([category]/[slug].astro:29-36), so these resolve incorrectly.~~ **← CLOSED 2026-05-30 as a MIS-DIAGNOSIS.** Sanity says `tech` IS a live category (`count(category, slug=="tech")`=1); `smart-home` and `beauty` do not exist (count 0) and `/beauty/` appears in 0 GSC rows. The live `/tech/` URLs are correctly-filed `howTo` docs (categories `how-to-guides`/`upcoming`) that the dispatcher ALREADY 301s off `/tech/` ([category]/[slug].astro:73-82) — that's why they sit in `page-with-redirect`. The churn is trailing-slash/redirect-chain (T1-A), NOT a map gap. **DO NOT add tech/smart-home/beauty to `normalizeCategory`** — `tech→reviews` would wrongly bounce valid-tech docs and manufacture the very chains T1-A removes. Only genuinely-dead `/tech/` URLs are the two-segment `deepseek-ai-*` slugs (no live doc → already 404 correctly).
4. **MEDIUM — Legacy migration debris.** ~38 URLs from WordPress (AMP, /category/, /tag/, /author/, /feed/) and Next.js (`_next/static`) generations surfacing as 404s.
5. **MEDIUM — Flat legacy permalinks → soft-404s.** 8 soft-404 URLs from old flat permalink structure.

### Hypothesis verdict
- Phase-1 top hypothesis (topTenList dual-canonical /top-ten vs /{category}) **REFUTED as stated.** The 2 duplicate-google-chose-different-canonical URLs are both `/reviews/` baby-monitor PRODUCTS, not list pairs. The dual-URL risk is real but manifests as redirect-errors (Finding #2), not duplicate-canonical.
- **Caveat:** the duplicate-canonical export lacks Google's chosen canonical column; confirm the product→list inference via GSC URL Inspection before acting.

### What is working
- robots.txt blocking effective (20 blocked-by-robots URLs are all intended blocks).
- Sitemap clean: 0 self-contradictions; only orphan is `/upcoming`.
- `/top-ten/` indexing healthy (91%).

### Report-window caveat
22 URLs appear in BOTH indexed AND crawled-not-indexed — GSC report-window flux, not a contradiction.

---

## Deploy trigger (CORRECTED 2026-05-30): git push = deploy

**Production deploys via `git push origin main` → Cloudflare Pages git-CI build (clone →
build → deploy).** Verified: every pushed commit gets a GitHub **check-run** "Cloudflare
Pages" (app "Cloudflare Workers and Pages") whose `details_url` is the dashboard
deployment (e.g. `2c0f228` → deployment `5c3dc4ae`, success). CF Pages reports via
check-runs, **NOT** the GitHub Deployments API (the `vercel[bot]` entries in that API are
dead Next.js-era history — Vercel integration stopped Feb 12; 21+ commits since with zero
Vercel builds). `wrangler pages deploy dist` is a **manual fallback only** (needs
`wrangler login`; no CF token in env). To verify a deploy: poll the "Cloudflare Pages"
check-run on the commit until `completed/success`, then curl live `toptenuae.com`.

**This is WHY the v12/v13 `wrangler.json` issue happened:** Cloudflare builds the project
itself in CI from git, so a bad build output (the v13 adapter's `dist/server/wrangler.json`)
breaks the Pages deploy — it's not a local-only artifact.

## Amazon PA API
- **Keys rotated 2026-05-30** — prior access keys deactivated. (Still gated for live
  pricing eligibility; stale-price removal already shipped — see below.)

## Deploy stack: reverted to v12/Astro-5 Pages (2026-05-29)

The v12→v13 adapter upgrade (commit `64a53d6`, bundled with the 404 fix) broke the Cloudflare **Pages** deploy: `@astrojs/cloudflare` v13 targets **Workers** and emits `dist/server/wrangler.json` with an `ASSETS` binding (reserved in Pages) and a `SESSION` KV (no id; Pages can't auto-provision). Commits `b59fc3d` (added `rm -f dist/server/wrangler.json` band-aid) and `e57f1ad` (`wrangler:{enabled:false}` — not a valid v13 option) were failed fixes.

**Last-good production deploy = `2471b0b`** (observed in Cloudflare dashboard; identical to `64a53d6~1`). Reverted `package.json` + `pnpm-lock.yaml` + `astro.config.mjs` to that state (deps: cloudflare ^12.2.0, astro ^5.5.0, react ^4.2.0, sitemap ^3.3.0, check ^0.9.6, wrangler ^3.100.0). **Kept all HEAD source** (404 fix, etc.). `wrangler.toml` untouched (already matched known-good, has `disable_nodejs_process_v2`).

Verified locally: `pnpm install --frozen-lockfile` ✓; `pnpm build` → 0 errors / 0 warnings / 2 hints ✓; `dist/server/wrangler.json` absent ✓; `dist/` is Pages-style (`_worker.js/`, `_routes.json`) ✓. Build log still prints "Enabling sessions with Cloudflare KV" but v12 does **not** emit the breaking wrangler.json — informational only.

### ✅ RESOLVED — post-deploy verification (live on `f109f8c`, 2026-05-29)
The reviews→top-ten **404 fix is confirmed working in production** on the v12/v5 runtime. Live curl traces:
- `https://toptenuae.com/reviews/best-air-fryers-uae-2026` → **301 → /top-ten/...** ✅
- `https://toptenuae.com/reviews/best-beard-trimmers-uae` → **301** ✅
- `https://toptenuae.com/top-ten/best-air-fryers-uae-2026` → **200** ✅
- `https://toptenuae.com/top-ten/best-beard-trimmers-uae` → **200** ✅

### ✅ RESOLVED — flat single-segment slug bug (Finding #5) + global soft-404 (§1.8) (fixed + verified live, 2026-05-29)
**Was:** `https://toptenuae.com/best-air-fryers-uae-2026` (flat) → **302 → /404** — two defects: (1) 302 instead of 301; (2) 404'd despite the slug being live at `/top-ten/...`. Source was `src/pages/[category]/index.astro` `if (!data) return Astro.redirect('/404')` — `CATEGORY_PAGE_QUERY` is `_type=="category"`-scoped, so any non-category single-segment slug returned null → 302→/404, with no doctype fallback (unlike `[category]/[slug].astro:45`).

**Fix (2 files):**
- `src/pages/[category]/index.astro` — on a category miss, a doctype probe (`*[slug.current==$slug][0]{_type, cat, cats}`) now drives a **three-way**: live doc → **301 (permanent)** to its terminal canonical (topTenList→/top-ten, product→/reviews, tool→/finance-tools, howTo→/how-to-guides, holiday→/events-holidays, using `normalizeCategory` mirrored from `[category]/[slug].astro` so the target is final = single hop); known-dead legacy slug → **410**; everything else → **hard 404**. A cheap `SLUG_RE` guard short-circuits malformed/bot junk to 404 *before* any Sanity call (net cost win — junk now hits 0 queries). `LEGACY_GONE` set is intentionally **empty** this round (real-sourced from `gsc-exports/soft-404.csv` but uncurated; populating it is a separate pass — 4 vetted-dead candidates documented inline; `how-to-clean-washing-machine` excluded because it's LIVE at `/how-to-guides/...`).
- `src/pages/404.astro` — added `Astro.response.status = 404;` (mirrors `410.astro`). Site-wide effect: the rendered `/404` page now returns **404 status instead of 200**, killing soft-404s everywhere (every `Astro.rewrite`/`Astro.redirect` to `/404` now terminates as a true 404). Only global side-effect; no routing/content change.

**Live verification (post-deploy) — all 5 branches confirmed live:** flat live-list → 301→/top-ten/→200 (single hop) ✅; flat live-product → `/ugreen-clipbuds-open-earbuds` → 301→/reviews/ugreen-clipbuds-open-earbuds→200 (single hop) ✅; dead legacy → bare 404 ✅; junk → bare 404, no Location (soft-404 fixed) ✅; category hub → 200 ✅.

**Left untouched (intentional):** `[category]/index.astro` lines ~81-82 (`categorySlug==='null'` → `Astro.redirect('/404')`, still 302) — only fires when `data` exists (real category, bad slug), not the flat-miss case; its terminal page now correctly 404s as a side benefit.

---

## §T3.0 VERDICT — catalog-indexing root cause = Branch (a) CRAWL DEMAND, not duplication (2026-05-29)

**Decision: the product↔list duplication theory (Phase-4 Finding #1) is REFUTED and CLOSED.** GSC URL Inspection is decisive:
- 3 of 4 sampled `/reviews/` products = "Discovered – currently not indexed" with **Crawled: N/A** — Google has **never fetched** them. A never-crawled page cannot be judged a duplicate; the duplication hypothesis is logically impossible as the cause.
- The one indexed product (`ugreen-clipbuds-open-earbuds`) reports a **healthy self-canonical** — no duplicate-canonical demotion. This rules out duplication even where crawling did happen.

**Therefore the root cause is crawl demand (Branch a): Google isn't crawling product URLs because they have almost no internal-link signal.** Confirmed by the live-template trace — top-ten lists embed each product inline but link out only via `rel="nofollow"` affiliate CTAs (`ProductCard.tsx:278-285`); category hubs exclude `product` from their item query (`legacy.queries.ts:66-69`); `ProductView.tsx` is an internal dead-end (0 outbound links); `RelatedContent.tsx` would link `/reviews/{slug}` but is never mounted; only `/reviews` hub links products directly, capped `[0...50]` (`legacy.queries.ts:110`), leaving ~28 products with effectively zero follow-able internal links.

**Hard constraints:**
- **Do NOT touch** `schemaGenerator.ts:284-348` (`generateTopTenListSchema`) or `TOP_TEN_LIST_QUERY` — no schema/dedup refactor.
- Remediation is **internal-linking + sitemap pruning + crawl-budget only**. Full plan: **§T3a in `/SEO-AUDIT/phase5-remediation-plan.md`**.
- Measurement window 8–12 weeks; KPIs: `/reviews/` indexed ratio (29% → target) and GSC "Discovered – currently not indexed" count trending down.

---

## Stale-price removal (2026-05-30) — visible price + JSON-LD reconciled

No PA-API access (Amazon eligibility gate unmet) → hardcoded Sanity `price`/`currency`
were stale vs live Amazon.ae and a trust/compliance risk. Fix: stop asserting any
price OR stock; rely on the "Check Price on Amazon.ae" CTA for live price.

- **Visible:** show `priceTier` (Budget/Mid-Range/Premium) instead of a number.
  `ProductCard.tsx` (footer "Price Level: {tier}"), `ProductTemplate.tsx` (removed
  "BEST PRICE FOUND / AED X" + green "IN STOCK" badge → "{tier} · Check live price on
  Amazon.ae"), `TopTenTemplate.tsx:153` (QuickVerdict card → tier; QuickVerdict.tsx
  itself unchanged — driven by that upstream value), and `RelatedContent.tsx:56-58`
  (the "Top Rated in this Category" grid on review pages — 3rd surface, found after the
  first pass; its query `RELATED_FOR_PRODUCT` in `product.queries.ts` now fetches
  `priceTier` instead of `price`/`currency`). 6 source files total + this file.
- **JSON-LD:** dropped `price`, `priceCurrency`, `availability` (and `priceValidUntil`)
  from all THREE product offer emitters; kept `url` + `seller` (affiliate signal).
  `schemaGenerator.ts:211-217` (generateProductSchema) and the §T3.0-gated
  `generateTopTenListSchema` offers block (offer-fields-only deletion, no list-item/
  dedup/aggregateRating/additionalProperty changes), plus the inline ItemList offer in
  `TopTenTemplate.tsx`. Page and schema now AGREE: no price, no stock anywhere.
- Tradeoff: lose merchant-listing price-in-SERP eligibility; KEEP review-star snippets
  (aggregateRating/review are price-independent). Reversible when PA-API lands.
- Orphaned `cleanPrice`/`priceValue` vars left in `schemaGenerator.ts` deliberately to
  keep the gated edit surgical — remove in a separate cleanup pass.
- **Deals price honesty (CORRECTED 2026-05-31):** the earlier "treat deals like products /
  strip price" framing was WRONG — a deal IS a price claim; stripping destroys the page.
  Implemented instead: (1) auto-hide expired deals via `dealEndDate > now()` gate on all 3
  deal queries (`deal.queries.ts`) + `DealsFeed.tsx` + the aggregate schema in
  `deals/index.astro` (undated = evergreen; `isActive` = manual kill-switch); (2) per-card
  "Last updated" stamp from `_updatedAt` (`DealCard.tsx`) + dynamic page footer date;
  (3) KEEP price + `priceValidUntil=dealEndDate`, but omit the `getNextYearDate()`
  fabrication when no end date (`generateDealSchema`), and add per-offer `priceValidUntil`
  in the `AggregateOffer`.
  - **FAST-FOLLOW (still TODO):** the `/deals` hero "Summer Deals Are Live Now" banner +
    3 hardcoded coupon codes (`AHBMAY20`/`HELLOPRIME`/`NEW10`) are hardcoded/time-bound and
    unverifiable — make them CMS-managed via `siteSettings` (headline + `dealCoupons[]` +
    active toggle, current values as fallback) so they don't go stale.
- **NEXT PASS (editorial prose — triage, do NOT blanket-strip):** full-page scan found
  `AED <number>` still in editor-written copy (NOT templated price fields; JSON-LD `Offer`s
  are clean — these are in `description`/FAQ `text` strings only).
  - SOON — specific per-product price claims in product `verdict` ("At AED 39", "under
    AED 70", "under AED 100"): soften to qualitative ("a budget pick"); they read as stale
    per-product prices. Affected products incl. `philips-shaver-series-1000-s1151`,
    `xiaomi-redmi-buds-6-play-earbuds`, `soundcore-anker-p20i-earbuds` (full list pulled
    via GROQ `verdict match "*AED *"`). `listItems[].customVerdict`: 0 affected.
  - KEEP — general FAQ range guidance ("expect to pay AED 800–1,500") in `faqs[].answer`
    across 7 lists (best-electric-shaver-uae, best-beard-trimmers-uae, best-wireless-earbuds-uae,
    best-air-fryers-uae-2026, best-laptops-uae, best-noise-cancelling-headphones-uae,
    best-baby-monitors-uae): SEO-useful for "price uae" queries, ages slowly; just add a
    "prices approximate, as of [month]" caveat rather than deleting.

---

## Sitemap auto-regeneration + single authoritative sitemap (2026-05-31)

**Problem:** `/sitemap.xml` is a STATIC file (`public/sitemap.xml`) generated by a MANUAL
script (`scripts/generate-sitemap.mjs`, a Sanity-querying Node script) that was NOT wired
into the build — so it froze (~4 months, last refreshed Feb 8) and newly-published posts
were missing. `@astrojs/sitemap` was ALSO configured but only ever emitted static `.astro`
routes (SSR content routes have no `getStaticPaths` → invisible to it) into a redundant
`/sitemap-0.xml`; it was never the sitemap Google used.

**Fix (deployed `b217584`, verified live):**
- `package.json` build = `node scripts/generate-sitemap.mjs && astro check && astro build`
  → the sitemap now AUTO-REGENERATES from Sanity on **every deploy** (manual step + freeze
  risk eliminated). Publishing reflects in the sitemap on the next deploy.
- `scripts/generate-sitemap.mjs` hardened: 15s bounded fetch (`Promise.race`) so a slow
  Sanity can't hang CI; resilient `catch` keeps the last-committed `public/sitemap.xml` as
  fallback (exit 0) instead of failing the deploy on a Sanity hiccup.
- `@astrojs/sitemap` REMOVED from `astro.config.mjs` → single authoritative `/sitemap.xml`
  (124→127 URLs live). `/sitemap-0.xml` + `/sitemap-index.xml` now 404. Only routes dropped
  vs the plugin: `/410`, `/search`, `/subscribe` (correctly non-indexed — also closes the
  Phase-1 LOW risk #4 about `/search` being indexable).
- Trade-off: `public/sitemap.xml` is rewritten by each local build (minor git churn); it
  stays tracked as the CI fallback. Freshness is per-DEPLOY, not per-publish (SSR endpoint
  #2B was deliberately rejected as higher-risk).
- `scripts/generate-sitemap.mjs` owns the canonical routing/normalization + `STATIC_ROUTES`
  list — update THAT script (not astro.config) for any sitemap route changes.

---

# Parked / Future

## Arabic (en + ar bilingual) — PARKED until English is indexing well
- Decision (2026-05-30): defer Arabic build until the English catalog is
  crawling/indexing (re-evaluate after the 4-8wk internal-linking window, ~mid-July).
- Old WordPress/Polylang Arabic content is GONE — this is content CREATION from
  scratch, not migration.
- When built: Astro native i18n, en at root + ar under /ar/ subdirectory;
  Sanity @sanity/document-internationalization for linked translations; hreflang
  (en-ae / ar-ae / x-default) in BaseLayout; RTL is a full front-end workstream
  (dir=rtl, mirrored layouts, Arabic fonts, Tailwind logical properties), NOT
  just translation; sitemap i18n block for both locales.
- Do NOT restructure current English URLs in the meantime — they become the
  canonical `en` set.
- Reconsider machine-translation carefully: unreviewed MT Arabic risks
  thin-content penalties and would worsen the existing indexing problem.