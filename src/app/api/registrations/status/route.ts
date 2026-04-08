export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { registrationStatusSchema } from '@/lib/validation/schemas';
import { getRegistrationById } from '@/lib/sheets/registrations';
import { validateConfig } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    // Validate configuration
    validateConfig();

    // Get submission_id from query params using NextRequest API
    const submissionId = request.nextUrl.searchParams.get('submission_id');

    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: 'submission_id is required' },
        { status: 400 }
      );
    }

    // Validate submission_id
    registrationStatusSchema.parse({ submission_id: submissionId });

    // Get registration
    const registration = await getRegistrationById(submissionId);
    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      registration,
    });

  } catch (error) {
    console.error('Registration status error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid submission ID', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}