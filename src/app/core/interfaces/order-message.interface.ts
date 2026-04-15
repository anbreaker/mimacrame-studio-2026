export interface OrderMessage {
  content: string;
  createdAt: Date;
  from: 'artisan';
  id: string;
  read: boolean;
}

export type OrderMessageCreate = Omit<OrderMessage, 'id' | 'createdAt'>;
