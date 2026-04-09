import { z } from 'zod';

// Common validation patterns
const phoneRegex = /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Individual registration schema
export const individualFormSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  last_name: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Invalid email format')
    .max(100, 'Email too long'),
  phone: z.string()
    .min(1, 'Phone is required')
    .regex(phoneRegex, 'Invalid phone format')
    .max(20, 'Phone too long'),
  company_or_organization: z.string().max(100, 'Company name too long').optional(),
  handicap: z.string().max(10, 'Handicap too long').optional(),
  preferred_playing_partners: z.string().max(200, 'Preferred partners too long').optional(),
  sponsorship_interest: z.boolean(),
  bbq_choice: z.enum(['beef', 'chicken', 'vegetarian', 'none'], { required_error: 'BBQ choice is required' }),
  notes: z.string().max(500, 'Notes too long').optional(),
  terms_accepted: z.boolean().refine(val => val === true, 'Terms must be accepted'),
});

// Team registration schema
export const teamFormSchema = z.object({
  team_name: z.string().min(1, 'Team name is required').max(100, 'Team name too long'),
  contact_first_name: z.string().min(1, 'Contact first name is required').max(50, 'First name too long'),
  contact_last_name: z.string().min(1, 'Contact last name is required').max(50, 'Last name too long'),
  contact_email: z.string()
    .min(1, 'Contact email is required')
    .regex(emailRegex, 'Invalid email format')
    .max(100, 'Email too long'),
  contact_phone: z.string()
    .min(1, 'Contact phone is required')
    .regex(phoneRegex, 'Invalid phone format')
    .max(20, 'Phone too long'),
  company_or_organization: z.string().max(100, 'Company name too long').optional(),
  player_1_name: z.string().min(1, 'Player 1 name is required').max(100, 'Player name too long'),
  player_2_name: z.string().min(1, 'Player 2 name is required').max(100, 'Player name too long'),
  player_3_name: z.string().min(1, 'Player 3 name is required').max(100, 'Player name too long'),
  player_4_name: z.string().min(1, 'Player 4 name is required').max(100, 'Player name too long'),
  handicap_1: z.string().max(10, 'Handicap too long').optional(),
  handicap_2: z.string().max(10, 'Handicap too long').optional(),
  handicap_3: z.string().max(10, 'Handicap too long').optional(),
  handicap_4: z.string().max(10, 'Handicap too long').optional(),
  sponsorship_interest: z.boolean(),
  bbq_choice_1: z.enum(['beef', 'chicken', 'vegetarian', 'none'], { required_error: 'BBQ choice is required for Player 1' }),
  bbq_choice_2: z.enum(['beef', 'chicken', 'vegetarian', 'none'], { required_error: 'BBQ choice is required for Player 2' }),
  bbq_choice_3: z.enum(['beef', 'chicken', 'vegetarian', 'none'], { required_error: 'BBQ choice is required for Player 3' }),
  bbq_choice_4: z.enum(['beef', 'chicken', 'vegetarian', 'none'], { required_error: 'BBQ choice is required for Player 4' }),
  notes: z.string().max(500, 'Notes too long').optional(),
  terms_accepted: z.boolean().refine(val => val === true, 'Terms must be accepted'),
});

// API request schemas
export const createRegistrationSchema = z.object({
  registration_type: z.enum(['individual', 'team']),
  form_data: z.union([individualFormSchema, teamFormSchema]),
});

export const createLinkTokenSchema = z.object({
  submission_id: z.string().min(1, 'Submission ID is required'),
});

export const exchangeTokenSchema = z.object({
  public_token: z.string().min(1, 'Public token is required'),
  submission_id: z.string().min(1, 'Submission ID is required'),
});

export const registrationStatusSchema = z.object({
  submission_id: z.string().min(1, 'Submission ID is required'),
});

// Type exports
export type IndividualFormData = z.infer<typeof individualFormSchema>;
export type TeamFormData = z.infer<typeof teamFormSchema>;
export type CreateRegistrationRequest = z.infer<typeof createRegistrationSchema>;
export type CreateLinkTokenRequest = z.infer<typeof createLinkTokenSchema>;
export type ExchangeTokenRequest = z.infer<typeof exchangeTokenSchema>;
export type RegistrationStatusRequest = z.infer<typeof registrationStatusSchema>;