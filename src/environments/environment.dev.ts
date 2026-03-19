import { ENV, Environment } from './environment.model';

export const environment: Environment = {
  apiUrl: import.meta.env['NG_APP_API_URL'] ?? 'http://localhost:3000',
  enableDebug: true,
  env: ENV.Development,
  firebase: {
    apiKey: import.meta.env['NG_APP_FIREBASE_API_KEY'],
    appId: import.meta.env['NG_APP_FIREBASE_APP_ID'],
    authDomain: import.meta.env['NG_APP_FIREBASE_AUTH_DOMAIN'],
    measurementId: import.meta.env['NG_APP_ANALYTICS_MEASUREMENT_ID'],
    messagingSenderId: import.meta.env['NG_APP_FIREBASE_MESSAGING_SENDER_ID'],
    projectId: import.meta.env['NG_APP_FIREBASE_PROJECT_ID'],
    storageBucket: import.meta.env['NG_APP_FIREBASE_STORAGE_BUCKET'],
  },
  production: false,
  stripePublicKey: import.meta.env['NG_APP_STRIPE_PUBLIC_KEY'] ?? 'pk_test_YOUR_STRIPE_PUBLIC_KEY',
  userDev: import.meta.env['NG_APP_USER_DEV'] ?? null,
};
