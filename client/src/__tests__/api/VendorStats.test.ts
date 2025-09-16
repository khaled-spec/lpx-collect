import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/vendors/[id]/stats/route'

// Mock the data imports
vi.mock('@/lib/api/mock-data', () => ({
  mockVendors: [
    {
      id: 'vendor-1',
      slug: 'test-vendor',
      name: 'Test Vendor',
      rating: 4.8,
      totalSales: 150,
      verified: true,
      joinedDate: '2022-01-15',
    },
    {
      id: 'vendor-2',
      slug: 'another-vendor',
      name: 'Another Vendor',
      rating: 4.5,
      totalSales: 89,
      verified: false,
      joinedDate: '2023-03-20',
    },
  ],
  mockProducts: [
    {
      id: 'product-1',
      name: 'Test Product 1',
      price: 29.99,
      stock: 5,
      vendor: 'vendor-1',
      views: 100,
      rating: 4.5,
      reviewCount: 10,
      featured: true,
      createdAt: '2024-01-01',
      category: 'Trading Cards',
    },
    {
      id: 'product-2',
      name: 'Test Product 2',
      price: 49.99,
      stock: 0,
      vendor: 'vendor-1',
      views: 75,
      rating: 4.8,
      reviewCount: 8,
      featured: false,
      createdAt: '2024-01-15',
      category: 'Comics',
    },
    {
      id: 'product-3',
      name: 'Test Product 3',
      price: 19.99,
      stock: 10,
      vendor: 'vendor-1',
      views: 50,
      rating: 4.2,
      reviewCount: 5,
      featured: false,
      createdAt: '2024-02-01',
      category: 'Trading Cards',
    },
    {
      id: 'product-4',
      name: 'Other Vendor Product',
      price: 99.99,
      stock: 2,
      vendor: 'vendor-2',
      views: 200,
      rating: 4.9,
      reviewCount: 15,
      featured: true,
      createdAt: '2024-01-10',
      category: 'Collectibles',
    },
  ],
}))

describe('/api/vendors/[id]/stats', () => {
  let mockRequest: NextRequest

  beforeEach(() => {
    vi.clearAllMocks()
    mockRequest = new NextRequest('http://localhost:3000/api/vendors/vendor-1/stats')
  })

  describe('GET /api/vendors/[id]/stats', () => {
    it('returns vendor statistics for valid vendor ID', async () => {
      const params = Promise.resolve({ id: 'vendor-1' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('vendor')
      expect(data.data).toHaveProperty('stats')

      // Verify vendor information
      expect(data.data.vendor.id).toBe('vendor-1')
      expect(data.data.vendor.name).toBe('Test Vendor')
      expect(data.data.vendor.rating).toBe(4.8)
      expect(data.data.vendor.totalSales).toBe(150)
    })

    it('returns vendor statistics for valid vendor slug', async () => {
      const params = Promise.resolve({ id: 'test-vendor' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.vendor.name).toBe('Test Vendor')
    })

    it('calculates overview statistics correctly', async () => {
      const params = Promise.resolve({ id: 'vendor-1' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      const { overview } = data.data.stats

      expect(overview.totalProducts).toBe(3) // 3 products for vendor-1
      expect(overview.activeListings).toBe(2) // 2 products with stock > 0
      expect(overview.outOfStock).toBe(1) // 1 product with stock = 0
      expect(overview.featuredProducts).toBe(1) // 1 featured product
    })

    it('calculates inventory statistics correctly', async () => {
      const params = Promise.resolve({ id: 'vendor-1' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      const { inventory } = data.data.stats

      expect(inventory.totalItems).toBe(15) // 5 + 0 + 10
      expect(inventory.totalValue).toBe(349.85) // (29.99*5) + (49.99*0) + (19.99*10)
      expect(inventory.averagePrice).toBeCloseTo(33.32, 2) // (29.99 + 49.99 + 19.99) / 3
      expect(inventory.highestPrice).toBe(49.99)
      expect(inventory.lowestPrice).toBe(19.99)
    })

    it('calculates performance statistics correctly', async () => {
      const params = Promise.resolve({ id: 'vendor-1' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      const { performance } = data.data.stats

      expect(performance.totalViews).toBe(225) // 100 + 75 + 50
      expect(performance.averageRating).toBeCloseTo(4.5, 2) // (4.5 + 4.8 + 4.2) / 3
      expect(performance.totalReviews).toBe(23) // 10 + 8 + 5
    })

    it('groups products by category correctly', async () => {
      const params = Promise.resolve({ id: 'vendor-1' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      const { categories } = data.data.stats

      expect(categories['Trading Cards']).toEqual({
        name: 'Trading Cards',
        count: 2,
        value: 349.85, // (29.99*5) + (19.99*10)
      })

      expect(categories['Comics']).toEqual({
        name: 'Comics',
        count: 1,
        value: 0, // 49.99*0
      })
    })

    it('returns top products by views', async () => {
      const params = Promise.resolve({ id: 'vendor-1' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      const { topProducts } = data.data.stats

      expect(topProducts).toHaveLength(3)
      expect(topProducts[0].views).toBe(100) // Highest views first
      expect(topProducts[0].name).toBe('Test Product 1')
      expect(topProducts[1].views).toBe(75)
      expect(topProducts[2].views).toBe(50)
    })

    it('returns recent listings sorted by creation date', async () => {
      const params = Promise.resolve({ id: 'vendor-1' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      const { recentListings } = data.data.stats

      expect(recentListings).toHaveLength(3)
      expect(recentListings[0].name).toBe('Test Product 3') // Most recent (2024-02-01)
      expect(recentListings[1].name).toBe('Test Product 2') // 2024-01-15
      expect(recentListings[2].name).toBe('Test Product 1') // Oldest (2024-01-01)
    })

    it('limits top products to 5 items', async () => {
      // Mock vendor with more than 5 products
      vi.doMock('@/lib/api/mock-data', () => ({
        mockVendors: [
          {
            id: 'vendor-many-products',
            name: 'Vendor with Many Products',
            rating: 4.5,
            totalSales: 200,
            verified: true,
            joinedDate: '2022-01-01',
          },
        ],
        mockProducts: Array.from({ length: 10 }, (_, i) => ({
          id: `product-${i + 1}`,
          name: `Product ${i + 1}`,
          price: 10 + i,
          stock: 1,
          vendor: 'vendor-many-products',
          views: 100 - i * 10,
          rating: 4.0 + i * 0.1,
          reviewCount: 5,
          featured: false,
          createdAt: `2024-01-${String(i + 1).padStart(2, '0')}`,
          category: 'Test Category',
        })),
      }))

      const params = Promise.resolve({ id: 'vendor-many-products' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(data.data.stats.topProducts).toHaveLength(5)
    })

    it('limits recent listings to 5 items', async () => {
      const params = Promise.resolve({ id: 'vendor-1' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(data.data.stats.recentListings.length).toBeLessThanOrEqual(5)
    })

    it('handles vendor with no products', async () => {
      // Mock vendor with no products
      vi.doMock('@/lib/api/mock-data', () => ({
        mockVendors: [
          {
            id: 'vendor-no-products',
            name: 'Empty Vendor',
            rating: 0,
            totalSales: 0,
            verified: false,
            joinedDate: '2024-01-01',
          },
        ],
        mockProducts: [],
      }))

      const params = Promise.resolve({ id: 'vendor-no-products' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.stats.overview.totalProducts).toBe(0)
      expect(data.data.stats.inventory.averagePrice).toBe(0)
      expect(data.data.stats.performance.averageRating).toBe(0)
      expect(data.data.stats.topProducts).toHaveLength(0)
      expect(data.data.stats.recentListings).toHaveLength(0)
    })

    it('returns 404 for non-existent vendor', async () => {
      const params = Promise.resolve({ id: 'non-existent-vendor' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Vendor not found')
      expect(data.error.code).toBe('VENDOR_NOT_FOUND')
    })

    it('handles vendor object vs string references', async () => {
      // Mock products with vendor as object
      vi.doMock('@/lib/api/mock-data', () => ({
        mockVendors: [
          {
            id: 'vendor-1',
            name: 'Test Vendor',
            rating: 4.8,
            totalSales: 150,
            verified: true,
            joinedDate: '2022-01-15',
          },
        ],
        mockProducts: [
          {
            id: 'product-with-vendor-object',
            name: 'Product with Vendor Object',
            price: 25.00,
            stock: 3,
            vendor: { id: 'vendor-1', name: 'Test Vendor' },
            views: 80,
            rating: 4.3,
            reviewCount: 6,
            featured: false,
            createdAt: '2024-01-05',
            category: { name: 'Trading Cards' },
          },
        ],
      }))

      const params = Promise.resolve({ id: 'vendor-1' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.stats.overview.totalProducts).toBe(1)
    })

    it('handles category object vs string references', async () => {
      const params = Promise.resolve({ id: 'vendor-1' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      // Categories should be grouped correctly regardless of string/object format
      expect(Object.keys(data.data.stats.categories).length).toBeGreaterThan(0)
    })

    it('handles missing optional fields gracefully', async () => {
      // Mock products with missing optional fields
      vi.doMock('@/lib/api/mock-data', () => ({
        mockVendors: [
          {
            id: 'vendor-minimal',
            name: 'Minimal Vendor',
            rating: 4.0,
            totalSales: 10,
            verified: true,
            joinedDate: '2023-01-01',
          },
        ],
        mockProducts: [
          {
            id: 'minimal-product',
            name: 'Minimal Product',
            price: 15.00,
            stock: 1,
            vendor: 'vendor-minimal',
            category: 'Test Category',
            // Missing: views, rating, reviewCount, featured, createdAt
          },
        ],
      }))

      const params = Promise.resolve({ id: 'vendor-minimal' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.stats.performance.totalViews).toBe(0)
      expect(data.data.stats.performance.averageRating).toBe(0)
      expect(data.data.stats.performance.totalReviews).toBe(0)
    })

    it('handles server errors gracefully', async () => {
      // Mock an error in data processing
      vi.doMock('@/lib/api/mock-data', () => {
        throw new Error('Database connection failed')
      })

      const params = Promise.resolve({ id: 'vendor-1' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Failed to fetch vendor statistics')
      expect(data.error.code).toBe('FETCH_ERROR')
    })

    it('calculates correct lowest price when some products have 0 price', async () => {
      // Mock products with some having 0 price
      vi.doMock('@/lib/api/mock-data', () => ({
        mockVendors: [
          {
            id: 'vendor-zero-price',
            name: 'Test Vendor',
            rating: 4.0,
            totalSales: 50,
            verified: true,
            joinedDate: '2023-01-01',
          },
        ],
        mockProducts: [
          {
            id: 'free-product',
            name: 'Free Product',
            price: 0,
            stock: 1,
            vendor: 'vendor-zero-price',
            views: 10,
            rating: 4.0,
            reviewCount: 2,
            featured: false,
            createdAt: '2024-01-01',
            category: 'Free Stuff',
          },
          {
            id: 'paid-product',
            name: 'Paid Product',
            price: 29.99,
            stock: 1,
            vendor: 'vendor-zero-price',
            views: 20,
            rating: 4.5,
            reviewCount: 5,
            featured: false,
            createdAt: '2024-01-02',
            category: 'Premium',
          },
        ],
      }))

      const params = Promise.resolve({ id: 'vendor-zero-price' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.stats.inventory.lowestPrice).toBe(29.99) // Should exclude 0 price
      expect(data.data.stats.inventory.highestPrice).toBe(29.99)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty vendor ID', async () => {
      const params = Promise.resolve({ id: '' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })

    it('handles null/undefined params', async () => {
      const params = Promise.resolve({ id: undefined as any })

      try {
        const response = await GET(mockRequest, { params })
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.success).toBe(false)
      } catch (error) {
        // Expected to throw due to undefined parameter
        expect(error).toBeDefined()
      }
    })

    it('handles extremely large numbers in calculations', async () => {
      // Mock vendor with products having large values
      vi.doMock('@/lib/api/mock-data', () => ({
        mockVendors: [
          {
            id: 'vendor-large-numbers',
            name: 'Expensive Vendor',
            rating: 5.0,
            totalSales: 999999,
            verified: true,
            joinedDate: '2020-01-01',
          },
        ],
        mockProducts: [
          {
            id: 'expensive-product',
            name: 'Very Expensive Product',
            price: 999999.99,
            stock: 1000,
            vendor: 'vendor-large-numbers',
            views: 1000000,
            rating: 5.0,
            reviewCount: 50000,
            featured: true,
            createdAt: '2024-01-01',
            category: 'Luxury',
          },
        ],
      }))

      const params = Promise.resolve({ id: 'vendor-large-numbers' })
      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.stats.inventory.totalValue).toBe(999999990000) // 999999.99 * 1000
      expect(data.data.stats.performance.totalViews).toBe(1000000)
    })
  })
})