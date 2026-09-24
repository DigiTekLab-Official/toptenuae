# Calculator discovery surfaces — 2026-09-24

## Read-only findings reported before edits

Base: cb71f019d0223500b279ca4236f15a4a1436e5f8, freshly fetched origin/main.

- Header.astro: hardcoded shared nav array had Finance Tools -> /finance-tools.
  A separate hardcoded mobile-only Calculators -> /calculators link existed;
  desktop lacked it and the standalone mobile link lacked active-page styling.
- Footer.astro: hardcoded links for Gratuity, VAT, Zakat under /finance-tools;
  View All Tools -> /finance-tools. No calculators hub or Loan EMI direct link.
- No stale old BMI/Age links in either menu or the homepage source/rendering.
- home.repository.ts HOME_SECTION_CATEGORIES included finance-tools, not
  calculators. HOME_QUERY selects those category documents and up to four posts
  referencing each. index.astro iterates them using the same tool-card renderer.
  Adding calculators after finance-tools is sufficient; no query/template redesign.

## Minimal changes

- Shared nav array now owns Calculators for desktop/mobile; standalone link removed.
- Footer Discover gets Calculators, with existing link styling. Finance column
  adds Loan EMI; previous finance links, heading and hub CTA remain unchanged.
- Homepage category configuration adds calculators; title/description come from
  the existing Health & Everyday Calculators UAE category. Existing cards reused.
- No new visual hierarchy or prominent placement was introduced. No design decision
  is needed for this mechanical use of the existing homepage section mechanism.

## Sanity

Patched only published age-calculator-uae.heroTags, revision guarded:
Age in Years / Months & Days / Date of Birth / UAE Date.
Before/after full-document comparison excluded only heroTags and automatic
_rev/_updatedAt metadata and confirmed all other fields unchanged. No drafts or
duplicate matching tools existed. No schema definitions changed.

## Verification

- Existing 40 tests pass. Production build and Astro check pass (0 errors/warnings).
- Warning comparison against previous release: identical normalized messages;
  23 warning-bearing lines in both logs, including duplicate Node notices. The
  earlier report's count of 22 understated the raw line count; no new warnings.
- Local rendered HTML checked for desktop/mobile nav uniqueness, footer hub and
  four finance links, two new homepage cards and four unchanged finance cards,
  no old-path links, exactly four Age tags and shared BMI tag-pill classes.
- Desktop 1280px breakpoint: links do not overlap logo/actions; no horizontal
  overflow. Mobile 390px: menu opens and displays one Calculators entry.
- Published Age tags were visibly confirmed live before frontend deployment.
- Release commit/deployment and post-deployment checks are reported in the task.

Original dirty-tree status fingerprint:
035ff01e0c187a4ad0691d127d5078b3c6ca73d8829630e23e12b6a7126a5533.
