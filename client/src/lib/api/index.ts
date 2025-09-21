// API exports - Easy access to API functionality
export {
  getAPIFactory,
  getCategoryAPI,
  getProductAPI,
  getVendorAPI,
} from "./client";
export {
  filterProducts,
  mockCategories,
  mockProducts,
  mockVendors,
  paginateData,
} from "./mock";
export type {
  ApiError,
  ApiResponse,
  Category,
  IAPIFactory,
  ICategoryAPI,
  IProductAPI,
  IVendorAPI,
  PaginatedResponse,
  Product,
  ProductFilter,
  Vendor,
} from "./types";
