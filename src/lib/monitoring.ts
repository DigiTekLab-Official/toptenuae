import * as Sentry from '@sentry/nextjs';

/**
 * Initialize Sentry for error tracking and performance monitoring
 * Captures errors in Server Components, API routes, and Client Components
 */
export function initializeSentry() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    
    // Performance monitoring: capture 10% of transactions
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Release tracking
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    
    // Disable debug in production
    debug: process.env.NODE_ENV !== 'production',
  });
}

/**
 * Capture custom exceptions and errors
 * Usage: captureException(error, { context: 'route-name' })
 */
export function captureException(error: Error | unknown, context?: Record<string, any>) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.error('Error:', error);
    return;
  }

  Sentry.captureException(error, {
    contexts: {
      custom: context,
    },
  });
}

/**
 * Capture custom messages for debugging
 * Usage: captureMessage('User subscribed', 'info')
 */
export function captureMessage(message: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info') {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log(`[${level.toUpperCase()}] ${message}`);
    return;
  }

  Sentry.captureMessage(message, level);
}

/**
 * Set user context for error tracking
 * Usage: setUserContext({ id: 'user123', email: 'user@example.com' })
 */
export function setUserContext(userInfo: Record<string, string | number>) {
  Sentry.setUser(userInfo);
}

/**
 * Clear user context (e.g., on logout)
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumbs for debugging
 * Usage: addBreadcrumb('User clicked button', { category: 'ui' })
 */
export function addBreadcrumb(message: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    data,
    timestamp: Date.now() / 1000,
  });
}
