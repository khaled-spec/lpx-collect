import { tokens } from './design-system';
import { cn } from './utils';

// ============================================
// SPACING UTILITIES
// ============================================

export const spacing = {
  p: (size: keyof typeof tokens.spacing) => `p-[${tokens.spacing[size]}]`,
  px: (size: keyof typeof tokens.spacing) => `px-[${tokens.spacing[size]}]`,
  py: (size: keyof typeof tokens.spacing) => `py-[${tokens.spacing[size]}]`,
  pt: (size: keyof typeof tokens.spacing) => `pt-[${tokens.spacing[size]}]`,
  pr: (size: keyof typeof tokens.spacing) => `pr-[${tokens.spacing[size]}]`,
  pb: (size: keyof typeof tokens.spacing) => `pb-[${tokens.spacing[size]}]`,
  pl: (size: keyof typeof tokens.spacing) => `pl-[${tokens.spacing[size]}]`,
  m: (size: keyof typeof tokens.spacing) => `m-[${tokens.spacing[size]}]`,
  mx: (size: keyof typeof tokens.spacing) => `mx-[${tokens.spacing[size]}]`,
  my: (size: keyof typeof tokens.spacing) => `my-[${tokens.spacing[size]}]`,
  mt: (size: keyof typeof tokens.spacing) => `mt-[${tokens.spacing[size]}]`,
  mr: (size: keyof typeof tokens.spacing) => `mr-[${tokens.spacing[size]}]`,
  mb: (size: keyof typeof tokens.spacing) => `mb-[${tokens.spacing[size]}]`,
  ml: (size: keyof typeof tokens.spacing) => `ml-[${tokens.spacing[size]}]`,
  gap: (size: keyof typeof tokens.spacing) => `gap-[${tokens.spacing[size]}]`,
};

// ============================================
// TYPOGRAPHY UTILITIES
// ============================================

export const typography = {
  // Heading styles
  h1: cn(
    'text-4xl md:text-5xl lg:text-6xl',
    'font-bold',
    'tracking-tight',
    'leading-tight'
  ),
  h2: cn(
    'text-3xl md:text-4xl',
    'font-bold',
    'tracking-tight',
    'leading-tight'
  ),
  h3: cn(
    'text-2xl md:text-3xl',
    'font-semibold',
    'leading-snug'
  ),
  h4: cn(
    'text-xl md:text-2xl',
    'font-semibold',
    'leading-snug'
  ),
  h5: cn(
    'text-lg md:text-xl',
    'font-medium',
    'leading-normal'
  ),
  h6: cn(
    'text-base md:text-lg',
    'font-medium',
    'leading-normal'
  ),
  
  // Body styles
  body: {
    xs: 'text-xs leading-4',
    sm: 'text-sm leading-5',
    base: 'text-base leading-6',
    lg: 'text-lg leading-7',
    xl: 'text-xl leading-7',
  },
  
  // Special text styles
  caption: 'text-xs text-gray-500 dark:text-gray-400',
  overline: 'text-xs uppercase tracking-wider font-semibold',
  code: 'font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded',
};

// ============================================
// LAYOUT UTILITIES
// ============================================

export const layout = {
  // Container utilities
  container: (size: keyof typeof tokens.sizing.container) => {
    if (size === 'full') return 'w-full';
    return `max-w-[${tokens.sizing.container[size]}] mx-auto`;
  },
  
  // Grid utilities
  grid: {
    cols: (num: number) => {
      const gridClasses = [
        '',
        'grid-cols-1',
        'grid-cols-1 sm:grid-cols-2',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
        'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
      ];
      return gridClasses[Math.min(num, 6)] || gridClasses[3];
    },
    gap: (size: keyof typeof tokens.spacing) => `gap-[${tokens.spacing[size]}]`,
  },
  
  // Flex utilities
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    wrap: 'flex flex-wrap',
  },
  
  // Stack (vertical spacing)
  stack: (gap: keyof typeof tokens.spacing) => 
    cn('flex flex-col', `gap-[${tokens.spacing[gap]}]`),
  
  // Inline (horizontal spacing)
  inline: (gap: keyof typeof tokens.spacing) => 
    cn('flex items-center', `gap-[${tokens.spacing[gap]}]`),
};

// ============================================
// VISUAL UTILITIES
// ============================================

export const visual = {
  // Shadow utilities
  shadow: (level: keyof typeof tokens.shadows.elevation) => {
    const shadowMap = {
      none: 'shadow-none',
      xs: 'shadow-xs',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      '2xl': 'shadow-2xl',
      inner: 'shadow-inner',
    };
    return shadowMap[level];
  },
  
  // Border utilities
  border: {
    radius: (size: keyof typeof tokens.borders.radius) => {
      const radiusMap = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        DEFAULT: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full',
      };
      return radiusMap[size];
    },
    width: (size: keyof typeof tokens.borders.width) => {
      if (size === '0') return 'border-0';
      if (size === 'DEFAULT') return 'border';
      return `border-${size}`;
    },
  },
  
  // Opacity utilities
  opacity: (level: keyof typeof tokens.opacity) => `opacity-${level}`,
  
  // Blur utilities
  blur: (level: keyof typeof tokens.blur) => {
    const blurMap = {
      none: 'blur-none',
      sm: 'blur-sm',
      DEFAULT: 'blur',
      md: 'blur-md',
      lg: 'blur-lg',
      xl: 'blur-xl',
      '2xl': 'blur-2xl',
      '3xl': 'blur-3xl',
    };
    return blurMap[level];
  },
};

// ============================================
// ANIMATION UTILITIES
// ============================================

export const animation = {
  // Duration utilities
  duration: (speed: keyof typeof tokens.animation.duration) => {
    const durationMap = {
      instant: 'duration-0',
      fast: 'duration-150',
      normal: 'duration-250',
      slow: 'duration-350',
      slower: 'duration-500',
      slowest: 'duration-1000',
    };
    return durationMap[speed];
  },
  
  // Easing utilities
  ease: (type: keyof typeof tokens.animation.easing) => {
    const easingMap = {
      linear: 'ease-linear',
      in: 'ease-in',
      out: 'ease-out',
      inOut: 'ease-in-out',
      elastic: 'ease-in-out', // Custom cubic-bezier in CSS
      bounce: 'ease-in-out',  // Custom cubic-bezier in CSS
    };
    return easingMap[type];
  },
  
  // Transition utilities
  transition: (type: 'all' | 'colors' | 'opacity' | 'shadow' | 'transform' = 'all') => {
    const transitionMap = {
      all: 'transition-all',
      colors: 'transition-colors',
      opacity: 'transition-opacity',
      shadow: 'transition-shadow',
      transform: 'transition-transform',
    };
    return cn(transitionMap[type], 'duration-250', 'ease-in-out');
  },
};

// ============================================
// COMPONENT SIZE UTILITIES
// ============================================

export const componentSizes = {
  // Button sizes
  button: (size: keyof typeof tokens.sizing.components.button.height) => {
    const sizeMap = {
      xs: cn('h-7', 'px-2', 'text-xs'),
      sm: cn('h-8', 'px-3', 'text-xs'),
      md: cn('h-9', 'px-4', 'text-sm'),
      lg: cn('h-10', 'px-6', 'text-base'),
      xl: cn('h-12', 'px-8', 'text-lg'),
    };
    return sizeMap[size];
  },
  
  // Input sizes
  input: (size: keyof typeof tokens.sizing.components.input.height) => {
    const sizeMap = {
      xs: cn('h-8', 'px-2', 'text-xs'),
      sm: cn('h-9', 'px-3', 'text-sm'),
      md: cn('h-10', 'px-3', 'text-base'),
      lg: cn('h-11', 'px-4', 'text-base'),
      xl: cn('h-12', 'px-4', 'text-lg'),
    };
    return sizeMap[size];
  },
  
  // Icon sizes
  icon: (size: keyof typeof tokens.sizing.components.icon) => {
    const sizeMap = {
      xs: 'h-4 w-4',
      sm: 'h-5 w-5',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-10 w-10',
    };
    return sizeMap[size];
  },
  
  // Card padding
  card: (size: keyof typeof tokens.sizing.components.card.padding) => {
    const sizeMap = {
      xs: 'p-3',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };
    return sizeMap[size];
  },
};

// ============================================
// RESPONSIVE UTILITIES
// ============================================

export const responsive = {
  // Hide/Show utilities
  hide: {
    mobile: 'hidden sm:block',
    tablet: 'hidden md:block',
    desktop: 'hidden lg:block',
  },
  show: {
    mobile: 'block sm:hidden',
    tablet: 'block md:hidden',
    desktop: 'block lg:hidden',
  },
  
  // Container padding
  containerPadding: 'px-4 sm:px-6 lg:px-8',
  
  // Section padding
  sectionPadding: 'py-8 sm:py-12 md:py-16 lg:py-20',
};

// ============================================
// STATE UTILITIES
// ============================================

export const state = {
  // Interactive states
  hover: (className: string) => `hover:${className}`,
  focus: (className: string) => `focus:${className}`,
  active: (className: string) => `active:${className}`,
  disabled: (className: string) => `disabled:${className}`,
  
  // Focus visible
  focusVisible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  
  // Group states
  groupHover: (className: string) => `group-hover:${className}`,
  peerFocus: (className: string) => `peer-focus:${className}`,
};

// ============================================
// PRESET COMBINATIONS
// ============================================

export const presets = {
  // Card presets
  card: {
    default: cn(
      'bg-white dark:bg-gray-900',
      'border border-gray-200 dark:border-gray-800',
      'rounded-lg',
      'shadow-sm',
      'p-6'
    ),
    hover: cn(
      'bg-white dark:bg-gray-900',
      'border border-gray-200 dark:border-gray-800',
      'rounded-lg',
      'shadow-sm hover:shadow-md',
      'p-6',
      'transition-shadow duration-200'
    ),
    featured: cn(
      'bg-gradient-to-br from-primary/5 to-primary/10',
      'border border-primary/20',
      'rounded-xl',
      'shadow-lg',
      'p-8'
    ),
  },
  
  // Button presets
  button: {
    primary: cn(
      'bg-primary text-primary-foreground',
      'hover:bg-primary/90',
      'shadow-sm hover:shadow-md',
      'transition-all duration-200'
    ),
    secondary: cn(
      'bg-secondary text-secondary-foreground',
      'hover:bg-secondary/80',
      'transition-colors duration-200'
    ),
    ghost: cn(
      'hover:bg-accent hover:text-accent-foreground',
      'transition-colors duration-200'
    ),
  },
  
  // Input presets
  input: {
    default: cn(
      'border border-input',
      'bg-background',
      'rounded-md',
      'px-3 py-2',
      'text-sm',
      'placeholder:text-muted-foreground',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
      'disabled:cursor-not-allowed disabled:opacity-50'
    ),
  },
};

// Export a helper function to apply design tokens
export const applyTokens = (...classNames: (string | undefined | null | false)[]) => {
  return cn(...classNames.filter(Boolean));
};