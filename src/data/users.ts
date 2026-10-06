export const AUTH_STATE_PATH = 'playwright/.auth/user.json';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}. Copy .env.example to .env.`);
  }
  return value;
}

// Credentials are read lazily so this module can be imported before dotenv runs.
export const USERS = {
  get standard() {
    return requireEnv('SAUCE_USERNAME');
  },
  get lockedOut() {
    return requireEnv('SAUCE_LOCKED_OUT_USERNAME');
  },
};

export function password(): string {
  return requireEnv('SAUCE_PASSWORD');
}
