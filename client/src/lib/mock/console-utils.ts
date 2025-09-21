// Browser console utilities for testing mock data
import { cartMockService, mockUtils, wishlistMockService } from "./index";

// Extend Window interface for development utilities
declare global {
  interface Window {
    mockUtils: typeof mockUtils & {
      demo: () => unknown;
      cart: typeof cartMockService;
      wishlist: typeof wishlistMockService;
    };
    loadMockData: () => unknown;
    clearMockData: () => void;
  }
}

// Make utilities globally available in development
export const setupGlobalMockUtils = () => {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") {
    return;
  }

  // Global mock utilities
  window.mockUtils = {
    ...mockUtils,

    // Quick actions
    demo: () => {
      if (process.env.NODE_ENV !== "production")
        console.log("🚀 Setting up demo data...");
      return mockUtils.quickDemoSetup();
    },

    status: () => {
      const status = mockUtils.getSampleDataStatus();
      if (process.env.NODE_ENV !== "production")
        console.log("📊 Mock Data Status:");
      if (process.env.NODE_ENV !== "production") console.table(status);
      return status;
    },

    cart: {
      load: () => {
        const result = mockUtils.loadSampleCart();
        if (process.env.NODE_ENV !== "production")
          console.log("🛒", result.message);
        return result;
      },

      random: (count = 2) => {
        const result = mockUtils.loadRandomCart(count);
        if (process.env.NODE_ENV !== "production")
          console.log("🛒", result.message);
        return result;
      },

      clear: () => {
        const result = mockUtils.clearCart();
        if (process.env.NODE_ENV !== "production")
          console.log("🛒", result.message);
        return result;
      },

      reset: () => {
        const result = mockUtils.resetCartToEmpty();
        if (process.env.NODE_ENV !== "production")
          console.log("🛒", result.message);
        return result;
      },

      show: () => {
        if (process.env.NODE_ENV !== "production")
          console.log("🛒 Current Cart Contents:");
        mockUtils.dev.logCartContents();
      },

      summary: () => {
        const summary = cartMockService.getCartSummary();
        if (process.env.NODE_ENV !== "production")
          console.log("🛒 Cart Summary:");
        if (process.env.NODE_ENV !== "production")
          console.table({
            "Item Count": summary.itemCount,
            Subtotal: `$${summary.subtotal.toFixed(2)}`,
            Shipping: `$${summary.shipping.toFixed(2)}`,
            Tax: `$${summary.tax.toFixed(2)}`,
            Discount: `$${summary.discount.toFixed(2)}`,
            Total: `$${summary.total.toFixed(2)}`,
            Coupon: summary.couponCode || "None",
          });
        return summary;
      },
    },

    wishlist: {
      load: () => {
        const result = mockUtils.loadSampleWishlist();
        if (process.env.NODE_ENV !== "production")
          console.log("❤️", result.message);
        return result;
      },

      random: (count = 3) => {
        const result = mockUtils.loadRandomWishlist(count);
        if (process.env.NODE_ENV !== "production")
          console.log("❤️", result.message);
        return result;
      },

      clear: () => {
        const result = mockUtils.clearWishlist();
        if (process.env.NODE_ENV !== "production")
          console.log("❤️", result.message);
        return result;
      },

      reset: () => {
        const result = mockUtils.resetWishlistToEmpty();
        if (process.env.NODE_ENV !== "production")
          console.log("❤️", result.message);
        return result;
      },

      show: () => {
        if (process.env.NODE_ENV !== "production")
          console.log("❤️ Current Wishlist Contents:");
        mockUtils.dev.logWishlistContents();
      },

      summary: () => {
        const summary = wishlistMockService.getWishlistSummary();
        if (process.env.NODE_ENV !== "production")
          console.log("❤️ Wishlist Summary:");
        if (process.env.NODE_ENV !== "production")
          console.table({
            "Item Count": summary.itemCount,
            "Total Value": `$${summary.totalValue.toFixed(2)}`,
            "Average Price": `$${summary.averagePrice.toFixed(2)}`,
            Categories: summary.categories.join(", "),
          });
        return summary;
      },

      byCategory: (category: string) => {
        const result = mockUtils.loadWishlistByCategory(category);
        if (process.env.NODE_ENV !== "production")
          console.log("❤️", result.message);
        return result;
      },
    },

    // Help function
    help: () => {
      if (process.env.NODE_ENV !== "production")
        console.log(`
🎯 Mock Data Console Utilities

Quick Actions:
  mockUtils.demo()           - Load all sample data
  mockUtils.status()         - Show current status

Cart:
  mockUtils.cart.load()      - Load sample cart
  mockUtils.cart.random(2)   - Load 2 random items
  mockUtils.cart.clear()     - Clear cart
  mockUtils.cart.reset()     - Reset to empty
  mockUtils.cart.show()      - Show cart contents
  mockUtils.cart.summary()   - Show cart summary

Wishlist:
  mockUtils.wishlist.load()           - Load sample wishlist
  mockUtils.wishlist.random(3)        - Load 3 random items
  mockUtils.wishlist.clear()          - Clear wishlist
  mockUtils.wishlist.reset()          - Reset to empty
  mockUtils.wishlist.show()           - Show wishlist contents
  mockUtils.wishlist.summary()        - Show wishlist summary
  mockUtils.wishlist.byCategory('trading-cards') - Load by category

Development:
  mockUtils.dev.logAllData() - Show all data
  mockUtils.help()           - Show this help
      `);
    },
  };

  // Also add shortcuts
  window.loadMockData = () => window.mockUtils.demo();
  window.clearMockData = () => {
    window.mockUtils.cart.clear();
    window.mockUtils.wishlist.clear();
  };

  if (process.env.NODE_ENV !== "production")
    console.log(`
🎯 Mock Data Utilities Loaded!

Quick start:
  mockUtils.demo()    - Load all sample data
  mockUtils.help()    - Show all commands
  mockUtils.status()  - Check current status

Shortcuts:
  loadMockData()      - Quick load all data
  clearMockData()     - Quick clear all data
  `);
};

// Auto-setup in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Setup after a short delay to ensure services are initialized
  setTimeout(setupGlobalMockUtils, 100);
}
