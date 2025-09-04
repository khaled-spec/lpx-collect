import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'
import { tokens } from './src/lib/theme/tokens'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      // ============================================
      // COLORS - Integrated with design tokens
      // ============================================
      colors: {
        // Brand colors from tokens
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary) / 0.9)',
          active: 'hsl(var(--primary) / 0.8)',
          subtle: 'hsl(var(--primary) / 0.1)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          hover: 'hsl(var(--secondary) / 0.8)',
          active: 'hsl(var(--secondary) / 0.7)',
          subtle: 'hsl(var(--secondary) / 0.1)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          hover: 'hsl(var(--accent) / 0.8)',
          active: 'hsl(var(--accent) / 0.7)',
          subtle: 'hsl(var(--accent) / 0.1)',
        },
        
        // Semantic colors
        success: {
          DEFAULT: tokens.colors.semantic.status.success.DEFAULT,
          light: tokens.colors.semantic.status.success.light,
          dark: tokens.colors.semantic.status.success.dark,
          foreground: tokens.colors.semantic.status.success.foreground,
        },
        warning: {
          DEFAULT: tokens.colors.semantic.status.warning.DEFAULT,
          light: tokens.colors.semantic.status.warning.light,
          dark: tokens.colors.semantic.status.warning.dark,
          foreground: tokens.colors.semantic.status.warning.foreground,
        },
        error: {
          DEFAULT: 'hsl(var(--destructive))',
          light: 'hsl(var(--destructive) / 0.1)',
          dark: 'hsl(var(--destructive-foreground))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        info: {
          DEFAULT: tokens.colors.semantic.status.info.DEFAULT,
          light: tokens.colors.semantic.status.info.light,
          dark: tokens.colors.semantic.status.info.dark,
          foreground: tokens.colors.semantic.status.info.foreground,
        },
        
        // Base colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        // Component colors
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        
        // Chart colors
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
          '6': tokens.colors.dataViz.categorical[5],
          '7': tokens.colors.dataViz.categorical[6],
          '8': tokens.colors.dataViz.categorical[7],
        },
        
        // Sidebar colors
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        
        // Extended gray palette from tokens
        gray: tokens.colors.primitive.gray,
        blue: tokens.colors.primitive.blue,
        green: tokens.colors.primitive.green,
        red: tokens.colors.primitive.red,
        yellow: tokens.colors.primitive.yellow,
        purple: tokens.colors.primitive.purple,
        teal: tokens.colors.primitive.teal,
      },
      
      // ============================================
      // TYPOGRAPHY - From design tokens
      // ============================================
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        serif: tokens.typography.fonts.serif.DEFAULT.split(','),
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      
      fontSize: {
        // Base sizes
        '2xs': [tokens.typography.scale.body.xs.fontSize, tokens.typography.scale.body.xs.lineHeight],
        xs: [tokens.typography.scale.body.xs.fontSize, tokens.typography.scale.body.xs.lineHeight],
        sm: [tokens.typography.scale.body.sm.fontSize, tokens.typography.scale.body.sm.lineHeight],
        base: [tokens.typography.scale.body.base.fontSize, tokens.typography.scale.body.base.lineHeight],
        lg: [tokens.typography.scale.body.lg.fontSize, tokens.typography.scale.body.lg.lineHeight],
        xl: [tokens.typography.scale.body.xl.fontSize, tokens.typography.scale.body.xl.lineHeight],
        
        // Display sizes using fluid typography
        '2xl': [tokens.typography.scale.heading.h3.fontSize, tokens.typography.scale.heading.h3.lineHeight],
        '3xl': [tokens.typography.scale.heading.h2.fontSize, tokens.typography.scale.heading.h2.lineHeight],
        '4xl': [tokens.typography.scale.heading.h1.fontSize, tokens.typography.scale.heading.h1.lineHeight],
        '5xl': [tokens.typography.scale.display.lg.fontSize, tokens.typography.scale.display.lg.lineHeight],
        '6xl': [tokens.typography.scale.display.xl.fontSize, tokens.typography.scale.display.xl.lineHeight],
        '7xl': [tokens.typography.scale.display['2xl'].fontSize, tokens.typography.scale.display['2xl'].lineHeight],
      },
      
      fontWeight: tokens.typography.fontWeight,
      letterSpacing: tokens.typography.letterSpacing,
      lineHeight: tokens.typography.lineHeight,
      
      // ============================================
      // SPACING - From design tokens
      // ============================================
      spacing: tokens.spacing.scale,
      
      // ============================================
      // BORDERS & RADIUS - From design tokens
      // ============================================
      borderRadius: {
        ...tokens.borders.radius,
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      
      borderWidth: tokens.borders.width,
      
      // ============================================
      // SHADOWS - From design tokens
      // ============================================
      boxShadow: {
        ...tokens.effects.shadows.elevation,
        ...tokens.effects.shadows.colored,
        glass: tokens.effects.shadows.glass.md,
        'glass-sm': tokens.effects.shadows.glass.sm,
        'glass-lg': tokens.effects.shadows.glass.lg,
        neumorphic: tokens.effects.shadows.neumorphic.convex,
        'neumorphic-inset': tokens.effects.shadows.neumorphic.concave,
      },
      
      // ============================================
      // ANIMATION - From design tokens
      // ============================================
      keyframes: {
        ...tokens.motion.keyframes,
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
      },
      
      animation: {
        ...Object.entries(tokens.motion.animations).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>),
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      
      transitionDuration: tokens.motion.duration,
      transitionTimingFunction: tokens.motion.easing,
      
      // ============================================
      // EFFECTS - From design tokens
      // ============================================
      blur: tokens.effects.blur,
      opacity: tokens.effects.opacity,
      scale: tokens.effects.transforms.scale,
      rotate: tokens.effects.transforms.rotate,
      skew: tokens.effects.transforms.skew,
      
      // ============================================
      // LAYOUT - From design tokens
      // ============================================
      zIndex: tokens.zIndex,
      aspectRatio: tokens.aspectRatio,
      
      maxWidth: {
        ...tokens.spacing.container.maxWidth,
        screen: '100vw',
      },
      
      screens: {
        xs: tokens.breakpoints.xs,
        sm: tokens.breakpoints.sm,
        md: tokens.breakpoints.md,
        lg: tokens.breakpoints.lg,
        xl: tokens.breakpoints.xl,
        '2xl': tokens.breakpoints['2xl'],
        '3xl': tokens.breakpoints['3xl'],
      },
      
      // ============================================
      // BACKDROP FILTERS
      // ============================================
      backdropBlur: tokens.effects.blur.backdrop,
      backdropBrightness: tokens.effects.filters.brightness,
      backdropContrast: tokens.effects.filters.contrast,
      backdropSaturate: tokens.effects.filters.saturation,
      
      // ============================================
      // CURSORS - From design tokens
      // ============================================
      cursor: tokens.cursor,
    },
  },
  plugins: [
    tailwindcssAnimate,
    // Custom plugin for additional utilities
    function({ addUtilities }: any) {
      const newUtilities = {
        // Glass morphism utilities
        '.glass-light': {
          background: tokens.effects.glass.surface.light.background,
          backdropFilter: tokens.effects.glass.surface.light.backdropFilter,
          border: tokens.effects.glass.surface.light.border,
        },
        '.glass-dark': {
          background: tokens.effects.glass.surface.dark.background,
          backdropFilter: tokens.effects.glass.surface.dark.backdropFilter,
          border: tokens.effects.glass.surface.dark.border,
        },
        
        // Text gradient utilities
        '.text-gradient': {
          backgroundClip: 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        
        // Smooth scroll
        '.smooth-scroll': {
          scrollBehavior: 'smooth',
        },
        
        // Hide scrollbar
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        
        // Custom scrollbar
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'hsl(var(--muted))',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'hsl(var(--muted-foreground) / 0.3)',
            borderRadius: '4px',
            '&:hover': {
              background: 'hsl(var(--muted-foreground) / 0.5)',
            },
          },
        },
        
        // Mask utilities
        '.mask-gradient-to-b': {
          maskImage: 'linear-gradient(to bottom, black, transparent)',
        },
        '.mask-gradient-to-t': {
          maskImage: 'linear-gradient(to top, black, transparent)',
        },
      }
      
      addUtilities(newUtilities)
    },
  ],
}

export default config