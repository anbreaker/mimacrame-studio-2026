import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import { Resend } from 'resend';
import Stripe from 'stripe';

admin.initializeApp();

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] ?? '', {
  apiVersion: '2025-02-24.acacia',
});

const resend = new Resend(process.env['RESEND_API_KEY'] ?? '');

const ORDERS_COLLECTION = 'orders';
const PAYMENT_INTENT_SUCCEEDED = 'payment_intent.succeeded';
const ORDER_STATUS_PAID = 'paid';
const STRIPE_SIGNATURE_HEADER = 'stripe-signature';

/**
 * Cloud Function: createPaymentIntent
 * Creates a Stripe PaymentIntent for an order.
 * Expects body: { amount: number, currency: string, orderId: string, receiptEmail?: string, userId?: string }
 */
export const createPaymentIntent = functions.https.onCall(
  async (
    request: functions.https.CallableRequest<{
      amount: number;
      currency: string;
      orderId: string;
      receiptEmail?: string;
      userId?: string;
    }>
  ) => {
    const { amount, currency = 'eur', orderId, receiptEmail, userId } = request.data;

    if (!amount || amount <= 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Amount must be a positive number');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Already in cents (converted by the client)
      currency,
      metadata: {
        orderId,
        ...(userId && { userId }),
      },
      ...(receiptEmail && { receipt_email: receiptEmail }),
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }
);

/**
 * Cloud Function: stripeWebhook
 * Receives Stripe events, verifies signature, and processes payment_intent.succeeded:
 * updates order status to 'paid' and sends confirmation emails.
 */
export const stripeWebhook = onRequest(
  { cors: false, region: 'europe-west1' },
  async (req, res) => {
    const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET'] ?? '';
    const sig = req.headers[STRIPE_SIGNATURE_HEADER] as string;
    const rawBody = req.rawBody;

    if (!rawBody) {
      res.status(400).send('Missing raw body');
      return;
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Webhook signature verification failed:', message);
      res.status(400).send(`Webhook Error: ${message}`);
      return;
    }

    if (event.type === PAYMENT_INTENT_SUCCEEDED) {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSucceeded(paymentIntent);
    }

    res.json({ received: true });
  }
);

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const db = admin.firestore();

  const snapshot = await db
    .collection(ORDERS_COLLECTION)
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

  await resend.emails.send({
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

  await resend.emails.send({
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

function buildItemsHtml(items: Array<{ product: { name: string; price: number }; quantity: number }>): string {
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

function buildCustomerEmailHtml(
  order: admin.firestore.DocumentData,
  orderRef: string
): string {
  const items = (order['items'] ?? []) as Array<{ product: { name: string; price: number }; quantity: number }>;
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

function buildAdminEmailHtml(
  order: admin.firestore.DocumentData,
  orderRef: string
): string {
  const items = (order['items'] ?? []) as Array<{ product: { name: string; price: number }; quantity: number }>;
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
