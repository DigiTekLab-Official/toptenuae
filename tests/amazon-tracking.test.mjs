import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_AMAZON_AE_TRACKING_ID,
  LAPTOP_AFFILIATE_CATEGORIES,
  applyLaptopTrackingToListItems,
  createClusterAmazonDestination,
  getAmazonTrackingIdMapping,
} from '../src/lib/affiliate/amazon-tracking.js';

const categoryEnvironment = {
  AMAZON_PARTNER_TAG: DEFAULT_AMAZON_AE_TRACKING_ID,
  AMAZON_TRACKING_ID_LAPTOPS_GENERAL: 'approved-general-21',
  AMAZON_TRACKING_ID_LAPTOPS_GAMING: 'approved-gaming-21',
  AMAZON_TRACKING_ID_LAPTOPS_STUDENT: 'approved-student-21',
  AMAZON_TRACKING_ID_LAPTOPS_BUSINESS: 'approved-business-21',
  AMAZON_TRACKING_ID_LAPTOPS_AI: 'approved-ai-21',
};

const expectedIds = {
  'laptops-general': 'approved-general-21',
  'laptops-gaming': 'approved-gaming-21',
  'laptops-student': 'approved-student-21',
  'laptops-business': 'approved-business-21',
  'laptops-ai': 'approved-ai-21',
};

for (const category of LAPTOP_AFFILIATE_CATEGORIES) {
  test(`${category} receives its configured page-context tracking ID`, () => {
    const result = createClusterAmazonDestination({
      affiliateLink: 'https://www.amazon.ae/dp/B0DN5RWNNC?tag=old-21&tag=duplicate-21&th=1',
      asin: 'B0DN5RWNNC',
      category,
      environment: categoryEnvironment,
    });

    assert.ok(result);
    const destination = new URL(result.href);
    assert.equal(result.category, category);
    assert.equal(result.asin, 'B0DN5RWNNC');
    assert.equal(result.trackingId, expectedIds[category]);
    assert.equal(destination.hostname, 'www.amazon.ae');
    assert.equal(destination.pathname, '/dp/B0DN5RWNNC');
    assert.deepEqual(destination.searchParams.getAll('tag'), [expectedIds[category]]);
    assert.equal(destination.searchParams.get('th'), '1');
  });
}

test('the same product receives a different tag in general and gaming contexts', () => {
  const input = {
    affiliateLink: 'https://www.amazon.ae/dp/B0DN5RWNNC?tag=apfunbox06-21',
    asin: 'B0DN5RWNNC',
    environment: categoryEnvironment,
  };
  const general = createClusterAmazonDestination({...input, category: 'laptops-general'});
  const gaming = createClusterAmazonDestination({...input, category: 'laptops-gaming'});

  assert.equal(general.trackingId, 'approved-general-21');
  assert.equal(gaming.trackingId, 'approved-gaming-21');
  assert.notEqual(general.href, gaming.href);
});

test('missing and invalid cluster IDs use the established approved fallback', () => {
  const mapping = getAmazonTrackingIdMapping({
    AMAZON_PARTNER_TAG: 'apfunbox06-21',
    AMAZON_TRACKING_ID_LAPTOPS_GENERAL: 'laptops-general',
  });

  assert.equal(mapping['laptops-general'].amazonTrackingId, 'apfunbox06-21');
  assert.equal(mapping['laptops-general'].configured, false);
  assert.equal(mapping['laptops-gaming'].amazonTrackingId, 'apfunbox06-21');
  assert.equal(mapping['laptops-gaming'].configured, false);
});

test('invalid fallback configuration cannot replace the approved default', () => {
  const mapping = getAmazonTrackingIdMapping({AMAZON_PARTNER_TAG: 'not-approved'});
  assert.ok(Object.values(mapping).every(value => value.amazonTrackingId === 'apfunbox06-21'));
});

test('generic search, wrong ASIN and non-Amazon destinations are rejected', () => {
  const base = {category: 'laptops-general', environment: categoryEnvironment, asin: 'B0DN5RWNNC'};
  assert.equal(createClusterAmazonDestination({...base, affiliateLink: 'https://www.amazon.ae/s?k=B0DN5RWNNC'}), null);
  assert.equal(createClusterAmazonDestination({...base, affiliateLink: 'https://www.amazon.ae/dp/B0DZZWMB2L'}), null);
  assert.equal(createClusterAmazonDestination({...base, affiliateLink: 'https://example.com/dp/B0DN5RWNNC'}), null);
});

test('unavailable products remain without an active purchase destination', () => {
  const items = [{
    rank: 1,
    product: {
      asin: 'B0DN5RWNNC',
      affiliateLink: 'https://www.amazon.ae/dp/B0DN5RWNNC?tag=apfunbox06-21',
      availabilityStatus: 'unavailable',
    },
  }];
  const [result] = applyLaptopTrackingToListItems(items, 'laptops-gaming', categoryEnvironment);
  assert.equal(result.product.affiliateLink, undefined);
});

test('non-laptop clusters are not modified', () => {
  const items = [{product: {affiliateLink: 'https://www.amazon.ae/dp/B0DN5RWNNC?tag=apfunbox06-21'}}];
  assert.equal(applyLaptopTrackingToListItems(items, 'air_fryer', categoryEnvironment), items);
});
