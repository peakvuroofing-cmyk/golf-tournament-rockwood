// Core registration types
export interface RegistrationData {
  submission_id: string;
  created_at: string;
  updated_at: string;
  registration_type: 'individual' | 'team';
  registration_status: 'initiated' | 'pending_payment' | 'paid' | 'payment_failed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  payment_amount: number;
  event_name: string;
  event_date: string;
  venue_name: string;
  venue_address: string;
  team_name?: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_full_name: string;
  contact_email: string;
  contact_phone: string;
  company_or_organization?: string;
  player_count: number;
  player_1_name: string;
  player_2_name?: string;
  player_3_name?: string;
  player_4_name?: string;
  handicap_1?: string;
  handicap_2?: string;
  handicap_3?: string;
  handicap_4?: string;
  preferred_playing_partners?: string;
  sponsorship_interest: boolean;
  bbq_choice_1?: string;
  bbq_choice_2?: string;
  bbq_choice_3?: string;
  bbq_choice_4?: string;
  notes?: string;
  terms_accepted: boolean;
  source_page: string;
  stripe_session_id?: string;
}

export interface PaymentData {
  payment_id: string;
  submission_id: string;
  created_at: string;
  payment_provider: 'stripe';
  amount: number;
  currency: 'USD';
  stripe_session_id?: string;
  payment_status: 'pending' | 'completed' | 'failed';
}

export interface AuditLogEntry {
  log_id: string;
  timestamp: string;
  action_type: string;
  submission_id?: string;
  result: 'success' | 'failure';
  details: string;
}

// Form data types
export interface IndividualFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_or_organization?: string;
  handicap?: string;
  preferred_playing_partners?: string;
  sponsorship_interest: boolean;
  bbq_choice?: string;
  notes?: string;
  terms_accepted: boolean;
}

export interface TeamFormData {
  team_name: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string;
  company_or_organization?: string;
  player_1_name: string;
  player_2_name: string;
  player_3_name: string;
  player_4_name: string;
  handicap_1?: string;
  handicap_2?: string;
  handicap_3?: string;
  handicap_4?: string;
  sponsorship_interest: boolean;
  bbq_choice_1?: string;
  bbq_choice_2?: string;
  bbq_choice_3?: string;
  bbq_choice_4?: string;
  notes?: string;
  terms_accepted: boolean;
}

// API response types
export interface CreateRegistrationResponse {
  success: boolean;
  submission_id?: string;
  error?: string;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface RegistrationStatusResponse {
  success: boolean;
  registration?: RegistrationData;
  error?: string;
}

