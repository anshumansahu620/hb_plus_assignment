/**
 * Design Tokens matching the official HB+ Brand (https://hbplus.fit/):
 * Extracted directly from example.html (Framer site).
 * Warm luxury wellness cream (#F5F2E9), Rich Onyx (#1A1A1A), 
 * Signature Terracotta (#9F4022), and Warm Sand (#EDEAE7 / #DAD3CE).
 */
export const THEME = {
  colors: {
    // HB+ Official Core Brand Colors (from example.html)
    cream: '#F5F2E9',              // Main page canvas (--token-de1a3a5a-1b37-4a90-b65a-50b0604a7d8a)
    creamDark: '#EDEAE7',          // Warm stone/sand card background (--token-dbc7086f-78f2-4fb8-8e17-180925f9d132)
    sandLight: '#F4F2F0',          // Subtle sand tint (--token-caf11e93-356d-47e9-bfac-1c0ae08d458b)
    cardBorder: '#DAD3CE',         // Warm sand hairline border (--token-d8a72793-a1f4-42d6-b32f-e677b73f5d5c)

    onyx: '#1A1A1A',               // Primary text & dark accents (--token-98ebc7ad-d789-4050-894b-3168f6f6c2d0)
    onyxDeep: '#111111',           // Pure charcoal
    terracotta: '#9F4022',         // Signature CTA button & accent (--token-2ec42960-b9c3-4efc-9a56-7ac25a33578c)
    terracottaHover: '#87341B',    // Pressed / hover state
    terracottaLight: 'rgba(159, 64, 34, 0.08)',
    tealAccent: '#619FA3',         // Soft coastal teal (--token-40f6bade-262a-4cb9-9f41-c76a47fed416)
    limeAccent: '#F0FF00',         // Electric energetic lime

    // Primary action alias (Terracotta is the official HB+ button color from example.html)
    primary: '#9F4022',
    primaryHover: '#87341B',
    primaryLight: 'rgba(159, 64, 34, 0.08)',
    border: '#DAD3CE',

    // Backward-compatibility aliases
    forestGreenDark: '#111111',
    forestGreen: '#1A1A1A',
    forestGreenCard: '#EDEAE7',
    forestGreenLight: '#2C2C2C',
    forestGreenHighlight: '#9F4022',

    // Surfaces & Backgrounds
    background: '#F5F2E9',        // Official warm cream
    surface: '#FFFFFF',
    surfaceSubtle: '#FAF8F5',
    card: '#FFFFFF',
    divider: '#DAD3CE',

    // Text colors
    textPrimary: '#1A1A1A',       // Rich onyx
    textSecondary: '#636363',     // Muted gray (--token-a4e15d40-f485-4830-b24f-df7ea79c60bd)
    textMuted: '#999999',
    textLight: '#F5F2E9',
    textLightMuted: '#DAD3CE',

    // Neutral & Status Badges (Zero Green - Warm Sand & Onyx)
    sageBg: '#EDEAE7',
    sageBorder: '#DAD3CE',
    sageText: '#1A1A1A',

    success: '#1A1A1A',
    successBg: '#FAF8F5',
    successBorder: '#DAD3CE',
    successText: '#1A1A1A',

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
    md: 8,           // Button border-radius in example.html
    lg: 12,
    xl: 16,
    card: 20,        // Card border-radius in example.html
    xxl: 24,
    full: 9999,
  },

  typography: {
    fontFamily: {
      sans: "'DM Sans', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      serif: "'The Seasons', 'The Seasons Bold', 'The Seasons Regular', 'Georgia', 'Times New Roman', serif",
      gilroy: "'Gilroy', 'Gilroy-Bold', 'Gilroy-Medium', 'DM Sans', sans-serif",
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
