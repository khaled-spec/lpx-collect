// API Client Factory - Central point for creating API instances
import { IAPIFactory, IProductAPI, ICategoryAPI, IVendorAPI } from "./types";
import { RealProductAPI, RealCategoryAPI, RealVendorAPI } from "./real";

// Real API Factory - Only implementation, no mock API
class RealAPIFactory implements IAPIFactory {
  private apiUrl: string;

  constructor(apiUrl: string = process.env.NEXT_PUBLIC_API_URL || "") {
    this.apiUrl = apiUrl;
  }

  createProductAPI(): IProductAPI {
    return new RealProductAPI(this.apiUrl);
  }

  createCategoryAPI(): ICategoryAPI {
    return new RealCategoryAPI(this.apiUrl);
  }

  createVendorAPI(): IVendorAPI {
    return new RealVendorAPI(this.apiUrl);
  }
}

// Factory singleton
let apiFactory: IAPIFactory;

// Get or create the API factory
export function getAPIFactory(): IAPIFactory {
  if (!apiFactory) {
    console.info("Using Real API implementation with MongoDB");
    apiFactory = new RealAPIFactory();
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
  ApiError,
} from "./types";
