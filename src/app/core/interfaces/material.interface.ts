import { LocalizedString } from '@core/interfaces/product.interface';

export const MATERIAL_CATEGORY = {
  Color: 'color',
  Stone: 'stone',
  Thread: 'thread',
} as const;

export type MaterialCategory = (typeof MATERIAL_CATEGORY)[keyof typeof MATERIAL_CATEGORY];

export interface Material {
  available: boolean;
  category: MaterialCategory;
  description?: LocalizedString;
  id: string;
  imageUrl: string;
  name: LocalizedString;
}

export type MaterialCreate = Omit<Material, 'id'>;
