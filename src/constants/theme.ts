export const THEME = {
  colors: {
    primary: '#1E3A8A',       // Deep Royal Blue
    primaryHover: '#1D4ED8',  // Indigo accent
    primaryLight: '#EFF6FF',  // Soft blue tint
    accent: '#0D9488',        // Teal
    
    // Status colors
    success: '#10B981',       // Emerald (Allowed / Verified)
    successBg: '#ECFDF5',
    successBorder: '#A7F3D0',
    
    error: '#EF4444',         // Ruby Red (Access Restricted)
    errorBg: '#FEF2F2',
    errorBorder: '#FECACA',
    errorText: '#B91C1C',
    
    warning: '#F59E0B',
    warningBg: '#FFFBEB',
    
    // Backgrounds & Neutrals
    background: '#F8FAFC',    // Slate 50
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',    // Slate 200
    
    textPrimary: '#0F172A',   // Slate 900
    textSecondary: '#475569', // Slate 600
    textMuted: '#94A3B8',     // Slate 400
    
    border: '#E2E8F0',
    divider: '#F1F5F9',
    
    // Google Button styling
    googleBtnBg: '#FFFFFF',
    googleBtnBorder: '#DADCE0',
    googleBtnText: '#3C4043',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      hero: 32,
    },
    fontWeight: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 8,
    },
  },
  
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
  },
};
