import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const ALLOWED_ORIGIN = process.env['ALLOWED_ORIGIN'] ?? '*';
const CORS_ALLOWED_HEADERS = 'Content-Type, Authorization';
const CORS_ALLOWED_METHODS = 'POST, OPTIONS';
const CORS_HEADER_ALLOW_HEADERS = 'Access-Control-Allow-Headers';
const CORS_HEADER_ALLOW_METHODS = 'Access-Control-Allow-Methods';
const CORS_HEADER_ALLOW_ORIGIN = 'Access-Control-Allow-Origin';
const DEFAULT_CURRENCY = 'eur';
const HTTP_METHOD_OPTIONS = 'OPTIONS';
const HTTP_METHOD_POST = 'POST';

const getStripe = (): Stripe =>
  new Stripe(process.env['STRIPE_SECRET_KEY'] ?? '', { apiVersion: '2025-02-24.acacia' });

export default async function handler(
  httpRequest: VercelRequest,
  httpResponse: VercelResponse
): Promise<void> {
  httpResponse.setHeader(CORS_HEADER_ALLOW_ORIGIN, ALLOWED_ORIGIN);
  httpResponse.setHeader(CORS_HEADER_ALLOW_METHODS, CORS_ALLOWED_METHODS);
  httpResponse.setHeader(CORS_HEADER_ALLOW_HEADERS, CORS_ALLOWED_HEADERS);

  if (httpRequest.method === HTTP_METHOD_OPTIONS) {
    httpResponse.status(200).end();
    return;
  }

  if (httpRequest.method !== HTTP_METHOD_POST) {
    httpResponse.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { amount, currency = DEFAULT_CURRENCY, receiptEmail, userId } = httpRequest.body as {
    amount: number;
    currency?: string;
    receiptEmail?: string;
    userId?: string;
  };

  if (!amount || amount <= 0) {
    httpResponse.status(400).json({ error: 'Amount must be a positive number' });
    return;
  }

  const paymentIntent = await getStripe().paymentIntents.create({
    amount,
    currency,
    metadata: {
      ...(userId && { userId }),
    },
    ...(receiptEmail && { receipt_email: receiptEmail }),
  });

  httpResponse.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
}
