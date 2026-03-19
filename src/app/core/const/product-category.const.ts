export const PRODUCT_CATEGORY = {
  Anklets: 'anklets',
  Bracelets: 'bracelets',
  Earrings: 'earrings',
  Pendants: 'pendants',
  Rings: 'rings',
  Sets: 'sets',
} as const;

export type ProductCategory = (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY];
