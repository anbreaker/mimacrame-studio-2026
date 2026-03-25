import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as admin from 'firebase-admin';
import { Resend } from 'resend';
import Stripe from 'stripe';

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
  if (admin.apps.length) return;
  const serviceAccount = JSON.parse(
    process.env['FIREBASE_SERVICE_ACCOUNT'] ?? '{}'
  ) as admin.ServiceAccount;
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
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
  const db = admin.firestore();

  const snapshot = await db
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
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const orderRef = buildOrderRef(orderId);

  await Promise.allSettled([
    sendCustomerEmail(order, orderId, orderRef),
    sendAdminEmail(order, orderId, orderRef),
  ]);
}

async function sendCustomerEmail(
  order: admin.firestore.DocumentData,
  orderId: string,
  orderRef: string
): Promise<void> {
  const customerEmail = order['customerEmail'] as string | undefined;

  if (!customerEmail) {
    console.error(`Missing customerEmail for order ${orderId} — skipping customer email`);
    return;
  }

  const fromEmail = process.env['RESEND_FROM_EMAIL'] ?? 'noreply@mimacrame.com';

  await getResend().emails.send({
    from: `Mimacramé Studio <${fromEmail}>`,
    html: buildCustomerEmailHtml(order, orderRef),
    subject: `Tu pedido está confirmado — ${orderRef}`,
    to: customerEmail,
  });
}

async function sendAdminEmail(
  order: admin.firestore.DocumentData,
  orderId: string,
  orderRef: string
): Promise<void> {
  const adminEmail = process.env['ADMIN_EMAIL'];

  if (!adminEmail) {
    console.warn(`ADMIN_EMAIL not configured — skipping admin notification for order ${orderId}`);
    return;
  }

  const fromEmail = process.env['RESEND_FROM_EMAIL'] ?? 'noreply@mimacrame.com';

  await getResend().emails.send({
    from: `Mimacramé Studio <${fromEmail}>`,
    html: buildAdminEmailHtml(order, orderRef),
    subject: `Nuevo pedido recibido — ${orderRef}`,
    to: adminEmail,
  });
}

function buildOrderRef(orderId: string): string {
  return `#MIM-${orderId.slice(0, 6).toUpperCase()}`;
}

function formatCurrency(amountInEuros: number): string {
  return new Intl.NumberFormat('es-ES', { currency: 'EUR', style: 'currency' }).format(
    amountInEuros
  );
}

function buildItemsHtml(
  items: Array<{ product: { name: string; price: number }; quantity: number }>
): string {
  return items
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px 0;">${item.product.name} × ${item.quantity}</td>
          <td style="padding:6px 0;text-align:right;">${formatCurrency(item.product.price * item.quantity)}</td>
        </tr>`
    )
    .join('');
}

function buildAddressHtml(address: Record<string, string>): string {
  return [
    address['fullName'],
    address['street'],
    `${address['postalCode']} ${address['city']}, ${address['province']}`,
    address['country'],
  ]
    .filter(Boolean)
    .join('<br>');
}

function buildCustomerEmailHtml(order: admin.firestore.DocumentData, orderRef: string): string {
  const items = (order['items'] ?? []) as Array<{
    product: { name: string; price: number };
    quantity: number;
  }>;
  const shippingAddress = (order['shippingAddress'] ?? {}) as Record<string, string>;

  return `
    <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#1a1a2e;">
      <h2 style="color:#c8a96e;">¡Tu pedido está confirmado! 🧶</h2>
      <p>Pedido <strong>${orderRef}</strong></p>
      <p>Hemos empezado a tejer tu pedido con mucho cariño y te lo enviaremos en cuanto esté listo.</p>

      <h3 style="border-bottom:1px solid #e0e0e0;padding-bottom:8px;">Tu pedido</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${buildItemsHtml(items)}
        <tr style="border-top:1px solid #e0e0e0;font-weight:bold;">
          <td style="padding:8px 0;">Total</td>
          <td style="padding:8px 0;text-align:right;">${formatCurrency(order['total'] ?? 0)}</td>
        </tr>
      </table>

      <h3 style="border-bottom:1px solid #e0e0e0;padding-bottom:8px;">Dirección de envío</h3>
      <p style="line-height:1.6;">${buildAddressHtml(shippingAddress)}</p>

      <p style="color:#888;font-size:13px;margin-top:32px;">
        Mimacramé Studio · Badajoz, Extremadura
      </p>
    </div>
  `;
}

function buildAdminEmailHtml(order: admin.firestore.DocumentData, orderRef: string): string {
  const items = (order['items'] ?? []) as Array<{
    product: { name: string; price: number };
    quantity: number;
  }>;
  const shippingAddress = (order['shippingAddress'] ?? {}) as Record<string, string>;

  return `
    <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#1a1a2e;">
      <h2>Nuevo pedido recibido — ${orderRef}</h2>

      <p><strong>Cliente:</strong> ${order['customerEmail'] ?? '—'}</p>

      <h3 style="border-bottom:1px solid #e0e0e0;padding-bottom:8px;">Artículos</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${buildItemsHtml(items)}
        <tr style="border-top:1px solid #e0e0e0;font-weight:bold;">
          <td style="padding:8px 0;">Total</td>
          <td style="padding:8px 0;text-align:right;">${formatCurrency(order['total'] ?? 0)}</td>
        </tr>
      </table>

      <h3 style="border-bottom:1px solid #e0e0e0;padding-bottom:8px;">Dirección de envío</h3>
      <p style="line-height:1.6;">${buildAddressHtml(shippingAddress)}</p>
    </div>
  `;
}
