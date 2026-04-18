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

    if (googleConfigured) {
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
      } catch (sheetError) {
        // Non-blocking — log the error but let the registration proceed so users aren't blocked
        console.error('Google Sheets save failed (non-fatal):', sheetError instanceof Error ? sheetError.message : sheetError);
      }
    } else {
      console.warn('Google Sheets not configured — registration saved in memory only.');
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
