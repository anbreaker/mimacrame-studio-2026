import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

import { buildArtisanReplyEmailHtml, buildArtisanReplySubject } from './email-templates';

const ALLOWED_ORIGIN = process.env['ALLOWED_ORIGIN'] ?? '*';
const CORS_ALLOWED_HEADERS = 'Content-Type, Authorization';
const CORS_ALLOWED_METHODS = 'POST, OPTIONS';
const CORS_HEADER_ALLOW_HEADERS = 'Access-Control-Allow-Headers';
const CORS_HEADER_ALLOW_METHODS = 'Access-Control-Allow-Methods';
const CORS_HEADER_ALLOW_ORIGIN = 'Access-Control-Allow-Origin';

const getResend = (): Resend => new Resend(process.env['RESEND_API_KEY'] ?? '');

export default async function handler(
  httpRequest: VercelRequest,
  httpResponse: VercelResponse
): Promise<void> {
  httpResponse.setHeader(CORS_HEADER_ALLOW_ORIGIN, ALLOWED_ORIGIN);
  httpResponse.setHeader(CORS_HEADER_ALLOW_METHODS, CORS_ALLOWED_METHODS);
  httpResponse.setHeader(CORS_HEADER_ALLOW_HEADERS, CORS_ALLOWED_HEADERS);

  if (httpRequest.method === 'OPTIONS') {
    httpResponse.status(200).end();
    return;
  }

  if (httpRequest.method !== 'POST') {
    httpResponse.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const adminSecret = process.env['ADMIN_SECRET'] ?? '';
  const providedSecret = httpRequest.headers['x-admin-secret'];

  if (!adminSecret || providedSecret !== adminSecret) {
    httpResponse.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { customerEmail, message, orderRef } = httpRequest.body as {
    customerEmail: string;
    message: string;
    orderRef: string;
  };

  if (!customerEmail || !message || !orderRef) {
    httpResponse.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const resend = getResend();

  const { error } = await resend.emails.send({
    from: 'Mimacramé Studio <onboarding@resend.dev>',
    html: buildArtisanReplyEmailHtml({ message, orderRef }),
    subject: buildArtisanReplySubject(orderRef),
    to: customerEmail,
  });

  if (error) {
    console.error('[artisan-reply] Resend error:', error);
    httpResponse.status(500).json({ error: 'Failed to send email' });
    return;
  }

  httpResponse.status(200).json({ success: true });
}
