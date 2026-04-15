export type MaterialCategory = 'stone' | 'thread' | 'color';

export interface Material {
  available: boolean;
  category: MaterialCategory;
  id: string;
  imageUrl: string;
  name: string;
}

export type MaterialCreate = Omit<Material, 'id'>;
