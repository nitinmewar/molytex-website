# Spec: Deploy Molytex on Cloudflare

Status: approved 2026-10-08.

## Goal

Run the Molytex website entirely on Cloudflare, in the owner's Cloudflare account, so it can be handed over with nothing else to manage.

## Mental model

The site is fixed pages plus one contact form.

- The pages never change between visitors. They can be built once into plain HTML, CSS, and images, and served as files.
- The form is the only part that needs a server. It must check the input, store the message, and tell the owner.

So the deployment is one Cloudflare Worker. It serves the built files for every path. It runs code only for `/api/inquiry`.

## Decisions

1. **Static export.** Next.js builds with `output: "export"` into `out/`. There is no Next.js server in production.
2. **One Worker.** `wrangler.jsonc` serves `out/` as static assets. `run_worker_first: ["/api/*"]` sends only API requests to the Worker code.
3. **Storage in D1.** Inquiries are stored in a Cloudflare D1 table. Sanity is removed.
4. **Email on Cloudflare.**
   - Email Routing forwards `info@molytexproducts.com` to the owner's personal inbox.
   - The Worker sends each inquiry notification with the `send_email` binding, using `env.EMAIL.send()`. It sends from `noreply@molytexproducts.com` to the owner, with Reply-To set to the visitor.
   - Note: Email Routing only receives. To send mail as `info@` later, the owner needs a mailbox provider.
5. **Bot protection.** Cloudflare Turnstile on both forms. The Worker verifies the token before doing anything else.
6. **Images.** Static export disables Next's image resizing, so `next.config.ts` sets `images.unoptimized: true`. Large PNG and JPG files are converted to WebP once and committed. Example: the products page drops from 6 × 2.2MB = 13.2MB to about 6 × 150KB = 0.9MB.
7. **Deploys.** The GitHub repo is connected to Cloudflare Workers Builds. Every push to `main` builds and deploys. D1 migrations apply as part of the deploy command.
8. **The Go + Postgres + Railway plan is dropped.** Workers cannot run Go natively, and one form does not justify a separate server.

## API: `POST /api/inquiry`

Request: JSON, at most 16KB, `Content-Type: application/json`.

| Field | Rule |
|---|---|
| `id` | UUID made by the browser per submission. Makes retries safe. |
| `name` | Required, 1–120 chars |
| `organization` | Required, 1–160 chars |
| `email` | Required, at most 254 chars, valid email shape |
| `phone` | Optional, at most 32 chars |
| `interest` | Optional, must be one of the 7 product options |
| `message` | Required, 1–4000 chars |
| `turnstileToken` | Required |

Order of checks:

1. Wrong method gets 405. Wrong content type or an oversized body gets 415 or 413.
2. A rate limit of 5 requests per 60 seconds per IP returns 429 when exceeded.
3. Turnstile verification, with a 5 second timeout. A failure returns 403.
4. Field validation. A failure returns 400 with one human-readable message.
5. `INSERT … ON CONFLICT(id) DO NOTHING`. If the row already existed, return 200 and do not email again.
6. Send the notification email. If email fails, still return 200, because the message is saved. Log the failure without personal data.

Response: `{ "ok": true }` or `{ "ok": false, "error": "…" }`.

## D1 schema

```sql
CREATE TABLE inquiries (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  organization TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL DEFAULT '',
  interest     TEXT NOT NULL DEFAULT '',
  message      TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  emailed      INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX inquiries_created_at ON inquiries(created_at);
```

`emailed` records whether the notification went out, so failed ones can be found and re-sent.

The owner reads inquiries in the Cloudflare dashboard (D1 → molytex → Console).

## Security headers

A `public/_headers` file sets the following:

- A Content-Security-Policy that allows self plus `challenges.cloudflare.com` for Turnstile.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `frame-ancestors 'none'`.

## Removed

- Sanity: the packages `sanity`, `next-sanity`, `@sanity/*` and `styled-components`, plus `src/sanity`, `src/lib/sanity`, the empty `src/app/studio` folder, and `src/app/api/revalidate`.
- `resend` and the `submitInquiry` server action.

## Tests (written first)

- Worker tests run inside the real Workers runtime with a local D1. This needs `@cloudflare/vitest-pool-workers`, which is worth adding because a fake database would hide SQL and binding bugs. The tests cover:
  - the happy path stores a row and sends one email
  - a repeated `id` stores one row and sends one email
  - each validation rule rejects bad input
  - a bad Turnstile token is rejected and nothing is stored
  - an email failure still stores the row, with `emailed = 0`
  - an oversized body and a wrong content type are rejected
- Playwright tests run against `wrangler dev`. Both forms submit, show the success message, and create a row. Turnstile uses Cloudflare's test keys.
- The existing page tests must still pass against the static build.

## Owner setup (cannot be done from code)

1. Create a Cloudflare account.
2. Add `molytexproducts.com` and switch the nameservers at the registrar.
3. Enable Email Routing. Forward `info@` to the owner's inbox and verify that inbox.
4. Invite the developer as an Administrator, to be removed after handover.
5. Own the GitHub repository, or accept a transfer of it.
6. Check whether `send_email` sending needs the Workers Paid plan ($5/month). If it does, decide whether to pay or fall back to sending only to the verified routing address.

## Open content items (block launch)

- Certificate PDFs for `/certificates/*.pdf`. All four "View certificate" links are broken today.
- The office address and phone number in the footer.
- The Privacy Policy banner image, exported from Figma.

## Work order (one PR each)

1. Initial commit of the current site. This needs approval.
2. Remove Sanity, switch to static export, convert images.
3. D1 migration and the `/api/inquiry` Worker, test first.
4. Point the forms at the API and add Turnstile, with Playwright tests.
5. `wrangler.jsonc`, `_headers`, and a `HANDOVER.md` for the owner.
6. Owner setup and go-live on the real domain.
