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
  plaid_customer_reference?: string;
  plaid_transfer_id?: string;
  plaid_payment_status_raw?: string;
}

export interface PaymentData {
  payment_id: string;
  submission_id: string;
  created_at: string;
  payment_provider: 'plaid';
  payment_method: 'ach';
  amount: number;
  currency: 'USD';
  plaid_transfer_id?: string;
  plaid_access_reference?: string;
  payment_status: 'pending' | 'completed' | 'failed';
  raw_response_summary?: string;
  failure_reason?: string;
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

export interface CreateLinkTokenResponse {
  success: boolean;
  link_token?: string;
  error?: string;
}

export interface ExchangeTokenResponse {
  success: boolean;
  payment_id?: string;
  status?: string;
  error?: string;
}

export interface RegistrationStatusResponse {
  success: boolean;
  registration?: RegistrationData;
  error?: string;
}

// Plaid types
export interface PlaidLinkTokenCreateRequest {
  user: {
    client_user_id: string;
  };
  client_name: string;
  products: string[];
  country_codes: string[];
  language: string;
  account_filters: {
    depository: {
      account_subtypes: string[];
    };
  };
}

export interface PlaidLinkTokenCreateResponse {
  link_token: string;
  expiration: string;
  request_id: string;
}

export interface PlaidPublicTokenExchangeRequest {
  public_token: string;
}

export interface PlaidPublicTokenExchangeResponse {
  access_token: string;
  item_id: string;
  request_id: string;
}

export interface PlaidTransferCreateRequest {
  access_token: string;
  account_id: string;
  amount: string;
  description: string;
  ach_class: string;
  network: string;
  type: string;
  user: {
    legal_name: string;
  };
}

export interface PlaidTransferCreateResponse {
  transfer: {
    id: string;
    status: string;
  };
  request_id: string;
}