import { createClient } from 'next-sanity'

const projectId = process.env.SANITY_PROJECT_ID || 'kxdjzy8e'
const dataset = process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2025-11-08'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
