import { AVAILABLE_LANGS, DEFAULT_LANG, Lang } from '../src/app/core/const/lang.const';

export type LocalizedName = string | { es: string; en?: string };

export interface OrderItem {
  product: { images?: string[]; name: LocalizedName; price: number };
  quantity: number;
}

export interface ShippingAddress {
  city: string;
  country: string;
  fullName: string;
  phone?: string;
  postalCode: string;
  province: string;
  street: string;
}

export interface OrderData {
  customerEmail?: string;
  items?: OrderItem[];
  lang?: string;
  shippingAddress?: ShippingAddress;
  total?: number;
}

interface EmailTranslations {
  adminHeader: (name: string) => string;
  adminSubject: (ref: string) => string;
  adminTitle: string;
  customer: string;
  customerConfirmBody: string;
  customerHeader: string;
  customerSubject: (ref: string) => string;
  customerTitle: string;
  footer: string;
  itemsSection: string;
  quantity: string;
  reference: string;
  shipping: string;
  total: string;
}

const EMAIL_TRANSLATIONS: Record<Lang, EmailTranslations> = {
  en: {
    adminHeader: (name) => `New order — ${name}`,
    adminSubject: (ref) => `New order received — ${ref}`,
    adminTitle: 'New order received',
    customer: 'Customer',
    customerConfirmBody:
      'We have received your order and are already weaving it with great care. We will send it to you as soon as it is ready.',
    customerHeader: 'Order confirmation',
    customerSubject: (ref) => `Your order is confirmed — ${ref}`,
    customerTitle: 'Your order is confirmed! 🧶',
    footer: 'Made with care, woven with love',
    itemsSection: 'Your order',
    quantity: 'Quantity',
    reference: 'Reference',
    shipping: 'Shipping address',
    total: 'Total',
  },
  es: {
    adminHeader: (name) => `Nuevo pedido — ${name}`,
    adminSubject: (ref) => `Nuevo pedido recibido — ${ref}`,
    adminTitle: 'Nuevo pedido recibido',
    customer: 'Cliente',
    customerConfirmBody:
      'Hemos recibido tu pedido y ya estamos tejiendo con mucho cariño. Te lo enviaremos en cuanto esté listo.',
    customerHeader: 'Confirmación de pedido',
    customerSubject: (ref) => `Tu pedido está confirmado — ${ref}`,
    customerTitle: '¡Tu pedido está confirmado! 🧶',
    footer: 'Hecho con mimo, tejido con amor',
    itemsSection: 'Tu pedido',
    quantity: 'Cantidad',
    reference: 'Referencia',
    shipping: 'Dirección de envío',
    total: 'Total',
  },
  pt: {
    adminHeader: (name) => `Novo pedido — ${name}`,
    adminSubject: (ref) => `Novo pedido recebido — ${ref}`,
    adminTitle: 'Novo pedido recebido',
    customer: 'Cliente',
    customerConfirmBody:
      'Recebemos seu pedido e já estamos tecendo com muito carinho. Enviaremos assim que estiver pronto.',
    customerHeader: 'Confirmação de pedido',
    customerSubject: (ref) => `Seu pedido foi confirmado — ${ref}`,
    customerTitle: 'Seu pedido foi confirmado! 🧶',
    footer: 'Feito com carinho, tecido com amor',
    itemsSection: 'Seu pedido',
    quantity: 'Quantidade',
    reference: 'Referência',
    shipping: 'Endereço de entrega',
    total: 'Total',
  },
};

export function getTranslations(lang?: string): EmailTranslations {
  const key = AVAILABLE_LANGS.includes(lang as Lang) ? (lang as Lang) : DEFAULT_LANG;
  return EMAIL_TRANSLATIONS[key];
}

export function buildOrderRef(orderId: string): string {
  return `#MIM-${orderId.slice(0, 6).toUpperCase()}`;
}

export function formatCurrency(amountInEuros: number): string {
  return new Intl.NumberFormat('es-ES', { currency: 'EUR', style: 'currency' }).format(
    amountInEuros
  );
}

const LOGO_LIGHT_URL =
  'https://res.cloudinary.com/dwtqnscxw/image/upload/v1775571214/logo-light_ovd6xz.png';

const BASE_STYLES = `
  body { margin:0; padding:0; background:#0c1b2b; }
  * { box-sizing:border-box; }
`;

function resolveItemName(name: LocalizedName): string {
  return typeof name === 'string' ? name : name.es;
}

export function buildItemsHtml(items: OrderItem[], t: EmailTranslations): string {
  return items
    .map((item) => {
      const image = item.product.images?.[0];
      const name = resolveItemName(item.product.name);
      return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #243650;vertical-align:middle;">
          <table cellpadding="0" cellspacing="0" style="width:100%;">
            <tr>
              ${
                image
                  ? `
              <td style="width:60px;vertical-align:middle;padding-right:12px;">
                <img src="${image}" alt="${name}" width="60" height="60"
                  style="border-radius:6px;object-fit:cover;display:block;" />
              </td>`
                  : ''
              }
              <td style="vertical-align:middle;">
                <p style="margin:0;font-size:14px;color:#f5efe8;font-weight:600;">${name}</p>
                <p style="margin:4px 0 0;font-size:13px;color:#9baab8;">${t.quantity}: ${item.quantity}</p>
              </td>
              <td style="text-align:right;vertical-align:middle;white-space:nowrap;">
                <p style="margin:0;font-size:14px;font-weight:600;color:#f5efe8;">
                  ${formatCurrency(item.product.price * item.quantity)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
    })
    .join('');
}

export function buildAddressHtml(address: ShippingAddress): string {
  return [
    address.fullName,
    address.street,
    `${address.postalCode} ${address.city}, ${address.province}`,
    address.country,
  ]
    .filter(Boolean)
    .join('<br>');
}

function buildEmailLayout(
  headerSubtitle: string,
  bodyContent: string,
  footerTagline = EMAIL_TRANSLATIONS.es.footer
): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <style>${BASE_STYLES}</style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c1b2b;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#152336;border-radius:8px 8px 0 0;padding:28px 32px;text-align:center;border-bottom:1px solid #243650;">
              <img src="${LOGO_LIGHT_URL}" alt="Mimacramé Studio" height="40"
                style="display:inline-block;height:40px;" />
              <p style="margin:10px 0 0;color:#ffb830;font-family:Georgia,serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                ${headerSubtitle}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#152336;padding:32px;border-radius:0 0 8px 8px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9baab8;font-family:sans-serif;">
                Mimacramé Studio · Badajoz, Extremadura<br>
                <span style="color:#ffb830;">${footerTagline}</span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Contact email templates ───────────────────────────────────────────────────
interface ContactEmailTranslations {
  adminSubject: (name: string) => string;
  adminTitle: (name: string) => string;
  confirmBody: string;
  confirmHeader: string;
  confirmSubject: string;
  footer: string;
  fromLabel: string;
  messageLabel: string;
  subjectLabel: string;
}

const CONTACT_TRANSLATIONS: Record<Lang, ContactEmailTranslations> = {
  en: {
    adminSubject: (name) => `New contact message from ${name}`,
    adminTitle: (name) => `New message from ${name}`,
    confirmBody: 'We have received your message and will get back to you as soon as possible.',
    confirmHeader: 'We received your message',
    confirmSubject: 'We received your message — Mimacramé Studio',
    footer: 'Made with care, woven with love',
    fromLabel: 'From',
    messageLabel: 'Message',
    subjectLabel: 'Subject',
  },
  es: {
    adminSubject: (name) => `Nuevo mensaje de contacto de ${name}`,
    adminTitle: (name) => `Nuevo mensaje de ${name}`,
    confirmBody: 'Hemos recibido tu mensaje y te responderemos lo antes posible.',
    confirmHeader: 'Recibimos tu mensaje',
    confirmSubject: 'Hemos recibido tu mensaje — Mimacramé Studio',
    footer: 'Hecho con mimo, tejido con amor',
    fromLabel: 'De',
    messageLabel: 'Mensaje',
    subjectLabel: 'Asunto',
  },
  pt: {
    adminSubject: (name) => `Nova mensagem de contacto de ${name}`,
    adminTitle: (name) => `Nova mensagem de ${name}`,
    confirmBody: 'Recebemos a sua mensagem e responderemos o mais breve possível.',
    confirmHeader: 'Recebemos a sua mensagem',
    confirmSubject: 'Recebemos a sua mensagem — Mimacramé Studio',
    footer: 'Feito com carinho, tecido com amor',
    fromLabel: 'De',
    messageLabel: 'Mensagem',
    subjectLabel: 'Assunto',
  },
};

export function getContactTranslations(lang?: string): ContactEmailTranslations {
  const key = AVAILABLE_LANGS.includes(lang as Lang) ? (lang as Lang) : DEFAULT_LANG;
  return CONTACT_TRANSLATIONS[key];
}

export function buildContactAdminEmailHtml(data: {
  email: string;
  lang?: string;
  message: string;
  name: string;
  subject: string;
  translatedMessage?: string;
}): string {
  const t = getContactTranslations('es');
  const body = `
    <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:22px;color:#f5efe8;">
      ${t.adminTitle(data.name)}
    </h1>
    <div style="background:#1c2e42;border-radius:6px;padding:20px;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#9baab8;">${t.fromLabel}</p>
      <p style="margin:0;font-size:15px;color:#f5efe8;font-weight:600;">${data.name}</p>
      <p style="margin:4px 0 0;font-size:14px;color:#9baab8;">${data.email}</p>
    </div>
    <div style="background:#1c2e42;border-radius:6px;padding:20px;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#9baab8;">${t.subjectLabel}</p>
      <p style="margin:0;font-size:15px;color:#f5efe8;">${data.subject}</p>
    </div>
    <div style="background:#1c2e42;border-radius:6px;padding:20px;border-left:3px solid #ff6b3d;${data.translatedMessage ? '' : ''}">
      <p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#9baab8;">${t.messageLabel}</p>
      <p style="margin:0;font-size:15px;color:#f5efe8;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
    </div>
    ${
      data.translatedMessage
        ? `
    <div style="background:#1c2e42;border-radius:6px;padding:20px;margin-top:12px;border-left:3px solid #ffb830;">
      <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#9baab8;">Traducción automática (ES)</p>
      <p style="margin:0;font-size:15px;color:#f5efe8;line-height:1.7;white-space:pre-wrap;">${data.translatedMessage}</p>
    </div>`
        : ''
    }
  `;
  return buildEmailLayout(t.adminTitle(data.name), body, t.footer);
}

export function buildContactConfirmEmailHtml(data: {
  lang?: string;
  message: string;
  name: string;
  subject: string;
}): string {
  const t = getContactTranslations(data.lang);
  const body = `
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:22px;color:#f5efe8;">
      ${t.confirmHeader}
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#9baab8;line-height:1.6;">
      ${t.confirmBody}
    </p>
    <div style="background:#1c2e42;border-radius:6px;padding:20px;border-left:3px solid #ff6b3d;">
      <p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#9baab8;">${t.subjectLabel}</p>
      <p style="margin:0 0 16px;font-size:14px;color:#f5efe8;">${data.subject}</p>
      <p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#9baab8;">${t.messageLabel}</p>
      <p style="margin:0;font-size:14px;color:#f5efe8;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
    </div>
  `;
  return buildEmailLayout(t.confirmHeader, body, t.footer);
}

export function buildContactAdminSubject(name: string, lang?: string): string {
  return getContactTranslations(lang).adminSubject(name);
}

export function buildContactConfirmSubject(lang?: string): string {
  return getContactTranslations(lang).confirmSubject;
}

// ── Artisan reply email templates ─────────────────────────────────────────────

export function buildArtisanReplyEmailHtml(data: {
  message: string;
  orderRef: string;
}): string {
  const body = `
    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;color:#f5efe8;">
      Mimacramé Studio te respondió 🧵
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#9baab8;">
      Pedido: <strong style="color:#f5efe8;">${data.orderRef}</strong>
    </p>
    <div style="background:#1c2e42;border-radius:6px;padding:20px;border-left:3px solid #ffb830;">
      <p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#9baab8;">
        Mensaje de la artesana
      </p>
      <p style="margin:0;font-size:15px;color:#f5efe8;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
    </div>
    <p style="margin:24px 0 0;font-size:13px;color:#9baab8;line-height:1.6;">
      Si tenés alguna consulta adicional, podés responder directamente a este email o escribirnos desde nuestra web.
    </p>
  `;
  return buildEmailLayout('Tu pedido · Mimacramé Studio', body, EMAIL_TRANSLATIONS.es.footer);
}

export function buildArtisanReplySubject(orderRef: string): string {
  return `Mimacramé Studio te respondió sobre tu pedido ${orderRef}`;
}

// ── Order email templates ─────────────────────────────────────────────────────
export function buildCustomerEmailHtml(order: OrderData, orderRef: string): string {
  const t = getTranslations(order.lang);
  const items = order.items ?? [];
  const shippingAddress = order.shippingAddress ?? ({} as ShippingAddress);

  const body = `
    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;color:#f5efe8;">
      ${t.customerTitle}
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#9baab8;">${t.reference}: <strong style="color:#f5efe8;">${orderRef}</strong></p>

    <p style="margin:0 0 24px;font-size:15px;color:#9baab8;line-height:1.6;">
      ${t.customerConfirmBody}
    </p>

    <h2 style="margin:0 0 4px;font-size:14px;font-family:sans-serif;text-transform:uppercase;letter-spacing:1px;color:#9baab8;">
      ${t.itemsSection}
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${buildItemsHtml(items, t)}
      <tr>
        <td style="padding:16px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:15px;font-weight:700;color:#f5efe8;">${t.total}</td>
              <td style="text-align:right;font-size:15px;font-weight:700;color:#ff6b3d;">
                ${formatCurrency(order.total ?? 0)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="margin:28px 0 0;padding:20px;background:#1c2e42;border-radius:6px;border-left:3px solid #ff6b3d;">
      <h2 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#9baab8;">
        ${t.shipping}
      </h2>
      <p style="margin:0;font-size:14px;color:#f5efe8;line-height:1.7;">
        ${buildAddressHtml(shippingAddress)}
      </p>
    </div>
  `;

  return buildEmailLayout(t.customerHeader, body, t.footer);
}

export function buildAdminEmailHtml(order: OrderData, orderRef: string): string {
  const t = getTranslations(order.lang);
  const items = order.items ?? [];
  const shippingAddress = order.shippingAddress ?? ({} as ShippingAddress);

  const body = `
    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;color:#f5efe8;">
      ${t.adminTitle}
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#9baab8;">${t.reference}: <strong style="color:#f5efe8;">${orderRef}</strong></p>

    <div style="margin:0 0 24px;padding:16px;background:#1c2e42;border-radius:6px;">
      <p style="margin:0;font-size:14px;color:#f5efe8;">
        <strong>${t.customer}:</strong> ${order.customerEmail ?? '—'}
      </p>
    </div>

    <h2 style="margin:0 0 4px;font-size:14px;font-family:sans-serif;text-transform:uppercase;letter-spacing:1px;color:#9baab8;">
      ${t.itemsSection}
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${buildItemsHtml(items, t)}
      <tr>
        <td style="padding:16px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:15px;font-weight:700;color:#f5efe8;">${t.total}</td>
              <td style="text-align:right;font-size:15px;font-weight:700;color:#ff6b3d;">
                ${formatCurrency(order.total ?? 0)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="margin:28px 0 0;padding:20px;background:#1c2e42;border-radius:6px;border-left:3px solid #ff6b3d;">
      <h2 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#9baab8;">
        ${t.shipping}
      </h2>
      <p style="margin:0;font-size:14px;color:#f5efe8;line-height:1.7;">
        ${buildAddressHtml(shippingAddress)}
      </p>
    </div>
  `;

  return buildEmailLayout(
    t.adminHeader(shippingAddress.fullName || order.customerEmail || ''),
    body,
    t.footer
  );
}
