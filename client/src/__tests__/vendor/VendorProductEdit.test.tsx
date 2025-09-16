import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUser } from '@clerk/nextjs'
import { useRouter, useParams } from 'next/navigation'
import VendorProductEditPage from '@/app/vendor/products/[id]/edit/page'
import { TestProviders } from '../../utils/test-providers'

// Mock Next.js navigation
const mockPush = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: mockReplace,
  })),
  useParams: vi.fn(() => ({ id: '1' })),
  usePathname: vi.fn(() => '/vendor/products/1/edit'),
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    register: vi.fn(),
    handleSubmit: vi.fn((fn) => (e) => {
      e.preventDefault()
      fn({
        name: 'Updated Product',
        description: 'Updated Description',
        price: '39.99',
        category: 'trading-cards',
        condition: 'near-mint',
        status: 'active',
      })
    }),
    formState: { errors: {}, isValid: true },
    setValue: vi.fn(),
    watch: vi.fn(),
    reset: vi.fn(),
  })),
}))

// Mock @hookform/resolvers/zod
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn(() => () => ({})),
}))

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Charizard Base Set Holo',
  description: 'Near mint condition Charizard from Base Set 1999',
  price: 299.99,
  originalPrice: 349.99,
  images: ['/api/placeholder/300/300'],
  category: 'Trading Cards',
  categorySlug: 'trading-cards',
  status: 'active',
  stock: 1,
  sku: 'CHAR-001',
  condition: 'Near Mint',
  vendor: 'Current Vendor',
}

describe('VendorProductEditPage', () => {
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
    vi.mocked(useParams).mockReturnValue({ id: '1' })
  })

  it('renders product edit form', () => {
    render(
      <TestProviders>
        <VendorProductEditPage />
      </TestProviders>
    )

    expect(screen.getByText('Edit Product')).toBeInTheDocument()
    expect(screen.getByText(/update your product listing/i)).toBeInTheDocument()
  })

  it('displays breadcrumbs correctly', () => {
    render(
      <TestProviders>
        <VendorProductEditPage />
      </TestProviders>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Edit Product')).toBeInTheDocument()
  })

  it('loads existing product data', async () => {
    render(
      <TestProviders>
        <VendorProductEditPage />
      </TestProviders>
    )

    // Should show loading state initially
    await waitFor(() => {
      expect(screen.getByText(/loading product/i) || screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  it('displays form sections', () => {
    render(
      <TestProviders>
        <VendorProductEditPage />
      </TestProviders>
    )

    // Basic Information section
    expect(screen.getByText('Basic Information')).toBeInTheDocument()
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()

    // Pricing section
    expect(screen.getByText('Pricing & Inventory')).toBeInTheDocument()
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument()

    // Status section
    expect(screen.getByText(/status|publication/i)).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    const { toast } = await import('sonner')

    render(
      <TestProviders>
        <VendorProductEditPage />
      </TestProviders>
    )

    // Fill form fields
    const nameInput = screen.getByLabelText(/product name/i)
    const priceInput = screen.getByLabelText(/price/i)

    fireEvent.change(nameInput, { target: { value: 'Updated Product' } })
    fireEvent.change(priceInput, { target: { value: '39.99' } })

    // Submit form
    const saveButton = screen.getByRole('button', { name: /save changes|update product/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Product updated successfully')
    })
  })

  it('handles status updates', async () => {
    render(
      <TestProviders>
        <VendorProductEditPage />
      </TestProviders>
    )

    // Should have status controls
    expect(screen.getByText(/active|draft|inactive/i)).toBeInTheDocument()
  })

  it('shows delete product option', () => {
    render(
      <TestProviders>
        <VendorProductEditPage />
      </TestProviders>
    )

    const deleteButton = screen.getByRole('button', { name: /delete product/i })
    expect(deleteButton).toBeInTheDocument()
  })

  it('handles product deletion', async () => {
    const { toast } = await import('sonner')

    render(
      <TestProviders>
        <VendorProductEditPage />
      </TestProviders>
    )

    const deleteButton = screen.getByRole('button', { name: /delete product/i })
    fireEvent.click(deleteButton)

    // Should show confirmation dialog
    await waitFor(() => {
      expect(screen.getByText(/are you sure|confirm delete/i)).toBeInTheDocument()
    })

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /delete|confirm/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Product deleted successfully')
      expect(mockPush).toHaveBeenCalledWith('/vendor/products')
    })
  })

  it('handles cancel action', () => {
    render(
      <TestProviders>
        <VendorProductEditPage />
      </TestProviders>
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockPush).toHaveBeenCalledWith('/vendor/products')
  })

  it('shows product preview', () => {
    render(
      <TestProviders>
        <VendorProductEditPage />
      </TestProviders>
    )

    const previewButton = screen.getByRole('button', { name: /preview/i })
    expect(previewButton).toBeInTheDocument()
  })

  describe('Image Management', () => {
    it('displays existing product images', () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      expect(screen.getByText('Product Images')).toBeInTheDocument()
      expect(screen.getByText(/current images|existing images/i)).toBeInTheDocument()
    })

    it('allows adding new images', () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      expect(screen.getByText(/add more images|upload additional/i)).toBeInTheDocument()
    })

    it('allows removing images', () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      // Should have remove buttons for images
      const removeButtons = screen.getAllByRole('button', { name: /remove|delete.*image/i })
      expect(removeButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Form Validation', () => {
    it('validates required fields', async () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      const nameInput = screen.getByLabelText(/product name/i)

      // Clear required field
      fireEvent.change(nameInput, { target: { value: '' } })
      fireEvent.blur(nameInput)

      const saveButton = screen.getByRole('button', { name: /save changes|update product/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/product name is required/i)).toBeInTheDocument()
      })
    })

    it('validates price format', async () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      const priceInput = screen.getByLabelText(/price/i)

      // Invalid price
      fireEvent.change(priceInput, { target: { value: '-10' } })
      fireEvent.blur(priceInput)

      await waitFor(() => {
        expect(screen.getByText(/price must be greater than 0/i)).toBeInTheDocument()
      })
    })

    it('validates stock quantity', async () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      const stockInput = screen.getByLabelText(/stock|quantity/i)

      // Invalid stock
      fireEvent.change(stockInput, { target: { value: '-1' } })
      fireEvent.blur(stockInput)

      await waitFor(() => {
        expect(screen.getByText(/stock cannot be negative/i)).toBeInTheDocument()
      })
    })
  })

  describe('Product Status Management', () => {
    it('shows current product status', () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      expect(screen.getByText(/current status|product status/i)).toBeInTheDocument()
    })

    it('allows status changes', () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      // Should have status options
      expect(screen.getByText(/active|published/i)).toBeInTheDocument()
      expect(screen.getByText(/draft/i)).toBeInTheDocument()
    })

    it('handles publishing draft products', async () => {
      const { toast } = await import('sonner')

      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      // If product is draft, should have publish option
      const publishButton = screen.getByRole('button', { name: /publish|make active/i })
      fireEvent.click(publishButton)

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(/published|activated/i)
      })
    })

    it('handles deactivating products', async () => {
      const { toast } = await import('sonner')

      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      const deactivateButton = screen.getByRole('button', { name: /deactivate|unpublish/i })
      fireEvent.click(deactivateButton)

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(/deactivated|unpublished/i)
      })
    })
  })

  describe('Error Handling', () => {
    it('handles product not found', async () => {
      vi.mocked(useParams).mockReturnValue({ id: 'non-existent' })

      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      await waitFor(() => {
        expect(screen.getByText(/product not found|not found/i)).toBeInTheDocument()
      })
    })

    it('handles save errors', async () => {
      const { toast } = await import('sonner')

      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      // Mock network error
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      const saveButton = screen.getByRole('button', { name: /save changes|update product/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(/failed to update|error saving/i)
      })
    })

    it('handles unauthorized access', () => {
      vi.mocked(useUser).mockReturnValue({
        user: {
          id: 'user-123',
          publicMetadata: { role: 'collector' },
        } as any,
        isLoaded: true,
        isSignedIn: true,
      })

      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      // Should not show edit form to non-vendors
      expect(screen.queryByText('Edit Product')).not.toBeInTheDocument()
    })
  })

  describe('Inventory Management', () => {
    it('shows current stock level', () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      expect(screen.getByLabelText(/stock|inventory|quantity/i)).toBeInTheDocument()
    })

    it('shows SKU field', () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      expect(screen.getByLabelText(/sku/i)).toBeInTheDocument()
    })

    it('handles stock updates', async () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      const stockInput = screen.getByLabelText(/stock|quantity/i)
      fireEvent.change(stockInput, { target: { value: '5' } })

      expect(stockInput).toHaveValue('5')
    })
  })

  describe('Protected Route', () => {
    it('is wrapped with protected route', () => {
      const { container } = render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      expect(container.firstChild).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      expect(screen.getByLabelText(/product name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
    })

    it('has proper heading structure', () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      expect(screen.getByRole('heading', { name: /edit product/i })).toBeInTheDocument()
    })

    it('has proper button labels', () => {
      render(
        <TestProviders>
          <VendorProductEditPage />
        </TestProviders>
      )

      expect(screen.getByRole('button', { name: /save changes|update product/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })
  })
})