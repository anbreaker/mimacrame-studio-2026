import { ProductCategory } from '../const/product-category.const';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  stock: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCreate = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type ProductUpdate = Partial<ProductCreate>;
