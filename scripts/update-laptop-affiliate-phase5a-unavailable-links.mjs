import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {homedir} from 'node:os'
import {dirname, resolve} from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
try { process.loadEnvFile(resolve(ROOT, '.env.local')) } catch {}

const PROJECT_ID = 'kxdjzy8e'
const DATASET = 'production'
const API_VERSION = '2026-09-16'

export const TARGETS = [
  {
    id: 'topten-ai-laptop-asus-proart-p16-h7606wp-rtx-5070',
    asin: 'B0GPRL4RDG',
    slug: 'asus-proart-p16-h7606wp-rtx-5070',
    sourceIndex: 2,
    url: 'https://www.amazon.ae/dp/B0GPRL4RDG?tag=apfunbox06-21',
  },
  {
    id: 'topten-ai-laptop-lenovo-yoga-slim-7x-14q8x9',
    asin: 'B0DQRH3LQL',
    slug: 'lenovo-yoga-slim-7x-14q8x9',
    sourceIndex: 2,
    url: 'https://www.amazon.ae/dp/B0DQRH3LQL?tag=apfunbox06-21',
  },
  {
    id: '2ef66e3f-3820-4770-8971-90bb8bcf0557',
    asin: 'B0DLHK2MMY',
    slug: 'apple-macbook-air-m2-2022',
    sourceIndex: 1,
    url: 'https://www.amazon.ae/dp/B0DLHK2MMY',
  },
  {
    id: '83cb095b-5235-4ff2-aa9d-268d63450073',
    asin: 'B0DZDXCFJQ',
    slug: 'apple-macbook-air-m4-13-inch',
    sourceIndex: 1,
    url: 'https://www.amazon.ae/dp/B0DZDVTDGM',
  },
  {
    id: '9abe1b9c-c15d-43c4-8eee-9834e3ccfc8d',
    asin: 'B0FWXM6R9N',
    slug: 'acer-nitro-v-16-ai-laptop',
    sourceIndex: 1,
    url: 'https://www.amazon.ae/dp/B0FWXM6R9N',
  },
]

export const HP_CONTROL = {
  id: 'a3a32bba-809a-46d5-a2a4-c5116dc838eb',
  asin: 'B0FPXJ6G6B',
  slug: 'hp-14-n150-16gb-student',
}

const isAmazonUrl = value => {
  if (typeof value !== 'string') return false
  try {
    const host = new URL(value).hostname.toLowerCase()
    return host === 'amazon.ae' || host.endsWith('.amazon.ae') || host === 'amzn.to' || host.endsWith('.amzn.to')
  } catch {
    return false
  }
}

export const buildCleanupPlan = documents => {
  const byId = new Map(documents.map(document => [document._id, document]))
  const drafts = documents.filter(document => document._id.startsWith('drafts.'))
  if (drafts.length) throw new Error(`Draft collision: ${drafts.map(document => document._id).join(', ')}`)

  const hp = byId.get(HP_CONTROL.id)
  if (!hp) throw new Error('HP 14 control document is missing')
  if (hp.availabilityStatus !== 'unavailable' || hp.affiliateLink) throw new Error('HP 14 control is not safely unavailable')
  if ((hp.sources || []).some(source => isAmazonUrl(source?.url))) throw new Error('HP 14 unexpectedly contains an Amazon source URL')

  return TARGETS.map(target => {
    const document = byId.get(target.id)
    if (!document) throw new Error(`Missing target document: ${target.id}`)
    if (document.asin !== target.asin) throw new Error(`ASIN changed for ${target.id}`)
    if (document.slug?.current !== target.slug) throw new Error(`Slug changed for ${target.id}`)
    if (document.availabilityStatus !== 'unavailable') throw new Error(`Target is no longer unavailable: ${target.id}`)
    if (document.affiliateLink) throw new Error(`Purchase destination reappeared for ${target.id}`)

    const amazonSources = (document.sources || [])
      .map((source, index) => ({index, url: source?.url}))
      .filter(source => isAmazonUrl(source.url))
    if (amazonSources.length !== 1) throw new Error(`Expected one Amazon source URL for ${target.id}; found ${amazonSources.length}`)
    const [source] = amazonSources
    if (source.index !== target.sourceIndex || source.url !== target.url) throw new Error(`Amazon source changed for ${target.id}`)

    return {
      id: document._id,
      rev: document._rev,
      title: document.title,
      slug: document.slug.current,
      asin: document.asin,
      field: `sources[${target.sourceIndex}].url`,
      before: source.url,
      after: null,
    }
  })
}

const getWriteToken = () => {
  const environmentToken = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN
  if (environmentToken) return environmentToken
  try {
    const config = JSON.parse(readFileSync(resolve(homedir(), '.config/sanity/config.json'), 'utf8'))
    return config.authToken || ''
  } catch {
    return ''
  }
}

const fetchDocuments = client => {
  const ids = [...TARGETS.map(target => target.id), HP_CONTROL.id]
  return client.fetch(
    '*[_id in $ids || _id in $draftIds]{_id,_rev,title,slug,asin,affiliateLink,availabilityStatus,sources}',
    {ids, draftIds: ids.map(id => `drafts.${id}`)},
  )
}

const run = async () => {
  const write = process.argv.includes('--write')
  const validate = process.argv.includes('--validate')
  const token = write ? getWriteToken() : undefined
  if (write && !token) throw new Error('No authenticated Sanity write credential is available')

  const client = createClient({projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, useCdn: false, perspective: 'raw', token})
  const documents = await fetchDocuments(client)

  if (validate) {
    const byId = new Map(documents.map(document => [document._id, document]))
    for (const target of TARGETS) {
      const document = byId.get(target.id)
      if (!document || document.availabilityStatus !== 'unavailable' || document.affiliateLink) throw new Error(`Unavailable guard failed for ${target.id}`)
      if ((document.sources || []).some(source => isAmazonUrl(source?.url))) throw new Error(`Residual Amazon source remains for ${target.id}`)
    }
    const hp = byId.get(HP_CONTROL.id)
    if (!hp || (hp.sources || []).some(source => isAmazonUrl(source?.url))) throw new Error('HP 14 control validation failed')
    console.log(JSON.stringify({status: 'PASS', documents: TARGETS.length, residualAmazonSources: 0}, null, 2))
    return
  }

  const plan = buildCleanupPlan(documents)
  if (!write) {
    console.log(JSON.stringify({status: 'PLAN', projectId: PROJECT_ID, dataset: DATASET, documents: plan.length, changes: plan}, null, 2))
    return
  }

  let transaction = client.transaction()
  for (const change of plan) {
    transaction = transaction.patch(change.id, patch => patch.ifRevisionId(change.rev).unset([change.field]))
  }
  const result = await transaction.commit({returnDocuments: false, visibility: 'sync'})
  console.log(JSON.stringify({status: 'COMMITTED', transactionId: result.transactionId, documents: plan.length}, null, 2))
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch(error => {
    console.error(error.message)
    process.exit(1)
  })
}

