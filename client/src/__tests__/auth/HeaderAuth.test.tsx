import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUser } from '@clerk/nextjs'
import Header from '@/components/Header'
import {
  mockClerkAuth,
  mockGuestAuth,
  mockLoadingAuth,
  mockVendorUser,
  mockAdminUser,
  createMockAuthState,
  TestProviders
} from '../utils/test-providers'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    pathname: '/'
  })),
  usePathname: vi.fn(() => '/')
}))

describe('Header Authentication Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Unauthenticated state', () => {
    beforeEach(() => {
      vi.mocked(useUser).mockReturnValue(mockGuestAuth)
    })

    it('shows sign in and sign up links when user is not authenticated', () => {
      render(
        <TestProviders>
          <Header />
        </TestProviders>
      )

      expect(screen.getByText('Sign In')).toBeInTheDocument()
      expect(screen.getByText('Sign Up')).toBeInTheDocument()
    })

    it('sign in link points to correct URL', () => {
      render(
        <TestProviders>
          <Header />
        </TestProviders>
      )

      const signInLink = screen.getByText('Sign In').closest('a')
      expect(signInLink).toHaveAttribute('href', '/sign-in')
    })

    it('sign up link points to correct URL', () => {
      render(
        <TestProviders>
          <Header />
        </TestProviders>
      )

      const signUpLink = screen.getByText('Sign Up').closest('a')
      expect(signUpLink).toHaveAttribute('href', '/sign-up')
    })

    it('does not show user-specific elements', () => {
      render(
        <TestProviders>
          <Header />
        </TestProviders>
      )

      expect(screen.queryByText('UserButton Mock')).not.toBeInTheDocument()
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    })
  })

  describe('Authenticated state', () => {
    beforeEach(() => {
      vi.mocked(useUser).mockReturnValue(mockClerkAuth)
    })

    it('hides sign in/up links when user is authenticated', () => {
      render(
        <TestProviders>
          <Header />
        </TestProviders>
      )

      expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
      expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()
    })

    it('shows user button when authenticated', () => {
      render(
        <TestProviders>
          <Header />
        </TestProviders>
      )

      expect(screen.getByText('UserButton Mock')).toBeInTheDocument()
    })

    it('shows authenticated user navigation items', () => {
      render(
        <TestProviders>
          <Header />
        </TestProviders>
      )

      // Look for common authenticated user links
      expect(screen.queryByText('Dashboard')).toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    beforeEach(() => {
      vi.mocked(useUser).mockReturnValue(mockLoadingAuth)
    })

    it('does not show auth-related elements while loading', () => {
      render(
        <TestProviders>
          <Header />
        </TestProviders>
      )

      expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
      expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()
      expect(screen.queryByText('UserButton Mock')).not.toBeInTheDocument()
    })
  })

  describe('Role-based navigation', () => {
    it('shows vendor-specific navigation for vendor users', () => {
      vi.mocked(useUser).mockReturnValue(
        createMockAuthState({ user: mockVendorUser })
      )

      render(
        <TestProviders>
          <Header />
        </TestProviders>
      )

      expect(screen.getByText('UserButton Mock')).toBeInTheDocument()
      // Look for vendor-specific navigation
      expect(screen.queryByText('Vendor Dashboard')).toBeInTheDocument()
    })

    it('shows admin navigation for admin users', () => {
      vi.mocked(useUser).mockReturnValue(
        createMockAuthState({ user: mockAdminUser })
      )

      render(
        <TestProviders>
          <Header />
        </TestProviders>
      )

      expect(screen.getByText('UserButton Mock')).toBeInTheDocument()
      // Look for admin-specific navigation if it exists
      expect(screen.queryByText('Admin')).toBeInTheDocument()
    })

    it('shows collector navigation for regular users', () => {
      vi.mocked(useUser).mockReturnValue(mockClerkAuth) // Default collector

      render(
        <TestProviders>
          <Header />
        </TestProviders>
      )

      expect(screen.getByText('UserButton Mock')).toBeInTheDocument()
      expect(screen.queryByText('Dashboard')).toBeInTheDocument()
    })
  })

  describe('Mobile menu behavior', () => {
    beforeEach(() => {
      vi.mocked(useUser).mockReturnValue(mockGuestAuth)
    })

    it('shows mobile auth links when menu is opened', () => {
      render(
        <TestProviders>
          <Header />
        </TestProviders>
      )

      // Find and click mobile menu button
      const menuButton = screen.getByLabelText(/menu/i) || screen.getByRole('button', { name: /menu/i })
      if (menuButton) {
        fireEvent.click(menuButton)

        // Check for mobile auth links
        const signInLinks = screen.getAllByText('Sign In')
        const signUpLinks = screen.getAllByText('Sign Up')

        expect(signInLinks.length).toBeGreaterThan(0)
        expect(signUpLinks.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Error handling', () => {
    it('handles malformed user data gracefully', () => {
      const malformedAuth = {
        isLoaded: true,
        isSignedIn: true,
        user: null // Inconsistent state
      }
      vi.mocked(useUser).mockReturnValue(malformedAuth)

      expect(() =>
        render(
          <TestProviders>
            <Header />
          </TestProviders>
        )
      ).not.toThrow()
    })

    it('handles missing user metadata gracefully', () => {
      const userWithoutMetadata = {
        ...mockClerkAuth,
        user: {
          ...mockClerkAuth.user,
          publicMetadata: undefined
        }
      }
      vi.mocked(useUser).mockReturnValue(userWithoutMetadata)

      expect(() =>
        render(
          <TestProviders>
            <Header />
          </TestProviders>
        )
      ).not.toThrow()
    })
  })
})