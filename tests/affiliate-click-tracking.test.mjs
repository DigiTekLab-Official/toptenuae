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
  assert.equal(parseAmazonAffiliateDestination('ftp://amazon.ae/product'), null);
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
  assert.equal(bindings,3);
  assert.equal(browser.dataLayer.length,1);
  assert.deepEqual(browser.dataLayer[0], {
    event:'affiliate_click', affiliate_network:'amazon_ae', page_path:'/top-ten/example',
    affiliate_product:'Existing product',affiliate_cta:'quick_picks',affiliate_destination:'https://www.amazon.ae/dp/B000?tag=existing-21',
    affiliate_category:'automotive',affiliate_position:'3',affiliate_tracking_id:'existing-21',
  });
});

const createBrowser = (readyState = 'complete') => {
  const listeners = {};
  const links = [];
  class Element {}
  class Anchor extends Element {
    href = 'https://www.amazon.ae/dp/B000?tag=apfunbox06-21&ref_=abc#details';
    dataset = {affiliateProduct:'Laptop', affiliateCta:'product_card', affiliateCategory:'laptops-general', affiliatePosition:'1'};
    target = '_blank';
    closest() { return this; }
    querySelector() { return null; }
    getAttribute() { return null; }
  }
  const browser = {
    Element, HTMLAnchorElement:Anchor,
    location:{href:'https://toptenuae.com/top-ten/best-laptops-uae',pathname:'/top-ten/best-laptops-uae'},
    document:{readyState,querySelectorAll(){return links;},addEventListener(type,handler,options){(listeners[type] ||= []).push({handler,options});}},
    dataLayer:[],
  };
  return {browser,links,Anchor,listeners,fire(type,event = {}) { for (const {handler} of listeners[type] || []) handler({type,...event}); }};
};

test('normal, modified, middle, keyboard and mobile activations record once and preserve navigation', async () => {
  const {installAffiliateClickTracking} = await import('../src/lib/affiliate/click-tracking.js');
  const fixture = createBrowser();
  const {browser,Anchor,fire} = fixture;
  installAffiliateClickTracking(browser);
  for (const activation of [
    {type:'click',button:0}, {type:'click',button:0,ctrlKey:true},
    {type:'click',button:0,metaKey:true}, {type:'auxclick',button:1},
    {type:'click',button:0,detail:0}, {type:'click',detail:1},
  ]) {
    const target = new Anchor();
    target.dataset.affiliateTrackingId = 'stale-id';
    let prevented = false;
    const before = browser.dataLayer.length;
    fire(activation.type, {...activation,target,preventDefault(){prevented = true;}});
    assert.equal(browser.dataLayer.length, before + 1);
    assert.equal(prevented, false);
    assert.equal(target.target, '_blank');
    const payload = browser.dataLayer.at(-1);
    assert.equal(payload.affiliate_destination, target.href);
    assert.equal(payload.affiliate_tracking_id, 'apfunbox-tech-21');
    assert.equal(payload.affiliate_category, 'laptops-general');
    assert.equal(new URL(target.href).searchParams.get('ref_'), 'abc');
    assert.equal(new URL(target.href).hash, '#details');
  }
  // Repeated legitimate activations are retained; no debounce is applied.
  assert.equal(browser.dataLayer.length, 6);
});

test('right-button activation and non-Amazon links do not emit affiliate events', async () => {
  const {installAffiliateClickTracking} = await import('../src/lib/affiliate/click-tracking.js');
  const {browser,Anchor,fire} = createBrowser();
  installAffiliateClickTracking(browser);
  fire('auxclick', {button:2,target:new Anchor()});
  fire('click', {button:2,target:new Anchor()});
  const noon = new Anchor();
  noon.href = 'https://www.noon.com/offer?tag=another-owner';
  fire('click', {button:0,target:noon});
  assert.equal(browser.dataLayer.length, 0);
  assert.equal(noon.href, 'https://www.noon.com/offer?tag=another-owner');
});

test('initial, Astro-transition and late links route without multiplying listeners', async () => {
  const {installAffiliateClickTracking} = await import('../src/lib/affiliate/click-tracking.js');
  const {browser,links,Anchor,listeners,fire} = createBrowser('loading');
  links.push(new Anchor());
  installAffiliateClickTracking(browser);
  installAffiliateClickTracking(browser);
  assert.equal(listeners.DOMContentLoaded[0].options.once, true);
  fire('DOMContentLoaded');
  assert.equal(new URL(links[0].href).searchParams.get('tag'), 'apfunbox-tech-21');
  const transitioned = new Anchor();
  transitioned.dataset.affiliateCategory = 'home';
  links.push(transitioned);
  fire('astro:page-load');
  fire('astro:page-load');
  installAffiliateClickTracking(browser);
  assert.equal(new URL(transitioned.href).searchParams.get('tag'), 'apfunbox-home-21');
  assert.equal(listeners.click.length, 1);
  assert.equal(listeners.auxclick.length, 1);
  assert.equal(listeners['astro:page-load'].length, 1);
  const late = new Anchor();
  late.dataset.affiliateCategory = 'luggage';
  fire('click', {button:0,target:late});
  assert.equal(new URL(late.href).searchParams.get('tag'), 'apfunbox-luggage-21');
  assert.equal(browser.dataLayer.length, 1);
});

test('analytics dispatch failure preserves native activation and the routed destination', async () => {
  const {installAffiliateClickTracking} = await import('../src/lib/affiliate/click-tracking.js');
  const {browser,Anchor,fire} = createBrowser();
  browser.dataLayer.push = () => {throw new Error('analytics unavailable');};
  installAffiliateClickTracking(browser);
  const target = new Anchor();
  assert.doesNotThrow(() => fire('click',{button:0,target,preventDefault(){assert.fail('navigation prevented');}}));
  assert.equal(new URL(target.href).searchParams.get('tag'), 'apfunbox-tech-21');
});
