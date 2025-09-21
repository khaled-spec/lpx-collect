// API Client Factory - Central point for creating API instances

import { MockCategoryAPI, MockProductAPI, MockVendorAPI } from "./mock";
import type {
  IAPIFactory,
  ICategoryAPI,
  IProductAPI,
  IVendorAPI,
} from "./types";

// Mock API Factory - Uses mock data instead of HTTP calls
class MockAPIFactory implements IAPIFactory {
  createProductAPI(): IProductAPI {
    return new MockProductAPI();
  }

  createCategoryAPI(): ICategoryAPI {
    return new MockCategoryAPI();
  }

  createVendorAPI(): IVendorAPI {
    return new MockVendorAPI();
  }
}

// Factory singleton
let apiFactory: IAPIFactory;

// Get or create the API factory
export function getAPIFactory(): IAPIFactory {
  if (!apiFactory) {
    if (process.env.NODE_ENV !== "production")
      console.log("🏠 Creating new MockAPIFactory instance");
    if (process.env.NODE_ENV !== "production")
      console.info("Using Mock API implementation with static data");
    apiFactory = new MockAPIFactory();
    if (process.env.NODE_ENV !== "production")
      console.log("✅ MockAPIFactory created:", apiFactory);
  } else {
    if (process.env.NODE_ENV !== "production")
      console.log("🔄 Reusing existing APIFactory instance");
  }
  return apiFactory;
}

// Convenience functions to get specific API instances
export function getProductAPI(): IProductAPI {
  return getAPIFactory().createProductAPI();
}

export function getCategoryAPI(): ICategoryAPI {
  return getAPIFactory().createCategoryAPI();
}

export function getVendorAPI(): IVendorAPI {
  if (process.env.NODE_ENV !== "production")
    console.log("🏢 getVendorAPI() called");
  const factory = getAPIFactory();
  if (process.env.NODE_ENV !== "production")
    console.log("🏠 Got factory, creating vendor API...");
  const vendorAPI = factory.createVendorAPI();
  if (process.env.NODE_ENV !== "production")
    console.log("✅ VendorAPI created:", vendorAPI);
  return vendorAPI;
}

// Export types for convenience
export type {
  ApiError,
  ApiResponse,
  Category,
  PaginatedResponse,
  Product,
  ProductFilter,
  Vendor,
} from "./types";
