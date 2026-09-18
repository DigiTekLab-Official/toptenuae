import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  LEGACY_REDIRECTS,
  canonicalizeAuditedInternalLink,
  isKnownGonePath,
} from '../src/lib/seo/legacy-redirects.ts';

test('implements every audited pair and retains validated SSR migrations', async () => {
  const csv = await readFile(
    new URL('../SEO-AUDIT/GSC-PROPOSED-EXPLICIT-REDIRECTS-2026-09-13.csv', import.meta.url),
    'utf8',
  );
  const auditedPairs = csv.trim().split('\n').slice(1).map((line) => line.split(',').slice(0, 2));

  assert.equal(Object.keys(LEGACY_REDIRECTS).length, 97);
  assert.equal(auditedPairs.length, 95);
  for (const [source, target] of auditedPairs) {
    assert.equal(LEGACY_REDIRECTS[source], target, source);
  }
  assert.equal(LEGACY_REDIRECTS['/best-baby-monitor'], '/top-ten/best-baby-monitors-uae');
  assert.equal(
    LEGACY_REDIRECTS['/nutricook-air-fryer-slim-xl-review'],
    '/reviews/nutricook-air-fryer-slim-xl',
  );
  assert.equal(
    LEGACY_REDIRECTS['/how-to-guides/samsung-galaxy-s26-ultra-specs-uae-price'],
    '/smartphones/samsung-galaxy-s26-ultra-specs-uae-price',
  );
  assert.equal(
    LEGACY_REDIRECTS['/smartphones/samsung-galaxy-s26-ultra-specs-uae-price'],
    undefined,
  );
});

test('redirect destinations are terminal and cannot form chains or loops', () => {
  for (const [source, target] of Object.entries(LEGACY_REDIRECTS)) {
    assert.notEqual(source, target, source);
    assert.equal(LEGACY_REDIRECTS[target], undefined, `${source} chains through ${target}`);
  }
});

test('known deleted paths and retired WordPress namespaces are terminal', () => {
  assert.equal(isKnownGonePath('/best-diaper-bags-uae'), true);
  assert.equal(isKnownGonePath('/best-baby-toys'), true);
  assert.equal(isKnownGonePath('/nasa-astronaut-don-pettit-burj-khalifa-image-from-space'), true);
  assert.equal(isKnownGonePath('/category/old-category'), true);
  assert.equal(isKnownGonePath('/reviews/unknown-missing-review'), false);
});

test('cleans only the three audited Sanity-authored internal links', () => {
  assert.equal(
    canonicalizeAuditedInternalLink('/finance-tools/zakat-calculator/'),
    '/finance-tools/zakat-calculator',
  );
  assert.equal(
    canonicalizeAuditedInternalLink('/how-to-guides/how-to-pay-zakat-in-uae-online/?source=article#pay'),
    '/how-to-guides/how-to-pay-zakat-in-uae-online?source=article#pay',
  );
  assert.equal(canonicalizeAuditedInternalLink('/unrelated/path/'), '/unrelated/path/');
});
