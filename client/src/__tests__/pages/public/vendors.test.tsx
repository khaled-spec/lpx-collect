import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import VendorsPage from '@/app/vendors/page'
import { render, cleanupMocks } from '@/__tests__/utils/test-providers'

const mockVendors = [
  {
    id: 'vendor-1',
    userId: 'user-1',
    storeName: 'Test Vendor Store 1',
    description: 'A test vendor for unit testing',
    rating: 4.8,
    totalSales: 250,
    totalProducts: 15,
    responseTime: '< 2 hours',
    shippingInfo: 'Fast shipping available',
    returnPolicy: '30-day return policy',
    verified: true,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'vendor-2',
    userId: 'user-2',
    storeName: 'Test Vendor Store 2',
    description: 'Another test vendor',
    rating: 4.5,
    totalSales: 150,
    totalProducts: 8,
    responseTime: '< 4 hours',
    shippingInfo: 'Standard shipping',
    returnPolicy: '15-day return policy',
    verified: false,
    createdAt: new Date('2023-06-01'),
  },
]

// Mock the API
vi.mock('@/lib/api/client', () => ({
  getVendorAPI: () => ({
    getVendors: vi.fn().mockResolvedValue({
      success: true,
      data: mockVendors,
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

describe('Vendors Page', () => {
  beforeEach(() => {
    cleanupMocks()
  })

  describe('Rendering', () => {
    it('renders without crashing', async () => {
      render(<VendorsPage />)

      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })

    it('displays the page title', async () => {
      render(<VendorsPage />)

      await waitFor(() => {
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)
      })
    })

    it('shows vendor cards', async () => {
      render(<VendorsPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Vendor Store 1')).toBeInTheDocument()
        expect(screen.getByText('Test Vendor Store 2')).toBeInTheDocument()
      })
    })
  })

  describe('Vendor Display', () => {
    it('displays vendor ratings', async () => {
      render(<VendorsPage />)

      await waitFor(() => {
        expect(screen.getByText('4.8')).toBeInTheDocument()
        expect(screen.getByText('4.5')).toBeInTheDocument()
      })
    })

    it('shows verified status for verified vendors', async () => {
      render(<VendorsPage />)

      await waitFor(() => {
        expect(screen.getByText(/verified/i)).toBeInTheDocument()
      })
    })

    it('displays vendor statistics', async () => {
      render(<VendorsPage />)

      await waitFor(() => {
        expect(screen.getByText('250')).toBeInTheDocument() // total sales
        expect(screen.getByText('15')).toBeInTheDocument() // total products
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading state while fetching vendors', () => {
      render(<VendorsPage />)

      // Should render the basic page structure
      expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      // Mock API to fail
      vi.doMock('@/lib/api/client', () => ({
        getVendorAPI: () => ({
          getVendors: vi.fn().mockRejectedValue(new Error('API Error')),
        }),
      }))

      render(<VendorsPage />)

      // Should still render the basic page structure
      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', async () => {
      render(<VendorsPage />)

      await waitFor(() => {
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)
      })
    })

    it('has accessible vendor links', async () => {
      render(<VendorsPage />)

      await waitFor(() => {
        const links = screen.getAllByRole('link')
        links.forEach(link => {
          expect(link).toHaveAttribute('href')
        })
      })
    })
  })
})