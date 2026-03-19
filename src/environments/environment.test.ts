import { ENV, Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  env: ENV.Test,
  enableDebug: false,
  userDev: null,
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
  stripePublicKey: 'pk_test_YOUR_STRIPE_PUBLIC_KEY',
};
