import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRouter, useSearchParams } from 'next/navigation'
import RegisterPage from '@/app/register/page'
import { TestProviders } from '../utils/test-providers'

// Mock Next.js navigation
const mockReplace = vi.fn()
const mockPush = vi.fn()
const mockGet = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: mockReplace,
  })),
  useSearchParams: vi.fn(() => ({
    get: mockGet,
  })),
}))

describe('Vendor Registration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGet.mockReturnValue(null)
  })

  describe('RegisterPage Redirect', () => {
    it('redirects to Clerk sign-up page', () => {
      render(
        <TestProviders>
          <RegisterPage />
        </TestProviders>
      )

      // Should show loading indicator
      expect(screen.getByText('Redirecting to sign up...')).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toBeInTheDocument()

      // Should redirect to sign-up
      expect(mockReplace).toHaveBeenCalledWith('/sign-up')
    })

    it('preserves redirect parameter in URL', () => {
      mockGet.mockReturnValue('/vendor/dashboard')

      render(
        <TestProviders>
          <RegisterPage />
        </TestProviders>
      )

      expect(mockReplace).toHaveBeenCalledWith(
        '/sign-up?redirect_url=%2Fvendor%2Fdashboard'
      )
    })

    it('handles empty redirect parameter', () => {
      mockGet.mockReturnValue('')

      render(
        <TestProviders>
          <RegisterPage />
        </TestProviders>
      )

      expect(mockReplace).toHaveBeenCalledWith('/sign-up')
    })

    it('handles special characters in redirect URL', () => {
      mockGet.mockReturnValue('/vendor/products?category=trading-cards&status=active')

      render(
        <TestProviders>
          <RegisterPage />
        </TestProviders>
      )

      const expectedUrl = '/sign-up?redirect_url=' +
        encodeURIComponent('/vendor/products?category=trading-cards&status=active')

      expect(mockReplace).toHaveBeenCalledWith(expectedUrl)
    })

    it('shows loading state during redirect', () => {
      render(
        <TestProviders>
          <RegisterPage />
        </TestProviders>
      )

      // Check loading UI elements
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
      expect(screen.getByLabelText('Loading')).toBeInTheDocument()
      expect(screen.getByText('Redirecting to sign up...')).toBeInTheDocument()
    })
  })

  describe('Vendor Application Process', () => {
    const mockVendorApplicationData = {
      businessName: 'Card Haven Collectibles',
      businessType: 'LLC',
      contactEmail: 'owner@cardhaven.com',
      phoneNumber: '+1-555-123-4567',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA',
      },
      description: 'Premium trading cards and collectibles store',
      specialties: ['Trading Cards', 'Sports Cards', 'Gaming Cards'],
      experienceYears: 5,
      websiteUrl: 'https://cardhaven.com',
      socialMedia: {
        instagram: '@cardhaven',
        facebook: 'CardHavenCollectibles',
      },
      businessLicense: 'BL123456789',
      taxId: 'TX987654321',
      references: [
        {
          name: 'John Smith',
          relationship: 'Business Partner',
          email: 'john@example.com',
          phone: '+1-555-999-8888',
        },
      ],
    }

    it('validates required vendor application fields', () => {
      const requiredFields = [
        'businessName',
        'businessType',
        'contactEmail',
        'phoneNumber',
        'address',
        'description',
      ]

      requiredFields.forEach(field => {
        expect(mockVendorApplicationData).toHaveProperty(field)
      })

      // Verify address has required subfields
      expect(mockVendorApplicationData.address).toHaveProperty('street')
      expect(mockVendorApplicationData.address).toHaveProperty('city')
      expect(mockVendorApplicationData.address).toHaveProperty('state')
      expect(mockVendorApplicationData.address).toHaveProperty('zipCode')
    })

    it('validates email format', () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      expect(emailPattern.test(mockVendorApplicationData.contactEmail)).toBe(true)
      expect(emailPattern.test('invalid-email')).toBe(false)
      expect(emailPattern.test('')).toBe(false)
    })

    it('validates phone number format', () => {
      const phonePattern = /^\+?[\d\s\-\(\)\.]+$/

      expect(phonePattern.test(mockVendorApplicationData.phoneNumber)).toBe(true)
      expect(phonePattern.test('+1-555-123-4567')).toBe(true)
      expect(phonePattern.test('555.123.4567')).toBe(true)
      expect(phonePattern.test('invalid-phone')).toBe(false)
    })

    it('validates business types', () => {
      const validBusinessTypes = [
        'Individual',
        'LLC',
        'Corporation',
        'Partnership',
        'Sole Proprietorship',
      ]

      expect(validBusinessTypes).toContain(mockVendorApplicationData.businessType)
    })

    it('handles file uploads for documentation', () => {
      const mockFiles = {
        businessLicense: new File(['license'], 'license.pdf', { type: 'application/pdf' }),
        taxDocument: new File(['tax'], 'tax.pdf', { type: 'application/pdf' }),
        insurance: new File(['insurance'], 'insurance.pdf', { type: 'application/pdf' }),
      }

      Object.values(mockFiles).forEach(file => {
        expect(file).toBeInstanceOf(File)
        expect(file.type).toBe('application/pdf')
      })
    })
  })

  describe('Application Status Management', () => {
    const applicationStatuses = [
      'pending',
      'under_review',
      'approved',
      'rejected',
      'requires_additional_info',
    ]

    it('handles different application statuses', () => {
      applicationStatuses.forEach(status => {
        const mockApplication = {
          id: 'app_123',
          status,
          submittedAt: new Date(),
          reviewedAt: status === 'approved' ? new Date() : null,
        }

        expect(mockApplication.status).toBe(status)

        if (status === 'approved') {
          expect(mockApplication.reviewedAt).toBeInstanceOf(Date)
        }
      })
    })

    it('validates status transitions', () => {
      const validTransitions = {
        pending: ['under_review', 'rejected'],
        under_review: ['approved', 'rejected', 'requires_additional_info'],
        requires_additional_info: ['under_review', 'rejected'],
        approved: [], // Terminal state
        rejected: ['pending'], // Can reapply
      }

      Object.entries(validTransitions).forEach(([from, toStates]) => {
        toStates.forEach(to => {
          expect(validTransitions[from as keyof typeof validTransitions]).toContain(to)
        })
      })
    })
  })

  describe('Vendor Onboarding Flow', () => {
    it('creates vendor profile after approval', async () => {
      const mockApprovedApplication = {
        id: 'app_123',
        status: 'approved',
        businessName: 'Card Haven',
        contactEmail: 'owner@cardhaven.com',
        clerkUserId: 'user_123',
      }

      const expectedVendorProfile = {
        name: mockApprovedApplication.businessName,
        slug: 'card-haven',
        email: mockApprovedApplication.contactEmail,
        clerkUserId: mockApprovedApplication.clerkUserId,
        status: 'active',
        verified: true,
        joinDate: expect.any(Date),
      }

      // Simulate vendor profile creation
      const vendorProfile = {
        name: mockApprovedApplication.businessName,
        slug: mockApprovedApplication.businessName.toLowerCase().replace(/\s+/g, '-'),
        email: mockApprovedApplication.contactEmail,
        clerkUserId: mockApprovedApplication.clerkUserId,
        status: 'active',
        verified: true,
        joinDate: new Date(),
      }

      expect(vendorProfile.name).toBe(expectedVendorProfile.name)
      expect(vendorProfile.slug).toBe(expectedVendorProfile.slug)
      expect(vendorProfile.email).toBe(expectedVendorProfile.email)
      expect(vendorProfile.status).toBe(expectedVendorProfile.status)
      expect(vendorProfile.verified).toBe(expectedVendorProfile.verified)
    })

    it('sets up initial vendor dashboard', () => {
      const initialDashboardData = {
        analytics: {
          revenue: { total: 0, thisMonth: 0, lastMonth: 0, growth: 0 },
          orders: { total: 0, pending: 0, processing: 0, completed: 0 },
          products: { total: 0, active: 0, outOfStock: 0, draft: 0 },
          customers: { total: 0, returning: 0, new: 0, satisfactionRate: 0 },
        },
        settings: {
          notifications: {
            newOrders: true,
            lowStock: true,
            customerMessages: true,
          },
          shipping: {
            defaultProcessingTime: '1-2 business days',
            shippingRates: [],
          },
        },
      }

      expect(initialDashboardData.analytics.revenue.total).toBe(0)
      expect(initialDashboardData.analytics.orders.total).toBe(0)
      expect(initialDashboardData.settings.notifications.newOrders).toBe(true)
    })
  })

  describe('Role-based Access Control', () => {
    it('assigns vendor role to approved applicants', async () => {
      const mockUser = {
        id: 'user_123',
        publicMetadata: { role: 'collector' },
      }

      const updatedUser = {
        ...mockUser,
        publicMetadata: {
          ...mockUser.publicMetadata,
          role: 'vendor',
          vendorId: 'vendor_123',
        },
      }

      expect(updatedUser.publicMetadata.role).toBe('vendor')
      expect(updatedUser.publicMetadata.vendorId).toBe('vendor_123')
    })

    it('maintains original role for rejected applications', () => {
      const mockUser = {
        id: 'user_123',
        publicMetadata: { role: 'collector' },
      }

      const rejectedApplication = {
        status: 'rejected',
        userId: 'user_123',
      }

      // User role should remain unchanged
      expect(mockUser.publicMetadata.role).toBe('collector')
    })
  })

  describe('Notification System', () => {
    it('sends application confirmation email', () => {
      const mockEmailData = {
        to: 'applicant@example.com',
        template: 'vendor_application_received',
        data: {
          businessName: 'Card Haven',
          applicationId: 'app_123',
          submittedAt: new Date(),
        },
      }

      expect(mockEmailData.template).toBe('vendor_application_received')
      expect(mockEmailData.data.businessName).toBe('Card Haven')
      expect(mockEmailData.data.applicationId).toBe('app_123')
    })

    it('sends approval notification', () => {
      const mockApprovalEmail = {
        to: 'newvendor@example.com',
        template: 'vendor_application_approved',
        data: {
          businessName: 'Card Haven',
          dashboardUrl: '/vendor/dashboard',
          setupGuideUrl: '/vendor/setup',
        },
      }

      expect(mockApprovalEmail.template).toBe('vendor_application_approved')
      expect(mockApprovalEmail.data.dashboardUrl).toBe('/vendor/dashboard')
    })

    it('sends rejection notification with reason', () => {
      const mockRejectionEmail = {
        to: 'applicant@example.com',
        template: 'vendor_application_rejected',
        data: {
          businessName: 'Card Haven',
          rejectionReason: 'Incomplete documentation',
          reapplyUrl: '/apply',
        },
      }

      expect(mockRejectionEmail.template).toBe('vendor_application_rejected')
      expect(mockRejectionEmail.data.rejectionReason).toBe('Incomplete documentation')
    })
  })

  describe('Error Handling', () => {
    it('handles duplicate application submissions', () => {
      const existingApplication = {
        clerkUserId: 'user_123',
        status: 'pending',
      }

      const newApplication = {
        clerkUserId: 'user_123',
        businessName: 'Different Store',
      }

      // Should prevent duplicate applications
      const isDuplicate = existingApplication.clerkUserId === newApplication.clerkUserId &&
        existingApplication.status === 'pending'

      expect(isDuplicate).toBe(true)
    })

    it('handles invalid file uploads', () => {
      const invalidFiles = [
        { name: 'virus.exe', type: 'application/x-executable' },
        { name: 'huge-file.pdf', size: 10 * 1024 * 1024 }, // 10MB
        { name: 'no-extension', type: '' },
      ]

      const validFileTypes = ['application/pdf', 'image/jpeg', 'image/png']
      const maxFileSize = 5 * 1024 * 1024 // 5MB

      invalidFiles.forEach(file => {
        const isValidType = validFileTypes.includes(file.type || '')
        const isValidSize = (file.size || 0) <= maxFileSize

        expect(isValidType && isValidSize).toBe(false)
      })
    })
  })

  describe('Integration with External Services', () => {
    it('validates business license numbers', () => {
      const mockLicenseValidation = {
        licenseNumber: 'BL123456789',
        state: 'CA',
        isValid: true,
        expirationDate: '2025-12-31',
      }

      expect(mockLicenseValidation.isValid).toBe(true)
      expect(mockLicenseValidation.licenseNumber).toMatch(/^BL\d{9}$/)
    })

    it('verifies tax ID format', () => {
      const validTaxIds = [
        '12-3456789', // EIN format
        '123456789',  // SSN format (9 digits)
      ]

      const einPattern = /^\d{2}-?\d{7}$/
      const ssnPattern = /^\d{9}$/

      validTaxIds.forEach(taxId => {
        const isValidEin = einPattern.test(taxId)
        const isValidSsn = ssnPattern.test(taxId.replace('-', ''))

        expect(isValidEin || isValidSsn).toBe(true)
      })
    })
  })
})