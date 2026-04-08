import React from 'react';
import { FormField } from './FormField';
import { IndividualFormData } from '@/types';

interface IndividualFormProps {
  formData: IndividualFormData;
  errors: Partial<Record<keyof IndividualFormData, string>>;
  onChange: (field: keyof IndividualFormData, value: string | boolean) => void;
  onBlur: (field: keyof IndividualFormData) => void;
}

export function IndividualForm({ formData, errors, onChange, onBlur }: IndividualFormProps) {
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    onChange(name as keyof IndividualFormData, fieldValue);
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onBlur(e.target.name as keyof IndividualFormData);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={errors.first_name}
          required
          placeholder="Enter your first name"
        />

        <FormField
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={errors.last_name}
          required
          placeholder="Enter your last name"
        />
      </div>

      <FormField
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        error={errors.email}
        required
        placeholder="Enter your email address"
      />

      <FormField
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        error={errors.phone}
        required
        placeholder="Enter your phone number"
      />

      <FormField
        label="Company or Organization"
        name="company_or_organization"
        value={formData.company_or_organization || ''}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        error={errors.company_or_organization}
        placeholder="Enter your company or organization (optional)"
      />

      <FormField
        label="Handicap"
        name="handicap"
        value={formData.handicap || ''}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        error={errors.handicap}
        placeholder="Enter your handicap (optional)"
      />

      <FormField
        label="Preferred Playing Partners"
        name="preferred_playing_partners"
        value={formData.preferred_playing_partners || ''}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        error={errors.preferred_playing_partners}
        placeholder="List any preferred playing partners (optional)"
      />

      <FormField
        label="BBQ Choice"
        name="bbq_choice"
        value={formData.bbq_choice || ''}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        error={errors.bbq_choice}
        options={[
          { value: 'beef', label: 'Beef' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'vegetarian', label: 'Vegetarian' },
          { value: 'none', label: 'None' },
        ]}
      />

      <FormField
        label="Additional Notes"
        name="notes"
        value={formData.notes || ''}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        error={errors.notes}
        multiline
        rows={3}
        placeholder="Any additional notes or special requests (optional)"
      />

      <FormField
        label="I am interested in sponsorship opportunities"
        name="sponsorship_interest"
        type="checkbox"
        value={formData.sponsorship_interest}
        onChange={handleFieldChange}
        error={errors.sponsorship_interest}
        placeholder="Check if interested in sponsorship"
      />

      <FormField
        label="I agree to the terms and conditions"
        name="terms_accepted"
        type="checkbox"
        value={formData.terms_accepted}
        onChange={handleFieldChange}
        error={errors.terms_accepted}
        required
        placeholder="Required to proceed with registration"
      />
    </div>
  );
}