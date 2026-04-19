/**
 * Read-only connectivity + schema check.
 * Auths with the service account, reads the header rows from Registrations
 * and Audit_Log, and reports mismatches vs the schema the app expects.
 *
 * Usage:
 *   node scripts/verify-sheets.js <service-account-key.json> <SPREADSHEET_ID>
 *
 * No mutations. Safe to run any time.
 */

const fs = require('fs');
const { google } = require('googleapis');

const EXPECTED_REGISTRATIONS = [
  'Submission ID', 'Created At', 'Updated At', 'Type',
  'Registration Status', 'Payment Status', 'Amount',
  'Event Name', 'Event Date', 'Venue Name', 'Venue Address',
  'Team Name', 'First Name', 'Last Name', 'Full Name',
  'Email', 'Phone', 'Company / Organization', 'Player Count',
  'Player 1', 'Player 2', 'Player 3', 'Player 4',
  'Handicap 1', 'Handicap 2', 'Handicap 3', 'Handicap 4',
  'Preferred Partners', 'Sponsor Interest',
  'BBQ Choice 1', 'BBQ Choice 2', 'BBQ Choice 3', 'BBQ Choice 4',
  'Notes', 'Terms Accepted', 'Source Page',
];

const EXPECTED_AUDIT_LOG = [
  'Log ID', 'Timestamp', 'Action Type', 'Submission ID', 'Result', 'Details',
];

const [keyFilePath, spreadsheetId] = process.argv.slice(2);
if (!keyFilePath || !spreadsheetId) {
  console.error('\nUsage: node scripts/verify-sheets.js <key.json> <SPREADSHEET_ID>\n');
  process.exit(1);
}

async function main() {
  const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  console.log(`\n🔐  Auth as ${credentials.client_email}`);
  console.log(`📋  Sheet:  https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit\n`);

  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const tabs = meta.data.sheets.map(s => s.properties.title);
  console.log('Tabs present:', tabs.join(', '));

  let failures = 0;

  for (const [title, expected] of [
    ['Registrations', EXPECTED_REGISTRATIONS],
    ['Audit_Log', EXPECTED_AUDIT_LOG],
  ]) {
    if (!tabs.includes(title)) {
      console.log(`❌  [${title}] tab is missing`);
      failures++;
      continue;
    }
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${title}!1:1`,
    });
    const actual = resp.data.values?.[0] || [];
    const match = actual.length === expected.length
      && expected.every((h, i) => actual[i] === h);

    if (match) {
      console.log(`✅  [${title}] ${expected.length} columns match`);
    } else {
      failures++;
      console.log(`❌  [${title}] header mismatch`);
      console.log(`    Expected (${expected.length}):`, expected);
      console.log(`    Actual   (${actual.length}):`, actual);
      for (let i = 0; i < Math.max(actual.length, expected.length); i++) {
        if (actual[i] !== expected[i]) {
          console.log(`    col ${String.fromCharCode(65 + (i < 26 ? i : 25))}${i >= 26 ? String.fromCharCode(65 + (i - 26)) : ''}: expected="${expected[i] ?? ''}"  actual="${actual[i] ?? ''}"`);
        }
      }
    }
  }

  // Fail on unwanted extra tabs
  const extras = tabs.filter(t => !['Registrations', 'Audit_Log'].includes(t));
  if (extras.length > 0) {
    failures++;
    console.log(`⚠️   Extra tabs present (should be removed):`, extras.join(', '));
  }

  console.log('');
  if (failures === 0) {
    console.log('🎉  All checks passed.');
    process.exit(0);
  } else {
    console.log(`❌  ${failures} check(s) failed. Run setup-google-sheets.js to fix.`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\n❌  Error:', err.message || err);
  if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  process.exit(1);
});
