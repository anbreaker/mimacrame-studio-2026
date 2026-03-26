export const SORT_FIELD = {
  Active: 'active',
  Category: 'category',
  Name: 'name',
  Price: 'price',
} as const;

export type SortField = (typeof SORT_FIELD)[keyof typeof SORT_FIELD];

export const SORT_DIR = {
  Asc: 'asc',
  Desc: 'desc',
} as const;

export type SortDir = (typeof SORT_DIR)[keyof typeof SORT_DIR];
