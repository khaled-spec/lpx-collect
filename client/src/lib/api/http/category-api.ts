// HTTP Category API Implementation (Stubbed)
import type { Category, ICategoryAPI } from "../types";

export class HttpCategoryAPI implements ICategoryAPI {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

  async getAll(): Promise<Category[]> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpCategoryAPI.getAll() - would make HTTP call to:",
          `${this.baseUrl}/categories`,
        );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getById(id: string): Promise<Category> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpCategoryAPI.getById() - would make HTTP call to:",
          `${this.baseUrl}/categories/${id}`,
        );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getBySlug(slug: string): Promise<Category> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpCategoryAPI.getBySlug() - would make HTTP call to:",
          `${this.baseUrl}/categories/slug/${slug}`,
        );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }
}
