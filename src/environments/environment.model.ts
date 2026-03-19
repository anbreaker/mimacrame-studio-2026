export const ENV = {
  Default: 'default',
  Development: 'development',
  Demo: 'demo',
  Production: 'production',
  Test: 'test',
  Preproduction: 'preproduction',
} as const;

export type EnvName = (typeof ENV)[keyof typeof ENV];

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface Environment {
  production: boolean;
  apiUrl: string;
  env: EnvName;
  enableDebug: boolean;
  userDev: string | null;
  firebase: FirebaseConfig;
  stripePublicKey: string;
}
