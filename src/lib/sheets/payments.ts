import { PaymentData } from '@/types';
import { config } from '@/lib/config';
import { appendRowsToSheet, updateRowInSheet, findRowByValue } from './client';

/**
 * Add a payment record to the Payments sheet
 */
export async function addPaymentRecord(payment: PaymentData): Promise<void> {
  const row = [
    payment.payment_id,
    payment.submission_id,
    payment.created_at,
    payment.payment_provider,
    payment.payment_method,
    payment.amount.toString(),
    payment.currency,
    payment.plaid_transfer_id || '',
    payment.plaid_access_reference || '',
    payment.payment_status,
    payment.raw_response_summary || '',
    payment.failure_reason || '',
  ];

  await appendRowsToSheet(
    config.google.spreadsheetId,
    'Payments!A:L', // Columns A to L (12 columns)
    [row]
  );
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentData['payment_status'],
  rawResponseSummary?: string,
  failureReason?: string
): Promise<void> {
  // Find the row by payment_id (column 0)
  const result = await findRowByValue(
    config.google.spreadsheetId,
    'Payments',
    0, // payment_id column
    paymentId
  );

  if (!result) {
    throw new Error(`Payment not found: ${paymentId}`);
  }

  const { rowIndex } = result;
  const range = `Payments!J${rowIndex + 1}:L${rowIndex + 1}`; // payment_status, raw_response_summary, failure_reason columns

  const values = [[
    status,
    rawResponseSummary || '',
    failureReason || '',
  ]];

  await updateRowInSheet(config.google.spreadsheetId, range, values);
}

/**
 * Get payment by payment ID
 */
export async function getPaymentById(paymentId: string): Promise<PaymentData | null> {
  const result = await findRowByValue(
    config.google.spreadsheetId,
    'Payments',
    0, // payment_id column
    paymentId
  );

  if (!result) {
    return null;
  }

  const { rowData } = result;

  return {
    payment_id: rowData[0],
    submission_id: rowData[1],
    created_at: rowData[2],
    payment_provider: rowData[3] as 'plaid',
    payment_method: rowData[4] as 'ach',
    amount: parseInt(rowData[5]),
    currency: rowData[6] as 'USD',
    plaid_transfer_id: rowData[7] || undefined,
    plaid_access_reference: rowData[8] || undefined,
    payment_status: rowData[9] as PaymentData['payment_status'],
    raw_response_summary: rowData[10] || undefined,
    failure_reason: rowData[11] || undefined,
  };
}

/**
 * Get payments by submission ID
 */
export async function getPaymentsBySubmissionId(submissionId: string): Promise<PaymentData[]> {
  // This would require getting all rows and filtering, but for simplicity we'll implement a basic version
  // In a real app, you might want to add an index or use a database
  const allPayments = await getAllPayments();
  return allPayments.filter(payment => payment.submission_id === submissionId);
}

/**
 * Get all payments (for admin purposes)
 */
export async function getAllPayments(): Promise<PaymentData[]> {
  // Implementation would get all rows from Payments sheet
  // For now, return empty array as this is mainly for admin use
  return [];
}