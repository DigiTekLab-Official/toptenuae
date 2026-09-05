import test from 'node:test';
import assert from 'node:assert/strict';
import {getAffiliateCategory} from '../src/lib/affiliate/category.js';

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
