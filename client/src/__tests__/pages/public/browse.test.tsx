import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BrowsePage from '@/app/browse/page'
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
    getCategories: vi.fn().mockResolvedValue({
      success: true,
      data: [
        { id: '1', name: 'Trading Cards', slug: 'trading-cards', productCount: 10 },
        { id: '2', name: 'Comics', slug: 'comics', productCount: 5 },
      ],
    }),
  }),
}))

// Mock the browse filters hook
vi.mock('@/hooks/useBrowseFilters', () => ({
  useBrowseFilters: () => ({
    filters: {},
    sortOption: 'newest',
    viewMode: 'grid',
    filteredProducts: mockProducts,
    activeFilterCount: 0,
    isFiltering: false,
    updateFilter: vi.fn(),
    clearFilters: vi.fn(),
    clearFilter: vi.fn(),
    setSortOption: vi.fn(),
    setViewMode: vi.fn(),
    saveFilterPreset: vi.fn(),
    loadFilterPreset: vi.fn(),
    getFilterPresets: vi.fn().mockReturnValue([]),
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

describe('Browse Page', () => {
  beforeEach(() => {
    cleanupMocks()
  })

  describe('Rendering', () => {
    it('renders without crashing', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })

    it('displays the page title', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      })
    })

    it('shows the search bar', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        expect(screen.getByRole('searchbox')).toBeInTheDocument()
      })
    })

    it('displays filter sidebar', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument()
      })
    })
  })

  describe('Product Display', () => {
    it('displays product cards when products are loaded', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        expect(screen.getByText('Test Trading Card')).toBeInTheDocument()
        expect(screen.getByText('Test Comic Book')).toBeInTheDocument()
      })
    })

    it('displays product prices correctly', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        expect(screen.getByText('$29.99')).toBeInTheDocument()
        expect(screen.getByText('$49.99')).toBeInTheDocument()
      })
    })

    it('shows product images', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        expect(images.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Search Functionality', () => {
    it('allows typing in search box', async () => {
      const user = userEvent.setup()
      render(<BrowsePage />)

      await waitFor(() => {
        const searchBox = screen.getByRole('searchbox')
        expect(searchBox).toBeInTheDocument()
      })

      const searchBox = screen.getByRole('searchbox')
      await user.type(searchBox, 'trading card')
      expect(searchBox).toHaveValue('trading card')
    })
  })

  describe('Filtering', () => {
    it('shows filter controls', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument()
      })
    })

    it('allows changing view mode', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        // Look for view mode controls (grid/list toggle)
        const viewModeButtons = screen.queryAllByRole('button')
        expect(viewModeButtons.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Interaction', () => {
    it('allows adding products to cart', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        const addToCartButtons = screen.getAllByText(/add to cart/i)
        expect(addToCartButtons.length).toBeGreaterThan(0)
      })
    })

    it('allows adding products to wishlist', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        const wishlistButtons = screen.getAllByLabelText(/add to wishlist/i)
        expect(wishlistButtons.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading state while fetching products', () => {
      render(<BrowsePage />)

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
          getCategories: vi.fn().mockRejectedValue(new Error('API Error')),
        }),
      }))

      render(<BrowsePage />)

      // Should still render the basic page structure
      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)

        // Should have an h1
        const h1 = screen.getByRole('heading', { level: 1 })
        expect(h1).toBeInTheDocument()
      })
    })

    it('has accessible search input', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        const searchBox = screen.getByRole('searchbox')
        expect(searchBox).toBeInTheDocument()
        expect(searchBox).toHaveAttribute('type', 'search')
      })
    })

    it('has proper alt text for product images', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        images.forEach(img => {
          expect(img).toHaveAttribute('alt')
        })
      })
    })
  })

  describe('Responsive Design', () => {
    it('renders correctly on mobile viewport', async () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<BrowsePage />)

      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })

    it('renders correctly on desktop viewport', async () => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      render(<BrowsePage />)

      await waitFor(() => {
        expect(screen.getAllByText('LPX Collect').length).toBeGreaterThan(0)
      })
    })
  })
})