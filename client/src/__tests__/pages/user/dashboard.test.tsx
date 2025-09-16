import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'
import { render, cleanupMocks, mockClerkAuth, mockOrder } from '@/__tests__/utils/test-providers'

// Mock Clerk's useUser hook
vi.mock('@clerk/nextjs', () => ({
  useUser: () => mockClerkAuth,
  useClerk: () => ({
    signOut: vi.fn(),
  }),
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="sign-in-button">{children}</button>
  ),
}))

// Mock the API
vi.mock('@/lib/api/client', () => ({
  getOrderAPI: () => ({
    getUserOrders: vi.fn().mockResolvedValue({
      success: true,
      data: [mockOrder],
    }),
  }),
  getProductAPI: () => ({
    getRecentlyViewed: vi.fn().mockResolvedValue({
      success: true,
      data: [],
    }),
  }),
  getCategoryAPI: () => ({
    getCategories: vi.fn().mockResolvedValue({
      success: true,
      data: [],
    }),
  }),
}))

describe('Dashboard Page', () => {
  beforeEach(() => {
    cleanupMocks()
  })

  describe('Rendering', () => {
    it('renders without crashing', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })

    it('displays welcome message', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
      })
    })

    it('shows user name', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText(/welcome back,.*test user/i)).toBeInTheDocument()
      })
    })
  })

  describe('Dashboard Sections', () => {
    it('displays recent orders section', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText(/recent orders/i)).toBeInTheDocument()
      })
    })

    it('displays quick actions', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText(/quick actions/i)).toBeInTheDocument()
      })
    })
  })

  describe('Order Display', () => {
    it('shows order information', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Order #1')).toBeInTheDocument()
      })
    })

    it('displays order status', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText(/delivered/i)).toBeInTheDocument()
      })
    })

    it('shows order total', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getAllByText(/299.99/).length).toBeGreaterThan(0)
      })
    })
  })

  describe('Quick Actions', () => {
    it('shows account settings link', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /account settings/i })).toBeInTheDocument()
      })
    })

    it('displays wishlist link', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /my wishlist/i })).toBeInTheDocument()
      })
    })

    it('shows payment methods link', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /payment methods/i })).toBeInTheDocument()
      })
    })
  })

  describe('Statistics', () => {
    it('displays total orders count', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText(/total orders/i)).toBeInTheDocument()
      })
    })

    it('shows member since date', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText(/member since/i)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)
      })
    })

    it('has accessible links', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        const settingsLink = screen.getByRole('link', { name: /account settings/i })
        expect(settingsLink).toHaveAttribute('href')
        const wishlistLink = screen.getByRole('link', { name: /my wishlist/i })
        expect(wishlistLink).toHaveAttribute('href')
      })
    })
  })
})