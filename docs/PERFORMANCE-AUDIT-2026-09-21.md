# TopTenUAE Performance Audit — 2026-09-21

## Scope and measurement method

The audited URL is `https://toptenuae.com/`. The baseline was measured against live production with Lighthouse 13.5.0 on 2026-09-21. The final measurements were taken from the rebuilt Cloudflare Pages worker served locally by Wrangler, using the same Lighthouse version and the standard Lighthouse mobile and desktop profiles.

The final numbers are pre-deployment measurements, not claims about the current production URL. A production rerun is required after deployment. The PageSpeed Insights API was also attempted, but its unauthenticated daily quota returned HTTP 429, so no PSI result was substituted or fabricated.

## Architecture audit

- Framework/runtime: Astro 5.18.0 installed from the `^5.5.0` range, React 19 islands, Node 20+, pnpm 11.6.0.
- Build/deployment: Astro SSR output with `@astrojs/cloudflare`; Cloudflare Pages worker output; Tailwind CSS 4 through Vite.
- Homepage rendering: server-rendered Astro HTML backed by one Sanity GROQ request through the published CDN perspective.
- Content: Sanity CMS with crawlable server-rendered HTML and JSON-LD. No homepage content is fetched by the browser during initial render.
- Images: the homepage query projected raw Sanity asset URLs. Before this work, those URLs bypassed Sanity transformations and responsive selection.
- CSS: one generated global Tailwind stylesheet. Below-fold homepage sections previously incurred normal layout/paint work during initial rendering.
- JavaScript: Astro view-transition router, a React-hydrated global header, affiliate click tracking, GTM/GA4, delayed Microsoft Clarity, and a below-fold newsletter island.
- Fonts: IBM Plex Sans and unused Inter families were declared through render-blocking Google Fonts CSS. A mismatched, older font file was separately preloaded.
- Analytics: GTM remains enabled with the existing ID and data layer; GA4 continues to load through GTM; Clarity retains its existing delayed loader.
- Cloudflare/cache behavior: immutable one-year caching exists for hashed `/_astro/*` assets. The production HTML response was `cf-cache-status: DYNAMIC`. HTML is request-sensitive because referral attribution can be sourced from the request cookie/referrer, so blanket edge caching was not added.
- Redirects/indexing: `_redirects`, middleware route normalization, canonical, robots, sitemap, metadata, Open Graph, and schema generation remain intact.

## Baseline and final Lighthouse results

| Profile | Environment | Performance | FCP | LCP | TBT | CLS | Speed Index | TTFB | Transfer | Requests |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Mobile | Live production baseline | 61 | 2.94 s | 4.94 s | 622 ms | 0.000 | 3.23 s | 744 ms | 6.27 MiB | 55 |
| Mobile | Local production build, final | 97 | 1.17 s | 2.26 s | 136 ms | 0.000 | 1.38 s | 436 ms | 0.51 MiB | 19 |
| Desktop | Live production baseline | 95 | 1.08 s | 1.16 s | 5 ms | 0.016 | 1.08 s | 127 ms | 8.36 MiB | 59 |
| Desktop | Local production build, final | 100 | 0.34 s | 0.81 s | 6 ms | 0.000 | 0.44 s | 142 ms | 0.60 MiB | 24 |

INP is not produced by a single Lighthouse navigation run. TTI was 5.70 s mobile / 1.31 s desktop at baseline and 4.39 s mobile / 1.06 s desktop in the final local build.

Transfer breakdown:

| Profile | Images before | Images final | JavaScript before | JavaScript final | CSS before | CSS final | Fonts before | Fonts final |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Mobile | 5.93 MiB | 143 KB | 392 KB | 307 KB | 18 KB | 18 KB | 46 KB | 40 KB |
| Desktop | 8.06 MiB | 233 KB | 392 KB | 307 KB | 18 KB | 18 KB | 46 KB | 40 KB |

## Problems found and remediation

### 1. Full-size Sanity assets dominated transfer

- Evidence: the baseline fetched 30 homepage images and transferred 5.93 MiB on mobile. One below-fold 1920×1080 PNG alone transferred 3.29 MB. Desktop image transfer was 8.06 MiB.
- Affected code: `src/sanity/queries/home.queries.ts`, `src/pages/index.astro`.
- Root cause: the query projected `asset->url`, and the page emitted that original URL without width, quality, or automatic-format parameters.
- Fix: added guarded Sanity CDN URL/srcset helpers, realistic 320–640 px card candidates, 480–1600 px hero candidates, `sizes`, dimensions, async decoding, and automatic format negotiation.
- Measured impact: final mobile image transfer is 143 KB and desktop image transfer is 280 KB.

### 2. Every category eagerly loaded its first four images

- Evidence: `loading={idx < 4 ? 'eager' : 'lazy'}` ran independently inside every category, causing many far-below-fold images to load eagerly.
- Affected code: `src/pages/index.astro`.
- Root cause: the index was local to each category rather than global/viewport-aware.
- Fix: only the true LCP hero remains eager/high priority. All homepage card imagery is lazy.
- Expected impact: prevents unnecessary initial network contention and duplicate work without hiding content.

### 3. The true LCP path used an unbounded origin image

- Evidence: Lighthouse identified `main.font-sans > section.relative > div.absolute > img.absolute` as the LCP element.
- Affected code: `src/pages/index.astro`.
- Root cause: the hero used the original Sanity asset URL even though its rendered width is viewport-bound.
- Fix: responsive Sanity `srcset`, a 1280 px fallback, 72 quality, automatic AVIF/WebP negotiation, `sizes="100vw"`, eager loading, and `fetchpriority="high"`. A Sanity preconnect replaces the weaker DNS-prefetch.
- Measured impact: mobile LCP improved from 4.94 s to 2.26 s in the final production build measurement.

### 4. Unnecessary initial React hydration

- Evidence: the global header loaded React plus header/icon chunks on every route, and a decorative logo created another island.
- Affected code: `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/pages/index.astro`.
- Root cause: basic menu/search state and a static SVG were implemented as React islands.
- Fix: replaced the global header island with server-rendered Astro HTML and a small scoped interaction script; rendered the hero logo SVG server-side.
- Expected impact: removes React hydration from the initial homepage viewport. The newsletter React island remains interaction-scoped below the fold.

### 5. Large-DOM view-transition work on the homepage

- Evidence: the Astro client router produced a 96 ms mobile long task in the intermediate production-build trace.
- Affected code: `src/layouts/BaseLayout.astro`, `src/pages/index.astro`.
- Root cause: the router initialized against the entire content-heavy homepage even though ordinary navigation is sufficient there.
- Fix: made the router optional and disabled it only for the homepage. Other pages retain existing transitions.
- Expected impact: removes that homepage long task while preserving standard navigation and the feature elsewhere.

### 6. Render-blocking and mismatched font setup

- Evidence: the baseline loaded render-blocking Google Fonts CSS, one 40 KB IBM Plex Sans variable font, and an unrelated preloaded 5 KB older font file. Inter was declared but unused.
- Affected code: `src/layouts/BaseLayout.astro`, `src/styles/globals.css`.
- Root cause: redundant families/weights and a preload URL that did not match the font selected by the stylesheet.
- Fix: inlined the exact IBM Plex Sans variable-font declaration into the compiled CSS, removed unused Inter and the Google Fonts stylesheet request, and preloaded the exact used Latin font.
- Expected impact: one fewer blocking request and no wasted font preload, with the existing typography preserved.

### 7. Third-party analytics main-thread work

- Evidence: GTM/gtag transferred about 305 KB and contributed long tasks on throttled mobile. A Cloudflare challenge script also contributed a 528 ms production long task and is outside application control.
- Affected code: `src/components/analytics/GTMScript.astro`.
- Root cause: GTM network/script evaluation began during initial document parsing.
- Fix: create the data layer immediately, then initialize GTM after `load` during browser idle time, or immediately on the first pointer/keyboard interaction. GA4, the GTM container, AI-referral attribution, and affiliate event emission remain present.
- Measured impact: final mobile TBT is 139 ms versus 622 ms at baseline. GTM/gtag still loads during the audit, confirming it was deferred rather than removed.

### 8. Below-fold rendering work

- Evidence: the 149 KB server-rendered homepage contains many content sections and cards.
- Affected code: `src/pages/index.astro`, `src/styles/globals.css`.
- Root cause: offscreen sections participated in initial style/layout work.
- Fix: applied `content-visibility: auto` with intrinsic-size reservation to below-fold sections. Content remains in server HTML and becomes visible/accessibility-exposed as it approaches the viewport.
- Expected impact: less initial layout/paint work with stable reserved space.

### 9. Manifest 404 and one contrast failure

- Evidence: Lighthouse logged `/icon.png` as a 404 because the manifest referenced a nonexistent path. Product badges used emerald-600 on emerald-50 at 10 px, a 3.46:1 contrast ratio.
- Affected code: `public/manifest.json`, `src/pages/index.astro`.
- Fix: point the manifest at the existing SVG icon and darken the badge text to emerald-700.
- Expected impact: removes the console error and resolves the homepage contrast failure after the final rebuild.

## Verification

- Astro/typecheck: pass, 0 errors. Nineteen pre-existing informational hints remain in unrelated files.
- Tests: pass, 224/224. The first sandboxed run blocked two loopback integration tests; the permitted rerun passed all tests.
- Production build: pass with the Cloudflare adapter.
- Lint: the repository has no `lint` script. A direct `pnpm exec eslint src` run executes the package's flat rules but fails on 168 existing errors, predominantly the repository-wide `no-explicit-any` backlog; no new file from this remediation adds an ESLint failure. Astro check passes the changed Astro/TypeScript code.
- Lighthouse mobile: Performance 97, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Browser regression: mobile hero/layout rendered correctly; menu open/close and search open/close were exercised; deferred sections rendered when scrolled into view.

## SEO, content, revenue, and deployment regression checks

- Homepage: HTTP 200, canonical `https://toptenuae.com`, index/follow robots, title/description, Open Graph, Twitter metadata, and JSON-LD present.
- Crawlability: homepage editorial sections remain present in server-rendered HTML; no important content was converted to client-only rendering.
- Sanity: homepage still uses the same query/repository and published-CDN perspective. Only image delivery URLs are transformed.
- Images: every Sanity `<img>` on the homepage now has a transformed fallback; responsive candidates are present; the true hero remains the only eager image.
- Affiliate money page: `/top-ten/best-perfumes-under-100-aed-uae` rendered with its canonical and JSON-LD. All 20 Amazon.ae links retained `tag=apfunbox06-21`; affiliate click tracking remains in the HTML.
- Analytics: the GTM container ID remains present; GTM and gtag requests were observed in final Lighthouse; the affiliate `affiliate_click` data-layer integration remains installed.
- Sitemap/robots: both returned HTTP 200 with XML/plain-text content types respectively.
- Redirects and middleware were not modified.
- Asset caching rules for `/_astro/*`, fonts, and images remain unchanged.

## Remaining considerations

- Deploy this build, purge/warm as appropriate, then repeat Lighthouse/PSI on the public URL. Local-worker TTFB is not directly comparable to Cloudflare edge TTFB.
- Production HTML remains dynamic. Adding whole-page edge caching without first removing request-specific referral attribution from HTML could mix visitor-specific state, so this audit intentionally did not add speculative HTML caching.
