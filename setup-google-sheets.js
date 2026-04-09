/**
 * Rockwood Golf Tournament — Google Sheets Setup Script
 *
 * Usage:
 *   node setup-google-sheets.js path/to/service-account-key.json
 *
 * What this does:
 *   1. Creates a new Google Spreadsheet named "Rockwood Golf Tournament 2026"
 *   2. Creates and formats three tabs: Registrations, Payments, Audit_Log
 *   3. Adds all column headers with bold formatting
 *   4. Prints your Netlify environment variables when done
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const SPREADSHEET_TITLE = 'Rockwood Golf Tournament 2026';

const REGISTRATIONS_HEADERS = [
  'Submission ID', 'Created At', 'Updated At', 'Type', 'Status',
  'Payment Status', 'Amount ($)', 'Event Name', 'Event Date', 'Venue',
  'Address', 'Team Name', 'First Name', 'Last Name', 'Full Name',
  'Email', 'Phone', 'Company / Organization', 'Player Count',
  'Player 1', 'Player 2', 'Player 3', 'Player 4',
  'Handicap 1', 'Handicap 2', 'Handicap 3', 'Handicap 4',
  'Preferred Partners', 'Sponsor Interest', 'BBQ Choice 1',
  'BBQ Choice 2', 'BBQ Choice 3', 'BBQ Choice 4', 'Notes',
  'Terms Accepted', 'Source', 'Stripe Session ID',
];

const PAYMENTS_HEADERS = [
  'Payment ID', 'Submission ID', 'Created At', 'Provider',
  'Amount ($)', 'Currency', 'Stripe Session ID', 'Status',
];

const AUDIT_LOG_HEADERS = [
  'Log ID', 'Timestamp', 'Action Type', 'Submission ID', 'Result', 'Details',
];

async function main() {
  const keyFilePath = process.argv[2];

  if (!keyFilePath) {
    console.error('\n❌  Usage: node setup-google-sheets.js path/to/service-account-key.json\n');
    process.exit(1);
  }

  if (!fs.existsSync(keyFilePath)) {
    console.error(`\n❌  File not found: ${keyFilePath}\n`);
    process.exit(1);
  }

  let credentials;
  try {
    credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
  } catch (e) {
    console.error('\n❌  Could not parse JSON key file. Make sure it is the file downloaded from Google Cloud.\n');
    process.exit(1);
  }

  console.log('\n🔐  Authenticating with Google...');

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const drive = google.drive({ version: 'v3', auth });

  // ── 1. Create the spreadsheet ──────────────────────────────────────────────
  console.log('📊  Creating spreadsheet...');

  const createResponse = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: SPREADSHEET_TITLE },
      sheets: [
        { properties: { title: 'Registrations', index: 0 } },
        { properties: { title: 'Payments', index: 1 } },
        { properties: { title: 'Audit_Log', index: 2 } },
      ],
    },
  });

  const spreadsheetId = createResponse.data.spreadsheetId;
  const spreadsheetUrl = createResponse.data.spreadsheetUrl;
  const sheetIds = {};
  for (const sheet of createResponse.data.sheets) {
    sheetIds[sheet.properties.title] = sheet.properties.sheetId;
  }

  console.log(`✅  Spreadsheet created: ${spreadsheetUrl}`);

  // ── 2. Add headers to each tab ─────────────────────────────────────────────
  console.log('📝  Adding column headers...');

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: 'RAW',
      data: [
        { range: 'Registrations!A1', values: [REGISTRATIONS_HEADERS] },
        { range: 'Payments!A1',      values: [PAYMENTS_HEADERS] },
        { range: 'Audit_Log!A1',     values: [AUDIT_LOG_HEADERS] },
      ],
    },
  });

  // ── 3. Format headers (bold + freeze row 1) ────────────────────────────────
  console.log('🎨  Formatting headers...');

  const formatRequests = ['Registrations', 'Payments', 'Audit_Log'].map(tabName => {
    const colCount = tabName === 'Registrations' ? REGISTRATIONS_HEADERS.length
      : tabName === 'Payments' ? PAYMENTS_HEADERS.length
      : AUDIT_LOG_HEADERS.length;

    return [
      // Bold row 1
      {
        repeatCell: {
          range: {
            sheetId: sheetIds[tabName],
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: colCount,
          },
          cell: {
            userEnteredFormat: {
              textFormat: { bold: true },
              backgroundColor: { red: 0.18, green: 0.31, blue: 0.31 }, // dark green
              horizontalAlignment: 'CENTER',
            },
          },
          fields: 'userEnteredFormat(textFormat,backgroundColor,horizontalAlignment)',
        },
      },
      // Freeze row 1
      {
        updateSheetProperties: {
          properties: {
            sheetId: sheetIds[tabName],
            gridProperties: { frozenRowCount: 1 },
          },
          fields: 'gridProperties.frozenRowCount',
        },
      },
      // Auto-resize all columns
      {
        autoResizeDimensions: {
          dimensions: {
            sheetId: sheetIds[tabName],
            dimension: 'COLUMNS',
            startIndex: 0,
            endIndex: colCount,
          },
        },
      },
    ];
  }).flat();

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: formatRequests },
  });

  // ── 4. Make spreadsheet accessible (optional: anyone with link can view) ───
  // The service account owns it. Share it with yourself by adding your email below,
  // or just open the URL printed at the end.

  // ── 5. Print results ───────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('✅  SETUP COMPLETE');
  console.log('═'.repeat(60));
  console.log('\n📋  Your Google Sheet is ready:');
  console.log(`    ${spreadsheetUrl}\n`);
  console.log('⚠️   IMPORTANT: Open the sheet link above and click Share →');
  console.log(`    add your own Google account as an Editor so you can view it.\n`);
  console.log('─'.repeat(60));
  console.log('🔑  Add these to Netlify → Site config → Environment variables:\n');
  console.log(`GOOGLE_SERVICE_ACCOUNT_EMAIL=${credentials.client_email}`);
  console.log(`GOOGLE_SPREADSHEET_ID=${spreadsheetId}`);
  console.log('\nFor GOOGLE_PRIVATE_KEY, copy the entire value below');
  console.log('(including the BEGIN and END lines) into Netlify:\n');
  console.log(credentials.private_key);
  console.log('─'.repeat(60));
  console.log('\n📌  Netlify env var names (copy exactly):');
  console.log('    GOOGLE_SERVICE_ACCOUNT_EMAIL');
  console.log('    GOOGLE_PRIVATE_KEY');
  console.log('    GOOGLE_SPREADSHEET_ID\n');
}

main().catch(err => {
  console.error('\n❌  Error:', err.message || err);
  process.exit(1);
});
