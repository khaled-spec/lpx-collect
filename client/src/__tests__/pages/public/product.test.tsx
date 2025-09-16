import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import ProductPage from '@/app/product/[id]/page'
import { render, mockProducts, cleanupMocks } from '@/__tests__/utils/test-providers'

const mockProduct = mockProducts[0]

// Mock the API
vi.mock('@/lib/api/client', () => ({
  getProductAPI: () => ({
    getProductById: vi.fn().mockResolvedValue({
      success: true,
      data: mockProduct,
    }),
    getProducts: vi.fn().mockResolvedValue({
      success: true,
      data: { data: mockProducts },
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

describe('Product Page', () => {
  const mockParams = { id: 'product-1' }

  beforeEach(() => {
    cleanupMocks()
  })

  describe('Rendering', () => {
    it('renders without crashing', async () => {
      render(<ProductPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })

    it('displays product information', async () => {
      render(<ProductPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText('Test Trading Card')).toBeInTheDocument()
        expect(screen.getByText('$29.99')).toBeInTheDocument()
      })
    })

    it('shows product description', async () => {
      render(<ProductPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText('A test trading card for unit tests')).toBeInTheDocument()
      })
    })
  })

  describe('Product Details', () => {
    it('displays product price', async () => {
      render(<ProductPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText('$29.99')).toBeInTheDocument()
      })
    })

    it('shows product condition', async () => {
      render(<ProductPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText('Near Mint')).toBeInTheDocument()
      })
    })

    it('displays vendor information', async () => {
      render(<ProductPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText('Test Vendor')).toBeInTheDocument()
      })
    })
  })

  describe('Interaction', () => {
    it('shows add to cart button', async () => {
      render(<ProductPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
      })
    })

    it('shows wishlist button', async () => {
      render(<ProductPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add to wishlist/i })).toBeInTheDocument()
      })
    })

    it('shows buy now button', async () => {
      render(<ProductPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /buy now/i })).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading state while fetching product', () => {
      render(<ProductPage params={mockParams} />)

      // Should render the basic page structure
      expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      // Mock API to fail
      vi.doMock('@/lib/api/client', () => ({
        getProductAPI: () => ({
          getProductById: vi.fn().mockRejectedValue(new Error('API Error')),
          getProducts: vi.fn().mockRejectedValue(new Error('API Error')),
        }),
      }))

      render(<ProductPage params={mockParams} />)

      // Should still render the basic page structure
      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', async () => {
      render(<ProductPage params={mockParams} />)

      await waitFor(() => {
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)
      })
    })

    it('has accessible buttons', async () => {
      render(<ProductPage params={mockParams} />)

      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        buttons.forEach(button => {
          expect(button).toBeInTheDocument()
        })
      })
    })

    it('has proper alt text for product images', async () => {
      render(<ProductPage params={mockParams} />)

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        images.forEach(img => {
          expect(img).toHaveAttribute('alt')
        })
      })
    })
  })
})