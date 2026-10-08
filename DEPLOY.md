# Deploying molytexproducts.com

This is the checklist for putting the Molytex website live on Cloudflare. Work top to bottom. Each step says what to do, why it matters, and how to tell it worked.

## How the live site works

The site is fixed pages plus one contact form.

- The pages are built once into plain files (HTML, CSS, images). Cloudflare serves them from its network. There is no server to keep running.
- The contact form sends its data to `/api/inquiry`. That is a small Cloudflare Worker. It checks the visitor is human (Turnstile), saves the message in a Cloudflare D1 database, and emails a notification to the owner.
- Email sent to `info@molytexproducts.com` is forwarded to the owner's personal inbox by Cloudflare Email Routing.

Everything lives in one Cloudflare account. On the free plan, the expected cost is $0 a month (see step 10 for the one exception to check).

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
- Keep the **Secret key** private. Paste it yourself in step 9. Never send it over chat or email.

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

Each item is a pull request with tests written first. The full design is in `spec/deployment.md`.

- [x] Switch every email address and site URL to `molytexproducts.com`.
- [x] First commit and push to the repository from step 4.
- [x] Remove Sanity (unused), switch Next.js to static export, convert large photos to WebP. (PR #1)
- [x] Build the `/api/inquiry` Worker and the D1 table, connect both forms, add Turnstile, `wrangler.jsonc` and security headers. (PR #2)

To try the whole site locally, including the forms:

```bash
cp .dev.vars.example .dev.vars
npm run preview
```

Open http://localhost:8787. Emails are not sent locally; wrangler writes them to `.wrangler/tmp/email/`.

---

## Part C: First deploy (developer, with Part A done and both PRs merged)

Run these from the project folder on `main`.

### Step 6: Create the database

```bash
npx wrangler d1 create molytex
```

This creates an empty database named `molytex` and prints a `database_id`. Open `wrangler.jsonc` and replace `00000000-0000-0000-0000-000000000000` with that id. Commit that one-line change.

### Step 7: Clear the way for the domain

Cloudflare can only attach the site to `molytexproducts.com` and `www` if no other record already uses those names.

1. Cloudflare dashboard → **molytexproducts.com** → **DNS** → **Records**.
2. Delete any **A**, **AAAA** or **CNAME** record whose name is `molytexproducts.com` (or `@`) or `www`. These are usually parking-page records from the registrar.
3. Do **not** touch **MX** or **TXT** records. Email Routing needs them.

### Step 8: Build and deploy

```bash
npm run deploy
```

This does three things in order:

1. Builds the pages into `out/` with the real Turnstile site key.
2. Creates the `inquiries` table in the live database (only the first time; later runs skip it).
3. Uploads the site and the Worker, and attaches `molytexproducts.com` and `www.molytexproducts.com`. Cloudflare creates the DNS records and the HTTPS certificate itself.

Done when: `https://molytexproducts.com` loads the homepage. The certificate can take a few minutes the first time.

### Step 9: Store the two secrets

```bash
npx wrangler secret put TURNSTILE_SECRET
```

The terminal asks for a value. The owner pastes the Turnstile **Secret key** from step 2.

```bash
npx wrangler secret put NOTIFY_TO
```

Enter the owner's inbox, the **same verified address** from step 1. Notifications go there.

Both are stored encrypted in Cloudflare and never appear in the code. Until they are set, the forms answer "Please complete the verification and try again."

### Step 10: Check email sending

Submit one form on the live site (Part D). If the email does not arrive, open the Worker's **Logs** tab (Workers & Pages → `molytex` → Logs) and look for `inquiry notification failed`. If the error mentions the plan, the account needs **Workers Paid** ($5/month); decide this with the owner. The message is saved in D1 either way.

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
