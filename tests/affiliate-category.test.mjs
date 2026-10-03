import test from 'node:test';
import assert from 'node:assert/strict';
import {getAffiliateCategory} from '../src/lib/affiliate/category.js';
import {getAmazonTrackingId} from '../src/lib/affiliate/tracking-id.js';

test('uses the CMS section for new Automotive guide types', () => {
  assert.equal(getAffiliateCategory('best-car-vacuum-cleaners-uae', '', 'automotive'), 'automotive');
  assert.equal(getAffiliateCategory('best-jump-starters-uae', '', 'automotive'), 'automotive');
});

test('preserves established topic-level tracking labels', () => {
  assert.equal(getAffiliateCategory('best-tyre-inflators-uae', '', 'automotive'), 'tyre_inflator');
  assert.equal(getAffiliateCategory('best-air-fryers-uae-2026', '', 'home-kitchen'), 'air_fryer');
  assert.equal(getAffiliateCategory('', 'Best Coffee Makers', 'home-kitchen'), 'coffee_maker');
});

test('supports other CMS sections and tolerates missing values', () => {
  assert.equal(getAffiliateCategory('unknown-guide', '', 'health'), 'health');
  assert.equal(getAffiliateCategory(), undefined);
  assert.equal(getAffiliateCategory('', '', '  '), undefined);
  assert.equal(getAffiliateCategory('', '', null), undefined);
});

test('established laptop slugs take precedence over incidental title keywords', () => {
  for (const [slug,title,expected] of [
    ['best-laptops-uae','7 Best Laptops in UAE (2026): Work, Study & Gaming Picks','laptops-general'],
    ['best-gaming-laptops-uae','Best Gaming Laptops in UAE (2026): Picks by GPU and Budget','laptops-gaming'],
    ['best-laptops-for-students-uae','Best Laptops for Students in UAE (2026): 5 Picks by Study Need','laptops-student'],
    ['best-business-laptops-uae','Best Business and Office Laptops in UAE (2026)','laptops-business'],
    ['best-ai-laptops-uae','8 Best AI-Powered Laptops in UAE (2026)','laptops-ai'],
  ]) {
    const category = getAffiliateCategory(slug,title,'tech');
    assert.equal(category, expected);
    assert.equal(getAmazonTrackingId(category), 'apfunbox-tech-21');
  }
  assert.equal(getAffiliateCategory(' BEST-LAPTOPS-UAE ', 'Gaming laptop', 'tech'), 'laptops-general');
});

test('other laptop titles and CMS fallbacks retain production behavior', () => {
  assert.equal(getAffiliateCategory('unlisted-gaming-guide','Gaming laptop for students','tech'), 'laptop');
  assert.equal(getAffiliateCategory('other-guide','AI office laptop','tech'), 'laptop');
  assert.equal(getAffiliateCategory('other-guide','Phone guide','  automotive  '), 'automotive');
  assert.equal(getAffiliateCategory(null,null,null), undefined);
});
