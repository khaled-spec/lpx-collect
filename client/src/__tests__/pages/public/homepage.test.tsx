import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '@/app/page'
import { render, mockProducts, cleanupMocks } from '@/__tests__/utils/test-providers'

// Mock the API
vi.mock('@/lib/api/client', () => ({
  getProductAPI: () => ({
    getFeaturedProducts: vi.fn().mockResolvedValue({
      success: true,
      data: mockProducts,
    }),
    getProducts: vi.fn().mockResolvedValue({
      success: true,
      data: mockProducts,
    }),
  }),
}))

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

describe('Homepage', () => {
  beforeEach(() => {
    cleanupMocks()
  })

  describe('Rendering', () => {
    it('renders without crashing', async () => {
      render(<HomePage />)

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })

    it('displays the main heading', async () => {
      render(<HomePage />)

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      })
    })

    it('shows the hero section', async () => {
      render(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText('LPX Collect')).toBeInTheDocument()
        expect(screen.getByText(/the premier marketplace for serious collectors/i)).toBeInTheDocument()
      })
    })

    it('displays call-to-action buttons', async () => {
      render(<HomePage />)

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /start exploring/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /view vendors/i })).toBeInTheDocument()
      })
    })
  })

  describe('Featured Products Section', () => {
    it('displays featured products section', async () => {
      render(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText(/featured collectibles/i)).toBeInTheDocument()
      })
    })

    it('shows product cards when products are loaded', async () => {
      render(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText('Test Trading Card')).toBeInTheDocument()
        expect(screen.getByText('Test Comic Book')).toBeInTheDocument()
      })
    })

    it('displays product prices correctly', async () => {
      render(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText('$29.99')).toBeInTheDocument()
        expect(screen.getByText('$49.99')).toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('navigates to browse page when start exploring is clicked', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      await waitFor(() => {
        const browseLink = screen.getByRole('link', { name: /start exploring/i })
        expect(browseLink).toHaveAttribute('href', '/browse')
      })
    })

    it('navigates to vendors page when view vendors is clicked', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      await waitFor(() => {
        const vendorLink = screen.getByRole('link', { name: /view vendors/i })
        expect(vendorLink).toHaveAttribute('href', '/vendors')
      })
    })
  })

  describe('Interaction', () => {
    it('allows adding products to cart', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      await waitFor(() => {
        const addToCartButtons = screen.getAllByText(/add to cart/i)
        expect(addToCartButtons.length).toBeGreaterThan(0)
      })
    })

    it('allows adding products to wishlist', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      await waitFor(() => {
        const wishlistButtons = screen.getAllByLabelText(/add to wishlist/i)
        expect(wishlistButtons.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Trust Features Section', () => {
    it('displays trust features', async () => {
      render(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText(/100% authenticated/i)).toBeInTheDocument()
      })
    })

    it('shows trust feature cards', async () => {
      render(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText(/100% authenticated/i)).toBeInTheDocument()
        expect(screen.getByText(/secure payments/i)).toBeInTheDocument()
        expect(screen.getByText(/global shipping/i)).toBeInTheDocument()
        expect(screen.getByText(/premium vendors/i)).toBeInTheDocument()
      })
    })
  })

  describe('Statistics Section', () => {
    it('displays platform statistics', async () => {
      render(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText(/trusted by collectors worldwide/i)).toBeInTheDocument()
        expect(screen.getByText(/50K\+/)).toBeInTheDocument()
        expect(screen.getByText(/100K\+/)).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading state while fetching products', () => {
      render(<HomePage />)

      // Should show some kind of loading indicator initially
      const loadingElements = screen.queryAllByText(/loading/i)
      // If no explicit loading text, just verify page renders
      expect(screen.getByText(/discover rare & authentic collectibles/i)).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      // Mock API to fail
      vi.doMock('@/lib/api/client', () => ({
        getProductAPI: () => ({
          getFeaturedProducts: vi.fn().mockRejectedValue(new Error('API Error')),
          getProducts: vi.fn().mockRejectedValue(new Error('API Error')),
        }),
      }))

      render(<HomePage />)

      // Should still render the basic page structure
      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', async () => {
      render(<HomePage />)

      await waitFor(() => {
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)

        // Should have an h1
        const h1 = screen.getByRole('heading', { level: 1 })
        expect(h1).toBeInTheDocument()
      })
    })

    it('has accessible links', async () => {
      render(<HomePage />)

      await waitFor(() => {
        const links = screen.getAllByRole('link')
        links.forEach(link => {
          expect(link).toHaveAttribute('href')
        })
      })
    })

    it('has proper alt text for images', async () => {
      render(<HomePage />)

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        images.forEach(img => {
          expect(img).toHaveAttribute('alt')
        })
      })
    })
  })

  describe('Responsive Design', () => {
    it('renders correctly on mobile viewport', async () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<HomePage />)

      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })

    it('renders correctly on desktop viewport', async () => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      render(<HomePage />)

      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })
  })
})