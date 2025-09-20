// Mock Cart Service
export {
  CartMockService,
  cartMockService,
  type CartOperationResult,
  type CartSummary,
  type CouponResult,
} from "./cart";

// Mock Wishlist Service
export {
  WishlistMockService,
  wishlistMockService,
  type WishlistOperationResult,
  type WishlistItem,
  type WishlistSummary,
} from "./wishlist";

// Import for local use
import { cartMockService } from "./cart";
import { wishlistMockService } from "./wishlist";
import { AUTO_POPULATE_SETTINGS, DEMO_MODE } from "./data";

// Console utilities for development
export { setupGlobalMockUtils } from "./console-utils";

// Mock Data and Utilities
export {
  mockProducts,
  mockCategories,
  mockVendors,
  sampleCartItems,
  sampleWishlistItems,
  mockDataUtils,
  AUTO_POPULATE_SETTINGS,
  DEMO_MODE,
} from "./data";

// Re-export for convenience
export const mockServices = {
  cart: cartMockService,
  wishlist: wishlistMockService,
};

// Enhanced utility functions for testing and demo purposes
export const mockUtils = {
  // Cart utilities
  getAvailableCoupons: () => cartMockService.getAvailableCoupons(),
  loadSampleCart: () => cartMockService.loadSampleData(),
  loadRandomCart: (itemCount?: number) => cartMockService.loadRandomSampleData(itemCount),
  clearCart: () => cartMockService.clearCart(),
  resetCartToEmpty: () => cartMockService.resetToEmpty(),

  // Wishlist utilities
  loadSampleWishlist: (userId?: string) => wishlistMockService.loadSampleData(userId),
  loadRandomWishlist: (itemCount?: number, userId?: string) => wishlistMockService.loadRandomSampleData(itemCount, userId),
  loadWishlistByCategory: (categorySlug: string, userId?: string) => wishlistMockService.loadSampleDataByCategory(categorySlug, userId),
  clearWishlist: (userId?: string) => wishlistMockService.clearWishlist(userId),
  resetWishlistToEmpty: (userId?: string) => wishlistMockService.resetToEmpty(userId),

  // Combined utilities
  loadAllSampleData: () => {
    const cartResult = cartMockService.loadSampleData();
    const wishlistResult = wishlistMockService.loadSampleData();
    return {
      cart: cartResult,
      wishlist: wishlistResult,
      success: cartResult.success && wishlistResult.success,
      message: `Cart: ${cartResult.message}, Wishlist: ${wishlistResult.message}`,
    };
  },

  resetAllData: () => {
    const cartResult = cartMockService.resetToEmpty();
    const wishlistResult = wishlistMockService.resetToEmpty();
    return {
      cart: cartResult,
      wishlist: wishlistResult,
      success: cartResult.success && wishlistResult.success,
      message: 'All mock data has been reset',
    };
  },

  // Get combined summary
  getCombinedSummary: () => {
    return {
      cart: cartMockService.getCartSummary(),
      wishlist: wishlistMockService.getWishlistSummary(),
      timestamp: new Date(),
    };
  },

  // Status check utilities
  getSampleDataStatus: () => {
    return {
      cart: {
        hasSampleData: cartMockService.hasSampleData(),
        itemCount: cartMockService.getCartSummary().itemCount,
        total: cartMockService.getCartSummary().total,
      },
      wishlist: {
        hasSampleData: wishlistMockService.hasSampleData(),
        itemCount: wishlistMockService.getWishlistSummary().itemCount,
        totalValue: wishlistMockService.getWishlistSummary().totalValue,
      },
      autoPopulate: AUTO_POPULATE_SETTINGS,
      demoMode: DEMO_MODE,
    };
  },

  // Quick setup for demos
  quickDemoSetup: () => {
    console.log('🚀 Setting up demo data...');

    const cartResult = cartMockService.loadSampleData();
    const wishlistResult = wishlistMockService.loadSampleData();

    console.log('✅ Demo data loaded:');
    console.log(`  Cart: ${cartResult.message}`);
    console.log(`  Wishlist: ${wishlistResult.message}`);

    return {
      cart: cartResult,
      wishlist: wishlistResult,
      success: cartResult.success && wishlistResult.success,
    };
  },

  // Development helpers
  dev: {
    logCartContents: () => {
      const summary = cartMockService.getCartSummary();
      console.table(summary.items.map(item => ({
        id: item.id,
        product: item.product.title,
        quantity: item.quantity,
        price: `$${item.product.price}`,
        total: `$${item.product.price * item.quantity}`,
      })));
      console.log(`💰 Cart Total: $${summary.total.toFixed(2)}`);
    },

    logWishlistContents: () => {
      const summary = wishlistMockService.getWishlistSummary();
      console.table(summary.items.map(item => ({
        id: item.id,
        product: item.product.title,
        price: `$${item.product.price}`,
        category: item.product.category.name,
        addedAt: item.addedAt.toLocaleDateString(),
      })));
      console.log(`❤️ Wishlist Total Value: $${summary.totalValue.toFixed(2)}`);
    },

    logAllData: () => {
      console.log('🛒 CART CONTENTS:');
      mockUtils.dev.logCartContents();
      console.log('\n❤️ WISHLIST CONTENTS:');
      mockUtils.dev.logWishlistContents();
    },

    // Debug utilities
    inspectServices: () => {
      const cartSummary = cartMockService.getCartSummary();
      const wishlistSummary = wishlistMockService.getWishlistSummary();

      console.log('🔍 Mock Service Inspection:');
      console.table({
        'Cart Items': cartSummary.itemCount,
        'Cart Total': `$${cartSummary.total.toFixed(2)}`,
        'Cart Has Sample Data': cartMockService.hasSampleData(),
        'Wishlist Items': wishlistSummary.itemCount,
        'Wishlist Total Value': `$${wishlistSummary.totalValue.toFixed(2)}`,
        'Wishlist Has Sample Data': wishlistMockService.hasSampleData(),
        'Demo Mode': DEMO_MODE,
        'Auto Populate Cart': AUTO_POPULATE_SETTINGS.cart,
        'Auto Populate Wishlist': AUTO_POPULATE_SETTINGS.wishlist,
      });

      return {
        cart: cartSummary,
        wishlist: wishlistSummary,
        settings: AUTO_POPULATE_SETTINGS,
        demoMode: DEMO_MODE,
      };
    },

    // Test all mock functions
    runTests: () => {
      console.log('🧪 Running Mock Data Tests...');

      const tests = [
        {
          name: 'Load Sample Cart',
          test: () => cartMockService.loadSampleData().success,
        },
        {
          name: 'Load Sample Wishlist',
          test: () => wishlistMockService.loadSampleData().success,
        },
        {
          name: 'Clear Cart',
          test: () => cartMockService.clearCart().success,
        },
        {
          name: 'Clear Wishlist',
          test: () => wishlistMockService.clearWishlist().success,
        },
        {
          name: 'Load Random Cart',
          test: () => cartMockService.loadRandomSampleData(2).success,
        },
        {
          name: 'Load Random Wishlist',
          test: () => wishlistMockService.loadRandomSampleData(3).success,
        },
      ];

      const results = tests.map(({ name, test }) => ({
        Test: name,
        Result: test() ? '✅ PASS' : '❌ FAIL',
      }));

      console.table(results);
      return results;
    },

    // Performance check
    performanceCheck: () => {
      console.time('Cart Operations');
      cartMockService.loadSampleData();
      cartMockService.getCartSummary();
      cartMockService.clearCart();
      console.timeEnd('Cart Operations');

      console.time('Wishlist Operations');
      wishlistMockService.loadSampleData();
      wishlistMockService.getWishlistSummary();
      wishlistMockService.clearWishlist();
      console.timeEnd('Wishlist Operations');
    },
  },
};