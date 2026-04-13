import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

import {
  buildContactAdminEmailHtml,
  buildContactAdminSubject,
  buildContactConfirmEmailHtml,
  buildContactConfirmSubject,
} from './email-templates';

const ALLOWED_ORIGIN = process.env['ALLOWED_ORIGIN'] ?? '*';
const CORS_ALLOWED_HEADERS = 'Content-Type, Authorization';
const CORS_ALLOWED_METHODS = 'POST, OPTIONS';
const CORS_HEADER_ALLOW_HEADERS = 'Access-Control-Allow-Headers';
const CORS_HEADER_ALLOW_METHODS = 'Access-Control-Allow-Methods';
const CORS_HEADER_ALLOW_ORIGIN = 'Access-Control-Allow-Origin';
const HTTP_METHOD_OPTIONS = 'OPTIONS';
const HTTP_METHOD_POST = 'POST';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

const getResend = (): Resend => new Resend(process.env['RESEND_API_KEY'] ?? '');

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

  const ip = (httpRequest.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? 'unknown';

  if (isRateLimited(ip)) {
    httpResponse.status(429).json({ error: 'Too many requests' });
    return;
  }

  const { email, honeypot, lang, message, name, subject } = httpRequest.body as {
    email: string;
    honeypot: string;
    lang?: string;
    message: string;
    name: string;
    subject: string;
  };

  // Honeypot — silent 200 to confuse bots
  if (honeypot) {
    httpResponse.status(200).json({ success: true });
    return;
  }

  if (!email || !message || !name || !subject) {
    httpResponse.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const adminEmail = process.env['ADMIN_EMAIL'] ?? '';
  const resend = getResend();

  await Promise.all([
    resend.emails.send({
      from: 'Mimacrame Studio <noreply@mimacramestudio.com>',
      html: buildContactAdminEmailHtml({ email, lang, message, name, subject }),
      subject: buildContactAdminSubject(name, lang),
      to: adminEmail,
    }),
    resend.emails.send({
      from: 'Mimacrame Studio <noreply@mimacramestudio.com>',
      html: buildContactConfirmEmailHtml({ lang, message, name, subject }),
      subject: buildContactConfirmSubject(lang),
      to: email,
    }),
  ]);

  httpResponse.status(200).json({ success: true });
}
