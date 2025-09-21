// Compatibility layer for existing designTokens usage
// This provides backward compatibility while we migrate to the new token structure

import { tokens } from "./tokens";

// Create compatibility layer matching the old designTokens structure
export const designTokens = {
  // Typography mappings
  typography: {
    h1: "text-5xl font-bold tracking-tight",
    h2: "text-4xl font-bold tracking-tight",
    h3: "text-3xl font-bold tracking-tight",
    h4: "text-2xl font-bold tracking-tight",
    h5: "text-xl font-bold tracking-tight",
    h6: "text-lg font-bold tracking-tight",
    bodyLarge: "text-lg",
    body: "text-base",
    bodySmall: "text-sm",
    caption: "text-xs",
  },

  // Colors - mapped from new token structure
  colors: {
    // Status colors
    status: {
      success: tokens.colors.semantic.status.success.DEFAULT,
      warning: tokens.colors.semantic.status.warning.DEFAULT,
      error: tokens.colors.semantic.status.error.DEFAULT,
      info: tokens.colors.semantic.status.info.DEFAULT,
    },
    // Text colors
    text: {
      primary: "text-foreground",
      secondary: "text-muted-foreground",
      muted: "text-muted-foreground",
    },
    // Condition colors (for badges)
    condition: {
      mint: tokens.colors.primitive.green[500],
      nearMint: tokens.colors.primitive.green[400],
      excellent: tokens.colors.primitive.blue[500],
      good: tokens.colors.primitive.yellow[500],
      fair: tokens.colors.primitive.yellow[600],
      poor: tokens.colors.primitive.red[500],
    },
    // Badge colors
    badge: {
      new: "bg-emerald-500 text-white",
      featured: "bg-amber-500 text-white",
      sale: "bg-red-500 text-white",
    },
  },

  // Badge styles
  badge: {
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    new: "bg-emerald-500 text-white",
    featured: "bg-amber-500 text-white",
    sale: "bg-red-500 text-white",
  },

  // Spacing
  spacing: {
    xs: tokens.spacing.scale[1],
    sm: tokens.spacing.scale[2],
    md: tokens.spacing.scale[4],
    lg: tokens.spacing.scale[6],
    xl: tokens.spacing.scale[8],
    page: {
      padding: {
        xs: tokens.spacing.scale[4],
        sm: tokens.spacing.scale[6],
        md: tokens.spacing.scale[8],
        lg: tokens.spacing.scale[12],
      },
    },
  },

  // Container
  container: {
    default: tokens.spacing.container.sm,
    sm: tokens.spacing.container.sm,
    md: tokens.spacing.container.md,
    lg: tokens.spacing.container.lg,
    xl: tokens.spacing.container.xl,
  },
};

// Re-export the new tokens as well for migration
export { tokens, tokens as newTokens } from "./tokens";
