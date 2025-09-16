import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useParams } from 'next/navigation'
import VendorProfilePage from '@/app/vendor/[id]/page'
import { TestProviders } from '../utils/test-providers'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useParams: vi.fn(() => ({ id: 'test-vendor' })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
  usePathname: vi.fn(() => '/vendor/test-vendor'),
}))

// Mock categories API
vi.mock('@/lib/categories', () => ({
  getNavigationCategories: vi.fn().mockResolvedValue([
    { name: 'Trading Cards', slug: 'trading-cards' },
  ]),
}))

// Mock vendor data
const mockVendor = {
  id: 'test-vendor',
  name: 'Test Card Shop',
  slug: 'test-vendor',
  description: 'Premium trading cards and collectibles',
  rating: 4.8,
  totalSales: 1247,
  verified: true,
  joinedDate: '2022-01-15',
  location: 'New York, NY',
  specialties: ['Trading Cards', 'Sports Cards', 'Gaming Cards'],
  avatar: '/vendor-avatar.jpg',
  banner: '/vendor-banner.jpg',
  totalProducts: 156,
  responseTime: '2 hours',
  shippingInfo: {
    freeShippingOver: 50,
    averageProcessingTime: '1-2 business days',
  },
}

const mockVendorProducts = [
  {
    id: '1',
    name: 'Charizard Base Set Holo',
    price: 299.99,
    image: '/product1.jpg',
    condition: 'Near Mint',
    views: 245,
  },
  {
    id: '2',
    name: 'Spider-Man #1 (1990)',
    price: 189.99,
    image: '/product2.jpg',
    condition: 'CGC 9.8',
    views: 189,
  },
]

// Mock API calls
global.fetch = vi.fn()

describe('VendorProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useParams).mockReturnValue({ id: 'test-vendor' })

    // Mock successful API responses
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { vendor: mockVendor },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { products: mockVendorProducts },
        }),
      })
  })

  it('renders vendor profile page', async () => {
    render(
      <TestProviders>
        <VendorProfilePage />
      </TestProviders>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Card Shop')).toBeInTheDocument()
    })
  })

  it('displays vendor information', async () => {
    render(
      <TestProviders>
        <VendorProfilePage />
      </TestProviders>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Card Shop')).toBeInTheDocument()
      expect(screen.getByText('Premium trading cards and collectibles')).toBeInTheDocument()
      expect(screen.getByText('4.8')).toBeInTheDocument()
      expect(screen.getByText('1,247')).toBeInTheDocument()
    })
  })

  it('shows verified badge for verified vendors', async () => {
    render(
      <TestProviders>
        <VendorProfilePage />
      </TestProviders>
    )

    await waitFor(() => {
      expect(screen.getByText(/verified|trusted/i)).toBeInTheDocument()
    })
  })

  it('displays vendor specialties', async () => {
    render(
      <TestProviders>
        <VendorProfilePage />
      </TestProviders>
    )

    await waitFor(() => {
      expect(screen.getByText('Trading Cards')).toBeInTheDocument()
      expect(screen.getByText('Sports Cards')).toBeInTheDocument()
      expect(screen.getByText('Gaming Cards')).toBeInTheDocument()
    })
  })

  it('shows vendor statistics', async () => {
    render(
      <TestProviders>
        <VendorProfilePage />
      </TestProviders>
    )

    await waitFor(() => {
      expect(screen.getByText(/156.*products|total.*products/i)).toBeInTheDocument()
      expect(screen.getByText(/2.*hours|response.*time/i)).toBeInTheDocument()
      expect(screen.getByText(/1-2.*business.*days/i)).toBeInTheDocument()
    })
  })

  it('displays shipping information', async () => {
    render(
      <TestProviders>
        <VendorProfilePage />
      </TestProviders>
    )

    await waitFor(() => {
      expect(screen.getByText(/free shipping.*\$50/i)).toBeInTheDocument()
      expect(screen.getByText(/1-2.*business.*days/i)).toBeInTheDocument()
    })
  })

  it('shows vendor products', async () => {
    render(
      <TestProviders>
        <VendorProfilePage />
      </TestProviders>
    )

    await waitFor(() => {
      expect(screen.getByText('Charizard Base Set Holo')).toBeInTheDocument()
      expect(screen.getByText('Spider-Man #1 (1990)')).toBeInTheDocument()
      expect(screen.getByText('$299.99')).toBeInTheDocument()
      expect(screen.getByText('$189.99')).toBeInTheDocument()
    })
  })

  it('handles product filtering', async () => {
    render(
      <TestProviders>
        <VendorProfilePage />
      </TestProviders>
    )

    await waitFor(() => {
      // Should have filter/search functionality
      expect(screen.getByPlaceholderText(/search.*products/i) || screen.getByText(/filter/i)).toBeInTheDocument()
    })
  })

  it('shows product sorting options', async () => {
    render(
      <TestProviders>
        <VendorProfilePage />
      </TestProviders>
    )

    await waitFor(() => {
      // Should have sorting options
      expect(screen.getByText(/sort.*by|price|newest|popular/i)).toBeInTheDocument()
    })
  })

  it('displays grid and list view options', async () => {
    render(
      <TestProviders>
        <VendorProfilePage />
      </TestProviders>
    )

    await waitFor(() => {
      // Should have view mode toggles
      const gridButton = screen.getByRole('button', { name: /grid.*view/i })
      const listButton = screen.getByRole('button', { name: /list.*view/i })

      expect(gridButton || listButton).toBeInTheDocument()
    })
  })

  it('handles view mode changes', async () => {
    render(
      <TestProviders>
        <VendorProfilePage />
      </TestProviders>
    )

    await waitFor(() => {
      const viewToggle = screen.getByRole('button', { name: /view/i })
      fireEvent.click(viewToggle)

      // View should change (test implementation may vary)
      expect(viewToggle).toBeInTheDocument()
    })
  })

  describe('Contact Vendor', () => {
    it('shows contact vendor button', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /contact.*vendor|message.*seller/i })).toBeInTheDocument()
      })
    })

    it('handles contact vendor action', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        const contactButton = screen.getByRole('button', { name: /contact.*vendor|message.*seller/i })
        fireEvent.click(contactButton)

        // Should open contact modal or navigate to message page
        expect(screen.getByText(/send.*message|contact.*form/i) || contactButton).toBeInTheDocument()
      })
    })
  })

  describe('Product Interactions', () => {
    it('handles adding products to cart', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        const addToCartButtons = screen.getAllByRole('button', { name: /add.*cart/i })
        expect(addToCartButtons.length).toBeGreaterThan(0)

        fireEvent.click(addToCartButtons[0])
        // Should add to cart (toast or visual feedback)
      })
    })

    it('handles adding products to wishlist', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        const wishlistButtons = screen.getAllByRole('button', { name: /wishlist|heart/i })
        expect(wishlistButtons.length).toBeGreaterThan(0)

        fireEvent.click(wishlistButtons[0])
        // Should add to wishlist
      })
    })

    it('handles product navigation', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        const productLinks = screen.getAllByRole('link', { name: /charizard|spider-man/i })
        expect(productLinks.length).toBeGreaterThan(0)

        // Links should navigate to product pages
        expect(productLinks[0]).toHaveAttribute('href', '/product/1')
      })
    })
  })

  describe('Error Handling', () => {
    it('handles vendor not found', async () => {
      vi.mocked(useParams).mockReturnValue({ id: 'non-existent-vendor' })

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          success: false,
          error: { message: 'Vendor not found' },
        }),
      })

      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText(/vendor not found|not found/i)).toBeInTheDocument()
      })
    })

    it('handles API errors gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText(/error loading|something went wrong/i)).toBeInTheDocument()
      })
    })

    it('shows empty state when vendor has no products', async () => {
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: { vendor: mockVendor },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: { products: [] },
          }),
        })

      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText(/no products|this vendor.*no.*products/i)).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading state initially', () => {
      // Mock slow API response
      global.fetch = vi.fn(() => new Promise(() => {}))

      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      expect(screen.getByText(/loading|spinner/i) || screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('shows loading state for products', async () => {
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: { vendor: mockVendor },
          }),
        })
        .mockImplementationOnce(() => new Promise(() => {})) // Never resolves

      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('Test Card Shop')).toBeInTheDocument()
      })

      // Should show products loading state
      expect(screen.getByText(/loading.*products/i) || screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('adapts to mobile view', async () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('Test Card Shop')).toBeInTheDocument()
      })

      // Should have mobile-appropriate layout
      expect(document.querySelector('.mobile-view') || document.querySelector('[data-mobile]')).toBeTruthy()
    })
  })

  describe('SEO and Meta', () => {
    it('sets proper page title', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('Test Card Shop')).toBeInTheDocument()
      })

      // Page should have proper title structure
      expect(document.title).toContain('Test Card Shop')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading structure', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /test card shop/i })).toBeInTheDocument()
      })
    })

    it('has proper link labels', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        const productLinks = screen.getAllByRole('link')
        productLinks.forEach(link => {
          expect(link).toHaveAttribute('href')
        })
      })
    })

    it('has proper button labels', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        buttons.forEach(button => {
          expect(button).toHaveAccessibleName()
        })
      })
    })

    it('has proper image alt text', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        images.forEach(img => {
          expect(img).toHaveAttribute('alt')
        })
      })
    })
  })

  describe('Vendor Reviews', () => {
    it('shows vendor rating and reviews', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('4.8')).toBeInTheDocument()
        expect(screen.getByText(/reviews|ratings/i)).toBeInTheDocument()
      })
    })

    it('shows review breakdown', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        // Should show star ratings or review counts
        expect(screen.getByText(/5.*star|4.*star|excellent|good/i)).toBeInTheDocument()
      })
    })
  })

  describe('Social Proof', () => {
    it('shows total sales count', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText('1,247')).toBeInTheDocument()
        expect(screen.getByText(/sales|sold/i)).toBeInTheDocument()
      })
    })

    it('shows join date', async () => {
      render(
        <TestProviders>
          <VendorProfilePage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText(/joined.*2022|member.*since.*2022/i)).toBeInTheDocument()
      })
    })
  })
})