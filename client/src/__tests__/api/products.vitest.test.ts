import { describe, it, expect, beforeAll } from 'vitest';
import { GET } from '@/app/api/products/route';
import { NextRequest } from 'next/server';

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

describe('Products API with Vitest', () => {
  describe('GET /api/products', () => {
    it('should return products with success response', async () => {
      const request = new MockNextRequest('http://localhost:3000/api/products');
      const response = await GET(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data.data)).toBe(true);
    });

    it('should filter products by search query', async () => {
      const request = new MockNextRequest('http://localhost:3000/api/products?search=charizard');
      const response = await GET(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      if (data.data.data.length > 0) {
        data.data.data.forEach((product: any) => {
          expect(product.name.toLowerCase()).toContain('charizard');
        });
      }
    });

    it('should handle pagination parameters', async () => {
      const request = new MockNextRequest('http://localhost:3000/api/products?page=2&limit=5');
      const response = await GET(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.page).toBe(2);
      expect(data.data.pageSize).toBe(5);
      expect(data.data.data.length).toBeLessThanOrEqual(5);
    });

    it('should filter by price range', async () => {
      const request = new MockNextRequest('http://localhost:3000/api/products?minPrice=100&maxPrice=500');
      const response = await GET(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);

      data.data.data.forEach((product: any) => {
        expect(product.price).toBeGreaterThanOrEqual(100);
        expect(product.price).toBeLessThanOrEqual(500);
      });
    });

    it('should sort products correctly', async () => {
      const request = new MockNextRequest('http://localhost:3000/api/products?sortBy=price&order=desc&limit=10');
      const response = await GET(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);

      const products = data.data.data;
      // Verify we have products
      expect(products.length).toBeGreaterThan(0);

      // Check descending order - high to low prices
      if (products.length > 1) {
        for (let i = 1; i < products.length; i++) {
          expect(products[i].price).toBeLessThanOrEqual(products[i - 1].price);
        }
      }
    });
  });
});