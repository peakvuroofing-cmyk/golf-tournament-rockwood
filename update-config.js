const {readFileSync, writeFileSync} = require('fs');
const path = 'src/lib/config.ts';
let text = readFileSync(path, 'utf8');
const old = `// Validate required environment variables
const requiredEnvVars = [
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_SPREADSHEET_ID',
  'PLAID_CLIENT_ID',
  'PLAID_SECRET',
];

export function validateConfig() {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      \\`Missing required environment variables: ${missing.join(', ')}\\`
    );
  }
}
`;
const neu = `const googleEnvVars = [
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_SPREADSHEET_ID',
];

const plaidEnvVars = [
  'PLAID_CLIENT_ID',
  'PLAID_SECRET',
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

export function validatePlaidConfig() {
  const missing = getMissingEnvVars(plaidEnvVars);
  if (missing.length > 0) {
    throw new Error(`Missing required Plaid environment variables: ${missing.join(', ')}`);
  }
}

export function validateConfig() {
  const missing = getMissingEnvVars([...googleEnvVars, ...plaidEnvVars]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', )}`);
  }
}
`;
if (!text.includes(old)) {
  throw new Error('Old block not found');
}
writeFileSync(path, text.replace(old, neu), 'utf8');
console.log('patched');