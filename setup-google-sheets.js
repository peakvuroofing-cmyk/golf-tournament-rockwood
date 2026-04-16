/**
 * NorTex Society Golf Tournament — Google Sheets Setup Script
 *
 * Usage:
 *   node setup-google-sheets.js path/to/service-account-key.json SPREADSHEET_ID
 *
 * Steps:
 *   1. Go to sheets.google.com and create a blank spreadsheet
 *   2. Name it "NorTex Society Golf Tournament 2026"
 *   3. Share it with the service account email (Editor access)
 *   4. Copy the spreadsheet ID from the URL (the long string between /d/ and /edit)
 *   5. Run: node setup-google-sheets.js key.json YOUR_SPREADSHEET_ID
 */

const fs = require('fs');
const { google } = require('googleapis');

const REGISTRATIONS_HEADERS = [
  'Submission ID', 'Created At', 'Type', 'Status',
  'Payment Status', 'Amount ($)',
  'First Name', 'Last Name', 'Email', 'Phone', 'Company / Organization',
  'Team Name', 'Player Count',
  'Player 1', 'Player 2', 'Player 3', 'Player 4',
  'BBQ Choice 1', 'BBQ Choice 2', 'BBQ Choice 3', 'BBQ Choice 4',
  'Preferred Partners', 'Sponsor Interest', 'Notes',
  'Terms Accepted', 'Source',
];

const PAYMENTS_HEADERS = [
  'Payment ID', 'Submission ID', 'Created At', 'Provider',
  'Amount ($)', 'Currency', 'Status',
];

const AUDIT_LOG_HEADERS = [
  'Log ID', 'Timestamp', 'Action Type', 'Submission ID', 'Result', 'Details',
];

async function main() {
  const keyFilePath = process.argv[2];
  const spreadsheetId = process.argv[3];

  if (!keyFilePath || !spreadsheetId) {
    console.error('\n❌  Usage: node setup-google-sheets.js path/to/key.json SPREADSHEET_ID\n');
    process.exit(1);
  }

  if (!fs.existsSync(keyFilePath)) {
    console.error(`\n❌  File not found: ${keyFilePath}\n`);
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

  console.log('\n🔐  Authenticating with Google...');

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // ── 1. Rename existing sheets / add new ones ───────────────────────────────
  console.log('📊  Setting up tabs...');

  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const existingSheets = spreadsheet.data.sheets.map(s => s.properties);
  const firstSheetId = existingSheets[0].sheetId;

  const requests = [];

  // Rename Sheet1 → Registrations
  requests.push({
    updateSheetProperties: {
      properties: { sheetId: firstSheetId, title: 'Registrations' },
      fields: 'title',
    },
  });

  // Add Payments tab
  requests.push({ addSheet: { properties: { title: 'Payments', index: 1 } } });

  // Add Audit_Log tab
  requests.push({ addSheet: { properties: { title: 'Audit_Log', index: 2 } } });

  const batchResult = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests },
  });

  // Get sheet IDs for formatting
  const sheetIds = { Registrations: firstSheetId };
  for (const reply of batchResult.data.replies) {
    if (reply.addSheet) {
      sheetIds[reply.addSheet.properties.title] = reply.addSheet.properties.sheetId;
    }
  }

  // ── 2. Add headers ─────────────────────────────────────────────────────────
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

  // ── 3. Format headers ──────────────────────────────────────────────────────
  console.log('🎨  Formatting headers...');

  const formatRequests = ['Registrations', 'Payments', 'Audit_Log'].map(tabName => {
    const colCount = tabName === 'Registrations' ? REGISTRATIONS_HEADERS.length
      : tabName === 'Payments' ? PAYMENTS_HEADERS.length
      : AUDIT_LOG_HEADERS.length;

    return [
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
              textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
              backgroundColor: { red: 0.08, green: 0.08, blue: 0.08 },
              horizontalAlignment: 'CENTER',
            },
          },
          fields: 'userEnteredFormat(textFormat,backgroundColor,horizontalAlignment)',
        },
      },
      {
        updateSheetProperties: {
          properties: {
            sheetId: sheetIds[tabName],
            gridProperties: { frozenRowCount: 1 },
          },
          fields: 'gridProperties.frozenRowCount',
        },
      },
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

  // ── 4. Print results ───────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(65));
  console.log('✅  SETUP COMPLETE');
  console.log('═'.repeat(65));
  console.log(`\n📋  Your sheet: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit\n`);
  console.log('─'.repeat(65));
  console.log('🔑  Add these 3 variables to Netlify → Site config → Environment variables:\n');
  console.log(`GOOGLE_SERVICE_ACCOUNT_EMAIL=${credentials.client_email}`);
  console.log(`GOOGLE_SPREADSHEET_ID=${spreadsheetId}`);
  console.log('\nFor GOOGLE_PRIVATE_KEY — paste the entire block below into Netlify:\n');
  console.log(credentials.private_key);
  console.log('─'.repeat(65));
}

main().catch(err => {
  console.error('\n❌  Error:', err.message || err);
  if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  process.exit(1);
});
