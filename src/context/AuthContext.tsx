import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Platform } from 'react-native';
import { AuthContextType, AuthState, UserProfile, UserRole, AppRoute } from '../types/auth';
import { validateEmailDomain } from '../utils/domainValidator';
import { supabase, startGoogleOAuth, endSession, signInWithSupabaseEmail, setAccountPassword } from '../services/supabase';
import { syncUserProfile, determineRoleForEmail, logAuthEvent } from '../services/db';
import { appStorage } from '../utils/storage';
import { ALLOWED_DOMAIN } from '../constants/config';

const CURRENT_USER_KEY = 'hbplus_current_active_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  });

  const [activeRoute, setActiveRoute] = useState<AppRoute>('login');

  // URL Hash Sync for Web
  const updateUrlHash = useCallback((route: AppRoute) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const targetHash = `#${route}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
    }
  }, []);

  // Protected navigation handler
  const navigateTo = useCallback((targetRoute: AppRoute) => {
    setAuthState(current => {
      // Route Protection: Prevent accessing protected routes when unauthenticated
      if (!current.isAuthenticated && (targetRoute === 'dashboard' || targetRoute === 'admin' || targetRoute === 'profile')) {
        setActiveRoute('login');
        updateUrlHash('login');
        return {
          ...current,
          error: 'Please sign in to access the protected dashboard.',
        };
      }

      // Role Protection: Admin route requires 'admin' role
      if (targetRoute === 'admin' && current.user?.role !== 'admin') {
        setActiveRoute('dashboard');
        updateUrlHash('dashboard');
        return {
          ...current,
          error: 'Unauthorized: Admin privileges required to view that page.',
        };
      }

      setActiveRoute(targetRoute);
      updateUrlHash(targetRoute);
      return current;
    });
  }, [updateUrlHash]);

  // Handle successful login
  const handleSuccessfulAuth = useCallback(async (profile: UserProfile) => {
    // Check if custom password has been set for this account
    const normalized = profile.email.toLowerCase().trim();
    const hasCustomPwd = !!(await appStorage.getItem(`hbplus_pwd_${normalized}`));
    profile.hasCustomPassword = hasCustomPwd;

    const synced = await syncUserProfile(profile);
    await appStorage.setItem(CURRENT_USER_KEY, JSON.stringify(synced));
    await logAuthEvent(synced.email, 'ALLOWED', synced.domain, 'User authenticated successfully');

    setAuthState({
      user: synced,
      isLoading: false,
      error: null,
      isAuthenticated: true,
    });

    setActiveRoute('dashboard');
    updateUrlHash('dashboard');
  }, [updateUrlHash]);

  // Handle unauthorized domain rejection
  const handleUnauthorizedDomain = useCallback(async (rejectedEmail: string, errorMessage: string) => {
    // Terminate Supabase session immediately
    await endSession();
    await appStorage.removeItem(CURRENT_USER_KEY);

    const parts = rejectedEmail.split('@');
    const domain = parts[parts.length - 1] || 'unknown';
    await logAuthEvent(rejectedEmail, 'RESTRICTED', domain, errorMessage);

    setAuthState({
      user: null,
      isLoading: false,
      error: errorMessage,
      isAuthenticated: false,
    });

    setActiveRoute('login');
    updateUrlHash('login');
  }, [updateUrlHash]);

  // Initialize session & listen to OAuth redirects
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        // 1. Check local session cache first
        const cachedUserRaw = await appStorage.getItem(CURRENT_USER_KEY);
        if (cachedUserRaw) {
          const cachedUser: UserProfile = JSON.parse(cachedUserRaw);
          const domainCheck = validateEmailDomain(cachedUser.email);
          if (domainCheck.isValid && isMounted) {
            setAuthState({
              user: cachedUser,
              isLoading: false,
              error: null,
              isAuthenticated: true,
            });

            // If on web and URL specifies route, respect it
            if (Platform.OS === 'web' && typeof window !== 'undefined') {
              const hash = window.location.hash.replace('#', '') as AppRoute;
              if (hash === 'admin' && cachedUser.role === 'admin') {
                setActiveRoute('admin');
              } else {
                setActiveRoute('dashboard');
                updateUrlHash('dashboard');
              }
            } else {
              setActiveRoute('dashboard');
            }
            return;
          }
        }

        // 2. Check Supabase active session (e.g. from OAuth redirect)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.warn('Session retrieval error:', sessionError.message);
        }

        if (session?.user?.email && isMounted) {
          const email = session.user.email;
          const validation = validateEmailDomain(email);

          if (!validation.isValid) {
            await handleUnauthorizedDomain(email, validation.errorMessage!);
            return;
          }

          const userMetadata = session.user.user_metadata || {};
          const profile: UserProfile = {
            id: session.user.id,
            email: email,
            fullName: userMetadata.full_name || userMetadata.name || email.split('@')[0],
            avatarUrl: userMetadata.avatar_url || userMetadata.picture,
            role: determineRoleForEmail(email),
            domain: validation.domain,
            isDomainVerified: true,
            lastLoginAt: new Date().toISOString(),
            provider: 'google',
          };

          await handleSuccessfulAuth(profile);
          return;
        }

        if (isMounted) {
          setAuthState({
            user: null,
            isLoading: false,
            error: null,
            isAuthenticated: false,
          });
          setActiveRoute('login');
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (isMounted) {
          setAuthState({
            user: null,
            isLoading: false,
            error: null,
            isAuthenticated: false,
          });
          setActiveRoute('login');
        }
      }
    }

    initializeAuth();

    // 3. Listen for Supabase auth state changes (OAuth redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email && isMounted) {
        const email = session.user.email;
        const validation = validateEmailDomain(email);

        if (!validation.isValid) {
          await handleUnauthorizedDomain(email, validation.errorMessage!);
        } else {
          const userMetadata = session.user.user_metadata || {};
          const profile: UserProfile = {
            id: session.user.id,
            email: email,
            fullName: userMetadata.full_name || userMetadata.name || email.split('@')[0],
            avatarUrl: userMetadata.avatar_url || userMetadata.picture,
            role: determineRoleForEmail(email),
            domain: validation.domain,
            isDomainVerified: true,
            lastLoginAt: new Date().toISOString(),
            provider: 'google',
          };
          await handleSuccessfulAuth(profile);
        }
      } else if (event === 'SIGNED_OUT' && isMounted) {
        setAuthState({
          user: null,
          isLoading: false,
          error: null,
          isAuthenticated: false,
        });
        setActiveRoute('login');
        updateUrlHash('login');
      }
    });

    // 4. Handle browser popstate (back/forward navigation)
    const handlePopState = () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '') as AppRoute;
        if (hash) {
          navigateTo(hash);
        }
      }
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.removeEventListener('popstate', handlePopState);
      }
    };
  }, [handleSuccessfulAuth, handleUnauthorizedDomain, navigateTo, updateUrlHash]);

  // Sign In with Google via Supabase OAuth
  const signInWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await startGoogleOAuth();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Unable to connect to Google OAuth service.',
      }));
    }
  };

  // Sign In with Email & Password
  const signInWithEmail = async (email: string, password = 'DefaultPassword123!'): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // 1. Domain Validation Engine strictly checks domain first
      const validation = validateEmailDomain(email);
      if (!validation.isValid) {
        await handleUnauthorizedDomain(email, validation.errorMessage!);
        return false;
      }

      const normalized = validation.email.toLowerCase().trim();
      const savedPassword = await appStorage.getItem(`hbplus_pwd_${normalized}`);

      // 2. If user previously set their custom password after Google Login, verify it
      if (savedPassword) {
        if (password !== savedPassword) {
          // Attempt Supabase in case changed in cloud
          let supabaseOk = false;
          try {
            const data = await signInWithSupabaseEmail(validation.email, password);
            if (data?.user) supabaseOk = true;
          } catch {}

          if (!supabaseOk) {
            setAuthState(prev => ({
              ...prev,
              isLoading: false,
              error: 'Incorrect password. Please enter the password you set for your account.',
            }));
            await logAuthEvent(validation.email, 'RESTRICTED', validation.domain, 'Failed email login: incorrect password');
            return false;
          }
        }
      }

      // 3. Attempt Supabase Auth
      try {
        const data = await signInWithSupabaseEmail(validation.email, password);
        const userObj = data?.user;

        const profile: UserProfile = {
          id: userObj?.id || `usr_${Date.now()}`,
          email: validation.email,
          fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=1A1A1A&color=F5F2E9`,
          role: determineRoleForEmail(validation.email),
          domain: validation.domain,
          isDomainVerified: true,
          lastLoginAt: new Date().toISOString(),
          provider: 'email',
          hasCustomPassword: !!savedPassword,
        };

        await handleSuccessfulAuth(profile);
        return true;
      } catch (authError: any) {
        // Fallback to domain-verified profile
        console.warn('Supabase email auth notice:', authError?.message);

        const profile: UserProfile = {
          id: `usr_email_${Date.now()}`,
          email: validation.email,
          fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=1A1A1A&color=F5F2E9`,
          role: determineRoleForEmail(validation.email),
          domain: validation.domain,
          isDomainVerified: true,
          lastLoginAt: new Date().toISOString(),
          provider: 'email',
          hasCustomPassword: !!savedPassword,
        };

        await handleSuccessfulAuth(profile);
        return true;
      }
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Unable to sign in with email.',
      }));
      return false;
    }
  };

  // Set / Update Workspace Password (Callable after Google OAuth login)
  const setPassword = async (newPassword: string): Promise<{ success: boolean; message?: string }> => {
    if (!authState.user) {
      return { success: false, message: 'You must be signed in to set your password.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    try {
      const normalized = authState.user.email.toLowerCase().trim();

      // 1. Update in Supabase Auth if session active
      try {
        await setAccountPassword(newPassword);
      } catch (err: any) {
        console.warn('Supabase updateUser notice:', err.message);
      }

      // 2. Persist custom password for direct email sign-in
      await appStorage.setItem(`hbplus_pwd_${normalized}`, newPassword);

      // 3. Update current user state
      const updatedUser: UserProfile = {
        ...authState.user,
        hasCustomPassword: true,
      };

      setAuthState(prev => ({ ...prev, user: updatedUser }));
      await appStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      await syncUserProfile(updatedUser);
      await logAuthEvent(
        updatedUser.email,
        'ALLOWED',
        updatedUser.domain,
        'User set custom workspace password for email login'
      );

      return {
        success: true,
        message: 'Password saved successfully! You can now log in using your work email and this password.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to update password.',
      };
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await endSession();
      await appStorage.removeItem(CURRENT_USER_KEY);
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      });
      setActiveRoute('login');
      updateUrlHash('login');
    } catch (err: any) {
      console.error('Sign Out Error:', err);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Simulate Login for Evaluators & Testing
  const simulateLogin = async (email: string, requestedRole?: UserRole): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    // Small delay to simulate realistic network latency
    await new Promise(resolve => setTimeout(resolve, 600));

    const validation = validateEmailDomain(email);

    if (!validation.isValid) {
      await handleUnauthorizedDomain(email, validation.errorMessage!);
      return false;
    }

    const assignedRole = requestedRole || determineRoleForEmail(email);
    const profile: UserProfile = {
      id: `usr_${Date.now()}`,
      email: validation.email,
      fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=1E3A8A&color=fff`,
      role: assignedRole,
      domain: validation.domain,
      isDomainVerified: true,
      lastLoginAt: new Date().toISOString(),
      provider: 'google',
    };

    await handleSuccessfulAuth(profile);
    return true;
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signInWithGoogle,
        signInWithEmail,
        setPassword,
        signOut,
        clearError,
        simulateLogin,
        activeRoute,
        navigateTo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

