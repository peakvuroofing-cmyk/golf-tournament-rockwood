'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RegistrationTypeToggle } from '@/components/RegistrationTypeToggle';
import { IndividualForm } from '@/components/IndividualForm';
import { TeamForm } from '@/components/TeamForm';
import { PaymentStep } from '@/components/PaymentStep';
import { EventDetailsCard } from '@/components/EventDetailsCard';
import { PricingCard } from '@/components/PricingCard';
import { IndividualFormData, TeamFormData } from '@/types';
import { individualFormSchema, teamFormSchema } from '@/lib/validation/schemas';

type RegistrationStep = 'type' | 'form' | 'payment' | 'success' | 'error';

const registrationPhotos = [
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_3-af0227a75d1b128374c831ccf5126f75.jpg',
    alt: 'Lush Rockwood Park greens',
    caption: 'Tournament-ready greens',
  },
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_1-3ac51550fc0be35bf3991c34d54ac18b.jpg',
    alt: 'Rockwood Park fairway views',
    caption: 'Signature fairway vistas',
  },
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_4-02bfde1de46c48d52967485d3e836cf6.jpg',
    alt: 'Scenic course hole',
    caption: 'Scenic course holes',
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('type');
  const [registrationType, setRegistrationType] = useState<'individual' | 'team'>('individual');
  const [submissionId, setSubmissionId] = useState<string | null>(null);
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

  const parseJsonResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }
    const text = await response.text();
    throw new Error(
      `Unexpected API response${response.status ? ` (${response.status})` : ''}: ${text}`
    );
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

      const data = await parseJsonResponse(response);

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


  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-primary-600 via-secondary-600 to-navy p-10 shadow-2xl ring-1 ring-white/20 text-white mb-10">
              <p className="uppercase tracking-[0.25em] text-sm text-primary-200 mb-4">
                NorTex Society Golf Tournament
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold mb-4">Register for the Tournament</h1>
              <p className="text-lg text-primary-100 max-w-3xl mb-8">
                Join us Saturday, June 20, 2026 at Rockwood Park Golf Course for a memorable day of golf, BBQ, prizes, and community support.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm border border-white/10">
                  <p className="text-sm uppercase tracking-[0.2em] text-primary-200 mb-2">Format</p>
                  <p className="font-semibold text-xl">Shotgun Start</p>
                  <p className="mt-2 text-primary-100">7:00 AM Registration • 8:00 AM Tee Time</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm border border-white/10">
                  <p className="text-sm uppercase tracking-[0.2em] text-primary-200 mb-2">Lunch</p>
                  <p className="font-semibold text-xl">BBQ Lunch Included</p>
                  <p className="mt-2 text-primary-100">Chicken or sausage, potato salad, baked beans, and iced tea.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
              <RegistrationTypeToggle
                selectedType={registrationType}
                onTypeChange={handleTypeChange}
              />

              <div className="mt-8 text-center">
                <button
                  onClick={() => setCurrentStep('form')}
                  className="inline-flex items-center justify-center rounded-full bg-primary-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-700"
                >
                  Continue to Registration
                </button>
              </div>
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between rounded-3xl bg-gradient-to-r from-primary-600 via-secondary-600 to-navy p-8 text-white shadow-2xl ring-1 ring-white/10">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary-200 mb-2">Ready to register?</p>
                <h2 className="text-3xl font-semibold mb-2">Complete your entry</h2>
                <p className="text-primary-100 max-w-2xl">
                  Fill out the form and continue to payment. The course photos and event details are here to keep the experience premium.
                </p>
              </div>
              <button
                onClick={() => setCurrentStep('type')}
                className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20"
              >
                ← Change registration type
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              <div className="xl:col-span-3 space-y-6">
                {registrationPhotos.slice(0, 2).map((photo) => (
                  <div key={photo.src} className="overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-slate-200 bg-white">
                    <Image src={photo.src} alt={photo.alt} width={400} height={288} className="h-72 w-full object-cover" />
                    <div className="p-4 bg-gradient-to-t from-slate-950/80 to-transparent text-white">
                      <p className="text-sm font-semibold">{photo.caption}</p>
                    </div>
                  </div>
                ))}

                <div className="rounded-[2rem] bg-primary-50 p-6 shadow-2xl ring-1 ring-primary-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Tournament Highlights</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li>• 18 holes shotgun start</li>
                    <li>• BBQ lunch included</li>
                    <li>• Team and individual options</li>
                    <li>• Charity prizes and awards</li>
                  </ul>
                </div>
              </div>

              <div className="xl:col-span-6 rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {registrationType === 'individual' ? 'Individual Registration' : 'Team Registration'}
                </h3>

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

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
                  <button
                    onClick={() => setCurrentStep('type')}
                    className="px-6 py-3 rounded-full bg-slate-100 text-slate-900 font-medium hover:bg-slate-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFormSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Continue to Payment'}
                  </button>
                </div>
              </div>

              <div className="xl:col-span-3 space-y-6">
                <div className="overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-slate-200 bg-white">
                  <Image src={registrationPhotos[2].src} alt={registrationPhotos[2].alt} width={400} height={320} className="h-80 w-full object-cover" />
                  <div className="p-4 bg-gradient-to-t from-slate-950/80 to-transparent text-white">
                    <p className="text-sm font-semibold">{registrationPhotos[2].caption}</p>
                  </div>
                </div>
                <EventDetailsCard className="bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100" />
                <PricingCard className="bg-gradient-to-br from-secondary-50 to-primary-50 border border-secondary-100" />
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
                registrationType={registrationType}
                amount={registrationType === 'individual'
                  ? parseInt(process.env.NEXT_PUBLIC_INDIVIDUAL_PRICE || '135')
                  : parseInt(process.env.NEXT_PUBLIC_TEAM_PRICE || '500')
                }
                customerEmail={registrationType === 'individual' ? individualData.email : teamData.contact_email}
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
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderStepContent()}
      </div>
    </div>
  );
}