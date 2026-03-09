// src/sanity/env.ts

export const apiVersion =
  import.meta.env.PUBLIC_SANITY_API_VERSION || '2025-12-01'

export const dataset =
  import.meta.env.PUBLIC_SANITY_DATASET || 'production'

export const projectId =
  import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'kxdjzy8e'

export const useCdn = true