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

test('attributes laptop money pages by commercial cluster', () => {
  assert.equal(getAffiliateCategory('best-laptops-uae', '', 'tech'), 'laptops-general');
  assert.equal(getAffiliateCategory('best-gaming-laptops-uae', '', 'tech'), 'laptops-gaming');
  assert.equal(getAffiliateCategory('best-laptops-for-students-uae', '', 'tech'), 'laptops-student');
  assert.equal(getAffiliateCategory('best-business-laptops-uae', '', 'tech'), 'laptops-business');
  assert.equal(getAffiliateCategory('best-ai-laptops-uae', '', 'tech'), 'laptops-ai');
});

test('supports other CMS sections and tolerates missing values', () => {
  assert.equal(getAffiliateCategory('unknown-guide', '', 'health'), 'health');
  assert.equal(getAffiliateCategory(), undefined);
  assert.equal(getAffiliateCategory('', '', '  '), undefined);
  assert.equal(getAffiliateCategory('', '', null), undefined);
});
