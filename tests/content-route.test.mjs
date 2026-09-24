import assert from 'node:assert/strict'
import test from 'node:test'

import {buildContentPath} from '../src/lib/contentRoute.ts'

test('routes buyer guides through their dynamic category', () => {
  assert.equal(
    buildContentPath({_type: 'buyerGuide', slug: 'waterproof-shaver', categorySlug: 'electric-shavers'}),
    '/electric-shavers/waterproof-shaver',
  )
})

test('falls back safely when a buyer guide has no category', () => {
  assert.equal(
    buildContentPath({_type: 'buyerGuide', slug: 'orphaned-guide'}),
    '/reviews/orphaned-guide',
  )
})

test('keeps dedicated top-ten routes independent of category', () => {
  assert.equal(
    buildContentPath({_type: 'topTenList', slug: 'best-body-groomers-uae', categorySlug: 'body-groomers'}),
    '/top-ten/best-body-groomers-uae',
  )
})

test('routes any tool assigned to the calculators category without a slug allowlist', () => {
  for (const slug of ['bmi-calculator-uae', 'age-calculator-uae', 'future-wellness-tool']) {
    assert.equal(buildContentPath({_type: 'tool', slug, categorySlug: 'calculators'}), `/calculators/${slug}`)
  }
})

test('keeps finance tools and legacy uncategorized tools on their established routes', () => {
  for (const categorySlug of ['finance-tools', undefined, 'unregistered-category']) {
    for (const slug of ['gratuity-calculator-uae', 'uae-vat-calculator', 'zakat-calculator', 'uae-loan-emi-calculator']) {
      assert.equal(buildContentPath({_type: 'tool', slug, categorySlug}), `/finance-tools/${slug}`)
    }
  }
})

test('tool routes reject invalid slugs and normalize category input', () => {
  assert.equal(buildContentPath({_type: 'tool', slug: '../bmi', categorySlug: 'calculators'}), null)
  assert.equal(buildContentPath({_type: 'tool', slug: 'bmi', categorySlug: '/Calculators/'}), '/calculators/bmi')
})

test('keeps the S26 migration canonical while CMS and code deploy independently', () => {
  const slug = 'samsung-galaxy-s26-ultra-specs-uae-price'
  assert.equal(
    buildContentPath({_type: 'howTo', slug, categorySlug: 'smartphones'}),
    `/smartphones/${slug}`,
  )
  assert.equal(
    buildContentPath({_type: 'buyerGuide', slug, categorySlug: 'smartphones'}),
    `/smartphones/${slug}`,
  )
})
