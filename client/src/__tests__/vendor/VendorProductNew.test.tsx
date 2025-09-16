import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import VendorProductNewPage from '@/app/vendor/products/new/page'
import { TestProviders } from '../utils/test-providers'

// Mock Next.js navigation
const mockPush = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: mockReplace,
  })),
  usePathname: vi.fn(() => '/vendor/products/new'),
}))

// Mock categories API
vi.mock('@/lib/categories', () => ({
  getNavigationCategories: vi.fn().mockResolvedValue([
    { name: 'Trading Cards', slug: 'trading-cards' },
    { name: 'Comics', slug: 'comics' },
  ]),
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
        name: 'Test Product',
        description: 'Test Description',
        price: '29.99',
        category: 'trading-cards',
        condition: 'near-mint',
        status: 'draft',
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

describe('VendorProductNewPage', () => {
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

  it('renders product creation form', async () => {
    await act(async () => {
      render(
        <TestProviders>
          <VendorProductNewPage />
        </TestProviders>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Add New Product')).toBeInTheDocument()
      expect(screen.getByText('Create a new product listing for your store')).toBeInTheDocument()
    })
  })

  it('displays form sections', () => {
    render(
      <TestProviders>
        <VendorProductNewPage />
      </TestProviders>
    )

    // Basic Information section
    expect(screen.getByText('Basic Information')).toBeInTheDocument()
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()

    // Pricing section
    expect(screen.getByText('Pricing & Inventory')).toBeInTheDocument()
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument()

    // Category & Condition section
    expect(screen.getByText('Category & Condition')).toBeInTheDocument()
    expect(screen.getByText(/category/i)).toBeInTheDocument()
    expect(screen.getByText(/condition/i)).toBeInTheDocument()
  })

  it('shows form validation for required fields', async () => {
    render(
      <TestProviders>
        <VendorProductNewPage />
      </TestProviders>
    )

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /save as draft/i })
    fireEvent.click(submitButton)

    // Form validation should prevent submission
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('handles form submission for draft', async () => {
    const { toast } = await import('sonner')

    render(
      <TestProviders>
        <VendorProductNewPage />
      </TestProviders>
    )

    // Fill required fields
    const nameInput = screen.getByLabelText(/product name/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const priceInput = screen.getByLabelText(/price/i)

    fireEvent.change(nameInput, { target: { value: 'Test Product' } })
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } })
    fireEvent.change(priceInput, { target: { value: '29.99' } })

    // Submit as draft
    const draftButton = screen.getByRole('button', { name: /save as draft/i })
    fireEvent.click(draftButton)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Product saved as draft')
    })
  })

  it('handles form submission for publish', async () => {
    const { toast } = await import('sonner')

    render(
      <TestProviders>
        <VendorProductNewPage />
      </TestProviders>
    )

    // Fill required fields
    const nameInput = screen.getByLabelText(/product name/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const priceInput = screen.getByLabelText(/price/i)

    fireEvent.change(nameInput, { target: { value: 'Test Product' } })
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } })
    fireEvent.change(priceInput, { target: { value: '29.99' } })

    // Submit and publish
    const publishButton = screen.getByRole('button', { name: /publish product/i })
    fireEvent.click(publishButton)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Product published successfully')
    })
  })

  it('shows image upload section', () => {
    render(
      <TestProviders>
        <VendorProductNewPage />
      </TestProviders>
    )

    expect(screen.getByText('Product Images')).toBeInTheDocument()
    expect(screen.getByText(/upload up to 5 images/i)).toBeInTheDocument()
  })

  it('displays category options', () => {
    render(
      <TestProviders>
        <VendorProductNewPage />
      </TestProviders>
    )

    // Category select should be present
    const categorySection = screen.getByText('Category & Condition')
    expect(categorySection).toBeInTheDocument()

    // Common categories should be available
    expect(screen.getByText(/trading cards|comics|toys|collectibles/i)).toBeInTheDocument()
  })

  it('displays condition options', () => {
    render(
      <TestProviders>
        <VendorProductNewPage />
      </TestProviders>
    )

    // Condition options should be available
    expect(screen.getByText(/mint|near mint|excellent|good|fair/i)).toBeInTheDocument()
  })

  it('shows pricing validation', async () => {
    render(
      <TestProviders>
        <VendorProductNewPage />
      </TestProviders>
    )

    const priceInput = screen.getByLabelText(/price/i)

    // Test invalid price
    fireEvent.change(priceInput, { target: { value: '-5' } })
    fireEvent.blur(priceInput)

    // Should show validation error (price must be positive)
    await waitFor(() => {
      expect(screen.getByText(/price must be greater than 0/i) || screen.getByText(/invalid price/i)).toBeInTheDocument()
    })
  })

  it('handles inventory settings', () => {
    render(
      <TestProviders>
        <VendorProductNewPage />
      </TestProviders>
    )

    // Stock quantity input should be available
    expect(screen.getByLabelText(/stock quantity|inventory/i)).toBeInTheDocument()

    // SKU field should be available
    expect(screen.getByLabelText(/sku/i)).toBeInTheDocument()
  })

  it('displays breadcrumbs correctly', () => {
    render(
      <TestProviders>
        <VendorProductNewPage />
      </TestProviders>
    )

    // Should have breadcrumbs navigation
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Add Product')).toBeInTheDocument()
  })

  it('handles cancel action', () => {
    render(
      <TestProviders>
        <VendorProductNewPage />
      </TestProviders>
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockPush).toHaveBeenCalledWith('/vendor/products')
  })

  it('shows preview functionality', async () => {
    render(
      <TestProviders>
        <VendorProductNewPage />
      </TestProviders>
    )

    // Fill basic product info
    const nameInput = screen.getByLabelText(/product name/i)
    fireEvent.change(nameInput, { target: { value: 'Test Product' } })

    // Preview button should be available
    const previewButton = screen.getByRole('button', { name: /preview/i })
    expect(previewButton).toBeInTheDocument()
  })

  describe('Form Validation', () => {
    it('validates product name length', async () => {
      render(
        <TestProviders>
          <VendorProductNewPage />
        </TestProviders>
      )

      const nameInput = screen.getByLabelText(/product name/i)

      // Test name too long
      const longName = 'a'.repeat(101)
      fireEvent.change(nameInput, { target: { value: longName } })
      fireEvent.blur(nameInput)

      await waitFor(() => {
        expect(screen.getByText(/name too long|maximum 100 characters/i)).toBeInTheDocument()
      })
    })

    it('validates description length', async () => {
      render(
        <TestProviders>
          <VendorProductNewPage />
        </TestProviders>
      )

      const descriptionInput = screen.getByLabelText(/description/i)

      // Test description too long
      const longDescription = 'a'.repeat(2001)
      fireEvent.change(descriptionInput, { target: { value: longDescription } })
      fireEvent.blur(descriptionInput)

      await waitFor(() => {
        expect(screen.getByText(/description too long|maximum.*characters/i)).toBeInTheDocument()
      })
    })

    it('validates price format', async () => {
      render(
        <TestProviders>
          <VendorProductNewPage />
        </TestProviders>
      )

      const priceInput = screen.getByLabelText(/price/i)

      // Test invalid price format
      fireEvent.change(priceInput, { target: { value: 'not-a-number' } })
      fireEvent.blur(priceInput)

      await waitFor(() => {
        expect(screen.getByText(/invalid price|must be a number/i)).toBeInTheDocument()
      })
    })
  })

  describe('Image Upload', () => {
    it('handles image upload', () => {
      render(
        <TestProviders>
          <VendorProductNewPage />
        </TestProviders>
      )

      // Image upload area should be present
      expect(screen.getByText(/drag.*drop.*images|click to upload/i)).toBeInTheDocument()
    })

    it('shows image upload limits', () => {
      render(
        <TestProviders>
          <VendorProductNewPage />
        </TestProviders>
      )

      // Should display upload limits
      expect(screen.getByText(/maximum.*5.*images/i)).toBeInTheDocument()
      expect(screen.getByText(/jpg.*png.*webp/i)).toBeInTheDocument()
    })
  })

  describe('Protected Route', () => {
    it('is wrapped with protected route', () => {
      const { container } = render(
        <TestProviders>
          <VendorProductNewPage />
        </TestProviders>
      )

      expect(container.firstChild).toBeTruthy()
    })

    it('redirects non-vendor users', () => {
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
          <VendorProductNewPage />
        </TestProviders>
      )

      // Should not show vendor-only content
      expect(screen.queryByText('Add New Product')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(
        <TestProviders>
          <VendorProductNewPage />
        </TestProviders>
      )

      // All form inputs should have proper labels
      expect(screen.getByLabelText(/product name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
    })

    it('has proper heading structure', () => {
      render(
        <TestProviders>
          <VendorProductNewPage />
        </TestProviders>
      )

      // Should have proper heading hierarchy
      expect(screen.getByRole('heading', { name: /add new product/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /basic information/i })).toBeInTheDocument()
    })
  })
})