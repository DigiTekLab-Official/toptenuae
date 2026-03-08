/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'groq' {
  export default function groq(strings: TemplateStringsArray, ...keys: any[]): string;
}

interface ImportMetaEnv {
  // Public (client + server)
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly PUBLIC_SANITY_API_VERSION: string;
  readonly PUBLIC_BASE_URL: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
  readonly PUBLIC_GTM_ID: string;
  readonly PUBLIC_CLARITY_ID: string;
  readonly PUBLIC_GA_MEASUREMENT_ID: string;
  readonly PUBLIC_SENTRY_DSN: string;

  // Server-only secrets
  readonly JWT_SECRET: string;
  readonly RESEND_API_KEY: string;
  readonly TURNSTILE_SECRET_KEY: string;
  readonly SANITY_WRITE_TOKEN: string;
  readonly SANITY_WEBHOOK_SECRET: string;
  readonly AMAZON_ACCESS_KEY: string;
  readonly AMAZON_SECRET_KEY: string;
  readonly AMAZON_PARTNER_TAG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Cloudflare runtime types
type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

interface Env {
  // Add any Cloudflare bindings here (KV, D1, R2, etc.)
}

declare namespace App {
  interface Locals extends Runtime {}
}
