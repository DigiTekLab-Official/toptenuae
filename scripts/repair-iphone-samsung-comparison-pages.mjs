import { readFile } from 'node:fs/promises';
import { createClient } from '@sanity/client';

const PROJECT_ID = 'kxdjzy8e';
const DATASET = 'production';
const API_VERSION = '2026-09-25';
const OLD_ID = 'e6e60eb4-8919-4cab-a899-37c002c866c6';
const NEW_ID = 'iphone-18-pro-max-vs-samsung-galaxy-s26-ultra-uae';
const SNAPSHOT_PATH = process.env.COMPARISON_RESTORE_SNAPSHOT || '/tmp/iphone-samsung-existing.json';

const pages = [
  {
    id: '22445f8e-607b-4a37-bebf-d826b5ffcb4b',
    path: '/smartphones/iphone-18-pro-uae-price-specs',
    anchor: 'iPhone 18 Pro UAE price and specifications guide',
  },
  {
    id: 'iphone-18-pro-vs-iphone-17-pro-uae',
    path: '/smartphones/iphone-18-pro-vs-iphone-17-pro-uae',
    anchor: 'iPhone 18 Pro vs iPhone 17 Pro UAE comparison',
  },
  {
    id: 'cb9f71ac-f411-4051-9a19-0e126fc79001',
    path: '/smartphones/samsung-galaxy-s26-ultra-specs-uae-price',
    anchor: 'Samsung Galaxy S26 Ultra UAE price and specifications guide',
  },
  {
    id: OLD_ID,
    path: '/smartphones/iphone-18-pro-vs-samsung-galaxy-s26-ultra-uae',
    anchor: 'iPhone 18 Pro vs Samsung Galaxy S26 Ultra UAE comparison',
  },
  {
    id: NEW_ID,
    path: '/smartphones/iphone-18-pro-max-vs-samsung-galaxy-s26-ultra-uae',
    anchor: 'iPhone 18 Pro Max vs Samsung Galaxy S26 Ultra UAE comparison',
  },
];

const args = new Set(process.argv.slice(2));
const publish = args.has('--publish');
const token = process.env.TOPTEN_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN;
if (publish && !token) throw new Error('TOPTEN_WRITE_TOKEN or SANITY_WRITE_TOKEN is required');

const snapshot = JSON.parse(await readFile(SNAPSHOT_PATH, 'utf8'));
if (snapshot._id !== OLD_ID) throw new Error(`Snapshot ID mismatch: ${snapshot._id}`);
if (snapshot.title !== 'iPhone 18 Pro vs Samsung Galaxy S26 Ultra: UAE Comparison') {
  throw new Error(`Unexpected snapshot title: ${snapshot.title}`);
}
if (snapshot.slug?.current !== 'iphone-18-pro-vs-samsung-galaxy-s26-ultra-uae') {
  throw new Error(`Unexpected snapshot slug: ${snapshot.slug?.current}`);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token,
  perspective: 'published',
});

const records = await client.fetch(
  `*[_id in $ids]{_id,_rev,_type,title,slug,author,categories,publishedAt,updatedAt,lastReviewedAt,intro,methodology,body,faqs,featuredImage,mainImage,seo,schemaType}`,
  { ids: pages.map(({ id }) => id) },
);
const byId = new Map(records.map((record) => [record._id, record]));
for (const { id } of pages.slice(0, 4)) {
  if (!byId.has(id)) throw new Error(`Required document not found: ${id}`);
}

const currentOld = byId.get(OLD_ID);
const existingNew = byId.get(NEW_ID);
const now = new Date().toISOString();

const restoredOld = {
  _id: OLD_ID,
  _type: snapshot._type,
  title: snapshot.title,
  slug: snapshot.slug,
  author: snapshot.author,
  categories: snapshot.categories,
  publishedAt: snapshot.publishedAt,
  updatedAt: snapshot.updatedAt,
  lastReviewedAt: snapshot.lastReviewedAt,
  intro: snapshot.intro,
  methodology: snapshot.methodology,
  body: snapshot.body,
  faqs: snapshot.faqs,
  featuredImage: snapshot.featuredImage,
  seo: snapshot.seo,
};

const newSource = existingNew || currentOld;
const newPage = {
  _id: NEW_ID,
  _type: 'buyerGuide',
  title: 'iPhone 18 Pro Max vs Samsung Galaxy S26 Ultra: UAE Comparison',
  slug: { _type: 'slug', current: 'iphone-18-pro-max-vs-samsung-galaxy-s26-ultra-uae' },
  author: newSource.author,
  categories: newSource.categories,
  publishedAt: existingNew?.publishedAt || now,
  updatedAt: existingNew?.updatedAt || now,
  lastReviewedAt: existingNew?.lastReviewedAt || now,
  intro: newSource.intro,
  methodology: newSource.methodology,
  body: newSource.body,
  faqs: newSource.faqs,
  featuredImage: newSource.featuredImage,
  schemaType: 'Guide',
  seo: newSource.seo,
};
if (newPage.featuredImage) {
  newPage.featuredImage = {
    ...newPage.featuredImage,
    alt: 'iPhone 18 Pro Max and Samsung Galaxy S26 Ultra UAE flagship comparison',
  };
}

const normalizePath = (href = '') => href.replace(/^https:\/\/toptenuae\.com/, '').replace(/\/$/, '');
const linkTargets = (body = []) => new Set(body.flatMap((item) => item.markDefs || [])
  .map((mark) => normalizePath(mark?.href))
  .filter(Boolean));

let keySequence = 0;
const nextKey = (prefix) => `cluster-${prefix}-20260925-${String(++keySequence).padStart(3, '0')}`;
const clusterLinkBlock = (target) => {
  const markKey = nextKey('mark');
  return {
    _key: nextKey('block'),
    _type: 'block',
    style: 'normal',
    markDefs: [{ _key: markKey, _type: 'link', href: target.path }],
    children: [
      { _key: nextKey('span'), _type: 'span', marks: [], text: 'Continue comparing UAE flagship phones in our ' },
      { _key: nextKey('span'), _type: 'span', marks: [markKey], text: target.anchor },
      { _key: nextKey('span'), _type: 'span', marks: [], text: '.' },
    ],
  };
};

const normalizeAnchorText = (body = []) => {
  const next = structuredClone(body);
  const byPath = new Map(pages.map((page) => [page.path, page]));
  for (const item of next) {
    const marks = new Map((item.markDefs || []).map((mark) => [mark._key, byPath.get(normalizePath(mark.href))]));
    for (const child of item.children || []) {
      const target = (child.marks || []).map((mark) => marks.get(mark)).find(Boolean);
      if (target && /iPhone 18 Pro( Max)? vs Samsung Galaxy S26 Ultra/.test(child.text || '')) {
        child.text = target.anchor;
      }
    }
  }
  return next;
};

const addMissingClusterLinks = (document) => {
  const body = normalizeAnchorText(document.body || []);
  const existing = linkTargets(body);
  const missing = pages.filter((target) => target.id !== document._id && !existing.has(target.path));
  if (missing.length === 0) return { body, missing: [] };
  const heading = {
    _key: nextKey('heading'), _type: 'block', style: 'h2', markDefs: [],
    children: [{ _key: nextKey('span'), _type: 'span', marks: [], text: 'Related UAE smartphone guides' }],
  };
  return { body: [...body, heading, ...missing.map(clusterLinkBlock)], missing };
};

const baseDocuments = new Map([
  [OLD_ID, restoredOld],
  [NEW_ID, newPage],
  ...pages.slice(0, 3).map(({ id }) => [id, byId.get(id)]),
]);

const finalDocuments = [];
for (const page of pages) {
  const document = baseDocuments.get(page.id);
  const { body, missing } = addMissingClusterLinks(document);
  finalDocuments.push({ ...document, body, addedPaths: missing.map(({ path }) => path) });
}

console.log(JSON.stringify({
  mode: publish ? 'publish' : 'dry-run',
  restored: {
    id: restoredOld._id,
    title: restoredOld.title,
    slug: restoredOld.slug.current,
    publishedAt: restoredOld.publishedAt,
    bodyBlocksBeforeClusterLinks: restoredOld.body.length,
    faqCount: restoredOld.faqs.length,
  },
  created: {
    id: newPage._id,
    title: newPage.title,
    slug: newPage.slug.current,
    publishedAt: newPage.publishedAt,
    bodyBlocksBeforeClusterLinks: newPage.body.length,
    faqCount: newPage.faqs.length,
  },
  cluster: finalDocuments.map(({ _id, title, addedPaths }) => ({ _id, title, addedPaths })),
}, null, 2));

if (!publish) process.exit(0);

let transaction = client.transaction();
for (const document of finalDocuments) {
  const { addedPaths, ...writeDocument } = document;
  if (document._id === NEW_ID) {
    transaction = transaction.createOrReplace(writeDocument);
  } else if (document._id === OLD_ID) {
    transaction = transaction.createOrReplace(writeDocument);
  } else {
    const current = byId.get(document._id);
    transaction = transaction.patch(document._id, (patch) =>
      patch.ifRevisionId(current._rev).set({ body: document.body }),
    );
  }
}

const result = await transaction.commit({ visibility: 'sync' });
console.log(JSON.stringify({ transactionId: result.transactionId, documentIds: result.documentIds }, null, 2));
