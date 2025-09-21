// HTTP Cart API Implementation (Stubbed)
import type { CartItem, ICartAPI } from "../types";

export class HttpCartAPI implements ICartAPI {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

  async getCart(userId: string): Promise<CartItem[]> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpCartAPI.getCart() - would make HTTP call to:",
          `${this.baseUrl}/users/${userId}/cart`,
        );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async addToCart(userId: string, item: CartItem): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpCartAPI.addToCart() - would make HTTP call to:",
          `${this.baseUrl}/users/${userId}/cart`,
          item,
        );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async updateQuantity(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpCartAPI.updateQuantity() - would make HTTP call to:",
          `${this.baseUrl}/users/${userId}/cart/${itemId}`,
          { quantity },
        );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async removeFromCart(userId: string, itemId: string): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpCartAPI.removeFromCart() - would make HTTP call to:",
          `${this.baseUrl}/users/${userId}/cart/${itemId}`,
        );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async clearCart(userId: string): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "🌐 HttpCartAPI.clearCart() - would make HTTP call to:",
          `${this.baseUrl}/users/${userId}/cart`,
        );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }
}
