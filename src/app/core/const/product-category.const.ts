export const PRODUCT_CATEGORY = {
  Bracelets: 'bracelets',
  Choker: 'choker',
  Earrings: 'earrings',
  Necklaces: 'necklaces',
  Rings: 'rings',
} as const;

export type ProductCategory = (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY];
