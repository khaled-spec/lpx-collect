// HTTP Category API Implementation (Stubbed)
import type { ApiResponse, Category, ICategoryAPI } from "../types";

export class HttpCategoryAPI implements ICategoryAPI {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

  async getCategories(): Promise<ApiResponse<Category[]>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpCategoryAPI.getCategories() - would make HTTP call to:",
        `${this.baseUrl}/categories`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpCategoryAPI.getCategoryById() - would make HTTP call to:",
        `${this.baseUrl}/categories/${id}`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpCategoryAPI.getCategoryBySlug() - would make HTTP call to:",
        `${this.baseUrl}/categories/slug/${slug}`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getSubcategories(parentSlug: string): Promise<ApiResponse<Category[]>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpCategoryAPI.getSubcategories() - would make HTTP call to:",
        `${this.baseUrl}/categories/${parentSlug}/subcategories`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getFeaturedCategories(): Promise<ApiResponse<Category[]>> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpCategoryAPI.getFeaturedCategories() - would make HTTP call to:",
        `${this.baseUrl}/categories/featured`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }
}
