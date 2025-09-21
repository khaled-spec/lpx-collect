// HTTP Vendor API Implementation (Stubbed)
import type { IVendorAPI, Vendor } from "../types";

export class HttpVendorAPI implements IVendorAPI {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

  async getAll(): Promise<Vendor[]> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpVendorAPI.getAll() - would make HTTP call to:",
          `${this.baseUrl}/vendors`,
        );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async getById(id: string): Promise<Vendor> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpVendorAPI.getById() - would make HTTP call to:",
          `${this.baseUrl}/vendors/${id}`,
        );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }
}
