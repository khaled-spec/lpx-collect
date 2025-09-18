// API exports - Easy access to API functionality
export {
  getAPIFactory,
  getProductAPI,
  getCategoryAPI,
  getVendorAPI,
} from "./client";

export type {
  Product,
  Category,
  Vendor,
  ProductFilter,
  PaginatedResponse,
  ApiResponse,
  ApiError,
  IProductAPI,
  ICategoryAPI,
  IVendorAPI,
  IAPIFactory,
} from "./types";

export {
  mockProducts,
  mockVendors,
  mockCategories,
  filterProducts,
  paginateData,
} from "./mock";