import { describe, it, expect, vi } from 'vitest';
import { GET as getListings, POST as postListing } from '@/app/api/vendors/[id]/listings/route';
import { GET as getStats } from '@/app/api/vendors/[id]/stats/route';
import { mockVendors, mockProducts } from '@/lib/api/mock-data';

// Mock NextRequest for Vitest
class MockNextRequest extends Request {
  nextUrl: URL;

  constructor(url: string, init?: RequestInit) {
    super(url, init);
    this.nextUrl = new URL(url);
  }
}

// Polyfill NextRequest for tests
(global as any).NextRequest = MockNextRequest;

describe('Vendor API Tests with Vitest', () => {
  describe('GET /api/vendors/[id]/listings', () => {
    it('should return vendor listings with stats', async () => {
      const vendorId = '1';
      const request = new MockNextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`);
      const response = await getListings(request as any, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.vendor).toBeDefined();
      expect(data.data.vendor.id).toBe(vendorId);
      expect(data.data.products).toBeInstanceOf(Array);
      expect(data.data.stats).toBeDefined();
      expect(data.data.stats.totalListings).toBeGreaterThanOrEqual(0);
    });

    it('should return 404 for non-existent vendor', async () => {
      const vendorId = 'non-existent-999';
      const request = new MockNextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`);
      const response = await getListings(request as any, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VENDOR_NOT_FOUND');
    });

    it('should calculate correct statistics', async () => {
      const vendorId = '1';
      const request = new MockNextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`);
      const response = await getListings(request as any, { params: { id: vendorId } });
      const data = await response.json();

      const vendorProducts = mockProducts.filter(p => p.vendor.id === vendorId);
      const expectedActiveListings = vendorProducts.filter(p => p.stock > 0).length;
      const expectedOutOfStock = vendorProducts.filter(p => p.stock === 0).length;

      expect(data.data.stats.totalListings).toBe(vendorProducts.length);
      expect(data.data.stats.activeListings).toBe(expectedActiveListings);
      expect(data.data.stats.outOfStock).toBe(expectedOutOfStock);
    });

    it('should return all products for a specific vendor', async () => {
      const vendorId = '2';
      const request = new MockNextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`);
      const response = await getListings(request as any, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.vendor.id).toBe(vendorId);

      // All returned products should belong to this vendor
      data.data.products.forEach((product: any) => {
        expect(product.vendor.id).toBe(vendorId);
      });
    });
  });

  describe('POST /api/vendors/[id]/listings', () => {
    it('should create a new product listing', async () => {
      const vendorId = '1';
      const newProduct = {
        name: 'Test Pokemon Card',
        price: 99.99,
        category: 'vintage',
        stock: 10,
        description: 'A test card for Vitest',
        condition: 'mint',
        rarity: 'rare'
      };

      const request = new MockNextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`, {
        method: 'POST',
        body: JSON.stringify(newProduct),
      });

      // Mock the request.json() method
      request.json = vi.fn().mockResolvedValue(newProduct);

      const response = await postListing(request as any, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.name).toBe(newProduct.name);
      expect(data.data.price).toBe(newProduct.price);
      expect(data.data.vendor.id).toBe(vendorId);
      expect(data.message).toBe('Product listed successfully');
    });

    it('should validate required fields', async () => {
      const vendorId = '1';
      const invalidProduct = {
        name: 'Test Card',
        // Missing required fields: price, category, stock
      };

      const request = new MockNextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`, {
        method: 'POST',
        body: JSON.stringify(invalidProduct),
      });

      request.json = vi.fn().mockResolvedValue(invalidProduct);

      const response = await postListing(request as any, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 404 when creating listing for non-existent vendor', async () => {
      const vendorId = 'non-existent';
      const newProduct = {
        name: 'Test Card',
        price: 50,
        category: 'vintage',
        stock: 5
      };

      const request = new MockNextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`, {
        method: 'POST',
        body: JSON.stringify(newProduct),
      });

      request.json = vi.fn().mockResolvedValue(newProduct);

      const response = await postListing(request as any, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VENDOR_NOT_FOUND');
    });
  });

  describe('GET /api/vendors/[id]/stats', () => {
    it('should return comprehensive vendor statistics', async () => {
      const vendorId = '1';
      const request = new MockNextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await getStats(request as any, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.vendor).toBeDefined();
      expect(data.data.stats).toBeDefined();
      expect(data.data.stats.overview).toBeDefined();
      expect(data.data.stats.inventory).toBeDefined();
      expect(data.data.stats.performance).toBeDefined();
      expect(data.data.stats.categories).toBeDefined();
      expect(data.data.stats.topProducts).toBeInstanceOf(Array);
      expect(data.data.stats.recentListings).toBeInstanceOf(Array);
    });

    it('should calculate correct inventory statistics', async () => {
      const vendorId = '1';
      const request = new MockNextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await getStats(request as any, { params: { id: vendorId } });
      const data = await response.json();

      const vendorProducts = mockProducts.filter(p => p.vendor.id === vendorId);
      const totalItems = vendorProducts.reduce((sum, p) => sum + p.stock, 0);
      const totalValue = vendorProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);

      expect(data.data.stats.inventory.totalItems).toBe(totalItems);
      expect(data.data.stats.inventory.totalValue).toBeCloseTo(totalValue, 2);
      expect(data.data.stats.inventory.averagePrice).toBeGreaterThanOrEqual(0);
    });

    it('should return top products sorted by views', async () => {
      const vendorId = '1';
      const request = new MockNextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await getStats(request as any, { params: { id: vendorId } });
      const data = await response.json();

      const topProducts = data.data.stats.topProducts;
      expect(topProducts.length).toBeLessThanOrEqual(5);

      // Check that products are sorted by views
      for (let i = 1; i < topProducts.length; i++) {
        expect(topProducts[i].views).toBeLessThanOrEqual(topProducts[i - 1].views);
      }
    });

    it('should return 404 for non-existent vendor stats', async () => {
      const vendorId = 'non-existent';
      const request = new MockNextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await getStats(request as any, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VENDOR_NOT_FOUND');
    });
  });
});