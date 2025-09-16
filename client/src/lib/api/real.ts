// Real API implementations - connects to Next.js API routes
import {
  IProductAPI,
  ICategoryAPI,
  IVendorAPI,
  Product,
  Category,
  Vendor,
  ProductFilter,
  PaginatedResponse,
  ApiResponse,
} from "./types";

// Base API class for common functionality
class BaseAPI {
  protected apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  // Make HTTP requests to Next.js API routes
  protected async fetch<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    try {
      // Use relative URLs for Next.js API routes
      const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      return response.json();
    } catch (error) {
      console.error(`API fetch error for ${endpoint}:`, error);
      throw error;
    }
  }
}

// Real Product API Implementation
export class RealProductAPI extends BaseAPI implements IProductAPI {
  async getProducts(
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      const params = new URLSearchParams();
      if (filter?.categoryId) params.append('categoryId', filter.categoryId);
      if (filter?.vendorId) params.append('vendorId', filter.vendorId);
      if (filter?.minPrice !== undefined) params.append('minPrice', filter.minPrice.toString());
      if (filter?.maxPrice !== undefined) params.append('maxPrice', filter.maxPrice.toString());
      if (filter?.condition) params.append('condition', filter.condition);
      if (filter?.rarity) params.append('rarity', filter.rarity);
      if (filter?.search) params.append('search', filter.search);
      if (filter?.featured !== undefined) params.append('featured', filter.featured.toString());
      if (filter?.page) params.append('page', filter.page.toString());
      if (filter?.limit) params.append('limit', filter.limit.toString());
      if (filter?.sortBy) params.append('sortBy', filter.sortBy);

      const response = await this.fetch<ApiResponse<PaginatedResponse<Product>>>(
        `/api/products?${params.toString()}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch products',
          code: 'FETCH_ERROR',
          status: 500,
        },
      };
    }
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      const response = await this.fetch<ApiResponse<Product>>(
        `/api/products/${id}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch product',
          code: 'FETCH_ERROR',
          status: 500,
        },
      };
    }
  }

  async getProductsByCategory(
    categorySlug: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    // First get category to get its ID
    try {
      const categoryResponse = await this.fetch<ApiResponse<Category>>(
        `/api/categories/${categorySlug}`
      );
      if (categoryResponse.success && categoryResponse.data) {
        return this.getProducts({ ...filter, categoryId: categoryResponse.data.id });
      }
      return this.getProducts(filter);
    } catch {
      return this.getProducts(filter);
    }
  }

  async getFeaturedProducts(
    limit: number = 8,
  ): Promise<ApiResponse<Product[]>> {
    try {
      const response = await this.fetch<ApiResponse<PaginatedResponse<Product>>>(
        `/api/products?featured=true&limit=${limit}`
      );
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return { success: true, data: [] };
    } catch (error) {
      return { success: true, data: [] };
    }
  }

  async getRelatedProducts(
    productId: string,
    limit: number = 4,
  ): Promise<ApiResponse<Product[]>> {
    try {
      const response = await this.fetch<ApiResponse<Product[]>>(
        `/api/products/${productId}/related?limit=${limit}`
      );
      return response;
    } catch (error) {
      return { success: true, data: [] };
    }
  }

  async searchProducts(
    query: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return this.getProducts({ ...filter, search: query });
  }
}

// Real Category API Implementation
export class RealCategoryAPI extends BaseAPI implements ICategoryAPI {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await this.fetch<ApiResponse<Category[]>>(
        '/api/categories'
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch categories',
          code: 'FETCH_ERROR',
          status: 500,
        },
      };
    }
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    try {
      const response = await this.fetch<ApiResponse<Category>>(
        `/api/categories/${slug}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch category',
          code: 'FETCH_ERROR',
          status: 500,
        },
      };
    }
  }

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    try {
      const response = await this.fetch<ApiResponse<Category>>(
        `/api/categories/${id}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch category',
          code: 'FETCH_ERROR',
          status: 500,
        },
      };
    }
  }

  async getSubcategories(parentSlug: string): Promise<ApiResponse<Category[]>> {
    // For now, return empty as we don't have subcategories in mock data
    return {
      success: true,
      data: [],
    };
  }

  async getFeaturedCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await this.fetch<ApiResponse<Category[]>>(
        '/api/categories?featured=true'
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch featured categories',
          code: 'FETCH_ERROR',
          status: 500,
        },
      };
    }
  }
}

// Real Vendor API Implementation
export class RealVendorAPI extends BaseAPI implements IVendorAPI {
  async getVendors(filter?: {
    featured?: boolean;
    verified?: boolean;
  }): Promise<ApiResponse<Vendor[]>> {
    try {
      const params = new URLSearchParams();
      if (filter?.featured !== undefined) params.append('featured', filter.featured.toString());
      if (filter?.verified !== undefined) params.append('verified', filter.verified.toString());

      const response = await this.fetch<ApiResponse<Vendor[]>>(
        `/api/vendors${params.toString() ? `?${params.toString()}` : ''}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch vendors',
          code: 'FETCH_ERROR',
          status: 500,
        },
      };
    }
  }

  async getVendorById(id: string): Promise<ApiResponse<Vendor>> {
    try {
      const response = await this.fetch<ApiResponse<Vendor>>(
        `/api/vendors/${id}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch vendor',
          code: 'FETCH_ERROR',
          status: 500,
        },
      };
    }
  }

  async getVendorBySlug(slug: string): Promise<ApiResponse<Vendor>> {
    try {
      const response = await this.fetch<ApiResponse<Vendor>>(
        `/api/vendors/${slug}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch vendor',
          code: 'FETCH_ERROR',
          status: 500,
        },
      };
    }
  }

  async getVendorProducts(
    vendorId: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      const params = new URLSearchParams();
      if (filter?.page) params.append('page', filter.page.toString());
      if (filter?.limit) params.append('limit', filter.limit.toString());

      const response = await this.fetch<ApiResponse<PaginatedResponse<Product>>>(
        `/api/vendors/${vendorId}/products${params.toString() ? `?${params.toString()}` : ''}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch vendor products',
          code: 'FETCH_ERROR',
          status: 500,
        },
      };
    }
  }
}
