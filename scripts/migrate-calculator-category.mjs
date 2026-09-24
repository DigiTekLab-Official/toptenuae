import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const category = {
  _id: 'topten-category-calculators',
  _type: 'category',
  title: 'Health & Everyday Calculators UAE',
  menuLabel: 'Health & Everyday',
  slug: { _type: 'slug', current: 'calculators' },
  metaTitle: 'Health & Everyday Calculators UAE: BMI & Age',
  description: 'Free health and everyday calculators for the UAE. Calculate adult BMI from weight and height, or find your age in years, months and days.',
};
const ids = ['bmi-calculator-uae', 'age-calculator-uae'];
const categories = [{ _key: 'calculators', _type: 'reference', _ref: category._id }];
if (!process.argv.includes('--apply')) {
  console.log(JSON.stringify({ mode: 'plan', category, reassign: ids, categories }, null, 2));
  process.exit(0);
}

const studio = resolve(import.meta.dirname, '../../../00-Shared-Core/universal-studio');
if (process.env.CALCULATOR_MIGRATION_CLI !== '1') {
  const child = spawnSync(resolve(studio, 'node_modules/.bin/sanity'),
    ['exec', import.meta.filename, '--with-user-token', '--', '--apply'],
    { cwd: studio, stdio: 'inherit', env: { ...process.env, UNIVERSAL_SANITY_WORKSPACE: 'toptenuae', CALCULATOR_MIGRATION_CLI: '1' } });
  if (child.error) throw child.error;
  process.exit(child.status ?? 1);
}
const { getCliClient } = await import(pathToFileURL(resolve(studio, 'node_modules/sanity/lib/cli.js')).href);
const client = getCliClient({ projectId: 'kxdjzy8e', dataset: 'production', apiVersion: '2021-06-07', useCdn: false, perspective: 'raw' });
assert.ok(client.config().token, 'Authenticated CLI session required');
const before = await client.fetch('*[_type == "tool"]{_id,_rev,categories,"slug":slug.current}');
assert.equal(before.length, 6, 'Review unexpected tool/draft changes before applying');
const collisions = await client.fetch('*[_id in [$id,$draft] || slug.current == "calculators"]{_id}', { id: category._id, draft: `drafts.${category._id}` });
assert.equal(collisions.length, 0, 'Category already exists; refusing to overwrite');
let tx = client.transaction().create(category);
for (const id of ids) {
  const doc = before.find(d => d._id === id);
  assert.ok(doc);
  assert.equal(doc.slug, id);
  assert.equal(doc.categories.length, 1);
  assert.equal(doc.categories[0]._ref, '1eda81a9-1d25-45a1-8a46-8b1ba318a73c');
  tx = tx.patch(id, p => p.ifRevisionId(doc._rev).set({ categories }));
}
await tx.commit({ visibility: 'sync' });
const after = await client.fetch('*[_type == "tool"]{_id,_rev,categories,"category":categories[0]->slug.current}');
for (const doc of before.filter(d => !ids.includes(d._id))) {
  assert.equal(after.find(d => d._id === doc._id)?._rev, doc._rev, 'Unmoved tool changed');
}
for (const id of ids) assert.equal(after.find(d => d._id === id)?.category, 'calculators');
console.log(JSON.stringify({ mode: 'applied', category, tools: after }, null, 2));
