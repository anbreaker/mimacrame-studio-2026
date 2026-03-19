import { ENV, Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  apiUrl: import.meta.env['NG_APP_API_URL'] ?? 'http://localhost:3000',
  env: ENV.Development,
  enableDebug: true,
  userDev: import.meta.env['NG_APP_USER_DEV'] ?? null,
  firebase: {
    apiKey: import.meta.env['NG_APP_FIREBASE_API_KEY'],
    authDomain: import.meta.env['NG_APP_FIREBASE_AUTH_DOMAIN'],
    projectId: import.meta.env['NG_APP_FIREBASE_PROJECT_ID'],
    storageBucket: import.meta.env['NG_APP_FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: import.meta.env['NG_APP_FIREBASE_MESSAGING_SENDER_ID'],
    appId: import.meta.env['NG_APP_FIREBASE_APP_ID'],
    measurementId: import.meta.env['NG_APP_ANALYTICS_MEASUREMENT_ID'],
  },
  stripePublicKey: import.meta.env['NG_APP_STRIPE_PUBLIC_KEY'] ?? 'pk_test_YOUR_STRIPE_PUBLIC_KEY',
};
