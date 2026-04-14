export const PRODUCT_CATEGORY = {
  Anklets: 'anklets',
  Bracelets: 'bracelets',
  Choker: 'choker',
  Miscellaneous: 'miscellaneous',
  Necklaces: 'necklaces',
} as const;

export type ProductCategory = (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY];
