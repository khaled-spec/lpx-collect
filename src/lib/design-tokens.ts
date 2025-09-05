export const designTokens = {
  // Container sizes
  container: {
    xs: "max-w-screen-sm", // 640px
    sm: "max-w-screen-md", // 768px
    md: "max-w-screen-lg", // 1024px
    lg: "max-w-screen-xl", // 1280px
    xl: "max-w-screen-2xl", // 1536px
    full: "max-w-full",
    default: "max-w-7xl", // 1280px with custom max
  },

  // Button sizes
  button: {
    sizes: {
      xs: "h-7 px-2 text-xs",
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-10 px-6 text-base",
      xl: "h-12 px-8 text-lg",
    },
    iconSizes: {
      xs: "h-7 w-7",
      sm: "h-8 w-8",
      md: "h-9 w-9",
      lg: "h-10 w-10",
      xl: "h-12 w-12",
    },
  },

  // Spacing scale
  spacing: {
    section: {
      xs: "py-8",
      sm: "py-12",
      md: "py-16",
      lg: "py-20",
      xl: "py-24",
    },
    component: {
      xs: "p-2",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
    },
    gap: {
      xs: "gap-2",
      sm: "gap-3",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
  },

  // Border radius
  radius: {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  },

  // Font sizes
  fontSize: {
    xs: "text-xs", // 12px
    sm: "text-sm", // 14px
    base: "text-base", // 16px
    lg: "text-lg", // 18px
    xl: "text-xl", // 20px
    "2xl": "text-2xl", // 24px
    "3xl": "text-3xl", // 30px
    "4xl": "text-4xl", // 36px
    "5xl": "text-5xl", // 48px
    "6xl": "text-6xl", // 60px
  },

  // Headings
  heading: {
    h1: "text-4xl md:text-5xl lg:text-6xl font-bold",
    h2: "text-3xl md:text-4xl font-bold",
    h3: "text-2xl md:text-3xl font-semibold",
    h4: "text-xl md:text-2xl font-semibold",
    h5: "text-lg md:text-xl font-medium",
    h6: "text-base md:text-lg font-medium",
  },

  // Shadows
  shadow: {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
    inner: "shadow-inner",
  },

  // Transitions
  transition: {
    none: "",
    all: "transition-all",
    colors: "transition-colors",
    opacity: "transition-opacity",
    shadow: "transition-shadow",
    transform: "transition-transform",
  },

  // Durations
  duration: {
    fast: "duration-150",
    normal: "duration-200",
    slow: "duration-300",
    slower: "duration-500",
  },

  // Grid layouts
  grid: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
      6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    },
  },

  // Z-index scale
  zIndex: {
    base: "z-0",
    dropdown: "z-10",
    sticky: "z-20",
    fixed: "z-30",
    modalBackdrop: "z-40",
    modal: "z-50",
    popover: "z-60",
    tooltip: "z-70",
  },
} as const;

// Type exports for TypeScript support
export type ContainerSize = keyof typeof designTokens.container;
export type ButtonSize = keyof typeof designTokens.button.sizes;
export type SpacingSize = keyof typeof designTokens.spacing.section;
export type RadiusSize = keyof typeof designTokens.radius;
export type ShadowSize = keyof typeof designTokens.shadow;
export type GridCols = keyof typeof designTokens.grid.cols;
