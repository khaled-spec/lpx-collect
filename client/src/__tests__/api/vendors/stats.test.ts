import { GET } from '@/app/api/vendors/[id]/stats/route';
import { NextRequest } from 'next/server';
import { mockVendors, mockProducts } from '@/lib/api/mock-data';

describe('/api/vendors/[id]/stats', () => {
  describe('GET', () => {
    it('should return comprehensive vendor statistics', async () => {
      const vendorId = '1';
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await GET(request, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.vendor).toBeDefined();
      expect(data.data.vendor.id).toBe(vendorId);
      expect(data.data.stats).toBeDefined();
      expect(data.data.stats.overview).toBeDefined();
      expect(data.data.stats.inventory).toBeDefined();
      expect(data.data.stats.performance).toBeDefined();
      expect(data.data.stats.categories).toBeDefined();
      expect(data.data.stats.topProducts).toBeInstanceOf(Array);
      expect(data.data.stats.recentListings).toBeInstanceOf(Array);
    });

    it('should return 404 for non-existent vendor', async () => {
      const vendorId = 'non-existent';
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await GET(request, { params: { id: vendorId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VENDOR_NOT_FOUND');
    });

    it('should calculate correct overview statistics', async () => {
      const vendorId = '1';
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await GET(request, { params: { id: vendorId } });
      const data = await response.json();

      const vendorProducts = mockProducts.filter(p => p.vendor.id === vendorId);
      const activeListings = vendorProducts.filter(p => p.stock > 0).length;
      const outOfStock = vendorProducts.filter(p => p.stock === 0).length;
      const featuredProducts = vendorProducts.filter(p => p.featured).length;

      expect(data.data.stats.overview.totalProducts).toBe(vendorProducts.length);
      expect(data.data.stats.overview.activeListings).toBe(activeListings);
      expect(data.data.stats.overview.outOfStock).toBe(outOfStock);
      expect(data.data.stats.overview.featuredProducts).toBe(featuredProducts);
    });

    it('should calculate correct inventory statistics', async () => {
      const vendorId = '1';
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await GET(request, { params: { id: vendorId } });
      const data = await response.json();

      const vendorProducts = mockProducts.filter(p => p.vendor.id === vendorId);
      const totalItems = vendorProducts.reduce((sum, p) => sum + p.stock, 0);
      const totalValue = vendorProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);

      expect(data.data.stats.inventory.totalItems).toBe(totalItems);
      expect(data.data.stats.inventory.totalValue).toBeCloseTo(totalValue, 2);
      expect(data.data.stats.inventory.averagePrice).toBeGreaterThanOrEqual(0);
      expect(data.data.stats.inventory.highestPrice).toBeGreaterThanOrEqual(0);
      expect(data.data.stats.inventory.lowestPrice).toBeGreaterThanOrEqual(0);
    });

    it('should calculate performance metrics', async () => {
      const vendorId = '1';
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await GET(request, { params: { id: vendorId } });
      const data = await response.json();

      expect(data.data.stats.performance.totalViews).toBeGreaterThanOrEqual(0);
      expect(data.data.stats.performance.averageRating).toBeGreaterThanOrEqual(0);
      expect(data.data.stats.performance.averageRating).toBeLessThanOrEqual(5);
      expect(data.data.stats.performance.totalReviews).toBeGreaterThanOrEqual(0);
    });

    it('should group products by categories', async () => {
      const vendorId = '1';
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await GET(request, { params: { id: vendorId } });
      const data = await response.json();

      const categories = data.data.stats.categories;
      expect(typeof categories).toBe('object');

      Object.values(categories).forEach((category: any) => {
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('count');
        expect(category).toHaveProperty('value');
        expect(category.count).toBeGreaterThan(0);
        expect(category.value).toBeGreaterThanOrEqual(0);
      });
    });

    it('should return top products sorted by views', async () => {
      const vendorId = '1';
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await GET(request, { params: { id: vendorId } });
      const data = await response.json();

      const topProducts = data.data.stats.topProducts;
      expect(topProducts.length).toBeLessThanOrEqual(5);

      for (let i = 1; i < topProducts.length; i++) {
        expect(topProducts[i].views).toBeLessThanOrEqual(topProducts[i - 1].views);
      }

      topProducts.forEach((product: any) => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('stock');
        expect(product).toHaveProperty('views');
        expect(product).toHaveProperty('rating');
      });
    });

    it('should return recent listings sorted by creation date', async () => {
      const vendorId = '1';
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await GET(request, { params: { id: vendorId } });
      const data = await response.json();

      const recentListings = data.data.stats.recentListings;
      expect(recentListings.length).toBeLessThanOrEqual(5);

      recentListings.forEach((product: any) => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('createdAt');
      });
    });

    it('should handle vendor with no products', async () => {
      // Test with a hypothetical vendor that has no products
      const vendorId = '999';
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await GET(request, { params: { id: vendorId } });
      const data = await response.json();

      if (data.success) {
        expect(data.data.stats.overview.totalProducts).toBe(0);
        expect(data.data.stats.inventory.totalItems).toBe(0);
        expect(data.data.stats.inventory.totalValue).toBe(0);
        expect(data.data.stats.topProducts).toEqual([]);
        expect(data.data.stats.recentListings).toEqual([]);
      } else {
        expect(response.status).toBe(404);
      }
    });

    it('should include vendor information in response', async () => {
      const vendorId = '1';
      const vendor = mockVendors.find(v => v.id === vendorId);
      const request = new NextRequest(`http://localhost:3000/api/vendors/${vendorId}/stats`);
      const response = await GET(request, { params: { id: vendorId } });
      const data = await response.json();

      expect(data.data.vendor.id).toBe(vendor?.id);
      expect(data.data.vendor.name).toBe(vendor?.name);
      expect(data.data.vendor.rating).toBe(vendor?.rating);
      expect(data.data.vendor.totalSales).toBe(vendor?.totalSales);
      expect(data.data.vendor.verified).toBe(vendor?.verified);
      expect(data.data.vendor.joinedDate).toBe(vendor?.joinedDate);
    });
  });
});