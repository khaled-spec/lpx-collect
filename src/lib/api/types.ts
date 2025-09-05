// API Types and Interfaces for the data layer abstraction

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  categorySlug: string;
  vendor: string;
  vendorId: string;
  rating: number;
  reviews: number;
  stock: number;
  condition?: "mint" | "near-mint" | "excellent" | "good" | "fair" | "poor";
  rarity?: "common" | "uncommon" | "rare" | "ultra-rare" | "legendary";
  year?: number;
  manufacturer?: string;
  authenticity?: {
    verified: boolean;
    certificate?: string;
    verifiedBy?: string;
    verificationDate?: string;
  };
  specifications?: Record<string, string>;
  tags?: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  conditions?: string[];
  rarities?: string[];
  vendors?: string[];
  inStock?: boolean;
  featured?: boolean;
  searchQuery?: string;
  sortBy?: "newest" | "price-asc" | "price-desc" | "rating" | "popular";
  limit?: number;
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
  getProducts(filter?: ProductFilter): Promise<ApiResponse<PaginatedResponse<Product>>>;
  getProductById(id: string): Promise<ApiResponse<Product>>;
  getProductsByCategory(categorySlug: string, filter?: ProductFilter): Promise<ApiResponse<PaginatedResponse<Product>>>;
  getFeaturedProducts(limit?: number): Promise<ApiResponse<Product[]>>;
  getRelatedProducts(productId: string, limit?: number): Promise<ApiResponse<Product[]>>;
  searchProducts(query: string, filter?: ProductFilter): Promise<ApiResponse<PaginatedResponse<Product>>>;
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
  logo: string;
  banner?: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  verified: boolean;
  joinedDate: string;
  specialties: string[];
  location?: {
    city: string;
    state: string;
    country: string;
  };
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
}

export interface IVendorAPI {
  getVendors(filter?: { featured?: boolean; verified?: boolean }): Promise<ApiResponse<Vendor[]>>;
  getVendorById(id: string): Promise<ApiResponse<Vendor>>;
  getVendorBySlug(slug: string): Promise<ApiResponse<Vendor>>;
  getVendorProducts(vendorId: string, filter?: ProductFilter): Promise<ApiResponse<PaginatedResponse<Product>>>;
}

// Factory interface for creating API instances
export interface IAPIFactory {
  createProductAPI(): IProductAPI;
  createCategoryAPI(): ICategoryAPI;
  createVendorAPI(): IVendorAPI;
}