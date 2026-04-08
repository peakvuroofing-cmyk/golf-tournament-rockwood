import { createLinkToken, exchangePublicToken, createTransfer, getTransferStatus } from './client';
import { addPaymentRecord, updatePaymentStatus } from '@/lib/sheets/payments';
import { updateRegistrationStatus } from '@/lib/sheets/registrations';
import { logPaymentAction } from '@/lib/sheets/audit-log';
import { generatePaymentId } from '@/lib/utils/id-generator';
import { PaymentData, RegistrationData } from '@/types';

/**
 * Create a Plaid Link token for payment initiation
 */
export async function createPaymentLinkToken(submissionId: string): Promise<string> {
  try {
    const linkToken = await createLinkToken(submissionId);

    await logPaymentAction(
      submissionId,
      'link_token_created',
      'success',
      `Link token created for submission ${submissionId}`
    );

    return linkToken;
  } catch (error) {
    await logPaymentAction(
      submissionId,
      'link_token_creation_failed',
      'failure',
      `Failed to create link token: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    throw error;
  }
}

/**
 * Handle Plaid token exchange and initiate payment
 */
export async function handlePaymentExchangeAndInitiate(
  publicToken: string,
  submissionId: string,
  registration: RegistrationData
): Promise<{ paymentId: string; status: string }> {
  try {
    // Exchange public token for access token
    const { accessToken, itemId } = await exchangePublicToken(publicToken);

    // Get account ID from the item (this is simplified - in real app you'd store and retrieve)
    // For now, we'll assume we get the account ID from Plaid's auth product
    const client = (await import('./client')).getPlaidClient();
    const authResponse = await client.authGet({
      access_token: accessToken,
    });

    const accountId = authResponse.data.accounts[0].account_id;
    const accountMask = authResponse.data.accounts[0].mask;

    // Create payment record
    const paymentId = generatePaymentId();
    const payment: PaymentData = {
      payment_id: paymentId,
      submission_id: submissionId,
      created_at: new Date().toISOString(),
      payment_provider: 'plaid',
      payment_method: 'ach',
      amount: registration.payment_amount,
      currency: 'USD',
      plaid_access_reference: itemId,
      payment_status: 'pending',
    };

    await addPaymentRecord(payment);

    // Initiate transfer
    const { transferId, status } = await createTransfer(
      accessToken,
      accountId,
      registration.payment_amount,
      `Rockwood Golf Tournament - ${registration.registration_type}`,
      registration.contact_full_name
    );

    // Update payment with transfer ID
    payment.plaid_transfer_id = transferId;
    await updatePaymentStatus(paymentId, 'pending', `Transfer initiated: ${transferId}`);

    // Update registration with payment reference
    await updateRegistrationStatus(
      submissionId,
      'pending_payment',
      'pending',
      transferId,
      status
    );

    await logPaymentAction(
      submissionId,
      'payment_initiated',
      'success',
      `Payment initiated with transfer ID ${transferId}, amount $${registration.payment_amount}`
    );

    return { paymentId, status };
  } catch (error) {
    await logPaymentAction(
      submissionId,
      'payment_initiation_failed',
      'failure',
      `Failed to initiate payment: ${error instanceof Error ? error.message : 'Unknown error'}`
    );

    // Update registration status to failed
    await updateRegistrationStatus(submissionId, 'payment_failed', 'failed');

    throw error;
  }
}

/**
 * Check payment status (for polling or webhook handling)
 */
export async function checkPaymentStatus(transferId: string): Promise<string> {
  try {
    const status = await getTransferStatus(transferId);
    return status;
  } catch (error) {
    console.error('Failed to check payment status:', error);
    throw error;
  }
}