/**
 * Minimal environment validation run by ConfigModule at startup.
 * Fails fast with a clear message if required variables are missing.
 */
export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const required: string[] = ['DATABASE_URL'];

  const missing = required.filter((key) => !config[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}.\n` +
        'Copy .env.example to .env and fill in the values.',
    );
  }

  return config;
}
