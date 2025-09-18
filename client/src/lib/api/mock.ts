// Mock API implementations - returns data from mock arrays instead of HTTP calls
import {
  IProductAPI,
  ICategoryAPI,
  IVendorAPI,
  Product,
  Category,
  Vendor,
  ProductFilter,
  PaginatedResponse,
  ApiResponse,
} from "./types";
// Mock data for UAE-based collectibles marketplace
const mockCategories = [
  {
    id: "cat-1",
    name: "Trading Cards",
    slug: "trading-cards",
    description: "Rare and collectible trading cards including Pokémon, sports cards, and gaming cards",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
    icon: "🃏",
    productCount: 3,
    featured: true,
    order: 1,
  },
  {
    id: "cat-2",
    name: "Comics",
    slug: "comics",
    description: "Rare comics, graphic novels, and manga from around the world",
    image: "https://images.unsplash.com/photo-1578663287732-a3985e772b6b?w=500&h=300&fit=crop",
    icon: "📚",
    productCount: 3,
    featured: true,
    order: 2,
  },
];

const mockVendors = [
  {
    id: "vendor-1",
    name: "Emirates Card Exchange",
    slug: "emirates-card-exchange",
    description: "Dubai's premier destination for rare and authentic trading cards. Specializing in Pokémon, sports cards, and gaming collectibles with over 10 years of experience in the UAE market.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop",
    banner: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=200&fit=crop",
    rating: 4.8,
    totalSales: 1250,
    reviewCount: 89,
    productCount: 3,
    totalProducts: 3,
    responseTime: "Within 2 hours",
    shippingInfo: "Free shipping across UAE for orders above 200 AED",
    returnPolicy: "30-day return policy for authentic items",
    verified: true,
    featured: true,
    joinedDate: "2019-03-15",
    location: {
      city: "Dubai",
      state: "Dubai",
      country: "United Arab Emirates"
    },
    contact: {
      email: "info@emiratescards.ae",
      phone: "+971-4-555-0123",
      website: "https://emiratescards.ae"
    },
    socialMedia: {
      facebook: "https://facebook.com/emiratescardexchange",
      twitter: "https://twitter.com/emiratescards",
      instagram: "https://instagram.com/emiratescardexchange"
    },
    specialties: ["Trading Cards", "Pokémon", "Sports Cards", "Gaming Cards"],
    policies: {
      shipping: "We ship across the UAE within 24-48 hours. Free shipping for orders above 200 AED.",
      returns: "30-day return policy. Items must be in original condition with authentication certificates.",
      authenticity: "All cards are verified by our in-house experts and come with certificates of authenticity."
    },
  },
  {
    id: "vendor-2",
    name: "Dubai Comic Vault",
    slug: "dubai-comic-vault",
    description: "The UAE's leading comic book store and collectibles hub. From vintage Marvel and DC comics to rare manga and graphic novels, we've been serving collectors across the Emirates since 2015.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    logo: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=80&fit=crop",
    banner: "https://images.unsplash.com/photo-1578663287732-a3985e772b6b?w=800&h=200&fit=crop",
    rating: 4.9,
    totalSales: 890,
    reviewCount: 67,
    productCount: 3,
    totalProducts: 3,
    responseTime: "Within 3 hours",
    shippingInfo: "Express delivery available across UAE and GCC",
    returnPolicy: "14-day return policy for collectible items",
    verified: true,
    featured: true,
    joinedDate: "2015-08-20",
    location: {
      city: "Dubai",
      state: "Dubai",
      country: "United Arab Emirates"
    },
    contact: {
      email: "collectors@dubaicomicvault.ae",
      phone: "+971-4-555-0456",
      website: "https://dubaicomicvault.ae"
    },
    socialMedia: {
      facebook: "https://facebook.com/dubaicomicvault",
      twitter: "https://twitter.com/dubaicomics",
      instagram: "https://instagram.com/dubaicomicvault"
    },
    specialties: ["Comics", "Marvel", "DC Comics", "Manga", "Graphic Novels"],
    policies: {
      shipping: "Express delivery across UAE within 24 hours. International shipping to GCC countries available.",
      returns: "14-day return policy. Comics must be in the same condition as shipped.",
      authenticity: "All vintage comics are graded and authenticated by certified comic grading services."
    },
  },
];

const mockProducts = [
  {
    id: "prod-1",
    name: "Charizard VMAX Rainbow Rare - Champions Path",
    slug: "charizard-vmax-rainbow-rare",
    description: "Ultra-rare Charizard VMAX Rainbow Rare card from the Champions Path set. PSA 10 Gem Mint condition with perfect centering and sharp corners. A must-have for serious Pokémon collectors.",
    price: 450,
    originalPrice: 520,
    image: "https://images.pokemontcg.io/swsh45/074_hires.png",
    images: [
      "https://images.pokemontcg.io/swsh45/074_hires.png",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=560&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=560&fit=crop"
    ],
    category: "Trading Cards",
    categorySlug: "trading-cards",
    vendor: "Emirates Card Exchange",
    vendorId: "vendor-1",
    stock: 2,
    state: "open",
    grading: {
      company: "PSA",
      grade: "10",
      certificate: "PSA-10-GEM-MINT"
    },
    cardNumber: "074/073",
    views: 245,
    rating: 4.9,
    reviewCount: 12,
    year: 2020,
    manufacturer: "Pokémon Company",
    authenticity: {
      verified: true,
      certificate: "PSA-10-GEM-MINT",
      verifiedBy: "PSA Grading",
      verificationDate: "2023-11-15"
    },
    specifications: {
      "Set": "Champions Path",
      "Card Number": "074/073",
      "Rarity": "Rainbow Rare",
      "Condition": "PSA 10 Gem Mint",
      "Language": "English"
    },
    tags: ["Pokémon", "Charizard", "Rainbow Rare", "PSA 10", "Champions Path"],
    featured: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15"
  },
  {
    id: "prod-2",
    name: "Cristiano Ronaldo Rookie Card - Panini 2003",
    slug: "ronaldo-rookie-card-2003",
    description: "Extremely rare Cristiano Ronaldo rookie card from Panini 2003 Megacracks series. Card #71 featuring CR7 in his first season at Manchester United. Excellent condition with sharp corners.",
    price: 750,
    originalPrice: 850,
    image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=560&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=560&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=560&fit=crop"
    ],
    category: "Trading Cards",
    categorySlug: "trading-cards",
    vendor: "Emirates Card Exchange",
    vendorId: "vendor-1",
    stock: 1,
    state: "open",
    condition: "excellent",
    cardNumber: "#71",
    views: 189,
    rating: 4.8,
    reviewCount: 8,
    year: 2003,
    manufacturer: "Panini",
    authenticity: {
      verified: true,
      certificate: "ECE-AUTH-2024-001",
      verifiedBy: "Emirates Card Exchange",
      verificationDate: "2024-01-08"
    },
    specifications: {
      "Set": "Panini Megacracks 2003",
      "Card Number": "#71",
      "Player": "Cristiano Ronaldo",
      "Team": "Manchester United",
      "Condition": "Excellent"
    },
    tags: ["Football", "Cristiano Ronaldo", "Rookie Card", "Panini", "Manchester United"],
    featured: false,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-12"
  },
  {
    id: "prod-3",
    name: "Blue-Eyes White Dragon - LOB 1st Edition",
    slug: "blue-eyes-white-dragon-lob-1st",
    description: "Iconic Blue-Eyes White Dragon from Legend of Blue Eyes White Dragon (LOB) 1st Edition. Card #LOB-001 in near mint condition. A classic Yu-Gi-Oh! card that defined a generation of duelists.",
    price: 320,
    image: "https://52f4e29a8321344e30ae-0f55c9129972ac85d6b1f4e703468e6b.ssl.cf2.rackcdn.com/4007.jpg",
    images: [
      "https://52f4e29a8321344e30ae-0f55c9129972ac85d6b1f4e703468e6b.ssl.cf2.rackcdn.com/4007.jpg",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=560&fit=crop"
    ],
    category: "Trading Cards",
    categorySlug: "trading-cards",
    vendor: "Emirates Card Exchange",
    vendorId: "vendor-1",
    stock: 3,
    state: "sealed",
    cardNumber: "LOB-001",
    views: 156,
    rating: 4.7,
    reviewCount: 15,
    year: 1999,
    manufacturer: "Konami",
    authenticity: {
      verified: true,
      certificate: "ECE-AUTH-2024-002",
      verifiedBy: "Emirates Card Exchange",
      verificationDate: "2024-01-05"
    },
    specifications: {
      "Set": "Legend of Blue Eyes White Dragon",
      "Card Number": "LOB-001",
      "Edition": "1st Edition",
      "Rarity": "Ultra Rare",
      "Condition": "Near Mint"
    },
    tags: ["Yu-Gi-Oh!", "Blue-Eyes White Dragon", "1st Edition", "LOB", "Ultra Rare"],
    featured: true,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-10"
  },
  {
    id: "prod-4",
    name: "Amazing Spider-Man #1 (1963) - Stan Lee Signature",
    slug: "amazing-spiderman-1-1963-stan-lee",
    description: "Holy grail of comic collecting! Amazing Spider-Man #1 from 1963, signed by the legendary Stan Lee. CGC 7.5 graded with yellow label authentication. Features the first appearance of J. Jonah Jameson.",
    price: 2800,
    originalPrice: 3200,
    image: "https://images.unsplash.com/photo-1578663287732-a3985e772b6b?w=400&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1578663287732-a3985e772b6b?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&brightness=0.8"
    ],
    category: "Comics",
    categorySlug: "comics",
    vendor: "Dubai Comic Vault",
    vendorId: "vendor-2",
    stock: 1,
    state: "open",
    grading: {
      company: "CGC",
      grade: "7.5",
      certificate: "CGC-7.5-YL-STAN-LEE"
    },
    views: 312,
    rating: 5.0,
    reviewCount: 6,
    year: 1963,
    manufacturer: "Marvel Comics",
    authenticity: {
      verified: true,
      certificate: "CGC-7.5-YL-STAN-LEE",
      verifiedBy: "CGC Comics",
      verificationDate: "2023-09-20"
    },
    specifications: {
      "Title": "The Amazing Spider-Man",
      "Issue": "#1",
      "Publisher": "Marvel Comics",
      "Year": "1963",
      "Grade": "CGC 7.5 VF-",
      "Signature": "Stan Lee (Yellow Label)"
    },
    tags: ["Marvel", "Spider-Man", "Stan Lee", "CGC", "1963", "Silver Age"],
    featured: true,
    createdAt: "2023-12-28",
    updatedAt: "2024-01-03"
  },
  {
    id: "prod-5",
    name: "Batman: The Killing Joke - First Print (1988)",
    slug: "batman-killing-joke-first-print",
    description: "Alan Moore's masterpiece 'The Killing Joke' first print from 1988. Features the definitive Joker origin story and Barbara Gordon's transformation. Near mint condition with bright colors and sharp spine.",
    price: 180,
    originalPrice: 220,
    image: "https://images.unsplash.com/photo-1578663287732-a3985e772b6b?w=400&h=600&fit=crop&brightness=0.7",
    images: [
      "https://images.unsplash.com/photo-1578663287732-a3985e772b6b?w=400&h=600&fit=crop&brightness=0.7",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop"
    ],
    category: "Comics",
    categorySlug: "comics",
    vendor: "Dubai Comic Vault",
    vendorId: "vendor-2",
    stock: 2,
    state: "open",
    condition: "near-mint",
    views: 198,
    rating: 4.9,
    reviewCount: 11,
    year: 1988,
    manufacturer: "DC Comics",
    authenticity: {
      verified: true,
      certificate: "DCV-AUTH-2024-003",
      verifiedBy: "Dubai Comic Vault",
      verificationDate: "2024-01-12"
    },
    specifications: {
      "Title": "Batman: The Killing Joke",
      "Publisher": "DC Comics",
      "Year": "1988",
      "Writer": "Alan Moore",
      "Artist": "Brian Bolland",
      "Print": "First Print"
    },
    tags: ["DC Comics", "Batman", "Joker", "Alan Moore", "First Print", "1988"],
    featured: false,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-14"
  },
  {
    id: "prod-6",
    name: "One Piece Volume 1 - First Japanese Edition",
    slug: "one-piece-volume-1-japanese",
    description: "Original Japanese first edition of One Piece Volume 1 by Eiichiro Oda. Published by Shueisha in 1997. Excellent condition with minimal shelf wear. A must-have for manga collectors and One Piece fans.",
    price: 95,
    originalPrice: 120,
    image: "https://images.unsplash.com/photo-1578663287732-a3985e772b6b?w=400&h=600&fit=crop&brightness=1.2",
    images: [
      "https://images.unsplash.com/photo-1578663287732-a3985e772b6b?w=400&h=600&fit=crop&brightness=1.2",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop"
    ],
    category: "Comics",
    categorySlug: "comics",
    vendor: "Dubai Comic Vault",
    vendorId: "vendor-2",
    stock: 4,
    state: "sealed",
    views: 134,
    rating: 4.6,
    reviewCount: 9,
    year: 1997,
    manufacturer: "Shueisha",
    authenticity: {
      verified: true,
      certificate: "DCV-AUTH-2024-004",
      verifiedBy: "Dubai Comic Vault",
      verificationDate: "2024-01-06"
    },
    specifications: {
      "Title": "One Piece",
      "Volume": "1",
      "Language": "Japanese",
      "Publisher": "Shueisha",
      "Year": "1997",
      "Author": "Eiichiro Oda"
    },
    tags: ["Manga", "One Piece", "Eiichiro Oda", "Japanese", "First Edition", "Shueisha"],
    featured: true,
    createdAt: "2024-01-06",
    updatedAt: "2024-01-11"
  }
];

function filterProducts(products: Product[], filter: ProductFilter): Product[] {
  let filtered = [...products];

  if (filter.category) {
    filtered = filtered.filter(p => p.categorySlug === filter.category);
  }

  if (filter.vendorId) {
    filtered = filtered.filter(p => p.vendorId === filter.vendorId);
  }

  if (filter.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= filter.minPrice!);
  }

  if (filter.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= filter.maxPrice!);
  }

  if (filter.condition) {
    filtered = filtered.filter(p => p.condition === filter.condition);
  }

  if (filter.conditions && filter.conditions.length > 0) {
    filtered = filtered.filter(p => filter.conditions!.includes(p.condition || ''));
  }


  if (filter.inStock) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  if (filter.featured) {
    filtered = filtered.filter(p => p.featured === true);
  }

  if (filter.search || filter.searchQuery) {
    const query = (filter.search || filter.searchQuery || '').toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return filtered;
}

function paginateData<T>(data: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = data.slice(start, end);

  return {
    data: paginatedData,
    total: data.length,
    page,
    pageSize,
    hasNext: end < data.length,
    hasPrevious: page > 1,
  };
}

// Mock Product API Implementation
export class MockProductAPI implements IProductAPI {
  async getProducts(
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));

      let filteredProducts = mockProducts;

      if (filter) {
        filteredProducts = filterProducts(mockProducts as any, filter) as any;

        // Apply sorting
        if (filter.sortBy) {
          switch (filter.sortBy) {
            case 'price-asc':
              filteredProducts.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              filteredProducts.sort((a, b) => b.price - a.price);
              break;
            case 'rating':
              filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
              break;
            case 'popular':
              filteredProducts.sort((a, b) => (b.views || 0) - (a.views || 0));
              break;
            case 'newest':
              filteredProducts.sort((a, b) =>
                new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
              );
              break;
            case 'name':
              filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case 'featured':
              filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
              break;
          }
        }
      }

      const page = filter?.page || 1;
      const pageSize = filter?.limit || 20;
      const paginatedResult = paginateData(filteredProducts, page, pageSize);

      return {
        success: true,
        data: paginatedResult as any,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch products',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      const product = mockProducts.find(p => p.id === id);

      if (!product) {
        return {
          success: false,
          error: {
            message: 'Product not found',
            code: 'NOT_FOUND',
            status: 404,
          },
        };
      }

      return {
        success: true,
        data: product as any,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch product',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async getProductsByCategory(
    categorySlug: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const categoryFilter = { ...filter, category: categorySlug };
    return this.getProducts(categoryFilter);
  }

  async getFeaturedProducts(
    limit: number = 8,
  ): Promise<ApiResponse<Product[]>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      const featuredProducts = mockProducts
        .filter(product => product.featured)
        .slice(0, limit);

      return {
        success: true,
        data: featuredProducts as any,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch featured products',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async getRelatedProducts(
    productId: string,
    limit: number = 4,
  ): Promise<ApiResponse<Product[]>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      const product = mockProducts.find(p => p.id === productId);
      if (!product) {
        return { success: true, data: [] };
      }

      // Find products in the same category, excluding the current product
      const relatedProducts = mockProducts
        .filter(p =>
          p.id !== productId &&
          p.categorySlug === product.categorySlug
        )
        .slice(0, limit);

      return {
        success: true,
        data: relatedProducts as any,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch related products',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async searchProducts(
    query: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const searchFilter = { ...filter, search: query };
    return this.getProducts(searchFilter);
  }
}

// Mock Category API Implementation
export class MockCategoryAPI implements ICategoryAPI {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      return {
        success: true,
        data: mockCategories,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch categories',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      const category = mockCategories.find(c => c.slug === slug);

      if (!category) {
        return {
          success: false,
          error: {
            message: 'Category not found',
            code: 'NOT_FOUND',
            status: 404,
          },
        };
      }

      return {
        success: true,
        data: category,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch category',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      const category = mockCategories.find(c => c.id === id);

      if (!category) {
        return {
          success: false,
          error: {
            message: 'Category not found',
            code: 'NOT_FOUND',
            status: 404,
          },
        };
      }

      return {
        success: true,
        data: category,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch category',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async getSubcategories(parentSlug: string): Promise<ApiResponse<Category[]>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      // For now, return empty as we don't have subcategories in mock data
      return {
        success: true,
        data: [],
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch subcategories',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async getFeaturedCategories(): Promise<ApiResponse<Category[]>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      const featuredCategories = mockCategories.filter(category => category.featured);

      return {
        success: true,
        data: featuredCategories,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch featured categories',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }
}

// Mock Vendor API Implementation
export class MockVendorAPI implements IVendorAPI {
  async getVendors(filter?: {
    featured?: boolean;
    verified?: boolean;
  }): Promise<ApiResponse<Vendor[]>> {
    console.log('📍 MockVendorAPI.getVendors() called with filter:', filter);
    console.log('📋 Available mockVendors:', mockVendors?.length, mockVendors);

    try {
      console.log('⏳ Starting 50ms async delay...');
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log('✅ Async delay completed');

      let filteredVendors = mockVendors;
      console.log('🔍 Initial vendors before filtering:', filteredVendors?.length);

      if (filter) {
        console.log('🔍 Applying filters:', filter);
        if (filter.featured !== undefined) {
          const beforeCount = filteredVendors.length;
          filteredVendors = filteredVendors.filter(vendor => vendor.featured === filter.featured);
          console.log('🌟 Featured filter applied: from', beforeCount, 'to', filteredVendors.length, 'vendors');
        }
        if (filter.verified !== undefined) {
          const beforeCount = filteredVendors.length;
          filteredVendors = filteredVendors.filter(vendor => vendor.verified === filter.verified);
          console.log('✅ Verified filter applied: from', beforeCount, 'to', filteredVendors.length, 'vendors');
        }
      } else {
        console.log('🔍 No filters applied - returning all vendors');
      }

      console.log('🎆 Final filtered vendors:', filteredVendors?.length, filteredVendors);

      const response = {
        success: true,
        data: filteredVendors,
      };
      console.log('📦 MockVendorAPI returning response:', response);
      return response as any;
    } catch (error) {
      console.error('💥 MockVendorAPI error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to fetch vendors',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async getVendorById(id: string): Promise<ApiResponse<Vendor>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      const vendor = mockVendors.find(v => v.id === id);

      if (!vendor) {
        return {
          success: false,
          error: {
            message: 'Vendor not found',
            code: 'NOT_FOUND',
            status: 404,
          },
        };
      }

      return {
        success: true,
        data: vendor,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch vendor',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async getVendorBySlug(slug: string): Promise<ApiResponse<Vendor>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      const vendor = mockVendors.find(v => v.slug === slug);

      if (!vendor) {
        return {
          success: false,
          error: {
            message: 'Vendor not found',
            code: 'NOT_FOUND',
            status: 404,
          },
        };
      }

      return {
        success: true,
        data: vendor,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch vendor',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async getVendorProducts(
    vendorId: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      const vendorProducts = mockProducts.filter(product => product.vendorId === vendorId);

      let filteredProducts = vendorProducts;
      if (filter) {
        filteredProducts = filterProducts(vendorProducts as any, filter) as any;
      }

      const page = filter?.page || 1;
      const pageSize = filter?.limit || 20;
      const paginatedResult = paginateData(filteredProducts, page, pageSize);

      return {
        success: true,
        data: paginatedResult as any,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch vendor products',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }
}

// Export mock data and utility functions for external use
export { mockProducts, mockVendors, mockCategories, filterProducts, paginateData };