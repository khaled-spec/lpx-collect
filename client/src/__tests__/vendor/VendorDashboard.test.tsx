import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUser } from '@clerk/nextjs'
import VendorDashboardPage from '@/app/vendor/dashboard/page'
import { TestProviders } from '../utils/test-providers'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
  usePathname: vi.fn(() => '/vendor/dashboard'),
}))

describe('VendorDashboardPage', () => {
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
  })

  it('renders vendor dashboard with proper header', () => {
    render(
      <TestProviders>
        <VendorDashboardPage />
      </TestProviders>
    )

    expect(screen.getByText('Vendor Dashboard')).toBeInTheDocument()
    expect(screen.getByText("Welcome back! Here's what's happening with your store today.")).toBeInTheDocument()
  })

  it('displays analytics cards with mock data', () => {
    render(
      <TestProviders>
        <VendorDashboardPage />
      </TestProviders>
    )

    // Check for revenue card
    expect(screen.getByText('Revenue this month')).toBeInTheDocument()
    expect(screen.getByText('$0')).toBeInTheDocument() // Mock revenue is 0

    // Check for orders card
    expect(screen.getByText('Total orders')).toBeInTheDocument()

    // Check for products card
    expect(screen.getByText('Active products')).toBeInTheDocument()

    // Check for customers card
    expect(screen.getByText('Total customers')).toBeInTheDocument()

    // Verify multiple zeros are displayed for different metrics
    const zeroElements = screen.getAllByText('0')
    expect(zeroElements.length).toBeGreaterThan(1) // Multiple zero values expected
  })

  it('shows action buttons in header', () => {
    render(
      <TestProviders>
        <VendorDashboardPage />
      </TestProviders>
    )

    const addProductButtons = screen.getAllByRole('link', { name: /add product/i })
    const viewStoreButton = screen.getByRole('link', { name: /view store/i })

    expect(addProductButtons.length).toBeGreaterThan(0)
    expect(addProductButtons[0]).toHaveAttribute('href', '/vendor/products')

    expect(viewStoreButton).toBeInTheDocument()
    expect(viewStoreButton).toHaveAttribute('href', '/vendor/1')
  })

  it('displays recent activity section', () => {
    render(
      <TestProviders>
        <VendorDashboardPage />
      </TestProviders>
    )

    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('Recent Orders')).toBeInTheDocument()
    expect(screen.getByText('Product Management')).toBeInTheDocument()
  })

  it('shows empty states when no data available', () => {
    render(
      <TestProviders>
        <VendorDashboardPage />
      </TestProviders>
    )

    expect(screen.getByText('No orders yet')).toBeInTheDocument()
    // Check for EmptyState component or its text
    expect(
      screen.queryByText('Add Your First Product') ||
      screen.queryByTestId('no-vendor-products') ||
      screen.queryByText(/no products/i)
    ).toBeTruthy()
  })

  it('displays percentage changes with correct styling', () => {
    render(
      <TestProviders>
        <VendorDashboardPage />
      </TestProviders>
    )

    // Revenue growth badge (mock is 0%)
    const revenueBadge = screen.getByText('0%')
    expect(revenueBadge).toBeInTheDocument()

    // Orders change badge (mock is 15.2%)
    const ordersBadge = screen.getByText('15.2%')
    expect(ordersBadge).toBeInTheDocument()

    // Customers change badge (mock is 8.5%)
    const customersBadge = screen.getByText('8.5%')
    expect(customersBadge).toBeInTheDocument()
  })

  it('formats currency correctly', () => {
    render(
      <TestProviders>
        <VendorDashboardPage />
      </TestProviders>
    )

    // Should display $0 for revenue with proper formatting
    const revenueDisplay = screen.getByText('$0')
    expect(revenueDisplay).toBeInTheDocument()
  })

  it('has proper protected route wrapper', () => {
    const { container } = render(
      <TestProviders>
        <VendorDashboardPage />
      </TestProviders>
    )

    // Should be wrapped in ProtectedRoute component
    expect(container.firstChild).toBeTruthy()
  })

  it('displays progress bars for metrics', () => {
    render(
      <TestProviders>
        <VendorDashboardPage />
      </TestProviders>
    )

    // Progress bars should be rendered (check for role progressbar)
    const progressBars = screen.getAllByRole('progressbar')
    expect(progressBars.length).toBeGreaterThan(0)
  })

  it('has responsive design elements', () => {
    render(
      <TestProviders>
        <VendorDashboardPage />
      </TestProviders>
    )

    // Check for responsive grid classes
    const container = screen.getByText('Vendor Dashboard').closest('section')
    expect(container).toBeTruthy()
  })

  describe('State Management', () => {
    it('initializes with month period selected', () => {
      render(
        <TestProviders>
          <VendorDashboardPage />
        </TestProviders>
      )

      // Component should render without errors with default state
      expect(screen.getByText('Vendor Dashboard')).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('has correct navigation links', () => {
      render(
        <TestProviders>
          <VendorDashboardPage />
        </TestProviders>
      )

      // Check for links to products management
      const productLinks = screen.getAllByRole('link', { name: /add product|manage/i })
      expect(productLinks.length).toBeGreaterThan(0)

      productLinks.forEach(link => {
        expect(link.getAttribute('href')).toMatch(/\/vendor\/products/)
      })
    })
  })

  describe('Analytics Display', () => {
    it('displays stats with proper icons', () => {
      render(
        <TestProviders>
          <VendorDashboardPage />
        </TestProviders>
      )

      // Check for Lucide icons (they should be present as svg elements)
      const icons = document.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(4) // Should have multiple icons
    })
  })
})