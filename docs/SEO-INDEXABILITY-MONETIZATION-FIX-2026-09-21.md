# SEO / Indexability / Monetization Fix — Sprint 1

Date: 2026-09-21  
Production: `https://toptenuae.com`  
Source audit: `docs/SEO-INDEXABILITY-MONETIZATION-AUDIT-2026-09-21.md`

This report covers only the five scoped Sprint 1 priorities. No homepage performance work, broad SEO restructuring, indexation expansion, affiliate tracking implementation, or editorial content expansion was changed.

## Fixed

### 1. Sitewide broken calculators navigation link

- **Issue:** the mobile navigation in `src/components/Header.astro` linked to `/calculators`, which returned 404 on production and appeared on every audited sitemap page.
- **Evidence before change:** `/finance-tools` returned 200, was `index, follow`, and had a self-canonical; `/calculators` returned 404.
- **Implementation:** changed the authored navigation destination and label from `/calculators` / `Calculators` to `/finance-tools` / `Finance Tools`. No duplicate compatibility route was created.
- **Repository search:** no other genuine internal route reference to `/calculators` remained. Matches such as `src/lib/calculators/loan-emi.js` and prose containing the generic word “calculators” are not URL defects and were not changed.
- **Production verification:** desktop and mobile navigation markup both contain `/finance-tools` and no `/calculators`; the interactive header search opens and submits to `/search`; `/finance-tools` returns 200/indexable/self-canonical. `/calculators` remains an intentionally unlinked 404.

Affected file: `src/components/Header.astro`

### 2. Wireless-earbuds category hub

- **Issue:** Sanity category `f8ccfedf-bda2-4a57-98d3-b86454c687fa` stored `Wireless-earbuds`. Middleware lowercased requests while the category query required an exact slug, leaving `/wireless-earbuds` as 404 and excluding it from sitemap generation.
- **Implementation:** changed only `slug.current` to `wireless-earbuds` using a revision-guarded Sanity transaction.
- **Production verification:** `/wireless-earbuds` returns 200, declares `index, follow`, and self-canonicalizes to `https://toptenuae.com/wireless-earbuds`. The title and H1 are “Best Wireless Earbuds in UAE: Reviews & Rankings (2026)”. The category page renders 11 distinct product-review links. No uppercase internal URL is rendered.
- **Case handling:** `/Wireless-earbuds` makes one 301 hop to `/wireless-earbuds`, then returns 200. No redirect chain or duplicate uppercase sitemap URL was introduced.

Affected CMS document: Sanity category `f8ccfedf-bda2-4a57-98d3-b86454c687fa`

### 3. Authored internal tracking parameter

- **Issue:** `/how-to-guides/uae-school-hair-makeup-grooming-rules` linked internally to `https://toptenuae.com/laptops/how-to-choose-a-laptop-in-uae?utm_source=chatgpt.com`.
- **Implementation:** changed that keyed Portable Text link to `https://toptenuae.com/laptops/how-to-choose-a-laptop-in-uae` using a revision-guarded Sanity transaction.
- **Scope check:** a production-dataset scan found this was the only internal TopTenUAE link containing `utm_source=chatgpt.com`. An external Ministry of Education URL containing that parameter was intentionally not changed.
- **Production verification:** the article returns 200/indexable/self-canonical and no longer renders the tracked internal URL. The full sitemap crawl found zero internal links carrying that parameter.

Affected CMS document: Sanity how-to `a055384f-50ae-49dc-878e-36bb5be9a538`

### 4. Repository sitemap drift

- **Issue:** the committed sitemap had 294 URLs while production had 297.
- **Implementation:** ran `scripts/generate-sitemap.mjs` against the current published Sanity dataset and committed the generated `public/sitemap.xml`; the list was not manually maintained.
- **Result:** 298 URLs: the three previously production-only entries are now represented in the repository, plus the corrected `/wireless-earbuds` hub.
- **Production verification:** live `/sitemap.xml` returns 200 and contains 298 unique URLs, including `/wireless-earbuds` and excluding `/calculators`. All 298 return 200, are indexable, have no redirect response, and are self-canonical (treating the equivalent homepage forms with/without the terminal slash as the same URL).

Affected file: `public/sitemap.xml`

## Blocked

### Mustela Vitamin Barrier Cream 1-2-3

URL: `/reviews/mustela-vitamin-barrier-cream-123`

- The existing destination `https://link.amazon/B0dS1jGmQ` is broken; the embedded normalized ASIN `B0DS1JGMQ` returns Amazon.ae “Page Not Found”.
- The Sanity record has no ASIN, model, size, specifications, description, or variant identifier. Its source image and filename identify Mustela Vitamin Barrier Cream 1-2-3 but do not show a pack size.
- Amazon.ae currently exposes multiple materially different candidates, including 50 ml, 100 ml, and 108 g listings. Several are orderable, but the page record does not prove which reviewed variant is intended.
- **Decision:** no affiliate field was changed and no replacement was guessed. The broken CTA remains live pending manual confirmation of the exact pack size/SKU. No tracking parameter was fabricated or removed.

### Six laptop reviews

Each page remains 200/indexable/self-canonical but unmonetized. No affiliate destination or CTA was added because an exact orderable Amazon.ae offer could not be validated.

| Review | Exact Amazon.ae check | 2026-09-21 result | Action |
|---|---|---|---|
| `/reviews/acer-nitro-v-16-ai-laptop` | `B0FWXM6R9N`, Acer Nitro V 16 AI / Ryzen 5 240 / RTX 5050 | Exact listing; “Currently unavailable” | Left unmonetized |
| `/reviews/apple-macbook-air-m2-2022` | stored `B0DLHK2MMY`, resolved by Amazon to variant `B0DLHFZ7TW`, MacBook Air 13-inch M2 / 16 GB / 256 GB | Exact listing; “Currently unavailable” | Left unmonetized |
| `/reviews/apple-macbook-air-m4-13-inch` | `B0DZDXCFJQ`, 13-inch MacBook Air M4 / 16 GB / 512 GB | Exact listing; “Currently unavailable” | Left unmonetized |
| `/reviews/asus-proart-p16-h7606wp-rtx-5070` | `B0GPRL4RDG`, ASUS ProArt P16 H7606WP / RTX 5070 | Exact listing; “Currently unavailable” | Left unmonetized |
| `/reviews/hp-14-n150-16gb-student` | `B0FPXJ6G6B`, HP 14 / Intel N150 / 16 GB | Exact listing; “Currently unavailable” | Left unmonetized |
| `/reviews/lenovo-yoga-slim-7x-14q8x9` | `B0DQRH3LQL`, Lenovo Yoga Slim 7x / Snapdragon X Elite / 16 GB / 1 TB | Exact listing, but no direct buy box; “See All Buying Options” only | Left unmonetized |

Availability statements above are limited to the exact Amazon.ae checks performed on 2026-09-21. Unrelated “available items” and cart recommendations were not treated as offers for the reviewed product.

## Not changed

### Eleven noindex commercial products

The following pages remain `noindex, nofollow` and were not added to the sitemap. Indexation still requires the separate editorial-readiness review required by the audit.

1. `/reviews/bugaboo-butterfly-2-uae`
2. `/reviews/chicco-bravo-travel-system-uae`
3. `/reviews/cybex-gazelle-s-uae`
4. `/reviews/cybex-libelle-2025-uae`
5. `/reviews/hauck-rapid-4-uae`
6. `/reviews/joie-nutmeg-uae`
7. `/reviews/stokke-yoyo3-6-plus-uae`
8. `/reviews/hugo-boss-man-edt-75ml`
9. `/reviews/joop-homme-edt-125ml`
10. `/reviews/lattafa-raghba-edp-100ml`
11. `/reviews/nautica-voyage-edt-100ml`

### Orphan and thin hubs

- No internal-link restructuring was performed for `/gaming-consoles`, `/home-kitchen`, `/mobile-accessories`, `/ramadan-2026`, `/schools-education`, `/smartwatches`, `/upcoming`, or `/vlogging-gimbals`.
- No content enrichment or indexation change was made to the thin hubs documented in the source audit.
- No valid low-traffic content was removed.

### Future content opportunities

No smartphone ranking, wireless-earbuds comparison guide, educational-toys hub/guide, or other new content was created. No broad commercial-cluster restructuring was performed.

### Existing systems

Homepage performance work, visual design, affiliate click tracking, affiliate tags, redirects, canonical templates, and the 11 noindex decisions were not modified.

## Verification

| Check | Result |
|---|---|
| Tests | **21/23 passed.** Two existing, out-of-scope baseline failures remain: affiliate-click listener idempotency expects 1 event but receives 2; the Samsung legacy-redirect test expects `/how-to-guides/...` while the implementation targets `/smartphones/...`. Neither failure is in a changed Sprint 1 file. |
| Typecheck | Passed: 0 errors. Astro reported 18 existing deprecation/unused-code hints. |
| Changed-file lint | Passed: `src/components/Header.astro` produced no ESLint findings. |
| Production build | Passed: Astro Cloudflare server and client bundles completed successfully. |
| Deployment | Cloudflare Pages production deployment completed; deployment URL `https://e56159d3.toptenuae.pages.dev`. Custom production domain smoke-tested afterward. |
| Sitemap | 298 live URLs; 298 unique; 0 redirects, 0 non-200, 0 noindex, 0 non-self-canonical; `/wireless-earbuds` included; `/calculators` excluded. |
| Internal links | Crawled anchors from all 298 sitemap pages: 301 unique internal destinations, 0 broken, 0 redirects, 0 `/calculators` links, 0 internal `utm_source=chatgpt.com` links. |
| Wireless earbuds | 200, index/follow, self-canonical, correct title/H1, 11 product-review links, lowercase sitemap URL; uppercase form is a single 301 to lowercase. |
| Calculators | `/finance-tools` is 200/indexable/self-canonical and present in desktop/mobile navigation. `/calculators` remains 404 but has no discovered internal or sitemap links. |
| Mustela | Page remains 200/indexable/self-canonical; broken `link.amazon` CTA remains because the exact pack-size SKU is unverified. Explicitly blocked, not fixed. |
| Six laptop reviews | All six are 200/indexable/self-canonical and still render no Amazon link/CTA. Exact listings were unavailable or lacked a direct orderable buy box, so no unsafe monetization was added. |
| Navigation | Desktop and mobile rendered navigation markup contains `/finance-tools` and no `/calculators`. Header search opened interactively and targets `/search`; `/search?q=laptop` returned 200 with the intended `noindex, nofollow`. |
| Sanity content | Lowercase category slug and cleaned Portable Text link were read back from the published perspective and verified in rendered production HTML. |
| Existing Amazon rendering | An unchanged monetized review (`/reviews/tozo-t10-wireless-earbuds`) continued to render its existing `amzn.to` and Amazon.ae destinations. No affiliate tracking field or code was changed in this sprint. |

## Sprint stop

The high-confidence technical fixes are deployed. Monetization changes that lacked exact, currently orderable SKU evidence were intentionally stopped and documented rather than guessed. Deferred indexation, hub, internal-link, and content work remains outside Sprint 1.
