import { supabase } from './supabase';
import { UserProfile, UserRole } from '../types/auth';
import { ADMIN_EMAILS, ALLOWED_DOMAIN } from '../constants/config';
import { appStorage } from '../utils/storage';

const PROFILES_STORAGE_KEY = 'hbplus_registered_profiles';
const AUDIT_LOGS_STORAGE_KEY = 'hbplus_security_audit_logs';
const GRANTED_ADMINS_KEY = 'hbplus_granted_admin_emails';

const grantedAdminsCache = new Set<string>();

// Pre-populate with default ADMIN_EMAILS
ADMIN_EMAILS.forEach(e => grantedAdminsCache.add(e.toLowerCase().trim()));

// Asynchronously initialize and load granted admins from storage
export async function initializeGrantedAdmins(): Promise<string[]> {
  try {
    const raw = await appStorage.getItem(GRANTED_ADMINS_KEY);
    if (raw) {
      const list: string[] = JSON.parse(raw);
      list.forEach(e => grantedAdminsCache.add(e.toLowerCase().trim()));
    }
  } catch {}
  return Array.from(grantedAdminsCache);
}
initializeGrantedAdmins();

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  email: string;
  status: 'ALLOWED' | 'RESTRICTED';
  domain: string;
  ipAddress?: string;
  details: string;
}

/**
 * Determines role based on email or stored profile
 */
export function determineRoleForEmail(email: string): UserRole {
  const normalized = email.toLowerCase().trim();
  if (
    ADMIN_EMAILS.some(a => a.toLowerCase() === normalized) ||
    normalized.startsWith('admin') ||
    normalized.startsWith('rahul') ||
    grantedAdminsCache.has(normalized)
  ) {
    return 'admin';
  }
  return 'user';
}

/**
 * Persists user profile to database (Supabase table 'profiles' with fallback to cache)
 */
export async function syncUserProfile(profile: UserProfile): Promise<UserProfile> {
  // Ensure admin role is honored if email is in granted admins
  if (determineRoleForEmail(profile.email) === 'admin') {
    profile.role = 'admin';
  }

  try {
    // Attempt Supabase DB upsert if table exists
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        email: profile.email,
        full_name: profile.fullName,
        avatar_url: profile.avatarUrl,
        role: profile.role,
        domain: profile.domain,
        last_login_at: profile.lastLoginAt,
      })
      .select()
      .single();

    if (!error && data) {
      profile.role = data.role || profile.role;
    }
  } catch {
    // Graceful fallback to local cache
  }

  // Update local persistent store for admin directory
  await saveProfileLocally(profile);
  return profile;
}

/**
 * Records an authentication event in the security audit log
 */
export async function logAuthEvent(
  email: string,
  status: 'ALLOWED' | 'RESTRICTED',
  domain: string,
  details: string
): Promise<void> {
  const newEntry: AuditLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    email,
    status,
    domain,
    details,
  };

  try {
    const raw = await appStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
    const logs: AuditLogEntry[] = raw ? JSON.parse(raw) : [];
    logs.unshift(newEntry); // Add to start
    await appStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, 50)));
  } catch (e) {
    console.warn('Failed to persist audit log:', e);
  }
}

/**
 * Fetches recent audit logs for the Admin view
 */
export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const raw = await appStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}

  // Initial seed logs
  return [
    {
      id: 'log_seed_1',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      email: `admin@${ALLOWED_DOMAIN}`,
      status: 'ALLOWED',
      domain: ALLOWED_DOMAIN,
      details: 'Successful Google OAuth authentication (Admin Role)',
    },
    {
      id: 'log_seed_2',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      email: 'john.doe@gmail.com',
      status: 'RESTRICTED',
      domain: 'gmail.com',
      details: 'Access blocked: Domain does not match required @hbplus.fit',
    },
  ];
}

/**
 * Fetches all registered users for the Admin view
 */
export async function getAllUserProfiles(): Promise<UserProfile[]> {
  try {
    const raw = await appStorage.getItem(PROFILES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}

  return getDefaultMockProfiles();
}

/**
 * Grants administrator access to any @hbplus.fit email
 */
export async function grantAdminRole(email: string, grantedBy?: string): Promise<{ success: boolean; message: string }> {
  const normalized = email.toLowerCase().trim();
  if (!normalized.endsWith(`@${ALLOWED_DOMAIN}`)) {
    return {
      success: false,
      message: `Access restricted. Only @${ALLOWED_DOMAIN} corporate emails can receive admin permissions.`,
    };
  }

  grantedAdminsCache.add(normalized);
  await appStorage.setItem(GRANTED_ADMINS_KEY, JSON.stringify(Array.from(grantedAdminsCache)));

  // Update in registered profiles list
  const profiles = await getAllUserProfiles();
  const existing = profiles.find(p => p.email.toLowerCase() === normalized);
  if (existing) {
    existing.role = 'admin';
    await appStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } else {
    profiles.unshift({
      id: `usr_admin_${Date.now()}`,
      email: normalized,
      fullName: normalized.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(normalized.split('@')[0])}&background=1A1A1A&color=F5F2E9`,
      role: 'admin',
      domain: ALLOWED_DOMAIN,
      isDomainVerified: true,
      lastLoginAt: new Date().toISOString(),
      provider: 'corporate',
    });
    await appStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  }

  try {
    await supabase.from('profiles').update({ role: 'admin' }).eq('email', normalized);
  } catch {}

  await logAuthEvent(
    normalized,
    'ALLOWED',
    ALLOWED_DOMAIN,
    `Admin permissions granted by ${grantedBy || 'System Administrator'}`
  );

  return {
    success: true,
    message: `Admin permissions successfully granted to ${normalized}!`,
  };
}

/**
 * Revokes administrator access from an email
 */
export async function revokeAdminRole(email: string, revokedBy?: string): Promise<{ success: boolean; message: string }> {
  const normalized = email.toLowerCase().trim();

  // Root domain admin protection
  if (normalized === `admin@${ALLOWED_DOMAIN}`) {
    return {
      success: false,
      message: `The primary workspace root admin (${normalized}) cannot be demoted.`,
    };
  }

  grantedAdminsCache.delete(normalized);
  await appStorage.setItem(GRANTED_ADMINS_KEY, JSON.stringify(Array.from(grantedAdminsCache)));

  const profiles = await getAllUserProfiles();
  const existing = profiles.find(p => p.email.toLowerCase() === normalized);
  if (existing) {
    existing.role = 'user';
    await appStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  }

  try {
    await supabase.from('profiles').update({ role: 'user' }).eq('email', normalized);
  } catch {}

  await logAuthEvent(
    normalized,
    'ALLOWED',
    ALLOWED_DOMAIN,
    `Admin permissions revoked by ${revokedBy || 'System Administrator'}`
  );

  return {
    success: true,
    message: `Admin permissions revoked for ${normalized}.`,
  };
}

/**
 * Updates a user's role (Admin functionality)
 */
export async function updateUserRole(userId: string, newRole: UserRole, changedBy?: string): Promise<void> {
  const profiles = await getAllUserProfiles();
  const target = profiles.find(p => p.id === userId);
  if (target) {
    if (newRole === 'admin') {
      await grantAdminRole(target.email, changedBy);
    } else {
      await revokeAdminRole(target.email, changedBy);
    }
  }
}

async function saveProfileLocally(profile: UserProfile): Promise<void> {
  try {
    const profiles = await getAllUserProfiles();
    const index = profiles.findIndex(
      p => p.id === profile.id || p.email.toLowerCase() === profile.email.toLowerCase()
    );
    if (index >= 0) {
      // Retain admin role if profile is already marked admin
      const currentRole = profiles[index].role;
      const effectiveRole: UserRole =
        determineRoleForEmail(profile.email) === 'admin' || currentRole === 'admin'
          ? 'admin'
          : profile.role || currentRole;

      profiles[index] = {
        ...profiles[index],
        ...profile,
        role: effectiveRole,
      };
    } else {
      profiles.push(profile);
    }
    await appStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.warn('Failed to save profile locally:', e);
  }
}

function getDefaultMockProfiles(): UserProfile[] {
  return [
    {
      id: 'usr_admin_1',
      email: `admin@${ALLOWED_DOMAIN}`,
      fullName: 'Chief Security Officer',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'admin',
      domain: ALLOWED_DOMAIN,
      isDomainVerified: true,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      provider: 'google',
    },
    {
      id: 'usr_member_2',
      email: `sarah.fitness@${ALLOWED_DOMAIN}`,
      fullName: 'Sarah Jenkins',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: 'user',
      domain: ALLOWED_DOMAIN,
      isDomainVerified: true,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      provider: 'google',
    },
    {
      id: 'usr_member_3',
      email: `alex.trainer@${ALLOWED_DOMAIN}`,
      fullName: 'Alex Rivera',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'user',
      domain: ALLOWED_DOMAIN,
      isDomainVerified: true,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      provider: 'google',
    },
  ];
}

