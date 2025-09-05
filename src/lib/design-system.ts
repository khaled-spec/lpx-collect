// Comprehensive Design System Tokens
export const tokens = {
  // ============================================
  // COLORS
  // ============================================
  colors: {
    // Brand colors
    brand: {
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",
      accent: "hsl(var(--accent))",
      muted: "hsl(var(--muted))",
    },

    // Semantic colors
    semantic: {
      success: "hsl(142 76% 36%)",
      warning: "hsl(38 92% 50%)",
      error: "hsl(var(--destructive))",
      info: "hsl(199 89% 48%)",
    },

    // Gray scale
    gray: {
      50: "hsl(210 40% 98%)",
      100: "hsl(210 40% 96%)",
      200: "hsl(214 32% 91%)",
      300: "hsl(213 27% 84%)",
      400: "hsl(215 20% 65%)",
      500: "hsl(215 16% 47%)",
      600: "hsl(215 19% 35%)",
      700: "hsl(215 25% 27%)",
      800: "hsl(217 33% 17%)",
      900: "hsl(222 47% 11%)",
      950: "hsl(229 84% 5%)",
    },
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    // Font families
    fonts: {
      sans: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      mono: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace',
      serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    },

    // Font sizes with line heights
    fontSize: {
      "2xs": { size: "0.625rem", lineHeight: "0.75rem" }, // 10px
      xs: { size: "0.75rem", lineHeight: "1rem" }, // 12px
      sm: { size: "0.875rem", lineHeight: "1.25rem" }, // 14px
      base: { size: "1rem", lineHeight: "1.5rem" }, // 16px
      lg: { size: "1.125rem", lineHeight: "1.75rem" }, // 18px
      xl: { size: "1.25rem", lineHeight: "1.75rem" }, // 20px
      "2xl": { size: "1.5rem", lineHeight: "2rem" }, // 24px
      "3xl": { size: "1.875rem", lineHeight: "2.25rem" }, // 30px
      "4xl": { size: "2.25rem", lineHeight: "2.5rem" }, // 36px
      "5xl": { size: "3rem", lineHeight: "1" }, // 48px
      "6xl": { size: "3.75rem", lineHeight: "1" }, // 60px
      "7xl": { size: "4.5rem", lineHeight: "1" }, // 72px
      "8xl": { size: "6rem", lineHeight: "1" }, // 96px
    },

    // Font weights
    fontWeight: {
      thin: "100",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },

    // Letter spacing
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  // ============================================
  // SPACING
  // ============================================
  spacing: {
    // Base spacing scale (4px base)
    0: "0px",
    px: "1px",
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    3.5: "0.875rem", // 14px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    7: "1.75rem", // 28px
    8: "2rem", // 32px
    9: "2.25rem", // 36px
    10: "2.5rem", // 40px
    11: "2.75rem", // 44px
    12: "3rem", // 48px
    14: "3.5rem", // 56px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    28: "7rem", // 112px
    32: "8rem", // 128px
    36: "9rem", // 144px
    40: "10rem", // 160px
    44: "11rem", // 176px
    48: "12rem", // 192px
    52: "13rem", // 208px
    56: "14rem", // 224px
    60: "15rem", // 240px
    64: "16rem", // 256px
    72: "18rem", // 288px
    80: "20rem", // 320px
    96: "24rem", // 384px
  },

  // ============================================
  // SIZING
  // ============================================
  sizing: {
    // Component sizes
    components: {
      button: {
        height: {
          xs: "1.75rem", // 28px
          sm: "2rem", // 32px
          md: "2.25rem", // 36px
          lg: "2.5rem", // 40px
          xl: "3rem", // 48px
        },
        padding: {
          xs: "0.5rem",
          sm: "0.75rem",
          md: "1rem",
          lg: "1.5rem",
          xl: "2rem",
        },
      },
      input: {
        height: {
          xs: "2rem", // 32px
          sm: "2.25rem", // 36px
          md: "2.5rem", // 40px
          lg: "2.75rem", // 44px
          xl: "3rem", // 48px
        },
      },
      card: {
        padding: {
          xs: "0.75rem",
          sm: "1rem",
          md: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
        },
      },
      icon: {
        xs: "1rem", // 16px
        sm: "1.25rem", // 20px
        md: "1.5rem", // 24px
        lg: "2rem", // 32px
        xl: "2.5rem", // 40px
      },
    },

    // Container widths
    container: {
      xs: "20rem", // 320px
      sm: "24rem", // 384px
      md: "28rem", // 448px
      lg: "32rem", // 512px
      xl: "36rem", // 576px
      "2xl": "42rem", // 672px
      "3xl": "48rem", // 768px
      "4xl": "56rem", // 896px
      "5xl": "64rem", // 1024px
      "6xl": "72rem", // 1152px
      "7xl": "80rem", // 1280px
      full: "100%",
    },
  },

  // ============================================
  // BORDERS
  // ============================================
  borders: {
    // Border widths
    width: {
      0: "0px",
      DEFAULT: "1px",
      2: "2px",
      4: "4px",
      8: "8px",
    },

    // Border radius
    radius: {
      none: "0px",
      sm: "0.125rem", // 2px
      DEFAULT: "0.25rem", // 4px
      md: "0.375rem", // 6px
      lg: "0.5rem", // 8px
      xl: "0.75rem", // 12px
      "2xl": "1rem", // 16px
      "3xl": "1.5rem", // 24px
      full: "9999px",
    },
  },

  // ============================================
  // SHADOWS
  // ============================================
  shadows: {
    // Box shadows
    elevation: {
      none: "none",
      xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    },

    // Colored shadows
    colored: {
      primary: "0 10px 40px -10px hsl(var(--primary) / 0.35)",
      success: "0 10px 40px -10px hsl(142 76% 36% / 0.35)",
      error: "0 10px 40px -10px hsl(var(--destructive) / 0.35)",
    },
  },

  // ============================================
  // ANIMATION
  // ============================================
  animation: {
    // Durations
    duration: {
      instant: "0ms",
      fast: "150ms",
      normal: "250ms",
      slow: "350ms",
      slower: "500ms",
      slowest: "1000ms",
    },

    // Easings
    easing: {
      linear: "linear",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },

    // Transitions
    transition: {
      all: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
      colors:
        "color, background-color, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)",
      opacity: "opacity 250ms cubic-bezier(0.4, 0, 0.2, 1)",
      shadow: "box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1)",
      transform: "transform 250ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  // ============================================
  // BREAKPOINTS
  // ============================================
  breakpoints: {
    xs: "475px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // ============================================
  // Z-INDEX
  // ============================================
  zIndex: {
    auto: "auto",
    0: "0",
    10: "10",
    20: "20",
    30: "30",
    40: "40",
    50: "50",
    dropdown: "1000",
    sticky: "1020",
    fixed: "1030",
    modalBackdrop: "1040",
    modal: "1050",
    popover: "1060",
    tooltip: "1070",
    notification: "1080",
  },

  // ============================================
  // OPACITY
  // ============================================
  opacity: {
    0: "0",
    5: "0.05",
    10: "0.1",
    20: "0.2",
    25: "0.25",
    30: "0.3",
    40: "0.4",
    50: "0.5",
    60: "0.6",
    70: "0.7",
    75: "0.75",
    80: "0.8",
    90: "0.9",
    95: "0.95",
    100: "1",
  },

  // ============================================
  // BLUR
  // ============================================
  blur: {
    none: "0",
    sm: "4px",
    DEFAULT: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "40px",
    "3xl": "64px",
  },
} as const;

// Export type definitions
export type ColorToken =
  | keyof typeof tokens.colors.brand
  | keyof typeof tokens.colors.semantic;
export type SpacingToken = keyof typeof tokens.spacing;
export type SizeToken = keyof typeof tokens.sizing.components.button.height;
export type RadiusToken = keyof typeof tokens.borders.radius;
export type ShadowToken = keyof typeof tokens.shadows.elevation;
export type DurationToken = keyof typeof tokens.animation.duration;
export type EasingToken = keyof typeof tokens.animation.easing;
export type ZIndexToken = keyof typeof tokens.zIndex;
