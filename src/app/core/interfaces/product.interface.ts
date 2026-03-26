import { ProductCategory } from '@core/const/product-category.const';

export interface LocalizedString {
  en: string;
  es: string;
  pt: string;
}

export interface Product {
  active: boolean;
  category: ProductCategory;
  createdAt: Date;
  description: LocalizedString;
  estimatedDays: number;
  id: string;
  images: string[];
  name: LocalizedString;
  price: number;
  updatedAt: Date;
}

export type ProductCreate = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export type ProductUpdate = Partial<ProductCreate>;
