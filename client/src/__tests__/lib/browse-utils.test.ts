import { describe, it, expect } from 'vitest';
import {
  buildFilterQuery,
  parseFilterQuery,
  applyFilters,
  sortProducts,
  getPriceRange,
  getUniqueValues,
  createSearchFilter,
  validatePriceRange
} from '@/lib/browse-utils';
import { Product } from '@/lib/api/types';

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Charizard - Base Set',
    slug: 'charizard-base-set',
    description: 'Fire-type Pokemon',
    price: 5999.99,
    category: { id: '1', name: 'Vintage', slug: 'vintage' },
    vendor: { id: '1', name: 'Elite Cards' },
    stock: 5,
    condition: 'mint',
    rarity: 'legendary',
    featured: true,
    tags: ['fire', 'starter'],
  },
  {
    id: '2',
    name: 'Pikachu - Base Set',
    slug: 'pikachu-base-set',
    description: 'Electric-type Pokemon',
    price: 299.99,
    category: { id: '1', name: 'Vintage', slug: 'vintage' },
    vendor: { id: '2', name: 'Card Store' },
    stock: 10,
    condition: 'near-mint',
    rarity: 'rare',
    featured: false,
    tags: ['electric', 'mascot'],
  },
  {
    id: '3',
    name: 'Blastoise - Modern',
    slug: 'blastoise-modern',
    description: 'Water-type Pokemon',
    price: 149.99,
    category: { id: '2', name: 'Modern', slug: 'modern' },
    vendor: { id: '1', name: 'Elite Cards' },
    stock: 0,
    condition: 'mint',
    rarity: 'rare',
    featured: true,
    tags: ['water', 'starter'],
  },
] as any;

describe('Browse Utils', () => {
  describe('buildFilterQuery', () => {
    it('should build query string from filters', () => {
      const filters = {
        category: 'vintage',
        minPrice: 100,
        maxPrice: 1000,
        condition: 'mint',
        rarity: 'rare',
        search: 'charizard'
      };

      const query = buildFilterQuery(filters);

      expect(query).toContain('category=vintage');
      expect(query).toContain('minPrice=100');
      expect(query).toContain('maxPrice=1000');
      expect(query).toContain('condition=mint');
      expect(query).toContain('rarity=rare');
      expect(query).toContain('search=charizard');
    });

    it('should handle empty filters', () => {
      const query = buildFilterQuery({});
      expect(query).toBe('');
    });

    it('should skip null and undefined values', () => {
      const filters = {
        category: 'vintage',
        minPrice: null,
        maxPrice: undefined,
        condition: '',
      };

      const query = buildFilterQuery(filters);

      expect(query).toBe('category=vintage');
    });

    it('should handle array values', () => {
      const filters = {
        categories: ['vintage', 'modern'],
        tags: ['fire', 'water']
      };

      const query = buildFilterQuery(filters);

      expect(query).toContain('categories=vintage,modern');
      expect(query).toContain('tags=fire,water');
    });
  });

  describe('parseFilterQuery', () => {
    it('should parse query string to filters object', () => {
      const query = 'category=vintage&minPrice=100&maxPrice=1000&search=charizard';
      const filters = parseFilterQuery(query);

      expect(filters.category).toBe('vintage');
      expect(filters.minPrice).toBe('100');
      expect(filters.maxPrice).toBe('1000');
      expect(filters.search).toBe('charizard');
    });

    it('should handle empty query string', () => {
      const filters = parseFilterQuery('');
      expect(filters).toEqual({});
    });

    it('should handle URL encoded values', () => {
      const query = 'search=charizard%20base%20set&category=vintage%20cards';
      const filters = parseFilterQuery(query);

      expect(filters.search).toBe('charizard base set');
      expect(filters.category).toBe('vintage cards');
    });

    it('should handle array values', () => {
      const query = 'tags=fire&tags=water&tags=grass';
      const filters = parseFilterQuery(query);

      expect(filters.tags).toEqual(['fire', 'water', 'grass']);
    });
  });

  describe('applyFilters', () => {
    it('should filter by category', () => {
      const filtered = applyFilters(mockProducts, { category: 'vintage' });

      expect(filtered.length).toBe(2);
      expect(filtered.every(p => p.category.slug === 'vintage')).toBe(true);
    });

    it('should filter by price range', () => {
      const filtered = applyFilters(mockProducts, {
        minPrice: 200,
        maxPrice: 6000
      });

      expect(filtered.length).toBe(2);
      expect(filtered.every(p => p.price >= 200 && p.price <= 6000)).toBe(true);
    });

    it('should filter by condition', () => {
      const filtered = applyFilters(mockProducts, { condition: 'mint' });

      expect(filtered.length).toBe(2);
      expect(filtered.every(p => p.condition === 'mint')).toBe(true);
    });

    it('should filter by rarity', () => {
      const filtered = applyFilters(mockProducts, { rarity: 'rare' });

      expect(filtered.length).toBe(2);
      expect(filtered.every(p => p.rarity === 'rare')).toBe(true);
    });

    it('should filter by search term', () => {
      const filtered = applyFilters(mockProducts, { search: 'charizard' });

      expect(filtered.length).toBe(1);
      expect(filtered[0].name.toLowerCase()).toContain('charizard');
    });

    it('should filter by stock availability', () => {
      const filtered = applyFilters(mockProducts, { inStock: true });

      expect(filtered.length).toBe(2);
      expect(filtered.every(p => p.stock > 0)).toBe(true);
    });

    it('should apply multiple filters', () => {
      const filtered = applyFilters(mockProducts, {
        category: 'vintage',
        minPrice: 200,
        condition: 'near-mint'
      });

      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('2');
    });

    it('should return all products with no filters', () => {
      const filtered = applyFilters(mockProducts, {});
      expect(filtered.length).toBe(mockProducts.length);
    });
  });

  describe('sortProducts', () => {
    it('should sort by price ascending', () => {
      const sorted = sortProducts(mockProducts, 'price', 'asc');

      expect(sorted[0].price).toBe(149.99);
      expect(sorted[1].price).toBe(299.99);
      expect(sorted[2].price).toBe(5999.99);
    });

    it('should sort by price descending', () => {
      const sorted = sortProducts(mockProducts, 'price', 'desc');

      expect(sorted[0].price).toBe(5999.99);
      expect(sorted[1].price).toBe(299.99);
      expect(sorted[2].price).toBe(149.99);
    });

    it('should sort by name alphabetically', () => {
      const sorted = sortProducts(mockProducts, 'name', 'asc');

      expect(sorted[0].name).toContain('Blastoise');
      expect(sorted[1].name).toContain('Charizard');
      expect(sorted[2].name).toContain('Pikachu');
    });

    it('should sort by rarity', () => {
      const sorted = sortProducts(mockProducts, 'rarity', 'desc');

      expect(sorted[0].rarity).toBe('legendary');
      expect(sorted[1].rarity).toBe('rare');
    });

    it('should maintain original order with invalid sort field', () => {
      const sorted = sortProducts(mockProducts, 'invalid', 'asc');

      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('3');
    });
  });

  describe('getPriceRange', () => {
    it('should get min and max prices', () => {
      const range = getPriceRange(mockProducts);

      expect(range.min).toBe(149.99);
      expect(range.max).toBe(5999.99);
    });

    it('should handle empty array', () => {
      const range = getPriceRange([]);

      expect(range.min).toBe(0);
      expect(range.max).toBe(0);
    });

    it('should handle single product', () => {
      const range = getPriceRange([mockProducts[0]]);

      expect(range.min).toBe(5999.99);
      expect(range.max).toBe(5999.99);
    });
  });

  describe('getUniqueValues', () => {
    it('should get unique categories', () => {
      const categories = getUniqueValues(mockProducts, 'category');

      expect(categories.size).toBe(2);
      expect(categories.has('vintage')).toBe(true);
      expect(categories.has('modern')).toBe(true);
    });

    it('should get unique conditions', () => {
      const conditions = getUniqueValues(mockProducts, 'condition');

      expect(conditions.size).toBe(2);
      expect(conditions.has('mint')).toBe(true);
      expect(conditions.has('near-mint')).toBe(true);
    });

    it('should get unique rarities', () => {
      const rarities = getUniqueValues(mockProducts, 'rarity');

      expect(rarities.size).toBe(2);
      expect(rarities.has('legendary')).toBe(true);
      expect(rarities.has('rare')).toBe(true);
    });

    it('should handle nested properties', () => {
      const vendors = getUniqueValues(mockProducts, 'vendor.name');

      expect(vendors.size).toBe(2);
      expect(vendors.has('Elite Cards')).toBe(true);
      expect(vendors.has('Card Store')).toBe(true);
    });
  });

  describe('createSearchFilter', () => {
    it('should create case-insensitive search filter', () => {
      const filter = createSearchFilter('CHARIZARD');
      const result = mockProducts.filter(filter);

      expect(result.length).toBe(1);
      expect(result[0].name).toContain('Charizard');
    });

    it('should search in name and description', () => {
      const filter = createSearchFilter('electric');
      const result = mockProducts.filter(filter);

      expect(result.length).toBe(1);
      expect(result[0].name).toContain('Pikachu');
    });

    it('should search in tags', () => {
      const filter = createSearchFilter('mascot');
      const result = mockProducts.filter(filter);

      expect(result.length).toBe(1);
      expect(result[0].name).toContain('Pikachu');
    });

    it('should handle empty search term', () => {
      const filter = createSearchFilter('');
      const result = mockProducts.filter(filter);

      expect(result.length).toBe(mockProducts.length);
    });

    it('should handle special characters', () => {
      const filter = createSearchFilter('base set');
      const result = mockProducts.filter(filter);

      expect(result.length).toBe(2);
    });
  });

  describe('validatePriceRange', () => {
    it('should validate correct price range', () => {
      const result = validatePriceRange(100, 1000);

      expect(result.valid).toBe(true);
      expect(result.min).toBe(100);
      expect(result.max).toBe(1000);
    });

    it('should swap min and max if reversed', () => {
      const result = validatePriceRange(1000, 100);

      expect(result.valid).toBe(true);
      expect(result.min).toBe(100);
      expect(result.max).toBe(1000);
    });

    it('should handle negative prices', () => {
      const result = validatePriceRange(-100, 1000);

      expect(result.valid).toBe(true);
      expect(result.min).toBe(0);
      expect(result.max).toBe(1000);
    });

    it('should handle null values', () => {
      const result = validatePriceRange(null, 1000);

      expect(result.valid).toBe(true);
      expect(result.min).toBe(0);
      expect(result.max).toBe(1000);
    });

    it('should handle both null values', () => {
      const result = validatePriceRange(null, null);

      expect(result.valid).toBe(false);
      expect(result.min).toBe(0);
      expect(result.max).toBe(Number.MAX_VALUE);
    });
  });
});