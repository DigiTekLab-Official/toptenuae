import { createClient } from '@sanity/client';

const PROJECT_ID = 'kxdjzy8e';
const DATASET = 'production';
const API_VERSION = '2026-09-18';

const IPHONE_PATH = '/smartphones/iphone-18-pro-vs-iphone-17-pro-uae';
const SCHOOL_RULES_PATH = '/how-to-guides/uae-school-hair-makeup-grooming-rules';
const SCHOOLS_PATH = '/top-ten/top-10-schools-dubai-2026-khda-fees-reviews';

const documents = {
  samsung: '012e0a9d-adf7-4b29-b19a-eb06a63534df',
  schools: '42f18920-c3b4-46eb-9245-f2a1afe77e6a',
  schoolRules: 'a055384f-50ae-49dc-878e-36bb5be9a538',
};

const linkBlock = ({ blockKey, markKey, before, anchor, after, href }) => ({
  _key: blockKey,
  _type: 'block',
  style: 'normal',
  markDefs: [{ _key: markKey, _type: 'link', href }],
  children: [
    { _key: `${blockKey}a`, _type: 'span', marks: [], text: before },
    { _key: `${blockKey}b`, _type: 'span', marks: [markKey], text: anchor },
    { _key: `${blockKey}c`, _type: 'span', marks: [], text: after },
  ],
});

const additions = {
  samsung: {
    afterKey: 'c5bb1a84e512',
    href: IPHONE_PATH,
    block: linkBlock({
      blockKey: 'internal-iphone-comparison-20260918',
      markKey: 'internal-iphone-comparison-link',
      before: 'Comparing Apple and Samsung before choosing a platform? Read our ',
      anchor: 'iPhone 18 Pro vs iPhone 17 Pro comparison',
      after: ' for the UAE price, camera, performance and battery differences between Apple’s latest Pro generations.',
      href: IPHONE_PATH,
    }),
  },
  schools: {
    afterKey: '7661712fe64c',
    href: SCHOOL_RULES_PATH,
    block: linkBlock({
      blockKey: 'internal-school-rules-20260918',
      markKey: 'internal-school-rules-link',
      before: 'Once you have shortlisted a school, check its current handbook and appearance policy. Our ',
      anchor: 'UAE school hair, makeup and grooming rules guide',
      after: ' explains the official public-school guidance and what parents should confirm directly with private schools.',
      href: SCHOOL_RULES_PATH,
    }),
  },
};

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  perspective: 'published',
});

const hasHref = (body, href) => body.some((item) =>
  Array.isArray(item.markDefs) && item.markDefs.some((mark) => mark?.href === href),
);

const insertAfter = (body, afterKey, item) => {
  const index = body.findIndex((block) => block?._key === afterKey);
  if (index === -1) throw new Error(`Insertion block ${afterKey} was not found`);
  return [...body.slice(0, index + 1), item, ...body.slice(index + 1)];
};

const fetched = await client.fetch(
  `*[_id in $ids]{_id, _rev, title, "slug": slug.current, body}`,
  { ids: Object.values(documents) },
);

const byId = new Map(fetched.map((document) => [document._id, document]));
for (const [name, id] of Object.entries(documents)) {
  if (!byId.has(id)) throw new Error(`Required ${name} document ${id} was not found`);
}

const updates = [];
for (const name of ['samsung', 'schools']) {
  const source = byId.get(documents[name]);
  const addition = additions[name];
  const body = Array.isArray(source.body) ? source.body : [];
  if (!hasHref(body, addition.href)) {
    updates.push({
      id: source._id,
      rev: source._rev,
      title: source.title,
      change: `add ${addition.href}`,
      body: insertAfter(body, addition.afterKey, addition.block),
    });
  }
}

const schoolRules = byId.get(documents.schoolRules);
const schoolRulesBody = structuredClone(Array.isArray(schoolRules.body) ? schoolRules.body : []);
let normalizedSchoolLink = false;
for (const item of schoolRulesBody) {
  for (const mark of item.markDefs || []) {
    if (mark?.href?.startsWith(`https://toptenuae.com${SCHOOLS_PATH}?`)) {
      mark.href = SCHOOLS_PATH;
      normalizedSchoolLink = true;
    }
  }
}
if (normalizedSchoolLink) {
  updates.push({
    id: schoolRules._id,
    rev: schoolRules._rev,
    title: schoolRules.title,
    change: `normalize existing internal URL to ${SCHOOLS_PATH}`,
    body: schoolRulesBody,
  });
}

console.log(JSON.stringify({ mode: process.argv.includes('--publish') ? 'publish' : 'dry-run', updates: updates.map(({ id, title, change }) => ({ id, title, change })) }, null, 2));

if (!process.argv.includes('--publish')) process.exit(0);
if (!process.env.SANITY_WRITE_TOKEN) throw new Error('SANITY_WRITE_TOKEN is required to publish');
if (updates.length === 0) {
  console.log('No changes required; all requested links are already present.');
  process.exit(0);
}

let transaction = client.transaction();
for (const update of updates) {
  transaction = transaction.patch(update.id, (patch) =>
    patch.ifRevisionId(update.rev).set({ body: update.body }),
  );
}

const result = await transaction.commit({ visibility: 'sync' });
console.log(JSON.stringify({ transactionId: result.transactionId, documentIds: result.documentIds }, null, 2));
