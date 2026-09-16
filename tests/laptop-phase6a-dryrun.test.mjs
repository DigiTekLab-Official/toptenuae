import assert from 'node:assert/strict'
import test from 'node:test'
import {createAffiliateClickPayload, parseAmazonAffiliateDestination} from '../src/lib/affiliate/click-tracking.js'
import {
  CANONICAL, CURRENT_PRODUCT_ID, EVIDENCE, LIST_ITEMS, PAGE_ID, PAGE_PATH, PAGE_UPDATE,
  PRODUCTS, TAG, buildDryRunPlan, createExpectedAffiliatePayload, isEligibleEvidence, validateDryRunPlan,
} from '../scripts/prepare-laptop-affiliate-phase6a-dryrun.mjs'

const state = {
  page: {_id: PAGE_ID, _rev: 'test-revision', slug: {current: 'best-laptop-under-1500-aed-uae'}},
  currentProduct: {_id: CURRENT_PRODUCT_ID, asin: 'B0DCLJ9V2B'},
  candidateDocuments: [],
}

test('dry-run has exactly three new, orderable products within the AED 1,500 ceiling', () => {
  assert.equal(EVIDENCE.length, 3)
  assert.ok(EVIDENCE.every(item => item.condition === 'new'))
  assert.ok(EVIDENCE.every(isEligibleEvidence))
  assert.deepEqual(EVIDENCE.map(item => item.asin), ['B0F9LRN47N', 'B0D2YDZWC1', 'B0GQVG2Q7P'])
})

test('each product uses the exact ASIN, direct Amazon.ae destination and approved tag', () => {
  for (const product of PRODUCTS) {
    const url = new URL(product.affiliateLink)
    assert.equal(url.hostname, 'www.amazon.ae')
    assert.equal(url.pathname, `/dp/${product.asin}`)
    assert.equal(url.searchParams.get('tag'), TAG)
    assert.equal(url.searchParams.get('th'), '1')
  }
})

test('unavailable suppression rejects an otherwise in-budget product', () => {
  assert.equal(isEligibleEvidence({...EVIDENCE[0], orderable: false}), false)
  assert.equal(isEligibleEvidence({...EVIDENCE[0], condition: 'renewed'}), false)
  assert.equal(isEligibleEvidence({...EVIDENCE[0], price: 1500.01}), false)
})

test('roles and limitations are explicit and no product review slug is created', () => {
  assert.deepEqual(EVIDENCE.map(item => item.role), [
    'Portable Chromebook / note-taking',
    'Basic Windows student 2-in-1',
    'Full-size basic Windows — qualified inclusion',
  ])
  assert.ok(LIST_ITEMS.every(item => item.whySelected && item.skipIf))
  assert.ok(PRODUCTS.every(product => !('slug' in product)))
})

test('current product is replaced only on the active list and URL/indexability are preserved', () => {
  assert.equal(LIST_ITEMS.length, 3)
  assert.ok(!LIST_ITEMS.some(item => item.product._ref === CURRENT_PRODUCT_ID))
  assert.equal(PAGE_UPDATE.seo.canonicalUrl, CANONICAL)
  assert.equal(PAGE_UPDATE.seo.noIndex, false)
  assert.equal(PAGE_UPDATE.seo.schemaType, 'ItemList')
})

test('transaction preview is revision locked and touches only three creates plus the target page', () => {
  const plan = buildDryRunPlan(state)
  assert.equal(validateDryRunPlan(plan), true)
  assert.equal(plan.mutations.length, 4)
  assert.deepEqual(plan.mutations.map(mutation => mutation.create?._id || mutation.patch.id), [
    ...PRODUCTS.map(product => product._id), PAGE_ID,
  ])
  assert.equal(plan.mutations.at(-1).patch.ifRevisionID, 'test-revision')
})

test('each product card produces the one canonical laptop affiliate event', () => {
  PRODUCTS.forEach((product, index) => {
    const destination = parseAmazonAffiliateDestination(product.affiliateLink)
    const actual = createAffiliateClickPayload({
      pagePath: PAGE_PATH, destination, product: product.title, cta: 'product_card',
      category: 'laptops-general', position: index + 1,
    })
    assert.deepEqual(actual, createExpectedAffiliatePayload(product, index + 1))
    assert.equal(actual.event, 'affiliate_click')
    assert.equal(actual.affiliate_tracking_id, TAG)
  })
})
