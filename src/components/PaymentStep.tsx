'use client';

import React, { useState } from 'react';

const SQUARE_LINKS = {
  individual: 'https://square.link/u/BBm3kaNu?src=sheet',
  team: 'https://square.link/u/kdW42fA7?src=sheet',
};

interface PaymentStepProps {
  submissionId: string;
  amount: number;
  registrationType: 'individual' | 'team';
  customerEmail?: string;
}

export function PaymentStep({ submissionId, amount, registrationType }: PaymentStepProps) {
  const [loading, setLoading] = useState(false);
  const squareUrl = SQUARE_LINKS[registrationType];

  const handlePayment = () => {
    setLoading(true);
    window.location.href = squareUrl;
  };

  return (
    <div className="rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200 text-center">
      <div className="mb-6">
        <div className="text-5xl mb-4">💳</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h3>
        <p className="text-gray-500">You&apos;ll be redirected to our secure Square payment page</p>
      </div>

      <div className="bg-primary-50 rounded-2xl p-6 mb-6 ring-1 ring-primary-100">
        <div className="text-4xl font-bold text-gray-900 mb-1">${amount}</div>
        <div className="text-gray-700 font-medium">
          {registrationType === 'individual' ? 'Individual Registration' : 'Team Registration (4 Players)'}
        </div>
        <div className="text-sm text-gray-500 mt-1">Rockwood Park Charity Golf Tournament · June 20, 2026</div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full px-6 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary-500/20"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            Redirecting to Square...
          </span>
        ) : (
          `Pay $${amount} with Square →`
        )}
      </button>

      <div className="mt-5 text-sm text-gray-500 space-y-1">
        <p>🔒 Secure payment powered by Square</p>
        <p>💳 Visa · Mastercard · Amex · Apple Pay · Google Pay</p>
        <p>📧 Receipt emailed to you automatically</p>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Registration ID: {submissionId}
      </div>
    </div>
  );
}
