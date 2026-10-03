import assert from 'node:assert/strict';
import test from 'node:test';
import {getAmazonTrackingId,routeAmazonAffiliateUrl,routeAmazonAffiliateLink} from '../src/lib/affiliate/tracking-id.js';

test('routes all literal categories and unknown/missing fallback', () => {
  for (const [category,tag] of [
    ['grooming','apfunbox-groom-21'],['automotive','apfunbox-auto-21'],['home','apfunbox-home-21'],
    ['luggage','apfunbox-luggage-21'],['tech','apfunbox-tech-21'],['unknown','apfunbox06-21'],
    [undefined,'apfunbox06-21'],[null,'apfunbox06-21'],['','apfunbox06-21'],
  ]) assert.equal(getAmazonTrackingId(category),tag);
});

test('established aliases and normalized category labels retain parent routing', () => {
  for (const [category,tag] of [
    ['electric_shaver','apfunbox-groom-21'],['personal care','apfunbox-groom-21'],
    ['tyre_inflator','apfunbox-auto-21'],['home-kitchen','apfunbox-home-21'],
    ['coffee_maker','apfunbox-home-21'],['travel','apfunbox-luggage-21'],['laptops-general','apfunbox-tech-21'],
    [' BABY_MONITOR ','apfunbox-tech-21'],
  ]) assert.equal(getAmazonTrackingId(category),tag);
});

test('managed and untagged HTTP(S) links preserve unrelated parameters/fragments and are idempotent', () => {
  for (const href of ['https://www.amazon.ae/dp/B000?tag=apfunbox06-21&th=1&ref_=abc#details','http://amazon.ae/dp/B000?th=1&ref_=abc#details']) {
    const routed = routeAmazonAffiliateUrl(href,'automotive');
    const url = new URL(routed);
    assert.deepEqual(url.searchParams.getAll('tag'), ['apfunbox-auto-21']);
    assert.equal(url.searchParams.get('th'),'1');
    assert.equal(url.searchParams.get('ref_'),'abc');
    assert.equal(url.hash,'#details');
    assert.equal(routeAmazonAffiliateUrl(routed,'automotive'),routed);
  }
});

test('eligible duplicate managed tags collapse to one even if the first tag is already correct', () => {
  for (const tags of ['tag=apfunbox-tech-21&tag=apfunbox06-21','tag=apfunbox06-21&tag=apfunbox-home-21']) {
    const url = new URL(routeAmazonAffiliateUrl(`https://amazon.ae/dp/B000?${tags}`,'tech'));
    assert.deepEqual(url.searchParams.getAll('tag'), ['apfunbox-tech-21']);
  }
});

test('protected and third-party ownership are unchanged including non-first duplicate tags', () => {
  for (const tag of ['onamzapfunbox-21','ameerparveen-21','another-owner-21']) {
    for (const query of [`tag=${tag}`,`tag=apfunbox06-21&tag=${tag}`]) {
      const href = `https://www.amazon.ae/dp/B000?${query}&ref_=abc#details`;
      assert.equal(routeAmazonAffiliateUrl(href,'tech'),href);
    }
  }
});

test('short links, lookalikes, foreign Amazon hosts, unsupported protocols and malformed input stay unchanged', () => {
  for (const href of ['https://amzn.to/example','https://amazon.ae.example.com/dp/B000','https://amazon.com/dp/B000','ftp://amazon.ae/dp/B000','javascript:alert(1)','not a URL','',null]) {
    assert.equal(routeAmazonAffiliateUrl(href,'tech'),href);
  }
});

test('explicit link category overrides inherited context and stale payload tags are cleared', () => {
  const link = {href:'https://amazon.ae/dp/B000',dataset:{affiliateCategory:'home'},closest(){return {dataset:{affiliateCategory:'tech'}};}};
  routeAmazonAffiliateLink(link);
  assert.equal(new URL(link.href).searchParams.get('tag'),'apfunbox-home-21');
  link.href = 'https://amzn.to/example';
  routeAmazonAffiliateLink(link);
  assert.equal(link.dataset.affiliateTrackingId,'');
});
