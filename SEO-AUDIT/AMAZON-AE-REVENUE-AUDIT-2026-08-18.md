# Amazon.ae Affiliate Revenue Audit — 18 August 2026

## Revenue diagnosis

Amazon Associates Central for `apfunbox06-21`, 19 July–17 August 2026:

- 91 clicks
- 0 ordered items
- 0.00% product conversion
- AED 0 ordered revenue
- AED 0 earnings

This means the immediate constraint is conversion quality, not simply affiliate-link visibility. The audited shaver, air-fryer and earbuds lists each expose working `amzn.to` links in multiple comparison surfaces, and sampled links resolve to live Amazon.ae product pages with HTTP 200 responses.

## UAE commercial demand from Keyword Planner

Location was corrected from India + UAE to United Arab Emirates only; language English; network Google; period August 2025–July 2026.

| Seed | Avg. monthly UAE searches | Competition | Amazon.ae category rate |
|---|---:|---|---:|
| air fryer | 10K–100K | High | 4% (Home) |
| noise cancelling headphones | 1K–10K | High | 2% (Electronics) |
| robot vacuum | 1K–10K | High | 4% (Home) |
| dash cam | 1K–10K | High | 7% (Automotive) |
| power bank | 1K–10K | High | 2% (Electronics) |
| standing desk | 1K–10K | High | 5% (Furniture) |

Keyword Planner displays broad ranges because the Ads account has no active campaign. The ranges are still sufficient for relative prioritisation but should not be treated as exact volume.

## Current Amazon.ae commission economics

Read from the account’s live Advertising Commission Schedule on 18 August 2026:

- 9%: apparel, luggage, shoes
- 8%: books/ebooks, jewellery, watches; “other” products
- 7%: automotive, baby, beauty, health/personal care, personal-care appliances, sports and related categories
- 5%: furniture, office products, tools
- 4%: home, major appliances, outdoor, pet products, toys, grocery
- 2%: cameras, computers, electronics, video games and wireless/accessories

The best near-term intersection is therefore:

1. **Grooming (7%)** — electric shavers and beard trimmers already have GSC impressions and complete product lists.
2. **Air fryers (4%)** — by far the largest tested UAE search demand and an existing six-product list.
3. **Baby monitors (7%)** — higher commission, high order value and an existing ten-product list.
4. **Dash cams (7%)** — 1K–10K demand plus a strong commission rate, but the CMS currently has no dash-cam product inventory.
5. **Standing desks (5%)** — 1K–10K demand and high order value, but no current product inventory.
6. **Robot vacuums (4%)** — 1K–10K demand and high order value, but no current product inventory.
7. **Electronics (2%)** — pursue only where the site already has rankings or where search volume compensates for the low rate.

## Changes implemented

- Replaced the homepage’s generic quick-link hub with eight revenue pages, led by air fryers, 7%-rate grooming/baby categories and existing high-intent tech comparisons.
- Added a global `affiliate_click` dataLayer event capturing page path, CTA, inferred product name and Amazon destination. Configure a GTM custom-event trigger and GA4 event with the same name to see which page/product sends clicks.
- Kept GSC-led snippet improvements for commercial pages including shavers, trimmers, earbuds and budget laptops.

## Conversion fixes to implement editorially

### Existing pages (first priority)

1. Revalidate every product against Amazon.ae: available, Prime-eligible where possible, strong rating volume, and price tier competitive with adjacent picks.
2. Put a decision table above the first CTA: “best for,” product type, capacity/feature, price tier, and main compromise.
3. Replace generic awards with purchase-use cases: “best for sensitive skin,” “best dual-basket air fryer,” “best no-Wi-Fi baby monitor.”
4. Add a one-sentence “Why buy this one” immediately before each Amazon CTA and a clear “skip if” statement.
5. Use separate Amazon tracking IDs for each major list or category when generating new SiteStripe links. Amazon’s current report cannot attribute the 91 clicks to a page or product.

### New commercial clusters (after product/link research)

1. `best-dash-cams-uae` — target front-only, front/rear, parking mode, heat resistance and UAE driving use cases.
2. `best-standing-desks-uae` — target small apartments, dual-motor, budget and tall-user intents.
3. `best-robot-vacuums-uae` — target tiles, carpets, pet hair, mopping and self-emptying.
4. Supporting reviews for each selected product, linked both ways with its comparison page.

Do not publish these three lists until each product is verified on Amazon.ae and a correctly tagged affiliate link is created. The current CMS has no product inventory for these categories.

## 90-day revenue scorecard

- Affiliate click-to-order conversion: current 0%; target first 2%, then 4%+.
- Track clicks and orders by category-specific Amazon tracking ID.
- Track `affiliate_click` in GA4 by `page_path` and `affiliate_product`.
- Review pages weekly for 30 days; remove unavailable or poorly rated products.
- Revenue priority score: UAE search demand × Amazon rate × typical order value × realistic ranking potential.
