export const MEDIA_TYPE = {
  Image: 'image',
  Video: 'video',
} as const;

export type MediaType = (typeof MEDIA_TYPE)[keyof typeof MEDIA_TYPE];
