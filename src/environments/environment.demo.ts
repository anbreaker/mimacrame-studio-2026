import { ENV, Environment } from './environment.model';

export const environment: Environment = {
  apiUrl: import.meta.env['NG_APP_API_URL'] ?? 'https://demo-api.example.com',
  cloudinary: { cloudName: '', uploadPreset: '' },
  enableDebug: false,
  env: ENV.Demo,
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    appId: 'YOUR_APP_ID',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
  },
  production: false,
  stripePublicKey: 'pk_test_YOUR_STRIPE_PUBLIC_KEY',
  userDev: null,
};
