import { ENV, Environment } from './environment.model';

export const environment: Environment = {
  apiUrl: 'http://localhost:3000',
  cloudinary: { cloudName: '', uploadPreset: '' },
  enableDebug: false,
  env: ENV.Test,
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
