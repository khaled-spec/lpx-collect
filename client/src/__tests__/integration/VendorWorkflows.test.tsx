import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { TestProviders } from '../utils/test-providers'

// Import the components we'll test in workflows
import VendorDashboardPage from '@/app/vendor/dashboard/page'
import VendorProductsPage from '@/app/vendor/products/page'
import VendorProductNewPage from '@/app/vendor/products/new/page'

// Mock Next.js navigation
const mockPush = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: mockReplace,
  })),
  usePathname: vi.fn(() => '/vendor/dashboard'),
  useParams: vi.fn(() => ({ id: '1' })),
}))

// Mock react-hook-form for product creation
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    register: vi.fn(),
    handleSubmit: vi.fn((fn) => (e) => {
      e.preventDefault()
      fn({
        name: 'New Test Product',
        description: 'Integration test product',
        price: '49.99',
        category: 'trading-cards',
        condition: 'near-mint',
        status: 'draft',
        stock: 5,
      })
    }),
    formState: { errors: {}, isValid: true },
    setValue: vi.fn(),
    watch: vi.fn(),
    reset: vi.fn(),
  })),
}))

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn(() => () => ({})),
}))

// Mock sonner for toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

// Mock categories API to prevent errors
vi.mock('@/lib/categories', () => ({
  getNavigationCategories: vi.fn().mockResolvedValue([
    { name: 'Trading Cards', slug: 'trading-cards' },
    { name: 'Comics', slug: 'comics' },
    { name: 'Toys', slug: 'toys' },
    { name: 'Sports Cards', slug: 'sports-cards' },
  ]),
}))

// Mock the API calls to prevent real network requests
vi.mock('@/lib/api/real', () => ({
  RealCategoryAPI: {
    getCategories: vi.fn().mockResolvedValue([
      { name: 'Trading Cards', slug: 'trading-cards' },
      { name: 'Comics', slug: 'comics' },
    ]),
  },
}))

// Mock fetch for API calls
global.fetch = vi.fn()

describe('Vendor Workflows Integration Tests', () => {
  const mockVendorUser = {
    id: 'vendor-123',
    publicMetadata: { role: 'vendor' },
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    primaryEmailAddress: { emailAddress: 'john@vendor.com' },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUser).mockReturnValue({
      user: mockVendorUser as any,
      isLoaded: true,
      isSignedIn: true,
    })

    // Default fetch mock for successful responses
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { products: [] },
      }),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Vendor Onboarding Workflow', () => {
    it('guides new vendor through complete setup process', async () => {
      // Mock new vendor (no products yet)
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { products: [] },
        }),
      })

      // 1. Start at dashboard
      render(
        <TestProviders>
          <VendorDashboardPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('Welcome to your vendor dashboard!')).toBeInTheDocument()
      })

      // 2. Should show onboarding prompts for new vendors
      expect(screen.getByText(/get started|add your first product/i)).toBeInTheDocument()

      // 3. Click to add first product
      const addProductButton = screen.getByRole('button', { name: /add.*first.*product|get started/i })
      fireEvent.click(addProductButton)

      // Should navigate to product creation
      expect(mockPush).toHaveBeenCalledWith('/vendor/products/new')
    })

    it('shows different dashboard for established vendors', async () => {
      // Mock established vendor with products
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            products: [
              { id: '1', name: 'Product 1', status: 'active' },
              { id: '2', name: 'Product 2', status: 'draft' },
            ],
          },
        }),
      })

      render(
        <TestProviders>
          <VendorDashboardPage />
        </TestProviders>
      )

      await waitFor(() => {
        // Should show analytics instead of onboarding
        expect(screen.getByText(/revenue|analytics|performance/i)).toBeInTheDocument()
        expect(screen.queryByText(/get started|first product/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Product Management Workflow', () => {
    it('completes full product creation workflow', async () => {
      const { toast } = await import('sonner')

      // 1. Start at products page
      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('My Products')).toBeInTheDocument()
      })

      // 2. Click add product
      const addProductButton = screen.getByRole('button', { name: /add product/i })
      fireEvent.click(addProductButton)

      // Should navigate to creation page
      expect(mockPush).toHaveBeenCalledWith('/vendor/products/new')

      // 3. Simulate being on creation page
      render(
        <TestProviders>
          <VendorProductNewPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('Add New Product')).toBeInTheDocument()
      })

      // 4. Fill form and save as draft
      const nameInput = screen.getByLabelText(/product name/i)
      const descriptionInput = screen.getByLabelText(/description/i)
      const priceInput = screen.getByLabelText(/price/i)

      fireEvent.change(nameInput, { target: { value: 'New Test Product' } })
      fireEvent.change(descriptionInput, { target: { value: 'Integration test product' } })
      fireEvent.change(priceInput, { target: { value: '49.99' } })

      const draftButton = screen.getByRole('button', { name: /save.*draft/i })
      fireEvent.click(draftButton)

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Product saved as draft')
      })

      // 5. Publish the product
      const publishButton = screen.getByRole('button', { name: /publish/i })
      fireEvent.click(publishButton)

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Product published successfully')
      })
    })

    it('handles product edit workflow', async () => {
      // Mock existing product data
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            product: {
              id: '1',
              name: 'Existing Product',
              description: 'Original description',
              price: 29.99,
              status: 'active',
            },
          },
        }),
      })

      // 1. Start at products list
      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('My Products')).toBeInTheDocument()
      })

      // 2. Find and click edit on a product
      const editButton = screen.getByTestId('product-actions-1')
      fireEvent.click(editButton)

      await waitFor(() => {
        const editMenuItem = screen.getByText('Edit')
        fireEvent.click(editMenuItem)
      })

      expect(mockPush).toHaveBeenCalledWith('/vendor/products/1/edit')
    })

    it('handles bulk product operations', async () => {
      const { toast } = await import('sonner')

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('My Products')).toBeInTheDocument()
      })

      // Test bulk delete workflow
      const deleteButton = screen.getByTestId('product-actions-1')
      fireEvent.click(deleteButton)

      await waitFor(() => {
        const deleteMenuItem = screen.getByText('Delete')
        fireEvent.click(deleteMenuItem)
      })

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Product deleted successfully')
      })
    })
  })

  describe('Inventory Management Workflow', () => {
    it('updates stock levels and tracks changes', async () => {
      const { toast } = await import('sonner')

      // Mock products with stock data
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            products: [
              { id: '1', name: 'Low Stock Item', stock: 2, status: 'active' },
              { id: '2', name: 'Out of Stock Item', stock: 0, status: 'active' },
            ],
          },
        }),
      })

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        // Should show stock warnings
        expect(screen.getByText(/low stock|out of stock/i)).toBeInTheDocument()
      })

      // Check out of stock tab
      const outOfStockTab = screen.getByText('Out of Stock (1)')
      fireEvent.click(outOfStockTab)

      await waitFor(() => {
        expect(screen.getByText('Out of Stock Item')).toBeInTheDocument()
      })
    })

    it('handles inventory alerts and notifications', async () => {
      // Mock low stock scenarios
      const lowStockProducts = Array.from({ length: 5 }, (_, i) => ({
        id: `low-${i}`,
        name: `Low Stock Product ${i}`,
        stock: 1,
        status: 'active',
      }))

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { products: lowStockProducts },
        }),
      })

      render(
        <TestProviders>
          <VendorDashboardPage />
        </TestProviders>
      )

      await waitFor(() => {
        // Should show inventory alerts
        expect(screen.getByText(/low stock alert|inventory warning/i)).toBeInTheDocument()
        expect(screen.getByText(/5.*items.*low.*stock/i)).toBeInTheDocument()
      })
    })
  })

  describe('Analytics and Reporting Workflow', () => {
    it('displays comprehensive analytics data', async () => {
      // Mock analytics data
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            analytics: {
              revenue: { total: 5432.10, thisMonth: 1234.56 },
              orders: { total: 89, pending: 3, processing: 2, completed: 84 },
              products: { total: 25, active: 20, outOfStock: 3, draft: 2 },
              customers: { total: 45, returning: 12, new: 33, satisfactionRate: 92 },
            },
          },
        }),
      })

      render(
        <TestProviders>
          <VendorDashboardPage />
        </TestProviders>
      )

      await waitFor(() => {
        // Should display all analytics
        expect(screen.getByText('$5,432')).toBeInTheDocument()
        expect(screen.getByText('89')).toBeInTheDocument() // Total orders
        expect(screen.getByText('25')).toBeInTheDocument() // Total products
        expect(screen.getByText('92%')).toBeInTheDocument() // Satisfaction rate
      })
    })

    it('handles date range filtering for analytics', async () => {
      render(
        <TestProviders>
          <VendorDashboardPage />
        </TestProviders>
      )

      await waitFor(() => {
        // Should have date range controls
        expect(screen.getByText(/last 30 days|this month|date range/i)).toBeInTheDocument()
      })

      // Test date range selection
      const dateRangeButton = screen.getByRole('button', { name: /date.*range|period/i })
      fireEvent.click(dateRangeButton)

      await waitFor(() => {
        expect(screen.getByText(/last 7 days|last 30 days|last 90 days/i)).toBeInTheDocument()
      })
    })
  })

  describe('Order Management Workflow', () => {
    it('processes orders from received to fulfilled', async () => {
      const { toast } = await import('sonner')

      // Mock order data
      const mockOrders = [
        {
          id: 'order-1',
          status: 'pending',
          customer: 'John Customer',
          total: 99.99,
          items: [{ name: 'Test Product', quantity: 1 }],
        },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { orders: mockOrders },
        }),
      })

      render(
        <TestProviders>
          <VendorDashboardPage />
        </TestProviders>
      )

      await waitFor(() => {
        // Should show pending orders
        expect(screen.getByText(/pending.*orders|new.*orders/i)).toBeInTheDocument()
        expect(screen.getByText('John Customer')).toBeInTheDocument()
      })

      // Process order
      const processButton = screen.getByRole('button', { name: /process|fulfill|mark.*shipped/i })
      fireEvent.click(processButton)

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(/order.*processed|shipped/i)
      })
    })

    it('handles order disputes and customer communication', async () => {
      // Mock disputed order
      const disputedOrder = {
        id: 'order-disputed',
        status: 'disputed',
        customer: 'Unhappy Customer',
        total: 149.99,
        dispute: { reason: 'Item not as described', date: '2024-01-15' },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { orders: [disputedOrder] },
        }),
      })

      render(
        <TestProviders>
          <VendorDashboardPage />
        </TestProviders>
      )

      await waitFor(() => {
        // Should show dispute alert
        expect(screen.getByText(/dispute|issue|problem/i)).toBeInTheDocument()
        expect(screen.getByText('Unhappy Customer')).toBeInTheDocument()
      })

      // Handle dispute
      const respondButton = screen.getByRole('button', { name: /respond|resolve|contact/i })
      fireEvent.click(respondButton)

      await waitFor(() => {
        expect(screen.getByText(/message|response|resolution/i)).toBeInTheDocument()
      })
    })
  })

  describe('Search and Navigation Workflow', () => {
    it('searches across products and navigates results', async () => {
      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('My Products')).toBeInTheDocument()
      })

      // Search for products
      const searchInput = screen.getByPlaceholderText('Search products...')
      fireEvent.change(searchInput, { target: { value: 'Charizard' } })

      await waitFor(() => {
        // Should filter products
        expect(screen.getByText('Charizard Base Set Holo')).toBeInTheDocument()
        expect(screen.queryByText('Spider-Man #1 (1990)')).not.toBeInTheDocument()
      })

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } })

      await waitFor(() => {
        // Should show all products again
        expect(screen.getByText('Charizard Base Set Holo')).toBeInTheDocument()
        expect(screen.getByText('Spider-Man #1 (1990)')).toBeInTheDocument()
      })
    })

    it('navigates between different vendor sections', async () => {
      render(
        <TestProviders>
          <VendorDashboardPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('My Dashboard')).toBeInTheDocument()
      })

      // Navigate to products
      const productsLink = screen.getByRole('link', { name: /products|inventory/i })
      fireEvent.click(productsLink)

      expect(productsLink).toHaveAttribute('href', '/vendor/products')

      // Navigate to orders
      const ordersLink = screen.getByRole('link', { name: /orders/i })
      fireEvent.click(ordersLink)

      expect(ordersLink).toHaveAttribute('href', '/vendor/orders')
    })
  })

  describe('Error Recovery Workflow', () => {
    it('handles API failures gracefully and allows retry', async () => {
      const { toast } = await import('sonner')

      // Mock API failure
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      render(
        <TestProviders>
          <VendorDashboardPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(/failed.*load|error.*occurred/i)
      })

      // Should show retry option
      expect(screen.getByRole('button', { name: /retry|try.*again/i })).toBeInTheDocument()

      // Mock successful retry
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { analytics: {} },
        }),
      })

      const retryButton = screen.getByRole('button', { name: /retry|try.*again/i })
      fireEvent.click(retryButton)

      await waitFor(() => {
        expect(screen.getByText(/dashboard|analytics/i)).toBeInTheDocument()
      })
    })

    it('handles session expiration during workflow', async () => {
      // Mock session expiration
      vi.mocked(useUser).mockReturnValue({
        user: null,
        isLoaded: true,
        isSignedIn: false,
      })

      render(
        <TestProviders>
          <VendorDashboardPage />
        </TestProviders>
      )

      // Should redirect to sign in or show auth prompt
      expect(screen.queryByText('My Dashboard')).not.toBeInTheDocument()
    })

    it('recovers from form submission errors', async () => {
      const { toast } = await import('sonner')

      render(
        <TestProviders>
          <VendorProductNewPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('Add New Product')).toBeInTheDocument()
      })

      // Mock form submission failure
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Submission failed'))

      const publishButton = screen.getByRole('button', { name: /publish/i })
      fireEvent.click(publishButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(/failed.*publish|error.*saving/i)
      })

      // Form should remain filled and allow retry
      expect(screen.getByRole('button', { name: /publish/i })).toBeInTheDocument()
    })
  })

  describe('Performance Optimization Workflow', () => {
    it('handles large product catalogs efficiently', async () => {
      // Mock large product dataset
      const largeProductSet = Array.from({ length: 100 }, (_, i) => ({
        id: `product-${i}`,
        name: `Product ${i}`,
        price: 10 + i,
        status: i % 3 === 0 ? 'draft' : 'active',
        stock: i % 10,
      }))

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { products: largeProductSet },
        }),
      })

      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('All Products (100)')).toBeInTheDocument()
      })

      // Should handle pagination or virtualization
      expect(screen.getByText('Product 0')).toBeInTheDocument()
      expect(screen.queryByText('Product 99')).toBeTruthy() // May be virtualized
    })

    it('optimizes search performance with debouncing', async () => {
      render(
        <TestProviders>
          <VendorProductsPage />
        </TestProviders>
      )

      const searchInput = screen.getByPlaceholderText('Search products...')

      // Rapid typing should debounce API calls
      fireEvent.change(searchInput, { target: { value: 'C' } })
      fireEvent.change(searchInput, { target: { value: 'Ch' } })
      fireEvent.change(searchInput, { target: { value: 'Cha' } })
      fireEvent.change(searchInput, { target: { value: 'Char' } })

      // Should only make one API call after debounce period
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1) // Initial load only
      })
    })
  })
})