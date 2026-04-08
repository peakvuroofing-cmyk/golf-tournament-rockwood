# Rockwood Park Golf Tournament Registration System

A **production-ready** golf tournament registration system built with Next.js, TypeScript, Tailwind CSS, and Plaid for secure bank payments. All registration data is stored in Google Sheets for easy management by event staff.

## 🎯 Features

✅ **Individual & Team Registration** - Support both registration types with dynamic form switching
✅ **Payment Integration** - Secure bank account linking via Plaid (ACH)
✅ **Google Sheets Backend** - All data stored in organized, readable Google Sheets
✅ **Comprehensive Validation** - Zod schemas for strict input validation
✅ **Audit Logging** - Full audit trail of all registrations and payments
✅ **Mobile Responsive** - Works seamlessly on desktop, tablet, and mobile
✅ **Security First** - Input sanitization, no secrets in frontend, secure payment handling
✅ **Duplicate Prevention** - Detects and prevents duplicate registrations
✅ **Error Handling** - Graceful error states and user feedback

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js 18+** and npm or yarn
- **Google Cloud Project** with service account
- **Plaid Account** (free sandbox available)
- **Google Sheet** created (we'll share with service account)

### 2. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd golf-tournament

# Install dependencies
npm install
```

### 3. Setup Google Sheets

1. Create a new Google Sheet: https://sheets.google.com
2. Name it: "Golf Tournament Registrations 2026"
3. Copy the **Spreadsheet ID** from the URL bar:
   ```
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
   ```

4. Create a Google Service Account:
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Search for "Sheets API" and enable it
   - Go to "Service Accounts" (under APIs & Services)
   - Click "Create Service Account"
   - Download the JSON key file
   - Extract these values from the JSON:
     - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: The email address
     - `GOOGLE_PRIVATE_KEY`: The private_key value (copy entire string including newlines)

5. Share the Google Sheet:
   - Open your Google Sheet
   - Click "Share" (top right)
   - Paste the service account email
   - Give it "Editor" access
   - Don't send notification

### 4. Setup Plaid

1. Sign up at https://plaid.com/en-US/
2. Create a new application in the Dashboard
3. Get your credentials:
   - **PLAID_CLIENT_ID**: Under "API Keys"
   - **PLAID_SECRET**: Under "API Keys"

4. For testing: Use `sandbox` environment
5. For production: Upgrade to `production` environment

### 5. Configure Environment

```bash
# Copy the example
cp .env.example .env.local

# Edit with your values
nano .env.local
```

Example `.env.local`:
```env
# Event Configuration
NEXT_PUBLIC_EVENT_NAME=Rockwood Park Golf Course Charity Golf Tournament
NEXT_PUBLIC_EVENT_DATE=2026-06-20
NEXT_PUBLIC_VENUE_NAME=Rockwood Golf Course
NEXT_PUBLIC_VENUE_ADDRESS=1851 Jacksboro Hwy, Fort Worth, TX 76114
NEXT_PUBLIC_REGISTRATION_TIME=7:00 AM
NEXT_PUBLIC_SHOTGUN_START=8:00 AM
NEXT_PUBLIC_INDIVIDUAL_PRICE=135
NEXT_PUBLIC_TEAM_PRICE=500

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=1abc123xyz456

# Plaid
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret_key
PLAID_ENV=sandbox

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## � Deployment to Netlify

### 1. Prepare for Deployment

The project is already configured for Netlify deployment with:
- `netlify.toml` - Build configuration
- `public/_redirects` - SPA routing rules

### 2. Deploy to Netlify

#### Option A: Git-based Deployment (Recommended)

1. **Push to Git** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub, GitLab, or Bitbucket
   - Click "New site from Git"
   - Choose your repository
   - Netlify will auto-detect Next.js settings

3. **Configure Build Settings** (if not auto-detected):
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `18`

#### Option B: Manual Deploy with Script

1. **Use the deployment script**:
   ```bash
   # Make script executable (Linux/Mac)
   chmod +x deploy.sh

   # Run deployment
   ./deploy.sh
   ```

   Or deploy manually:
   ```bash
   # Build locally
   npm run build

   # Deploy via Netlify CLI
   npx netlify-cli deploy --prod --dir=.next
   ```

### 3. Configure Environment Variables

In your Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add all variables from your `.env.local`:

**Required Variables:**
```
# Event Configuration
NEXT_PUBLIC_EVENT_NAME=Rockwood Park Golf Course Charity Golf Tournament
NEXT_PUBLIC_EVENT_DATE=2026-06-20
NEXT_PUBLIC_VENUE_NAME=Rockwood Golf Course
NEXT_PUBLIC_VENUE_ADDRESS=1851 Jacksboro Hwy, Fort Worth, TX 76114
NEXT_PUBLIC_REGISTRATION_TIME=7:00 AM
NEXT_PUBLIC_SHOTGUN_START=8:00 AM
NEXT_PUBLIC_INDIVIDUAL_PRICE=135
NEXT_PUBLIC_TEAM_PRICE=500

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=1abc123xyz456

# Plaid
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret_key
PLAID_ENV=production

# App
NEXT_PUBLIC_APP_URL=https://your-netlify-site.netlify.app
NODE_ENV=production
```

**Important Notes:**
- Use `PLAID_ENV=production` for live payments
- Update `NEXT_PUBLIC_APP_URL` to your Netlify site URL
- Google Sheets credentials remain the same

### 4. Domain Setup (Optional)

1. Go to **Site settings** → **Domain management**
2. Add your custom domain or use the free `.netlify.app` subdomain

### 5. Test Production Deployment

1. Visit your deployed site
2. Test the registration flow
3. Verify Google Sheets integration
4. Test Plaid payment (use production credentials)

## �📋 Testing the System

### Test Plaid Payment (Sandbox)

1. Fill out the registration form
2. Click "Link Bank Account & Pay"
3. Use Plaid's test credentials:
   - Username: `user_good`
   - Password: `pass_good`
4. Select any bank and account
5. Payment should complete successfully

### Verify Google Sheets

After a test registration:
1. Open your Google Sheet
2. You should see a new row in the "Registrations" tab
3. Data should include all form fields
4. "Payments" tab should have the payment record
5. "Audit_Log" tab should show the action

## 📁 Project Structure

```
golf-tournament/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with nav/footer
│   │   ├── page.tsx             # Landing page
│   │   ├── register/
│   │   │   └── page.tsx         # Registration page
│   │   ├── globals.css          # Tailwind styles
│   │   └── api/
│   │       ├── registrations/   # Registration API routes
│   │       └── payments/        # Payment API routes
│   ├── components/              # React components
│   │   ├── EventDetailsCard.tsx
│   │   ├── PricingCard.tsx
│   │   ├── RegistrationTypeToggle.tsx
│   │   ├── IndividualForm.tsx
│   │   ├── TeamForm.tsx
│   │   ├── PaymentStep.tsx
│   │   └── FormField.tsx
│   ├── lib/
│   │   ├── config.ts            # Configuration
│   │   ├── validation/
│   │   │   └── schemas.ts       # Zod schemas
│   │   ├── sheets/              # Google Sheets operations
│   │   ├── plaid/               # Plaid integration
│   │   └── utils/               # Helper functions
│   └── types/                   # TypeScript types
├── .env.example                 # Example environment
├── .env.local                   # Your secrets (git-ignored)
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 🔐 Security Considerations

### What's Protected
✅ Plaid secret key is **server-side only**
✅ Google service account is **server-side only**
✅ All user input is **sanitized**
✅ Sensitive payment data is **never logged**
✅ Database connections are **verified server-side**
✅ Rate limiting can be **enabled** for API routes

### Best Practices
- Never commit `.env.local` or secrets
- Rotate Plaid keys quarterly
- Monitor Google Sheets API usage
- Enable HTTPS in production
- Use strong webhook secrets
- Sanitize before storage

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Then set environment variables in Vercel dashboard:
- Copy all values from `.env.local`
- Paste into Vercel Project Settings → Environment Variables
- Redeploy

### Deploy to Other Platforms

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Google Sheets Structure

### Registrations Tab
Contains all registration data:
- `submission_id` - Unique registration ID
- `registration_type` - "individual" or "team"
- `registration_status` - Payment status
- Player names, emails, phone numbers
- Golf info (handicap, BBQ choice)
- Timestamps (created_at, updated_at)

**Staff can:**
- Filter by registration type
- Sort by date
- Search by email
- Track payment status
- Export to CSV

### Payments Tab
Contains payment records:
- `payment_id` - Unique payment ID
- `submission_id` - Links to registration
- `payment_status` - pending, completed, failed
- Amount and timestamp
- Plaid transfer reference

### Settings Tab
Contains event configuration:
- Event name, date, venue
- Pricing for individual/team
- Max registration limits
- Registration open/closed status

### Audit_Log Tab
Contains all actions:
- What happened (registration, payment, etc.)
- When it happened (timestamp)
- Success or failure
- Details (error messages, etc.)

## 🐛 Troubleshooting

### "GOOGLE_SPREADSHEET_ID is not configured"
- Check `.env.local` has the correct value
- Verify it's copied from the full sheet URL

### "Failed to initialize payment"
- Verify PLAID_CLIENT_ID and PLAID_SECRET in `.env.local`
- Check your Plaid account is active
- Ensure you're using the correct environment (sandbox vs production)

### Form shows validation errors that don't clear
- Refresh the page
- Check browser console for JS errors
- Ensure JavaScript is enabled

### Data not appearing in Google Sheets
- Verify service account has been shared the sheet
- Check the sheet ID matches `GOOGLE_SPREADSHEET_ID`
- Look at browser console for API errors

## 📈 Monitoring

Monitor these key metrics:
- Registration submission success rate
- Payment completion rate
- Average registration-to-payment time
- API response times
- Google Sheets API quota usage

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  'golf-green': '#1B4332',  // Change this
  'golf-light': '#40916C',  // And this
  'golf-accent': '#D4A574',
  'golf-warm': '#F4A261',
}
```

### Change Event Details
Edit `.env.local`:
```env
NEXT_PUBLIC_EVENT_NAME=Your Event Name
NEXT_PUBLIC_INDIVIDUAL_PRICE=199
NEXT_PUBLIC_TEAM_PRICE=699
```

### Add/Remove Form Fields
Edit `src/lib/validation/schemas.ts` to modify Zod schemas, then update form components.

## 📚 Documentation

- **IMPLEMENTATION_GUIDE.md** - Complete code reference and API documentation
- **Architecture Overview** - See section 1 of implementation guide

## 💬 Support

For questions or issues:
1. Check the troubleshooting section
2. Review the implementation guide
3. Check Google Cloud / Plaid documentation
4. Contact the development team

## 📄 License

This project is proprietary. All rights reserved.

## 🎉 You're Ready!

Your golf tournament registration system is ready to go live:

1. ✅ Backend built (Next.js API routes)
2. ✅ Frontend built (React with Tailwind)
3. ✅ Database ready (Google Sheets)
4. ✅ Payments ready (Plaid integration)
5. ✅ Security implemented
6. ✅ Monitoring ready

**Next steps:**
- [ ] Test the full registration flow
- [ ] Verify data in Google Sheets
- [ ] Deploy to production
- [ ] Configure domain
- [ ] Set up email confirmations (future enhancement)
- [ ] Monitor first few registrations

Good luck with your tournament! ⛳
