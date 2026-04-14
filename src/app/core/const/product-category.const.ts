export const PRODUCT_CATEGORY = {
  Bracelets: 'bracelets',
  Earrings: 'earrings',
  Necklaces: 'necklaces',
  Pendants: 'pendants',
  Rings: 'rings',
  Sets: 'sets',
} as const;

export type ProductCategory = (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY];
