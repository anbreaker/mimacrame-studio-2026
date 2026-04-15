export const MATERIAL_CATEGORY = {
  Color: 'color',
  Stone: 'stone',
  Thread: 'thread',
} as const;

export type MaterialCategory = (typeof MATERIAL_CATEGORY)[keyof typeof MATERIAL_CATEGORY];

export interface Material {
  available: boolean;
  category: MaterialCategory;
  id: string;
  imageUrl: string;
  name: string;
}

export type MaterialCreate = Omit<Material, 'id'>;
