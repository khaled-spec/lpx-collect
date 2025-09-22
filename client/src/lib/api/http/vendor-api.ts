// HTTP Vendor API Implementation (Stubbed)
import type {
  ApiResponse,
  IVendorAPI,
  PaginatedResponse,
  Product,
  ProductFilter,
  Vendor,
} from "../types";

export class HttpVendorAPI implements IVendorAPI {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

  async getVendors(filter?: {
    featured?: boolean;
    verified?: boolean;
  }): Promise<ApiResponse<Vendor[]>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpVendorAPI.getVendors() - would make HTTP call to:",
        `${this.baseUrl}/vendors`,
        filter,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getVendorById(id: string): Promise<ApiResponse<Vendor>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpVendorAPI.getVendorById() - would make HTTP call to:",
        `${this.baseUrl}/vendors/${id}`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getVendorBySlug(slug: string): Promise<ApiResponse<Vendor>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpVendorAPI.getVendorBySlug() - would make HTTP call to:",
        `${this.baseUrl}/vendors/slug/${slug}`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getVendorProducts(
    vendorId: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpVendorAPI.getVendorProducts() - would make HTTP call to:",
        `${this.baseUrl}/vendors/${vendorId}/products`,
        filter,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }
}
