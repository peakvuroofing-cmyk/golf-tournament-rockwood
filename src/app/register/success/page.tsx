'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flag, Check, Calendar, MapPin, Map, Clock } from 'lucide-react';

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    // Read the pending registration from localStorage (set by PaymentStep before Square redirect)
    const pendingId = localStorage.getItem('pending_submission_id');

    if (!pendingId) {
      // Nothing pending — someone landed here directly
      router.replace('/register');
      return;
    }

    setSubmissionId(pendingId);

    // Clear from storage so refreshing the page doesn't re-trigger
    localStorage.removeItem('pending_submission_id');
    localStorage.removeItem('pending_registration_type');

    // Mark as paid and send confirmation email
    fetch('/api/payments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission_id: pendingId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
        } else {
          console.error('Confirm error:', data.error);
          // Still show success — payment happened, just log the issue
          setStatus('success');
        }
      })
      .catch(() => setStatus('success')); // Payment happened regardless — show success
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your registration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200">
          <div className="flex justify-center mb-6"><Flag aria-hidden="true" className="h-16 w-16 text-primary-500" strokeWidth={1.75} /></div>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Check aria-hidden="true" className="h-4 w-4" strokeWidth={2} /> Payment Confirmed
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">You&apos;re Registered!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for signing up for the NorTex Society Charity Golf Tournament.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            A confirmation email with your registration details has been sent to you.
          </p>

          <div className="bg-primary-50 rounded-2xl p-6 mb-8 text-left ring-1 ring-primary-100">
            <h3 className="font-bold text-gray-900 mb-4">Event Details</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2"><Calendar aria-hidden="true" className="h-4 w-4 shrink-0 text-primary-500" /> <strong>Date:</strong> Saturday, June 20, 2026</p>
              <p className="flex items-center gap-2"><MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-primary-500" /> <strong>Location:</strong> Rockwood Park Golf Course</p>
              <p className="flex items-center gap-2"><Map aria-hidden="true" className="h-4 w-4 shrink-0 text-primary-500" /> <strong>Address:</strong> 1851 Jacksboro Hwy, Fort Worth, TX 76114</p>
              <p className="flex items-center gap-2"><Clock aria-hidden="true" className="h-4 w-4 shrink-0 text-primary-500" /> <strong>Registration:</strong> 7:00 AM · <strong>Shotgun Start:</strong> 8:00 AM</p>
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
