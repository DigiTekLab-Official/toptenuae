import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createClient } from '@sanity/client';

const args = new Set(process.argv.slice(2));
const publish = args.has('--publish');
const DOCUMENT_ID = 'bmi-calculator-uae';
const categoryId = '1eda81a9-1d25-45a1-8a46-8b1ba318a73c';
const config = { projectId: 'kxdjzy8e', dataset: 'production', apiVersion: '2025-12-01', useCdn: false, perspective: 'raw' };
let keyIndex = 0;
const key = () => `bmi-${++keyIndex}`;
const block = (text, style = 'normal') => ({ _key: key(), _type: 'block', style, markDefs: [], children: [{ _key: key(), _type: 'span', marks: [], text }] });
const faq = (question, answer) => ({ _key: key(), _type: 'faqItem', question, answer });

export const bmiToolDocument = {
  _id: DOCUMENT_ID,
  _type: 'tool',
  title: 'BMI Calculator UAE',
  slug: { _type: 'slug', current: DOCUMENT_ID },
  categories: [{ _key: 'finance-tools', _type: 'reference', _ref: categoryId }],
  componentId: 'bmi-uae',
  overview: 'Calculate adult BMI using weight in kilograms and height in centimetres.',
  heroBadge: 'WHO BMI Classification',
  heroTitleSuffix: 'Adult Body Mass Index',
  intro: 'Enter your weight in kilograms and height in centimetres to calculate your BMI and see the WHO adult classification band. A simple screening estimate, not a medical diagnosis.',
  content: [
    block('How BMI Is Calculated', 'h2'),
    block('Body mass index compares weight with height. Divide weight in kilograms by height in metres squared: BMI = weight (kg) / [height (m) × height (m)]. This calculator converts centimetres to metres for you.'),
    block('Example Calculation', 'h3'),
    block('For a weight of 70 kg and a height of 175 cm, BMI = 70 / (1.75 × 1.75) = 22.857..., displayed as 22.9 in the Normal band.'),
    block('How to Use the BMI Calculator', 'h2'),
    block('Enter your weight in kilograms, then your height in centimetres without shoes. Select Calculate BMI to see the value and classification. Recalculate after changing either measurement.'),
    block('WHO Adult BMI Bands', 'h2'),
    block('Underweight: below 18.5. Normal: 18.5 to below 25. Overweight: 25 to below 30. Obese: 30 or above. These are the general adult classification bands; the calculator uses the unrounded value to select the band.'),
    block('Understanding the Result', 'h2'),
    block('This calculator is for adults aged 18 and over and is not intended for pregnancy. Children and teenagers need age- and sex-specific growth assessment. BMI does not distinguish muscle from body fat or describe fat distribution. A healthcare professional can interpret it alongside your medical history and other measurements.'),
    {
      _key: key(), _type: 'block', style: 'normal',
      markDefs: [{ _key: 'who-source', _type: 'link', href: 'https://www.who.int/data/nutrition/nlis/info/malnutrition-in-women', blank: true }],
      children: [{ _key: key(), _type: 'span', marks: ['who-source'], text: 'Source: WHO explanation of BMI and adult classification bands.' }],
    },
  ],
  faqs: [
    faq('What units should I use?', 'Enter weight in kilograms and height in centimetres. For example, 1.75 metres should be entered as 175 cm.'),
    faq('Which BMI classifications does this calculator show?', 'It shows Underweight below 18.5, Normal from 18.5 to below 25, Overweight from 25 to below 30, and Obese at 30 or above. Classification uses the unrounded BMI.'),
    faq('Can children or pregnant people use these bands?', 'This tool is for adults aged 18 and over, excluding pregnancy. Children and teenagers require age- and sex-specific assessment; pregnancy also needs a different clinical interpretation.'),
    faq('Does BMI diagnose my health or body fat percentage?', 'No. BMI is a screening measure based on height and weight. It cannot distinguish muscle from fat and should be interpreted alongside other health information.'),
  ],
  seo: {
    metaTitle: 'BMI Calculator UAE: Weight, Height & Adult BMI Bands',
    metaDescription: 'Calculate your adult BMI with weight in kg and height in cm. See WHO classification bands and learn how to interpret this simple screening estimate.',
    keywords: ['BMI calculator UAE', 'adult BMI calculator', 'body mass index', 'BMI kg cm'],
  },
};

if (!publish) {
  console.log(JSON.stringify({ mode: 'plan', project: config.projectId, dataset: config.dataset, document: bmiToolDocument }, null, 2));
  process.exit(0);
}

// Sanity initializes getCliClient's user-token provider only inside `sanity exec`.
const studioDir = resolve(import.meta.dirname, '../../../00-Shared-Core/universal-studio');
if (args.has('--cli-auth') && process.env.BMI_CLI_AUTH_DELEGATED !== '1') {
  const result = spawnSync(resolve(studioDir, 'node_modules/.bin/sanity'),
    ['exec', import.meta.filename, '--with-user-token', '--', '--publish', '--cli-auth'],
    { cwd: studioDir, stdio: 'inherit', env: { ...process.env, BMI_CLI_AUTH_DELEGATED: '1' } });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

let client;
if (args.has('--cli-auth')) {
  const { getCliClient } = await import(pathToFileURL(resolve(studioDir, 'node_modules/sanity/lib/cli.js')).href);
  client = getCliClient(config);
  assert.ok(client.config().token, 'Sanity CLI did not supply an authenticated user token');
} else {
  const token = process.env.TOPTEN_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
  assert.ok(token, 'Supply a write token or --cli-auth to publish');
  client = createClient({ ...config, token });
}

const conflicts = await client.fetch('*[slug.current == $slug || _id in [$id, $draftId]]{_id}',
  { slug: DOCUMENT_ID, id: DOCUMENT_ID, draftId: `drafts.${DOCUMENT_ID}` });
assert.equal(conflicts.length, 0, 'BMI tool already exists; refusing to overwrite');
const category = await client.fetch('*[_id == $id][0]{_type,"slug":slug.current}', { id: categoryId });
assert.equal(category?._type, 'category');
assert.equal(category?.slug, 'finance-tools');
await client.create(bmiToolDocument, { visibility: 'sync' });
const verified = await client.withConfig({ perspective: 'published' }).fetch('*[_id == $id][0]{_id,title,"slug":slug.current,componentId,"category":categories[0]->slug.current}', { id: DOCUMENT_ID });
assert.equal(verified?.componentId, 'bmi-uae');
assert.equal(verified?.category, 'finance-tools');
console.log(JSON.stringify({ mode: 'published', document: verified }, null, 2));
