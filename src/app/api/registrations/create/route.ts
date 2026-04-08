import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createRegistrationSchema } from '@/lib/validation/schemas';
import { normalizeIndividualData, normalizeTeamData } from '@/lib/utils/normalize-data';
import { addRegistration, checkDuplicateEmail } from '@/lib/sheets/registrations';
import { logRegistrationSubmission } from '@/lib/sheets/audit-log';
import { sanitizeFormData } from '@/lib/utils/sanitize';
import { validateConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    // Validate configuration
    validateConfig();

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createRegistrationSchema.parse(body);

    // Sanitize form data
    const sanitizedData = sanitizeFormData(validatedData.form_data);

    // Check for duplicate email
    const email = validatedData.registration_type === 'individual'
      ? (sanitizedData as any).email
      : (sanitizedData as any).contact_email;

    const isDuplicate = await checkDuplicateEmail(email);
    if (isDuplicate) {
      await logRegistrationSubmission(
        'duplicate-check',
        validatedData.registration_type,
        'failure',
        `Duplicate email detected: ${email}`
      );

      return NextResponse.json(
        { success: false, error: 'This email address has already been registered.' },
        { status: 409 }
      );
    }

    // Normalize data based on registration type
    let registrationData;
    if (validatedData.registration_type === 'individual') {
      registrationData = normalizeIndividualData(sanitizedData as any);
    } else {
      registrationData = normalizeTeamData(sanitizedData as any);
    }

    // Add timestamps
    const now = new Date().toISOString();
    const fullRegistration = {
      ...registrationData,
      created_at: now,
      updated_at: now,
    };

    // Save to Google Sheets
    await addRegistration(fullRegistration);

    // Log successful registration
    await logRegistrationSubmission(
      fullRegistration.submission_id,
      validatedData.registration_type,
      'success',
      `Registration created for ${email}`
    );

    return NextResponse.json({
      success: true,
      submission_id: fullRegistration.submission_id,
    });

  } catch (error) {
    console.error('Registration creation error:', error);

    // Log failure
    try {
      await logRegistrationSubmission(
        'error-handling',
        'individual', // fallback since we don't know the type in error case
        'failure',
        `Registration creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}