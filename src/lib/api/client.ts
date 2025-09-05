// API Client Factory - Central point for creating API instances
import { IAPIFactory, IProductAPI, ICategoryAPI, IVendorAPI } from "./types";
import { MockProductAPI, MockCategoryAPI, MockVendorAPI } from "./mock";

// Environment variable or config to determine which implementation to use
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false"; // Default to mock

// Mock API Factory
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

// Real API Factory (to be implemented when backend is ready)
class RealAPIFactory implements IAPIFactory {
  private apiUrl: string;

  constructor(apiUrl: string = process.env.NEXT_PUBLIC_API_URL || "") {
    this.apiUrl = apiUrl;
  }

  createProductAPI(): IProductAPI {
    // When ready, return new RealProductAPI(this.apiUrl);
    // For now, fall back to mock
    console.warn("Real Product API not implemented, using mock");
    return new MockProductAPI();
  }

  createCategoryAPI(): ICategoryAPI {
    // When ready, return new RealCategoryAPI(this.apiUrl);
    // For now, fall back to mock
    console.warn("Real Category API not implemented, using mock");
    return new MockCategoryAPI();
  }

  createVendorAPI(): IVendorAPI {
    // When ready, return new RealVendorAPI(this.apiUrl);
    // For now, fall back to mock
    console.warn("Real Vendor API not implemented, using mock");
    return new MockVendorAPI();
  }
}

// Factory singleton
let apiFactory: IAPIFactory;

// Get or create the API factory
export function getAPIFactory(): IAPIFactory {
  if (!apiFactory) {
    if (USE_MOCK_API) {
      console.info("Using Mock API implementation");
      apiFactory = new MockAPIFactory();
    } else {
      console.info("Using Real API implementation");
      apiFactory = new RealAPIFactory();
    }
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
  return getAPIFactory().createVendorAPI();
}

// Export types for convenience
export type { 
  Product, 
  Category, 
  Vendor, 
  ProductFilter, 
  PaginatedResponse,
  ApiResponse,
  ApiError 
} from "./types";