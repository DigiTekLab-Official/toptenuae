# Rent vs Buy Calculator UAE — 2026-09-25

## Scope and architecture

- Isolated branch `codex/rent-vs-buy-calculator`, based on origin/main `b1872a3a363083dab6173c0153d3568a564e83e0`.
- Canonical `/finance-tools/rent-vs-buy-calculator-uae`; exact component registration `rent-buy-uae` in `src/layouts/ToolLayout.astro`.
- New client component `src/components/tools/RentVsBuyCalculator.astro`; pure calculations `src/lib/calculators/rent-vs-buy.js`; tests `tests/rent-vs-buy-calculator.test.mjs`.
- Existing shared metadata, breadcrumb, FAQ, tool layout and category routing retained. SoftwareApplication features describe implemented capabilities only.

## Financial model

Equal upfront capital and monthly budgets. Renter invests down-payment plus purchase-fee equivalent; the cheaper housing option invests each month's savings. Fixed-rate reducing-balance mortgage, 0% and cash-purchase handling, annual rent changes, effective monthly investment compounding, end-of-month contributions. Sale assumed at every sampled year-end; buyer position = sale proceeds minus selling fees and mortgage balance plus invested savings. No negative investment balances invented to finance a budget deficit.

Twelve bounded inputs; finite-number validation; whole-year horizons; no finance APIs or dependencies. Rates and fees are editable illustrative values, not official UAE-wide charges or lending eligibility. Owner costs stay constant. Exclusions and assumptions are visible, including rental cheque timing, moving/admin costs and inflation. Source links point to DLD fee information and CBUAE mortgage regulations.

Default example after five years: monthly mortgage AED 4,446.6598237; buyer position AED 427,644.5993276; renter position AED 316,329.7546240; difference AED 111,314.8447036. Display uses whole AED. This is a scenario, not a forecast or recommendation.

## Content and internal linking

`scripts/publish-rent-vs-buy-tool.mjs` defaults to plan-only; `--publish` delegates to the existing authenticated Sanity CLI session. Creates one document with ten visible/schema FAQs. Revision-guarded transaction appends related-tool references to Loan EMI and Gratuity, preserving existing references. Verifies complete existing-tool documents afterward (excluding revision/timestamp) so unrelated content remains unchanged. Refuses existing new slug/ID or drafts of either inbound target.

Homepage feed remains four latest finance cards; finance hub now has five. Descriptive card CTA added without query changes. Footer gets a direct link. New article has contextual links and reciprocal related cards to Loan EMI/Gratuity. No relevant property guide was found for an additional contextual inbound link; unrelated articles left untouched. Links aid discovery but do not guarantee traffic or indexing.

## Verification and hygiene

- Calculation tests include independently derived closed-form mortgage balance, 0%, cash purchase, fees, effective investment returns, payoff, annual rent growth, negative growth and invalid/nonfinite inputs.
- Browser verified default five-year results and five table rows, blank-input alert/focus/aria-invalid and stale-result hiding, plus a zero-interest scenario. At 390px viewport the document is 390px wide, with contained table overflow.
- Local nine-tool raw HTML checks: one canonical BreadcrumbList, matching canonical/OG/SoftwareApplication URL, correct FAQ counts, tags and related links. Both hubs, legacy redirects, homepage four-card feed, footer and generated sitemap pass.
- Original repository status fingerprint at start: `035ff01e0c187a4ad0691d127d5078b3c6ca73d8829630e23e12b6a7126a5533`. Work was isolated; build-generated `public/sitemap.xml` is excluded from the commit (CI regenerates it).
- No existing calculator formulas, Sanity schemas or dependencies changed. Final commit/deployment identifiers and live verification are reported in the task handoff.
