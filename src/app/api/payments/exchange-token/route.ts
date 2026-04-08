import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { exchangeTokenSchema } from '@/lib/validation/schemas';
import { handlePaymentExchangeAndInitiate } from '@/lib/plaid/payment-service';
import { getRegistrationById } from '@/lib/sheets/registrations';
import { validateConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    // Validate configuration
    validateConfig();

    // Parse and validate request body
    const body = await request.json();
    const { public_token, submission_id } = exchangeTokenSchema.parse(body);

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

    // Handle token exchange and payment initiation
    const { paymentId, status } = await handlePaymentExchangeAndInitiate(
      public_token,
      submission_id,
      registration
    );

    return NextResponse.json({
      success: true,
      payment_id: paymentId,
      status,
    });

  } catch (error) {
    console.error('Token exchange error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}