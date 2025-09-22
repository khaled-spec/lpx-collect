// HTTP Product API Implementation (Stubbed)
// This will implement the real HTTP calls to the backend

import type {
  ApiResponse,
  IProductAPI,
  PaginatedResponse,
  Product,
  ProductFilter,
} from "../types";

export class HttpProductAPI implements IProductAPI {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

  async getProducts(
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpProductAPI.getProducts() - would make HTTP call to:",
        `${this.baseUrl}/products`,
        filter,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpProductAPI.getProductById() - would make HTTP call to:",
        `${this.baseUrl}/products/${id}`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getProductsByCategory(
    categorySlug: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpProductAPI.getProductsByCategory() - would make HTTP call to:",
        `${this.baseUrl}/categories/${categorySlug}/products`,
        filter,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getFeaturedProducts(limit?: number): Promise<ApiResponse<Product[]>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpProductAPI.getFeaturedProducts() - would make HTTP call to:",
        `${this.baseUrl}/products/featured`,
        { limit },
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getRelatedProducts(
    productId: string,
    limit?: number,
  ): Promise<ApiResponse<Product[]>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpProductAPI.getRelatedProducts() - would make HTTP call to:",
        `${this.baseUrl}/products/${productId}/related`,
        { limit },
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async searchProducts(
    query: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpProductAPI.searchProducts() - would make HTTP call to:",
        `${this.baseUrl}/products/search`,
        { query, filter },
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }
}
