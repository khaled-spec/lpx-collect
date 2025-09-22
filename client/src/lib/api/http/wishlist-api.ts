// HTTP Wishlist API Implementation (Stubbed)
import type { IWishlistAPI, WishlistItem } from "../types";

export class HttpWishlistAPI implements IWishlistAPI {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

  async getWishlist(userId: string): Promise<WishlistItem[]> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpWishlistAPI.getWishlist() - would make HTTP call to:",
        `${this.baseUrl}/users/${userId}/wishlist`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async addToWishlist(userId: string, item: WishlistItem): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpWishlistAPI.addToWishlist() - would make HTTP call to:",
        `${this.baseUrl}/users/${userId}/wishlist`,
        item,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async removeFromWishlist(userId: string, itemId: string): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpWishlistAPI.removeFromWishlist() - would make HTTP call to:",
        `${this.baseUrl}/users/${userId}/wishlist/${itemId}`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async clearWishlist(userId: string): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpWishlistAPI.clearWishlist() - would make HTTP call to:",
        `${this.baseUrl}/users/${userId}/wishlist`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }
}
