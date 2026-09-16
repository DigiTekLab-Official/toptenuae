# Laptop Affiliate Phase 5A — Unavailable Amazon Link Cleanup

## Status

CMS cleanup complete and validated. Deployment verification is in progress.

## Target links

| Product | ASIN | Page | Link type | Destination | Action |
| --- | --- | --- | --- | --- | --- |
| ASUS ProArt P16 | B0GPRL4RDG | `/reviews/asus-proart-p16-h7606wp-rtx-5070` | Editorial source/evidence link, `sources[2].url` | `https://www.amazon.ae/dp/B0GPRL4RDG?tag=apfunbox06-21` | Remove URL; retain unavailable evidence elsewhere |
| Lenovo Yoga Slim 7x | B0DQRH3LQL | `/reviews/lenovo-yoga-slim-7x-14q8x9` | Editorial source/evidence link, `sources[2].url` | `https://www.amazon.ae/dp/B0DQRH3LQL?tag=apfunbox06-21` | Remove URL; retain unavailable evidence elsewhere |
| Apple MacBook Air M2 | B0DLHK2MMY | `/reviews/apple-macbook-air-m2-2022` | Editorial source/evidence link, `sources[1].url` | `https://www.amazon.ae/dp/B0DLHK2MMY` | Remove URL; retain unavailable evidence elsewhere |
| Apple MacBook Air M4 | B0DZDXCFJQ | `/reviews/apple-macbook-air-m4-13-inch` | Editorial source/evidence link, `sources[1].url` | `https://www.amazon.ae/dp/B0DZDVTDGM` | Remove stale variation URL; retain unavailable evidence elsewhere |
| Acer Nitro V 16 AI | B0FWXM6R9N | `/reviews/acer-nitro-v-16-ai-laptop` | Editorial source/evidence link, `sources[1].url` | `https://www.amazon.ae/dp/B0FWXM6R9N` | Remove URL; retain unavailable evidence elsewhere |

HP 14 Student (`B0FPXJ6G6B`) was inspected as the sixth unavailable control and contains no Amazon source URL.

## Before state

- All six products have `availabilityStatus=unavailable` and `affiliateLink=null`.
- Exactly the five rows above contain one clickable Amazon source URL each.
- No scoped draft document exists.
- The unavailable/check-date explanation remains in `uaeCommerce.availabilityNote` and other editorial fields.

## Changes

The transaction unsets only the five exact `sources[n].url` fields above. Titles, publishers, offer-check dates, unavailable explanations, ASINs, product copy, rankings and active offers remain unchanged.

## CMS transaction

- Guarded plan: PASS — exactly five documents and exactly five `sources[n].url` fields.
- Draft collisions: 0.
- Production transaction ID: `h5lQRzFM3NIvu5DusTZdVN`.
- Post-write validation: PASS — five target documents, zero residual Amazon source URLs.
- HP 14 remained unchanged as the zero-link control.

## Tests

- `node --check`: PASS.
- `pnpm test`: PASS, 39/39.
- Focused ESLint: PASS.
- `pnpm build`: PASS against live Sanity data; 280 documents fetched; Astro reported 0 errors, 0 warnings and 19 existing hints.
- `git diff --check`: PASS.

## Production QA

- All five affected reviews and the HP 14 control render zero `amazon.ae` and zero `amzn.to` links.
- All six retain their unavailable message and 2026-09-16 verification date.
- All six retain a self-canonical, visible H1 and valid page structure.
- Desktop and 390 × 844 checks found no document-level horizontal overflow.
- No unavailable review could dispatch an Amazon affiliate event because no Amazon link remained.

## Active-product regression

The AI money page retained its active Zenbook CTA. One real click emitted exactly one canonical `affiliate_click` with `affiliate_category=laptops-ai`, the exact ASIN destination and `affiliate_tracking_id=apfunbox06-21`.

## Remaining limitations

The AED 1,500 page still has one verified active product. This cleanup does not add replacements or change that page.

## Next single task

Complete preview and production deployment verification. Do not create new laptop content or replacements.
