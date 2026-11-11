/**
 * Design Tokens matching the official HB+ Brand (https://hbplus.fit/):
 * Extracted from example.html (Framer site) & Figma Portal design.
 * Warm luxury wellness cream (#F5F2E9), Rich Onyx (#1A1A1A), 
 * Signature Terracotta (#9F4022), and Forest Green (#0F382C).
 */
export const THEME = {
  colors: {
    // HB+ Official Core Brand Colors (from example.html)
    onyx: '#1A1A1A',              // Official dark charcoal / text
    onyxDeep: '#101703',          // Deep olive-onyx
    cream: '#F5F2E9',             // Signature warm sand/cream canvas
    creamDark: '#EDEAE7',         // Warm card background
    terracotta: '#9F4022',        // Official HB+ signature accent
    terracottaHover: '#87341B',
    tealAccent: '#619FA3',        // Soft coastal teal
    limeAccent: '#F0FF00',        // Electric energetic lime

    // Figma Portal Colors
    forestGreenDark: '#0A261E',
    forestGreen: '#0F382C',
    forestGreenCard: '#154436',
    forestGreenLight: '#1E5343',
    forestGreenHighlight: '#34D399',

    // Core Brand Aliases
    primary: '#1A1A1A',
    primaryHover: '#2A2A2A',
    primaryLight: '#EDEAE7',
    border: '#DAD3CE',

    // Surfaces & Backgrounds
    background: '#F5F2E9',        // Official warm cream
    surface: '#FFFFFF',
    surfaceSubtle: '#FAF8F5',
    card: '#FFFFFF',
    cardBorder: '#DAD3CE',        // Warm soft border from website
    divider: '#E5E0D8',

    // Text colors
    textPrimary: '#1A1A1A',       // Rich onyx
    textSecondary: '#636363',     // Muted gray
    textMuted: '#999999',
    textLight: '#F5F2E9',
    textLightMuted: '#D8D3C8',

    // Sage & Status Badges
    sageBg: '#E8EFE6',
    sageBorder: '#CDDBD8',
    sageText: '#154436',

    success: '#047857',
    successBg: '#ECFDF5',
    successBorder: '#A7F3D0',
    successText: '#065F46',

    error: '#DC2626',
    errorBg: '#FEF2F2',
    errorBorder: '#FECACA',
    errorText: '#991B1B',

    // Google Button
    googleBtnBg: '#FFFFFF',
    googleBtnBorder: '#DAD3CE',
    googleBtnText: '#1A1A1A',
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
    xl: 22,
    xxl: 30,
    full: 9999,
  },

  typography: {
    fontFamily: {
      sans: "'DM Sans', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'Fragment Mono', 'DM Mono', monospace",
    },
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
      shadowColor: '#1A1A1A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#1A1A1A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: '#1A1A1A',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.08,
      shadowRadius: 28,
      elevation: 8,
    },
  },

  breakpoints: {
    mobile: 600,
    tablet: 880,
    desktop: 1100,
  },
};
