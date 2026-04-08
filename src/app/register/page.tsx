'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegistrationTypeToggle } from '@/components/RegistrationTypeToggle';
import { IndividualForm } from '@/components/IndividualForm';
import { TeamForm } from '@/components/TeamForm';
import { PaymentStep } from '@/components/PaymentStep';
import { EventDetailsCard } from '@/components/EventDetailsCard';
import { PricingCard } from '@/components/PricingCard';
import { IndividualFormData, TeamFormData } from '@/types';
import { individualFormSchema, teamFormSchema } from '@/lib/validation/schemas';

type RegistrationStep = 'type' | 'form' | 'payment' | 'success' | 'error';

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('type');
  const [registrationType, setRegistrationType] = useState<'individual' | 'team'>('individual');
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [individualData, setIndividualData] = useState<IndividualFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_or_organization: '',
    handicap: '',
    preferred_playing_partners: '',
    sponsorship_interest: false,
    bbq_choice: '',
    notes: '',
    terms_accepted: false,
  });

  const [teamData, setTeamData] = useState<TeamFormData>({
    team_name: '',
    contact_first_name: '',
    contact_last_name: '',
    contact_email: '',
    contact_phone: '',
    company_or_organization: '',
    player_1_name: '',
    player_2_name: '',
    player_3_name: '',
    player_4_name: '',
    handicap_1: '',
    handicap_2: '',
    handicap_3: '',
    handicap_4: '',
    sponsorship_interest: false,
    bbq_choice_1: '',
    bbq_choice_2: '',
    bbq_choice_3: '',
    bbq_choice_4: '',
    notes: '',
    terms_accepted: false,
  });

  // Form errors
  const [individualErrors, setIndividualErrors] = useState<Partial<Record<keyof IndividualFormData, string>>>({});
  const [teamErrors, setTeamErrors] = useState<Partial<Record<keyof TeamFormData, string>>>({});

  const handleTypeChange = (type: 'individual' | 'team') => {
    setRegistrationType(type);
    setError(null);
  };

  const handleIndividualChange = (field: keyof IndividualFormData, value: string | boolean) => {
    setIndividualData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (individualErrors[field]) {
      setIndividualErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTeamChange = (field: keyof TeamFormData, value: string | boolean) => {
    setTeamData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (teamErrors[field]) {
      setTeamErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleIndividualBlur = (field: keyof IndividualFormData) => {
    // Validate the entire form to get field-specific errors
    try {
      individualFormSchema.parse(individualData);
      setIndividualErrors({});
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        if (err.path[0] === field) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setIndividualErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  };

  const handleTeamBlur = (field: keyof TeamFormData) => {
    // Validate the entire form to get field-specific errors
    try {
      teamFormSchema.parse(teamData);
      setTeamErrors({});
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        if (err.path[0] === field) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setTeamErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  };

  const validateCurrentForm = (): boolean => {
    try {
      if (registrationType === 'individual') {
        individualFormSchema.parse(individualData);
        setIndividualErrors({});
        return true;
      } else {
        teamFormSchema.parse(teamData);
        setTeamErrors({});
        return true;
      }
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        fieldErrors[err.path[0]] = err.message;
      });

      if (registrationType === 'individual') {
        setIndividualErrors(fieldErrors);
      } else {
        setTeamErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleFormSubmit = async () => {
    if (!validateCurrentForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/registrations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration_type: registrationType,
          form_data: registrationType === 'individual' ? individualData : teamData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSubmissionId(data.submission_id);
      setCurrentStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setCurrentStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (newPaymentId: string) => {
    setPaymentId(newPaymentId);
    setCurrentStep('success');
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setCurrentStep('error');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Register for the Tournament</h1>
              <p className="text-gray-600">Choose your registration type to get started</p>
            </div>

            <RegistrationTypeToggle
              selectedType={registrationType}
              onTypeChange={handleTypeChange}
            />

            <div className="text-center">
              <button
                onClick={() => setCurrentStep('form')}
                className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
              >
                Continue to Registration
              </button>
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <button
                onClick={() => setCurrentStep('type')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to registration type
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {registrationType === 'individual' ? 'Individual Registration' : 'Team Registration'}
                </h2>

                {registrationType === 'individual' ? (
                  <IndividualForm
                    formData={individualData}
                    errors={individualErrors}
                    onChange={handleIndividualChange}
                    onBlur={handleIndividualBlur}
                  />
                ) : (
                  <TeamForm
                    formData={teamData}
                    errors={teamErrors}
                    onChange={handleTeamChange}
                    onBlur={handleTeamBlur}
                  />
                )}

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep('type')}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFormSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Continue to Payment'}
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <EventDetailsCard />
                <PricingCard />
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <button
                onClick={() => setCurrentStep('form')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to form
              </button>
            </div>

            {submissionId && (
              <PaymentStep
                submissionId={submissionId}
                amount={registrationType === 'individual'
                  ? parseInt(process.env.NEXT_PUBLIC_INDIVIDUAL_PRICE || '135')
                  : parseInt(process.env.NEXT_PUBLIC_TEAM_PRICE || '500')
                }
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}
          </div>
        );

      case 'success':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Complete!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for registering for the {process.env.NEXT_PUBLIC_EVENT_NAME}.
                Your payment has been processed successfully.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Registration Details</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Submission ID:</strong> {submissionId}</p>
                <p><strong>Payment ID:</strong> {paymentId}</p>
                <p><strong>Type:</strong> {registrationType === 'individual' ? 'Individual' : 'Team'}</p>
                <p><strong>Status:</strong> Paid</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                A confirmation email has been sent to your registered email address.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Return to Home
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-red-600 mb-4">
                <div className="text-6xl mb-4">❌</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Error</h1>
              </div>
              <p className="text-gray-600 mb-6">{error}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setCurrentStep('type');
                  setError(null);
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 mr-4"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Return to Home
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderStepContent()}
      </div>
    </div>
  );
}