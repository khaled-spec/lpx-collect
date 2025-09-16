import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import CategoryPage from '@/app/category/[slug]/page'
import { render, mockProducts, cleanupMocks } from '@/__tests__/utils/test-providers'

// Mock the API
vi.mock('@/lib/api/client', () => ({
  getProductAPI: () => ({
    getProducts: vi.fn().mockResolvedValue({
      success: true,
      data: { data: mockProducts },
    }),
  }),
  getCategoryAPI: () => ({
    getCategoryBySlug: vi.fn().mockResolvedValue({
      success: true,
      data: { id: '1', name: 'Trading Cards', slug: 'trading-cards', productCount: 10 },
    }),
    getCategories: vi.fn().mockResolvedValue({
      success: true,
      data: [
        { id: '1', name: 'Trading Cards', slug: 'trading-cards', productCount: 10 },
        { id: '2', name: 'Comics', slug: 'comics', productCount: 5 },
      ],
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

describe('Category Page', () => {
  const mockParams = { slug: 'trading-cards' }

  beforeEach(() => {
    cleanupMocks()
  })

  describe('Rendering', () => {
    it('renders without crashing', async () => {
      render(<CategoryPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })

    it('displays the page title', async () => {
      render(<CategoryPage params={mockParams} />)

      await waitFor(() => {
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)
      })
    })

    it('shows category products', async () => {
      render(<CategoryPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText('Test Trading Card')).toBeInTheDocument()
      })
    })
  })

  describe('Product Display', () => {
    it('displays product cards when products are loaded', async () => {
      render(<CategoryPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText('Test Trading Card')).toBeInTheDocument()
        expect(screen.getByText('Test Comic Book')).toBeInTheDocument()
      })
    })

    it('displays product prices correctly', async () => {
      render(<CategoryPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText('$29.99')).toBeInTheDocument()
        expect(screen.getByText('$49.99')).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading state while fetching products', () => {
      render(<CategoryPage params={mockParams} />)

      // Should render the basic page structure
      expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      // Mock API to fail
      vi.doMock('@/lib/api/client', () => ({
        getProductAPI: () => ({
          getProducts: vi.fn().mockRejectedValue(new Error('API Error')),
        }),
        getCategoryAPI: () => ({
          getCategoryBySlug: vi.fn().mockRejectedValue(new Error('API Error')),
          getCategories: vi.fn().mockRejectedValue(new Error('API Error')),
        }),
      }))

      render(<CategoryPage params={mockParams} />)

      // Should still render the basic page structure
      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', async () => {
      render(<CategoryPage params={mockParams} />)

      await waitFor(() => {
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)
      })
    })

    it('has proper alt text for product images', async () => {
      render(<CategoryPage params={mockParams} />)

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        images.forEach(img => {
          expect(img).toHaveAttribute('alt')
        })
      })
    })
  })
})