import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'
import { tokens } from './src/lib/tokens'

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
      // COLORS - Using design tokens
      // ============================================
      colors: {
        // Brand colors
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        
        // Semantic colors from tokens
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        error: tokens.colors.error,
        info: tokens.colors.info,
        
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
      },
      
      // ============================================
      // TYPOGRAPHY - From design tokens
      // ============================================
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      
      fontSize: Object.entries(tokens.typography.fontSize).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>),
      
      fontWeight: tokens.typography.fontWeight,
      letterSpacing: tokens.typography.letterSpacing,
      lineHeight: tokens.typography.lineHeight,
      
      // ============================================
      // SPACING - From design tokens
      // ============================================
      spacing: tokens.spacing,
      
      // ============================================
      // BORDERS & RADIUS - From design tokens
      // ============================================
      borderRadius: {
        ...tokens.borderRadius,
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      
      // ============================================
      // SHADOWS - From design tokens
      // ============================================
      boxShadow: tokens.shadows,
      
      // ============================================
      // ANIMATION - From design tokens
      // ============================================
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' }
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          }
        },
        pulse: {
          '50%': {
            opacity: '.5',
          }
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
          },
          '50%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
          }
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        slideUp: {
          from: {
            transform: 'translateY(10px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          }
        },
        slideDown: {
          from: {
            transform: 'translateY(-10px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          }
        },
        slideLeft: {
          from: {
            transform: 'translateX(10px)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          }
        },
        slideRight: {
          from: {
            transform: 'translateX(-10px)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          }
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
      },
      
      animation: Object.entries(tokens.animation).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>),
      
      transitionDuration: tokens.transitions.duration,
      transitionTimingFunction: tokens.transitions.easing,
      
      // ============================================
      // LAYOUT - From design tokens
      // ============================================
      zIndex: tokens.zIndex,
      
      maxWidth: {
        ...tokens.sizes.container,
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
      
    },
  },
  plugins: [
    tailwindcssAnimate,
    // Custom plugin for additional utilities
    function({ addUtilities }: any) {
      const newUtilities = {
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
        
        // Text gradient utilities
        '.text-gradient': {
          backgroundClip: 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
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