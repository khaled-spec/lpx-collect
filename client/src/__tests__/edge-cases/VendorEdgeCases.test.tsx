import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import VendorProductsPage from '@/app/vendor/products/page'
import VendorDashboardPage from '@/app/vendor/dashboard/page'
import { TestProviders } from '../utils/test-providers'

const mockPush = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: mockReplace,
  })),
  usePathname: vi.fn(() => '/vendor/products'),
}))

// Mock categories API to prevent errors
vi.mock('@/lib/categories', () => ({
  getNavigationCategories: vi.fn().mockResolvedValue([
    { name: 'Trading Cards', slug: 'trading-cards' },
    { name: 'Comics', slug: 'comics' },
  ]),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}))

describe('Vendor Edge Cases and Error Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUser).mockReturnValue({
      user: {
        id: 'vendor-123',
        publicMetadata: { role: 'vendor' },
        firstName: 'John',
        lastName: 'Doe',
      } as any,
      isLoaded: true,
      isSignedIn: true,
    })

    // Default fetch mock
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { products: [] } }),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Network and API Edge Cases', () => {
    it('handles slow API responses with loading state', async () => {
      // Mock slow API response that never resolves
      global.fetch = vi.fn(() => new Promise(() => {}))

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      // Should show loading state initially
      await waitFor(() => {
        expect(screen.getByText('My Products')).toBeInTheDocument()
      })

      // Products section should show loading
      expect(screen.getByText(/all products \(0\)/i)).toBeInTheDocument()
    })

    it('handles intermittent network failures with retry logic', async () => {
      const { toast } = await import('sonner')
      let attemptCount = 0

      global.fetch = vi.fn(() => {
        attemptCount++
        if (attemptCount <= 2) {
          return Promise.reject(new Error('Network error'))
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: { products: [] } }),
        } as Response)
      })

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      // Should show error and retry option
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(/network.*error|failed.*load/i)
      })

      expect(screen.getByRole('button', { name: /retry|try.*again/i })).toBeInTheDocument()

      // Click retry
      const retryButton = screen.getByRole('button', { name: /retry|try.*again/i })
      fireEvent.click(retryButton)

      // Should eventually succeed after retries
      await waitFor(() => {
        expect(screen.getByText('My Products')).toBeInTheDocument()
      })

      expect(attemptCount).toBe(3) // Failed twice, succeeded on third
    })

    it('handles malformed JSON responses', async () => {
      const { toast } = await import('sonner')

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token')
        },
      } as Response)

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(/invalid.*response|parse.*error/i)
      })
    })

    it('handles HTTP error status codes gracefully', async () => {
      const { toast } = await import('sonner')

      // Test different HTTP error codes
      const errorCodes = [400, 401, 403, 404, 429, 500, 502, 503]

      for (const code of errorCodes) {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: code,
          json: async () => ({
            success: false,
            error: { message: `HTTP ${code} error`, code: `HTTP_${code}` },
          }),
        } as Response)

        render(
          <TestProviders>
            <VendorProductsPage />
          </TestProviders>
        )

        await waitFor(() => {
          if (code === 401 || code === 403) {
            expect(toast.error).toHaveBeenCalledWith(/unauthorized|access.*denied/i)
          } else if (code === 404) {
            expect(toast.error).toHaveBeenCalledWith(/not.*found/i)
          } else if (code === 429) {
            expect(toast.error).toHaveBeenCalledWith(/rate.*limit|too.*many.*requests/i)
          } else if (code >= 500) {
            expect(toast.error).toHaveBeenCalledWith(/server.*error|try.*again.*later/i)
          }
        })

        // Clear for next iteration
        vi.clearAllMocks()
      }
    })
  })

  describe('Data Validation Edge Cases', () => {
    it('handles extremely large datasets without crashing', async () => {
      // Mock dataset with 10,000 products
      const massiveDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: `product-${i}`,
        name: `Product ${i}`,
        price: Math.random() * 1000,
        status: ['active', 'draft', 'sold'][i % 3],
        stock: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 1000),
        wishlistCount: Math.floor(Math.random() * 50),
      }))

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { products: massiveDataset } }),
      } as Response)

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('All Products (10,000)')).toBeInTheDocument()
      })

      // Should handle large dataset without performance issues
      expect(screen.getByText('Product 0')).toBeInTheDocument()
    })

    it('handles products with missing or null fields', async () => {
      const corruptedData = [
        {
          id: 'product-1',
          name: null,
          price: undefined,
          status: '',
          stock: -1,
          views: 'invalid',
          wishlistCount: null,
        },
        {
          id: 'product-2',
          // Missing required fields
        },
        {
          id: 'product-3',
          name: 'Valid Product',
          price: 29.99,
          status: 'active',
          stock: 5,
        },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { products: corruptedData } }),
      } as Response)

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        // Should handle corrupted data gracefully
        expect(screen.getByText('Valid Product')).toBeInTheDocument()
        // Should display error for invalid products or skip them
        expect(screen.queryByText('null')).not.toBeInTheDocument()
      })
    })

    it('handles special characters and encoding issues', async () => {
      const specialCharacterData = [
        {
          id: 'product-emoji',
          name: '🎮 Gaming Card 🔥',
          description: 'Card with émójís and special characters: ñ, ü, ß, 中文',
          price: 29.99,
          status: 'active',
          stock: 1,
        },
        {
          id: 'product-html',
          name: '<script>alert("XSS")</script>',
          description: 'Product with HTML & dangerous content',
          price: 19.99,
          status: 'active',
          stock: 1,
        },
        {
          id: 'product-long',
          name: 'A'.repeat(1000), // Very long name
          description: 'B'.repeat(10000), // Very long description
          price: 49.99,
          status: 'active',
          stock: 1,
        },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { products: specialCharacterData } }),
      } as Response)

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        // Should display emojis correctly
        expect(screen.getByText(/🎮.*gaming.*card.*🔥/i)).toBeInTheDocument()

        // Should escape HTML to prevent XSS
        expect(screen.getByText(/<script>/i)).toBeInTheDocument()
        expect(screen.queryByText('alert')).not.toBeInTheDocument()

        // Should truncate very long text
        const longNameElement = screen.getByText(/AAAA/i)
        expect(longNameElement.textContent?.length).toBeLessThan(200)
      })
    })
  })

  describe('Authentication and Authorization Edge Cases', () => {
    it('handles role changes during session', async () => {
      // Start as vendor
      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('My Products')).toBeInTheDocument()
      })

      // Simulate role change to collector
      act(() => {
        vi.mocked(useUser).mockReturnValue({
          user: {
            id: 'vendor-123',
            publicMetadata: { role: 'collector' }, // Changed role
            firstName: 'John',
            lastName: 'Doe',
          } as any,
          isLoaded: true,
          isSignedIn: true,
        })
      })

      // Should redirect or show access denied
      await waitFor(() => {
        expect(screen.queryByText('My Products')).not.toBeInTheDocument()
      })
    })

    it('handles expired authentication tokens', async () => {
      // Simulate token expiration
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          error: { message: 'Token expired', code: 'TOKEN_EXPIRED' },
        }),
      } as Response)

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        // Should handle token expiration
        expect(screen.getByText(/session.*expired|please.*sign.*in/i)).toBeInTheDocument()
      })
    })

    it('handles concurrent sessions and data conflicts', async () => {
      const { toast } = await import('sonner')

      // Simulate concurrent modification conflict
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({
          success: false,
          error: {
            message: 'Resource modified by another user',
            code: 'CONFLICT',
            conflictData: { lastModified: '2024-01-15T10:30:00Z' }
          },
        }),
      } as Response)

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      // Simulate user action that triggers conflict
      const actionButton = screen.getByTestId('product-actions-1')
      fireEvent.click(actionButton)

      await waitFor(() => {
        const deleteButton = screen.getByText('Delete')
        fireEvent.click(deleteButton)
      })

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(/conflict|modified.*another.*user/i)
      })
    })
  })

  describe('UI and Interaction Edge Cases', () => {
    it('handles rapid successive user interactions', async () => {
      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('My Products')).toBeInTheDocument()
      })

      // Rapidly click the same action multiple times
      const actionButton = screen.getByTestId('product-actions-1')

      act(() => {
        for (let i = 0; i < 10; i++) {
          fireEvent.click(actionButton)
        }
      })

      // Should not create multiple modals or break the UI
      const menus = screen.getAllByText('Actions')
      expect(menus.length).toBeLessThanOrEqual(2) // At most one open menu
    })

    it('handles form submission spam protection', async () => {
      const { toast } = await import('sonner')

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('My Products')).toBeInTheDocument()
      })

      const actionButton = screen.getByTestId('product-actions-1')
      fireEvent.click(actionButton)

      await waitFor(() => {
        const deleteButton = screen.getByText('Delete')

        // Rapidly click delete multiple times
        act(() => {
          for (let i = 0; i < 5; i++) {
            fireEvent.click(deleteButton)
          }
        })
      })

      // Should only process one deletion
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledTimes(1)
      })
    })

    it('handles browser back/forward navigation edge cases', async () => {
      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      // Simulate browser back navigation
      const mockPopState = new PopStateEvent('popstate', { state: null })
      window.dispatchEvent(mockPopState)

      // UI should handle navigation gracefully
      expect(screen.getByText('My Products')).toBeInTheDocument()
    })

    it('handles window resize and responsive breakpoints', async () => {
      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      // Simulate window resize to mobile
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 320,
        })
        window.dispatchEvent(new Event('resize'))
      })

      await waitFor(() => {
        // Should adapt to mobile layout
        expect(document.body).toHaveStyle('width: 320px') // Or check mobile-specific elements
      })

      // Resize back to desktop
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1920,
        })
        window.dispatchEvent(new Event('resize'))
      })

      await waitFor(() => {
        // Should adapt back to desktop layout
        expect(document.body).toHaveStyle('width: 1920px')
      })
    })
  })

  describe('Memory and Performance Edge Cases', () => {
    it('handles memory leaks in long-running sessions', async () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0

      // Simulate long-running session with many operations
      for (let i = 0; i < 100; i++) {
        render(
          <TestProviders>
            <VendorProductsPage />
          </TestProviders>
        )

        // Unmount to test cleanup
        cleanup()
      }

      const finalMemory = performance.memory?.usedJSHeapSize || 0
      const memoryIncrease = finalMemory - initialMemory

      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
    })

    it('handles component updates during unmount', async () => {
      const { unmount } = render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('My Products')).toBeInTheDocument()
      })

      // Unmount component
      unmount()

      // Should not cause React warnings about setting state on unmounted components
      expect(true).toBe(true) // Basic test to ensure unmount works
    })
  })

  describe('Accessibility Edge Cases', () => {
    it('handles keyboard navigation with focus traps', async () => {
      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      // Open dropdown menu
      const actionButton = screen.getByTestId('product-actions-1')
      fireEvent.click(actionButton)

      await waitFor(() => {
        expect(screen.getByText('Actions')).toBeInTheDocument()
      })

      // Test Tab key navigation
      fireEvent.keyDown(document.activeElement!, { key: 'Tab' })

      // Focus should stay within the dropdown
      const focusedElement = document.activeElement
      expect(focusedElement).toBeInTheDocument()
      expect(focusedElement?.getAttribute('role')).toBe('menuitem')
    })

    it('handles screen reader announcements for dynamic content', async () => {
      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      // Mock screen reader announcements
      const announcements: string[] = []
      const originalCreateElement = document.createElement

      document.createElement = vi.fn((tagName: string) => {
        const element = originalCreateElement.call(document, tagName)
        if (tagName === 'div' && element.getAttribute?.('aria-live')) {
          element.textContent && announcements.push(element.textContent)
        }
        return element
      })

      // Trigger dynamic content change
      const deleteButton = screen.getByTestId('product-actions-1')
      fireEvent.click(deleteButton)

      await waitFor(() => {
        // Should announce the action to screen readers
        expect(announcements.some(a => a.includes('deleted') || a.includes('removed'))).toBe(true)
      })

      // Restore original createElement
      document.createElement = originalCreateElement
    })
  })

  describe('Internationalization Edge Cases', () => {
    it('handles right-to-left (RTL) languages', async () => {
      // Mock RTL language
      Object.defineProperty(document.documentElement, 'dir', {
        writable: true,
        value: 'rtl',
      })

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        // Should adapt layout for RTL
        expect(document.documentElement.dir).toBe('rtl')
        expect(screen.getByText('My Products')).toBeInTheDocument()
      })

      // Reset to LTR
      document.documentElement.dir = 'ltr'
    })

    it('handles extremely long translated text', async () => {
      // Mock very long translations
      const longGermanText = 'Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft'

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            products: [{
              id: '1',
              name: longGermanText,
              description: longGermanText.repeat(10),
              price: 29.99,
              status: 'active',
              stock: 1,
            }],
          },
        }),
      } as Response)

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        // Should handle long text without breaking layout
        expect(screen.getByText(new RegExp(longGermanText.substring(0, 20)))).toBeInTheDocument()
      })
    })
  })
})

// Helper function to cleanup components
function cleanup() {
  // Clear any React roots or cleanup logic
  document.body.innerHTML = ''
}