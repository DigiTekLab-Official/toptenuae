/**
 * Environment Variable Validation
 * Ensures all required environment variables are set before runtime
 * 
 * This file should be imported early in the application lifecycle
 * to fail fast if critical env vars are missing
 */

// Define which environment variables are required for different contexts
const REQUIRED_ENV = {
  ALWAYS: [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
    'NEXT_PUBLIC_BASE_URL',
  ],
  SERVER_ONLY: [
    'JWT_SECRET',
    'RESEND_API_KEY',
    'TURNSTILE_SECRET_KEY',
  ],
  OPTIONAL_BUT_IMPORTANT: [
    'AMAZON_ACCESS_KEY',
    'AMAZON_SECRET_KEY',
    'AMAZON_PARTNER_TAG',
    'SANITY_WRITE_TOKEN',
    'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
    'NEXT_PUBLIC_GTM_ID',
    'NEXT_PUBLIC_CLARITY_ID',
  ],
} as const;

/**
 * Validate environment variables
 * @param context - 'build' or 'runtime'
 * @throws Error if required variables are missing
 */
export function validateEnv(context: 'build' | 'runtime' = 'runtime'): void {
  const requiredVars =
    context === 'build'
      ? REQUIRED_ENV.ALWAYS
      : [...REQUIRED_ENV.ALWAYS, ...REQUIRED_ENV.SERVER_ONLY];

  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const errorMessage = `
╔════════════════════════════════════════════════════════════════╗
║           MISSING REQUIRED ENVIRONMENT VARIABLES               ║
╚════════════════════════════════════════════════════════════════╝

The following environment variables are REQUIRED but not set:

${missing.map((key) => `  ❌ ${key}`).join('\n')}

📝 HOW TO FIX:
1. Copy .env.example to .env.local (if it exists)
2. Add the missing variables to your .env.local file
3. Restart your development server

📚 DOCUMENTATION:
  - Sanity Setup: https://sanity.io/manage
  - Resend API: https://resend.com/api-keys
  - Turnstile: https://dash.cloudflare.com/
  - JWT_SECRET: Generate with: openssl rand -hex 32

⚠️  Context: ${context}
🕐 Time: ${new Date().toISOString()}
    `;

    console.error(errorMessage);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Warn about optional but important vars
  const missingOptional = REQUIRED_ENV.OPTIONAL_BUT_IMPORTANT.filter(
    (key) => !process.env[key]
  );

  if (missingOptional.length > 0 && context === 'runtime') {
    console.warn(
      `⚠️  Optional environment variables not set: ${missingOptional.join(', ')}\n` +
        `Some features may not work correctly.`
    );
  }
}

/**
 * Safely get environment variable with validation
 * @param key - Environment variable key
 * @param defaultValue - Optional default value
 * @returns Environment variable value or default
 * @throws Error if variable is missing and no default provided
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;

  if (!value) {
    throw new Error(
      `Environment variable "${key}" is required but not set. ` +
        `Please add it to your .env.local file.`
    );
  }

  return value;
}

/**
 * Safely get optional environment variable
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set
 * @returns Environment variable value or default
 */
export function getEnvOptional(key: string, defaultValue = ''): string {
  return process.env[key] ?? defaultValue;
}
