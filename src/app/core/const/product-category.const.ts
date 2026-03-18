export const PRODUCT_CATEGORY = {
  Bracelets: 'bracelets',
  Pendants: 'pendants',
  Earrings: 'earrings',
  Rings: 'rings',
  Anklets: 'anklets',
  Sets: 'sets',
} as const;

export type ProductCategory = (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY];
