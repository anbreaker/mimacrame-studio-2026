/**
 * Maps Firebase Auth error messages to Transloco translation keys.
 * Used by AuthStore and components to display multi-language errors.
 */
const AUTH_ERROR_KEY_DEFAULT = 'authErrors.default';

const AUTH_ERROR_KEY_MAP: Record<string, string> = {
  'invalid-credential': 'authErrors.invalidCredential',
  'too-many-requests': 'authErrors.tooManyRequests',
  'user-not-found': 'authErrors.userNotFound',
  'wrong-password': 'authErrors.wrongPassword',
};

export function toReadableError(message: string): string {
  const matchedEntry = Object.entries(AUTH_ERROR_KEY_MAP).find(([errorCode]) =>
    message.includes(errorCode)
  );

  return matchedEntry?.[1] ?? AUTH_ERROR_KEY_DEFAULT;
}
