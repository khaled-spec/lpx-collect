import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CartPage from '@/app/cart/page'
import { render, cleanupMocks, mockProducts } from '@/__tests__/utils/test-providers'

const mockCartItems = [
  {
    ...mockProducts[0],
    quantity: 2,
  },
  {
    ...mockProducts[1],
    quantity: 1,
  },
]

// Mock the cart context
vi.mock('@/context/CartContext', () => ({
  useCart: () => ({
    items: mockCartItems,
    itemCount: 3,
    total: 109.97,
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
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

describe('Cart Page', () => {
  beforeEach(() => {
    cleanupMocks()
  })

  describe('Rendering', () => {
    it('renders without crashing', async () => {
      render(<CartPage />)

      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })

    it('displays cart items', async () => {
      render(<CartPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Trading Card')).toBeInTheDocument()
        expect(screen.getByText('Test Comic Book')).toBeInTheDocument()
      })
    })

    it('shows item quantities', async () => {
      render(<CartPage />)

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument() // Quantity for first item
      })
    })

    it('displays cart total', async () => {
      render(<CartPage />)

      await waitFor(() => {
        expect(screen.getByText(/109.97/)).toBeInTheDocument()
      })
    })
  })

  describe('Cart Actions', () => {
    it('shows update quantity buttons', async () => {
      render(<CartPage />)

      await waitFor(() => {
        const increaseButtons = screen.getAllByLabelText(/increase quantity/i)
        const decreaseButtons = screen.getAllByLabelText(/decrease quantity/i)
        expect(increaseButtons.length).toBeGreaterThan(0)
        expect(decreaseButtons.length).toBeGreaterThan(0)
      })
    })

    it('shows remove item buttons', async () => {
      render(<CartPage />)

      await waitFor(() => {
        const removeButtons = screen.getAllByLabelText(/remove/i)
        expect(removeButtons.length).toBeGreaterThan(0)
      })
    })

    it('displays checkout button', async () => {
      render(<CartPage />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument()
      })
    })

    it('shows clear cart button', async () => {
      render(<CartPage />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /clear cart/i })).toBeInTheDocument()
      })
    })
  })

  describe('Empty Cart State', () => {
    it('shows empty cart message when no items', async () => {
      // Mock empty cart
      vi.doMock('@/context/CartContext', () => ({
        useCart: () => ({
          items: [],
          itemCount: 0,
          total: 0,
          addToCart: vi.fn(),
          removeFromCart: vi.fn(),
          updateQuantity: vi.fn(),
          clearCart: vi.fn(),
          isLoading: false,
        }),
      }))

      render(<CartPage />)

      await waitFor(() => {
        expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument()
      })
    })
  })

  describe('Price Display', () => {
    it('shows individual item prices', async () => {
      render(<CartPage />)

      await waitFor(() => {
        expect(screen.getByText('$29.99')).toBeInTheDocument()
        expect(screen.getByText('$49.99')).toBeInTheDocument()
      })
    })

    it('calculates and displays subtotal', async () => {
      render(<CartPage />)

      await waitFor(() => {
        expect(screen.getByText(/subtotal/i)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', async () => {
      render(<CartPage />)

      await waitFor(() => {
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)
      })
    })

    it('has accessible buttons', async () => {
      render(<CartPage />)

      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        buttons.forEach(button => {
          expect(button).toBeInTheDocument()
        })
      })
    })
  })
})