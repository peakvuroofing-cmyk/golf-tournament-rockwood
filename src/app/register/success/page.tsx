'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const submissionId = searchParams.get('submission_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      router.replace('/register');
      return;
    }

    // Verify the Stripe session
    fetch(`/api/payments/verify-session?session_id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.paid) {
          setCustomerEmail(data.customer_email);
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [sessionId, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Verification Issue</h1>
          <p className="text-gray-600 mb-6">
            We could not confirm your payment. If you were charged, please contact us — your registration may still be complete.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Reference: {submissionId || 'N/A'}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200">
          <div className="text-7xl mb-6">🏌️</div>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            ✓ Payment Confirmed
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">You&apos;re Registered!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for signing up for the NorTex Society Charity Golf Tournament.
          </p>
          {customerEmail && (
            <p className="text-gray-500 text-sm mb-6">
              A receipt has been sent to <strong>{customerEmail}</strong>
            </p>
          )}

          <div className="bg-primary-50 rounded-2xl p-6 mb-8 text-left ring-1 ring-primary-100">
            <h3 className="font-bold text-gray-900 mb-4">Event Details</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>📅 <strong>Date:</strong> Saturday, June 20, 2026</p>
              <p>📍 <strong>Location:</strong> Rockwood Park Golf Course</p>
              <p>🗺️ <strong>Address:</strong> 1851 Jacksboro Hwy, Fort Worth, TX 76114</p>
              <p>⏰ <strong>Registration:</strong> 7:00 AM · <strong>Shotgun Start:</strong> 8:00 AM</p>
            </div>
            {submissionId && (
              <p className="text-xs text-gray-400 mt-4">Registration ID: {submissionId}</p>
            )}
          </div>

          <Link
            href="/"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
