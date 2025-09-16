/**
 * Integration tests for product API endpoints
 * These tests make actual HTTP requests to the running Next.js server
 */

describe('Products API Integration Tests', () => {
  const baseUrl = 'http://localhost:3000';

  describe('GET /api/products', () => {
    it('should return products with default pagination', async () => {
      const response = await fetch(`${baseUrl}/api/products`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.data).toBeInstanceOf(Array);
      expect(data.data.page).toBe(1);
      expect(data.data.total).toBeGreaterThan(0);
    });

    it('should filter products by search query', async () => {
      const response = await fetch(`${baseUrl}/api/products?search=charizard`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      const products = data.data.data;
      if (products.length > 0) {
        products.forEach((product: any) => {
          expect(product.name.toLowerCase()).toContain('charizard');
        });
      }
    });

    it('should filter by price range', async () => {
      const minPrice = 100;
      const maxPrice = 500;
      const response = await fetch(`${baseUrl}/api/products?minPrice=${minPrice}&maxPrice=${maxPrice}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      const products = data.data.data;
      products.forEach((product: any) => {
        expect(product.price).toBeGreaterThanOrEqual(minPrice);
        expect(product.price).toBeLessThanOrEqual(maxPrice);
      });
    });

    it('should handle pagination', async () => {
      const response = await fetch(`${baseUrl}/api/products?page=2&limit=5`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.page).toBe(2);
      expect(data.data.pageSize).toBe(5);
      expect(data.data.data.length).toBeLessThanOrEqual(5);
    });

    it('should sort products by price', async () => {
      const response = await fetch(`${baseUrl}/api/products?sortBy=price&order=asc`);
      const data = await response.json();

      expect(response.status).toBe(200);

      const products = data.data.data;
      for (let i = 1; i < products.length; i++) {
        expect(products[i].price).toBeGreaterThanOrEqual(products[i - 1].price);
      }
    });
  });

  describe('GET /api/vendors/:id/listings', () => {
    it('should return vendor listings', async () => {
      const response = await fetch(`${baseUrl}/api/vendors/1/listings`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.vendor).toBeDefined();
      expect(data.data.products).toBeInstanceOf(Array);
      expect(data.data.stats).toBeDefined();
    });

    it('should return 404 for non-existent vendor', async () => {
      const response = await fetch(`${baseUrl}/api/vendors/999999/listings`);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VENDOR_NOT_FOUND');
    });
  });

  describe('GET /api/vendors/:id/stats', () => {
    it('should return comprehensive vendor statistics', async () => {
      const response = await fetch(`${baseUrl}/api/vendors/1/stats`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.vendor).toBeDefined();
      expect(data.data.stats.overview).toBeDefined();
      expect(data.data.stats.inventory).toBeDefined();
      expect(data.data.stats.performance).toBeDefined();
      expect(data.data.stats.topProducts).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/vendors/:id/listings', () => {
    it('should create a new product listing', async () => {
      const newProduct = {
        name: 'Test Pokemon Card',
        price: 99.99,
        category: 'vintage',
        stock: 10,
        description: 'A test card for integration testing'
      };

      const response = await fetch(`${baseUrl}/api/vendors/1/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe(newProduct.name);
      expect(data.data.price).toBe(newProduct.price);
      expect(data.data.vendor.id).toBe('1');
    });

    it('should validate required fields', async () => {
      const invalidProduct = {
        name: 'Test Card'
        // Missing required fields
      };

      const response = await fetch(`${baseUrl}/api/vendors/1/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidProduct)
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });
  });
});

// Helper to check if server is running
export async function waitForServer(url: string, maxAttempts = 30): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return true;
    } catch (error) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

// Run tests only if server is available
beforeAll(async () => {
  const serverReady = await waitForServer('http://localhost:3000');
  if (!serverReady) {
    console.warn('Server not running. Run `npm run dev` before running integration tests.');
    process.exit(1);
  }
});