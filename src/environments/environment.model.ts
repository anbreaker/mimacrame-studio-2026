export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface Environment {
  production: boolean;
  apiUrl: string;
  env: 'default' | 'development' | 'demo' | 'production' | 'test' | 'preproduction';
  enableDebug: boolean;
  userDev: string | null;
  firebase: FirebaseConfig;
  stripePublicKey: string;
}
