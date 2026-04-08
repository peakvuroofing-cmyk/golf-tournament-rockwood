import { randomBytes } from 'crypto';

/**
 * Generate a unique submission ID for registrations
 * Format: SUB-{timestamp}-{random}
 */
export function generateSubmissionId(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(4).toString('hex');
  return `SUB-${timestamp}-${random}`.toUpperCase();
}

/**
 * Generate a unique payment ID for payments
 * Format: PAY-{timestamp}-{random}
 */
export function generatePaymentId(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(4).toString('hex');
  return `PAY-${timestamp}-${random}`.toUpperCase();
}

/**
 * Generate a unique log ID for audit entries
 * Format: LOG-{timestamp}-{random}
 */
export function generateLogId(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(4).toString('hex');
  return `LOG-${timestamp}-${random}`.toUpperCase();
}