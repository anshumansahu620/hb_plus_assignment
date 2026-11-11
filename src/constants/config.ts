/**
 * Application Configuration & Domain Whitelist Settings
 */

// Target domain required by the business problem
export const ALLOWED_DOMAIN = (
  process.env.EXPO_PUBLIC_ALLOWED_DOMAIN || 'hbplus.fit'
).trim().toLowerCase();

// Exact required error message from problem statement
export const DOMAIN_RESTRICTION_ERROR_MESSAGE =
  'Access restricted. Please login using your official domain email.';

// Supabase configuration
export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://uwklwnsrgbzkhpqcbqqj.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key_for_offline_mode';

// Admin emails for Role-Based Access Control
export const ADMIN_EMAILS = [
  `admin@${ALLOWED_DOMAIN}`,
  `security@${ALLOWED_DOMAIN}`,
  `rahul@${ALLOWED_DOMAIN}`,
];

// App branding
export const APP_CONFIG = {
  name: 'HB+ Security Portal',
  company: 'HB Plus',
  allowedDomain: ALLOWED_DOMAIN,
  supportEmail: `it-support@${ALLOWED_DOMAIN}`,
  version: '1.0.0',
};
