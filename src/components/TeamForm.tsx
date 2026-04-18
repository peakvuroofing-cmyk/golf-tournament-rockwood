import React from 'react';
import { FormField } from './FormField';
import { TeamFormData } from '@/types';

interface TeamFormProps {
  formData: TeamFormData;
  errors: Partial<Record<keyof TeamFormData, string>>;
  onChange: (field: keyof TeamFormData, value: string | boolean) => void;
  onBlur: (field: keyof TeamFormData) => void;
}

export function TeamForm({ formData, errors, onChange, onBlur }: TeamFormProps) {
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    onChange(name as keyof TeamFormData, fieldValue);
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onBlur(e.target.name as keyof TeamFormData);
  };

  return (
    <div className="space-y-6">
      {/* Team Information */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Team Information</h4>

        <FormField
          label="Team Name"
          name="team_name"
          value={formData.team_name}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={errors.team_name}
          required
          placeholder="Enter your team name"
        />
      </div>

      {/* Contact Information */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Contact First Name"
            name="contact_first_name"
            value={formData.contact_first_name}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            error={errors.contact_first_name}
            required
            placeholder="Enter contact person's first name"
          />

          <FormField
            label="Contact Last Name"
            name="contact_last_name"
            value={formData.contact_last_name}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            error={errors.contact_last_name}
            required
            placeholder="Enter contact person's last name"
          />
        </div>

        <FormField
          label="Contact Email"
          name="contact_email"
          type="email"
          value={formData.contact_email}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={errors.contact_email}
          required
          placeholder="Enter contact email address"
        />

        <FormField
          label="Contact Phone"
          name="contact_phone"
          type="tel"
          value={formData.contact_phone}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={errors.contact_phone}
          required
          placeholder="Enter contact phone number"
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
      </div>

      {/* Player Information */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Player Information</h4>

        {[1, 2, 3, 4].map((playerNum) => (
          <div key={playerNum} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-3">Player {playerNum}</h5>

            <FormField
              label={`Player ${playerNum} Name`}
              name={`player_${playerNum}_name` as keyof TeamFormData}
              value={(formData as any)[`player_${playerNum}_name`]}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              error={(errors as any)[`player_${playerNum}_name`]}
              required
              placeholder={`Enter player ${playerNum}'s full name`}
            />

            <FormField
              label={`Player ${playerNum} Handicap`}
              name={`handicap_${playerNum}` as keyof TeamFormData}
              value={(formData as any)[`handicap_${playerNum}`] || ''}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              error={(errors as any)[`handicap_${playerNum}`]}
              placeholder={`Enter player ${playerNum}'s handicap (optional)`}
            />

            <FormField
              label={`Player ${playerNum} BBQ Choice`}
              name={`bbq_choice_${playerNum}` as keyof TeamFormData}
              value={(formData as any)[`bbq_choice_${playerNum}`] || ''}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              error={(errors as any)[`bbq_choice_${playerNum}`]}
              required
              options={[
                { value: 'beef', label: 'Beef' },
                { value: 'chicken', label: 'Chicken' },
                { value: 'vegetarian', label: 'Vegetarian' },
                { value: 'none', label: 'None' },
              ]}
            />
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div>
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
    </div>
  );
}