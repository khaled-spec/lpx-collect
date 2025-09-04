/**
 * Design Token Utility Functions
 * Helper functions for using design tokens consistently across the application
 */

import { tokens } from './tokens';

// ============================================
// SPACING UTILITIES
// ============================================

/**
 * Generate padding classes using design tokens
 */
export const getPadding = (
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl',
  direction?: 'x' | 'y' | 't' | 'b' | 'l' | 'r'
) => {
  const sizeMap = {
    'xs': tokens.spacing[2],
    'sm': tokens.spacing[3],
    'md': tokens.spacing[4],
    'lg': tokens.spacing[6],
    'xl': tokens.spacing[8],
    '2xl': tokens.spacing[10],
    '3xl': tokens.spacing[12],
  };
  
  const value = sizeMap[size];
  
  if (!direction) return `padding: ${value}`;
  
  switch (direction) {
    case 'x': return `padding-left: ${value}; padding-right: ${value}`;
    case 'y': return `padding-top: ${value}; padding-bottom: ${value}`;
    case 't': return `padding-top: ${value}`;
    case 'b': return `padding-bottom: ${value}`;
    case 'l': return `padding-left: ${value}`;
    case 'r': return `padding-right: ${value}`;
  }
};

/**
 * Generate margin classes using design tokens
 */
export const getMargin = (
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl',
  direction?: 'x' | 'y' | 't' | 'b' | 'l' | 'r'
) => {
  const sizeMap = {
    'xs': tokens.spacing[2],
    'sm': tokens.spacing[3],
    'md': tokens.spacing[4],
    'lg': tokens.spacing[6],
    'xl': tokens.spacing[8],
    '2xl': tokens.spacing[10],
    '3xl': tokens.spacing[12],
  };
  
  const value = sizeMap[size];
  
  if (!direction) return `margin: ${value}`;
  
  switch (direction) {
    case 'x': return `margin-left: ${value}; margin-right: ${value}`;
    case 'y': return `margin-top: ${value}; margin-bottom: ${value}`;
    case 't': return `margin-top: ${value}`;
    case 'b': return `margin-bottom: ${value}`;
    case 'l': return `margin-left: ${value}`;
    case 'r': return `margin-right: ${value}`;
  }
};

// ============================================
// TYPOGRAPHY UTILITIES
// ============================================

/**
 * Get typography styles for different text types
 */
export const getTypography = (
  variant: 'body' | 'heading' | 'label' | 'caption',
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
) => {
  const sizeMap = {
    'xs': tokens.typography.fontSize.xs,
    'sm': tokens.typography.fontSize.sm,
    'md': tokens.typography.fontSize.base,
    'lg': tokens.typography.fontSize.lg,
    'xl': tokens.typography.fontSize.xl,
    '2xl': tokens.typography.fontSize['2xl'],
    '3xl': tokens.typography.fontSize['3xl'],
    '4xl': tokens.typography.fontSize['4xl'],
    '5xl': tokens.typography.fontSize['5xl'],
  };
  
  const lineHeightMap = {
    'body': tokens.typography.lineHeight.normal,
    'heading': tokens.typography.lineHeight.tight,
    'label': tokens.typography.lineHeight.snug,
    'caption': tokens.typography.lineHeight.relaxed,
  };
  
  const fontWeightMap = {
    'body': tokens.typography.fontWeight.normal,
    'heading': tokens.typography.fontWeight.bold,
    'label': tokens.typography.fontWeight.medium,
    'caption': tokens.typography.fontWeight.normal,
  };
  
  return {
    fontSize: sizeMap[size],
    lineHeight: lineHeightMap[variant],
    fontWeight: fontWeightMap[variant],
  };
};

// ============================================
// COMPONENT SIZE UTILITIES
// ============================================

/**
 * Get standardized component sizes
 */
export const getComponentSize = (
  component: 'button' | 'input' | 'select' | 'card',
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
) => {
  const heightMap = {
    'xs': tokens.sizes.xs,
    'sm': tokens.sizes.sm,
    'md': tokens.sizes.md,
    'lg': tokens.sizes.lg,
    'xl': tokens.sizes.xl,
  };
  
  const paddingMap = {
    'xs': `${tokens.spacing[2]} ${tokens.spacing[3]}`,
    'sm': `${tokens.spacing[2]} ${tokens.spacing[4]}`,
    'md': `${tokens.spacing[2.5]} ${tokens.spacing[5]}`,
    'lg': `${tokens.spacing[3]} ${tokens.spacing[6]}`,
    'xl': `${tokens.spacing[4]} ${tokens.spacing[8]}`,
  };
  
  return {
    height: heightMap[size],
    padding: paddingMap[size],
    fontSize: getTypography('body', size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : size === 'xl' ? 'lg' : 'md').fontSize,
  };
};

// ============================================
// SHADOW UTILITIES
// ============================================

/**
 * Get shadow values for different elevation levels
 */
export const getElevation = (level: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
  const shadowMap = {
    'none': tokens.shadows.none,
    'sm': tokens.shadows.sm,
    'md': tokens.shadows.md,
    'lg': tokens.shadows.lg,
    'xl': tokens.shadows.xl,
    '2xl': tokens.shadows['2xl'],
  };
  
  return shadowMap[level];
};

// ============================================
// ANIMATION UTILITIES
// ============================================

/**
 * Get animation/transition configurations
 */
export const getTransition = (
  property: 'all' | 'colors' | 'opacity' | 'shadow' | 'transform' = 'all',
  duration: 'fast' | 'normal' | 'slow' | 'slower' = 'normal',
  easing: 'linear' | 'in' | 'out' | 'inOut' = 'inOut'
) => {
  const durationMap = {
    'fast': tokens.transitions.duration[150],
    'normal': tokens.transitions.duration[200],
    'slow': tokens.transitions.duration[300],
    'slower': tokens.transitions.duration[500],
  };
  
  const easingMap = {
    'linear': tokens.transitions.easing.linear,
    'in': tokens.transitions.easing.in,
    'out': tokens.transitions.easing.out,
    'inOut': tokens.transitions.easing.inOut,
  };
  
  const propertyMap = {
    'all': tokens.transitions.property.all,
    'colors': tokens.transitions.property.colors,
    'opacity': tokens.transitions.property.opacity,
    'shadow': tokens.transitions.property.shadow,
    'transform': tokens.transitions.property.transform,
  };
  
  return `${propertyMap[property]} ${durationMap[duration]} ${easingMap[easing]}`;
};

// ============================================
// GRID UTILITIES
// ============================================

/**
 * Get grid layout configurations
 */
export const getGridLayout = (
  columns: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
  gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' = 'md'
) => {
  const gapMap = {
    'xs': tokens.grid.gap.xs,
    'sm': tokens.grid.gap.sm,
    'md': tokens.grid.gap.md,
    'lg': tokens.grid.gap.lg,
    'xl': tokens.grid.gap.xl,
    '2xl': tokens.grid.gap['2xl'],
    '3xl': tokens.grid.gap['3xl'],
  };
  
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gapMap[gap],
  };
};

// ============================================
// BREAKPOINT UTILITIES
// ============================================

/**
 * Media query helper using design token breakpoints
 */
export const mediaQuery = (breakpoint: keyof typeof tokens.breakpoints) => {
  return `@media (min-width: ${tokens.breakpoints[breakpoint]})`;
};

/**
 * Get responsive values for different breakpoints
 */
export const getResponsive = <T>(
  base: T,
  sm?: T,
  md?: T,
  lg?: T,
  xl?: T,
  xxl?: T
) => {
  return {
    base,
    ...(sm && { [mediaQuery('sm')]: sm }),
    ...(md && { [mediaQuery('md')]: md }),
    ...(lg && { [mediaQuery('lg')]: lg }),
    ...(xl && { [mediaQuery('xl')]: xl }),
    ...(xxl && { [mediaQuery('2xl')]: xxl }),
  };
};

// ============================================
// COLOR UTILITIES
// ============================================

/**
 * Get semantic color values
 */
export const getSemanticColor = (
  type: 'success' | 'warning' | 'error' | 'info',
  variant: 'DEFAULT' | 'light' | 'dark' = 'DEFAULT'
) => {
  if (variant === 'DEFAULT') {
    return tokens.colors[type].DEFAULT;
  }
  
  return tokens.colors[type][variant];
};

// ============================================
// BORDER UTILITIES
// ============================================

/**
 * Get border configurations
 */
export const getBorder = (
  width: '0' | '1' | '2' | '4' | '8' = '1',
  style: 'solid' | 'dashed' | 'dotted' = 'solid',
  color: string = tokens.colors.border
) => {
  const widthMap = {
    '0': '0',
    '1': '1px',
    '2': '2px',
    '4': '4px',
    '8': '8px',
  };
  
  return `${widthMap[width]} ${style} ${color}`;
};

/**
 * Get border radius values
 */
export const getBorderRadius = (
  size: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' = 'md'
) => {
  const radiusMap = {
    'none': tokens.borderRadius.none,
    'sm': tokens.borderRadius.sm,
    'md': tokens.borderRadius.md,
    'lg': tokens.borderRadius.lg,
    'xl': tokens.borderRadius.xl,
    '2xl': tokens.borderRadius['2xl'],
    '3xl': tokens.borderRadius['3xl'],
    'full': tokens.borderRadius.full,
  };
  
  return radiusMap[size];
};

// ============================================
// Z-INDEX UTILITIES
// ============================================

/**
 * Get z-index values for layering
 */
export const getZIndex = (
  layer: 'dropdown' | 'sticky' | 'fixed' | 'modal' | 'popover' | 'tooltip' | 'notification'
) => {
  return tokens.zIndex[layer];
};

// ============================================
// CLASS NAME BUILDERS
// ============================================

/**
 * Build container classes with design tokens
 */
export const getContainerClasses = (
  maxWidth: keyof typeof tokens.sizes.container = '7xl',
  padding: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
) => {
  const paddingMap = {
    'xs': 'px-2 sm:px-3 lg:px-4',
    'sm': 'px-3 sm:px-4 lg:px-6',
    'md': 'px-4 sm:px-6 lg:px-8',
    'lg': 'px-6 sm:px-8 lg:px-10',
    'xl': 'px-8 sm:px-10 lg:px-12',
  };
  
  return `mx-auto ${paddingMap[padding]} max-w-${maxWidth}`;
};

/**
 * Build button classes with design tokens
 */
export const getButtonClasses = (
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' = 'primary',
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md',
  isIcon: boolean = false
) => {
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    'primary': 'bg-primary text-primary-foreground hover:bg-primary/90',
    'secondary': 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    'outline': 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    'ghost': 'hover:bg-accent hover:text-accent-foreground',
    'destructive': 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };
  
  const sizeClasses = isIcon ? {
    'xs': 'h-7 w-7',
    'sm': 'h-8 w-8',
    'md': 'h-9 w-9',
    'lg': 'h-10 w-10',
    'xl': 'h-12 w-12',
  } : {
    'xs': 'h-7 px-2 text-xs',
    'sm': 'h-8 px-3 text-xs',
    'md': 'h-9 px-4 text-sm',
    'lg': 'h-10 px-6 text-base',
    'xl': 'h-12 px-8 text-lg',
  };
  
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
};

export default {
  getPadding,
  getMargin,
  getTypography,
  getComponentSize,
  getElevation,
  getTransition,
  getGridLayout,
  mediaQuery,
  getResponsive,
  getSemanticColor,
  getBorder,
  getBorderRadius,
  getZIndex,
  getContainerClasses,
  getButtonClasses,
};