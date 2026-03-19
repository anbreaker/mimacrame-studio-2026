/**
 * Maps Firebase Auth error messages to i18n keys.
 * Mirrors the logic in AuthStore.toReadableError() for reuse outside the store.
 */
const AUTH_ERROR_DEFAULT_KEY = 'auth.error.generic';

const AUTH_ERROR_MAP: Record<string, string> = {
  'invalid-credential': 'auth.error.invalid_credentials',
  'too-many-requests': 'auth.error.too_many_requests',
  'user-not-found': 'auth.error.user_not_found',
  'wrong-password': 'auth.error.invalid_credentials',
};

export function toReadableError(message: string): string {
  const matchedEntry = Object.entries(AUTH_ERROR_MAP).find(([errorCode]) =>
    message.includes(errorCode)
  );

  return matchedEntry?.[1] ?? AUTH_ERROR_DEFAULT_KEY;
}
