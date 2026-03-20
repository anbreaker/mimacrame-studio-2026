import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';

admin.initializeApp();

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] ?? '', {
  apiVersion: '2025-02-24.acacia',
});

/**
 * Cloud Function: createPaymentIntent
 * Creates a Stripe PaymentIntent for an order.
 * Expects body: { amount: number, currency: string, orderId: string }
 */
export const createPaymentIntent = functions.https.onCall(
  async (
    request: functions.https.CallableRequest<{ amount: number; currency: string; orderId: string }>
  ) => {
    const { amount, currency = 'eur', orderId } = request.data;

    if (!amount || amount <= 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Amount must be a positive number');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Already in cents (converted by the client)
      currency,
      metadata: {
        orderId,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }
);
