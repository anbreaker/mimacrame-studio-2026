export type CuratedPostSection = 'home' | 'catalog';

export interface CuratedPost {
  active: boolean;
  caption: string;
  createdAt: Date;
  id: string;
  imageUrl: string;
  instagramUrl: string;
  order: number;
  section: CuratedPostSection;
  title: string;
  updatedAt: Date;
}

export type CuratedPostCreate = Omit<CuratedPost, 'id' | 'createdAt' | 'updatedAt'>;

export type CuratedPostUpdate = Partial<CuratedPostCreate>;
