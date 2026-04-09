// Configuration loader with validation
export const config = {
  // Event details
  event: {
    name: process.env.NEXT_PUBLIC_EVENT_NAME || 'Rockwood Park Golf Course Charity Golf Tournament',
    date: process.env.NEXT_PUBLIC_EVENT_DATE || '2026-06-20',
    venueName: process.env.NEXT_PUBLIC_VENUE_NAME || 'Rockwood Golf Course',
    venueAddress: process.env.NEXT_PUBLIC_VENUE_ADDRESS || '1851 Jacksboro Hwy, Fort Worth, TX 76114',
    registrationTime: process.env.NEXT_PUBLIC_REGISTRATION_TIME || '7:00 AM',
    shotgunStart: process.env.NEXT_PUBLIC_SHOTGUN_START || '8:00 AM',
    individualPrice: parseInt(process.env.NEXT_PUBLIC_INDIVIDUAL_PRICE || '135'),
    teamPrice: parseInt(process.env.NEXT_PUBLIC_TEAM_PRICE || '500'),
  },

  // Google Sheets
  google: {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    privateKey: process.env.GOOGLE_PRIVATE_KEY!,
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
};

const googleEnvVars = [
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_SPREADSHEET_ID',
];

const stripeEnvVars = [
  'STRIPE_SECRET_KEY',
];

function getMissingEnvVars(vars: string[]) {
  return vars.filter(key => !process.env[key]);
}

export function validateGoogleConfig() {
  const missing = getMissingEnvVars(googleEnvVars);
  if (missing.length > 0) {
    throw new Error(`Missing required Google Sheets environment variables: ${missing.join(', ')}`);
  }
}

export function validateStripeConfig() {
  const missing = getMissingEnvVars(stripeEnvVars);
  if (missing.length > 0) {
    throw new Error(`Missing required Stripe environment variables: ${missing.join(', ')}`);
  }
}

export function validateConfig() {
  const missing = getMissingEnvVars([...googleEnvVars, ...stripeEnvVars]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
