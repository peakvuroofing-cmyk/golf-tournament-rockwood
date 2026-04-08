import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createLinkTokenSchema } from '@/lib/validation/schemas';
import { createPaymentLinkToken } from '@/lib/plaid/payment-service';
import { getRegistrationById } from '@/lib/sheets/registrations';
import { validateConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    // Validate configuration
    validateConfig();

    // Parse and validate request body
    const body = await request.json();
    const { submission_id } = createLinkTokenSchema.parse(body);

    // Verify registration exists
    const registration = await getRegistrationById(submission_id);
    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Check if already paid
    if (registration.payment_status === 'paid') {
      return NextResponse.json(
        { success: false, error: 'Registration is already paid' },
        { status: 409 }
      );
    }

    // Create Plaid Link token
    const linkToken = await createPaymentLinkToken(submission_id);

    return NextResponse.json({
      success: true,
      link_token: linkToken,
    });

  } catch (error) {
    console.error('Link token creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}