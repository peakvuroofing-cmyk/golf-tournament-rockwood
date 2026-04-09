import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe/client';
import { validateStripeConfig } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    validateStripeConfig();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ paid: false, error: 'Missing session_id' }, { status: 400 });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      paid: session.payment_status === 'paid',
      customer_email: session.customer_email,
      submission_id: session.metadata?.submission_id,
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { paid: false, error: error instanceof Error ? error.message : 'Verification failed' },
      { status: 500 }
    );
  }
}
