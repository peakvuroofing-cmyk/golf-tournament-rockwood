import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, isEmailConfigured } from '@/lib/email/client';
import { buildRegistrationConfirmationEmail } from '@/lib/email/templates';

export async function POST(request: NextRequest) {
  try {
    const { submission_id } = await request.json();

    if (!submission_id) {
      return NextResponse.json({ success: false, error: 'submission_id is required' }, { status: 400 });
    }

    // Look up the registration from Google Sheets
    const googleConfigured =
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SPREADSHEET_ID;

    if (!googleConfigured) {
      return NextResponse.json({ success: false, error: 'Google Sheets not configured' }, { status: 500 });
    }

    const { getRegistrationById, updateRegistrationStatus } = await import('@/lib/sheets/registrations');

    const registration = await getRegistrationById(submission_id);
    if (!registration) {
      return NextResponse.json({ success: false, error: 'Registration not found' }, { status: 404 });
    }

    // Mark as paid
    await updateRegistrationStatus(submission_id, 'paid', 'paid');

    // Send confirmation email
    if (isEmailConfigured()) {
      const { subject, html, text } = buildRegistrationConfirmationEmail(registration);
      await sendEmail({ to: registration.contact_email, subject, html, text });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Payment confirm error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
