/**
 * Design Tokens matching the official Figma Prototype:
 * Forest Green (#0F382C) & Modern Sage (#F4F6F3) palette.
 */
export const THEME = {
  colors: {
    // Forest Green Theme from Figma
    forestGreenDark: '#0A261E',
    forestGreen: '#0F382C',        // Primary hero banner & left side
    forestGreenCard: '#154436',    // Inner dark card on hero
    forestGreenLight: '#1E5343',
    forestGreenHighlight: '#34D399',// Bright mint accent
    
    // Core brand aliases
    primary: '#0F382C',
    primaryHover: '#154436',
    primaryLight: '#E9EFE7',
    border: '#E3E8E1',
    
    // Backgrounds & Neutrals
    background: '#F4F6F3',         // Soft Sage/Cream background
    surface: '#FFFFFF',
    surfaceSubtle: '#F9FAF8',
    card: '#FFFFFF',
    cardBorder: '#E3E8E1',         // Clean subtle sage border
    divider: '#EBEFE9',
    
    // Text colors
    textPrimary: '#141E18',        // Deep forest-slate for high contrast
    textSecondary: '#4B5850',      // Muted sage-slate
    textMuted: '#8A978E',          // Light slate
    textLight: '#F3F6F2',          // Inverted text for dark green panels
    textLightMuted: '#95B8AB',     // Muted text for dark green panels
    
    // Sage Badges & Accents
    sageBg: '#E9EFE7',
    sageBorder: '#CDDBD8',
    sageText: '#154436',
    
    // Status colors
    success: '#10B981',
    successBg: '#ECFDF5',
    successBorder: '#A7F3D0',
    successText: '#065F46',
    
    error: '#DC2626',
    errorBg: '#FEF2F2',
    errorBorder: '#FECACA',
    errorText: '#991B1B',
    
    // Google Button
    googleBtnBg: '#FFFFFF',
    googleBtnBorder: '#D8DFD7',
    googleBtnText: '#202124',
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
    lg: 14,
    xl: 20,
    xxl: 28,
    full: 9999,
  },
  
  typography: {
    fontSize: {
      xs: 12,
      sm: 13,
      base: 15,
      lg: 18,
      xl: 22,
      xxl: 28,
      hero: 38,
    },
    fontWeight: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#0A261E',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#0A261E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 4,
    },
    lg: {
      shadowColor: '#0A261E',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.09,
      shadowRadius: 24,
      elevation: 8,
    },
  },
  
  breakpoints: {
    mobile: 600,
    tablet: 880,
    desktop: 1100,
  },
};
