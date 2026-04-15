export const ENV = {
  Default: 'default',
  Demo: 'demo',
  Development: 'development',
  Preproduction: 'preproduction',
  Production: 'production',
  Test: 'test',
} as const;

export type EnvName = (typeof ENV)[keyof typeof ENV];

export interface FirebaseConfig {
  apiKey: string;
  appId: string;
  authDomain: string;
  measurementId?: string;
  messagingSenderId: string;
  projectId: string;
  storageBucket: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export interface Environment {
  adminSecret: string;
  apiUrl: string;
  cloudinary: CloudinaryConfig;
  enableDebug: boolean;
  env: EnvName;
  firebase: FirebaseConfig;
  production: boolean;
  stripePublicKey: string;
  userDev: string | null;
}
