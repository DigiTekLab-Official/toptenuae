import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve(
  'src/pages/[category]/index.astro'
);

const source = fs.readFileSync(filePath, 'utf8');

test('smartphones category discovers mobile accessories', () => {
  assert.match(source, /smartphones:\s*\{/);
  assert.match(source, /href:\s*['"]\/mobile-accessories['"]/);
  assert.match(
    source,
    /Complete your phone setup with mobile accessories: chargers, cases and power banks\./
  );
});

test('parenting-kids category discovers schools and education', () => {
  assert.match(source, /['"]parenting-kids['"]:\s*\{/);
  assert.match(source, /href:\s*['"]\/schools-education['"]/);
  assert.match(
    source,
    /Explore Schools & Education in the UAE\./
  );
});
