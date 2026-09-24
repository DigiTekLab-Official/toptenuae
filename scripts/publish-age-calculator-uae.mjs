import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createClient } from '@sanity/client';

const args = new Set(process.argv.slice(2));
const publish = args.has('--publish');
const DOCUMENT_ID = 'age-calculator-uae';
const categoryId = '1eda81a9-1d25-45a1-8a46-8b1ba318a73c';
const config = { projectId: 'kxdjzy8e', dataset: 'production', apiVersion: '2025-12-01', useCdn: false, perspective: 'raw' };
let keyIndex = 0;
const key = () => `age-${++keyIndex}`;
const block = (text, style = 'normal') => ({ _key: key(), _type: 'block', style, markDefs: [], children: [{ _key: key(), _type: 'span', marks: [], text }] });
const faq = (question, answer) => ({ _key: key(), _type: 'faqItem', question, answer });

export const ageToolDocument = {
  _id: DOCUMENT_ID,
  _type: 'tool',
  title: 'Age Calculator UAE',
  slug: { _type: 'slug', current: DOCUMENT_ID },
  categories: [{ _key: 'finance-tools', _type: 'reference', _ref: categoryId }],
  componentId: 'age-uae',
  overview: 'Calculate your age today in years, months and days from your date of birth.',
  heroBadge: 'Calendar Age Calculator',
  heroTitleSuffix: 'Years, Months & Days',
  intro: 'Enter your date of birth to calculate your age in complete years, months and days, using today’s date in the UAE.',
  content: [
    block('How Age Is Calculated', 'h2'),
    block('The calculator counts complete calendar years from your date of birth, then complete months and the remaining days. It uses the current server date in the UAE timezone, shown beside the input and result, rather than dividing elapsed days by 365.'),
    block('How to Use the Age Calculator', 'h2'),
    block('Choose your date of birth with the date picker and select Calculate Age. A date in the future is rejected. The displayed date is set when you load the page; reload it if you keep the page open into a new day.'),
    block('Leap Years and Month Ends', 'h2'),
    block('When an anniversary falls on a day that does not exist in that month, the calculator uses the last day of that month. A February 29 birthday reaches its annual anniversary on February 28 in non-leap years and on February 29 in leap years. A January 31 monthly anniversary falls on February 28 or 29.'),
    block('Example', 'h3'),
    block('Someone born on 15 May 1990 is 36 years, 4 months and 9 days old on 24 September 2026. This is an example only; the calculator always uses the current UAE date shown on the page.'),
    block('About This Estimate', 'h2'),
    block('This tool provides calendar age for everyday use. Official eligibility and legal deadlines may apply their own birthday or leap-day rules; check the rules of the organisation concerned. Your date of birth is processed in your browser and is not submitted by this calculator.'),
  ],
  faqs: [
    faq('Which date does the calculator use for today?', 'It uses the server’s current date in the Asia/Dubai timezone when the page is loaded. That date is displayed beside the input and result. Reload the page to update it after midnight.'),
    faq('How are February 29 birthdays handled?', 'The calculator uses February 28 as the anniversary in non-leap years, and February 29 in leap years. This is the calendar convention used by this tool.'),
    faq('Can I enter a future date of birth?', 'No. Future dates show an inline error instead of a result.'),
    faq('Can I calculate age on a different target date?', 'This version calculates age today only. It does not include a target-date comparison mode.'),
  ],
  seo: {
    metaTitle: 'Age Calculator UAE: Age in Years, Months & Days',
    metaDescription: 'Calculate your age today in years, months and days. Enter your date of birth for a calendar age based on the current UAE date, with leap-year handling.',
    keywords: ['age calculator UAE', 'age in years months days', 'date of birth calculator'],
  },
};

if (!publish) {
  console.log(JSON.stringify({ mode: 'plan', project: config.projectId, dataset: config.dataset, document: ageToolDocument }, null, 2));
  process.exit(0);
}

// Sanity initializes getCliClient's user-token provider only inside `sanity exec`.
const studioDir = resolve(import.meta.dirname, '../../../00-Shared-Core/universal-studio');
if (args.has('--cli-auth') && process.env.AGE_CLI_AUTH_DELEGATED !== '1') {
  const result = spawnSync(resolve(studioDir, 'node_modules/.bin/sanity'),
    ['exec', import.meta.filename, '--with-user-token', '--', '--publish', '--cli-auth'],
    { cwd: studioDir, stdio: 'inherit', env: { ...process.env, AGE_CLI_AUTH_DELEGATED: '1' } });
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
assert.equal(conflicts.length, 0, 'AGE tool already exists; refusing to overwrite');
const category = await client.fetch('*[_id == $id][0]{_type,"slug":slug.current}', { id: categoryId });
assert.equal(category?._type, 'category');
assert.equal(category?.slug, 'finance-tools');
await client.create(ageToolDocument, { visibility: 'sync' });
const verified = await client.withConfig({ perspective: 'published' }).fetch('*[_id == $id][0]{_id,title,"slug":slug.current,componentId,"category":categories[0]->slug.current}', { id: DOCUMENT_ID });
assert.equal(verified?.componentId, 'age-uae');
assert.equal(verified?.category, 'finance-tools');
console.log(JSON.stringify({ mode: 'published', document: verified }, null, 2));
