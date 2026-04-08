# Project File Index & Quick Reference

## 📚 Documentation Files (Read First)

| File | Purpose | Read When |
|------|---------|-----------|
| `README.md` | Setup guide, quick start | Before doing anything |
| `ARCHITECTURE.md` | System design, data flow | Want to understand how it works |
| `IMPLEMENTATION_GUIDE.md` | Complete code reference (25,000 words) | Need code details |
| `DELIVERY_SUMMARY.md` | What was delivered, checklist | Want overview of completion |
| `.env.example` | Environment variables template | Setting up |

---

## ⚙️ Configuration Files (Setup Once)

| File | Purpose | Edit? |
|------|---------|-------|
| `package.json` | Dependencies list | Only to add packages |
| `tsconfig.json` | TypeScript settings | No |
| `tailwind.config.ts` | Design colors, fonts, animations | Yes (colors, fonts) |
| `next.config.js` | Next.js settings | No |
| `postcss.config.js` | PostCSS for Tailwind | No |
| `.env.example` | Template for secrets | Copy to .env.local |
| `.env.local` | Your actual secrets | YES (copy from example) |
| `.gitignore` | What NOT to commit | No |

---

## 🔤 Types & Validation (Reference)

| File | Purpose | When Used |
|------|---------|-----------|
| `src/types/index.ts` | All TypeScript interfaces | Throughout the app |
| `src/lib/validation/schemas.ts` | Zod validation schemas | Form validation, API input |
| `src/lib/config.ts` | Configuration loader | On startup |

---

## 🛠️ Utilities (Helper Functions)

| File | Purpose | What It Does |
|------|---------|--------------|
| `src/lib/utils/id-generator.ts` | Generate unique IDs | `generateSubmissionId()`, `generatePaymentId()` |
| `src/lib/utils/sanitize.ts` | Clean user input | Remove XSS, sanitize text |
| `src/lib/utils/normalize-data.ts` | Convert form data to sheet rows | Individual/team → flat structure |

---

## 📊 Google Sheets Integration

| File | Purpose | Main Functions |
|------|---------|-----------------|
| `src/lib/sheets/client.ts` | Sheets API wrapper | `getSheetsInstance()`, `appendRowsToSheet()`, `findRowByValue()` |
| `src/lib/sheets/registrations.ts` | Registration operations | `addRegistration()`, `updateRegistrationStatus()` |
| `src/lib/sheets/payments.ts` | Payment operations | `addPaymentRecord()`, `updatePaymentStatus()` |
| `src/lib/sheets/settings.ts` | Settings operations | `getSetting()`, `updateSetting()` |
| `src/lib/sheets/audit-log.ts` | Audit logging | `logAction()`, `logRegistrationSubmission()` |

---

## 💳 Payment Integration

| File | Purpose | Main Functions |
|------|---------|-----------------|
| `src/lib/plaid/client.ts` | Plaid API wrapper | `createLinkToken()`, `exchangePublicToken()` |
| `src/lib/plaid/payment-service.ts` | Payment orchestration | `createPaymentLinkToken()`, `handlePaymentExchangeAndInitiate()` |

---

## 🌐 API Routes (Backend)

| File | Method | Purpose | Request | Response |
|------|--------|---------|---------|----------|
| `src/app/api/registrations/create/route.ts` | POST | Create registration | Form data + type | submission_id, status |
| `src/app/api/payments/create-link-token/route.ts` | POST | Get Plaid link token | submission_id | link_token |
| `src/app/api/payments/exchange-token/route.ts` | POST | Exchange token & pay | public_token, amount | payment_id, status |
| `src/app/api/registrations/status/route.ts` | GET | Check status | submission_id (query) | registration data |

---

## 🎨 Frontend Components

| File | Purpose | Used In |
|------|---------|---------|
| `src/components/FormField.tsx` | Reusable input component | All forms |
| `src/components/EventDetailsCard.tsx` | Event info display | Landing page, sidebar |
| `src/components/PricingCard.tsx` | Pricing display | Landing page, sidebar |
| `src/components/RegistrationTypeToggle.tsx` | Individual/Team toggle | Registration page |
| `src/components/IndividualForm.tsx` | Individual registration form | Registration page |
| `src/components/TeamForm.tsx` | Team registration form | Registration page |
| `src/components/PaymentStep.tsx` | Plaid Link integration | Registration page |

---

## 📄 Pages (Frontend)

| File | Route | Purpose |
|------|-------|---------|
| `src/app/layout.tsx` | Global | Navigation, footer, styling |
| `src/app/page.tsx` | `/` | Landing page with hero + CTA |
| `src/app/register/page.tsx` | `/register` | Multi-step registration form |
| `src/app/globals.css` | Global | Tailwind styles + components |

---

## 🔄 Data Flow Summary

### Registration Creation
```
register/page.tsx
  ↓ (user fills form)
  ↓ (frontend validates)
  ↓ POST /api/registrations/create
  ↓ (server validates)
  ↓ lib/sheets/registrations.ts
  ↓ (append to Google Sheets)
  ↓ lib/sheets/audit-log.ts
  ↓ (log the action)
  ↓ response with submission_id
```

### Payment Processing
```
PaymentStep.tsx
  ↓ (user clicks link bank)
  ↓ POST /api/payments/create-link-token
  ↓ lib/plaid/client.ts
  ↓ (get Plaid link token)
  ↓ (open Plaid modal in browser)
  ↓ (user authorizes bank)
  ↓ POST /api/payments/exchange-token
  ↓ lib/plaid/payment-service.ts
  ↓ lib/plaid/client.ts
  ↓ (exchange public token)
  ↓ lib/sheets/payments.ts
  ↓ (create payment record)
  ↓ lib/sheets/audit-log.ts
  ↓ (log the action)
  ↓ response with payment_id
```

---

## 🔍 How to Find Things

**Need to customize the form?**
→ Edit `src/components/IndividualForm.tsx` and `src/components/TeamForm.tsx`

**Need to change validation?**
→ Edit `src/lib/validation/schemas.ts`

**Need to change colors?**
→ Edit `tailwind.config.ts` → colors

**Need to modify what's saved to Sheets?**
→ Edit `src/lib/utils/normalize-data.ts` or `src/lib/sheets/registrations.ts`

**Need to add logging?**
→ Use functions in `src/lib/sheets/audit-log.ts`

**Need to change the landing page?**
→ Edit `src/app/page.tsx`

**Need to change the registration flow?**
→ Edit `src/app/register/page.tsx`

**Need to add a new API endpoint?**
→ Create file in `src/app/api/` following the pattern

---

## 📦 Environment Variables Needed

**Public (in .env.local):**
```
NEXT_PUBLIC_EVENT_NAME
NEXT_PUBLIC_EVENT_DATE
NEXT_PUBLIC_VENUE_NAME
NEXT_PUBLIC_VENUE_ADDRESS
NEXT_PUBLIC_INDIVIDUAL_PRICE
NEXT_PUBLIC_TEAM_PRICE
NEXT_PUBLIC_REGISTRATION_TIME
NEXT_PUBLIC_SHOTGUN_START
NEXT_PUBLIC_APP_URL
```

**Secret (in .env.local, NEVER commit):**
```
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_SPREADSHEET_ID
PLAID_CLIENT_ID
PLAID_SECRET
PLAID_ENV
```

---

## ✅ File Checklist (28 total)

### Documentation (5)
- [x] README.md
- [x] ARCHITECTURE.md
- [x] IMPLEMENTATION_GUIDE.md
- [x] DELIVERY_SUMMARY.md
- [x] FILE_INDEX.md (this file)

### Configuration (7)
- [x] package.json
- [x] tsconfig.json
- [x] tailwind.config.ts
- [x] next.config.js
- [x] postcss.config.js
- [x] .env.example
- [x] .gitignore

### Types & Validation (3)
- [x] src/types/index.ts
- [x] src/lib/validation/schemas.ts
- [x] src/lib/config.ts

### Utilities (3)
- [x] src/lib/utils/id-generator.ts
- [x] src/lib/utils/sanitize.ts
- [x] src/lib/utils/normalize-data.ts

### Google Sheets (5)
- [x] src/lib/sheets/client.ts
- [x] src/lib/sheets/registrations.ts
- [x] src/lib/sheets/payments.ts
- [x] src/lib/sheets/settings.ts
- [x] src/lib/sheets/audit-log.ts

### Payment Integration (2)
- [x] src/lib/plaid/client.ts
- [x] src/lib/plaid/payment-service.ts

### API Routes (4)
- [x] src/app/api/registrations/create/route.ts
- [x] src/app/api/payments/create-link-token/route.ts
- [x] src/app/api/payments/exchange-token/route.ts
- [x] src/app/api/registrations/status/route.ts

### Frontend Components (7)
- [x] src/components/FormField.tsx
- [x] src/components/EventDetailsCard.tsx
- [x] src/components/PricingCard.tsx
- [x] src/components/RegistrationTypeToggle.tsx
- [x] src/components/IndividualForm.tsx
- [x] src/components/TeamForm.tsx
- [x] src/components/PaymentStep.tsx

### Pages (4)
- [x] src/app/layout.tsx
- [x] src/app/page.tsx
- [x] src/app/register/page.tsx
- [x] src/app/globals.css

**Total: 43 files** (all delivered)

---

## 🚀 Getting Started Order

1. Read `README.md` (setup instructions)
2. Run `cp .env.example .env.local`
3. Fill in `.env.local` with your credentials
4. Run `npm install`
5. Run `npm run dev`
6. Test at `http://localhost:3000`

---

## 📞 File Questions Answered

**Q: How do I know what environment variables to use?**
A: See `.env.example` and README.md setup section

**Q: Where's the database?**
A: Google Sheets is the database. See `src/lib/sheets/`

**Q: How does payment work?**
A: Plaid integration. See `src/lib/plaid/` and `src/components/PaymentStep.tsx`

**Q: How do I validate user input?**
A: Zod schemas in `src/lib/validation/schemas.ts`

**Q: How do I add a new form field?**
A: Edit schema in `schemas.ts`, form component, and `normalize-data.ts`

**Q: Where are the page styles?**
A: Tailwind in `src/app/globals.css` and inline in components

**Q: How is data protected?**
A: See `src/lib/utils/sanitize.ts` and security section in README

**Q: How do I change event details?**
A: Update `.env.local` variables (NEXT_PUBLIC_*)

**Q: What happens to my data?**
A: Stored in Google Sheets. See `src/lib/sheets/`

---

**This file helps you navigate the entire project.**
**Bookmark it while developing.**
