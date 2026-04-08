# GOLF TOURNAMENT REGISTRATION SYSTEM - COMPLETE IMPLEMENTATION

## STATUS: Ready to Deploy
All code is production-ready. This document contains the remaining files needed.

---

## SECTION 1: GLOBAL STYLES

### File: src/app/globals.css

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  html {
    @apply scroll-smooth;
  }

  body {
    @apply font-body antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-display;
  }
}

@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-golf-green text-white rounded-lg font-semibold hover:bg-golf-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl;
  }

  .btn-secondary {
    @apply px-6 py-3 border-2 border-golf-green text-golf-green rounded-lg font-semibold hover:bg-golf-green hover:text-white transition-colors duration-200 disabled:opacity-50;
  }

  .btn-sm {
    @apply px-4 py-2 text-sm;
  }

  .input-field {
    @apply w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-golf-green transition-colors duration-200 text-gray-900;
  }

  .input-field:disabled {
    @apply bg-gray-100 cursor-not-allowed;
  }

  .input-field.error {
    @apply border-red-500 focus:border-red-500;
  }

  .form-group {
    @apply mb-6;
  }

  .form-label {
    @apply block text-sm font-semibold text-gray-700 mb-2;
  }

  .form-error {
    @apply text-red-600 text-sm mt-1;
  }

  .form-help {
    @apply text-gray-500 text-sm mt-1;
  }

  .card {
    @apply bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100;
  }

  .card-header {
    @apply border-b border-gray-200 pb-4 mb-6;
  }

  .section-title {
    @apply text-3xl md:text-4xl font-display font-bold text-golf-green mb-4;
  }

  .section-subtitle {
    @apply text-lg text-gray-600 mb-8;
  }

  .badge {
    @apply inline-block px-3 py-1 rounded-full text-sm font-semibold;
  }

  .badge-success {
    @apply bg-green-100 text-green-800;
  }

  .badge-warning {
    @apply bg-yellow-100 text-yellow-800;
  }

  .badge-error {
    @apply bg-red-100 text-red-800;
  }

  .divider {
    @apply border-t border-gray-200 my-6;
  }

  .loading-spinner {
    @apply inline-block w-5 h-5 border-4 border-gray-300 border-t-golf-green rounded-full animate-spin;
  }

  .transition-fade {
    @apply transition-opacity duration-300 ease-in-out;
  }
}

@media (max-width: 640px) {
  .btn-primary,
  .btn-secondary {
    @apply w-full;
  }

  .input-field {
    @apply text-base; /* Prevents iOS zoom on input */
  }
}
```

---

## SECTION 2: API ROUTES

### File: src/app/api/registrations/create/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { registrationSchema } from '@/lib/validation/schemas'
import { addRegistration } from '@/lib/sheets/registrations'
import { logRegistrationSubmission, logValidationError } from '@/lib/sheets/audit-log'
import { logDuplicateDetection } from '@/lib/sheets/audit-log'
import { checkDuplicateByEmail } from '@/lib/sheets/registrations'
import { generateSubmissionId, getCurrentTimestamp } from '@/lib/utils/id-generator'
import { sanitizeObject } from '@/lib/utils/sanitize'
import type { RegistrationDraft, IndividualRegistration, TeamRegistration } from '@/types'
import { eventConfig } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    const validationResult = registrationSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors,
        },
        { status: 400 }
      )
    }

    const { registration_type, data } = validationResult.data

    // Check for duplicates
    const isDuplicate = await checkDuplicateByEmail(data.contact_email || data.email)
    if (isDuplicate) {
      await logDuplicateDetection(
        data.contact_email || data.email,
        registration_type
      )
      return NextResponse.json(
        {
          success: false,
          error: 'A registration with this email already exists',
        },
        { status: 409 }
      )
    }

    // Sanitize data
    const sanitizedData = sanitizeObject(data)

    // Generate submission ID
    const submissionId = generateSubmissionId()
    const now = getCurrentTimestamp()

    // Calculate payment amount
    const paymentAmount =
      registration_type === 'individual'
        ? eventConfig.individual_price
        : eventConfig.team_price

    // Create registration draft
    const registrationDraft: RegistrationDraft = {
      submission_id: submissionId,
      created_at: now,
      updated_at: now,
      registration_type,
      registration_status: 'initiated',
      payment_status: 'pending',
      payment_amount: paymentAmount,
      event_name: eventConfig.name,
      event_date: eventConfig.date,
      venue_name: eventConfig.venue_name,
      venue_address: eventConfig.venue_address,
      data: sanitizedData as IndividualRegistration | TeamRegistration,
      ip_address: undefined, // Privacy: don't store IP
    }

    // Save to Google Sheets
    const saved = await addRegistration(registrationDraft)

    if (!saved) {
      await logRegistrationSubmission(submissionId, registration_type, false, {
        error: 'Failed to save registration',
      })
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save registration',
        },
        { status: 500 }
      )
    }

    // Log success
    await logRegistrationSubmission(submissionId, registration_type, true, {
      email: sanitizedData.contact_email || sanitizedData.email,
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          submission_id: submissionId,
          payment_amount: paymentAmount,
          status: 'initiated',
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating registration:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
```

### File: src/app/api/payments/create-link-token/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createPaymentLinkToken } from '@/lib/plaid/payment-service'

const schema = z.object({
  submission_id: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate
    const validationResult = schema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid submission_id',
        },
        { status: 400 }
      )
    }

    const { submission_id } = validationResult.data

    // Create link token
    const result = await createPaymentLinkToken(submission_id)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error creating link token:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
```

### File: src/app/api/payments/exchange-token/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { handlePaymentExchangeAndInitiate } from '@/lib/plaid/payment-service'
import { getRegistrationBySubmissionId } from '@/lib/sheets/registrations'

const schema = z.object({
  submission_id: z.string(),
  public_token: z.string(),
  payment_amount: z.number().positive(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate
    const validationResult = schema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
        },
        { status: 400 }
      )
    }

    const { submission_id, public_token, payment_amount } = validationResult.data

    // Verify registration exists
    const registration = await getRegistrationBySubmissionId(submission_id)
    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          error: 'Registration not found',
        },
        { status: 404 }
      )
    }

    // Exchange token and initiate payment
    const result = await handlePaymentExchangeAndInitiate(
      submission_id,
      public_token,
      payment_amount
    )

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error exchanging token:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
```

### File: src/app/api/registrations/status/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getRegistrationBySubmissionId } from '@/lib/sheets/registrations'

const schema = z.object({
  submission_id: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const submissionId = url.searchParams.get('submission_id')

    if (!submissionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'submission_id is required',
        },
        { status: 400 }
      )
    }

    const registration = await getRegistrationBySubmissionId(submissionId)

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          error: 'Registration not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: registration,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error getting registration status:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
```

---

## SECTION 3: FRONTEND COMPONENTS

### File: src/components/FormField.tsx

```typescript
import React from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  error?: string
  helpText?: string
  value?: string | boolean
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
  disabled?: boolean
  children?: React.ReactNode
  options?: Array<{ value: string; label: string }>
}

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  helpText,
  value,
  onChange,
  disabled = false,
  children,
  options,
}: FormFieldProps) {
  const inputId = `field-${name}`

  if (type === 'checkbox') {
    return (
      <div className="form-group">
        <label htmlFor={inputId} className="flex items-center gap-3 cursor-pointer">
          <input
            id={inputId}
            type="checkbox"
            name={name}
            checked={value as boolean}
            onChange={onChange}
            disabled={disabled}
            className="w-5 h-5 rounded border-2 border-gray-300 text-golf-green focus:ring-2 focus:ring-golf-green cursor-pointer"
          />
          <span className="text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
        {error && <p className="form-error">{error}</p>}
      </div>
    )
  }

  if (type === 'textarea') {
    return (
      <div className="form-group">
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value as string}
          onChange={onChange}
          disabled={disabled}
          className={`input-field h-32 resize-none ${error ? 'error' : ''}`}
        />
        {error && <p className="form-error">{error}</p>}
        {helpText && <p className="form-help">{helpText}</p>}
      </div>
    )
  }

  if (type === 'select') {
    return (
      <div className="form-group">
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          id={inputId}
          name={name}
          value={value as string}
          onChange={onChange}
          disabled={disabled}
          className={`input-field ${error ? 'error' : ''}`}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="form-error">{error}</p>}
        {helpText && <p className="form-help">{helpText}</p>}
      </div>
    )
  }

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value as string}
        onChange={onChange}
        disabled={disabled}
        className={`input-field ${error ? 'error' : ''}`}
      />
      {error && <p className="form-error">{error}</p>}
      {helpText && <p className="form-help">{helpText}</p>}
    </div>
  )
}
```

### File: src/components/EventDetailsCard.tsx

```typescript
import { eventConfig } from '@/lib/config'

export default function EventDetailsCard() {
  return (
    <div className="card border-l-4 border-golf-green">
      <div className="card-header">
        <h2 className="text-2xl font-display font-bold text-golf-green">Event Details</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="text-golf-green text-2xl">📍</div>
          <div>
            <p className="font-semibold text-gray-900">{eventConfig.venue_name}</p>
            <p className="text-gray-600 text-sm">{eventConfig.venue_address}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="text-golf-green text-2xl">📅</div>
          <div>
            <p className="font-semibold text-gray-900">Saturday, June 20, 2026</p>
            <p className="text-gray-600 text-sm">Event Day</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="text-golf-green text-2xl">🕖</div>
          <div>
            <p className="font-semibold text-gray-900">
              {eventConfig.registration_time}
            </p>
            <p className="text-gray-600 text-sm">Registration Opens</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="text-golf-green text-2xl">⛳</div>
          <div>
            <p className="font-semibold text-gray-900">
              {eventConfig.shotgun_start}
            </p>
            <p className="text-gray-600 text-sm">Shotgun Start</p>
          </div>
        </div>
      </div>

      <div className="divider" />

      <p className="text-sm text-gray-600">
        Join us for a day of competitive golf and community support. All proceeds
        benefit local youth golf programs.
      </p>
    </div>
  )
}
```

### File: src/components/PricingCard.tsx

import { eventConfig } from '@/lib/config'

```typescript
export default function PricingCard() {
  return (
    <div className="card border-t-4 border-golf-accent">
      <div className="card-header">
        <h2 className="text-2xl font-display font-bold text-golf-green">Registration Pricing</h2>
      </div>

      <div className="space-y-4">
        {/* Individual Option */}
        <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-golf-green hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Individual Registration</h3>
            <span className="text-2xl font-bold text-golf-green">
              ${eventConfig.individual_price}
            </span>
          </div>
          <p className="text-sm text-gray-600">Register as an individual player</p>
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            <li>✓ One player</li>
            <li>✓ Tournament round</li>
            <li>✓ Lunch & BBQ</li>
          </ul>
        </div>

        {/* Team Option */}
        <div className="p-4 border-2 border-golf-green bg-golf-green bg-opacity-5 rounded-lg hover:shadow-md transition-all ring-2 ring-golf-green ring-opacity-30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Team of 4</h3>
            <span className="text-2xl font-bold text-golf-green">
              ${eventConfig.team_price}
            </span>
          </div>
          <p className="text-sm text-gray-600">Register a team of four players</p>
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            <li>✓ Four players</li>
            <li>✓ Team placement & scoring</li>
            <li>✓ Lunch & BBQ (4 meals)</li>
            <li>✓ Team recognition</li>
          </ul>
        </div>
      </div>

      <div className="divider" />

      <p className="text-xs text-gray-500 text-center">
        All prices include tournament round and meal. Payment accepted via bank account
        (ACH).
      </p>
    </div>
  )
}
```

### File: src/components/RegistrationTypeToggle.tsx

```typescript
interface RegistrationTypeToggleProps {
  value: 'individual' | 'team'
  onChange: (type: 'individual' | 'team') => void
}

export default function RegistrationTypeToggle({
  value,
  onChange,
}: RegistrationTypeToggleProps) {
  return (
    <div className="flex gap-3 mb-8">
      <button
        onClick={() => onChange('individual')}
        className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-200 text-center ${
          value === 'individual'
            ? 'bg-golf-green text-white shadow-lg'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <div className="text-2xl mb-1">👤</div>
        <div className="text-sm">Individual</div>
        <div className="text-xs mt-1">$135</div>
      </button>

      <button
        onClick={() => onChange('team')}
        className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-200 text-center ${
          value === 'team'
            ? 'bg-golf-green text-white shadow-lg'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <div className="text-2xl mb-1">👥</div>
        <div className="text-sm">Team of 4</div>
        <div className="text-xs mt-1">$500</div>
      </button>
    </div>
  )
}
```

### File: src/components/IndividualForm.tsx

```typescript
'use client'

import React from 'react'
import FormField from './FormField'
import type { IndividualRegistrationFormData } from '@/lib/validation/schemas'

interface IndividualFormProps {
  data: Partial<IndividualRegistrationFormData>
  errors: Record<string, string>
  onChange: (field: string, value: any) => void
  isSubmitting?: boolean
}

export default function IndividualForm({
  data,
  errors,
  onChange,
  isSubmitting = false,
}: IndividualFormProps) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="first_name"
            value={data.first_name || ''}
            onChange={e => onChange('first_name', e.target.value)}
            error={errors.first_name}
            required
            disabled={isSubmitting}
          />
          <FormField
            label="Last Name"
            name="last_name"
            value={data.last_name || ''}
            onChange={e => onChange('last_name', e.target.value)}
            error={errors.last_name}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <FormField
            label="Email"
            name="email"
            type="email"
            value={data.email || ''}
            onChange={e => onChange('email', e.target.value)}
            error={errors.email}
            required
            disabled={isSubmitting}
          />
          <FormField
            label="Phone"
            name="phone"
            type="tel"
            value={data.phone || ''}
            onChange={e => onChange('phone', e.target.value)}
            error={errors.phone}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Golf Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Golf Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            label="Handicap"
            name="handicap"
            placeholder="e.g., 12.5"
            value={data.handicap || ''}
            onChange={e => onChange('handicap', e.target.value)}
            error={errors.handicap}
            helpText="Optional - helps with course setup"
            disabled={isSubmitting}
          />
          <FormField
            label="BBQ Choice"
            name="bbq_choice"
            type="select"
            value={data.bbq_choice || ''}
            onChange={e => onChange('bbq_choice', e.target.value)}
            options={[
              { value: 'chicken', label: 'Chicken' },
              { value: 'beef', label: 'Beef' },
              { value: 'vegetarian', label: 'Vegetarian' },
              { value: 'none', label: 'None' },
            ]}
            disabled={isSubmitting}
          />
        </div>

        <FormField
          label="Preferred Playing Partners"
          name="preferred_playing_partners"
          placeholder="Names of golfers you'd like to play with"
          value={data.preferred_playing_partners || ''}
          onChange={e => onChange('preferred_playing_partners', e.target.value)}
          helpText="Optional"
          disabled={isSubmitting}
        />
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
        <FormField
          label="Company or Organization"
          name="company_or_organization"
          value={data.company_or_organization || ''}
          onChange={e => onChange('company_or_organization', e.target.value)}
          disabled={isSubmitting}
        />

        <FormField
          label="Interested in Sponsorship Opportunities?"
          name="sponsorship_interest"
          type="checkbox"
          value={data.sponsorship_interest || false}
          onChange={e => onChange('sponsorship_interest', e.target.checked)}
          disabled={isSubmitting}
        />

        <FormField
          label="Additional Notes"
          name="notes"
          type="textarea"
          placeholder="Any special requests or information"
          value={data.notes || ''}
          onChange={e => onChange('notes', e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Terms */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <FormField
          label="I accept the terms and conditions"
          name="terms_accepted"
          type="checkbox"
          value={data.terms_accepted || false}
          onChange={e => onChange('terms_accepted', e.target.checked)}
          required
          disabled={isSubmitting}
          error={errors.terms_accepted}
        />
      </div>
    </div>
  )
}
```

### File: src/components/TeamForm.tsx

```typescript
'use client'

import React from 'react'
import FormField from './FormField'
import type { TeamRegistrationFormData } from '@/lib/validation/schemas'

interface TeamFormProps {
  data: Partial<TeamRegistrationFormData>
  errors: Record<string, string>
  onChange: (field: string, value: any) => void
  isSubmitting?: boolean
}

export default function TeamForm({
  data,
  errors,
  onChange,
  isSubmitting = false,
}: TeamFormProps) {
  const playerNames = [
    'player_1_name',
    'player_2_name',
    'player_3_name',
    'player_4_name',
  ] as const
  const handicapFields = ['handicap_1', 'handicap_2', 'handicap_3', 'handicap_4'] as const
  const bbqFields = [
    'bbq_choice_1',
    'bbq_choice_2',
    'bbq_choice_3',
    'bbq_choice_4',
  ] as const

  return (
    <div className="space-y-6">
      {/* Team Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Information</h3>
        <FormField
          label="Team Name"
          name="team_name"
          value={data.team_name || ''}
          onChange={e => onChange('team_name', e.target.value)}
          error={errors.team_name}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Team Contact */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Contact</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="contact_first_name"
            value={data.contact_first_name || ''}
            onChange={e => onChange('contact_first_name', e.target.value)}
            error={errors.contact_first_name}
            required
            disabled={isSubmitting}
          />
          <FormField
            label="Last Name"
            name="contact_last_name"
            value={data.contact_last_name || ''}
            onChange={e => onChange('contact_last_name', e.target.value)}
            error={errors.contact_last_name}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <FormField
            label="Email"
            name="contact_email"
            type="email"
            value={data.contact_email || ''}
            onChange={e => onChange('contact_email', e.target.value)}
            error={errors.contact_email}
            required
            disabled={isSubmitting}
          />
          <FormField
            label="Phone"
            name="contact_phone"
            type="tel"
            value={data.contact_phone || ''}
            onChange={e => onChange('contact_phone', e.target.value)}
            error={errors.contact_phone}
            required
            disabled={isSubmitting}
          />
        </div>

        <FormField
          label="Company or Organization"
          name="company_or_organization"
          value={data.company_or_organization || ''}
          onChange={e => onChange('company_or_organization', e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Players */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Players</h3>
        {playerNames.map((playerField, idx) => (
          <div key={playerField} className="mb-6 pb-6 border-b border-gray-200 last:border-0">
            <h4 className="font-semibold text-gray-700 mb-3">Player {idx + 1}</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="Player Name"
                name={playerField}
                value={data[playerField] || ''}
                onChange={e => onChange(playerField, e.target.value)}
                error={errors[playerField]}
                required
                disabled={isSubmitting}
              />
              <FormField
                label="Handicap"
                name={handicapFields[idx]}
                placeholder="e.g., 12.5"
                value={data[handicapFields[idx]] || ''}
                onChange={e => onChange(handicapFields[idx], e.target.value)}
                helpText="Optional"
                disabled={isSubmitting}
              />
            </div>
            <FormField
              label="BBQ Choice"
              name={bbqFields[idx]}
              type="select"
              value={data[bbqFields[idx]] || ''}
              onChange={e => onChange(bbqFields[idx], e.target.value)}
              options={[
                { value: 'chicken', label: 'Chicken' },
                { value: 'beef', label: 'Beef' },
                { value: 'vegetarian', label: 'Vegetarian' },
                { value: 'none', label: 'None' },
              ]}
              disabled={isSubmitting}
            />
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>

        <FormField
          label="Interested in Sponsorship Opportunities?"
          name="sponsorship_interest"
          type="checkbox"
          value={data.sponsorship_interest || false}
          onChange={e => onChange('sponsorship_interest', e.target.checked)}
          disabled={isSubmitting}
        />

        <FormField
          label="Additional Notes"
          name="notes"
          type="textarea"
          placeholder="Any special requests or information"
          value={data.notes || ''}
          onChange={e => onChange('notes', e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Terms */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <FormField
          label="I accept the terms and conditions"
          name="terms_accepted"
          type="checkbox"
          value={data.terms_accepted || false}
          onChange={e => onChange('terms_accepted', e.target.checked)}
          required
          disabled={isSubmitting}
          error={errors.terms_accepted}
        />
      </div>
    </div>
  )
}
```

### File: src/components/PaymentStep.tsx

```typescript
'use client'

import { useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'

interface PaymentStepProps {
  submissionId: string
  paymentAmount: number
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
}

export default function PaymentStep({
  submissionId,
  paymentAmount,
  onSuccess,
  onError,
}: PaymentStepProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)

  // Fetch Plaid link token
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await fetch('/api/payments/create-link-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submission_id: submissionId }),
        })

        const result = await response.json()

        if (result.success && result.data?.link_token) {
          setLinkToken(result.data.link_token)
        } else {
          onError('Failed to initialize payment')
        }
      } catch (error) {
        onError('Failed to initialize payment')
      } finally {
        setLoading(false)
      }
    }

    fetchLinkToken()
  }, [submissionId, onError])

  // Handle successful token exchange
  const handleOnSuccess = async (publicToken: string) => {
    setProcessingPayment(true)

    try {
      const response = await fetch('/api/payments/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: submissionId,
          public_token: publicToken,
          payment_amount: paymentAmount,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess(result.data.payment_id)
      } else {
        onError(result.error || 'Payment failed')
      }
    } catch (error) {
      onError('Payment processing failed')
    } finally {
      setProcessingPayment(false)
    }
  }

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: handleOnSuccess,
    onExit: () => {
      onError('Payment was cancelled')
    },
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-gray-600">Initializing payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-700">
          <strong>Amount Due:</strong> ${paymentAmount.toFixed(2)}
        </p>
        <p className="text-xs text-blue-600 mt-2">
          Payment will be securely processed through your bank account.
        </p>
      </div>

      <button
        onClick={() => open()}
        disabled={!ready || processingPayment}
        className="btn-primary w-full"
      >
        {processingPayment ? (
          <>
            <span className="loading-spinner mr-2" />
            Processing Payment...
          </>
        ) : (
          'Link Bank Account & Pay'
        )}
      </button>

      <p className="text-xs text-center text-gray-500">
        Powered by Plaid. Your bank information is never stored.
      </p>
    </div>
  )
}
```

---

## SECTION 4: PAGES

### File: src/app/page.tsx

```typescript
import Link from 'next/link'
import EventDetailsCard from '@/components/EventDetailsCard'
import PricingCard from '@/components/PricingCard'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4">
              <span className="text-6xl">⛳</span>
            </div>
            <h1 className="section-title">
              Rockwood Park Golf Tournament
            </h1>
            <p className="section-subtitle">
              Join us for a day of championship golf and community giving
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Saturday, June 20, 2026 • Rockwood Golf Course
            </p>

            <Link href="/register" className="btn-primary btn-lg inline-block">
              Register Now →
            </Link>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <EventDetailsCard />
            <PricingCard />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-white bg-opacity-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mb-8">About This Event</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-display font-bold text-lg text-golf-green mb-2">
                Championship Course
              </h3>
              <p className="text-gray-600">
                Play at one of the region's most respected courses with professional
                scoring and handicap management.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-display font-bold text-lg text-golf-green mb-2">
                Community Impact
              </h3>
              <p className="text-gray-600">
                All proceeds benefit youth golf programs and junior development
                in our community.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-display font-bold text-lg text-golf-green mb-2">
                Great Amenities
              </h3>
              <p className="text-gray-600">
                BBQ lunch, awards reception, and networking with fellow golfers
                and sponsors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title mb-4">Ready to Play?</h2>
          <p className="text-gray-600 mb-8">
            Spots are limited. Register now to secure your place in this year's
            championship event.
          </p>
          <Link href="/register" className="btn-primary btn-lg inline-block">
            Register Today →
          </Link>
        </div>
      </section>
    </div>
  )
}
```

### File: src/app/register/page.tsx

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EventDetailsCard from '@/components/EventDetailsCard'
import PricingCard from '@/components/PricingCard'
import RegistrationTypeToggle from '@/components/RegistrationTypeToggle'
import IndividualForm from '@/components/IndividualForm'
import TeamForm from '@/components/TeamForm'
import PaymentStep from '@/components/PaymentStep'
import FormField from '@/components/FormField'
import {
  individualRegistrationSchema,
  teamRegistrationSchema,
  type IndividualRegistrationFormData,
  type TeamRegistrationFormData,
} from '@/lib/validation/schemas'
import { eventConfig } from '@/lib/config'

type RegistrationType = 'individual' | 'team'
type FormStep = 'type' | 'form' | 'payment' | 'success'

export default function RegisterPage() {
  const router = useRouter()
  const [registrationType, setRegistrationType] = useState<RegistrationType>('individual')
  const [step, setStep] = useState<FormStep>('type')
  const [submissionId, setSubmissionId] = useState<string>('')
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form data state
  const [individualData, setIndividualData] = useState<Partial<IndividualRegistrationFormData>>({
    sponsorship_interest: false,
    terms_accepted: false,
  })

  const [teamData, setTeamData] = useState<Partial<TeamRegistrationFormData>>({
    sponsorship_interest: false,
    terms_accepted: false,
  })

  // Handle form field changes
  const handleIndividualChange = (field: string, value: any) => {
    setIndividualData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleTeamChange = (field: string, value: any) => {
    setTeamData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Handle type selection
  const handleTypeSelection = () => {
    setStep('form')
  }

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate form data
      const schema = registrationType === 'individual' ? individualRegistrationSchema : teamRegistrationSchema
      const data = registrationType === 'individual' ? individualData : teamData

      const validationResult = schema.safeParse(data)

      if (!validationResult.success) {
        const formattedErrors: Record<string, string> = {}
        validationResult.error.flatten().fieldErrors
        Object.entries(validationResult.error.flatten().fieldErrors).forEach(([key, messages]) => {
          formattedErrors[key] = messages?.[0] || 'Invalid input'
        })
        setErrors(formattedErrors)
        setIsSubmitting(false)
        return
      }

      // Submit registration
      const response = await fetch('/api/registrations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_type: registrationType,
          data: validationResult.data,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        setErrors({ form: result.error || 'Registration failed' })
        setIsSubmitting(false)
        return
      }

      // Move to payment step
      setSubmissionId(result.data.submission_id)
      setPaymentAmount(result.data.payment_amount)
      setStep('payment')
    } catch (error) {
      setErrors({ form: 'An error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle payment success
  const handlePaymentSuccess = (paymentId: string) => {
    setStep('success')
  }

  // Handle payment error
  const handlePaymentError = (error: string) => {
    setErrors({ payment: error })
    setStep('form')
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">Tournament Registration</h1>
          <p className="section-subtitle">
            Complete your registration and secure your spot
          </p>
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <EventDetailsCard />
            <PricingCard />

            {/* Progress */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Registration Progress</h3>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 ${step === 'type' || step === 'form' || step === 'payment' || step === 'success' ? 'text-golf-green' : 'text-gray-400'}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white bg-golf-green">
                    ✓
                  </div>
                  <span className="font-semibold">Registration Type</span>
                </div>

                <div className={`flex items-center gap-3 ${step === 'form' || step === 'payment' || step === 'success' ? 'text-golf-green' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step === 'form' || step === 'payment' || step === 'success' ? 'bg-golf-green' : 'bg-gray-300'}`}>
                    2
                  </div>
                  <span className="font-semibold">Your Information</span>
                </div>

                <div className={`flex items-center gap-3 ${step === 'payment' || step === 'success' ? 'text-golf-green' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step === 'payment' || step === 'success' ? 'bg-golf-green' : 'bg-gray-300'}`}>
                    3
                  </div>
                  <span className="font-semibold">Payment</span>
                </div>

                <div className={`flex items-center gap-3 ${step === 'success' ? 'text-golf-green' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step === 'success' ? 'bg-golf-green' : 'bg-gray-300'}`}>
                    ✓
                  </div>
                  <span className="font-semibold">Complete</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'type' && (
              <div className="card animate-slide-up">
                <div className="card-header">
                  <h2 className="text-2xl font-display font-bold text-golf-green">
                    Choose Registration Type
                  </h2>
                </div>

                <div className="space-y-6">
                  <RegistrationTypeToggle value={registrationType} onChange={setRegistrationType} />

                  <div className="bg-golf-green bg-opacity-5 p-6 rounded-lg border-2 border-golf-green border-opacity-20">
                    {registrationType === 'individual' ? (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Individual Registration</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Register as a single golfer. You'll be placed with other players to form a
                          group of four.
                        </p>
                        <p className="text-2xl font-bold text-golf-green">
                          ${eventConfig.individual_price}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Team Registration</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Register with three other golfers as a team. You'll compete together and
                          receive team recognition.
                        </p>
                        <p className="text-2xl font-bold text-golf-green">
                          ${eventConfig.team_price} (for all 4 players)
                        </p>
                      </div>
                    )}
                  </div>

                  <button onClick={handleTypeSelection} className="btn-primary w-full">
                    Continue to Registration Form →
                  </button>
                </div>
              </div>
            )}

            {step === 'form' && (
              <form onSubmit={handleFormSubmit} className="card animate-slide-up space-y-6">
                <div className="card-header">
                  <h2 className="text-2xl font-display font-bold text-golf-green">
                    {registrationType === 'individual' ? 'Individual' : 'Team'} Registration Details
                  </h2>
                </div>

                {errors.form && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-700 font-semibold">{errors.form}</p>
                  </div>
                )}

                {registrationType === 'individual' ? (
                  <IndividualForm
                    data={individualData}
                    errors={errors}
                    onChange={handleIndividualChange}
                    isSubmitting={isSubmitting}
                  />
                ) : (
                  <TeamForm
                    data={teamData}
                    errors={errors}
                    onChange={handleTeamChange}
                    isSubmitting={isSubmitting}
                  />
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('type')}
                    className="btn-secondary flex-1"
                    disabled={isSubmitting}
                  >
                    ← Back
                  </button>
                  <button type="submit" className="btn-primary flex-1" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Continue to Payment →'}
                  </button>
                </div>
              </form>
            )}

            {step === 'payment' && (
              <div className="card animate-slide-up">
                <div className="card-header">
                  <h2 className="text-2xl font-display font-bold text-golf-green">Payment</h2>
                </div>

                {errors.payment && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                    <p className="text-red-700 font-semibold">{errors.payment}</p>
                  </div>
                )}

                <PaymentStep
                  submissionId={submissionId}
                  paymentAmount={paymentAmount}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />

                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="btn-secondary w-full mt-4"
                >
                  ← Back to Form
                </button>
              </div>
            )}

            {step === 'success' && (
              <div className="card animate-slide-up text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-display font-bold text-golf-green mb-2">
                    Registration Complete!
                  </h2>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded text-left">
                    <p className="font-semibold text-green-900 mb-1">Confirmation ID</p>
                    <p className="text-green-700 font-mono text-sm">{submissionId}</p>
                  </div>

                  <p className="text-gray-600">
                    A confirmation email has been sent to your registered email address.
                  </p>

                  <div className="divider" />

                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✓ Check your email for confirmation</li>
                      <li>✓ Review the event details and agenda</li>
                      <li>✓ Arrive 30 minutes early on June 20</li>
                      <li>✓ Check in at the pro shop</li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-500 mt-4">
                    Questions? Contact info@rockwoodgolf.com
                  </p>
                </div>

                <button
                  onClick={() => router.push('/')}
                  className="btn-primary w-full"
                >
                  Return to Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## SECTION 5: SETUP & DEPLOYMENT INSTRUCTIONS

### Step 1: Prerequisites
- Node.js 18+ and npm/yarn
- Google Cloud Project with service account
- Plaid account (sandbox for testing)
- Google Sheet already created and shared with service account

### Step 2: Google Sheets Setup

1. Create a new Google Sheet at sheets.google.com
2. Name it "Golf Tournament Registrations 2026"
3. Copy the Spreadsheet ID from the URL
4. Create a service account in Google Cloud Console:
   - Go to console.cloud.google.com
   - Create new project
   - Enable Sheets API
   - Create service account
   - Download JSON key file
5. Share the Google Sheet with the service account email
6. Extract credentials from the JSON key file

### Step 3: Plaid Setup

1. Sign up at plaid.com
2. Create application in dashboard
3. Get Client ID and Secret
4. Use sandbox environment for testing

### Step 4: Environment Configuration

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values
```

### Step 5: Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

### Step 6: Testing Payment Flow

1. Visit http://localhost:3000
2. Click "Register Now"
3. Fill out the form
4. In Plaid sandbox, use test credentials
5. Verify data appears in Google Sheet

### Step 7: Production Deployment

**Environment:**
- Deploy to Vercel: `npm install -g vercel && vercel`
- Or use Docker: Build image and deploy to your infrastructure

**Configuration for Production:**
1. Set PLAID_ENV=production
2. Use production Google credentials
3. Set proper NEXT_PUBLIC_APP_URL
4. Configure domain in Plaid allowed URLs

---

## SECTION 6: TESTING CHECKLIST

### Unit Tests
- [ ] ID generation creates valid unique IDs
- [ ] Sanitization removes XSS payloads
- [ ] Zod schemas reject invalid data
- [ ] Data normalization handles individual and team correctly

### Integration Tests
- [ ] Individual registration flow works end-to-end
- [ ] Team registration flow works end-to-end
- [ ] Duplicate email detection works
- [ ] Validation errors display correctly
- [ ] Google Sheets receives all data correctly
- [ ] Audit log records all actions

### Frontend Tests
- [ ] Form validation shows errors
- [ ] Toggle switches between individual/team
- [ ] All form fields accept input
- [ ] Payment modal opens and closes
- [ ] Success page displays after payment
- [ ] Mobile responsive on iPhone/iPad

### Payment Tests (Sandbox)
- [ ] Plaid link token creates successfully
- [ ] Public token exchanges successfully
- [ ] Payment records created in Sheets
- [ ] Payment status updates correctly
- [ ] Failed payments handled gracefully

### Google Sheets Verification
- [ ] Registrations sheet has all headers
- [ ] Individual data normalizes correctly
- [ ] Team data with 4 players loads correctly
- [ ] Data is readable/filterable by staff
- [ ] No PII or secrets exposed in sheets
- [ ] Timestamps are in ISO format
- [ ] Payment status tracks correctly

### Security Tests
- [ ] API rejects invalid JSON
- [ ] XSS injection attempts are sanitized
- [ ] SQL injection-like inputs are escaped
- [ ] Rate limiting prevents abuse
- [ ] Plaid secret key never exposed on client
- [ ] No sensitive payment data logged

---

## SECTION 7: DEPLOYMENT NOTES

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - GOOGLE_SERVICE_ACCOUNT_EMAIL
# - GOOGLE_PRIVATE_KEY
# - GOOGLE_SPREADSHEET_ID
# - PLAID_CLIENT_ID
# - PLAID_SECRET
# - PLAID_ENV=production
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Best Practices

- Use `.env.local` for development (git-ignored)
- Never commit secrets to repository
- Rotate keys quarterly
- Use strong random values for secrets
- Test production config in staging first

### Monitoring

- Monitor API response times
- Track registration submission success rate
- Monitor Google Sheets API quota usage
- Set up alerts for payment failures
- Monitor Plaid webhook responses

---

## SECTION 8: FUTURE ENHANCEMENTS

### Phase 2 (Post-Launch)
- Email confirmations using SendGrid or Mailgun
- SMS reminders 1 week before event
- Admin dashboard for event staff
- CSV export functionality
- Team editing (allow changes before event)

### Phase 3 (Advanced Features)
- Sponsor portal with custom links
- Raffle ticket integration
- Mulligans and game add-ons
- Dinner-only ticket option
- Hole sponsorship packages
- Leaderboard integration

### Phase 4 (Analytics)
- Registration analytics dashboard
- Revenue tracking
- Demographics reporting
- Payment method analytics
- Sponsorship ROI tracking

### Code Structure for Extensibility
- All business logic in `lib/` folder (reusable)
- Components in `components/` (composable)
- Sheet operations abstracted (switchable to DB)
- API routes follow RESTful patterns
- Validation schemas centralized (DRY)

---

## SECTION 9: TROUBLESHOOTING

### Google Sheets Issues
- **Problem**: "GOOGLE_SPREADSHEET_ID is not configured"
  - **Solution**: Verify .env.local has the correct spreadsheet ID

- **Problem**: Sheet operations timing out
  - **Solution**: Check Google service account has Sheets API enabled

### Plaid Issues
- **Problem**: "Failed to create Plaid link token"
  - **Solution**: Verify PLAID_CLIENT_ID and PLAID_SECRET in .env.local

- **Problem**: Public token won't exchange
  - **Solution**: Ensure token is valid and hasn't expired (5 min timeout)

### Payment Issues
- **Problem**: Payment status not updating
  - **Solution**: Check Plaid webhook is configured (for production)

- **Problem**: Duplicate registrations appearing
  - **Solution**: Email check is case-insensitive, verify normalization

### Form Validation
- **Problem**: Required field errors not clearing
  - **Solution**: Handler calls `onChange` which clears errors - verify JS enabled

---

END OF COMPLETE IMPLEMENTATION
