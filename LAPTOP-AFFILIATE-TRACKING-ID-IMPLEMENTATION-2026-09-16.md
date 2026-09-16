# Laptop Affiliate Tracking-ID Implementation — 16 September 2026

## Current state

Amazon Associates Central was inspected read-only on 16 September 2026. The account currently lists two approved tracking IDs:

- `apfunbox06-21` — the established production fallback.
- `ameerparveen-21` — an existing account ID that is not identified as a laptop-cluster ID and is therefore not assigned to a laptop cluster.

No laptop-specific tracking IDs exist yet. Production Amazon URLs use `apfunbox06-21`, while the separate `data-affiliate-category` value supplies laptop intent to the canonical GA4/GTM `affiliate_click` event.

The pre-Phase-2A flow is:

`Sanity product.affiliateLink` → stored Amazon.ae URL with one product-level tag → rendered CTA → one delegated click listener → `affiliate_click` with the page's internal category and URL tag → GA4/GTM site attribution → Amazon Associates reports against the stored tag.

This means GA4 can distinguish laptop intent, but Amazon cannot yet separate clicks, ordered items or commission by laptop cluster.

## Target state

The prepared architecture resolves the Amazon tag at render time from page context:

`Sanity product + top-ten page context` → `laptops-*` category → approved environment mapping → direct Amazon.ae `/dp/{ASIN}` destination → one canonical `affiliate_click` → Amazon Associates tracking-ID reporting.

The product document remains shared. A product such as HP Victus can therefore retain one ASIN while receiving a general-page tag on the general list and a gaming-page tag on the gaming list.

## Mapping

| Internal cluster | Environment key | Amazon tracking ID now | Status |
|---|---|---|---|
| `laptops-general` | `AMAZON_TRACKING_ID_LAPTOPS_GENERAL` | `apfunbox06-21` fallback | Laptop-specific ID not configured |
| `laptops-gaming` | `AMAZON_TRACKING_ID_LAPTOPS_GAMING` | `apfunbox06-21` fallback | Laptop-specific ID not configured |
| `laptops-student` | `AMAZON_TRACKING_ID_LAPTOPS_STUDENT` | `apfunbox06-21` fallback | Laptop-specific ID not configured |
| `laptops-business` | `AMAZON_TRACKING_ID_LAPTOPS_BUSINESS` | `apfunbox06-21` fallback | Laptop-specific ID not configured |
| `laptops-ai` | `AMAZON_TRACKING_ID_LAPTOPS_AI` | `apfunbox06-21` fallback | Laptop-specific ID not configured |

The five environment values remain blank until Amazon issues the exact IDs. Internal category names are never treated as Amazon tracking IDs. A configured value must match the Amazon.ae tracking-ID form ending in `-21`; invalid or missing values resolve to the established `apfunbox06-21` fallback.

## Architecture

`src/lib/affiliate/amazon-tracking.js` provides the pure configuration and URL layer:

1. Resolve the internal laptop category already produced by `getAffiliateCategory`.
2. Look up the category's server-side environment key.
3. Use the validated cluster-specific ID when configured; otherwise use the validated account fallback.
4. Require an existing active Amazon.ae link and exact matching ten-character ASIN.
5. Normalize the destination to `https://www.amazon.ae/dp/{ASIN}`.
6. Replace all existing `tag` parameters with exactly one resolved tag while preserving unrelated parameters.
7. Return no destination for generic search URLs, non-Amazon hosts or ASIN mismatches.
8. Remove the destination for products marked `unavailable`.

`src/pages/top-ten/[slug].astro` applies that transformation only to recognized laptop clusters before the shared money-page templates render. Other affiliate clusters are returned unchanged. Existing components and the single delegated click listener require no duplicate logic: `affiliate_category` remains the site-intent label and `affiliate_tracking_id` continues to come from the final destination's real `tag` value.

## Code changes

| File | Change |
|---|---|
| `src/lib/affiliate/amazon-tracking.js` | Added validated cluster mapping, fallback resolution, exact-ASIN URL normalization and unavailable-product protection. |
| `src/pages/top-ten/[slug].astro` | Applies the page-context mapping to laptop list items during server rendering. |
| `src/env.d.ts` | Declares the five optional server-side laptop tracking-ID variables. |
| `.env.example` | Documents blank, opt-in cluster variables; no invented production IDs. |
| `tests/amazon-tracking.test.mjs` | Covers five clusters, shared-product contexts, fallback, duplicate parameters, exact ASINs, generic URLs and unavailable offers. Test-only syntactically valid IDs are fixtures and are not production configuration. |

No Sanity product duplication or product-level cluster tag was added. No shared CTA component or browser listener was changed.

## Tests

- `node --test tests/amazon-tracking.test.mjs` — passed 11/11.
- `pnpm test` — passed 35/35.
- `pnpm exec eslint src/lib/affiliate/amazon-tracking.js tests/amazon-tracking.test.mjs` — passed.
- `pnpm build` — passed; Astro reported 0 errors, 0 warnings and 19 informational hints.
- `git diff --check` — passed.
- Local server-render smoke test — passed for the general and gaming pages: active destinations remained direct `/dp/{ASIN}` links with the approved `apfunbox06-21` fallback, and unavailable products remained without purchase CTAs.

Linting the entire existing `src/pages/top-ten/[slug].astro` file separately still reports its pre-existing `data: any` at line 15. Phase 2A does not alter that declaration; the Astro type/build check passes.

## Production verification

Not deployed. The stop condition is active because Amazon has not issued laptop-specific tracking IDs. Production correctly remains on `apfunbox06-21`; therefore there is no cluster-specific production payload to claim.

After real IDs are configured and deployed, verify normal, Cmd/Ctrl, middle and mobile interactions. Each action must produce exactly one `affiliate_click` whose `affiliate_category` is the internal cluster and whose destination `tag` and `affiliate_tracking_id` are the corresponding approved Amazon ID.

## Amazon verification status

| Verification layer | Status |
|---|---|
| Code architecture | Prepared; unit tests, full tests and production build passed |
| GA4/GTM attribution | Existing production category attribution remains verified from Phase 1; cluster-specific Amazon IDs not yet deployed |
| Amazon click attribution | Not verified for laptop-specific IDs |
| Amazon ordered-item attribution | Not verified for laptop-specific IDs |
| Amazon commission attribution | Not verified for laptop-specific IDs |

Amazon reporting should not be considered proven by a URL or GA4 event alone. Clicks, ordered items and commission must each be confirmed in Associates Central after controlled production tests and normal reporting latency.

## Remaining action

1. Sign in to Amazon.ae Associates Central.
2. Open the current tracking-ID selector, then choose **Manage Your Tracking IDs**.
3. Select **Add Tracking ID** and request one unambiguous ID for each cluster: general laptops, gaming laptops, student laptops, business laptops and AI laptops. Amazon determines the exact available spelling and issues the `-21` suffix.
4. Copy the five exact IDs shown in Associates Central; do not infer them from the requested names.
5. Configure those values in the matching five environment keys for Preview and Production in Cloudflare Pages.
6. Build and deploy the isolated Phase 2A branch only after all five values are confirmed.
7. Perform controlled normal, modified, middle and mobile clicks, then verify the rendered URLs and GA4 payloads.
8. After Amazon reporting latency, confirm the IDs separately in clicks, ordered items and commission reports.

No production deployment should occur before step 4 supplies the real approved mapping.
