import { LIMITS, PRODUCT_OPTIONS } from "../src/lib/inquiry";

const MAX_BODY_BYTES = 16_384;
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Inquiry = { id: string; name: string; organization: string; email: string; phone: string; interest: string; message: string };

function reply(status: number, body: { ok: boolean; error?: string }, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}
const fail = (status: number, error: string, headers?: Record<string, string>) => reply(status, { ok: false, error }, headers);

// Single-line fields go into the email subject; collapsing whitespace keeps line breaks out of it.
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

function validate(data: Record<string, unknown>): Inquiry | string {
  const str = (key: string) => (typeof data[key] === "string" ? (data[key] as string) : data[key] === undefined ? "" : null);
  const fields = { id: str("id"), name: str("name"), organization: str("organization"), email: str("email"), phone: str("phone"), interest: str("interest"), message: str("message") };
  if (Object.values(fields).some((v) => v === null)) return "Invalid form data.";
  const f = fields as Record<keyof Inquiry, string>;

  const inquiry: Inquiry = {
    id: f.id,
    name: oneLine(f.name),
    organization: oneLine(f.organization),
    email: f.email.trim(),
    phone: oneLine(f.phone),
    interest: f.interest.trim(),
    message: f.message.trim(),
  };
  if (!UUID.test(inquiry.id)) return "Invalid form data.";
  if (!inquiry.name || !inquiry.organization || !inquiry.email || !inquiry.message) return "Please fill in all required fields.";
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    if (inquiry[key].length > LIMITS[key]) return `Please shorten the ${key} field.`;
  }
  if (!EMAIL.test(inquiry.email)) return "Please enter a valid email address.";
  if (inquiry.interest && !(PRODUCT_OPTIONS as readonly string[]).includes(inquiry.interest)) return "Please choose a product category from the list.";
  return inquiry;
}

async function turnstileOk(token: string, ip: string, secret: string): Promise<boolean> {
  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
  form.set("remoteip", ip);
  try {
    const res = await fetch(SITEVERIFY, { method: "POST", body: form, signal: AbortSignal.timeout(5000) });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

function notification(q: Inquiry, env: Env) {
  return {
    to: env.NOTIFY_TO,
    from: { name: "Molytex Website", email: env.MAIL_FROM },
    replyTo: q.email,
    subject: `New inquiry from ${q.name} — ${q.organization}`,
    text: [
      `Name: ${q.name}`,
      `Organization: ${q.organization}`,
      `Email: ${q.email}`,
      `Phone: ${q.phone || "—"}`,
      `Product interest: ${q.interest || "—"}`,
      "",
      "Message:",
      q.message,
      "",
      "Reply to this email to answer the visitor directly.",
    ].join("\n"),
  };
}

async function handleInquiry(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return fail(405, "Method not allowed.", { Allow: "POST" });
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) return fail(415, "Expected JSON.");
  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_BODY_BYTES) return fail(413, "Message is too large.");
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return fail(413, "Message is too large.");

  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (!(await env.RATE_LIMITER.limit({ key: ip })).success) return fail(429, "Too many requests. Please wait a minute and try again.");

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return fail(400, "Invalid form data.");
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) return fail(400, "Invalid form data.");
  const body = data as Record<string, unknown>;

  const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
  if (!token || !(await turnstileOk(token, ip, env.TURNSTILE_SECRET))) {
    return fail(403, "Please complete the verification and try again.");
  }

  const inquiry = validate(body);
  if (typeof inquiry === "string") return fail(400, inquiry);

  const insert = await env.DB.prepare(
    "INSERT INTO inquiries (id, name, organization, email, phone, interest, message) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7) ON CONFLICT(id) DO NOTHING",
  )
    .bind(inquiry.id, inquiry.name, inquiry.organization, inquiry.email, inquiry.phone, inquiry.interest, inquiry.message)
    .run();
  // A repeated id (double click, retry) was already stored and emailed.
  if (insert.meta.changes === 0) return reply(200, { ok: true });

  try {
    await env.EMAIL.send(notification(inquiry, env));
    await env.DB.prepare("UPDATE inquiries SET emailed = 1 WHERE id = ?1").bind(inquiry.id).run();
  } catch (err) {
    // The inquiry is saved; emailed = 0 marks it for follow-up. No personal data in the log.
    console.error("inquiry notification failed", { id: inquiry.id, error: String(err) });
  }
  return reply(200, { ok: true });
}

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/inquiry") return handleInquiry(request, env);
    return fail(404, "Not found.");
  },
} satisfies ExportedHandler<Env>;
