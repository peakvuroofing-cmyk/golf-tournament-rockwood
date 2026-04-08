'use client';

import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

interface PaymentStepProps {
  submissionId: string;
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

export function PaymentStep({ submissionId, amount, onSuccess, onError }: PaymentStepProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch link token on mount
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await fetch('/api/payments/create-link-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ submission_id: submissionId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment link');
        }

        setLinkToken(data.link_token);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
        setError(errorMessage);
        onError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchLinkToken();
  }, [submissionId, onError]);

  // Plaid Link configuration
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
      try {
        // Exchange public token and initiate payment
        const response = await fetch('/api/payments/exchange-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_token: publicToken,
            submission_id: submissionId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Payment failed');
        }

        onSuccess(data.payment_id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
        setError(errorMessage);
        onError(errorMessage);
      }
    },
    onExit: (err, metadata) => {
      if (err) {
        const errorMessage = err.error_message || 'Payment cancelled';
        setError(errorMessage);
        onError(errorMessage);
      }
    },
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Initializing secure payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Error</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Payment</h3>
        <p className="text-gray-600">
          Secure bank account connection via Plaid
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="text-2xl font-bold text-gray-900 mb-2">
          ${amount}
        </div>
        <div className="text-gray-600">
          {submissionId.includes('TEAM') ? 'Team Registration' : 'Individual Registration'}
        </div>
      </div>

      <button
        onClick={() => open()}
        disabled={!ready}
        className="w-full max-w-md mx-auto px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {ready ? 'Connect Bank Account' : 'Loading...'}
      </button>

      <div className="mt-4 text-sm text-gray-500">
        <p>🔒 Your bank information is encrypted and secure</p>
        <p>💳 Only your registration fee will be charged</p>
      </div>
    </div>
  );
}