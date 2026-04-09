'use client';

import React, { useState } from 'react';

interface PaymentStepProps {
  submissionId: string;
  amount: number;
  registrationType: 'individual' | 'team';
  customerEmail?: string;
}

export function PaymentStep({ submissionId, amount, registrationType, customerEmail }: PaymentStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: submissionId,
          amount,
          registration_type: registrationType,
          customer_email: customerEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment session');
      }

      // Redirect to Stripe hosted checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment setup failed');
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200 text-center">
      <div className="mb-6">
        <div className="text-5xl mb-4">💳</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h3>
        <p className="text-gray-500">You&apos;ll be redirected to Stripe&apos;s secure payment page</p>
      </div>

      <div className="bg-primary-50 rounded-2xl p-6 mb-6 ring-1 ring-primary-100">
        <div className="text-4xl font-bold text-gray-900 mb-1">${amount}</div>
        <div className="text-gray-700 font-medium">
          {registrationType === 'individual' ? 'Individual Registration' : 'Team Registration (4 Players)'}
        </div>
        <div className="text-sm text-gray-500 mt-1">Rockwood Park Charity Golf Tournament · June 20, 2026</div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 rounded-xl p-4 mb-4 text-sm font-medium">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full px-6 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary-500/20"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            Redirecting to Stripe...
          </span>
        ) : (
          `Pay $${amount} Securely →`
        )}
      </button>

      <div className="mt-5 text-sm text-gray-500 space-y-1">
        <p>🔒 256-bit SSL encrypted · Powered by Stripe</p>
        <p>💳 Visa · Mastercard · Amex · Apple Pay · Google Pay</p>
        <p>📧 Receipt emailed to you automatically</p>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Registration ID: {submissionId}
      </div>
    </div>
  );
}
