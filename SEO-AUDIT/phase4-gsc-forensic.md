# TopTenUAE — Phase 4: GSC Forensic Audit
> Generated: 2026-05-29
> Inputs: 10 GSC coverage exports + sitemap reference set (`/SEO-AUDIT/gsc-exports/`)
> Sitemap snapshot date (per file header): 22.05.2026
> Constraint: **Diagnosis only. No code was modified.**
> Method: pandas in an isolated venv; counts + representative URLs computed, raw CSVs never pasted into context.

---

## 0. Executive Summary

**The headline problem is not the Phase-1 canonical hypothesis. It is the product-review catalog failing to index.**

- The sitemap lists **78 `/reviews/` product pages; only 23 are indexed (29%)**. **52** are *"Discovered – currently not indexed"* — Google found them via the sitemap but **will not even crawl them**.
- By contrast, **`/top-ten/` is 10/11 indexed (91%)** and `/how-to-guides/`, `/events-holidays/`, `/finance-tools/` index fine.
- The failure is concentrated entirely in `product` → `/reviews/{slug}`, and the root cause is unified: **product content is duplicated inside the Top-Ten list pages that embed it**, so the standalone review page reads as thin/duplicative and loses crawl priority.
- The 2 *"Duplicate, Google chose different canonical"* URLs are **both `/reviews/` baby-monitor products** that also appear in `/top-ten/best-baby-monitors-uae` — confirming the product↔list duplication mechanism, **not** the Phase-1 "list reachable at two URLs" mechanism.
- A second-order problem: topTenList content is reachable at **three URL variants** (flat `/{slug}`, `/reviews/{slug}`, `/top-ten/{slug}`), and the stacked 301s (middleware + page-level smart-redirect) produce **19 "Redirect error" URLs**.
- A large tail of **legacy migration debris** (WordPress AMP + taxonomy, Next.js `_next/static`) confirms a **WordPress → Next.js → Astro** history; mostly handled, but consuming crawl budget.

### Truncation check
**No CSV is truncated.** Largest non-sitemap bucket is `crawled-currently-not-indexed` at 95 rows; none approach the 1,000-row GSC export cap. Counts below are complete, not under-counts.

### Bucket sizes
| Bucket | Rows |
|---|---|
| sitemap-url-list (reference) | 122 |
| crawled-currently-not-indexed | 95 |
| not-found-404 | 77 |
| indexed | 65 |
| discovered-currently-not-indexed | 55 |
| page-with-redirect | 21 |
| blocked-by-robots | 20 |
| redirect-error | 19 |
| excluded-by-noindex | 11 |
| soft-404 | 8 |
| duplicate-google-chose-different-canonical | 2 |

---

## 1. Per-Export Analysis

For each: row count → Phase-1 route templates affected → root cause traced to a specific file/mechanism → evidence + example URLs.

### 1.1 `indexed.csv` — 65 rows (healthy baseline)
**Templates:** `/reviews/{slug}` ×24, `/top-ten/{slug}` ×10, `/how-to-guides/{slug}` ×9, legal ×5, `/events-holidays/{slug}` ×4, `/finance-tools/{slug}` ×3, hubs ×5, homepage ×1, `/upcoming` ×1.
**Read:** This is what *works*. Note `/upcoming` — an indexed URL that maps to **no Phase-1 route** and is **absent from the sitemap** (see §3). Likely a legacy stray.
**Caveat:** 22 of these 65 also appear in `crawled-currently-not-indexed` (see §2 overlap) — GSC report-window flux; treat as "currently indexed."

### 1.2 `discovered-currently-not-indexed.csv` — 55 rows ⭐ TOP FINDING
**Templates:** `/reviews/{slug}` ×**52**, `/top-ten/{slug}` ×1, `/finance-tools` hub ×1, `/travel-tourism` ×1.
**Root cause:** *Crawl demand collapse on the product catalog.* "Discovered, not indexed" means Google knows the URL (from `sitemap.xml`, `astro.config.mjs:20`) but has **chosen not to spend crawl budget** on it. The product pages are perceived low-value because their substantive content (title, image, verdict, price, specs, offer) is **re-rendered inside the Top-Ten list pages** by `generateTopTenListSchema()` (`src/lib/schemaGenerator.ts:284-348`) and the list templates (`TopTenTemplate.tsx`). Combined with **SSR-on-every-request** (`output:'server'`, `src/sanity/lib/client.ts`) — no static prerender — there is no crawl-efficiency signal to offset the low perceived value.
**Evidence:** The 52 are coherent catalog clusters, i.e. real pages, not junk:
- audio (earbuds/headphones) ×14, shavers/trimmers ×13, laptops ×7, baby monitors ×7, baby skincare ×6, air fryers ×3, other ×2.
- Examples: `/reviews/sony-wf-1000xm5-earbuds`, `/reviews/braun-series-9-pro-plus-shaver`, `/reviews/apple-macbook-air-m4-13-inch`, `/reviews/nanit-pro-smart-baby-monitor-uae`, `/reviews/cosori-air-fryer-dual-blaze`.
- Every one of these 52 is in the sitemap (§3).

### 1.3 `crawled-currently-not-indexed.csv` — 95 rows
**Templates:** `/reviews/{slug}` ×27, `/top-ten/{slug}` ×8, `_next/static/*` ×8, invalid `/tech/{slug}` ×8 (e.g. `quantum-computing-strategy-uae-2026`, `state-of-ai-december-2025-uae-report`), legal ×6, flat single-segment legacy ×~20 (`/best-wireless-earbuds-uae`, `/best-baby-skincare-uae`, `/about`, `/contact`), plus AMP legacy (`/affiliate-disclosure/amp/`, `/thank-you/amp/`).
**Root causes (three populations):**
1. **Real `/reviews/` + `/top-ten/` pages** (35) — same crawl-demand/duplication issue as §1.2; Google crawled but declined to index. Many of these *also* appear in `indexed` (flux).
2. **`_next/static/*` (8)** — Next.js build artifacts from a **previous deployment**; should never be crawlable. Confirms the migration history (`_backup_nextjs/` exists in repo).
3. **Flat legacy permalinks + `/tech/` + `/amp/`** — old URL shapes that now resolve to 404/soft-404/redirect (§1.6–1.9).
**Evidence:** `/tech/samsung-galaxy-s26-ultra-specs-uae-price` appears here **and** in redirect + redirect-error (triple churn).

### 1.4 `duplicate-google-chose-different-canonical.csv` — 2 rows ⭐ HYPOTHESIS TEST
**Both are `/reviews/{slug}`:**
- `/reviews/ezviz-c6n--baby-monitor/` (last crawled 2026-02-03)
- `/reviews/reolink-e1-pro-2k-camera-baby-monitor/` (2026-02-02)

**Root cause:** *Product↔list content duplication.* Both products are line items in the list `/top-ten/best-baby-monitors-uae` (in sitemap; see §1.5). The full product payload (image, verdict, specs, offer) is duplicated into that list via `generateTopTenListSchema()` (`schemaGenerator.ts:284-348`) and `TOP_TEN_LIST_QUERY`. With little unique text on the standalone page, Google folds the product into the list (or a sibling) as canonical.
**This REFUTES the Phase-1 top hypothesis as stated** — see §4 for the full verdict.
**Secondary signal:** both export URLs carry a **trailing slash** while the site is `trailingSlash:'never'` (`astro.config.mjs:98`) and both slugs contain a **double dash** (`c6n--baby-monitor`) — a slug-generation artifact in Sanity, worth noting but not the canonical driver.

### 1.5 `redirect-error.csv` — 19 rows ⭐ SECOND FINDING
**Templates:** `/reviews/{slug}` ×10, `/top-ten/{slug}` ×1, `/parenting-kids/{slug}` ×2, invalid `/tech/{slug}` ×1, flat legacy ×~5.
**Root cause:** *Stacked 301 chains exceeding Google's hop tolerance.* Two redirect layers compound:
1. `src/middleware.ts:30-56` — 301 for `www`, uppercase, and (implicitly) trailing-slash normalization.
2. `src/pages/reviews/[slug].astro:22-30` — when a `topTenList` is requested under `/reviews/`, it 301s to `/top-ten/{slug}`.
When a topTenList slug is hit as `https://www.toptenuae.com/reviews/best-air-fryers-uae-2026/` the chain is: www-strip → trailing-slash-strip → reviews→top-ten smart-redirect → final. Multi-hop chains read as "Redirect error."
**Evidence (same content, 3 URL variants all erroring):**
- `/reviews/best-air-fryers-uae-2026/` + `www.../reviews/best-air-fryers-uae-2026` (both here)
- `/reviews/best-beard-trimmers-uae/`, `/top-ten/best-beard-trimmers-uae/`, and flat `/best-beard-trimmers-uae/` (all three in this bucket or its overlaps)
- `/reviews/best-wireless-earbuds-uae/`, `/reviews/best-electric-shaver-uae/`
- Deal-style slugs that no longer resolve: `/reviews/lattafa-khamrah-perfume-deal`, `/reviews/samsung-galaxy-s25-ultra-deal-jan-2026`, `/reviews/evvoli-air-fryer-4l-super-saver-deal`.

### 1.6 `page-with-redirect.csv` — 21 rows
**Templates:** homepage variants ×3, `/parenting-kids/{slug}` ×2, invalid `/tech/{slug}` ×2, `/lifestyle/{slug}` ×2, `/deepseek-*` ×4, AMP ×2, others.
**Root causes (two populations):**
1. **Working-as-designed (healthy):** `http://toptenuae.com/`, `http://www.toptenuae.com/`, `https://www.toptenuae.com/` → 301 to canonical https non-www (`middleware.ts:34-37`). Just report noise.
2. **Category-move redirects:** `/lifestyle/how-to-pay-zakat-in-uae-online` and `/finance-tools/how-to-pay-zakat-in-uae-online` both redirect — the zakat content moved category, and `[category]/[slug].astro:81-83` 301s mismatched category → correct one. Also `/tech/...`, `/travel-tourism/world-safest-airlines-2026` (normalization map → `events-holidays`), `/smart-home/how-to-clean-washing-machine` (invalid category). AMP variants (`/deepseek.../amp`, `/terms-and-conditions/amp/`) redirect via the catch-all.

### 1.7 `not-found-404.csv` — 77 rows
**Templates:** `/reviews/{slug}` ×22, `/top-ten/{slug}` ×16, `_next/static/*` ×4, invalid `/tech/{slug}` ×3, flat legacy single-segment ×~25, malformed (`/&`, `/$`, `/*`, `/favicon.ico`, `/fonts/...`, `/best-electric-shaver-uae/https:/...`) ×~6.
**Root causes (mixed):**
1. **Legacy flat permalinks** (`/best-educational-toys-uae`, `/charity-organizations-uae-donations`, `/uae-holidays-2025`, `/where-to-donate-used-toys-uae`) — old WordPress/Next URL shape with no category prefix → `[category]/index.astro:25` returns 404 when `CATEGORY_PAGE_QUERY` finds no matching category.
2. **Deleted/renamed content** under `/reviews/` and `/top-ten/` (e.g. `/reviews/new-year-tech-upgrades-uae-2026` — note it's a *list* slug under `/reviews/`).
3. **Crawl junk / malformed** (`/&`, `/$`, `/*`, concatenated URLs) — bot-generated, ignorable.
4. **`_next/static` 404s** — leftover asset references from the Next.js deployment.

### 1.8 `soft-404.csv` — 8 rows
**Templates:** all flat single-segment legacy: `/how-to-clean-washing-machine`(+/), `/best-diaper-bags-uae`(+/), `/best-baby-toys`(+/), `/best-books-for-babys-first-library/`, `/nasa-astronaut-don-pettit-burj-khalifa-image-from-space/`.
**Root cause:** These flat URLs hit `[category]/index.astro` (interpreted as a category-hub slug). When the category lookup returns empty but the route still renders a shell/redirect rather than a hard 404, Google sees a "soft 404." The trailing-slash + non-slash pairs (`/best-baby-toys` and `/best-baby-toys/`) show both variants are being crawled.
**Evidence:** identical content reachable at slash/non-slash; `/nasa-astronaut...` and `/best-books-for-babys-first-library` also appear in `not-found-404` (state flux between soft-404 and hard-404).

### 1.9 `blocked-by-robots.csv` — 20 rows (mostly correct)
**Templates:** `/category/{slug}` ×9, `/deals/{slug}` ×5, `/author/{slug}` ×1, `/tag/{slug}` ×1, `/feed/` ×1, AMP ×2, flat ×1.
**Root cause:** `public/robots.txt` intentionally blocks `/category/`, `/author/`, `/tag/`, `/feed/` (WordPress legacy) and `/deals/` (the `Disallow: /deals/` rule, Phase-1 §5). **Working as designed** — these are legacy WordPress taxonomy URLs and legacy per-deal URLs that the Astro app no longer serves (deals is a single `/deals` page, Phase-1 §3).
**Note on the `/deals$` vs `/deals/` rule:** confirmed effective — `/deals` (hub) is indexed, while `/deals/samsung-galaxy-s25-ultra-deal-jan-2026`, `/deals/latest`, etc. are correctly blocked. No misfire.
**One concern:** these blocked legacy URLs still appear in Google's index memory; blocking via robots prevents a clean 410/404 signal, so they linger. Low priority.

### 1.10 `excluded-by-noindex.csv` — 11 rows
**Templates:** `/reviews/{slug}` ×4, `/category/{slug}` ×2, AMP ×2, `/top-ten/{slug}` ×1, `/thank-you` ×1, flat ×1.
**Root causes (mixed):**
1. **Correct:** `/thank-you` (Phase-1: `noIndex=true`).
2. **Mis-filed articles under `/reviews/`:** `/reviews/state-of-ai-december-2025-uae-report`, `/reviews/gmail-gemini-ai-features-2026`, `/reviews/apple-airpods-max-usb-c`, `/reviews/sony-wh-1000xm6-headphones-review`. These are news/article-type content sitting on the product route; `gmail-gemini-ai-features-2026` *also* appears in `not-found-404` and the same slug exists in the sitemap as `/how-to-guides/gmail-gemini-ai-features-2026` — i.e. the **same content at two routes**, one noindexed/404, one canonical.
3. **Legacy:** `/category/baby-kid/`, `/category/tech/` (WP), `/best-budget-buys-uae-amazon-deals-march-2025/amp` (WP AMP).

---

## 2. Cross-Cutting: Bucket Overlap

**58 URLs appear in ≥2 buckets.** The overlap pattern is itself diagnostic.

### 2.1 Triple-bucket URLs (highest instability)
| URL | Buckets | Meaning |
|---|---|---|
| `/tech/samsung-galaxy-s26-ultra-specs-uae-price` | crawled-not-indexed + page-with-redirect + redirect-error | invalid-category churn (§1.5, §4) |
| `/where-to-donate-used-toys-uae` | blocked-by-robots + crawled-not-indexed + not-found-404 | flat legacy URL crawled every which way |

### 2.2 `indexed` + `crawled-currently-not-indexed` (≈22 URLs) — report flux
e.g. `/top-ten/world-safest-airlines-2026`, `/about-us`, `/privacy-policy`, `/reviews/kenwood-air-fryer-grill-xl`, `/finance-tools/zakat-calculator`. These flip between states across the report window. Currently indexed; **borderline** stability — a warning that even indexed pages are weakly held.

### 2.3 Same content, multiple URL variants (the redirect-chain fingerprint)
`best-beard-trimmers-uae` is the cleanest example — it exists as **three** distinct GSC-tracked URLs:
- `/top-ten/best-beard-trimmers-uae` → indexed + redirect-error
- `/reviews/best-beard-trimmers-uae` → crawled-not-indexed + redirect-error
- `/best-beard-trimmers-uae` (flat) → crawled-not-indexed + redirect-error

Same for `best-air-fryers-uae-2026`, `best-wireless-earbuds-uae`, `best-electric-shaver-uae`. This is the **dual/triple-URL problem** manifesting as wasted crawl + redirect errors (not as duplicate-canonical).

### 2.4 ⭐ Sitemap URLs that are also in a NOT-indexed bucket
This is the most important overlap class: **the sitemap is actively asking Google to index URLs Google is rejecting.**
- **~50 sitemap `/reviews/` URLs** → `discovered/crawled-currently-not-indexed`.
- **9 sitemap `/top-ten/` URLs** → `crawled-not-indexed` or `redirect-error` (e.g. `/top-ten/best-beard-trimmers-uae` → redirect-error).
- `/ramadan-2026` (sitemap) → redirect-error; `/finance-tools` & `/travel-tourism` (sitemap hubs) → discovered-not-indexed.

---

## 3. Cross-Cutting: Sitemap Quality

| Metric | Value |
|---|---|
| Sitemap URLs (normalized unique) | 122 |
| ...indexed | 63 (52%) |
| ...in a not-indexed/excluded/redirect/404 bucket | 93* |
| ...not present in ANY GSC export | 0 |
| Indexed URLs MISSING from sitemap | **1** (`/upcoming`) |
| Sitemap URLs that are blocked-by-robots OR noindex (self-contradiction) | **0** ✅ |

\*63 + 93 > 122 because ~22 URLs sit in both `indexed` and `crawled-not-indexed` (flux, §2.2).

**By template:**
- `/reviews/` in sitemap: **78 → 23 indexed (29%)** ← the problem.
- `/top-ten/` in sitemap: **11 → 10 indexed (91%)** ← the control group; same architecture, indexes fine.

**Interpretation:**
- The sitemap is **honest and clean** — no junk, no blocked URLs, no noindexed URLs, no protocol/case variants. The `@astrojs/sitemap` filter (`astro.config.mjs:21-25`) is doing its job. The self-contradiction count of 0 is a genuinely good result.
- But the sitemap is **ineffective for `/reviews/`**: it floods Google with 78 product URLs, 55 of which Google won't index, which **dilutes crawl signal** for the whole sitemap. A sitemap that is 71%-rejected on its largest segment trains Google to trust it less.
- `/upcoming` indexed-but-not-in-sitemap is a minor orphan to investigate (no Phase-1 route serves it).

---

## 4. ⭐ Phase-1 Hypothesis Verdict: topTenList dual-canonical

**Phase-1 top hypothesis (§8, HIGH):** a `topTenList` reachable at both `/top-ten/{slug}` and `/{category}/{slug}` produces **conflicting canonicals** (`top-ten/[slug].astro:23` hardcodes `/top-ten/`, while `[category]/[slug].astro:95` uses the normalized category) → duplicate-content penalty.

### Verdict: **REFUTED as stated** (for the duplicate-canonical symptom), **PARTIALLY CONFIRMED** (as a redirect/crawl-waste problem).

**Why refuted:**
1. The `duplicate-google-chose-different-canonical` bucket contains **2 URLs, both `/reviews/{slug}` products** (`ezviz-c6n--baby-monitor`, `reolink-e1-pro-2k-camera-baby-monitor`) — **neither is a `/top-ten/` vs `/{category}/` pair.**
2. There is **no observed case** of one topTenList indexed at `/top-ten/X` while *also* indexed/duplicated at `/{category}/X`. The `/{category}/{slug}` route does not appear to be generating competing canonical indexed copies of list content.
3. What Google actually deduplicated is the **product↔list** relationship: the two baby-monitor products are embedded in `/top-ten/best-baby-monitors-uae`, and Google chose a different canonical because the standalone product page duplicates content already in the list.

**Why partially confirmed (different symptom):** the underlying *multiple-URLs-for-one-document* risk **is real and is firing** — but as **redirect errors and crawl waste**, not duplicate-canonical. topTenList slugs are being requested at flat `/{slug}` and `/reviews/{slug}` and 301'd to `/top-ten/{slug}` (`reviews/[slug].astro:22-24`), producing the §1.5 / §2.3 redirect-error cluster.

**Net:** The real, higher-volume canonical problem is **product pages losing canonical to the lists that embed them** (and 52 more never getting crawled for the same reason) — a *content-duplication* issue in `TOP_TEN_LIST_QUERY` / `generateTopTenListSchema()`, not a *URL-routing* canonical conflict.

---

## 5. Findings Ranked by Impact × URL Volume

| # | Finding | Volume | Impact | Fix difficulty | Risk of fix | Expected impact if fixed |
|---|---|---|---|---|---|---|
| **1** | **Product reviews not indexed** — 52 discovered + ~27 crawled-not-indexed + 2 dup-canonical; sitemap `/reviews/` only 23/78 indexed. Root: product content duplicated inside Top-Ten lists (`schemaGenerator.ts:284-348`, `TOP_TEN_LIST_QUERY`, `TopTenTemplate.tsx`) + SSR-only (no prerender). | ~55–80 URLs | **Critical** — the entire affiliate catalog is near-invisible in search | **High** — needs content differentiation (unique verdict/specs per product page; reduce duplicated payload in lists; link lists→products with strong unique value) + consider static prerender for `/reviews/` | Medium — touches queries, templates, schema, build mode | Could move dozens of product pages from "discovered" to "indexed"; directly grows affiliate-eligible surface |
| **2** | **Redirect-error chains** — topTenList content at 3 URL variants (flat, `/reviews/`, `/top-ten/`); stacked middleware + page-level 301s. | 19 (10 `/reviews/`) | **High** — wasted crawl + lost link equity + "error" coverage status | **Medium** — collapse chains to single-hop; ensure flat & `/reviews/` topTenList requests 301 once to `/top-ten/` after normalization, not before | Medium — redirect logic is subtle; risk of loops if mis-ordered (`middleware.ts` vs `reviews/[slug].astro`) | Clears 19 errors; recovers crawl budget; consolidates equity to `/top-ten/` |
| **3** | **Invalid `/tech/` category** — `tech` is a `product.reviewSection` enum, not a category, and absent from the normalization map (`[category]/[slug].astro:29-36`). 14 URLs churning across crawl/redirect/error/404. | 14 | **Medium-High** — unstable URLs, repeated re-crawl, no stable canonical | **Low-Medium** — add `tech`/`smart-home`/`beauty` → valid-category mappings, or 410 the legacy `/tech/` space | Low | Stabilizes 14 URLs to a single canonical or clean 410 |
| **4** | **Legacy migration debris** — WordPress AMP (12) + WP taxonomy/feed (14) + Next.js `_next/static` (12). Confirms WP→Next→Astro history. | ~38 | **Medium** — crawl-budget drain; AMP/`_next` shouldn't be crawlable | **Low** — return 410 for `/amp/`, `/feed/`, `/category/`, `/author/`, `/tag/`; ensure `_next/*` 404s fast (or 410) instead of being soft-served | Low | Frees crawl budget; removes stale URLs from index over time |
| **5** | **Flat legacy permalinks** — single-segment content URLs (`/best-*-uae`, `/how-to-clean-washing-machine`, etc.) hitting `[category]/index.astro` → 404/soft-404. | ~30 (404 + soft-404 + crawled) | **Medium** — lost legacy equity; soft-404s waste crawl | **Medium** — build a slug→`/{category}/{slug}` 301 map for high-value legacy slugs; hard-404 (or 410) the rest to kill soft-404s | Low-Medium — need to confirm each slug's current home in Sanity | Recovers equity for migrated content; eliminates 8 soft-404s |
| **6** | **Mis-filed articles under `/reviews/`** — news/AI articles (`gmail-gemini-ai-features-2026`, `state-of-ai-...`) on the product route; same content also at `/how-to-guides/`. noindex/404 churn. | ~4 | **Low-Medium** — duplicate routing, noindex confusion | **Low** — re-file in Sanity to correct content type so they route to `/how-to-guides/` only | Low | Removes duplicate-route confusion |
| **7** | **Protocol/www/homepage redirects** | 9 | **None** (working as designed, `middleware.ts:34-37`) | — | — | Report noise only; no action |
| **8** | **`/upcoming` orphan** — indexed, not in sitemap, no Phase-1 route. | 1 | **Low** | **Low** — identify source; add to sitemap or 410 | Low | Tidies index |

---

## 6. What Is Working (do not "fix")

- **robots.txt `/deals$` vs `/deals/`**: confirmed correct — hub indexed, sub-pages blocked. No misfire.
- **Sitemap hygiene**: 0 blocked/noindexed/variant URLs in sitemap; filter (`astro.config.mjs:21-25`) works.
- **www/http normalization**: clean single-purpose 301s.
- **`/top-ten/` indexing**: 91% — proof the architecture *can* index well when content isn't duplicated.
- **Legal/info pages**: indexed correctly.

---

## 7. Method Notes & Limitations
- Exports are GSC coverage snapshots (sitemap header dated 22.05.2026); buckets reflect a report window, hence the `indexed ∩ crawled-not-indexed` flux (§2.2).
- The `duplicate-google-chose-different-canonical` export does **not** include Google's *chosen* canonical URL (only the duplicate + last-crawled). The chosen-canonical (product→list) is **inferred** from the product↔list embedding architecture and the fact both products belong to `/top-ten/best-baby-monitors-uae`. Confirm in the GSC URL Inspection tool ("User-declared canonical" vs "Google-selected canonical") before acting.
- No code was read beyond Phase-1's already-documented files; all citations trace to Phase-1 line references or the GSC data itself.

---
*End of Phase 4 GSC Forensic Audit. Diagnosis only — no code modified. Recommended next phase: prioritized remediation plan starting with Finding #1 (product-page differentiation + indexability) and #2 (redirect-chain collapse).*
