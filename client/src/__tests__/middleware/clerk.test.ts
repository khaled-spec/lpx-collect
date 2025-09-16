import { describe, it, expect, vi, beforeEach } from 'vitest'
import { clerkMiddleware } from '@clerk/nextjs/server'

vi.mocked(clerkMiddleware)

describe('Clerk Middleware Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes clerk middleware', () => {
    // Import the middleware file to test its initialization
    const middleware = require('../../../middleware')

    expect(middleware.default).toBeDefined()
  })

  describe('Route matching configuration', () => {
    it('has correct matcher patterns', () => {
      const { config } = require('../../../middleware')

      expect(config.matcher).toBeInstanceOf(Array)
      expect(config.matcher).toHaveLength(2)
    })

    it('excludes Next.js internal routes', () => {
      const { config } = require('../../../middleware')
      const patterns = config.matcher

      // Check that the pattern excludes _next and static files
      const mainPattern = patterns[0]
      expect(mainPattern).toContain('_next')
      expect(mainPattern).toContain('css')
      expect(mainPattern).toContain('js')
      expect(mainPattern).toContain('png')
      expect(mainPattern).toContain('jpg')
    })

    it('includes API routes', () => {
      const { config } = require('../../../middleware')
      const patterns = config.matcher

      // Check that API routes are included
      const apiPattern = patterns[1]
      expect(apiPattern).toContain('api')
      expect(apiPattern).toContain('trpc')
    })
  })

  describe('Route protection scenarios', () => {
    // Mock scenarios to test different route types
    const testRoutes = [
      // Should be protected
      { path: '/dashboard', shouldMatch: true },
      { path: '/admin', shouldMatch: true },
      { path: '/vendor', shouldMatch: true },
      { path: '/api/products', shouldMatch: true },
      { path: '/api/auth/webhook', shouldMatch: true },

      // Should not be protected (excluded)
      { path: '/_next/static/chunks/main.js', shouldMatch: false },
      { path: '/favicon.ico', shouldMatch: false },
      { path: '/images/logo.png', shouldMatch: false },
      { path: '/styles.css', shouldMatch: false },
    ]

    testRoutes.forEach(({ path, shouldMatch }) => {
      it(`${shouldMatch ? 'matches' : 'excludes'} ${path}`, () => {
        const { config } = require('../../../middleware')
        const patterns = config.matcher

        let matches = false
        patterns.forEach((pattern: string) => {
          const regex = new RegExp(pattern.replace(/\*/g, '.*'))
          if (regex.test(path)) {
            matches = true
          }
        })

        if (shouldMatch) {
          expect(matches).toBe(true)
        } else {
          expect(matches).toBe(false)
        }
      })
    })
  })

  describe('Static file exclusions', () => {
    const staticFiles = [
      '/favicon.ico',
      '/logo.png',
      '/images/hero.jpg',
      '/icons/cart.svg',
      '/fonts/inter.woff2',
      '/manifest.json',
      '/robots.txt'
    ]

    staticFiles.forEach((file) => {
      it(`excludes static file: ${file}`, () => {
        const { config } = require('../../../middleware')
        const mainPattern = config.matcher[0]

        // Convert matcher pattern to regex and test
        const regex = new RegExp(mainPattern)
        expect(regex.test(file)).toBe(false)
      })
    })
  })

  describe('API route inclusion', () => {
    const apiRoutes = [
      '/api/products',
      '/api/products/123',
      '/api/categories/pokemon',
      '/api/vendors/456/stats',
      '/api/auth/webhook',
      '/trpc/auth.signIn'
    ]

    apiRoutes.forEach((route) => {
      it(`includes API route: ${route}`, () => {
        const { config } = require('../../../middleware')
        const apiPattern = config.matcher[1]

        const regex = new RegExp(apiPattern.replace(/\*/g, '.*'))
        expect(regex.test(route)).toBe(true)
      })
    })
  })
})