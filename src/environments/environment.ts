import { ENV, Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  apiUrl: import.meta.env['NG_APP_API_URL'] ?? 'http://localhost:3000',
  env: ENV.Development,
  enableDebug: true,
  userDev: import.meta.env['NG_APP_USER_DEV'] ?? null,
  firebase: {
    apiKey: import.meta.env['NG_APP_FIREBASE_API_KEY'] ?? 'YOUR_FIREBASE_API_KEY',
    authDomain: import.meta.env['NG_APP_FIREBASE_AUTH_DOMAIN'] ?? 'YOUR_PROJECT.firebaseapp.com',
    projectId: import.meta.env['NG_APP_FIREBASE_PROJECT_ID'] ?? 'YOUR_PROJECT_ID',
    storageBucket: import.meta.env['NG_APP_FIREBASE_STORAGE_BUCKET'] ?? 'YOUR_PROJECT.appspot.com',
    messagingSenderId:
      import.meta.env['NG_APP_FIREBASE_MESSAGING_SENDER_ID'] ?? 'YOUR_MESSAGING_SENDER_ID',
    appId: import.meta.env['NG_APP_FIREBASE_APP_ID'] ?? 'YOUR_APP_ID',
    measurementId: import.meta.env['NG_APP_ANALYTICS_MEASUREMENT_ID'],
  },
  stripePublicKey: 'pk_test_YOUR_STRIPE_PUBLIC_KEY',
};
