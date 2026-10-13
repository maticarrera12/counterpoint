// Single source of truth for the studio WhatsApp number and link format.
export const WHATSAPP_PHONE = '5491154793056';

export const whatsappUrl = (message?: string) =>
  `https://wa.me/${WHATSAPP_PHONE}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
