// src/lib/monitoring.ts — lightweight console-based logging (Sentry removed)

const isDev = import.meta.env.DEV;

export function captureException(error: Error | unknown, context?: Record<string, string>) {
  if (isDev) {
    console.error('[ERROR]', error, context);
  } else {
    console.error(JSON.stringify({
      level: 'error',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...context,
      ts: new Date().toISOString(),
    }));
  }
}

export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
) {
  const fn = level === 'error' || level === 'fatal' ? console.error
    : level === 'warning' ? console.warn
    : console.log;
  fn(`[${level.toUpperCase()}] ${message}`);
}

export function addBreadcrumb(message: string, _data?: Record<string, unknown>) {
  if (isDev) console.debug('[BREADCRUMB]', message, _data);
}
