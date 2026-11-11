import { ALLOWED_DOMAIN, DOMAIN_RESTRICTION_ERROR_MESSAGE, SUPER_USER_EMAILS } from '../constants/config';
import { DomainValidationResult } from '../types/auth';

/**
 * Validates whether an email belongs to the official allowed domain (@hbplus.fit).
 * 
 * Requirement:
 * - If email = example@hbplus.fit -> Allow login
 * - If email = example@gmail.com -> Show error:
 *   "Access restricted. Please login using your official domain email."
 */
export function validateEmailDomain(email: string | null | undefined): DomainValidationResult {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      domain: '',
      email: '',
      errorMessage: 'No email address was provided by Google OAuth.',
    };
  }

  const cleanedEmail = email.trim().toLowerCase();

  // Basic structure check
  const atIndex = cleanedEmail.lastIndexOf('@');
  if (atIndex === -1 || atIndex === 0 || atIndex === cleanedEmail.length - 1) {
    return {
      isValid: false,
      domain: '',
      email: cleanedEmail,
      errorMessage: 'Invalid email address format.',
    };
  }

  const userDomain = cleanedEmail.slice(atIndex + 1);

  // Super User exemption (evaluator / system administrator override)
  if (SUPER_USER_EMAILS.some(su => su.toLowerCase() === cleanedEmail)) {
    return {
      isValid: true,
      domain: userDomain,
      email: cleanedEmail,
    };
  }

  if (userDomain !== ALLOWED_DOMAIN) {
    return {
      isValid: false,
      domain: userDomain,
      email: cleanedEmail,
      errorMessage: DOMAIN_RESTRICTION_ERROR_MESSAGE,
    };
  }

  return {
    isValid: true,
    domain: userDomain,
    email: cleanedEmail,
  };
}

/**
 * Helper to safely extract domain from an email
 */
export function extractDomain(email: string): string {
  if (!email || !email.includes('@')) return '';
  return email.trim().toLowerCase().split('@').pop() || '';
}

/**
 * Quick boolean check if an email matches the allowed domain
 */
export function isAllowedDomain(email: string): boolean {
  return validateEmailDomain(email).isValid;
}

