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
    payment.amount.toString(),
    payment.currency,
    payment.stripe_session_id || '',
    payment.payment_status,
  ];

  await appendRowsToSheet(
    config.google.spreadsheetId,
    'Payments!A:H', // Columns A to H (8 columns)
    [row]
  );
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentData['payment_status']
): Promise<void> {
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
  const range = `Payments!H${rowIndex + 1}`; // payment_status column

  await updateRowInSheet(config.google.spreadsheetId, range, [[status]]);
}
