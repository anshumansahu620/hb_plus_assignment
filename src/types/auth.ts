export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  domain: string;
  isDomainVerified: boolean;
  lastLoginAt: string;
  provider: string;
  hasCustomPassword?: boolean;
}

export interface DomainValidationResult {
  isValid: boolean;
  domain: string;
  email: string;
  errorMessage?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password?: string) => Promise<boolean>;
  setPassword: (newPassword: string) => Promise<{ success: boolean; message?: string }>;
  grantAdminAccess: (email: string) => Promise<{ success: boolean; message: string }>;
  revokeAdminAccess: (email: string) => Promise<{ success: boolean; message: string }>;
  elevateToAdmin: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  simulateLogin: (email: string, role?: UserRole) => Promise<boolean>;
  activeRoute: AppRoute;
  navigateTo: (route: AppRoute) => void;
}

export type AppRoute = 'login' | 'dashboard' | 'admin' | 'profile';

