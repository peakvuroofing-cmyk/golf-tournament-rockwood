import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createRegistrationSchema } from '@/lib/validation/schemas';
import { normalizeIndividualData, normalizeTeamData } from '@/lib/utils/normalize-data';
import { sanitizeFormData } from '@/lib/utils/sanitize';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createRegistrationSchema.parse(body);

    const sanitizedData = sanitizeFormData(validatedData.form_data);

    // Normalize data based on registration type
    let registrationData;
    if (validatedData.registration_type === 'individual') {
      registrationData = normalizeIndividualData(sanitizedData as any);
    } else {
      registrationData = normalizeTeamData(sanitizedData as any);
    }

    const now = new Date().toISOString();
    const fullRegistration = {
      ...registrationData,
      created_at: now,
      updated_at: now,
    };

    const googleConfigured =
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SPREADSHEET_ID;

    if (!googleConfigured) {
      console.error('Google Sheets configuration missing. Registration cannot be saved.');
      return NextResponse.json(
        {
          success: false,
          error: 'Google Sheets integration is not configured. Please check your environment variables.',
        },
        { status: 500 }
      );
    }

    try {
      const { addRegistration, checkDuplicateEmail } = await import('@/lib/sheets/registrations');
      const { logRegistrationSubmission } = await import('@/lib/sheets/audit-log');

      const email = validatedData.registration_type === 'individual'
        ? (sanitizedData as any).email
        : (sanitizedData as any).contact_email;

      const isDuplicate = await checkDuplicateEmail(email);
      if (isDuplicate) {
        return NextResponse.json(
          { success: false, error: 'This email address has already been registered.' },
          { status: 409 }
        );
      }

      await addRegistration(fullRegistration);
      await logRegistrationSubmission(
        fullRegistration.submission_id,
        validatedData.registration_type,
        'success',
        `Registration created for ${email}`
      );

      // Fire emails (non-blocking — failure here must not break the registration)
      try {
        const { sendEmail, isEmailConfigured } = await import('@/lib/email/client');
        const { buildOrderNotificationEmail, buildRegistrationConfirmationEmail } = await import('@/lib/email/templates');
        if (isEmailConfigured()) {
          // 1. Customer: "registration received — please complete payment"
          const customerEmail = buildRegistrationConfirmationEmail(fullRegistration);
          await sendEmail({ to: fullRegistration.contact_email, ...customerEmail });

          // 2. Admin: "new registration received"
          const adminAddr = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_FROM;
          if (adminAddr) {
            const notification = buildOrderNotificationEmail(fullRegistration);
            await sendEmail({ to: adminAddr, ...notification });
          }
        }
      } catch (notifyErr) {
        console.error('Email delivery failed (non-fatal):', notifyErr);
      }
    } catch (sheetError) {
      console.error('Google Sheets save failed:', sheetError);
      return NextResponse.json(
        {
          success: false,
          error: 'Registration could not be saved to Google Sheets. Please try again later.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      submission_id: fullRegistration.submission_id,
    });

  } catch (error) {
    console.error('Registration creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
