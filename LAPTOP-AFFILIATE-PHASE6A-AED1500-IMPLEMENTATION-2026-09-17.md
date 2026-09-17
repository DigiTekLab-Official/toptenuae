# Laptop Affiliate Phase 6A — AED 1,500 Implementation Report

## Outcome

Phase 6A is complete. The approved four-mutation Sanity transaction was committed atomically to project `kxdjzy8e`, production dataset, and the isolated implementation was deployed and production-verified. No unrelated Sanity document, repository file, affiliate cluster or original-checkout change was modified.

- Sanity transaction ID: `XKHnSv8hAlvchXbqAtNPQg`
- Target page: `2d7cd630-2309-4f3e-b81a-65d4b6811e00`
- Approved pre-write revision: `bIKE1WYOAdGKWMnUz3jFZX`
- Post-write page revision: `XKHnSv8hAlvchXbqAtNPQg`
- Production URL: `https://toptenuae.com/top-ten/best-laptop-under-1500-aed-uae`
- Final production deployment: `https://5e841b5e.toptenuae.pages.dev`
- Final preview deployment: `https://eac58d1f.toptenuae.pages.dev`
- Runtime commit: `a3974f40cb916423375f74d27d31ec5f21a93de4`

## Same-day Amazon.ae verification

All four exact offers were reopened on 16 September 2026 before the write. The three candidates remained new-condition, orderable, and at or below AED 1,500. The transaction was allowed to proceed only after all checks passed.

| ASIN | Exact checked configuration | Checked price | Orderability | Seller / fulfilment | Condition |
|---|---|---:|---|---|---|
| `B0F9LRN47N` | ASUS CM3001DM2A, 8GB LPDDR4X / 128GB eMMC | AED 1,299.99 | In stock | Notebook CT / Fulfilled by Amazon | New |
| `B0D2YDZWC1` | Lenovo 500w Gen 3, 8GB RAM / 128GB SSD | AED 594.00 | In stock | MicroBee Global / Fulfilled by Amazon | New, standard non-renewed listing |
| `B0GQVG2Q7P` | HP 15, 8GB RAM / 256GB PCIe NVMe SSD | AED 1,299.00 | In stock | PrimeGadgets World / Fulfilled by Amazon | New, seller-upgraded |
| `B0DCLJ9V2B` | Lenovo Slim 3 Chromebook, 4GB / 64GB eMMC plus 64GB card | AED 1,494.31 | In stock | DesertcartAE / ships from DesertcartAE | New |

No coupon-only, payment-method or different-variation price was used. The affiliate tracking ID remained `apfunbox06-21`.

## Exact Sanity mutations

The committed transaction contained exactly four approved mutations:

1. Created `topten-budget-laptop-asus-chromebook-cm3001dm2a` for `B0F9LRN47N`.
2. Created `topten-budget-laptop-lenovo-500w-gen3` for `B0D2YDZWC1`.
3. Created `topten-budget-laptop-hp-15-athlon-7120u` for `B0GQVG2Q7P`.
4. Patched page `2d7cd630-2309-4f3e-b81a-65d4b6811e00` under the approved revision precondition.

The dry-run payload SHA-256 remained `696bbc914b895858f5dde46c2fbd0e69d36c7f9d916d183e65de7e6c5a90a970`. The post-write validator passed. No review slugs were created.

## Final active shortlist

The final product count is exactly three, in this order:

1. `B0F9LRN47N` — ASUS Chromebook CM3001DM2A
2. `B0D2YDZWC1` — Lenovo 500w Gen 3
3. `B0GQVG2Q7P` — HP 15 Athlon Silver 7120U

Incumbent `B0DCLJ9V2B` remains unchanged in Sanity at revision `bIKE1WYOAdGKWMnUz3jFZX`; it is no longer referenced by the active page shortlist.

## Repository verification and deployment

The work was isolated in `/private/tmp/topten-laptop-phase6a` on branch `codex/laptop-affiliate-phase5a`. The original dirty checkout was not edited.

- Full test suite: 48/48 passed.
- `astro check`: 0 errors, 0 warnings, 19 pre-existing hints.
- Full production build: passed.
- Initial Phase 6A production deployment: `https://08b41dba.toptenuae.pages.dev`.
- Production QA exposed one page-specific stale GSC snippet override. It was aligned with the approved Sanity title and description and covered by a regression test in commit `a3974f4`.
- Corrected preview deployment: `https://eac58d1f.toptenuae.pages.dev`.
- Corrected production deployment: `https://5e841b5e.toptenuae.pages.dev`.

## Production QA

The custom-domain page was verified after the corrected deployment with a cache-busting request.

- Title: `Best Laptop Under 1500 AED UAE: 3 Verified Picks | TopTenUAE`.
- Meta description: `Compare three verified new laptops under AED 1,500 in the UAE: an ASUS Chromebook, Lenovo Windows 2-in-1 and qualified HP 15 option.`
- H1: `Best Laptop Under 1500 AED in UAE (2026): 3 Verified Picks`.
- Canonical: `https://toptenuae.com/top-ten/best-laptop-under-1500-aed-uae`.
- Robots: `index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1`.
- Schema graph: `Organization`, `BreadcrumbList`, `ItemList`, `Article`, and `FAQPage`; the ItemList contains exactly three entries.
- Amazon destinations: 12 links across quick picks, comparison table, product cards and sources; every destination uses one of the three approved ASINs and `apfunbox06-21`.
- Required internal links: general laptop shortlist, student guide, business/office guide and laptop buying guide all present.
- Desktop overflow check: document width equals viewport width.
- Mobile check at 390 × 844: H1, navigation and commercial CTA render; document width equals viewport width with no page-level horizontal overflow. The intentionally scrollable comparison table remains contained.
- Browser console: no warnings or errors observed during QA.

## Affiliate event verification

One ASUS product-card CTA was clicked on the production custom-domain page. It opened the exact destination:

`https://www.amazon.ae/dp/B0F9LRN47N?th=1&tag=apfunbox06-21`

The page main runtime recorded exactly one `affiliate_click` event with:

- `affiliate_network`: `amazon_ae`
- `page_path`: `/top-ten/best-laptop-under-1500-aed-uae`
- `affiliate_product`: `ASUS Chromebook CM3001DM2A 10.5-inch Detachable`
- `affiliate_cta`: `product_card`
- `affiliate_category`: `laptops-general`
- `affiliate_position`: `1`
- `affiliate_tracking_id`: `apfunbox06-21`
- `affiliate_destination`: the exact URL above

## Remaining limitations

- Prices, stock, seller and delivery remain dated marketplace observations and can change after verification.
- ASUS: specific UAE manufacturer/seller warranty, keyboard layout and charger/Type-G plug remain unverified.
- Lenovo: specific warranty, keyboard layout and charger/Type-G plug remain unverified.
- HP: seller-upgraded configuration with a one-year seller warranty; UAE manufacturer warranty, keyboard layout and charger/Type-G plug remain unverified.
- The recommendations are evidence-based configuration judgments; no hands-on performance, battery or durability testing was performed.
- No remaining production defect was observed after the snippet correction and final QA.

