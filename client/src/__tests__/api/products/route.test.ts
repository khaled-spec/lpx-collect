import { GET } from '@/app/api/products/route';
import { NextRequest } from 'next/server';
import { mockProducts } from '@/lib/api/mock-data';

describe('/api/products', () => {
  describe('GET', () => {
    it('should return all products with default pagination', async () => {
      const request = new NextRequest('http://localhost:3000/api/products');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.data).toBeInstanceOf(Array);
      expect(data.data.page).toBe(1);
      expect(data.data.pageSize).toBeLessThanOrEqual(100);
      expect(data.data.total).toBe(mockProducts.length);
    });

    it('should filter products by search query', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?search=charizard');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.data).toBeInstanceOf(Array);

      const products = data.data.data;
      products.forEach((product: any) => {
        expect(product.name.toLowerCase()).toContain('charizard');
      });
    });

    it('should filter products by category', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?category=vintage');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.data).toBeInstanceOf(Array);

      const products = data.data.data;
      products.forEach((product: any) => {
        expect(product.category.slug || product.category).toBe('vintage');
      });
    });

    it('should filter products by price range', async () => {
      const minPrice = 100;
      const maxPrice = 500;
      const request = new NextRequest(`http://localhost:3000/api/products?minPrice=${minPrice}&maxPrice=${maxPrice}`);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      const products = data.data.data;
      products.forEach((product: any) => {
        expect(product.price).toBeGreaterThanOrEqual(minPrice);
        expect(product.price).toBeLessThanOrEqual(maxPrice);
      });
    });

    it('should filter products by condition', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?condition=mint');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      const products = data.data.data;
      products.forEach((product: any) => {
        expect(product.condition).toBe('mint');
      });
    });

    it('should filter products by rarity', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?rarity=legendary');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      const products = data.data.data;
      products.forEach((product: any) => {
        expect(product.rarity).toBe('legendary');
      });
    });

    it('should filter featured products', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?featured=true');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      const products = data.data.data;
      products.forEach((product: any) => {
        expect(product.featured).toBe(true);
      });
    });

    it('should handle pagination correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?page=2&limit=5');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.page).toBe(2);
      expect(data.data.pageSize).toBe(5);
      expect(data.data.data.length).toBeLessThanOrEqual(5);
      expect(data.data.hasPrevious).toBe(true);
    });

    it('should sort products by price ascending', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?sortBy=price&order=asc');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      const products = data.data.data;
      for (let i = 1; i < products.length; i++) {
        expect(products[i].price).toBeGreaterThanOrEqual(products[i - 1].price);
      }
    });

    it('should sort products by price descending', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?sortBy=price&order=desc');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      const products = data.data.data;
      for (let i = 1; i < products.length; i++) {
        expect(products[i].price).toBeLessThanOrEqual(products[i - 1].price);
      }
    });

    it('should handle invalid page number gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?page=999');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.data).toEqual([]);
      expect(data.data.page).toBe(999);
    });

    it('should handle multiple filters simultaneously', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?category=vintage&minPrice=100&condition=mint');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      const products = data.data.data;
      products.forEach((product: any) => {
        expect(product.category.slug || product.category).toBe('vintage');
        expect(product.price).toBeGreaterThanOrEqual(100);
        expect(product.condition).toBe('mint');
      });
    });
  });
});