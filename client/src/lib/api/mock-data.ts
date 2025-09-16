import { Product, Vendor, ProductFilter, PaginatedResponse } from './types';

// Note: Mock data has been removed. These arrays are now empty.
// Connect to real database for actual vendor and product data.
export const mockVendors: Vendor[] = [];
export const mockProducts: Product[] = [];

// Helper function to filter products
export function filterProducts(products: Product[], filters: Partial<ProductFilter>): Product[] {
  return products.filter(product => {
    if (filters.vendorId && product.vendorId !== filters.vendorId) {
      return false;
    }
    if (filters.category && product.categorySlug !== filters.category) {
      return false;
    }
    if (filters.minPrice && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false;
    }
    if (filters.condition && product.condition !== filters.condition) {
      return false;
    }
    if (filters.inStock && product.stock === 0) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(searchLower);
      const matchesDescription = product.description.toLowerCase().includes(searchLower);
      const matchesTags = product.tags?.some(tag => tag.toLowerCase().includes(searchLower));

      if (!matchesName && !matchesDescription && !matchesTags) {
        return false;
      }
    }

    return true;
  });
}

// Helper function to paginate data
export function paginateData<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 20
): PaginatedResponse<T> {
  const offset = (page - 1) * pageSize;
  const paginatedItems = data.slice(offset, offset + pageSize);

  return {
    data: paginatedItems,
    total: data.length,
    page,
    pageSize,
    hasNext: offset + pageSize < data.length,
    hasPrevious: page > 1
  };
}