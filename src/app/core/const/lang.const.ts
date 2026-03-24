export const LANG = {
  En: 'en',
  Es: 'es',
  Pt: 'pt',
} as const;

export type Lang = (typeof LANG)[keyof typeof LANG];

export const AVAILABLE_LANGS: Lang[] = [LANG.Es, LANG.En, LANG.Pt];

export const DEFAULT_LANG = LANG.En;
