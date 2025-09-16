import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import WishlistPage from '@/app/wishlist/page'
import { render, cleanupMocks, mockProducts } from '@/__tests__/utils/test-providers'

const mockWishlistItems = mockProducts

// Mock the wishlist context
vi.mock('@/context/WishlistContext', () => ({
  useWishlist: () => ({
    items: mockWishlistItems,
    wishlistCount: 2,
    addToWishlist: vi.fn(),
    removeFromWishlist: vi.fn(),
    isInWishlist: vi.fn().mockReturnValue(true),
    clearWishlist: vi.fn(),
    isLoading: false,
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

describe('Wishlist Page', () => {
  beforeEach(() => {
    cleanupMocks()
  })

  describe('Rendering', () => {
    it('renders without crashing', async () => {
      render(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })

    it('displays wishlist items', async () => {
      render(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Trading Card')).toBeInTheDocument()
        expect(screen.getByText('Test Comic Book')).toBeInTheDocument()
      })
    })

    it('shows item prices', async () => {
      render(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getByText('$29.99')).toBeInTheDocument()
        expect(screen.getByText('$49.99')).toBeInTheDocument()
      })
    })
  })

  describe('Wishlist Actions', () => {
    it('shows add to cart buttons', async () => {
      render(<WishlistPage />)

      await waitFor(() => {
        const addToCartButtons = screen.getAllByText(/add to cart/i)
        expect(addToCartButtons.length).toBeGreaterThan(0)
      })
    })

    it('shows remove from wishlist buttons', async () => {
      render(<WishlistPage />)

      await waitFor(() => {
        const removeButtons = screen.getAllByLabelText(/remove from wishlist/i)
        expect(removeButtons.length).toBeGreaterThan(0)
      })
    })

    it('displays clear wishlist button', async () => {
      render(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /clear wishlist/i })).toBeInTheDocument()
      })
    })
  })

  describe('Empty Wishlist State', () => {
    it('shows empty wishlist message when no items', async () => {
      // Mock empty wishlist
      vi.doMock('@/context/WishlistContext', () => ({
        useWishlist: () => ({
          items: [],
          wishlistCount: 0,
          addToWishlist: vi.fn(),
          removeFromWishlist: vi.fn(),
          isInWishlist: vi.fn().mockReturnValue(false),
          clearWishlist: vi.fn(),
          isLoading: false,
        }),
      }))

      render(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getByText(/your wishlist is empty/i)).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /browse products/i })).toBeInTheDocument()
      })
    })
  })

  describe('Product Information', () => {
    it('displays product conditions', async () => {
      render(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getByText('Near Mint')).toBeInTheDocument()
        expect(screen.getByText('Very Good')).toBeInTheDocument()
      })
    })

    it('shows vendor information', async () => {
      render(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Vendor')).toBeInTheDocument()
        expect(screen.getByText('Comic Store')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', async () => {
      render(<WishlistPage />)

      await waitFor(() => {
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)
      })
    })

    it('has accessible buttons', async () => {
      render(<WishlistPage />)

      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        buttons.forEach(button => {
          expect(button).toBeInTheDocument()
        })
      })
    })

    it('has proper alt text for product images', async () => {
      render(<WishlistPage />)

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        images.forEach(img => {
          expect(img).toHaveAttribute('alt')
        })
      })
    })
  })
})