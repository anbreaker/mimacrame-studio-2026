import { Lang } from '@core/const/lang.const';

export interface ContactMessage {
  createdAt: Date;
  email: string;
  id: string;
  lang: Lang;
  message: string;
  name: string;
  sentByUid?: string;
  subject: string;
}

export type ContactMessageCreate = Omit<ContactMessage, 'id' | 'createdAt'>;

export interface ContactRequest {
  email: string;
  honeypot: string;
  lang: Lang;
  message: string;
  name: string;
  sentByUid?: string;
  subject: string;
}

export interface ContactResponse {
  success: boolean;
}
