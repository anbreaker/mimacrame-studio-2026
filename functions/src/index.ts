import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';

admin.initializeApp();

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] ?? '', {
  apiVersion: '2024-12-18.acacia',
});

/**
 * Cloud Function: createPaymentIntent
 * Creates a Stripe PaymentIntent for an order.
 * Expects body: { amount: number, currency: string, orderId: string }
 */
export const createPaymentIntent = functions.https.onCall(
  async (data: { amount: number; currency: string; orderId: string }) => {
    const { amount, currency = 'eur', orderId } = data;

    if (!amount || amount <= 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Amount must be a positive number'
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
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
