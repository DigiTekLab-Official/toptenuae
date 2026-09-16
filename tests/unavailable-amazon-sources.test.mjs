import assert from 'node:assert/strict'
import test from 'node:test'
import {buildCleanupPlan, HP_CONTROL, TARGETS} from '../scripts/update-laptop-affiliate-phase5a-unavailable-links.mjs'

const targetDocument = target => ({
  _id: target.id,
  _rev: `rev-${target.asin}`,
  title: target.slug,
  slug: {current: target.slug},
  asin: target.asin,
  affiliateLink: null,
  availabilityStatus: 'unavailable',
  sources: Array.from({length: target.sourceIndex + 1}, (_, index) => index === target.sourceIndex
    ? {title: 'Amazon evidence', url: target.url}
    : {title: 'Manufacturer', url: 'https://example.com/source'}),
})

const hpControl = {
  _id: HP_CONTROL.id,
  _rev: 'rev-hp',
  title: 'HP 14',
  slug: {current: HP_CONTROL.slug},
  asin: HP_CONTROL.asin,
  affiliateLink: null,
  availabilityStatus: 'unavailable',
  sources: [],
}

test('plans exactly five URL removals without deleting editorial source metadata', () => {
  const plan = buildCleanupPlan([...TARGETS.map(targetDocument), hpControl])
  assert.equal(plan.length, 5)
  assert.deepEqual(plan.map(change => change.id), TARGETS.map(target => target.id))
  assert.ok(plan.every(change => change.field.match(/^sources\[\d+\]\.url$/)))
  assert.ok(plan.every(change => change.before.startsWith('https://www.amazon.ae/dp/')))
  assert.ok(plan.every(change => change.after === null))
})

test('stops if an unavailable target regains an active purchase destination', () => {
  const documents = [...TARGETS.map(targetDocument), hpControl]
  documents[0].affiliateLink = documents[0].sources[TARGETS[0].sourceIndex].url
  assert.throws(() => buildCleanupPlan(documents), /Purchase destination reappeared/)
})

test('stops instead of altering an active product or unexpected Amazon reference', () => {
  const activeDocuments = [...TARGETS.map(targetDocument), hpControl]
  activeDocuments[1].availabilityStatus = 'available'
  assert.throws(() => buildCleanupPlan(activeDocuments), /no longer unavailable/)

  const changedDocuments = [...TARGETS.map(targetDocument), hpControl]
  changedDocuments[2].sources[TARGETS[2].sourceIndex].url = 'https://www.amazon.ae/dp/B000000000'
  assert.throws(() => buildCleanupPlan(changedDocuments), /Amazon source changed/)
})

test('HP 14 remains a zero-link control and draft collisions stop the plan', () => {
  const hpWithLink = {...hpControl, sources: [{title: 'Unexpected', url: 'https://www.amazon.ae/dp/B0FPXJ6G6B'}]}
  assert.throws(() => buildCleanupPlan([...TARGETS.map(targetDocument), hpWithLink]), /HP 14 unexpectedly/)

  const draft = {...targetDocument(TARGETS[0]), _id: `drafts.${TARGETS[0].id}`}
  assert.throws(() => buildCleanupPlan([...TARGETS.map(targetDocument), hpControl, draft]), /Draft collision/)
})

