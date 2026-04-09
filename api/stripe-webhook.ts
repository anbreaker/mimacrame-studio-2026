import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { Resend } from 'resend';
import Stripe from 'stripe';

import {
  buildAdminEmailHtml,
  buildCustomerEmailHtml,
  buildOrderRef,
  getTranslations,
  type OrderData,
} from './email-templates.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const COLLECTIONS = { Orders: 'orders' } as const;
const HTTP_METHOD_POST = 'POST';
const ORDER_STATUS_PAID = 'paid';
const PAYMENT_INTENT_SUCCEEDED = 'payment_intent.succeeded';
const STRIPE_SIGNATURE_HEADER = 'stripe-signature';

const getStripe = (): Stripe =>
  new Stripe(process.env['STRIPE_SECRET_KEY'] ?? '', { apiVersion: '2025-02-24.acacia' });

const getResend = (): Resend => new Resend(process.env['RESEND_API_KEY'] ?? '');

function initFirebase(): void {
  if (getApps().length) return;
  const serviceAccount = JSON.parse(process.env['FIREBASE_SERVICE_ACCOUNT'] ?? '{}');
  initializeApp({ credential: cert(serviceAccount) });
}

async function getRawBody(httpRequest: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    httpRequest.on('data', (chunk: Buffer) => chunks.push(chunk));
    httpRequest.on('end', () => resolve(Buffer.concat(chunks)));
    httpRequest.on('error', reject);
  });
}

export default async function handler(
  httpRequest: VercelRequest,
  httpResponse: VercelResponse
): Promise<void> {
  if (httpRequest.method !== HTTP_METHOD_POST) {
    httpResponse.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET'] ?? '';
  const sig = httpRequest.headers[STRIPE_SIGNATURE_HEADER] as string;
  const rawBody = await getRawBody(httpRequest);

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    httpResponse.status(400).send(`Webhook Error: ${message}`);
    return;
  }

  if (event.type === PAYMENT_INTENT_SUCCEEDED) {
    initFirebase();
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await handlePaymentSucceeded(paymentIntent);
  }

  httpResponse.json({ received: true });
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const firestoreDb = getFirestore();

  const snapshot = await firestoreDb
    .collection(COLLECTIONS.Orders)
    .where('stripePaymentIntentId', '==', paymentIntent.id)
    .limit(1)
    .get();

  if (snapshot.empty) {
    console.error(`No order found for paymentIntentId: ${paymentIntent.id}`);
    return;
  }

  const orderDoc = snapshot.docs[0];
  const orderId = orderDoc.id;
  const order = orderDoc.data();

  await orderDoc.ref.update({
    status: ORDER_STATUS_PAID,
    updatedAt: FieldValue.serverTimestamp(),
  });

  const orderRef = buildOrderRef(orderId);
  const orderData: OrderData = {
    customerEmail: order['customerEmail'] as string | undefined,
    items: order['items'],
    lang: order['lang'] as string | undefined,
    shippingAddress: order['shippingAddress'],
    total: order['total'] as number | undefined,
  };

  await Promise.allSettled([
    sendCustomerEmail(orderData, orderId, orderRef),
    sendAdminEmail(orderData, orderId, orderRef),
  ]);
}

async function sendCustomerEmail(
  order: OrderData,
  orderId: string,
  orderRef: string
): Promise<void> {
  if (!order.customerEmail) {
    console.error(`Missing customerEmail for order ${orderId} — skipping customer email`);
    return;
  }

  const fromEmail = process.env['RESEND_FROM_EMAIL'] ?? 'noreply@mimacrame.com';

  const t = getTranslations(order.lang);

  await getResend().emails.send({
    from: `Mimacramé Studio <${fromEmail}>`,
    html: buildCustomerEmailHtml(order, orderRef),
    subject: t.customerSubject(orderRef),
    to: order.customerEmail,
  });
}

async function sendAdminEmail(order: OrderData, orderId: string, orderRef: string): Promise<void> {
  const adminEmail = process.env['ADMIN_EMAIL'];

  if (!adminEmail) {
    console.warn(`ADMIN_EMAIL not configured — skipping admin notification for order ${orderId}`);
    return;
  }

  const fromEmail = process.env['RESEND_FROM_EMAIL'] ?? 'noreply@mimacrame.com';

  const t = getTranslations(order.lang);

  await getResend().emails.send({
    from: `Mimacramé Studio <${fromEmail}>`,
    html: buildAdminEmailHtml(order, orderRef),
    subject: t.adminSubject(orderRef),
    to: adminEmail,
  });
}
