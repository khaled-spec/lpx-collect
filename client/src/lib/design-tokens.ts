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

  // Spacing scale - Semantic spacing tokens
  spacing: {
    // Base spacing units (for consistent spacing)
    xs: "0.5rem", // 8px
    sm: "1rem", // 16px
    md: "1.5rem", // 24px
    lg: "2rem", // 32px
    xl: "3rem", // 48px
    "2xl": "4rem", // 64px
    "3xl": "6rem", // 96px

    // Semantic spacing
    page: {
      padding: "px-6 py-8",
      container: "max-w-7xl mx-auto",
      section: "py-16",
    },
    card: {
      padding: "p-8",
      compact: "p-4",
      content: "p-6",
    },
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
    inline: {
      xs: "space-x-1",
      sm: "space-x-2",
      md: "space-x-3",
      lg: "space-x-4",
    },
    stack: {
      xs: "space-y-1",
      sm: "space-y-2",
      md: "space-y-4",
      lg: "space-y-6",
      xl: "space-y-8",
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
    card: "rounded-xl",
    button: "rounded-md",
    input: "rounded-md",
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

  // Typography presets
  typography: {
    // Headings
    h1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
    h2: "text-3xl md:text-4xl font-bold tracking-tight",
    h3: "text-2xl md:text-3xl font-semibold",
    h4: "text-xl md:text-2xl font-semibold",
    h5: "text-lg md:text-xl font-medium",
    h6: "text-base md:text-lg font-medium",

    // Page specific
    pageTitle: "text-2xl font-bold tracking-tight",
    pageSubtitle: "text-muted-foreground",
    sectionTitle: "text-xl font-semibold mb-4",

    // Content
    body: "text-base text-foreground",
    bodySmall: "text-sm text-foreground",
    caption: "text-xs text-muted-foreground",
    label: "text-sm font-medium",
    meta: "text-sm text-muted-foreground",

    // Links
    link: "text-primary hover:text-primary/80 transition-colors",
    linkSubtle: "hover:text-primary transition-colors",
  },

  // Heading semantic tokens (backwards compatibility)
  heading: {
    h1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
    h2: "text-3xl md:text-4xl font-bold tracking-tight",
    h3: "text-2xl md:text-3xl font-semibold",
    h4: "text-xl md:text-2xl font-semibold",
    h5: "text-lg md:text-xl font-medium",
    h6: "text-base md:text-lg font-medium",
    pageTitle: "text-2xl font-bold tracking-tight",
    pageTitleLarge: "text-3xl font-bold tracking-tight",
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
    card: "shadow-lg",
    dropdown: "shadow-xl",
  },

  // Transitions
  transition: {
    none: "",
    all: "transition-all",
    colors: "transition-colors",
    opacity: "transition-opacity",
    shadow: "transition-shadow",
    transform: "transition-transform",
    default: "transition-all duration-200",
  },

  // Durations
  duration: {
    instant: "duration-75",
    fast: "duration-150",
    normal: "duration-200",
    slow: "duration-300",
    slower: "duration-500",
  },

  // Animations
  animation: {
    fadeIn: "animate-in fade-in duration-200",
    fadeOut: "animate-out fade-out duration-150",
    slideInUp: "animate-in slide-in-from-bottom-2 duration-200",
    slideInDown: "animate-in slide-in-from-top-2 duration-200",
    slideInLeft: "animate-in slide-in-from-left-2 duration-200",
    slideInRight: "animate-in slide-in-from-right-2 duration-200",
    pulse: "animate-pulse",
    spin: "animate-spin",
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
    productGrid: {
      default:
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
      compact:
        "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
      list: "grid-cols-1",
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
    header: "z-50",
  },

  // Semantic colors (using CSS variables)
  colors: {
    // Backgrounds
    background: {
      primary: "bg-background",
      secondary: "bg-muted",
      accent: "bg-accent",
      card: "bg-card",
      input: "bg-background",
      overlay: "bg-black/50",
    },
    // Text colors
    text: {
      primary: "text-foreground",
      secondary: "text-muted-foreground",
      accent: "text-accent-foreground",
      inverse: "text-background",
      link: "text-primary",
    },
    // Border colors
    border: {
      default: "border-border",
      muted: "border-muted",
      accent: "border-accent",
      input: "border-input",
    },
    // Semantic status colors
    status: {
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      error: "text-red-600 dark:text-red-400",
      info: "text-blue-600 dark:text-blue-400",
    },
    badge: {
      success:
        "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      warning:
        "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
      error: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      featured:
        "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
      new: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      sale: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    },
    condition: {
      mint: "bg-green-500",
      nearMint: "bg-emerald-500",
      excellent: "bg-blue-500",
      good: "bg-indigo-500",
      fair: "bg-yellow-500",
      poor: "bg-gray-500",
    },
    rarity: {
      common: "bg-gray-500",
      uncommon: "bg-green-500",
      rare: "bg-blue-500",
      epic: "bg-purple-500",
      legendary: "bg-orange-500",
      mythic: "bg-red-500",
    },
    // Alert backgrounds
    alert: {
      success:
        "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
      warning:
        "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
      error: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
      info: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    },
  },

  // Standard paddings for consistency
  padding: {
    page: "px-4 sm:px-6 lg:px-8",
    section: "py-8 sm:py-12 lg:py-16",
    card: "p-4 sm:p-6",
    button: "px-4 py-2",
    input: "px-3 py-2",
  },

  // Standard margins
  margin: {
    section: "my-8 sm:my-12 lg:my-16",
    element: "my-4",
    text: "my-2",
  },
} as const;

// Type exports for TypeScript support
export type ContainerSize = keyof typeof designTokens.container;
export type ButtonSize = keyof typeof designTokens.button.sizes;
export type SpacingSize = keyof typeof designTokens.spacing.section;
export type RadiusSize = keyof typeof designTokens.radius;
export type ShadowSize = keyof typeof designTokens.shadow;
export type GridCols = keyof typeof designTokens.grid.cols;
