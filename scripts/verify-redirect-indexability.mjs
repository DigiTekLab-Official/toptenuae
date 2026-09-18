import assert from 'node:assert/strict';
import http from 'node:http';

import {
  KNOWN_GONE_PATHS,
  LEGACY_REDIRECTS,
} from '../src/lib/seo/legacy-redirects.ts';

const origin = process.env.REGRESSION_ORIGIN || 'http://127.0.0.1:8788';
let requestCount = 0;

const request = async (path, options = {}) => {
  requestCount += 1;
  if (options.headers?.host) {
    return new Promise((resolve, reject) => {
      const req = http.get(new URL(path, origin), { headers: options.headers }, (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(new Response(Buffer.concat(chunks), {
          status: response.statusCode,
          headers: response.headers,
        })));
      });
      req.on('error', reject);
    });
  }
  return fetch(new URL(path, origin), { redirect: 'manual', ...options });
};

const assertRedirect = async (path, target, options = {}) => {
  const response = await request(path, options);
  assert.equal(response.status, 301, path);
  const location = response.headers.get('location');
  assert.ok(location, `${path}: missing Location`);
  const destination = new URL(location, origin);
  const expected = new URL(target, origin);
  assert.equal(destination.pathname, expected.pathname, path);
  assert.equal(destination.search, expected.search, path);
  return destination;
};

for (const [source, target] of Object.entries(LEGACY_REDIRECTS)) {
  await assertRedirect(source, target);
  await assertRedirect(`${source}/`, target);
  await assertRedirect(source, target, { method: 'HEAD' });
  await assertRedirect(`${source}/`, target, { method: 'HEAD' });
  await assertRedirect(source.toUpperCase(), target);
  await assertRedirect(`${source}?utm_source=test&gclid=123`, target);
  await assertRedirect(`${source}?variant=blue`, `${target}?variant=blue`);
  const combined = await assertRedirect(
    `${source.toUpperCase()}/?utm_campaign=test&fbclid=123&variant=blue`,
    `${target}?variant=blue`,
    { headers: { host: 'www.toptenuae.com' } },
  );
  assert.equal(combined.hostname, 'toptenuae.com', `${source}: www was not removed`);
}

for (const target of new Set(Object.values(LEGACY_REDIRECTS))) {
  const response = await request(target);
  assert.equal(response.status, 200, `${target}: canonical destination`);
  assert.equal(response.headers.get('location'), null, `${target}: canonical redirected`);
}

for (const path of KNOWN_GONE_PATHS) {
  for (const variant of [path, `${path}/`, path.toUpperCase(), `${path}/?utm_source=test`]) {
    const response = await request(variant);
    assert.equal(response.status, 410, `${variant}: known-gone status`);
    assert.equal(response.headers.get('location'), null, `${variant}: known-gone redirected`);
  }
}

for (const path of [
  '/reviews/unknown-missing-review',
  '/top-ten/unknown-missing-list',
  '/unknown-missing-page',
]) {
  const response = await request(path);
  assert.equal(response.status, 404, `${path}: unknown status`);
  assert.equal(response.headers.get('location'), null, `${path}: unknown redirected`);
}

for (const path of ['/category/old-category/', '/author/removed-author/', '/tag/old-tag/', '/feed/']) {
  const response = await request(path);
  assert.equal(response.status, 410, `${path}: retired namespace status`);
  assert.equal(response.headers.get('location'), null, `${path}: retired namespace redirected`);
}

const samsungPath = '/smartphones/samsung-galaxy-s26-ultra-specs-uae-price';
const samsungResponse = await request(samsungPath);
assert.equal(samsungResponse.status, 200, 'Samsung canonical status');
const samsungHtml = await samsungResponse.text();
assert.match(
  samsungHtml,
  /<link rel="canonical" href="https:\/\/toptenuae\.com\/smartphones\/samsung-galaxy-s26-ultra-specs-uae-price"/,
  'Samsung self-canonical',
);
assert.doesNotMatch(samsungHtml, /href="\/favicon\.ico"/, 'broken favicon declaration');

const samsungLegacyResponse = await request('/how-to-guides/samsung-galaxy-s26-ultra-specs-uae-price');
assert.equal(samsungLegacyResponse.status, 301, 'Samsung legacy status');
assert.equal(
  new URL(samsungLegacyResponse.headers.get('location'), origin).pathname,
  samsungPath,
  'Samsung legacy redirect target',
);

const robots = await (await request('/robots.txt')).text();
for (const path of [
  '/deals/samsung-galaxy-s25-ultra-deal-jan-2026',
  '/deals/sony-wh-1000xm6-wireless-headphone',
  '/deals/nutricook-extra-large-slim-xl-7l-air-fryer',
  '/deals/kenwood-grill-xl-45l-hfp40-airfryer',
  '/deals/latest',
]) {
  assert.match(robots, new RegExp(`Allow: ${path.replaceAll('/', '\\/')}\\$`), path);
}
assert.match(robots, /Disallow: \/deals\//, 'broad deals block remains');

for (const path of [
  '/how-to-guides/how-to-pay-zakat-in-uae-online',
  '/how-to-guides/charity-organizations-uae-donations',
]) {
  const response = await request(path);
  assert.equal(response.status, 200, `${path}: internal-link source`);
  const html = await response.text();
  assert.doesNotMatch(html, /href="\/finance-tools\/zakat-calculator\/"/, path);
  assert.doesNotMatch(html, /href="\/how-to-guides\/how-to-pay-zakat-in-uae-online\/"/, path);
}

const sitemapResponse = await request('/sitemap.xml');
assert.equal(sitemapResponse.status, 200, 'sitemap status');
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.ok(sitemapUrls.length > 0, 'sitemap contains URLs');
assert.ok(sitemapUrls.includes(`https://toptenuae.com${samsungPath}`), 'Samsung sitemap inclusion');
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'duplicate sitemap URLs');

const sitemapFailures = [];
const queue = [...sitemapUrls];
const workers = Array.from({ length: 8 }, async () => {
  while (queue.length) {
    const absoluteUrl = queue.shift();
    const expected = new URL(absoluteUrl);
    try {
      const response = await request(`${expected.pathname}${expected.search}`);
      const html = await response.text();
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || null;
      const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
      if (response.status !== 200 || response.headers.has('location') || canonical !== absoluteUrl || noindex) {
        sitemapFailures.push({ absoluteUrl, status: response.status, canonical, noindex });
      }
    } catch (error) {
      sitemapFailures.push({ absoluteUrl, error: String(error) });
    }
  }
});
await Promise.all(workers);
assert.deepEqual(sitemapFailures, [], 'sitemap URL integrity');

console.log(JSON.stringify({
  requests: requestCount,
  redirectPairs: Object.keys(LEGACY_REDIRECTS).length,
  redirectVariantsPerPair: 8,
  uniqueCanonicalTargets: new Set(Object.values(LEGACY_REDIRECTS)).size,
  knownGonePaths: KNOWN_GONE_PATHS.size,
  sitemapUrls: sitemapUrls.length,
  sitemapFailures: sitemapFailures.length,
}, null, 2));
