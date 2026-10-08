import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";

// Needs the full local stack: `npm run preview` (static build + Worker + local D1) with .dev.vars from .dev.vars.example.
// Skipped against `next dev`, which has no /api/inquiry.
test.skip(!process.env.WORKER_STACK, "set WORKER_STACK=1 when BASE_URL points at `npm run preview`");
// Both tests read the same local SQLite file through wrangler; run them one at a time.
test.describe.configure({ mode: "serial" });

function storedEmails(email: string): number {
  const out = execFileSync(
    "npx",
    ["wrangler", "d1", "execute", "molytex", "--local", "--json", "--command", `SELECT COUNT(*) AS n FROM inquiries WHERE email = '${email}'`],
    { encoding: "utf8" },
  );
  return JSON.parse(out)[0].results[0].n;
}

test("homepage consultation form saves the inquiry", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  await page.goto("/");
  const form = page.locator("form.consult-form");
  await form.getByLabel("Your name").fill("E2E Tester");
  await form.getByLabel("Email address").fill(email);
  await form.getByLabel("Company Name").fill("Test Clinic");
  await form.getByLabel("Your message").fill("Automated end-to-end check.");
  // The invisible Turnstile widget fills its token once Cloudflare's script has run.
  await expect(form.locator('input[name="cf-turnstile-response"]')).toHaveValue(/.+/, { timeout: 15_000 });
  await form.getByRole("button", { name: /schedule a free consultation/i }).click();

  await expect(page.getByRole("status")).toContainText(/thank you/i);
  expect(storedEmails(email)).toBe(1);
});

test("contact popup form saves the inquiry", async ({ page }) => {
  const email = `e2e-popup-${Date.now()}@example.com`;
  await page.goto("/about");
  await page.getByRole("button", { name: "Get in Touch" }).click();
  const dialog = page.locator("dialog[open]");
  await dialog.getByLabel(/^Name/).fill("E2E Popup");
  await dialog.getByLabel(/^Organization/).fill("Test Hospital");
  await dialog.getByLabel(/^Email/).fill(email);
  await dialog.getByLabel("Product Interest").selectOption("Infection Control Products");
  await dialog.getByLabel(/^Message/).fill("Popup end-to-end check.");
  await expect(dialog.locator('input[name="cf-turnstile-response"]')).toHaveValue(/.+/, { timeout: 15_000 });
  await dialog.getByRole("button", { name: "Send Request" }).click();

  await expect(dialog.getByText(/thank you/i)).toBeVisible();
  expect(storedEmails(email)).toBe(1);
});
