# Phase 6 — Schema Enablement (2026-05-30)

Status: **Item 1 implemented & verified. Items 2 & 3 = no-op / record-correction.**

This phase began from an accepted "schema-enablement audit" that approved three
additive changes. Before editing, the schema claims were re-verified against the
**actual files on disk** (raw `grep -n` + `shasum`) and against **live Sanity data**.
Two of the three premises were factually wrong. This document is the corrected record.

---

## Ground truth (verified 2026-05-30)

| Audit claim | Disk / data reality | Evidence |
|---|---|---|
| `topTenList.mainImage` absent — "highest-value gap" | **EXISTS**, optional, `image` + `hotspot` + `alt` | `topten/topTenList.ts:102-116`; deployed `schema.json:3182` |
| `topTenList.author` "to add" | **EXISTS**, optional | `topten/topTenList.ts:46-52`; deployed `schema.json:3089` |
| `product.author` "to add" | **ABSENT** — the only genuine gap | `grep author product.ts` → no match; deployed `product` type spans `schema.json:4654-5337` with no author key |
| null OG on top-ten = missing field | **No data basis**; field exists & is wired end-to-end | query fetch `topten.queries.ts:20`; OG fallback `seo-manager.ts:188-191` |

File integrity at verification time:
- `topten/topTenList.ts` — sha `96a59bba4f36defa9ae9df6cb161567b801ed8ad`, mtime **Feb 2 10:01**
  (unchanged — the `mainImage`/`author` fields predate the audit; the file was never the gap).
- `topten/product.ts` — sha (pre-edit) `93b431744306d31d1216ec2f08b68408b6b7ca63`, mtime Feb 8.

Live Sanity (projectId `kxdjzy8e`, dataset `production`, apiVersion `2025-12-01`):
- `topTenList`: total **11**, missing `mainImage` **0**, missing `author` **0** → 100% populated.
- `product`: total **80**, missing `mainImage.asset` **0**.

---

## Decisions

### Item 1 — Add optional `author` to `product` — **DONE**
The one real gap. Added an optional `author` reference mirroring `topTenList.author`:

```ts
defineField({
  name: 'author',
  title: 'Author',
  type: 'reference',
  to: [{ type: 'author' }],
  group: 'core',          // product has no 'content' byline group ('content' = Detailed Review)
}),
```
File: `universal-studio/schemaTypes/topten/product.ts` (inserted after the `mainImage` block).

- **Optional** — no `validation`, no `initialValue`. Verified via `sanity schema extract`
  (`--workspace toptenuae`): `product.author` → `author.reference`, `"optional": true`.
- **No migration** — re-count post-edit: 80 products, 0 with `author` set; all load unchanged.
- **Groundwork only** — does nothing for search until (a) JSON-LD author wiring (deferred,
  §T3.0-gated) AND (b) the field is actually filled. Not a near-term indexing lever; the
  §T3.0 verdict stands — internal linking, not schema, is the lever.
- `sanity build` clean (26.8s).

### Item 2 — Populate missing `mainImage` on top-ten — **NO-OP**
The editorial task does not exist: **0 of 11** topTenList docs are missing `mainImage`
(all have `mainImage.asset`). The "null OG image on top-ten pages" symptom has no data
basis today. `mainImage` is wired end-to-end (`topten.queries.ts:20` → `seo-manager.ts:188-191`),
falling back to `DEFAULT_OG_IMAGE` only when a doc has no image — which is currently none.
If the symptom ever appears, it is data-population on an otherwise-populated set, **not** a
schema gap. Adding a second `mainImage` field would be a duplicate-name error.

### Item 3 — Correct the record — **THIS DOCUMENT**
No prior phase6 doc existed and CLAUDE.md never carried the wrong "mainImage absent" claim,
so nothing on disk needed *correcting* — only this corrected record needed *creating*.

**Root-cause of the bad finding:** the audit's "mainImage absent" conclusion apparently
targeted the wrong artifact (deployed `schema.json`, the Astro frontend, or an old git
revision) rather than `schemaTypes/topten/topTenList.ts` on disk — the file that has had
the field since Feb 2. **Process fix: verify schema absence/presence against the source
file on disk (by sha), not against memory, a summary, or a derived artifact, before
asserting it.**

---

## Out of scope (held)
- Item 2 validation governance (required fields / min-length / min `listItems`) — **not** done
  (future-thin-content guard we don't currently need; risks retro-flagging existing docs).
- JSON-LD author wiring — §T3.0-gated, **not** done.
- `schemaGenerator.ts:284-348` / `TOP_TEN_LIST_QUERY` — untouched (§T3.0 hard constraint).
