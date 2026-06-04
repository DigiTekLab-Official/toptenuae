// scripts/migrate-holiday-dates.mjs
// One-off migration: convert holiday startDate/endDate from TZ-sensitive datetime
// to floating date-only (YYYY-MM-DD), and backfill publishedAt (null -> _createdAt)
// on the 4 docs that lack it. Values are EXPLICIT and pre-verified (Asia/Dubai
// calendar dates) — no automated timezone math, so nothing can drift.
//
// SAFETY:
//   - DRY RUN by default: prints before -> after and writes a backup, but does NOT write.
//   - Pass --commit to actually patch.
//   - A backup of the current values is ALWAYS written to scripts/ before any --commit.
//   - Pass --rollback=<backup-file> to restore the exact previous values.
//
// Token is read from the environment (never hard-coded). Use Node's --env-file so
// your token stays in a local .env that is git-ignored and never pasted anywhere.

import { createClient } from '@sanity/client';
import { writeFileSync, readFileSync } from 'node:fs';

// TOPTENUAE-namespaced token from universal-studio/.env (multi-project convention).
const TOKEN = process.env.TOPTEN_WRITE_TOKEN;
if (!TOKEN) {
  console.error('ERROR: TOPTEN_WRITE_TOKEN is not set.');
  console.error('Run with: node --env-file=/Users/ameer/Developer/00-Shared-Core/universal-studio/.env scripts/migrate-holiday-dates.mjs');
  process.exit(1);
}

const PROJECT_ID = 'kxdjzy8e'; // TOPTENUAE — NOT GovtJobs/TechBuy
const DATASET = 'production';

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-12-01',
  token: TOKEN,
  useCdn: false, // always read live, never cached
});

// Safety banner: target is pinned in code (not derived from the token), so even a
// multi-project .env can only ever write to this project/dataset here.
console.log(`TARGET project=${PROJECT_ID} (TOPTENUAE) dataset=${DATASET}\n`);

// Pre-verified target values (see migration plan / before->after table).
// Hijri publishedAt is already set (2026-06-04T02:41Z) so it is intentionally omitted.
const PATCHES = {
  'uae-hijri-new-year-holiday-2026':            { startDate: '2026-06-15', endDate: '2026-06-15' },
  'ramadan-2026-uae':                           { startDate: '2026-02-19', endDate: '2026-03-19', publishedAt: '2026-01-04T02:00:28Z' },
  'eid-holidays-uae-2026-best-places-to-visit': { startDate: '2026-03-19', endDate: '2026-03-23', publishedAt: '2025-12-26T05:30:50Z' },
  'eid-al-fitr-uae-prayer-timings-free-events': { startDate: '2026-03-20', endDate: '2026-03-22', publishedAt: '2025-12-26T04:00:28Z' },
  'uae-holidays-2026':                          { startDate: '2025-12-31', endDate: '2026-12-31', publishedAt: '2025-12-24T01:00:38Z' },
};

const FIELDS = ['startDate', 'endDate', 'publishedAt'];
const args = process.argv.slice(2);
const COMMIT = args.includes('--commit');
const rollbackArg = args.find((a) => a.startsWith('--rollback='));

async function fetchCurrent() {
  const slugs = Object.keys(PATCHES);
  return client.fetch(
    `*[_type=="holiday" && slug.current in $slugs]{ _id, "slug": slug.current, startDate, endDate, publishedAt, _createdAt }`,
    { slugs }
  );
}

// ---- ROLLBACK MODE ---------------------------------------------------------
if (rollbackArg) {
  const file = rollbackArg.split('=')[1];
  const backup = JSON.parse(readFileSync(file, 'utf8'));
  console.log(`ROLLBACK from ${file} (${backup.length} docs)\n`);
  for (const doc of backup) {
    const tx = client.patch(doc._id);
    const set = {};
    const unset = [];
    for (const f of FIELDS) {
      if (doc[f] === null || doc[f] === undefined) unset.push(f);
      else set[f] = doc[f];
    }
    if (Object.keys(set).length) tx.set(set);
    if (unset.length) tx.unset(unset);
    if (COMMIT) {
      await tx.commit();
      console.log('restored', doc.slug, JSON.stringify(set), unset.length ? `unset:${unset}` : '');
    } else {
      console.log('[dry-run] would restore', doc.slug, JSON.stringify(set), unset.length ? `unset:${unset}` : '');
    }
  }
  console.log(COMMIT ? '\nRollback committed.' : '\nDRY RUN — add --commit to write.');
  process.exit(0);
}

// ---- MIGRATION MODE --------------------------------------------------------
const current = await fetchCurrent();
const byslug = Object.fromEntries(current.map((d) => [d.slug, d]));

// Always write a backup of current values before any write.
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = `scripts/holiday-backup-${stamp}.json`;
writeFileSync(backupFile, JSON.stringify(current, null, 2));
console.log(`Backup written: ${backupFile}\n`);

console.log('before -> after:\n');
for (const [slug, fields] of Object.entries(PATCHES)) {
  const cur = byslug[slug];
  if (!cur) { console.error(`!! NOT FOUND in dataset: ${slug}`); continue; }
  for (const f of FIELDS) {
    const before = cur[f] ?? 'null';
    const after = fields[f] !== undefined ? fields[f] : `${before} (unchanged)`;
    console.log(`  ${slug}.${f}: ${before}  ->  ${after}`);
  }
  console.log('');
}

if (!COMMIT) {
  console.log('DRY RUN — no writes. Review the table above, then re-run with --commit.');
  process.exit(0);
}

for (const [slug, fields] of Object.entries(PATCHES)) {
  const cur = byslug[slug];
  if (!cur) continue;
  await client.patch(cur._id).set(fields).commit();
  console.log('patched', slug, JSON.stringify(fields));
}

console.log('\nVerifying...');
const after = await fetchCurrent();
for (const d of after) {
  console.log(`  ${d.slug}: start=${d.startDate} end=${d.endDate} publishedAt=${d.publishedAt}`);
}
console.log('\nDone.');
