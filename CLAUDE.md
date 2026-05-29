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
- Sitemap: @astrojs/sitemap in astro.config.mjs (excludes /api/, /thank-you, /report, /newsletter/confirm)
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

---

## Phase 4 GSC Forensic Findings (2026-05-29)

No GSC export truncated (largest non-sitemap = 95 rows, well under the 1000 cap), so all counts are complete. Diagnosis only — no code changed.

### Findings ranked by impact × URL volume
1. **CRITICAL — Product reviews not getting indexed.** 52 of 55 discovered-not-indexed URLs are `/reviews/` products; sitemap `/reviews/` indexed at 23/78 (29%) vs `/top-ten/` 91%. Root cause: product↔list content duplication — `generateTopTenListSchema()` embeds the full product payload (title, image, verdict, specs, offers) into the list schema (schemaGenerator.ts:284-348), so standalone product pages add little unique value; compounded by SSR-on-every-request crawl cost.
2. **HIGH — Redirect-error chains.** 19 URLs. Stacked 301s: middleware.ts normalization (www/lowercase/tracking-param strip, lines 34-52) followed by page-level 301s in reviews/[slug].astro:22-30 and [category]/[slug].astro:81-83.
3. **MEDIUM-HIGH — Invalid `/tech/` category.** 14 URLs. `/tech/` is missing from the normalization map ([category]/[slug].astro:29-36), so these resolve incorrectly.
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

## Deploy stack: reverted to v12/Astro-5 Pages (2026-05-29)

The v12→v13 adapter upgrade (commit `64a53d6`, bundled with the 404 fix) broke the Cloudflare **Pages** deploy: `@astrojs/cloudflare` v13 targets **Workers** and emits `dist/server/wrangler.json` with an `ASSETS` binding (reserved in Pages) and a `SESSION` KV (no id; Pages can't auto-provision). Commits `b59fc3d` (added `rm -f dist/server/wrangler.json` band-aid) and `e57f1ad` (`wrangler:{enabled:false}` — not a valid v13 option) were failed fixes.

**Last-good production deploy = `2471b0b`** (observed in Cloudflare dashboard; identical to `64a53d6~1`). Reverted `package.json` + `pnpm-lock.yaml` + `astro.config.mjs` to that state (deps: cloudflare ^12.2.0, astro ^5.5.0, react ^4.2.0, sitemap ^3.3.0, check ^0.9.6, wrangler ^3.100.0). **Kept all HEAD source** (404 fix, etc.). `wrangler.toml` untouched (already matched known-good, has `disable_nodejs_process_v2`).

Verified locally: `pnpm install --frozen-lockfile` ✓; `pnpm build` → 0 errors / 0 warnings / 2 hints ✓; `dist/server/wrangler.json` absent ✓; `dist/` is Pages-style (`_worker.js/`, `_routes.json`) ✓. Build log still prints "Enabling sessions with Cloudflare KV" but v12 does **not** emit the breaking wrangler.json — informational only.

### ⚠️ OPEN post-deploy verification (do after the next successful deploy)
The reviews→top-ten **404 fix has NEVER run in a successful production deploy** — it only existed on the failed v13 builds. Once this v12 revert is live, re-run the curl traces to confirm the fix works on the v5 runtime:
- `https://toptenuae.com/reviews/best-air-fryers-uae-2026` → expect **301 to /top-ten/...**, NOT 404
- `https://toptenuae.com/best-air-fryers-uae-2026` (flat) → expect 301 to /top-ten/..., NOT 404
- `https://toptenuae.com/top-ten/best-air-fryers-uae-2026` → expect 200
(Prior diagnosis: `reviews/[slug].astro:19` 404s before the `_type==='topTenList'` redirect branch at lines 22-30, because `PRODUCT_BY_SLUG` is scoped to `_type=="product"`. Confirm `64a53d6`'s fix actually resolves this on v5.)