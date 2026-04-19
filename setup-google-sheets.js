/**
 * NorTex Society Golf Tournament — Google Sheets Setup
 *
 * Creates or re-headers the Registrations + Audit_Log tabs with the exact
 * schema expected by the app (see src/lib/utils/normalize-data.ts and
 * src/lib/sheets/audit-log.ts). Applies professional formatting:
 * per-column widths, number/date/currency formats, enum dropdowns,
 * checkboxes for booleans, NorTex-gold bold headers, frozen header row,
 * and alternating row banding.
 *
 * Usage:
 *   node setup-google-sheets.js <service-account-key.json> <SPREADSHEET_ID> [--delete-existing-rows]
 *
 * Flags:
 *   --delete-existing-rows  Clear all data rows before applying headers.
 *                           Destructive; prompts for confirmation on stdin.
 *
 * Non-destructive by default: re-writes headers + formatting only.
 * Existing rows stay where they are (likely misaligned — use the flag to wipe).
 */

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// ── Schema — must match src/lib/utils/normalize-data.ts registrationToSheetRow ─
const REGISTRATIONS = {
  title: 'Registrations',
  // Order matters: index = column index in the sheet
  columns: [
    { header: 'Submission ID',          width: 160, format: 'text' },
    { header: 'Created At',             width: 160, format: 'datetime' },
    { header: 'Updated At',             width: 160, format: 'datetime' },
    { header: 'Type',                   width:  90, format: 'enum',    options: ['individual', 'team'] },
    { header: 'Registration Status',    width: 150, format: 'enum',    options: ['initiated', 'pending_payment', 'paid', 'payment_failed', 'cancelled'] },
    { header: 'Payment Status',         width: 120, format: 'enum',    options: ['pending', 'paid', 'failed'] },
    { header: 'Amount',                 width:  90, format: 'currency' },
    { header: 'Event Name',             width: 220, format: 'text' },
    { header: 'Event Date',             width: 110, format: 'date' },
    { header: 'Venue Name',             width: 160, format: 'text' },
    { header: 'Venue Address',          width: 240, format: 'text', wrap: true },
    { header: 'Team Name',              width: 160, format: 'text' },
    { header: 'First Name',             width: 110, format: 'text' },
    { header: 'Last Name',              width: 110, format: 'text' },
    { header: 'Full Name',              width: 160, format: 'text' },
    { header: 'Email',                  width: 220, format: 'text' },
    { header: 'Phone',                  width: 130, format: 'text' },
    { header: 'Company / Organization', width: 200, format: 'text' },
    { header: 'Player Count',           width:  80, format: 'number' },
    { header: 'Player 1',               width: 140, format: 'text' },
    { header: 'Player 2',               width: 140, format: 'text' },
    { header: 'Player 3',               width: 140, format: 'text' },
    { header: 'Player 4',               width: 140, format: 'text' },
    { header: 'Handicap 1',             width:  80, format: 'text' },
    { header: 'Handicap 2',             width:  80, format: 'text' },
    { header: 'Handicap 3',             width:  80, format: 'text' },
    { header: 'Handicap 4',             width:  80, format: 'text' },
    { header: 'Preferred Partners',     width: 200, format: 'text', wrap: true },
    { header: 'Sponsor Interest',       width: 100, format: 'checkbox' },
    { header: 'BBQ Choice 1',           width: 140, format: 'text' },
    { header: 'BBQ Choice 2',           width: 140, format: 'text' },
    { header: 'BBQ Choice 3',           width: 140, format: 'text' },
    { header: 'BBQ Choice 4',           width: 140, format: 'text' },
    { header: 'Notes',                  width: 280, format: 'text', wrap: true },
    { header: 'Terms Accepted',         width: 100, format: 'checkbox' },
    { header: 'Source Page',            width: 120, format: 'text' },
  ],
};

const AUDIT_LOG = {
  title: 'Audit_Log',
  columns: [
    { header: 'Log ID',        width: 140, format: 'text' },
    { header: 'Timestamp',     width: 170, format: 'datetime' },
    { header: 'Action Type',   width: 180, format: 'text' },
    { header: 'Submission ID', width: 160, format: 'text' },
    { header: 'Result',        width: 100, format: 'enum', options: ['success', 'failure'] },
    { header: 'Details',       width: 400, format: 'text', wrap: true },
  ],
};

const TABS = [REGISTRATIONS, AUDIT_LOG];

// NorTex gold #c3a96a → RGB 0-1
const GOLD = { red: 195 / 255, green: 169 / 255, blue: 106 / 255 };
const WHITE = { red: 1, green: 1, blue: 1 };
const BANDING_LIGHT = { red: 0.96, green: 0.96, blue: 0.96 };

// ── CLI parsing ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const deleteExisting = args.includes('--delete-existing-rows');
const positional = args.filter(a => !a.startsWith('--'));
const [keyFilePath, spreadsheetId] = positional;

if (!keyFilePath || !spreadsheetId) {
  console.error('\nUsage: node setup-google-sheets.js <key.json> <SPREADSHEET_ID> [--delete-existing-rows]\n');
  process.exit(1);
}
if (!fs.existsSync(keyFilePath)) {
  console.error(`\nKey file not found: ${keyFilePath}\n`);
  process.exit(1);
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, a => { rl.close(); resolve(a.trim()); }));
}

// ── Format helpers ────────────────────────────────────────────────────────────
function numberFormatForColumn(col) {
  switch (col.format) {
    case 'datetime': return { type: 'DATE_TIME', pattern: 'yyyy-mm-dd hh:mm:ss' };
    case 'date':     return { type: 'DATE',      pattern: 'yyyy-mm-dd' };
    case 'currency': return { type: 'CURRENCY',  pattern: '"$"#,##0' };
    case 'number':   return { type: 'NUMBER',    pattern: '0' };
    default:         return null;
  }
}

function columnLetter(index) {
  // 0 → A, 25 → Z, 26 → AA, ...
  let s = '';
  let n = index;
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

  console.log('\n🔐  Authenticating as', credentials.client_email);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // ── Inspect current state ─────────────────────────────────────────────────
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existingByTitle = Object.fromEntries(
    meta.data.sheets.map(s => [s.properties.title, s.properties])
  );
  console.log('📊  Existing tabs:', Object.keys(existingByTitle).join(', '));

  // ── Reconcile tabs: ensure Registrations + Audit_Log exist, drop anything else ─
  const wantedTitles = new Set(TABS.map(t => t.title));
  const requests = [];

  // Rename the first sheet to Registrations if nothing is named that yet
  if (!existingByTitle['Registrations']) {
    const firstSheet = meta.data.sheets[0].properties;
    requests.push({
      updateSheetProperties: {
        properties: { sheetId: firstSheet.sheetId, title: 'Registrations' },
        fields: 'title',
      },
    });
    existingByTitle['Registrations'] = { ...firstSheet, title: 'Registrations' };
    delete existingByTitle[firstSheet.title];
  }

  // Add Audit_Log if missing
  if (!existingByTitle['Audit_Log']) {
    requests.push({ addSheet: { properties: { title: 'Audit_Log' } } });
  }

  // Delete extraneous tabs (e.g., old Payments, Sheet2, etc.)
  for (const [title, props] of Object.entries(existingByTitle)) {
    if (!wantedTitles.has(title)) {
      console.log(`🗑️   Removing old tab: ${title}`);
      requests.push({ deleteSheet: { sheetId: props.sheetId } });
    }
  }

  if (requests.length > 0) {
    const result = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
    for (const reply of result.data.replies || []) {
      if (reply.addSheet) {
        existingByTitle[reply.addSheet.properties.title] = reply.addSheet.properties;
      }
    }
  }

  // Refresh after structural changes
  const meta2 = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetIdByTitle = Object.fromEntries(
    meta2.data.sheets.map(s => [s.properties.title, s.properties.sheetId])
  );

  // Remove any pre-existing alternating-color banding so re-runs don't collide
  const existingBandings = meta2.data.sheets.flatMap(s => s.bandedRanges || []);
  if (existingBandings.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: existingBandings.map(b => ({ deleteBanding: { bandedRangeId: b.bandedRangeId } })),
      },
    });
  }

  // ── Destructive wipe (gated) ──────────────────────────────────────────────
  if (deleteExisting) {
    const ans = await prompt(
      '\n⚠️   --delete-existing-rows will DELETE all data rows from Registrations and Audit_Log.\n    Type "yes" to proceed: '
    );
    if (ans.toLowerCase() !== 'yes') {
      console.log('❌  Aborted. No rows deleted.');
      process.exit(1);
    }
    // Clear values, strip any lingering data validation, and shrink row count
    // back to a clean default so appended rows start at row 2.
    const resetRequests = [];
    for (const tab of TABS) {
      const sid = sheetIdByTitle[tab.title];
      resetRequests.push({
        setDataValidation: {
          range: { sheetId: sid, startRowIndex: 1 },
          // rule omitted → clears all existing validation in that range
        },
      });
      resetRequests.push({
        updateSheetProperties: {
          properties: { sheetId: sid, gridProperties: { rowCount: 100, columnCount: tab.columns.length + 2 } },
          fields: 'gridProperties.rowCount,gridProperties.columnCount',
        },
      });
    }
    await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: resetRequests } });
    await sheets.spreadsheets.values.batchClear({
      spreadsheetId,
      requestBody: { ranges: TABS.map(t => `${t.title}!A2:ZZ`) },
    });
    console.log('🧹  Cleared data + validation, shrunk sheet to 100 rows.');
  }

  // ── Write headers ─────────────────────────────────────────────────────────
  console.log('📝  Writing headers...');
  const data = TABS.map(tab => ({
    range: `${tab.title}!A1`,
    values: [tab.columns.map(c => c.header)],
  }));
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: { valueInputOption: 'RAW', data },
  });

  // ── Apply formatting ──────────────────────────────────────────────────────
  console.log('🎨  Applying formatting (widths, formats, validation, banding)...');

  const formatRequests = [];

  for (const tab of TABS) {
    const sid = sheetIdByTitle[tab.title];

    // Header styling + freeze + horizontal center
    formatRequests.push({
      repeatCell: {
        range: { sheetId: sid, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: tab.columns.length },
        cell: {
          userEnteredFormat: {
            backgroundColor: GOLD,
            textFormat: { foregroundColor: WHITE, bold: true, fontSize: 11 },
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)',
      },
    });
    formatRequests.push({
      updateSheetProperties: {
        properties: { sheetId: sid, gridProperties: { frozenRowCount: 1 } },
        fields: 'gridProperties.frozenRowCount',
      },
    });

    // Per-column width + number format + wrap
    tab.columns.forEach((col, i) => {
      formatRequests.push({
        updateDimensionProperties: {
          range: { sheetId: sid, dimension: 'COLUMNS', startIndex: i, endIndex: i + 1 },
          properties: { pixelSize: col.width },
          fields: 'pixelSize',
        },
      });

      const nf = numberFormatForColumn(col);
      if (nf || col.wrap) {
        const userEnteredFormat = {};
        const fields = [];
        if (nf) {
          userEnteredFormat.numberFormat = nf;
          fields.push('numberFormat');
        }
        if (col.wrap) {
          userEnteredFormat.wrapStrategy = 'WRAP';
          fields.push('wrapStrategy');
        }
        formatRequests.push({
          repeatCell: {
            range: { sheetId: sid, startRowIndex: 1, startColumnIndex: i, endColumnIndex: i + 1 },
            cell: { userEnteredFormat },
            fields: `userEnteredFormat(${fields.join(',')})`,
          },
        });
      }

      // Data validation for enums
      if (col.format === 'enum') {
        formatRequests.push({
          setDataValidation: {
            range: { sheetId: sid, startRowIndex: 1, startColumnIndex: i, endColumnIndex: i + 1 },
            rule: {
              condition: {
                type: 'ONE_OF_LIST',
                values: col.options.map(v => ({ userEnteredValue: v })),
              },
              showCustomUi: true,
              strict: false,
            },
          },
        });
      }

      // Dropdown for booleans (BOOLEAN condition auto-fills FALSE into every
      // empty cell, which pushes appended rows past row 1000. Use a plain
      // ONE_OF_LIST with 'true'/'false' instead — same UX, no phantom rows.)
      if (col.format === 'checkbox') {
        formatRequests.push({
          setDataValidation: {
            range: { sheetId: sid, startRowIndex: 1, startColumnIndex: i, endColumnIndex: i + 1 },
            rule: {
              condition: {
                type: 'ONE_OF_LIST',
                values: [
                  { userEnteredValue: 'true' },
                  { userEnteredValue: 'false' },
                ],
              },
              showCustomUi: true,
              strict: false,
            },
          },
        });
      }
    });

    // Alternating row banding
    formatRequests.push({
      addBanding: {
        bandedRange: {
          range: { sheetId: sid, startRowIndex: 0, startColumnIndex: 0, endColumnIndex: tab.columns.length },
          rowProperties: {
            headerColor: GOLD,
            firstBandColor: WHITE,
            secondBandColor: BANDING_LIGHT,
          },
        },
      },
    });
  }

  // Chunk to avoid giant payloads
  for (let i = 0; i < formatRequests.length; i += 100) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: formatRequests.slice(i, i + 100) },
    });
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(65));
  console.log('✅  SETUP COMPLETE');
  console.log('═'.repeat(65));
  console.log(`\n📋  https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit\n`);
  console.log('🔑  Mirror these into Netlify (Site config → Environment variables):\n');
  console.log(`GOOGLE_SERVICE_ACCOUNT_EMAIL=${credentials.client_email}`);
  console.log(`GOOGLE_SPREADSHEET_ID=${spreadsheetId}`);
  console.log('\nFor GOOGLE_PRIVATE_KEY — paste the entire block below, including BEGIN/END:\n');
  console.log(credentials.private_key);
  console.log('─'.repeat(65));
}

main().catch(err => {
  console.error('\n❌  Error:', err.message || err);
  if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  process.exit(1);
});
