// API Client Factory - Central point for creating API instances
import { IAPIFactory, IProductAPI, ICategoryAPI, IVendorAPI } from "./types";
import { MockProductAPI, MockCategoryAPI, MockVendorAPI } from "./mock";

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
    console.log("🏠 Creating new MockAPIFactory instance");
    console.info("Using Mock API implementation with static data");
    apiFactory = new MockAPIFactory();
    console.log("✅ MockAPIFactory created:", apiFactory);
  } else {
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
  console.log("🏢 getVendorAPI() called");
  const factory = getAPIFactory();
  console.log("🏠 Got factory, creating vendor API...");
  const vendorAPI = factory.createVendorAPI();
  console.log("✅ VendorAPI created:", vendorAPI);
  return vendorAPI;
}

// Export types for convenience
export type {
  Product,
  Category,
  Vendor,
  ProductFilter,
  PaginatedResponse,
  ApiResponse,
  ApiError,
} from "./types";