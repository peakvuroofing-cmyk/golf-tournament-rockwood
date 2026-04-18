import { google } from 'googleapis';
import { config } from '@/lib/config';

let sheetsInstance: any = null;

/**
 * Get or create Google Sheets API instance
 */
export async function getSheetsInstance() {
  if (sheetsInstance) {
    return sheetsInstance;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: config.google.serviceAccountEmail,
      private_key: config.google.privateKey.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheetsInstance = google.sheets({ version: 'v4', auth });
  return sheetsInstance;
}

/**
 * Append rows to a specific sheet
 */
export async function appendRowsToSheet(
  spreadsheetId: string,
  range: string,
  values: string[][]
): Promise<void> {
  const sheets = await getSheetsInstance();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values,
    },
  });
}

/**
 * Update a specific row in a sheet
 */
export async function updateRowInSheet(
  spreadsheetId: string,
  range: string,
  values: string[][]
): Promise<void> {
  const sheets = await getSheetsInstance();

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values,
    },
  });
}

/**
 * Find a row by value in a specific column
 */
export async function findRowByValue(
  spreadsheetId: string,
  sheetName: string,
  columnIndex: number,
  searchValue: string
): Promise<{ rowIndex: number; rowData: string[] } | null> {
  const sheets = await getSheetsInstance();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:Z`, // Get all columns
  });

  const rows = response.data.values || [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row[columnIndex] === searchValue) {
      return {
        rowIndex: i,
        rowData: row,
      };
    }
  }

  return null;
}

/**
 * Get all rows from a sheet
 */
export async function getAllRows(
  spreadsheetId: string,
  sheetName: string
): Promise<string[][]> {
  const sheets = await getSheetsInstance();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
  });

  return response.data.values || [];
}