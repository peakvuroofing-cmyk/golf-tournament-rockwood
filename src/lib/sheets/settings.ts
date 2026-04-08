import { config } from '@/lib/config';
import { findRowByValue, updateRowInSheet } from './client';

/**
 * Get a setting value by key
 */
export async function getSetting(key: string): Promise<string | null> {
  const result = await findRowByValue(
    config.google.spreadsheetId,
    'Settings',
    0, // key column
    key
  );

  return result ? result.rowData[1] : null;
}

/**
 * Update a setting value
 */
export async function updateSetting(key: string, value: string): Promise<void> {
  const result = await findRowByValue(
    config.google.spreadsheetId,
    'Settings',
    0, // key column
    key
  );

  if (!result) {
    throw new Error(`Setting not found: ${key}`);
  }

  const { rowIndex } = result;
  const range = `Settings!B${rowIndex + 1}`; // value column

  await updateRowInSheet(config.google.spreadsheetId, range, [[value]]);
}

/**
 * Get all settings as an object
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  // This would require getting all rows from Settings sheet
  // For now, return default values
  return {
    event_name: config.event.name,
    event_date: config.event.date,
    venue_name: config.event.venueName,
    venue_address: config.event.venueAddress,
    individual_price: config.event.individualPrice.toString(),
    team_price: config.event.teamPrice.toString(),
    registration_open: 'true',
    max_teams: '50',
    max_individuals: '100',
  };
}