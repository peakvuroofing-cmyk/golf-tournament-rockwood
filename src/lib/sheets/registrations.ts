import { RegistrationData } from '@/types';
import { config } from '@/lib/config';
import { appendRowsToSheet, findRowByValue, updateRowInSheet } from './client';
import { registrationToSheetRow } from '@/lib/utils/normalize-data';

/**
 * Add a new registration to the Registrations sheet
 */
export async function addRegistration(registration: RegistrationData): Promise<void> {
  const row = registrationToSheetRow(registration);
  await appendRowsToSheet(
    config.google.spreadsheetId,
    'Registrations!A:AK', // Columns A to AK (37 columns)
    [row]
  );
}

/**
 * Update registration status
 */
export async function updateRegistrationStatus(
  submissionId: string,
  status: RegistrationData['registration_status'],
  paymentStatus: RegistrationData['payment_status'],
  stripeSessionId?: string
): Promise<void> {
  // Find the row by submission_id (column 0)
  const result = await findRowByValue(
    config.google.spreadsheetId,
    'Registrations',
    0, // submission_id column
    submissionId
  );

  if (!result) {
    throw new Error(`Registration not found: ${submissionId}`);
  }

  const { rowIndex } = result;
  // Update columns C (updated_at), E (registration_status), F (payment_status)
  // Write updated_at in col C, skip D (registration_type), update E and F
  const now = new Date().toISOString();

  // Update registration_status (col E) and payment_status (col F)
  const statusRange = `Registrations!E${rowIndex + 1}:F${rowIndex + 1}`;
  await updateRowInSheet(config.google.spreadsheetId, statusRange, [[status, paymentStatus]]);

  // Update updated_at (col C)
  const updatedAtRange = `Registrations!C${rowIndex + 1}`;
  await updateRowInSheet(config.google.spreadsheetId, updatedAtRange, [[now]]);

  // Update stripe_session_id (col AK) if provided
  if (stripeSessionId) {
    const sessionRange = `Registrations!AK${rowIndex + 1}`;
    await updateRowInSheet(config.google.spreadsheetId, sessionRange, [[stripeSessionId]]);
  }
}

/**
 * Check if email already exists (prevent duplicates)
 */
export async function checkDuplicateEmail(email: string): Promise<boolean> {
  const result = await findRowByValue(
    config.google.spreadsheetId,
    'Registrations',
    15, // contact_email column
    email
  );

  return result !== null;
}

/**
 * Get registration by submission ID
 */
export async function getRegistrationById(submissionId: string): Promise<RegistrationData | null> {
  const result = await findRowByValue(
    config.google.spreadsheetId,
    'Registrations',
    0, // submission_id column
    submissionId
  );

  if (!result) {
    return null;
  }

  const { rowData } = result;

  // Convert sheet row back to RegistrationData
  return {
    submission_id: rowData[0],
    created_at: rowData[1],
    updated_at: rowData[2],
    registration_type: rowData[3] as 'individual' | 'team',
    registration_status: rowData[4] as RegistrationData['registration_status'],
    payment_status: rowData[5] as RegistrationData['payment_status'],
    payment_amount: parseInt(rowData[6]),
    event_name: rowData[7],
    event_date: rowData[8],
    venue_name: rowData[9],
    venue_address: rowData[10],
    team_name: rowData[11] || undefined,
    contact_first_name: rowData[12],
    contact_last_name: rowData[13],
    contact_full_name: rowData[14],
    contact_email: rowData[15],
    contact_phone: rowData[16],
    company_or_organization: rowData[17] || undefined,
    player_count: parseInt(rowData[18]),
    player_1_name: rowData[19],
    player_2_name: rowData[20] || undefined,
    player_3_name: rowData[21] || undefined,
    player_4_name: rowData[22] || undefined,
    handicap_1: rowData[23] || undefined,
    handicap_2: rowData[24] || undefined,
    handicap_3: rowData[25] || undefined,
    handicap_4: rowData[26] || undefined,
    preferred_playing_partners: rowData[27] || undefined,
    sponsorship_interest: rowData[28] === 'true',
    bbq_choice_1: rowData[29] || undefined,
    bbq_choice_2: rowData[30] || undefined,
    bbq_choice_3: rowData[31] || undefined,
    bbq_choice_4: rowData[32] || undefined,
    notes: rowData[33] || undefined,
    terms_accepted: rowData[34] === 'true',
    source_page: rowData[35],
    stripe_session_id: rowData[36] || undefined,
  };
}