# TopTenUAE GSC Content Growth Audit — 18 August 2026

## Executive diagnosis

The site has UAE relevance but weak search-result conversion and an overly concentrated content footprint. In Google Search Console for 16 May–15 August 2026:

- 17,438 impressions, 52 clicks, 0.3% CTR, average position 25.5.
- The UAE generated 15,324 impressions and 45 clicks (87.9% of impressions; 86.5% of clicks).
- `/how-to-guides/where-to-donate-used-toys-uae` generated 9,004 impressions and 30 clicks: 51.6% of all site impressions and 57.7% of all clicks.
- The query `where to donate toys` generated 8,048 impressions and no clicks in the displayed query table. This is the clearest snippet/intent mismatch.
- `/top-ten/best-electric-shaver-uae` generated 1,868 impressions and 2 clicks (about 0.11% CTR).
- Other high-impression, low-click pages include the beard-trimmer list (732/4), charity guide (678/0), laptop-under-AED-1,500 list (622/8), earbuds list (569/5), and VAT calculator (498/0).

The first priority is therefore not publishing unrelated “top ten” articles. It is improving snippets and internal links for proven pages, then expanding the donation/decluttering topic where the site already has topical authority.

## Structural findings

1. The homepage’s strongest editorial links were inside a desktop-only hero panel (`hidden lg:block`), so mobile users and mobile-first crawl rendering received a weaker visible pathway to the pages Google already values.
2. Search titles are controlled independently in multiple route files, making fast GSC-led tests cumbersome. A small central override map now covers only proven high-impression pages while Sanity remains the default.
3. The broad navigation mixes product commerce, local life, finance and events. This can work as a publication model, but new content should be organised into internally linked clusters rather than isolated posts.
4. Existing technical foundations are broadly sound: canonical URLs, index/follow defaults, schema dispatch, sitemap generation and hard-status handling are already present. The main near-term opportunity is content selection, snippet alignment and internal-link prominence.

## Changes implemented in this pass

- Added GSC-led title and meta-description overrides for eight pages with demonstrated impressions.
- Added a responsive homepage hub linking the donation guide, charity guide, grooming comparisons, budget laptop page, VAT calculator and gratuity calculator.
- Added a reusable Sanity seed script containing three researched UAE donation-cluster articles:
  - Where to Donate Clothes and Furniture in Dubai & UAE
  - Where to Donate Books in Dubai & UAE
  - In-Kind Donations in the UAE: What Charities Accept & How Pickup Works
- The content script defaults to a safe dry run. `--write` creates drafts and `--publish` publishes when `TOPTEN_WRITE_TOKEN` is available.

## Research standard used for the new articles

Claims were limited to current first-party or official sources and written with “confirm before travelling” language because collection capacity changes:

- UAE Government charity FAQ and Federal Law No. 3 of 2021: https://u.ae/en/Help/FAQs/charity-and-humanitarian-work
- Dubai Charity Association in-kind donation channel: https://dubaicharity.org/en/campaigns/Clothing
- Sahem National FAQ: https://www.sahemnational.ae/sahem-faq/
- Toys With Wings donation guidance: https://www.toyswithwings.org/donate-a-toy
- UAE Board on Books for Young People book-donation route: https://uaebby.org.ae/support-us/donate-books/

## Editorial roadmap

### First 30 days

- Deploy snippet and internal-link changes.
- Review and publish the three donation-cluster drafts with a suitable original or licensed hero image and visible source/update note.
- Refresh the toy-donation guide’s opening section so the first screen answers “where,” “drop-off,” “pickup,” and “what condition” immediately.
- Verify every organisation and location in the toy guide by its first-party page; remove old campaign-only locations.

### Days 31–60

- Build two supporting calculator explainers: “How UAE gratuity is calculated” and “How to add/remove 5% UAE VAT,” each linking directly to its calculator.
- Improve the electric-shaver and beard-trimmer introductions with a compact comparison table that answers waterproof, skin type, foil/rotary and travel intent before the product cards.
- Add contextual links between each product list and its individual review pages to strengthen crawl demand.

### Days 61–90

- Evaluate GSC by page and query, comparing the 28 days before and after deployment.
- Keep snippet variants that improve CTR; replace variants with no measurable lift.
- Expand only clusters that earn impressions: donation/decluttering, UAE employment calculations, VAT, and demonstrated product categories.

## Measurement targets

- Site CTR: 0.3% to at least 1.0% over the next 8–12 weeks.
- Toy-donation page: lift from roughly 0.33% page CTR toward 1% without losing impressions.
- Electric-shaver page: lift from roughly 0.11% page CTR toward 0.75%+.
- Increase non-toy pages’ share of total clicks so no single URL contributes more than 40%.
- Track UAE clicks separately; global impressions are secondary for this publication.
