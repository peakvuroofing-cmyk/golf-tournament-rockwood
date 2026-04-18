import { AuditLogEntry } from '@/types';
import { config } from '@/lib/config';
import { appendRowsToSheet } from './client';
import { generateLogId } from '@/lib/utils/id-generator';
import { formatDateTimeCST } from '@/lib/utils/format-date';

/**
 * Log an action to the Audit_Log sheet
 */
export async function logAction(
  actionType: string,
  result: 'success' | 'failure',
  details: string,
  submissionId?: string
): Promise<void> {
  const logEntry: AuditLogEntry = {
    log_id: generateLogId(),
    timestamp: formatDateTimeCST(new Date().toISOString()),
    action_type: actionType,
    submission_id: submissionId,
    result,
    details,
  };

  const row = [
    logEntry.log_id,
    logEntry.timestamp,
    logEntry.action_type,
    logEntry.submission_id || '',
    logEntry.result,
    logEntry.details,
  ];

  await appendRowsToSheet(
    config.google.spreadsheetId,
    'Audit_Log!A:F', // Columns A to F (6 columns)
    [row]
  );
}

/**
 * Log registration submission
 */
export async function logRegistrationSubmission(
  submissionId: string,
  registrationType: 'individual' | 'team',
  result: 'success' | 'failure',
  details: string
): Promise<void> {
  await logAction(
    `registration_${registrationType}`,
    result,
    details,
    submissionId
  );
}

/**
 * Log payment action
 */
export async function logPaymentAction(
  submissionId: string,
  action: string,
  result: 'success' | 'failure',
  details: string
): Promise<void> {
  await logAction(
    `payment_${action}`,
    result,
    details,
    submissionId
  );
}