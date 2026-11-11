import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/config';
import { appStorage } from '../utils/storage';

// Initialize Supabase Client with cross-platform storage adapter
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: appStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

/**
 * Initiates Google OAuth Sign-in flow.
 * - On Web: Redirects to Google authentication screen and returns back to the origin
 * - On Mobile: Uses deep linking redirect scheme
 */
export async function startGoogleOAuth(redirectTo?: string) {
  let redirectUrl = redirectTo;
  
  if (!redirectUrl) {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      redirectUrl = window.location.origin;
    } else {
      redirectUrl = 'hbplus://auth/callback';
    }
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Signs in using Email and Password via Supabase Auth
 */
export async function signInWithSupabaseEmail(email: string, password: string) {
  // First attempt standard sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // If user does not exist yet, attempt automatic sign up for the corporate domain
    if (error.message.toLowerCase().includes('invalid login credentials') || error.message.toLowerCase().includes('user not found')) {
      const signUpResult = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpResult.error) {
        throw signUpResult.error;
      }
      return signUpResult.data;
    }
    throw error;
  }

  return data;
}

/**
 * Updates or sets the password for the currently authenticated user in Supabase Auth
 */
export async function setAccountPassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Signs out the current user session from Supabase
 */
export async function endSession() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.warn('Supabase signOut notice:', error.message);
  }
}

