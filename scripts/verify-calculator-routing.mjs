import assert from 'node:assert/strict';

const base = process.argv[2] || 'http://127.0.0.1:4340';
const site = 'https://toptenuae.com';
const finance = ['gratuity-calculator-uae', 'uae-vat-calculator', 'zakat-calculator', 'uae-loan-emi-calculator', 'rent-vs-buy-calculator-uae'];
const everyday = ['bmi-calculator-uae', 'age-calculator-uae', 'height-calculator-uae', 'calories-calculator-uae'];
const expectedFaqs = [7, 4, 4, 12, 10, 14, 14, 6, 8];
const pathFor = slug => `/${everyday.includes(slug) ? 'calculators' : 'finance-tools'}/${slug}`;
const api = new URL('https://kxdjzy8e.api.sanity.io/v2021-06-07/data/query/production');
api.searchParams.set('query', '*[_type == "tool" && !(_id in path("drafts.**"))]{"slug":slug.current,heroTags,relatedTools[]->{"slug":slug.current},faqs}');
const { result: docs } = await (await fetch(api)).json();
const parseSchemas = html => [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .flatMap(m => { const json = JSON.parse(m[1]); return json['@graph'] || [json]; });
const plain = value => value.replace(/&#x([a-f\d]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const get = async path => {
  const response = await fetch(base + path, { redirect: 'manual', signal: AbortSignal.timeout(25000) });
  assert.equal(response.status, 200, path);
  return response.text();
};

for (const [i, slug] of [...finance, ...everyday].entries()) {
  const path = pathFor(slug);
  const html = await get(path);
  const schemas = parseSchemas(html);
  const breadcrumbs = schemas.filter(s => s['@type'] === 'BreadcrumbList');
  assert.equal(breadcrumbs.length, 1, slug);
  assert.equal(breadcrumbs[0].itemListElement.at(-1).item, site + path);
  assert.ok(html.includes(`<link rel="canonical" href="${site + path}">`));
  assert.ok(html.includes(`<meta property="og:url" content="${site + path}">`));
  assert.equal(schemas.find(s => s['@type'] === 'SoftwareApplication')?.url, site + path);
  assert.equal((html.match(/<details\b/g) || []).length, expectedFaqs[i]);
  assert.equal(schemas.find(s => s['@type'] === 'FAQPage')?.mainEntity.length, expectedFaqs[i]);
  const doc = docs.find(d => d.slug === slug);
  const tagList = plain(html.match(/<ul[^>]*aria-label="Calculator topics"[^>]*>([\s\S]*?)<\/ul>/)?.[1] || '');
  for (const tag of doc.heroTags || []) assert.ok(tagList.includes(tag), `${slug}: tag ${tag}`);
  const curated = doc.relatedTools?.length > 0;
  const heading = curated ? 'Explore Other Tools' : 'More UAE Finance Tools';
  const relatedHtml = html.slice(html.indexOf(heading)).split('</section>')[0];
  const actualRelated = [...relatedHtml.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  const expectedRelated = (curated ? doc.relatedTools.map(t => t.slug) : finance.slice(0, 3).filter(s => s !== slug)).map(pathFor);
  assert.deepEqual(actualRelated, expectedRelated, `${slug}: related tools`);
  console.log(JSON.stringify({ slug, status: 200, breadcrumbs: 1, canonical: site + path, faqs: expectedFaqs[i], tags: doc.heroTags?.length || 0, relatedMode: curated ? 'curated' : 'fallback', relatedLinks: actualRelated }));
}

for (const slug of everyday) {
  for (const method of ['GET', 'HEAD']) {
    const response = await fetch(`${base}/finance-tools/${slug}`, { method, redirect: 'manual' });
    assert.equal(response.status, 301);
    assert.equal(new URL(response.headers.get('location'), base).pathname, pathFor(slug));
    console.log(JSON.stringify({ method, oldPath: `/finance-tools/${slug}`, status: response.status, location: response.headers.get('location') }));
  }
}
for (const [hub, slugs] of [['finance-tools', finance], ['calculators', everyday]]) {
  const html = await get('/' + hub);
  const list = parseSchemas(html).find(s => s['@type'] === 'CollectionPage').mainEntity.itemListElement.map(i => i.url);
  assert.deepEqual(list.sort(), slugs.map(s => site + pathFor(s)).sort());
  for (const slug of slugs) assert.ok(html.includes(`href="${pathFor(slug)}"`));
  console.log(JSON.stringify({ hub, cards: list.length, urls: list }));
}
const sitemap = await get('/sitemap.xml');
for (const slug of [...finance, ...everyday]) assert.ok(sitemap.includes(`<loc>${site}${pathFor(slug)}</loc>`));
for (const slug of everyday) assert.ok(!sitemap.includes(`<loc>${site}/finance-tools/${slug}</loc>`));
assert.ok(sitemap.includes(`<loc>${site}/calculators</loc>`));
console.log('PASS: sitemap contains all nine canonical tool URLs and calculators hub; noncanonical finance paths absent');
for (const path of ['/search?q=BMI', '/search?q=Age', '/report']) {
  const html = await get(path);
  const slug = path.includes('BMI') ? everyday[0] : everyday[1];
  assert.ok(html.includes(pathFor(slug)), path);
  assert.ok(!html.includes(`/finance-tools/${slug}`), path);
}
console.log('PASS: search and report tool links use the new paths');
