// Unified export for all mock data and APIs

// Shared data exports
export * from "./shared/categories";
export * from "./shared/vendors";
export * from "./shared/products";
export * from "./shared/addresses";
export * from "./shared/utils";

// Page-specific data exports
export * from "./pages/vendor-dashboard";

// API implementation exports
export { MockProductAPI } from "./api/product-api";
export { MockCategoryAPI } from "./api/category-api";
export { MockVendorAPI } from "./api/vendor-api";