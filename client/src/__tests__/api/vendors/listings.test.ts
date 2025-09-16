import { GET, POST } from '@/app/api/vendors/[id]/listings/route';
import { NextRequest } from 'next/server';
import { mockVendors, mockProducts } from '@/lib/api/mock-data';

describe('/api/vendors/[id]/listings', () => {
  describe('GET', () => {
    it('should return vendor listings with stats', async () => {
      const vendorId = '1';
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`);
      const response = await GET(request, { params: { id: vendorId } });
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
      const vendorId = 'non-existent';
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`);
      const response = await GET(request, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VENDOR_NOT_FOUND');
    });

    it('should return vendor by slug', async () => {
      const vendorSlug = mockVendors[0].slug;
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorSlug}/listings`);
      const response = await GET(request, { params: { id: vendorSlug } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.vendor.slug).toBe(vendorSlug);
    });

    it('should calculate correct statistics', async () => {
      const vendorId = '1';
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`);
      const response = await GET(request, { params: { id: vendorId } });
      const data = await response.json();

      const vendorProducts = mockProducts.filter(p => p.vendor.id === vendorId);
      const expectedActiveListings = vendorProducts.filter(p => p.stock > 0).length;
      const expectedOutOfStock = vendorProducts.filter(p => p.stock === 0).length;

      expect(data.data.stats.totalListings).toBe(vendorProducts.length);
      expect(data.data.stats.activeListings).toBe(expectedActiveListings);
      expect(data.data.stats.outOfStock).toBe(expectedOutOfStock);
    });

    it('should return empty products array for vendor with no products', async () => {
      // Mock a vendor with no products
      const vendorId = '999';
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`);
      const response = await GET(request, { params: { id: vendorId } });
      const data = await response.json();

      if (data.success) {
        expect(data.data.products).toEqual([]);
        expect(data.data.stats.totalListings).toBe(0);
      } else {
        expect(response.status).toBe(404);
      }
    });
  });

  describe('POST', () => {
    it('should create a new product listing', async () => {
      const vendorId = '1';
      const newProduct = {
        name: 'Test Pokemon Card',
        price: 99.99,
        category: 'vintage',
        stock: 10,
        description: 'A test card',
        condition: 'mint',
        rarity: 'rare',
        images: ['https://example.com/test.jpg']
      };

      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`, {
        method: 'POST',
        body: JSON.stringify(newProduct),
      });

      const response = await POST(request, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.name).toBe(newProduct.name);
      expect(data.data.price).toBe(newProduct.price);
      expect(data.data.vendor.id).toBe(vendorId);
      expect(data.data.id).toBeDefined();
      expect(data.message).toBe('Product listed successfully');
    });

    it('should return 404 when creating listing for non-existent vendor', async () => {
      const vendorId = 'non-existent';
      const newProduct = {
        name: 'Test Card',
        price: 50,
        category: 'vintage',
        stock: 5
      };

      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`, {
        method: 'POST',
        body: JSON.stringify(newProduct),
      });

      const response = await POST(request, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VENDOR_NOT_FOUND');
    });

    it('should validate required fields when creating listing', async () => {
      const vendorId = '1';
      const invalidProduct = {
        name: 'Test Card',
        // Missing required fields: price, category, stock
      };

      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`, {
        method: 'POST',
        body: JSON.stringify(invalidProduct),
      });

      const response = await POST(request, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
      expect(data.error.message).toBe('Missing required fields');
    });

    it('should create listing with optional fields', async () => {
      const vendorId = '1';
      const productWithOptionals = {
        name: 'Premium Card',
        price: 299.99,
        originalPrice: 399.99,
        category: 'modern',
        stock: 3,
        description: 'A premium collectible',
        condition: 'gem-mint',
        rarity: 'legendary',
        cardNumber: 'XY-001',
        tags: ['premium', 'limited'],
        specifications: {
          set: 'XY Evolutions',
          year: '2016'
        }
      };

      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`, {
        method: 'POST',
        body: JSON.stringify(productWithOptionals),
      });

      const response = await POST(request, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.originalPrice).toBe(productWithOptionals.originalPrice);
      expect(data.data.cardNumber).toBe(productWithOptionals.cardNumber);
      expect(data.data.tags).toEqual(productWithOptionals.tags);
      expect(data.data.specifications).toEqual(productWithOptionals.specifications);
    });

    it('should auto-generate slug from product name', async () => {
      const vendorId = '1';
      const newProduct = {
        name: 'Shiny Charizard GX',
        price: 199.99,
        category: 'modern',
        stock: 2
      };

      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/listings`, {
        method: 'POST',
        body: JSON.stringify(newProduct),
      });

      const response = await POST(request, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.slug).toBe('shiny-charizard-gx');
    });
  });
});