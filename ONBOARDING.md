# Onboarding — Getting This Project Running Locally

Welcome. The repo is live-ready, but it depends on **secrets that are not committed to Git** (service-account key, Gmail password, API tokens). This doc tells you exactly what to grab and where to put it.

## 1. Clone & install

```bash
git clone <repo-url>
cd golf-tournament-rockwood
npm install
```

## 2. Secrets you need

Three sources of secrets. The repo owner should provide access to each — don't share files by email or chat.

### A. Google Service Account JSON (for Google Sheets writes)

- Go to https://console.cloud.google.com/iam-admin/serviceaccounts for project **golf-tournament-493211**.
- Ask the repo owner to invite you as Editor on the Cloud project, OR to generate a new key for the existing service account and share it via a password manager.
- Download the `.json` key file and drop it in the **project root** (e.g., `golf-tournament-abc123.json`).
- `.gitignore` already excludes `*.json` (with allowlist for `package.json` etc.), so this stays safe.
- **Also** verify the service account email has Editor access on the spreadsheet itself: https://docs.google.com/spreadsheets/d/1raJ_eAfYfW6oULWces-0XS2eyd8Cm9wQNGYu-nh1P20/edit → Share.

### B. Netlify access

Preferred path: repo owner adds you to the Netlify team for the `rockwoodgolftournament` site. Then:

```bash
npx netlify login            # opens browser, click Authorize
npx netlify link             # pick "rockwoodgolftournament"
npx netlify env:pull .env.local
```

That pulls every production env var into `.env.local` automatically — including `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SPREADSHEET_ID`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL`, etc.

Alternative (faster but more manual): repo owner generates a short-lived **Personal Access Token** at https://app.netlify.com/user/applications#personal-access-tokens and shares it securely. Put it in `.env.local` as:

```env
NETLIFY_AUTH_TOKEN=<token>
```

Then the `env:pull` above works without browser login.

### C. Gmail App Password (if you need to send test emails from your own account)

You should not need this — `netlify env:pull` gives you the existing `EMAIL_PASS`. But if you want to test from a different Gmail:

1. Enable **2-Step Verification** on your Gmail.
2. https://myaccount.google.com/apppasswords → generate a 16-char password for "Mail".
3. Replace `EMAIL_USER` / `EMAIL_PASS` / `EMAIL_FROM` in `.env.local`.

## 3. Verify the setup

```bash
# Schema check (read-only; confirms you can reach the sheet)
node scripts/verify-sheets.js <your-service-account.json> 1raJ_eAfYfW6oULWces-0XS2eyd8Cm9wQNGYu-nh1P20

# SMTP smoke test (sends a real email)
node scripts/test-email.js your.email@example.com

# Start the dev server
npm run dev
# then http://localhost:3000
```

If all three succeed, you're ready. If any fails, start with `verify-sheets.js` — its errors are most diagnostic.

## 4. What to never commit

- `.env`, `.env.local`, `.env.*.local`
- Any `*.json` file except `package.json` / `package-lock.json` / `tsconfig.json` / `.mcp.json`
- Service account keys
- Netlify tokens
- Screenshots under `.audit/`

`.gitignore` enforces all of the above — don't override it.

## 5. Useful commands

```bash
npm run dev              # dev server with hot reload
npm run build            # production build (CI runs this)
npm run type-check       # tsc --noEmit
npm run lint             # next lint

# Sheet tooling
node scripts/verify-sheets.js <key.json> <spreadsheet-id>
node setup-google-sheets.js <key.json> <spreadsheet-id>                   # re-apply schema (non-destructive)
node setup-google-sheets.js <key.json> <spreadsheet-id> --delete-existing-rows   # destructive — prompts for "yes"

# Email tooling
node scripts/test-email.js <recipient>

# Netlify
npx netlify env:list
npx netlify env:pull .env.local
npx netlify deploy --prod
```

## 6. Code map (the short version)

```
src/
├── app/
│   ├── api/
│   │   ├── registrations/create/route.ts  — POST: form submit, writes row, fires 2 emails
│   │   ├── registrations/status/route.ts  — GET: lookup by submission_id
│   │   └── payments/confirm/route.ts      — POST: Square post-payment webhook; flips to paid + sends "Payment Confirmed" email
│   ├── register/page.tsx                  — the registration flow (type → form → payment)
│   └── register/success/page.tsx          — post-Square landing page
├── components/
│   ├── NavBar.tsx                         — sticky header + mobile hamburger
│   ├── IndividualForm.tsx / TeamForm.tsx  — form fields
│   └── PaymentStep.tsx                    — redirects to Square payment link
├── lib/
│   ├── config.ts                          — env-var validators
│   ├── email/
│   │   ├── client.ts                      — nodemailer transport
│   │   └── templates.ts                   — 3 email templates (customer × 2, admin × 1)
│   ├── sheets/
│   │   ├── client.ts                      — googleapis wrapper
│   │   ├── registrations.ts               — addRegistration / updateRegistrationStatus / getRegistrationById
│   │   └── audit-log.ts                   — logAction
│   ├── utils/
│   │   ├── format-date.ts                 — CST-formatted strings for the sheet
│   │   ├── id-generator.ts                — submission_id / log_id
│   │   ├── normalize-data.ts              — form → RegistrationData → sheet row
│   │   └── sanitize.ts                    — HTML-entity encoder (⚠ see CHANGES-2026-04-18.md #2)
│   └── validation/schemas.ts              — zod
└── types/index.ts                         — domain types

scripts/
├── test-email.js                          — SMTP smoke test
└── verify-sheets.js                       — read-only schema check

setup-google-sheets.js                     — destructive: re-headers + formats the live sheet
```

## Questions?

Read `CHANGES-2026-04-18.md` for the full history of what got built and why. Outstanding follow-ups are listed at the bottom of that file.
