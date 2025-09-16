import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUser } from '@clerk/nextjs'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import {
  mockClerkAuth,
  mockGuestAuth,
  mockLoadingAuth,
  mockVendorUser,
  mockAdminUser,
  createMockAuthState
} from '../utils/test-providers'

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn()
}))

// Mock useUser at the top level
vi.mock('@clerk/nextjs', async () => {
  const actual = await vi.importActual('@clerk/nextjs')
  return {
    ...actual,
    useUser: vi.fn(),
  }
})

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state when auth is not loaded', () => {
    vi.mocked(useUser).mockReturnValue(mockLoadingAuth)

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders children when user is authenticated', () => {
    vi.mocked(useUser).mockReturnValue(mockClerkAuth)

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects unauthenticated users to sign-in', async () => {
    const mockPush = vi.fn()
    const { useRouter, usePathname } = await import('next/navigation')
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      pathname: '/current-path'
    })
    vi.mocked(usePathname).mockReturnValue('/current-path')
    vi.mocked(useUser).mockReturnValue(mockGuestAuth)

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        `/sign-in?redirect_url=${encodeURIComponent('/current-path')}`
      )
    })

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('uses custom redirect path when specified', async () => {
    const mockPush = vi.fn()
    const { useRouter, usePathname } = await import('next/navigation')
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      pathname: '/current-path'
    })
    vi.mocked(usePathname).mockReturnValue('/current-path')
    vi.mocked(useUser).mockReturnValue(mockGuestAuth)

    render(
      <ProtectedRoute redirectTo="/custom-login">
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        `/custom-login?redirect_url=${encodeURIComponent('/current-path')}`
      )
    })
  })

  describe('Role-based access control', () => {
    it('allows access when user has required role', () => {
      vi.mocked(useUser).mockReturnValue(
        createMockAuthState({ user: mockVendorUser })
      )

      render(
        <ProtectedRoute requiredRole="vendor">
          <div>Vendor Content</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Vendor Content')).toBeInTheDocument()
    })

    it('redirects to unauthorized when user lacks required role', async () => {
      const mockPush = vi.fn()
      const { useRouter } = await import('next/navigation')
      vi.mocked(useRouter).mockReturnValue({
        push: mockPush,
        pathname: '/current-path'
      })
      vi.mocked(useUser).mockReturnValue(mockClerkAuth) // collector role

      render(
        <ProtectedRoute requiredRole="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/unauthorized')
      })

      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
    })

    it('works with admin role', () => {
      vi.mocked(useUser).mockReturnValue(
        createMockAuthState({ user: mockAdminUser })
      )

      render(
        <ProtectedRoute requiredRole="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Admin Content')).toBeInTheDocument()
    })

    it('redirects when user has no role metadata', async () => {
      const mockPush = vi.fn()
      const { useRouter } = await import('next/navigation')
      vi.mocked(useRouter).mockReturnValue({
        push: mockPush,
        pathname: '/current-path'
      })
      const userWithoutRole = {
        ...mockClerkAuth,
        user: {
          ...mockClerkAuth.user,
          publicMetadata: {}
        }
      }
      vi.mocked(useUser).mockReturnValue(userWithoutRole)

      render(
        <ProtectedRoute requiredRole="collector">
          <div>Collector Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/unauthorized')
      })
    })
  })

  describe('Edge cases', () => {
    it('handles null user gracefully', async () => {
      const mockPush = vi.fn()
      const { useRouter } = await import('next/navigation')
      vi.mocked(useRouter).mockReturnValue({
        push: mockPush,
        pathname: '/current-path'
      })
      const nullUserState = {
        isLoaded: true,
        isSignedIn: false,
        user: null
      }
      vi.mocked(useUser).mockReturnValue(nullUserState)

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled()
      })
    })

    it('preserves current path in redirect URL', async () => {
      const complexPath = '/dashboard/settings?tab=profile'
      const mockPush = vi.fn()
      const { useRouter, usePathname } = await import('next/navigation')
      vi.mocked(useRouter).mockReturnValue({
        push: mockPush,
        pathname: complexPath
      })
      vi.mocked(usePathname).mockReturnValue(complexPath)
      vi.mocked(useUser).mockReturnValue(mockGuestAuth)

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          `/sign-in?redirect_url=${encodeURIComponent(complexPath)}`
        )
      })
    })
  })
})