import { LocalizedString } from './product.interface';

export type CuratedPostSection = 'home' | 'catalog';

export interface CuratedPost {
  active: boolean;
  caption: LocalizedString;
  createdAt: Date;
  id: string;
  imageUrl: string;
  instagramUrl: string;
  order: number;
  section: CuratedPostSection;
  title: LocalizedString;
  updatedAt: Date;
  videoUrl?: string;
}

export type CuratedPostCreate = Omit<CuratedPost, 'id' | 'createdAt' | 'updatedAt'>;

export type CuratedPostUpdate = Partial<CuratedPostCreate>;
