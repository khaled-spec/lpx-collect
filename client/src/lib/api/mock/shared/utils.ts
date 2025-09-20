import {
  Product,
  ProductFilter,
  PaginatedResponse,
} from "../../types";

// Utility functions for filtering and pagination
export function filterProducts(products: Product[], filter: ProductFilter): Product[] {
  let filtered = [...products];

  if (filter.category) {
    filtered = filtered.filter(p => p.categorySlug === filter.category);
  }

  if (filter.vendorId) {
    filtered = filtered.filter(p => p.vendorId === filter.vendorId);
  }

  if (filter.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= filter.minPrice!);
  }

  if (filter.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= filter.maxPrice!);
  }

  if (filter.condition) {
    filtered = filtered.filter(p => p.condition === filter.condition);
  }

  if (filter.conditions && filter.conditions.length > 0) {
    filtered = filtered.filter(p => filter.conditions!.includes(p.condition || ''));
  }

  if (filter.inStock) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  if (filter.featured) {
    filtered = filtered.filter(p => p.featured === true);
  }

  if (filter.search || filter.searchQuery) {
    const query = (filter.search || filter.searchQuery || '').toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return filtered;
}

export function paginateData<T>(data: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = data.slice(start, end);

  return {
    data: paginatedData,
    total: data.length,
    page,
    pageSize,
    hasNext: end < data.length,
    hasPrevious: page > 1,
  };
}