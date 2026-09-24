# Height and Calories release — 24 September 2026

## Scope and architecture

Isolated from freshly fetched origin/main fcdd9d17ae1e25166a4f4e0af3ebd438d9d2c7fc.
Height is a cm/feet/inches converter, chosen from the supplied UAE Trends export,
not a child-height predictor. Calories estimates adult daily energy needs.

ToolLayout receives exact component IDs height-uae and calories-uae, with exact
slug fallbacks. Pure JS modules own calculation/validation; Astro cards own input,
display rounding, errors, aria-invalid/focus and polite live result announcements.
Both initialize on initial load and Astro page navigation, guarded against repeats.
No external finance/nutrition API, new dependency, routing refactor or schema field.

## Formula and limitations

- Height: 1 inch = 2.54 cm exactly; imperial input uses whole feet plus decimal
  inches below 12. Combined output rounding carries inches into the next foot.
- Calories: simplified Mifflin–St Jeor, 10W + 6.25H - 5A + 5 (male) or -161
  (female). Source: https://pubmed.ncbi.nlm.nih.gov/2305711/ .
- Activity factors 1.2/1.375/1.55/1.725/1.9 are labelled modelling assumptions,
  not measured expenditure or coefficients from the original paper.
- Ten-percent lower/higher scenarios are illustrative, not diet prescriptions or
  weight-change guarantees. Lower result withheld for BMI below 18.5 or values
  below the conservative tool guardrails (1,500 male / 1,200 female).
- Adults 18–100, weight 30–300 kg, height 100–250 cm. Clear exclusions for
  pregnancy/breastfeeding and advice for clinical or eating-disorder situations.
  Input limits do not assert universal medical applicability.

## Sanity

Created only height-calculator-uae and calories-calculator-uae. Category reference:
topten-category-calculators. Each includes four heroTags and three related-tool
references; Height has six visible FAQs, Calories eight. Unique SEO fields and
truthful SoftwareApplication features are included. Source links appear in content.
Existing schema definitions were read, not edited. Uses overview, not an undefined
description field. Atomic create-only publisher checks drafts/slug collisions,
category validity and existing references, then verifies prior tool revisions.

Age/BMI editorial changes predated this task: Age updated at 13:14 UTC (14 FAQs,
five tags and BMI related link); BMI updated at 13:18 UTC (Age related link added).
These are preserved. New documents created at 16:40 UTC. No existing tool writes.

## Local checks

- 47/47 tests pass (seven new tests); build/TypeScript check pass, zero Astro
  errors/warnings. Same 23 warning-bearing toolchain lines, no new messages.
- Height 175 cm -> 5 ft 8.90 in; 5 ft 9 in -> 175.26 cm. Invalid inches rejected;
  changing input/direction hides old results. Error state exposes aria-invalid.
- Calories 30/male/70kg/175cm/moderate -> maintenance 2,556, resting 1,649,
  lower 2,300, higher 2,811 kcal/day. Underweight input hides lower result;
  age 17 rejected with focused accessible error.
- 390px mobile checks: both calculators fit without horizontal overflow.
- Verification scripts cover all eight canonical/OG/application URLs, single
  breadcrumbs, FAQ HTML/schema counts, tag/related rendering, redirects, hubs,
  sitemap and homepage four-plus-four cards. Live results follow in task report.

Original dirty-tree status fingerprint:
035ff01e0c187a4ad0691d127d5078b3c6ca73d8829630e23e12b6a7126a5533.
Generated public/sitemap.xml is excluded from the commit; build regenerates it.
