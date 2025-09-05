// Mock API implementations
import {
  IProductAPI,
  ICategoryAPI,
  IVendorAPI,
  Product,
  Category,
  Vendor,
  ProductFilter,
  PaginatedResponse,
  ApiResponse
} from "../types";
import { mockProducts, mockCategories, mockVendors } from "./mockData";

// Utility function to simulate API delay
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Product API Implementation
export class MockProductAPI implements IProductAPI {
  private products = mockProducts;

  async getProducts(filter?: ProductFilter): Promise<ApiResponse<PaginatedResponse<Product>>> {
    await delay();
    
    try {
      let filtered = [...this.products];

      // Apply filters
      if (filter) {
        if (filter.category) {
          filtered = filtered.filter(p => 
            p.categorySlug === filter.category || p.category.toLowerCase() === filter.category?.toLowerCase()
          );
        }
        
        if (filter.minPrice !== undefined) {
          filtered = filtered.filter(p => p.price >= filter.minPrice!);
        }
        
        if (filter.maxPrice !== undefined) {
          filtered = filtered.filter(p => p.price <= filter.maxPrice!);
        }
        
        if (filter.conditions && filter.conditions.length > 0) {
          filtered = filtered.filter(p => filter.conditions!.includes(p.condition!));
        }
        
        if (filter.rarities && filter.rarities.length > 0) {
          filtered = filtered.filter(p => filter.rarities!.includes(p.rarity!));
        }
        
        if (filter.vendors && filter.vendors.length > 0) {
          filtered = filtered.filter(p => filter.vendors!.includes(p.vendor));
        }
        
        if (filter.inStock) {
          filtered = filtered.filter(p => p.stock > 0);
        }
        
        if (filter.featured) {
          filtered = filtered.filter(p => p.featured);
        }
        
        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.tags?.some(tag => tag.toLowerCase().includes(query))
          );
        }

        // Apply sorting
        if (filter.sortBy) {
          switch (filter.sortBy) {
            case "newest":
              filtered.sort((a, b) => 
                new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
              );
              break;
            case "price-asc":
              filtered.sort((a, b) => a.price - b.price);
              break;
            case "price-desc":
              filtered.sort((a, b) => b.price - a.price);
              break;
            case "rating":
              filtered.sort((a, b) => b.rating - a.rating);
              break;
            case "popular":
              filtered.sort((a, b) => b.reviews - a.reviews);
              break;
          }
        }
      }

      // Apply pagination
      const limit = filter?.limit || 20;
      const offset = filter?.offset || 0;
      const paginatedData = filtered.slice(offset, offset + limit);
      const page = Math.floor(offset / limit) + 1;

      return {
        success: true,
        data: {
          data: paginatedData,
          total: filtered.length,
          page,
          pageSize: limit,
          hasNext: offset + limit < filtered.length,
          hasPrevious: offset > 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch products",
          details: error
        }
      };
    }
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    await delay();
    
    const product = this.products.find(p => p.id === id);
    
    if (!product) {
      return {
        success: false,
        error: {
          message: "Product not found",
          code: "PRODUCT_NOT_FOUND",
          status: 404
        }
      };
    }

    return {
      success: true,
      data: product
    };
  }

  async getProductsByCategory(
    categorySlug: string,
    filter?: ProductFilter
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const categoryFilter = { ...filter, category: categorySlug };
    return this.getProducts(categoryFilter);
  }

  async getFeaturedProducts(limit: number = 8): Promise<ApiResponse<Product[]>> {
    await delay();
    
    try {
      const featured = this.products
        .filter(p => p.featured)
        .slice(0, limit);

      return {
        success: true,
        data: featured
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch featured products",
          details: error
        }
      };
    }
  }

  async getRelatedProducts(productId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    await delay();
    
    try {
      const product = this.products.find(p => p.id === productId);
      
      if (!product) {
        return {
          success: false,
          error: {
            message: "Product not found",
            code: "PRODUCT_NOT_FOUND",
            status: 404
          }
        };
      }

      // Find related products from same category
      const related = this.products
        .filter(p => 
          p.id !== productId && 
          (p.categorySlug === product.categorySlug || p.category === product.category)
        )
        .sort(() => Math.random() - 0.5) // Randomize
        .slice(0, limit);

      return {
        success: true,
        data: related
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch related products",
          details: error
        }
      };
    }
  }

  async searchProducts(query: string, filter?: ProductFilter): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const searchFilter = { ...filter, searchQuery: query };
    return this.getProducts(searchFilter);
  }
}

// Mock Category API Implementation
export class MockCategoryAPI implements ICategoryAPI {
  private categories = mockCategories;

  async getCategories(): Promise<ApiResponse<Category[]>> {
    await delay();
    
    try {
      return {
        success: true,
        data: this.categories
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch categories",
          details: error
        }
      };
    }
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    await delay();
    
    // Check main categories
    let category = this.categories.find(c => c.slug === slug);
    
    // Check subcategories if not found in main
    if (!category) {
      for (const mainCat of this.categories) {
        if (mainCat.subcategories) {
          const subCat = mainCat.subcategories.find(sc => sc.slug === slug);
          if (subCat) {
            category = { ...subCat, parent: mainCat.slug };
            break;
          }
        }
      }
    }
    
    if (!category) {
      return {
        success: false,
        error: {
          message: "Category not found",
          code: "CATEGORY_NOT_FOUND",
          status: 404
        }
      };
    }

    return {
      success: true,
      data: category
    };
  }

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    await delay();
    
    // Check main categories
    let category = this.categories.find(c => c.id === id);
    
    // Check subcategories if not found in main
    if (!category) {
      for (const mainCat of this.categories) {
        if (mainCat.subcategories) {
          const subCat = mainCat.subcategories.find(sc => sc.id === id);
          if (subCat) {
            category = subCat;
            break;
          }
        }
      }
    }
    
    if (!category) {
      return {
        success: false,
        error: {
          message: "Category not found",
          code: "CATEGORY_NOT_FOUND",
          status: 404
        }
      };
    }

    return {
      success: true,
      data: category
    };
  }

  async getSubcategories(parentSlug: string): Promise<ApiResponse<Category[]>> {
    await delay();
    
    try {
      const parent = this.categories.find(c => c.slug === parentSlug);
      
      if (!parent) {
        return {
          success: false,
          error: {
            message: "Parent category not found",
            code: "CATEGORY_NOT_FOUND",
            status: 404
          }
        };
      }

      return {
        success: true,
        data: parent.subcategories || []
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch subcategories",
          details: error
        }
      };
    }
  }

  async getFeaturedCategories(): Promise<ApiResponse<Category[]>> {
    await delay();
    
    try {
      const featured = this.categories.filter(c => c.featured);
      
      return {
        success: true,
        data: featured
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch featured categories",
          details: error
        }
      };
    }
  }
}

// Mock Vendor API Implementation
export class MockVendorAPI implements IVendorAPI {
  private vendors = mockVendors;
  private products = mockProducts;

  async getVendors(filter?: { featured?: boolean; verified?: boolean }): Promise<ApiResponse<Vendor[]>> {
    await delay();
    
    try {
      let filtered = [...this.vendors];
      
      if (filter) {
        if (filter.verified !== undefined) {
          filtered = filtered.filter(v => v.verified === filter.verified);
        }
      }

      return {
        success: true,
        data: filtered
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch vendors",
          details: error
        }
      };
    }
  }

  async getVendorById(id: string): Promise<ApiResponse<Vendor>> {
    await delay();
    
    const vendor = this.vendors.find(v => v.id === id);
    
    if (!vendor) {
      return {
        success: false,
        error: {
          message: "Vendor not found",
          code: "VENDOR_NOT_FOUND",
          status: 404
        }
      };
    }

    return {
      success: true,
      data: vendor
    };
  }

  async getVendorBySlug(slug: string): Promise<ApiResponse<Vendor>> {
    await delay();
    
    const vendor = this.vendors.find(v => v.slug === slug);
    
    if (!vendor) {
      return {
        success: false,
        error: {
          message: "Vendor not found",
          code: "VENDOR_NOT_FOUND",
          status: 404
        }
      };
    }

    return {
      success: true,
      data: vendor
    };
  }

  async getVendorProducts(vendorId: string, filter?: ProductFilter): Promise<ApiResponse<PaginatedResponse<Product>>> {
    await delay();
    
    try {
      const vendor = this.vendors.find(v => v.id === vendorId);
      
      if (!vendor) {
        return {
          success: false,
          error: {
            message: "Vendor not found",
            code: "VENDOR_NOT_FOUND",
            status: 404
          }
        };
      }

      const vendorProducts = this.products.filter(p => p.vendorId === vendorId);
      const vendorFilter = { ...filter, vendors: [vendor.name] };
      
      // Use the MockProductAPI to handle filtering and pagination
      const productAPI = new MockProductAPI();
      return productAPI.getProducts(vendorFilter);
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch vendor products",
          details: error
        }
      };
    }
  }
}