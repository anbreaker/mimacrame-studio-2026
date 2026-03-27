import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGIN = process.env['ALLOWED_ORIGIN'] ?? '*';
const CORS_ALLOWED_HEADERS = 'Content-Type, Authorization';
const CORS_ALLOWED_METHODS = 'POST, OPTIONS';
const CORS_HEADER_ALLOW_HEADERS = 'Access-Control-Allow-Headers';
const CORS_HEADER_ALLOW_METHODS = 'Access-Control-Allow-Methods';
const CORS_HEADER_ALLOW_ORIGIN = 'Access-Control-Allow-Origin';
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';
const DEEPL_TIMEOUT_MS = 10_000;
const HTTP_METHOD_OPTIONS = 'OPTIONS';
const HTTP_METHOD_POST = 'POST';
const VALID_TARGET_LANGS = ['EN', 'PT'] as const;

type TargetLang = (typeof VALID_TARGET_LANGS)[number];

interface DeepLResponse {
  translations: Array<{ text: string }>;
}

function isValidTargetLang(value: unknown): value is TargetLang {
  return VALID_TARGET_LANGS.includes(value as TargetLang);
}

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

  const apiKey = process.env['DEEPL_API_KEY'];
  if (!apiKey) {
    httpResponse.status(500).json({ error: 'Translation service not configured' });
    return;
  }

  const { text, targetLang } = httpRequest.body as { text: unknown; targetLang: unknown };

  if (!text || typeof text !== 'string' || text.trim() === '') {
    httpResponse.status(400).json({ error: 'Missing or empty text' });
    return;
  }

  if (!isValidTargetLang(targetLang)) {
    httpResponse.status(400).json({ error: 'Invalid targetLang — must be EN or PT' });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEEPL_TIMEOUT_MS);

  try {
    const deeplResponse = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
        source_lang: 'ES',
      }),
      signal: controller.signal,
    });

    if (!deeplResponse.ok) {
      if (deeplResponse.status === 429) {
        httpResponse.status(429).json({ error: 'Translation rate limit reached. Try again later.' });
        return;
      }
      if (deeplResponse.status === 456) {
        httpResponse.status(456).json({ error: 'Monthly translation quota exceeded.' });
        return;
      }
      httpResponse.status(deeplResponse.status).json({ error: 'Translation failed' });
      return;
    }

    const data = (await deeplResponse.json()) as DeepLResponse;
    const translatedText = data.translations[0].text;

    httpResponse.status(200).json({ translatedText });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      httpResponse.status(503).json({ error: 'Translation service timed out' });
      return;
    }
    httpResponse.status(500).json({ error: 'Translation failed' });
  } finally {
    clearTimeout(timeout);
  }
}
