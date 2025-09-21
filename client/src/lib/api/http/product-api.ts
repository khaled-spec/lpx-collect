// HTTP Product API Implementation (Stubbed)
// This will implement the real HTTP calls to the backend

import type {
  IProductAPI,
  PaginatedResponse,
  Product,
  ProductFilter,
} from "../types";

export class HttpProductAPI implements IProductAPI {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

  async getAll(filters?: ProductFilter): Promise<PaginatedResponse<Product>> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpProductAPI.getAll() - would make HTTP call to:",
          `${this.baseUrl}/products`,
          filters,
        );
    }

    // TODO: Replace with actual HTTP call
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getById(id: string): Promise<Product> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpProductAPI.getById() - would make HTTP call to:",
          `${this.baseUrl}/products/${id}`,
        );
    }

    // TODO: Replace with actual HTTP call
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getFeatured(): Promise<Product[]> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpProductAPI.getFeatured() - would make HTTP call to:",
          `${this.baseUrl}/products/featured`,
        );
    }

    // TODO: Replace with actual HTTP call
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getBySeller(sellerId: string, _limit?: number): Promise<Product[]> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpProductAPI.getBySeller() - would make HTTP call to:",
          `${this.baseUrl}/sellers/${sellerId}/products`,
        );
    }

    // TODO: Replace with actual HTTP call
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }
}
