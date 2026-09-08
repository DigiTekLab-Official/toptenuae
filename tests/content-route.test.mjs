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
