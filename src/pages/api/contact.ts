import type { APIRoute } from 'astro';
import { z } from 'zod';
import { Resend } from 'resend';
import { BUDGETS, BUDGET_VALUES, PROJECT_TYPES, PROJECT_TYPE_VALUES } from '../../lib/contact-options';
import { confirmationEmailHtml, ownerNotificationHtml } from '../../lib/email-templates';

export const prerender = false;

const schema = z.object({
  nombre: z.string().trim().min(1, { error: 'Contanos tu nombre.' }).max(120),
  email: z.email({ error: 'Ingresá un email válido.' }).max(200),
  whatsapp: z.string().trim().max(40).optional(),
  tipoProyecto: z.enum(PROJECT_TYPE_VALUES, { error: 'Elegí un tipo de proyecto.' }),
  presupuesto: z.enum(BUDGET_VALUES).optional(),
  mensaje: z
    .string()
    .trim()
    .min(20, { error: 'Contanos un poco más (mínimo 20 caracteres).' })
    .max(5000),
  empresa_web: z.string().optional(),
});

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// Blank optional inputs arrive as empty strings from the browser; treat them as absent.
const normalize = (raw: unknown) => {
  if (typeof raw !== 'object' || raw === null) return raw;
  const out: Record<string, unknown> = { ...(raw as Record<string, unknown>) };
  for (const key of ['whatsapp', 'presupuesto']) {
    if (out[key] === '') delete out[key];
  }
  return out;
};

export const POST: APIRoute = async ({ request }) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: 'Solicitud inválida.' }, 400);
  }

  const parsed = schema.safeParse(normalize(raw));
  if (!parsed.success) {
    return json({ ok: false, errors: z.flattenError(parsed.error).fieldErrors }, 400);
  }

  const data = parsed.data;

  // Honeypot: real users never see this field. Pretend success so bots learn nothing.
  if (data.empresa_web && data.empresa_web.trim() !== '') {
    return json({ ok: true }, 200);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  const from = import.meta.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error('[contact] Missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL');
    return json({ ok: false, error: 'No pudimos enviar tu consulta.' }, 502);
  }

  const resend = new Resend(apiKey);

  const tipoLabel = PROJECT_TYPES.find((o) => o.value === data.tipoProyecto)?.label ?? data.tipoProyecto;
  const presupuestoLabel = data.presupuesto
    ? (BUDGETS.find((o) => o.value === data.presupuesto)?.label ?? data.presupuesto)
    : 'No indicado';

  const rows: Array<[string, string]> = [
    ['Nombre', data.nombre],
    ['Email', data.email],
    ['WhatsApp', data.whatsapp || 'No indicado'],
    ['Tipo de proyecto', tipoLabel],
    ['Presupuesto', presupuestoLabel],
  ];

  const ownerHtml = ownerNotificationHtml({ tipoLabel, rows, mensaje: data.mensaje });

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Nueva consulta — ${tipoLabel} — ${data.nombre}`.replace(/[\r\n]+/g, ' '),
      html: ownerHtml,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error('[contact] Owner notification failed', err);
    return json({ ok: false, error: 'No pudimos enviar tu consulta.' }, 502);
  }

  // Confirmation to the submitter: best effort. The owner already has the lead.
  try {
    const { error } = await resend.emails.send({
      from,
      to: data.email,
      subject: 'Recibimos tu consulta — CounterPoint',
      html: confirmationEmailHtml({ nombre: data.nombre }),
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error('[contact] Confirmation email failed', err);
  }

  return json({ ok: true }, 200);
};
