import { ENV, Environment } from './environment.model';

export const environment: Environment = {
  apiUrl: import.meta.env['NG_APP_API_URL'] ?? 'https://preprod-api.example.com',
  enableDebug: false,
  env: ENV.Preproduction,
  firebase: {
    apiKey: import.meta.env['NG_APP_FIREBASE_API_KEY'] ?? 'YOUR_FIREBASE_API_KEY',
    appId: import.meta.env['NG_APP_FIREBASE_APP_ID'] ?? 'YOUR_APP_ID',
    authDomain: import.meta.env['NG_APP_FIREBASE_AUTH_DOMAIN'] ?? 'YOUR_PROJECT.firebaseapp.com',
    measurementId: import.meta.env['NG_APP_ANALYTICS_MEASUREMENT_ID'],
    messagingSenderId:
      import.meta.env['NG_APP_FIREBASE_MESSAGING_SENDER_ID'] ?? 'YOUR_MESSAGING_SENDER_ID',
    projectId: import.meta.env['NG_APP_FIREBASE_PROJECT_ID'] ?? 'YOUR_PROJECT_ID',
    storageBucket: import.meta.env['NG_APP_FIREBASE_STORAGE_BUCKET'] ?? 'YOUR_PROJECT.appspot.com',
  },
  production: false,
  stripePublicKey: import.meta.env['NG_APP_STRIPE_PUBLIC_KEY'] ?? 'pk_test_YOUR_STRIPE_PUBLIC_KEY',
  userDev: null,
};
