import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createAffiliateClickPayload,
  parseAmazonAffiliateDestination,
} from '../src/lib/affiliate/click-tracking.js';

test('accepts Amazon.ae and amzn.to destinations', () => {
  assert.equal(parseAmazonAffiliateDestination('https://amzn.to/example')?.hostname, 'amzn.to');
  assert.equal(parseAmazonAffiliateDestination('https://www.amazon.ae/dp/B000?tag=page-21')?.hostname, 'www.amazon.ae');
});

test('rejects non-Amazon and lookalike destinations', () => {
  assert.equal(parseAmazonAffiliateDestination('https://example.com/?next=amazon.ae'), null);
  assert.equal(parseAmazonAffiliateDestination('https://amazon.ae.example.com/product'), null);
  assert.equal(parseAmazonAffiliateDestination('not a valid url', 'not a valid base'), null);
});

test('builds the stable GA4 payload and reads a direct tracking tag', () => {
  const destination = parseAmazonAffiliateDestination('https://www.amazon.ae/dp/B000?tag=shavers-21');
  const payload = createAffiliateClickPayload({
    pagePath: '/top-ten/best-electric-shaver-uae',
    destination,
    product: 'Braun Series 9',
    cta: 'product_card',
    category: 'electric_shaver',
    position: 1,
  });

  assert.deepEqual(payload, {
    event: 'affiliate_click',
    affiliate_network: 'amazon_ae',
    page_path: '/top-ten/best-electric-shaver-uae',
    affiliate_product: 'Braun Series 9',
    affiliate_cta: 'product_card',
    affiliate_destination: 'https://www.amazon.ae/dp/B000?tag=shavers-21',
    affiliate_category: 'electric_shaver',
    affiliate_position: '1',
    affiliate_tracking_id: 'shavers-21',
  });
});

test('leaves tracking ID blank for shortened links instead of guessing', () => {
  const destination = parseAmazonAffiliateDestination('https://amzn.to/example');
  const payload = createAffiliateClickPayload({ destination });
  assert.equal(payload.affiliate_tracking_id, '');
});
