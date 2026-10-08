import { describe, it, expect, vi, afterEach } from "vitest";
import { sendInquiry } from "@/lib/sendInquiry";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const fields = {
  name: "Asha Rao",
  organization: "City Hospital",
  email: "asha@hospital.in",
  phone: "+91 98765 43210",
  interest: "Hospital Disposables",
  message: "Need masks",
};

afterEach(() => vi.unstubAllGlobals());

describe("sendInquiry", () => {
  it("posts the form as JSON with a per-submission id", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      sendInquiry(form({ ...fields, extra: "ignored", "cf-turnstile-response": "tok-123" })),
    ).resolves.toEqual({ success: true });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/inquiry");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    const body = JSON.parse(init.body);
    expect(body).toMatchObject(fields);
    expect(body).not.toHaveProperty("extra");
    expect(body.turnstileToken).toBe("tok-123");
    expect(body).not.toHaveProperty("cf-turnstile-response");
    expect(body.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("returns the server's error message on rejection", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: false, error: "Please enter a valid email address." }), { status: 400 }),
    ));
    await expect(sendInquiry(form(fields))).resolves.toEqual({ success: false, error: "Please enter a valid email address." });
  });

  it("returns a generic error when the network fails or the reply is not JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    await expect(sendInquiry(form(fields))).resolves.toEqual({ success: false, error: "Something went wrong. Please try again." });

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>502</html>", { status: 502 })));
    await expect(sendInquiry(form(fields))).resolves.toEqual({ success: false, error: "Something went wrong. Please try again." });
  });
});
