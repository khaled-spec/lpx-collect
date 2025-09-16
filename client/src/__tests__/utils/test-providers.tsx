import { ReactNode, FC, ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { CheckoutProvider } from '@/context/CheckoutContext'

// Mock Clerk user data for testing
export const mockClerkUser = {
  id: 'test-user-1',
  firstName: 'Test',
  lastName: 'User',
  fullName: 'Test User',
  primaryEmailAddress: {
    emailAddress: 'test@example.com',
  },
  emailAddresses: [
    {
      emailAddress: 'test@example.com',
    }
  ],
  imageUrl: '/test-avatar.jpg',
  publicMetadata: {
    role: 'collector',
    accountType: 'collector',
    orderCount: 0,
  },
  createdAt: new Date('2024-01-01'),
}

// Mock Clerk useUser hook values
export const mockClerkAuth = {
  isLoaded: true,
  isSignedIn: true,
  user: mockClerkUser,
}

// Mock guest/unauthenticated state
export const mockGuestAuth = {
  isLoaded: true,
  isSignedIn: false,
  user: null,
}

// Mock loading state
export const mockLoadingAuth = {
  isLoaded: false,
  isSignedIn: false,
  user: null,
}

// Mock vendor user
export const mockVendorUser = {
  ...mockClerkUser,
  id: 'vendor-user-1',
  publicMetadata: {
    role: 'vendor',
    accountType: 'vendor',
    orderCount: 15,
  },
}

// Mock admin user
export const mockAdminUser = {
  ...mockClerkUser,
  id: 'admin-user-1',
  publicMetadata: {
    role: 'admin',
    accountType: 'admin',
    orderCount: 0,
  },
}

// Helper to create auth state
export const createMockAuthState = (overrides = {}) => ({
  isLoaded: true,
  isSignedIn: true,
  user: mockClerkUser,
  ...overrides,
})

// Mock cart context values
export const mockCartContext = {
  items: [],
  itemCount: 0,
  total: 0,
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
  isLoading: false,
}

// Mock wishlist context values
export const mockWishlistContext = {
  items: [],
  wishlistCount: 0,
  addToWishlist: vi.fn(),
  removeFromWishlist: vi.fn(),
  isInWishlist: vi.fn().mockReturnValue(false),
  clearWishlist: vi.fn(),
  isLoading: false,
}

// Mock notification context values
export const mockNotificationContext = {
  notifications: [],
  unreadCount: 0,
  addNotification: vi.fn(),
  markAsRead: vi.fn(),
  markAllAsRead: vi.fn(),
  deleteNotification: vi.fn(),
  clearAllNotifications: vi.fn(),
  getNotificationsByType: vi.fn().mockReturnValue([]),
}

// Mock Clerk components and hooks
const MockClerkProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <div data-testid="clerk-provider">{children}</div>
}

// Mock Clerk globally for all tests unless overridden
vi.mock('@clerk/nextjs', () => ({
  useUser: () => mockClerkAuth,
  useClerk: () => ({
    signOut: vi.fn(),
  }),
  SignInButton: ({ children }: { children: ReactNode }) => (
    <button data-testid="sign-in-button">{children}</button>
  ),
  ClerkProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="clerk-provider">{children}</div>
  ),
}))

// All providers wrapper for complete testing environment
const AllTheProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <MockClerkProvider>
      <CartProvider>
        <WishlistProvider>
          <NotificationProvider>
            <CheckoutProvider>
              {children}
            </CheckoutProvider>
          </NotificationProvider>
        </WishlistProvider>
      </CartProvider>
    </MockClerkProvider>
  )
}

// Custom render function with all providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from testing-library/react
export * from '@testing-library/react'

// Override the default render with our custom one
export { customRender as render }

// Export the providers wrapper for direct use
export { AllTheProviders as TestProviders }

// Helper to render with specific Clerk auth values
export const renderWithMockAuth = (
  ui: ReactElement,
  clerkValues = mockClerkAuth,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  // Mock Clerk's useUser hook
  vi.doMock('@clerk/nextjs', () => ({
    useUser: () => clerkValues,
    useClerk: () => ({
      signOut: vi.fn(),
    }),
    SignInButton: ({ children }: { children: ReactNode }) => (
      <button data-testid="sign-in-button">{children}</button>
    ),
    ClerkProvider: MockClerkProvider,
  }))

  return customRender(ui, options)
}

// Helper to render with guest user (not authenticated)
export const renderWithGuestUser = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return renderWithMockAuth(ui, mockGuestAuth, options)
}

// Helper to render with admin user
export const renderWithAdminUser = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const adminUser = {
    ...mockClerkUser,
    publicMetadata: {
      ...mockClerkUser.publicMetadata,
      role: 'admin',
    },
  }
  const adminAuth = {
    ...mockClerkAuth,
    user: adminUser,
  }
  return renderWithMockAuth(ui, adminAuth, options)
}

// Helper to render with vendor user
export const renderWithVendorUser = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const vendorUser = {
    ...mockClerkUser,
    publicMetadata: {
      ...mockClerkUser.publicMetadata,
      role: 'vendor',
    },
  }
  const vendorAuth = {
    ...mockClerkAuth,
    user: vendorUser,
  }
  return renderWithMockAuth(ui, vendorAuth, options)
}

// Helper to render with cart items
export const renderWithCartItems = (
  ui: ReactElement,
  cartItems: any[] = [],
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const cartValues = {
    ...mockCartContext,
    items: cartItems,
    itemCount: cartItems.length,
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }

  vi.doMock('@/context/CartContext', () => ({
    useCart: () => cartValues,
    CartProvider: ({ children }: { children: ReactNode }) => children,
  }))

  return customRender(ui, options)
}

// Mock product data for testing
export const mockProducts = [
  {
    id: 'product-1',
    name: 'Test Trading Card',
    description: 'A test trading card for unit tests',
    price: 29.99,
    originalPrice: 39.99,
    image: '/test-image.jpg',
    images: ['/test-image.jpg'],
    category: 'Trading Cards',
    categorySlug: 'trading-cards',
    vendor: 'Test Vendor',
    condition: 'Near Mint',
    rating: 4.5,
    reviewCount: 10,
    stock: 5,
    isNew: true,
    isFeatured: false,
  },
  {
    id: 'product-2',
    name: 'Test Comic Book',
    description: 'A test comic book for unit tests',
    price: 49.99,
    image: '/test-comic.jpg',
    images: ['/test-comic.jpg'],
    category: 'Comics',
    categorySlug: 'comics',
    vendor: 'Comic Store',
    condition: 'Very Good',
    rating: 4.8,
    reviewCount: 25,
    stock: 2,
    isNew: false,
    isFeatured: true,
  },
]

// Mock order data
export const mockOrder = {
  id: 'order-1',
  orderNumber: 'ORD-2024-001',
  status: 'delivered' as const,
  items: [
    {
      id: 'item-1',
      productId: 'product-1',
      name: 'Test Trading Card',
      price: 29.99,
      quantity: 1,
      image: '/test-image.jpg',
    },
  ],
  subtotal: 29.99,
  shipping: 5.99,
  tax: 2.70,
  total: 38.68,
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Test St',
    city: 'Test City',
    state: 'TC',
    postalCode: '12345',
    country: 'USA',
  },
  paymentMethod: 'card' as const,
  createdAt: new Date('2024-01-15'),
  estimatedDelivery: '3-5 business days',
}

// Clean up mocks after each test
export const cleanupMocks = () => {
  vi.clearAllMocks()
  vi.resetAllMocks()
}

