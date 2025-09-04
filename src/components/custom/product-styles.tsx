// Standardized product container design tokens
export const productStyles = {
  // Container styles for consistent product cards
  container: {
    base: "overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group bg-card rounded-lg border border-border",
    hover: "hover:border-primary/20 hover:shadow-xl hover:scale-[1.02]",
    active: "active:scale-[0.98]",
    // Fixed heights for different variants
    height: {
      default: "h-[420px]",
      compact: "h-[360px]",
      large: "h-[480px]"
    }
  },
  
  // Image container with fixed dimensions
  imageContainer: {
    base: "relative bg-muted overflow-hidden flex-shrink-0",
    hover: "group-hover:bg-muted/80",
    // Fixed heights for image area (roughly 60% of card height)
    height: {
      default: "h-[240px]",
      compact: "h-[200px]",
      large: "h-[280px]"
    }
  },
  
  // Image styling with object-fit options
  image: {
    base: "w-full h-full transition-transform duration-500",
    hover: "group-hover:scale-110",
    // Object fit modes
    objectFit: {
      cover: "object-cover",     // Crop to fill (default)
      contain: "object-contain",  // Scale to fit
      fill: "object-fill",        // Stretch to fill
      scale: "object-scale-down"  // Scale down only if needed
    }
  },
  
  // Content padding and spacing
  content: {
    base: "p-4 space-y-2 flex flex-col",
    compact: "p-3 space-y-1.5 flex flex-col",
    large: "p-5 space-y-2.5 flex flex-col",
    // Fixed heights for content area to prevent flexing
    height: {
      default: "h-[180px]", // 420px - 240px image = 180px
      compact: "h-[160px]", // 360px - 200px image = 160px
      large: "h-[200px]"    // 480px - 280px image = 200px
    }
  },
  
  // Typography hierarchy
  typography: {
    category: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
    title: "font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors",
    vendor: "text-sm text-muted-foreground",
    price: {
      current: "text-lg font-bold text-foreground",
      original: "text-sm text-muted-foreground line-through",
      sale: "text-lg font-bold text-destructive"
    },
    meta: "text-xs text-muted-foreground"
  },
  
  // Badge positioning
  badges: {
    topLeft: "absolute top-2 left-2 z-10",
    topRight: "absolute top-2 right-2 z-10",
    bottomLeft: "absolute bottom-2 left-2 z-10",
    bottomRight: "absolute bottom-2 right-2 z-10"
  },
  
  // Interactive elements
  actions: {
    container: "absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300",
    buttonGroup: "absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0",
    button: "bg-background/95 backdrop-blur-sm border border-border shadow-lg hover:bg-background hover:shadow-xl transition-all duration-200"
  },
  
  // Overlay effects
  overlay: {
    gradient: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
    blur: "absolute inset-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
  },
  
  // Grid layouts
  grid: {
    base: "grid gap-6", // Removed auto-rows-fr since we use fixed heights
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
      6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
    }
  },
  
  // List view styles
  list: {
    container: "flex gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300",
    imageContainer: "w-32 h-32 flex-shrink-0 rounded-md overflow-hidden bg-muted",
    content: "flex-1 min-w-0 space-y-2",
    actions: "flex items-start gap-2"
  },
  
  // Loading states
  skeleton: {
    container: "animate-pulse",
    image: "bg-muted rounded-lg aspect-square",
    text: "h-4 bg-muted rounded",
    button: "h-8 w-8 bg-muted rounded"
  },
  
  // Status indicators
  status: {
    new: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    featured: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    sale: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    soldOut: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
    limited: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
  }
};

// Utility function to combine container classes
export const getProductClasses = (
  variant: 'default' | 'compact' | 'large' = 'default',
  className?: string
) => {
  const baseClasses = [
    productStyles.container.base,
    productStyles.container.height[variant], // Apply fixed height
    productStyles.container.hover,
    productStyles.container.active
  ].join(' ');
  
  return className ? `${baseClasses} ${className}` : baseClasses;
};

// Get content padding based on variant
export const getContentClasses = (variant: 'default' | 'compact' | 'large' = 'default') => {
  const baseContent = {
    'compact': productStyles.content.compact,
    'large': productStyles.content.large,
    'default': productStyles.content.base
  }[variant];
  
  const heightClass = productStyles.content.height[variant];
  
  return `${baseContent} ${heightClass}`;
};

// Get image container classes based on variant
export const getImageContainerClasses = (
  variant: 'default' | 'compact' | 'large' = 'default'
) => {
  return [
    productStyles.imageContainer.base,
    productStyles.imageContainer.height[variant],
    productStyles.imageContainer.hover
  ].join(' ');
};

// Get image classes with object fit mode
export const getImageClasses = (
  objectFit: keyof typeof productStyles.image.objectFit = 'contain'
) => {
  return [
    productStyles.image.base,
    productStyles.image.hover,
    productStyles.image.objectFit[objectFit]
  ].join(' ');
};