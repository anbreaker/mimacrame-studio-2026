import type { VercelRequest, VercelResponse } from '@vercel/node';

import { buildAdminEmailHtml, buildCustomerEmailHtml, type OrderData } from './email-templates.js';

const SAMPLE_ORDER: OrderData = {
  customerEmail: 'cliente@ejemplo.com',
  items: [
    {
      product: {
        images: [
          'https://res.cloudinary.com/dwtqnscxw/image/upload/w_120,h_120,c_fill/v1/mimacrame-uploads/sample',
        ],
        name: { en: 'Large Boho Macramé', es: 'Macramé Boho Grande' },
        price: 45,
      },
      quantity: 1,
    },
    {
      product: {
        images: [
          'https://res.cloudinary.com/dwtqnscxw/image/upload/w_120,h_120,c_fill/v1/mimacrame-uploads/sample',
        ],
        name: { en: 'Wall Hanger', es: 'Colgante de pared' },
        price: 28,
      },
      quantity: 2,
    },
  ],
  shippingAddress: {
    city: 'Badajoz',
    country: 'España',
    fullName: 'María García López',
    phone: '+34 600 123 456',
    postalCode: '06001',
    province: 'Extremadura',
    street: 'Calle Mayor 42, 3º B',
  },
  total: 101,
};

const SAMPLE_ORDER_REF = '#MIM-ABC123';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (process.env['NODE_ENV'] === 'production') {
    res.status(404).end();
    return;
  }

  const type = req.query['type'];
  const html =
    type === 'admin'
      ? buildAdminEmailHtml(SAMPLE_ORDER, SAMPLE_ORDER_REF)
      : buildCustomerEmailHtml(SAMPLE_ORDER, SAMPLE_ORDER_REF);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
