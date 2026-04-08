/**
 * Sanitize user input to prevent XSS and other injection attacks
 */

// Basic HTML entity encoding
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escape HTML entities in a string
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
}

/**
 * Sanitize a string by trimming whitespace and escaping HTML
 */
export function sanitizeString(input: string | undefined): string {
  if (!input) return '';
  return escapeHtml(input.trim());
}

/**
 * Sanitize an email address (basic validation + sanitization)
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Sanitize a phone number (remove non-numeric characters except +)
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+\-\s()]/g, '').trim();
}

/**
 * Sanitize form data object recursively
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('phone')) {
        sanitized[key] = sanitizePhone(value);
      } else {
        sanitized[key] = sanitizeString(value);
      }
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeFormData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}