import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // ✅ Switch back to the environment variable for security
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // ⚠️ Set to false unless you specifically need to track user IDs/IPs
  sendDefaultPii: false,
});