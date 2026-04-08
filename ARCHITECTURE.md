# Golf Tournament Registration System - Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Landing Page (/): Hero + CTA Button                      │   │
│  │ Registration Page (/register): Form + Payment Flow       │   │
│  │ Success Page: Confirmation                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────────────┘
                 │ HTTPS Requests
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Next.js Application (Node.js)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Frontend Components (React + TypeScript)                │   │
│  │ - EventDetailsCard                                      │   │
│  │ - PricingCard                                           │   │
│  │ - RegistrationTypeToggle                                │   │
│  │ - IndividualForm / TeamForm                             │   │
│  │ - PaymentStep (Plaid Link)                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                       │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ API Routes (Node.js / Server-side)                      │   │
│  │ POST /api/registrations/create                          │   │
│  │ POST /api/payments/create-link-token                    │   │
│  │ POST /api/payments/exchange-token                       │   │
│  │ GET  /api/registrations/status                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                    │         │         │                        │
│         ┌──────────┘         │         └──────────┐             │
│         ▼                     ▼                     ▼             │
│    ┌─────────┐         ┌──────────┐         ┌──────────┐        │
│    │ Zod     │         │ Sanitize │         │ ID Gen   │        │
│    │ Schemas │         │ & Validate         │          │        │
│    └─────────┘         └──────────┘         └──────────┘        │
│         │                     │                     │             │
│         └─────────────────────┴─────────────────────┘             │
│                          │                                        │
│                          ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Business Logic Layer                                    │   │
│  │ ┌─────────────────┐        ┌──────────────────────┐     │   │
│  │ │ Sheet Service   │        │ Payment Service      │     │   │
│  │ │ - addReg()      │        │ - exchangeToken()    │     │   │
│  │ │ - updateStatus()│        │ - confirmPayment()   │     │   │
│  │ │ - getHeaders()  │        │ - handleFailure()    │     │   │
│  │ └─────────────────┘        └──────────────────────┘     │   │
│  │ ┌─────────────────┐        ┌──────────────────────┐     │   │
│  │ │ Audit Service   │        │ Plaid Client         │     │   │
│  │ │ - logAction()   │        │ - createLinkToken()  │     │   │
│  │ │ - logPayment()  │        │ - exchangeToken()    │     │   │
│  │ └─────────────────┘        └──────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│         │                     │                     │             │
│         ▼                     ▼                     ▼             │
└─────────┼─────────────────────┼─────────────────────┼──────────┐
          │                     │                     │
          ▼                     ▼                     ▼
    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │ Google Sheets│      │  Plaid API   │      │  (Future DB) │
    │              │      │              │      │              │
    │ Sheets:      │      │ - Link Token │      │ PostgreSQL / │
    │ - Registra   │      │ - Exchange   │      │ MongoDB      │
    │ - Payments   │      │ - Transfer   │      │              │
    │ - Settings   │      │ - Status     │      │              │
    │ - Audit_Log  │      │              │      │              │
    └──────────────┘      └──────────────┘      └──────────────┘
```

## Data Flow

### 1. Registration Submission Flow

```
User fills form
        │
        ▼
Frontend validates (Zod)
        │
        ├─ If invalid → Show errors → Stop
        │
        ▼
POST /api/registrations/create
        │
        ▼
Server validates again (Zod)
        │
        ├─ If invalid → Return 400 → Stop
        │
        ▼
Check for duplicates by email
        │
        ├─ If duplicate → Log, Return 409 → Stop
        │
        ▼
Sanitize all input
        │
        ▼
Generate submission_id (UUID-based)
        │
        ▼
Create RegistrationDraft object
        │
        ▼
Save to Google Sheets (Registrations tab)
        │
        ├─ If failed → Log failure, Return 500
        │
        ▼
Log success to Audit_Log
        │
        ▼
Return submission_id + amount to frontend
        │
        ▼
User proceeds to payment
```

### 2. Payment Flow

```
Frontend shows payment amount
        │
        ▼
GET /api/payments/create-link-token
        │
        ▼
Plaid creates link token
        │
        ▼
Open Plaid modal (user authorizes bank)
        │
        ├─ If cancelled → Show error → Stop
        │
        ▼
User selects account
        │
        ▼
Plaid returns public_token to frontend
        │
        ▼
POST /api/payments/exchange-token
        │
        ├─ Validate submission_id exists
        │
        ▼
Exchange public_token → access_token (server-side)
        │
        ▼
Create payment record in Payments sheet
        │
        ├─ payment_id, submission_id, status=processing
        │
        ▼
Update registration status to "pending_payment"
        │
        ▼
Log to Audit_Log
        │
        ▼
Return payment_id to frontend
        │
        ▼
Frontend shows success
        │
        ▼
User receives confirmation email
        │
        ▼
Event staff sees registration in Google Sheets
```

## Component Architecture

### Page Components (App Router)
- **page.tsx** - Landing page with hero, event details, pricing, CTA
- **register/page.tsx** - Multi-step registration form
- **success/page.tsx** - Confirmation page (future)
- **error/page.tsx** - Error handling page (future)

### Form Components
- **RegistrationTypeToggle** - Individual vs Team selector
- **IndividualForm** - Collects: name, email, phone, handicap, bbq, etc.
- **TeamForm** - Collects: team name, 4 player names, contact info, etc.
- **FormField** - Reusable input component with validation display
- **EventDetailsCard** - Shows event info (date, time, location)
- **PricingCard** - Shows pricing for individual/team
- **PaymentStep** - Integrates Plaid Link modal

### API Routes (Server-side)
- **POST /api/registrations/create** - Main registration endpoint
- **POST /api/payments/create-link-token** - Initialize Plaid
- **POST /api/payments/exchange-token** - Exchange & initiate payment
- **GET /api/registrations/status** - Check registration status

## Database Schema (Google Sheets)

### Registrations Tab (Primary)
```
Headers (39 columns):
submission_id             - Unique ID (sub_YYYYMMDD_XXXX)
created_at               - ISO 8601 timestamp
updated_at               - ISO 8601 timestamp
registration_type        - "individual" or "team"
registration_status      - initiated | pending_payment | paid | failed | cancelled
payment_status           - pending | processing | completed | failed
payment_amount           - Number (USD cents or dollars)
event_name               - Copied from config
event_date               - Copied from config
venue_name               - Copied from config
venue_address            - Copied from config
team_name                - Team name (empty if individual)
contact_first_name       - Contact/Player first name
contact_last_name        - Contact/Player last name
contact_full_name        - Computed full name
contact_email            - Contact email
contact_phone            - Contact phone
company_or_organization  - Company name (optional)
player_count             - 1 for individual, 4 for team
player_1_name through
player_4_name            - Player names
handicap_1 through
handicap_4               - Optional golf handicaps
preferred_playing_partners - Optional (individuals only)
sponsorship_interest     - "Yes" or "No"
bbq_choice_1 through
bbq_choice_4             - chicken | beef | vegetarian | none
notes                    - Additional notes
terms_accepted           - "Yes" or "No"
source_page              - "/register" (for tracking)
ip_or_request_reference_if_safe - Request identifier (optional)
plaid_customer_reference - Masked Plaid reference (privacy)
plaid_transfer_id        - Plaid transfer ID (if applicable)
plaid_payment_status_raw - Raw Plaid status string
```

### Payments Tab
```
payment_id               - Unique payment ID (pay_YYYYMMDD_XXXX)
submission_id            - Links to registration
created_at               - Timestamp
payment_provider         - "plaid"
payment_method           - "bank_account" | "card" (future)
amount                   - Payment amount
currency                 - "USD"
plaid_transfer_id        - Plaid internal ID
plaid_access_reference   - Masked access token (first 20 + ***)
payment_status           - pending | processing | completed | failed
raw_response_summary     - Human-readable status
failure_reason           - Error message if failed
```

### Settings Tab
```
key                      - Setting key (event_name, individual_price, etc.)
value                    - Setting value
type                     - string | number | boolean | date
updated_at               - Last update timestamp
notes                    - Human-readable description
```

### Audit_Log Tab
```
log_id                   - Unique log ID (log_YYYYMMDD_XXXX)
timestamp                - ISO 8601 timestamp
action_type              - registration_submission | payment_initiated | etc.
submission_id            - Associated registration (if applicable)
result                   - "success" or "failure"
details                  - JSON details of the action
```

## Security Architecture

### Frontend Security
- Zod validation (client-side, for UX only)
- No secrets exposed in client code
- Sanitized form input before submit
- HTTPS only (enforced by deployment)

### API Security
- Validate all inputs with Zod (server-side)
- Sanitize all strings (remove HTML/XSS)
- Duplicate email detection
- No sensitive data in logs
- Secrets loaded from environment only
- CORS configured (origin validation future)

### Backend Security
- Plaid secret key NEVER sent to client
- Google credentials NEVER sent to client
- All external API calls server-side
- Access tokens masked before storage
- Rate limiting configurable
- Input validation before DB write

### Data Security
- PII in Google Sheets (event staff access)
- Only safe references stored (first 20 chars of tokens)
- No full access tokens stored
- Encrypted transit (HTTPS)
- Google Sheets has row-level sharing

## Extensibility Points

### Future Database
Current: Google Sheets (simple, collaborative)
Future: PostgreSQL / MongoDB
- Sheet operations abstracted in `lib/sheets/`
- Can swap with DB driver maintaining same interface

### Future Payment Methods
Current: Bank account (ACH)
Future: Credit cards, wallets
- Payment service abstracted
- New providers can extend same interface

### Future Features
- Email confirmations (SendGrid integration)
- SMS reminders (Twilio)
- Admin dashboard (separate app)
- Sponsor portal
- Leaderboard integration
- CSV export

All future features integrate through the same API routes and data structure.

## Environment Configuration

### Public Variables (visible in frontend)
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

### Secret Variables (server-side only)
```
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_SPREADSHEET_ID
PLAID_CLIENT_ID
PLAID_SECRET
PLAID_ENV
```

## Performance Considerations

### API Response Times
- Registration creation: ~2-3s (Google Sheets write)
- Payment link token: ~1s (Plaid)
- Payment exchange: ~1-2s (Plaid + Sheets)

### Optimization
- Next.js static generation for landing page
- Server-side rendering for form pages
- Client-side validation for instant feedback
- Debounced field changes
- Loading states prevent double-submit

### Scalability
- Google Sheets scales to 10M cells (easily handles 10k+ registrations)
- Plaid handles millions of transactions
- Next.js serverless scales automatically
- No database connection pooling needed

## Monitoring & Logging

### Logged Events
- Every registration attempt (success/failure)
- Every payment attempt (success/failure)
- Duplicate detections
- Validation errors
- API errors

### Key Metrics
- Total registrations
- Individual vs team split
- Payment success rate
- Average response time
- Duplicate rate
- Error rate

### Audit Trail
Complete audit log in Google Sheets for:
- Compliance review
- Dispute resolution
- Performance analysis
- Security investigation

---

**Version:** 1.0.0
**Last Updated:** June 2026
**Status:** Production Ready
