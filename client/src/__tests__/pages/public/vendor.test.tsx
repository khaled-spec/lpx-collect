import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import VendorPage from '@/app/vendor/[id]/page'
import { render, mockProducts, cleanupMocks } from '@/__tests__/utils/test-providers'

const mockVendor = {
  id: 'vendor-1',
  userId: 'user-1',
  storeName: 'Test Vendor Store',
  description: 'A test vendor for unit testing',
  rating: 4.8,
  totalSales: 250,
  totalProducts: 15,
  responseTime: '< 2 hours',
  shippingInfo: 'Fast shipping available',
  returnPolicy: '30-day return policy',
  verified: true,
  createdAt: new Date('2023-01-01'),
}

// Mock the API
vi.mock('@/lib/api/client', () => ({
  getProductAPI: () => ({
    getProductsByVendor: vi.fn().mockResolvedValue({
      success: true,
      data: { data: mockProducts },
    }),
  }),
  getVendorAPI: () => ({
    getVendorById: vi.fn().mockResolvedValue({
      success: true,
      data: mockVendor,
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

describe('Vendor Page', () => {
  const mockParams = { id: 'vendor-1' }

  beforeEach(() => {
    cleanupMocks()
  })

  describe('Rendering', () => {
    it('renders without crashing', async () => {
      render(<VendorPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })

    it('displays vendor information', async () => {
      render(<VendorPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText('Test Vendor Store')).toBeInTheDocument()
      })
    })

    it('shows vendor products', async () => {
      render(<VendorPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText('Test Trading Card')).toBeInTheDocument()
      })
    })
  })

  describe('Product Display', () => {
    it('displays product cards when products are loaded', async () => {
      render(<VendorPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText('Test Trading Card')).toBeInTheDocument()
        expect(screen.getByText('Test Comic Book')).toBeInTheDocument()
      })
    })

    it('displays product prices correctly', async () => {
      render(<VendorPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText('$29.99')).toBeInTheDocument()
        expect(screen.getByText('$49.99')).toBeInTheDocument()
      })
    })
  })

  describe('Vendor Information', () => {
    it('displays vendor rating', async () => {
      render(<VendorPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText('4.8')).toBeInTheDocument()
      })
    })

    it('shows verified status', async () => {
      render(<VendorPage params={mockParams} />)

      await waitFor(() => {
        expect(screen.getByText(/verified/i)).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading state while fetching data', () => {
      render(<VendorPage params={mockParams} />)

      // Should render the basic page structure
      expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      // Mock API to fail
      vi.doMock('@/lib/api/client', () => ({
        getProductAPI: () => ({
          getProductsByVendor: vi.fn().mockRejectedValue(new Error('API Error')),
        }),
        getVendorAPI: () => ({
          getVendorById: vi.fn().mockRejectedValue(new Error('API Error')),
        }),
      }))

      render(<VendorPage params={mockParams} />)

      // Should still render the basic page structure
      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', async () => {
      render(<VendorPage params={mockParams} />)

      await waitFor(() => {
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)
      })
    })

    it('has proper alt text for images', async () => {
      render(<VendorPage params={mockParams} />)

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        images.forEach(img => {
          expect(img).toHaveAttribute('alt')
        })
      })
    })
  })
})