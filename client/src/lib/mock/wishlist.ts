import type { CartItem, Product } from "@/types";
import { cartMockService } from "./cart";
import { AUTO_POPULATE_SETTINGS, mockDataUtils } from "./data";

interface MoveToCartSuccess {
  product: Product;
  cartItem: CartItem;
}

interface MoveToCartFailure {
  product: Product;
  error: string;
}

interface MoveToCartResults {
  successful: MoveToCartSuccess[];
  failed: MoveToCartFailure[];
}

export interface WishlistOperationResult {
  success: boolean;
  message: string;
  data?: WishlistItem | MoveToCartResults | string;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: Date;
  notes?: string;
}

export interface WishlistSummary {
  items: WishlistItem[];
  itemCount: number;
  totalValue: number;
  categories: string[];
  averagePrice: number;
}

const WISHLIST_STORAGE_KEY = "lpx-wishlist";
const _USER_WISHLIST_PREFIX = "lpx_wishlist_user_";

interface WishlistData {
  items: WishlistItem[];
  lastModified: Date;
}

export class WishlistMockService {
  private static instance: WishlistMockService;

  private constructor() {}

  static getInstance(): WishlistMockService {
    if (!WishlistMockService.instance) {
      WishlistMockService.instance = new WishlistMockService();
    }
    return WishlistMockService.instance;
  }

  private getStorageKey(_userId?: string): string {
    // For now, always use guest key since no auth is implemented
    // When auth is added, can use: return userId ? `${USER_WISHLIST_PREFIX}${userId}` : WISHLIST_STORAGE_KEY;
    return WISHLIST_STORAGE_KEY;
  }

  private loadWishlistData(userId?: string): WishlistData {
    if (typeof window === "undefined") {
      return { items: [], lastModified: new Date() };
    }

    const storageKey = this.getStorageKey(userId);
    const wishlistData = localStorage.getItem(storageKey);

    if (!wishlistData) {
      // Auto-populate with sample data if enabled and wishlist is empty
      if (AUTO_POPULATE_SETTINGS.wishlist) {
        return this.getDefaultSampleData();
      }
      return { items: [], lastModified: new Date() };
    }

    try {
      const parsed = JSON.parse(wishlistData);
      return {
        items: parsed.items || [],
        lastModified: new Date(parsed.lastModified || new Date()),
      };
    } catch (error) {
      if (process.env.NODE_ENV !== "production")
        console.error("Failed to load wishlist from localStorage:", error);
      return { items: [], lastModified: new Date() };
    }
  }

  private getDefaultSampleData(): WishlistData {
    const sampleData = mockDataUtils.initializeSampleWishlist();
    return {
      items: sampleData.items,
      lastModified: sampleData.lastModified,
    };
  }

  private saveWishlistData(wishlistData: WishlistData, userId?: string): void {
    if (typeof window === "undefined") return;

    const storageKey = this.getStorageKey(userId);

    try {
      const dataToSave = {
        ...wishlistData,
        lastModified: new Date(),
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    } catch (error) {
      if (process.env.NODE_ENV !== "production")
        console.error("Failed to save wishlist to localStorage:", error);
    }
  }

  getWishlist(userId?: string): WishlistItem[] {
    return this.loadWishlistData(userId).items;
  }

  addToWishlist(
    product: Product,
    userId?: string,
    notes?: string,
  ): WishlistOperationResult {
    const wishlistData = this.loadWishlistData(userId);

    // Check if item already exists
    const existingItem = wishlistData.items.find(
      (item) => item.product.id === product.id,
    );

    if (existingItem) {
      return {
        success: false,
        message: "Item already in wishlist",
        data: existingItem,
      };
    }

    // Create new wishlist item
    const newItem: WishlistItem = {
      id: `wishlist-${Date.now()}-${product.id}`,
      product,
      addedAt: new Date(),
      notes,
    };

    wishlistData.items.push(newItem);
    this.saveWishlistData(wishlistData, userId);

    return {
      success: true,
      message: `Added ${product.title} to wishlist`,
      data: newItem,
    };
  }

  removeFromWishlist(
    productId: string,
    userId?: string,
  ): WishlistOperationResult {
    const wishlistData = this.loadWishlistData(userId);
    const itemIndex = wishlistData.items.findIndex(
      (item) => item.product.id === productId,
    );

    if (itemIndex === -1) {
      return {
        success: false,
        message: "Item not found in wishlist",
      };
    }

    const removedItem = wishlistData.items[itemIndex];
    wishlistData.items.splice(itemIndex, 1);
    this.saveWishlistData(wishlistData, userId);

    return {
      success: true,
      message: `Removed ${removedItem.product.title} from wishlist`,
      data: removedItem,
    };
  }

  removeFromWishlistById(
    itemId: string,
    userId?: string,
  ): WishlistOperationResult {
    const wishlistData = this.loadWishlistData(userId);
    const itemIndex = wishlistData.items.findIndex(
      (item) => item.id === itemId,
    );

    if (itemIndex === -1) {
      return {
        success: false,
        message: "Item not found in wishlist",
      };
    }

    const removedItem = wishlistData.items[itemIndex];
    wishlistData.items.splice(itemIndex, 1);
    this.saveWishlistData(wishlistData, userId);

    return {
      success: true,
      message: `Removed ${removedItem.product.title} from wishlist`,
      data: removedItem,
    };
  }

  isInWishlist(productId: string, userId?: string): boolean {
    const wishlistData = this.loadWishlistData(userId);
    return wishlistData.items.some((item) => item.product.id === productId);
  }

  clearWishlist(userId?: string): WishlistOperationResult {
    const wishlistData: WishlistData = {
      items: [],
      lastModified: new Date(),
    };
    this.saveWishlistData(wishlistData, userId);

    return {
      success: true,
      message: "Wishlist cleared",
    };
  }

  updateNotes(
    productId: string,
    notes: string,
    userId?: string,
  ): WishlistOperationResult {
    const wishlistData = this.loadWishlistData(userId);
    const item = wishlistData.items.find(
      (item) => item.product.id === productId,
    );

    if (!item) {
      return {
        success: false,
        message: "Item not found in wishlist",
      };
    }

    item.notes = notes;
    this.saveWishlistData(wishlistData, userId);

    return {
      success: true,
      message: "Notes updated",
      data: item,
    };
  }

  moveToCart(
    productId: string,
    quantity: number = 1,
    userId?: string,
  ): WishlistOperationResult {
    const wishlistData = this.loadWishlistData(userId);
    const item = wishlistData.items.find(
      (item) => item.product.id === productId,
    );

    if (!item) {
      return {
        success: false,
        message: "Item not found in wishlist",
      };
    }

    // Try to add to cart
    const cartResult = cartMockService.addToCart(item.product, quantity);

    if (!cartResult.success) {
      return {
        success: false,
        message: `Failed to move to cart: ${cartResult.message}`,
        data: cartResult.data,
      };
    }

    // Remove from wishlist if successfully added to cart
    const removeResult = this.removeFromWishlist(productId, userId);

    return {
      success: true,
      message: `Moved ${item.product.title} to cart`,
      data: {
        cartItem: cartResult.data,
        removedWishlistItem: removeResult.data,
      },
    };
  }

  moveAllToCart(userId?: string): WishlistOperationResult {
    const wishlistData = this.loadWishlistData(userId);

    if (wishlistData.items.length === 0) {
      return {
        success: false,
        message: "Wishlist is empty",
      };
    }

    const results: MoveToCartResults = {
      successful: [],
      failed: [],
    };

    // Attempt to move each item to cart
    for (const item of wishlistData.items) {
      const cartResult = cartMockService.addToCart(item.product, 1);

      if (cartResult.success) {
        results.successful.push({
          product: item.product,
          cartItem: cartResult.data,
        });
      } else {
        results.failed.push({
          product: item.product,
          error: cartResult.message,
        });
      }
    }

    // Remove successfully moved items from wishlist
    if (results.successful.length > 0) {
      const successfulProductIds = results.successful.map((r) => r.product.id);
      wishlistData.items = wishlistData.items.filter(
        (item) => !successfulProductIds.includes(item.product.id),
      );
      this.saveWishlistData(wishlistData, userId);
    }

    const message =
      results.failed.length === 0
        ? `Moved all ${results.successful.length} items to cart`
        : `Moved ${results.successful.length} items to cart, ${results.failed.length} failed`;

    return {
      success: results.successful.length > 0,
      message,
      data: results,
    };
  }

  getWishlistSummary(userId?: string): WishlistSummary {
    const wishlistData = this.loadWishlistData(userId);

    const totalValue = wishlistData.items.reduce(
      (sum, item) => sum + item.product.price,
      0,
    );

    const categories = Array.from(
      new Set(wishlistData.items.map((item) => item.product.category.name)),
    );

    const averagePrice =
      wishlistData.items.length > 0
        ? totalValue / wishlistData.items.length
        : 0;

    return {
      items: wishlistData.items,
      itemCount: wishlistData.items.length,
      totalValue,
      categories,
      averagePrice,
    };
  }

  // Get items by category
  getItemsByCategory(categoryName: string, userId?: string): WishlistItem[] {
    const wishlistData = this.loadWishlistData(userId);
    return wishlistData.items.filter(
      (item) => item.product.category.name === categoryName,
    );
  }

  // Get items by price range
  getItemsByPriceRange(
    minPrice: number,
    maxPrice: number,
    userId?: string,
  ): WishlistItem[] {
    const wishlistData = this.loadWishlistData(userId);
    return wishlistData.items.filter(
      (item) =>
        item.product.price >= minPrice && item.product.price <= maxPrice,
    );
  }

  // Sort wishlist items
  sortWishlist(
    sortBy: "name" | "price-asc" | "price-desc" | "date-added" | "category",
    userId?: string,
  ): WishlistItem[] {
    const wishlistData = this.loadWishlistData(userId);

    const sortedItems = [...wishlistData.items].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.product.title.localeCompare(b.product.title);
        case "price-asc":
          return a.product.price - b.product.price;
        case "price-desc":
          return b.product.price - a.product.price;
        case "date-added":
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case "category":
          return a.product.category.name.localeCompare(b.product.category.name);
        default:
          return 0;
      }
    });

    return sortedItems;
  }

  // Share wishlist (returns shareable data)
  shareWishlist(userId?: string): WishlistOperationResult {
    const wishlistData = this.loadWishlistData(userId);

    if (wishlistData.items.length === 0) {
      return {
        success: false,
        message: "Cannot share empty wishlist",
      };
    }

    const shareData = {
      items: wishlistData.items.map((item) => ({
        id: item.id,
        productId: item.product.id,
        productName: item.product.title,
        price: item.product.price,
        image: item.product.images[0],
        addedAt: item.addedAt,
        notes: item.notes,
      })),
      summary: this.getWishlistSummary(userId),
      sharedAt: new Date(),
      shareId: `share-${Date.now()}`,
    };

    return {
      success: true,
      message: "Wishlist ready to share",
      data: shareData,
    };
  }

  // Load predefined sample data
  loadSampleData(userId?: string): WishlistOperationResult {
    const sampleData = this.getDefaultSampleData();
    this.saveWishlistData(sampleData, userId);

    return {
      success: true,
      message: "Sample wishlist data loaded",
      data: sampleData,
    };
  }

  // Load random sample data
  loadRandomSampleData(
    itemCount: number = 3,
    userId?: string,
  ): WishlistOperationResult {
    const randomItems = mockDataUtils.generateRandomWishlist(itemCount);
    const wishlistData: WishlistData = {
      items: randomItems,
      lastModified: new Date(),
    };

    this.saveWishlistData(wishlistData, userId);

    return {
      success: true,
      message: `Loaded ${itemCount} random items to wishlist`,
      data: wishlistData,
    };
  }

  // Check if wishlist has any sample data
  hasSampleData(userId?: string): boolean {
    const wishlistData = this.loadWishlistData(userId);
    return wishlistData.items.some(
      (item) => item.id.includes("sample") || item.id.includes("random"),
    );
  }

  // Reset to empty wishlist (useful for testing)
  resetToEmpty(userId?: string): WishlistOperationResult {
    const wishlistData: WishlistData = {
      items: [],
      lastModified: new Date(),
    };
    this.saveWishlistData(wishlistData, userId);

    return {
      success: true,
      message: "Wishlist reset to empty state",
    };
  }

  // Load sample data for specific category
  loadSampleDataByCategory(
    categorySlug: string,
    userId?: string,
  ): WishlistOperationResult {
    const categoryProducts = mockDataUtils.getProductsByCategory(categorySlug);

    if (categoryProducts.length === 0) {
      return {
        success: false,
        message: `No products found for category: ${categorySlug}`,
      };
    }

    const wishlistItems: WishlistItem[] = categoryProducts.map(
      (product, index) => ({
        id: `wishlist-category-${Date.now()}-${index}`,
        product,
        addedAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ),
        notes: `From ${categorySlug} category`,
      }),
    );

    const wishlistData: WishlistData = {
      items: wishlistItems,
      lastModified: new Date(),
    };

    this.saveWishlistData(wishlistData, userId);

    return {
      success: true,
      message: `Loaded ${wishlistItems.length} items from ${categorySlug} category`,
      data: wishlistData,
    };
  }
}

// Export singleton instance
export const wishlistMockService = WishlistMockService.getInstance();
