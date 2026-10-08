import { createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import worker from "../index";

const OWNER = "owner@example.com";
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const valid = {
  id: "6f1c2a3b-4d5e-4f60-8a71-b2c3d4e5f607",
  name: "Asha Rao",
  organization: "City Hospital",
  email: "asha@hospital.in",
  phone: "+91 98765 43210",
  interest: "Hospital Disposables",
  message: "We need 5,000 masks a month.",
  turnstileToken: "token-ok",
};

let sent: Record<string, unknown>[];
let emailFails: boolean;
let rateLimited: boolean;
let turnstilePasses: boolean;
let emailGate: Promise<void> | null;

function testEnv(): Env {
  return {
    ...env,
    TURNSTILE_SECRET: "test-secret",
    NOTIFY_TO: OWNER,
    EMAIL: {
      send: async (msg: Record<string, unknown>) => {
        await emailGate;
        if (emailFails) throw new Error("email down");
        sent.push(msg);
        return { messageId: "m1" };
      },
    } as unknown as SendEmail,
    RATE_LIMITER: { limit: async () => ({ success: !rateLimited }) } as RateLimit,
  };
}

type IncomingRequest = Request<unknown, IncomingRequestCfProperties>;
const req = (url: string, init?: RequestInit) => new Request(url, init) as IncomingRequest;

function postRequest(body: unknown, init: RequestInit = {}) {
  return req("https://molytexproducts.com/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.7" },
      body: typeof body === "string" ? body : JSON.stringify(body),
      ...init,
    });
}

// Runs the request and waits for background work (the email) so tests see the final state.
async function post(body: unknown, init: RequestInit = {}) {
  const ctx = createExecutionContext();
  const res = await worker.fetch(postRequest(body, init), testEnv(), ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

async function rows() {
  const { results } = await env.DB.prepare("SELECT * FROM inquiries").all();
  return results;
}

beforeEach(async () => {
  sent = [];
  emailFails = false;
  rateLimited = false;
  turnstilePasses = true;
  emailGate = null;
  await env.DB.exec("DELETE FROM inquiries");
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    if (String(input instanceof Request ? input.url : input) !== SITEVERIFY) throw new Error(`unexpected fetch ${input}`);
    return Response.json({ success: turnstilePasses });
  });
});

afterEach(() => vi.restoreAllMocks());

describe("POST /api/inquiry", () => {
  it("stores the inquiry and emails the owner with Reply-To set to the visitor", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const [row] = await rows();
    expect(row).toMatchObject({ id: valid.id, name: "Asha Rao", organization: "City Hospital", email: "asha@hospital.in", interest: "Hospital Disposables", emailed: 1 });

    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({
      to: OWNER,
      from: { name: "Molytex Website", email: "noreply@molytexproducts.com" },
      replyTo: "asha@hospital.in",
      subject: "New inquiry from Asha Rao — City Hospital",
    });
    expect(sent[0].text).toContain("We need 5,000 masks a month.");
    expect(sent[0].text).toContain("+91 98765 43210");
  });

  it("answers as soon as the inquiry is saved, before the email is sent", async () => {
    let release!: () => void;
    emailGate = new Promise<void>((resolve) => (release = resolve));
    const ctx = createExecutionContext();

    const res = await worker.fetch(postRequest(valid), testEnv(), ctx);
    expect(res.status).toBe(200);
    expect(sent).toHaveLength(0);
    expect((await rows())[0]).toMatchObject({ id: valid.id, emailed: 0 });

    release();
    await waitOnExecutionContext(ctx);
    expect(sent).toHaveLength(1);
    expect((await rows())[0]).toMatchObject({ emailed: 1 });
  });

  it("verifies Turnstile with the secret, token and visitor IP", async () => {
    await post(valid);
    const [, init] = vi.mocked(fetch).mock.calls[0];
    const form = init!.body as FormData;
    expect(form.get("secret")).toBe("test-secret");
    expect(form.get("response")).toBe("token-ok");
    expect(form.get("remoteip")).toBe("203.0.113.7");
  });

  it("stores and emails a repeated submission only once", async () => {
    await post(valid);
    const again = await post(valid);
    expect(again.status).toBe(200);
    expect(await rows()).toHaveLength(1);
    expect(sent).toHaveLength(1);
  });

  it("keeps the inquiry when the email fails", async () => {
    emailFails = true;
    const res = await post(valid);
    expect(res.status).toBe(200);
    const [row] = await rows();
    expect(row).toMatchObject({ id: valid.id, emailed: 0 });
  });

  it.each([
    ["missing name", { name: "" }],
    ["blank organization", { organization: "   " }],
    ["bad email", { email: "not-an-email" }],
    ["name too long", { name: "x".repeat(121) }],
    ["message too long", { message: "x".repeat(4001) }],
    ["phone too long", { phone: "1".repeat(33) }],
    ["unknown interest", { interest: "Weapons" }],
    ["bad id", { id: "123" }],
    ["non-string field", { name: 42 }],
  ])("rejects %s with 400 and stores nothing", async (_label, patch) => {
    const res = await post({ ...valid, ...patch });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { ok: boolean; error: string };
    expect(body.ok).toBe(false);
    expect(body.error.length).toBeGreaterThan(0);
    expect(await rows()).toHaveLength(0);
    expect(sent).toHaveLength(0);
  });

  it("rejects a failed or missing Turnstile check with 403 and stores nothing", async () => {
    turnstilePasses = false;
    expect((await post(valid)).status).toBe(403);
    turnstilePasses = true;
    expect((await post({ ...valid, turnstileToken: "" })).status).toBe(403);
    expect(await rows()).toHaveLength(0);
  });

  it("rejects when the visitor is over the rate limit", async () => {
    rateLimited = true;
    expect((await post(valid)).status).toBe(429);
    expect(await rows()).toHaveLength(0);
  });

  it("rejects wrong method, content type, oversized and malformed bodies", async () => {
    const get = await worker.fetch(req("https://molytexproducts.com/api/inquiry"), testEnv(), createExecutionContext());
    expect(get.status).toBe(405);
    expect((await post(valid, { headers: { "Content-Type": "text/plain" } })).status).toBe(415);
    expect((await post({ ...valid, message: "x".repeat(20_000) })).status).toBe(413);
    expect((await post("{not json")).status).toBe(400);
    expect(await rows()).toHaveLength(0);
  });

  it("returns 404 for other API paths", async () => {
    const res = await worker.fetch(req("https://molytexproducts.com/api/other", { method: "POST" }), testEnv(), createExecutionContext());
    expect(res.status).toBe(404);
  });
});
