import { supabase } from './supabase';
import { UserProfile, UserRole } from '../types/auth';
import { ADMIN_EMAILS, ALLOWED_DOMAIN } from '../constants/config';
import { appStorage } from '../utils/storage';

const PROFILES_STORAGE_KEY = 'hbplus_registered_profiles';
const AUDIT_LOGS_STORAGE_KEY = 'hbplus_security_audit_logs';

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
  if (ADMIN_EMAILS.includes(normalized) || normalized.startsWith('admin@')) {
    return 'admin';
  }
  return 'user';
}

/**
 * Persists user profile to database (Supabase table 'profiles' with fallback to cache)
 */
export async function syncUserProfile(profile: UserProfile): Promise<UserProfile> {
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
 * Updates a user's role (Admin functionality)
 */
export async function updateUserRole(userId: string, newRole: UserRole): Promise<void> {
  const profiles = await getAllUserProfiles();
  const updated = profiles.map(p => p.id === userId ? { ...p, role: newRole } : p);
  await appStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updated));

  try {
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
  } catch {}
}

async function saveProfileLocally(profile: UserProfile): Promise<void> {
  try {
    const profiles = await getAllUserProfiles();
    const index = profiles.findIndex(p => p.id === profile.id || p.email === profile.email);
    if (index >= 0) {
      profiles[index] = profile;
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

