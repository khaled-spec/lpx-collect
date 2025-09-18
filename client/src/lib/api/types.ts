// API Types and Interfaces for the data layer abstraction

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  category: string;
  categorySlug: string;
  vendor: string;
  vendorId: string;
  stock: number;
  state: "sealed" | "open";  // Product state: sealed or open
  condition?: string;  // For open/raw products - conditions like mint, near-mint, etc.
  grading?: {
    company: string;  // PSA, CGC, BGS, etc.
    grade: string;    // 10, 9.5, BGS 9, etc.
    certificate?: string;
  };
  cardNumber?: string;  // For card games
  views: number;
  rating: number;
  reviewCount: number;
  year: number;
  manufacturer: string;
  authenticity?: {
    verified: boolean;
    certificate?: string;
    verifiedBy?: string;
    verificationDate?: string;
  };
  specifications?: Record<string, string>;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  parent?: string;
  subcategories?: Category[];
  productCount: number;
  featured?: boolean;
  order?: number;
}

export interface ProductFilter {
  categoryId?: string;  // Category ID for filtering
  category?: string;  // Category slug for filtering
  subcategory?: string;
  vendorId?: string;  // Vendor ID for filtering
  minPrice?: number;
  maxPrice?: number;
  condition?: string;  // Single condition filter
  conditions?: string[];  // Multiple conditions
  rarity?: string;  // Single rarity filter
  rarities?: string[];  // Multiple rarities
  vendors?: string[];
  inStock?: boolean;
  featured?: boolean;
  search?: string;  // Search query
  searchQuery?: string;  // Alternative search query
  sortBy?: "newest" | "price-asc" | "price-desc" | "rating" | "popular" | "featured" | "name";
  limit?: number;
  page?: number;  // Page number for pagination
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

// API Service Interfaces
export interface IProductAPI {
  getProducts(
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>>;
  getProductById(id: string): Promise<ApiResponse<Product>>;
  getProductsByCategory(
    categorySlug: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>>;
  getFeaturedProducts(limit?: number): Promise<ApiResponse<Product[]>>;
  getRelatedProducts(
    productId: string,
    limit?: number,
  ): Promise<ApiResponse<Product[]>>;
  searchProducts(
    query: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>>;
}

export interface ICategoryAPI {
  getCategories(): Promise<ApiResponse<Category[]>>;
  getCategoryBySlug(slug: string): Promise<ApiResponse<Category>>;
  getCategoryById(id: string): Promise<ApiResponse<Category>>;
  getSubcategories(parentSlug: string): Promise<ApiResponse<Category[]>>;
  getFeaturedCategories(): Promise<ApiResponse<Category[]>>;
}

// Vendor types for completeness
export interface Vendor {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatar?: string;  // Avatar URL
  logo?: string;
  banner?: string;
  rating: number;
  totalSales?: number;
  reviewCount?: number;
  productCount?: number;
  totalProducts?: number;
  responseTime?: string;
  shippingInfo?: string;
  returnPolicy?: string;
  verified: boolean;
  featured?: boolean;
  joinedDate: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  } | string;  // Support both object and string formats
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  specialties?: string[];
  policies?: {
    shipping: string;
    returns: string;
    authenticity: string;
  };
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  joinedAt?: Date;
}

export interface IVendorAPI {
  getVendors(filter?: {
    featured?: boolean;
    verified?: boolean;
  }): Promise<ApiResponse<Vendor[]>>;
  getVendorById(id: string): Promise<ApiResponse<Vendor>>;
  getVendorBySlug(slug: string): Promise<ApiResponse<Vendor>>;
  getVendorProducts(
    vendorId: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>>;
}

// Factory interface for creating API instances
export interface IAPIFactory {
  createProductAPI(): IProductAPI;
  createCategoryAPI(): ICategoryAPI;
  createVendorAPI(): IVendorAPI;
}