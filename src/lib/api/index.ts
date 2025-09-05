// Main API export file - Single entry point for all API functionality

// Export the main API client functions
export {
  getAPIFactory,
  getProductAPI,
  getCategoryAPI,
  getVendorAPI
} from "./client";

// Export all types
export type {
  // Core data types
  Product,
  Category,
  Vendor,
  
  // Filter and pagination types
  ProductFilter,
  PaginatedResponse,
  
  // Response types
  ApiResponse,
  ApiError,
  
  // API interfaces (useful for testing or custom implementations)
  IProductAPI,
  ICategoryAPI,
  IVendorAPI,
  IAPIFactory
} from "./types";

// Re-export mock implementations if needed for testing
export { MockProductAPI, MockCategoryAPI, MockVendorAPI } from "./mock";