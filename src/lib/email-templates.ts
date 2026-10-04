// Branded HTML email templates for the contact form (src/pages/api/contact.ts).
// Email clients don't render modern CSS or custom fonts reliably, so these use
// table layout + inline styles + a web-safe font stack instead of the site's
// Tailwind classes. Colors mirror the design tokens in src/styles/global.css
// (--color-bg, --color-text, --color-accent) since @theme values aren't
// reachable from here.

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const FONT_STACK = "Arial, Helvetica, sans-serif";
const COLOR_BG = '#f3f2f2';
const COLOR_TEXT = '#201e1d';
const COLOR_ACCENT = '#F63E02';
const COLOR_DIVIDER = 'rgba(32,30,29,0.4)';
const COLOR_MUTED = 'rgba(32,30,29,0.55)';

// Shared shell: wordmark header, content slot, muted footer. Keeps every
// contact-form email visually consistent with the site (CounterPoint<accent dot>,
// uppercase accent eyebrow, bold heading, thin dividers).
function emailShell(bodyHtml: string): string {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background-color:${COLOR_BG};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLOR_BG};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:28px;font-family:${FONT_STACK};font-size:15px;font-weight:800;letter-spacing:-0.02em;text-transform:uppercase;color:${COLOR_TEXT};">
                CounterPoint<span style="color:${COLOR_ACCENT};">.</span>
              </td>
            </tr>
            <tr>
              <td style="border-top:2px solid ${COLOR_DIVIDER};font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            ${bodyHtml}
            <tr>
              <td style="padding:28px 0 0;border-top:1px solid ${COLOR_DIVIDER};">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-family:${FONT_STACK};font-size:11px;letter-spacing:0.08em;color:${COLOR_MUTED};padding-top:20px;">
                      CounterPoint — Estudio de diseño &amp; desarrollo web<br>
                      Buenos Aires, Argentina
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function ownerNotificationHtml({
  tipoLabel,
  rows,
  mensaje,
}: {
  tipoLabel: string;
  rows: Array<[string, string]>;
  mensaje: string;
}): string {
  const body = `
    <tr>
      <td style="padding:28px 0 8px;font-family:${FONT_STACK};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:700;color:${COLOR_ACCENT};">
        Nueva consulta
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 20px;font-family:${FONT_STACK};font-size:26px;line-height:1.15;letter-spacing:-0.02em;font-weight:800;color:${COLOR_TEXT};">
        ${escapeHtml(tipoLabel)}
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
          ${rows
            .map(
              ([k, v]) => `
          <tr>
            <td style="padding:7px 16px 7px 0;font-family:${FONT_STACK};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${COLOR_MUTED};white-space:nowrap;border-bottom:1px solid ${COLOR_DIVIDER.replace('0.4', '0.15')};">${escapeHtml(k)}</td>
            <td style="padding:7px 0;font-family:${FONT_STACK};font-size:14px;color:${COLOR_TEXT};border-bottom:1px solid ${COLOR_DIVIDER.replace('0.4', '0.15')};width:100%;">${escapeHtml(v)}</td>
          </tr>`,
            )
            .join('')}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 6px;font-family:${FONT_STACK};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${COLOR_MUTED};">
        Mensaje
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 4px;font-family:${FONT_STACK};font-size:15px;line-height:1.6;color:${COLOR_TEXT};white-space:pre-wrap;">${escapeHtml(mensaje)}</td>
    </tr>`;
  return emailShell(body);
}

export function confirmationEmailHtml({ nombre }: { nombre: string }): string {
  const body = `
    <tr>
      <td style="padding:28px 0 8px;font-family:${FONT_STACK};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:700;color:${COLOR_ACCENT};">
        Consulta recibida
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 20px;font-family:${FONT_STACK};font-size:26px;line-height:1.15;letter-spacing:-0.02em;font-weight:800;color:${COLOR_TEXT};">
        Hola ${escapeHtml(nombre)}, ya la tenemos.
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 4px;font-family:${FONT_STACK};font-size:15px;line-height:1.6;color:${COLOR_TEXT};">
        Te respondemos dentro de las 48&nbsp;hs hábiles. Mientras tanto, si querés sumar algo, respondé directamente a este mail.
      </td>
    </tr>`;
  return emailShell(body);
}
