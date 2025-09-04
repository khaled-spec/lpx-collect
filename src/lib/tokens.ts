/**
 * Comprehensive Design Token System
 * All design values should reference these tokens - no hardcoded values allowed
 */

export const tokens = {
  // ============================================
  // SPACING SYSTEM
  // ============================================
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
  },
  
  // ============================================
  // SIZING SYSTEM
  // ============================================
  sizes: {
    // Component sizes
    xs: '1.75rem',    // 28px
    sm: '2rem',       // 32px
    md: '2.25rem',    // 36px
    lg: '2.5rem',     // 40px
    xl: '3rem',       // 48px
    
    // Icon sizes
    icon: {
      xs: '0.875rem',  // 14px
      sm: '1rem',      // 16px
      md: '1.25rem',   // 20px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
    },
    
    // Container widths
    container: {
      xs: '20rem',     // 320px
      sm: '24rem',     // 384px
      md: '28rem',     // 448px
      lg: '32rem',     // 512px
      xl: '36rem',     // 576px
      '2xl': '42rem',  // 672px
      '3xl': '48rem',  // 768px
      '4xl': '56rem',  // 896px
      '5xl': '64rem',  // 1024px
      '6xl': '72rem',  // 1152px
      '7xl': '80rem',  // 1280px
      full: '100%',
    }
  },
  
  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    // Font sizes
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
      '8xl': '6rem',    // 96px
      '9xl': '8rem',    // 128px
    },
    
    // Line heights
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    
    // Font weights
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    
    // Letter spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  
  // ============================================
  // COLORS
  // ============================================
  colors: {
    // Brand colors
    primary: {
      DEFAULT: 'hsl(224, 0%, 9%)',
      foreground: 'hsl(224, 0%, 98%)',
      50: 'hsl(224, 0%, 98%)',
      100: 'hsl(224, 0%, 96%)',
      200: 'hsl(224, 0%, 90%)',
      300: 'hsl(224, 0%, 80%)',
      400: 'hsl(224, 0%, 63%)',
      500: 'hsl(224, 0%, 45%)',
      600: 'hsl(224, 0%, 32%)',
      700: 'hsl(224, 0%, 20%)',
      800: 'hsl(224, 0%, 15%)',
      900: 'hsl(224, 0%, 9%)',
      950: 'hsl(224, 0%, 4%)',
    },
    
    // Semantic colors
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    card: 'hsl(var(--card))',
    'card-foreground': 'hsl(var(--card-foreground))',
    popover: 'hsl(var(--popover))',
    'popover-foreground': 'hsl(var(--popover-foreground))',
    secondary: 'hsl(var(--secondary))',
    'secondary-foreground': 'hsl(var(--secondary-foreground))',
    muted: 'hsl(var(--muted))',
    'muted-foreground': 'hsl(var(--muted-foreground))',
    accent: 'hsl(var(--accent))',
    'accent-foreground': 'hsl(var(--accent-foreground))',
    destructive: 'hsl(var(--destructive))',
    'destructive-foreground': 'hsl(var(--destructive-foreground))',
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    
    // Status colors
    success: {
      DEFAULT: 'hsl(142, 76%, 36%)',
      light: 'hsl(142, 76%, 90%)',
      dark: 'hsl(142, 76%, 20%)',
    },
    warning: {
      DEFAULT: 'hsl(38, 92%, 50%)',
      light: 'hsl(38, 92%, 90%)',
      dark: 'hsl(38, 92%, 30%)',
    },
    error: {
      DEFAULT: 'hsl(352, 100%, 41%)',
      light: 'hsl(352, 100%, 90%)',
      dark: 'hsl(352, 100%, 30%)',
    },
    info: {
      DEFAULT: 'hsl(217, 91%, 60%)',
      light: 'hsl(217, 91%, 90%)',
      dark: 'hsl(217, 91%, 40%)',
    },
  },
  
  // ============================================
  // BORDER RADIUS
  // ============================================
  borderRadius: {
    none: '0px',
    sm: '0.125rem',    // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',     // 6px
    lg: '0.5rem',       // 8px
    xl: '0.75rem',      // 12px
    '2xl': '1rem',      // 16px
    '3xl': '1.5rem',    // 24px
    full: '9999px',
    // Use CSS variable for dynamic theming
    base: 'var(--radius)',
  },
  
  // ============================================
  // SHADOWS
  // ============================================
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  
  // ============================================
  // TRANSITIONS
  // ============================================
  transitions: {
    // Durations
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    
    // Easings
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    // Properties
    property: {
      none: 'none',
      all: 'all',
      colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
      opacity: 'opacity',
      shadow: 'box-shadow',
      transform: 'transform',
    },
  },
  
  // ============================================
  // Z-INDEX
  // ============================================
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modalBackdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
    notification: '1080',
    commandPalette: '1090',
    max: '9999',
  },
  
  // ============================================
  // BREAKPOINTS
  // ============================================
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
    '4xl': '2560px',
  },
  
  // ============================================
  // GRID
  // ============================================
  grid: {
    columns: {
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
    },
    gap: {
      xs: '0.5rem',    // 8px
      sm: '0.75rem',   // 12px
      md: '1rem',      // 16px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
      '2xl': '2.5rem', // 40px
      '3xl': '3rem',   // 48px
    },
  },
  
  // ============================================
  // ANIMATION
  // ============================================
  animation: {
    spin: 'spin 1s linear infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
    fadeIn: 'fadeIn 0.5s ease-in-out',
    slideUp: 'slideUp 0.3s ease-out',
    slideDown: 'slideDown 0.3s ease-out',
    slideLeft: 'slideLeft 0.3s ease-out',
    slideRight: 'slideRight 0.3s ease-out',
  },
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get a spacing value by key
 */
export const spacing = (key: keyof typeof tokens.spacing) => tokens.spacing[key];

/**
 * Get a color value
 */
export const color = (path: string) => {
  const keys = path.split('.');
  let value: any = tokens.colors;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) return undefined;
  }
  
  return value;
};

/**
 * Get a shadow value
 */
export const shadow = (key: keyof typeof tokens.shadows) => tokens.shadows[key];

/**
 * Get a border radius value
 */
export const radius = (key: keyof typeof tokens.borderRadius) => tokens.borderRadius[key];

/**
 * Get a font size value
 */
export const fontSize = (key: keyof typeof tokens.typography.fontSize) => tokens.typography.fontSize[key];

/**
 * Get a transition duration
 */
export const duration = (key: keyof typeof tokens.transitions.duration) => tokens.transitions.duration[key];

/**
 * Get a z-index value
 */
export const zIndex = (key: keyof typeof tokens.zIndex) => tokens.zIndex[key];

// ============================================
// CSS VARIABLES GENERATOR
// ============================================

export const generateCSSVariables = () => {
  return `
    :root {
      /* Spacing */
      ${Object.entries(tokens.spacing).map(([key, value]) => `--spacing-${key}: ${value};`).join('\n      ')}
      
      /* Sizes */
      ${Object.entries(tokens.sizes.icon).map(([key, value]) => `--size-icon-${key}: ${value};`).join('\n      ')}
      
      /* Typography */
      ${Object.entries(tokens.typography.fontSize).map(([key, value]) => `--font-size-${key}: ${value};`).join('\n      ')}
      ${Object.entries(tokens.typography.lineHeight).map(([key, value]) => `--line-height-${key}: ${value};`).join('\n      ')}
      ${Object.entries(tokens.typography.fontWeight).map(([key, value]) => `--font-weight-${key}: ${value};`).join('\n      ')}
      
      /* Border Radius */
      ${Object.entries(tokens.borderRadius).map(([key, value]) => `--radius-${key}: ${value};`).join('\n      ')}
      
      /* Shadows */
      ${Object.entries(tokens.shadows).map(([key, value]) => `--shadow-${key}: ${value};`).join('\n      ')}
      
      /* Transitions */
      ${Object.entries(tokens.transitions.duration).map(([key, value]) => `--duration-${key}: ${value};`).join('\n      ')}
      
      /* Z-Index */
      ${Object.entries(tokens.zIndex).map(([key, value]) => `--z-${key}: ${value};`).join('\n      ')}
    }
  `;
};

export default tokens;