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

test('installing tracking twice still emits one complete event per CTA click', async () => {
  const { installAffiliateClickTracking } = await import('../src/lib/affiliate/click-tracking.js');
  const listeners = {};
  let bindings = 0;
  class Element {}
  class Anchor extends Element {
    href = 'https://www.amazon.ae/dp/B000?tag=existing-21';
    dataset = {affiliateProduct:'Existing product', affiliateCta:'quick_picks', affiliateCategory:'automotive', affiliatePosition:'3'};
    textContent = 'Check latest price on Amazon.ae';
    closest() { return this; }
    querySelector() { return null; }
    getAttribute() { return null; }
  }
  const browser = {Element,HTMLAnchorElement:Anchor,location:{href:'https://toptenuae.com/top-ten/example',pathname:'/top-ten/example'},document:{addEventListener(type,handler){bindings++;listeners[type]=handler;}},dataLayer:[]};
  installAffiliateClickTracking(browser);
  installAffiliateClickTracking(browser);
  listeners.click({type:'click',button:0,target:new Anchor()});
  assert.equal(bindings,2);
  assert.equal(browser.dataLayer.length,1);
  assert.deepEqual(browser.dataLayer[0], {
    event:'affiliate_click', affiliate_network:'amazon_ae', page_path:'/top-ten/example',
    affiliate_product:'Existing product',affiliate_cta:'quick_picks',affiliate_destination:'https://www.amazon.ae/dp/B000?tag=existing-21',
    affiliate_category:'automotive',affiliate_position:'3',affiliate_tracking_id:'existing-21',
  });
});

test('normal, modified, middle and mobile-style clicks each emit one event', async () => {
  const { installAffiliateClickTracking } = await import('../src/lib/affiliate/click-tracking.js');
  const listeners = {};
  class Element {}
  class Anchor extends Element {
    href = 'https://www.amazon.ae/dp/B000000000?tag=apfunbox06-21';
    dataset = {affiliateProduct:'Laptop',affiliateCta:'product_card',affiliateCategory:'laptops-general',affiliatePosition:'1'};
    textContent = 'Check offer';
    closest() { return this; }
    querySelector() { return null; }
    getAttribute() { return null; }
  }
  const browser = {Element,HTMLAnchorElement:Anchor,location:{href:'https://toptenuae.com/top-ten/best-laptops-uae',pathname:'/top-ten/best-laptops-uae'},document:{addEventListener(type,handler){listeners[type]=handler;}},dataLayer:[]};
  installAffiliateClickTracking(browser);
  const target = new Anchor();
  listeners.click({type:'click',button:0,target});
  listeners.click({type:'click',button:0,ctrlKey:true,target});
  listeners.click({type:'click',button:0,metaKey:true,target});
  listeners.auxclick({type:'auxclick',button:1,target});
  listeners.click({type:'click',target});
  assert.equal(browser.dataLayer.length, 5);
  assert.ok(browser.dataLayer.every(event => event.event === 'affiliate_click'));
  assert.ok(browser.dataLayer.every(event => event.affiliate_category === 'laptops-general'));
  assert.ok(browser.dataLayer.every(event => event.affiliate_tracking_id === 'apfunbox06-21'));
});
