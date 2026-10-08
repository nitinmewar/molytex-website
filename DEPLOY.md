# Deploying molytexproducts.com

This is the checklist for putting the Molytex website live on Cloudflare. Work top to bottom. Each step says what to do, why it matters, and how to tell it worked.

## How the live site works

The site is fixed pages plus one contact form.

- The pages are built once into plain files (HTML, CSS, images). Cloudflare serves them from its network. There is no server to keep running.
- The contact form sends its data to `/api/inquiry`. That is a small Cloudflare Worker. It checks the visitor is human (Turnstile), saves the message in a Cloudflare D1 database, and emails a notification to the owner.
- Email sent to `info@molytexproducts.com` is forwarded to the owner's personal inbox by Cloudflare Email Routing.

Everything lives in one Cloudflare account. On the free plan, the expected cost is $0 a month (see step 9 for the one exception to check).

---

## Part A: Cloudflare dashboard (owner or admin, about 15 minutes)

### Step 1: Finish email forwarding

Why: the website shows `info@molytexproducts.com`. Without forwarding, mail to it is lost.

1. Cloudflare dashboard → **molytexproducts.com** → **Email** → **Email Routing**.
2. **Destination addresses** tab → **Add destination address**. Enter the owner's real inbox (for example a Gmail address).
3. Open that inbox and click the verification link from Cloudflare. The address shows **Verified** in the dashboard.
4. **Routing rules** tab → **Create address**:
   - Custom address: `info`
   - Action: **Send to an email**
   - Destination: the verified inbox from step 2
5. Leave the **Catch-all** rule off. Mail to random addresses like `sales@` is then dropped instead of becoming spam.

Done when: **Overview** shows Routing status **Enabled**, and an email sent to `info@molytexproducts.com` from another account arrives in the owner's inbox.

Note: forwarding only receives mail. To *send* mail as `info@`, the owner needs a mailbox provider later (Google Workspace, Zoho, and so on).

### Step 2: Create the spam check (Turnstile)

Why: without it, bots fill the contact form and the owner's inbox with spam.

1. Cloudflare dashboard → **Turnstile** → **Add widget**.
2. Widget name: `Molytex website`.
3. Hostnames: `molytexproducts.com` and `www.molytexproducts.com`.
4. Widget mode: **Managed**.
5. Create. Cloudflare shows a **Site key** and a **Secret key**.

Done when: you have both keys.
- Send the **Site key** to the developer. It is public and goes into the website.
- Keep the **Secret key** private. Paste it yourself in step 7. Never send it over chat or email.

### Step 3: Let the developer deploy from their computer

Why: the deploy tool (`wrangler`) acts on the Cloudflare account and needs permission once.

On the developer's Mac, in the project folder:

```bash
npx wrangler login
```

A browser window opens. Sign in to the Cloudflare account that owns molytexproducts.com and click **Allow**.

Done when: this prints the account name:

```bash
npx wrangler whoami
```

### Step 4: Create the code repository

Why: the code needs a permanent home the owner controls, and Cloudflare can redeploy from it automatically.

1. On GitHub, create a **private**, **empty** repository (no README), ideally under the owner's account. Suggested name: `molytex-website`.
2. Add the developer as a collaborator with **Write** access.
3. Send the developer the repository URL.

Done when: the developer confirms the first push landed.

### Step 5: Send the missing content

The site cannot launch with these gaps:

| Item | Where it shows | Today |
|---|---|---|
| ISO 9001, ISO 13485, CDSCO, DPIIT certificate PDFs | "View certificate" links | Links are broken |
| Office address | Footer | Shows "[Office address]" |
| Phone number | Footer | Shows "+91 [phone number]" |
| Privacy Policy banner image (export from Figma as PNG at 2×) | Top of Privacy Policy page | Uses a lower-quality stand-in |

---

## Part B: Code changes (developer)

Each item is one small pull request, with tests written first. The full design is in `spec/deployment.md`.

- [x] Switch every email address and site URL to `molytexproducts.com`.
- [ ] First commit and push to the repository from step 4.
- [ ] Remove Sanity (unused), switch Next.js to static export, convert large photos to WebP.
- [ ] Build the `/api/inquiry` Worker and the D1 table.
- [ ] Connect both contact forms to `/api/inquiry` and add the Turnstile check.
- [ ] Add `wrangler.jsonc` (Cloudflare config) and security headers.

---

## Part C: First deploy (developer, with Part A done)

These commands run from the project folder. Each one is safe to re-run.

### Step 6: Create the database

```bash
npx wrangler d1 create molytex
```

This creates an empty database named `molytex`. It prints a `database_id`. That id goes into `wrangler.jsonc`.

```bash
npx wrangler d1 migrations apply molytex --remote
```

This creates the `inquiries` table. It only applies changes that have not run yet.

### Step 7: Store the Turnstile secret

```bash
npx wrangler secret put TURNSTILE_SECRET
```

The terminal asks for the value. The owner pastes the **Secret key** from step 2. It is stored encrypted in Cloudflare and never appears in the code.

### Step 8: Build and deploy

```bash
npm run deploy
```

This builds the pages and uploads the site and the Worker. `wrangler.jsonc` also attaches `molytexproducts.com` and `www.molytexproducts.com`, so Cloudflare sets up the DNS records and HTTPS certificate itself.

Done when: `https://molytexproducts.com` loads the homepage.

### Step 9: Check email sending cost

The Worker sends notifications with Cloudflare's email binding. If the first form test fails with an error about plan or sending limits, the account needs **Workers Paid** ($5/month), or the Worker must send only to the verified inbox from step 1. The developer decides this with the owner at this point. Everything else stays on the free plan.

---

## Part D: Go-live checks

Do each one on the live site, on a laptop and on a phone.

- [ ] Every page opens: Home, About Us, Products, Certifications, Privacy Policy.
- [ ] `http://molytexproducts.com` redirects to `https://`.
- [ ] Submit the homepage "Let's Connect" form. A success message shows.
- [ ] The notification email arrives in the owner's inbox within a minute. Clicking **Reply** answers the visitor.
- [ ] The message is saved: Cloudflare dashboard → **Storage & Databases** → **D1** → `molytex` → **Console**, then run:
  ```sql
  SELECT created_at, name, email FROM inquiries ORDER BY created_at DESC LIMIT 5;
  ```
- [ ] Submit the "Contact Us" popup form. Same result.
- [ ] Each "View certificate" link opens its PDF.
- [ ] Footer shows the real address and phone number.

---

## Part E: Handover

- [ ] Connect the GitHub repository to Cloudflare (**Workers & Pages** → the `molytex` Worker → **Settings** → **Build** → connect repository). After this, every push to `main` redeploys the site.
- [ ] Owner removes the developer from the Cloudflare account and the GitHub repository when they are satisfied.

### Day-to-day, after launch

- **Read form messages:** they arrive by email. The full history is in D1 (query in Part D).
- **Change text or images:** edit the code and push to `main`. The site redeploys in about two minutes.
- **If notifications stop arriving:** check Email Routing → **Activity log**, then the Worker's **Logs** tab. Messages are still saved in D1 even when email fails.
