import { ProductCategory } from '@core/const/product-category.const';

export interface Product {
  active: boolean;
  category: ProductCategory;
  createdAt: Date;
  description: string;
  estimatedDays: number;
  id: string;
  images: string[];
  name: string;
  price: number;
  updatedAt: Date;
}

export type ProductCreate = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export type ProductUpdate = Partial<ProductCreate>;
