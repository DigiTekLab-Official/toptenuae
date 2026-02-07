import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // High sample rate for development; lower this to 0.1 for production to save quota
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Useful for seeing setup logs in your browser console
  debug: false, 
});