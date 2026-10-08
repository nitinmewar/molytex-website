export type InquiryResult = { success: true } | { success: false; error: string };

const FIELDS = ["name", "organization", "email", "phone", "interest", "message"] as const;
const GENERIC_ERROR = "Something went wrong. Please try again.";

export async function sendInquiry(formData: FormData): Promise<InquiryResult> {
  // The id lets the server ignore a repeated submit (double click, retry) instead of storing it twice.
  const body: Record<string, string> = { id: crypto.randomUUID() };
  for (const key of FIELDS) body[key] = String(formData.get(key) ?? "");
  // The Turnstile widget writes its token into this hidden field inside the form.
  body.turnstileToken = String(formData.get("cf-turnstile-response") ?? "");

  try {
    const res = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (res.ok && data.ok) return { success: true };
    return { success: false, error: data.error || GENERIC_ERROR };
  } catch {
    return { success: false, error: GENERIC_ERROR };
  }
}
