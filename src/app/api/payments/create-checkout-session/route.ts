import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripeClient } from '@/lib/stripe/client';
import { validateStripeConfig } from '@/lib/config';

const schema = z.object({
  submission_id: z.string(),
  amount: z.number().positive(),
  registration_type: z.enum(['individual', 'team']),
  customer_email: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  try {
    validateStripeConfig();

    const body = await request.json();
    const { submission_id, amount, registration_type, customer_email } = schema.parse(body);

    const stripe = getStripeClient();

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rockwoodgolftournament.netlify.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: registration_type === 'individual'
                ? 'Individual Golf Tournament Registration'
                : 'Team Golf Tournament Registration (4 Players)',
              description: 'Rockwood Park Charity Golf Tournament — Saturday, June 20, 2026',
            },
            unit_amount: amount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customer_email,
      metadata: {
        submission_id,
        registration_type,
      },
      success_url: `${baseUrl}/register/success?session_id={CHECKOUT_SESSION_ID}&submission_id=${submission_id}`,
      cancel_url: `${baseUrl}/register?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);

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
