import { IndividualFormData, TeamFormData, RegistrationData } from '@/types';
import { config } from '@/lib/config';
import { generateSubmissionId } from './id-generator';

/**
 * Normalize individual form data to the unified registration structure
 */
export function normalizeIndividualData(formData: IndividualFormData): Omit<RegistrationData, 'created_at' | 'updated_at'> {
  const now = new Date().toISOString();

  return {
    submission_id: generateSubmissionId(),
    registration_type: 'individual',
    registration_status: 'initiated',
    payment_status: 'pending',
    payment_amount: config.event.individualPrice,
    event_name: config.event.name,
    event_date: config.event.date,
    venue_name: config.event.venueName,
    venue_address: config.event.venueAddress,
    contact_first_name: formData.first_name,
    contact_last_name: formData.last_name,
    contact_full_name: `${formData.first_name} ${formData.last_name}`,
    contact_email: formData.email,
    contact_phone: formData.phone,
    company_or_organization: formData.company_or_organization,
    player_count: 1,
    player_1_name: `${formData.first_name} ${formData.last_name}`,
    handicap_1: formData.handicap,
    preferred_playing_partners: formData.preferred_playing_partners,
    sponsorship_interest: formData.sponsorship_interest,
    bbq_choice_1: formData.bbq_choice,
    notes: formData.notes,
    terms_accepted: formData.terms_accepted,
    source_page: 'registration',
  };
}

/**
 * Normalize team form data to the unified registration structure
 */
export function normalizeTeamData(formData: TeamFormData): Omit<RegistrationData, 'created_at' | 'updated_at'> {
  const now = new Date().toISOString();

  return {
    submission_id: generateSubmissionId(),
    registration_type: 'team',
    registration_status: 'initiated',
    payment_status: 'pending',
    payment_amount: config.event.teamPrice,
    event_name: config.event.name,
    event_date: config.event.date,
    venue_name: config.event.venueName,
    venue_address: config.event.venueAddress,
    team_name: formData.team_name,
    contact_first_name: formData.contact_first_name,
    contact_last_name: formData.contact_last_name,
    contact_full_name: `${formData.contact_first_name} ${formData.contact_last_name}`,
    contact_email: formData.contact_email,
    contact_phone: formData.contact_phone,
    company_or_organization: formData.company_or_organization,
    player_count: 4,
    player_1_name: formData.player_1_name,
    player_2_name: formData.player_2_name,
    player_3_name: formData.player_3_name,
    player_4_name: formData.player_4_name,
    handicap_1: formData.handicap_1,
    handicap_2: formData.handicap_2,
    handicap_3: formData.handicap_3,
    handicap_4: formData.handicap_4,
    sponsorship_interest: formData.sponsorship_interest,
    bbq_choice_1: formData.bbq_choice_1,
    bbq_choice_2: formData.bbq_choice_2,
    bbq_choice_3: formData.bbq_choice_3,
    bbq_choice_4: formData.bbq_choice_4,
    notes: formData.notes,
    terms_accepted: formData.terms_accepted,
    source_page: 'registration',
  };
}

/**
 * Convert registration data to Google Sheets row format
 * Order must match the sheet columns exactly
 */
export function registrationToSheetRow(registration: RegistrationData): string[] {
  return [
    registration.submission_id,
    registration.created_at,
    registration.updated_at,
    registration.registration_type,
    registration.registration_status,
    registration.payment_status,
    registration.payment_amount.toString(),
    registration.event_name,
    registration.event_date,
    registration.venue_name,
    registration.venue_address,
    registration.team_name || '',
    registration.contact_first_name,
    registration.contact_last_name,
    registration.contact_full_name,
    registration.contact_email,
    registration.contact_phone,
    registration.company_or_organization || '',
    registration.player_count.toString(),
    registration.player_1_name,
    registration.player_2_name || '',
    registration.player_3_name || '',
    registration.player_4_name || '',
    registration.handicap_1 || '',
    registration.handicap_2 || '',
    registration.handicap_3 || '',
    registration.handicap_4 || '',
    registration.preferred_playing_partners || '',
    registration.sponsorship_interest.toString(),
    registration.bbq_choice_1 || '',
    registration.bbq_choice_2 || '',
    registration.bbq_choice_3 || '',
    registration.bbq_choice_4 || '',
    registration.notes || '',
    registration.terms_accepted.toString(),
    registration.source_page,
    registration.plaid_customer_reference || '',
    registration.plaid_transfer_id || '',
    registration.plaid_payment_status_raw || '',
  ];
}