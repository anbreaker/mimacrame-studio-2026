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
  shippingAddress?: ShippingAddress;
  total?: number;
}

export function buildOrderRef(orderId: string): string {
  return `#MIM-${orderId.slice(0, 6).toUpperCase()}`;
}

export function formatCurrency(amountInEuros: number): string {
  return new Intl.NumberFormat('es-ES', { currency: 'EUR', style: 'currency' }).format(
    amountInEuros
  );
}

const LOGO_LIGHT_URL = 'https://res.cloudinary.com/dwtqnscxw/image/upload/v1775571214/logo-light_ovd6xz.png';

const BASE_STYLES = `
  body { margin:0; padding:0; background:#f5f5f0; }
  * { box-sizing:border-box; }
`;

function resolveItemName(name: LocalizedName): string {
  return typeof name === 'string' ? name : name.es;
}

export function buildItemsHtml(items: OrderItem[]): string {
  return items.map((item) => {
    const image = item.product.images?.[0];
    const name = resolveItemName(item.product.name);
    return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #ece8e0;vertical-align:middle;">
          <table cellpadding="0" cellspacing="0" style="width:100%;">
            <tr>
              ${image ? `
              <td style="width:60px;vertical-align:middle;padding-right:12px;">
                <img src="${image}" alt="${name}" width="60" height="60"
                  style="border-radius:6px;object-fit:cover;display:block;" />
              </td>` : ''}
              <td style="vertical-align:middle;">
                <p style="margin:0;font-size:14px;color:#1a1a2e;font-weight:600;">${name}</p>
                <p style="margin:4px 0 0;font-size:13px;color:#888;">Cantidad: ${item.quantity}</p>
              </td>
              <td style="text-align:right;vertical-align:middle;white-space:nowrap;">
                <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a2e;">
                  ${formatCurrency(item.product.price * item.quantity)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  }).join('');
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

function buildEmailLayout(headerSubtitle: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <style>${BASE_STYLES}</style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e;border-radius:8px 8px 0 0;padding:28px 32px;text-align:center;">
              <img src="${LOGO_LIGHT_URL}" alt="Mimacramé Studio" height="40"
                style="display:inline-block;height:40px;" />
              <p style="margin:10px 0 0;color:#c8a96e;font-family:Georgia,serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                ${headerSubtitle}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px;border-radius:0 0 8px 8px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#aaa;font-family:sans-serif;">
                Mimacramé Studio · Badajoz, Extremadura<br>
                <span style="color:#c8a96e;">Hecho con mimo, tejido con amor</span>
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

export function buildCustomerEmailHtml(order: OrderData, orderRef: string): string {
  const items = order.items ?? [];
  const shippingAddress = order.shippingAddress ?? ({} as ShippingAddress);

  const body = `
    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;color:#1a1a2e;">
      ¡Tu pedido está confirmado! 🧶
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#888;">Referencia: <strong style="color:#1a1a2e;">${orderRef}</strong></p>

    <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.6;">
      Hemos recibido tu pedido y ya estamos tejiendo con mucho cariño.
      Te lo enviaremos en cuanto esté listo.
    </p>

    <h2 style="margin:0 0 4px;font-size:14px;font-family:sans-serif;text-transform:uppercase;letter-spacing:1px;color:#888;">
      Tu pedido
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${buildItemsHtml(items)}
      <tr>
        <td style="padding:16px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:15px;font-weight:700;color:#1a1a2e;">Total</td>
              <td style="text-align:right;font-size:15px;font-weight:700;color:#c8a96e;">
                ${formatCurrency(order.total ?? 0)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="margin:28px 0 0;padding:20px;background:#f9f7f4;border-radius:6px;border-left:3px solid #c8a96e;">
      <h2 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#888;">
        Dirección de envío
      </h2>
      <p style="margin:0;font-size:14px;color:#444;line-height:1.7;">
        ${buildAddressHtml(shippingAddress)}
      </p>
    </div>
  `;

  return buildEmailLayout('Confirmación de pedido', body);
}

export function buildAdminEmailHtml(order: OrderData, orderRef: string): string {
  const items = order.items ?? [];
  const shippingAddress = order.shippingAddress ?? ({} as ShippingAddress);

  const body = `
    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;color:#1a1a2e;">
      Nuevo pedido recibido
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#888;">Referencia: <strong style="color:#1a1a2e;">${orderRef}</strong></p>

    <div style="margin:0 0 24px;padding:16px;background:#f9f7f4;border-radius:6px;">
      <p style="margin:0;font-size:14px;color:#444;">
        <strong>Cliente:</strong> ${order.customerEmail ?? '—'}
      </p>
    </div>

    <h2 style="margin:0 0 4px;font-size:14px;font-family:sans-serif;text-transform:uppercase;letter-spacing:1px;color:#888;">
      Artículos
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${buildItemsHtml(items)}
      <tr>
        <td style="padding:16px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:15px;font-weight:700;color:#1a1a2e;">Total</td>
              <td style="text-align:right;font-size:15px;font-weight:700;color:#c8a96e;">
                ${formatCurrency(order.total ?? 0)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="margin:28px 0 0;padding:20px;background:#f9f7f4;border-radius:6px;border-left:3px solid #c8a96e;">
      <h2 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#888;">
        Dirección de envío
      </h2>
      <p style="margin:0;font-size:14px;color:#444;line-height:1.7;">
        ${buildAddressHtml(shippingAddress)}
      </p>
    </div>
  `;

  return buildEmailLayout('Nuevo pedido — Admin', body);
}
