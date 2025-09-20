import { Product, Category, Vendor, CartItem } from "@/types";
import { WishlistItem } from "./wishlist";

// Mock categories that match the TypeScript interface
export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Trading Cards",
    slug: "trading-cards",
    description: "Rare and collectible trading cards including Pokémon, sports cards, and gaming cards",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
    productCount: 3,
  },
  {
    id: "cat-2",
    name: "Comics",
    slug: "comics",
    description: "Rare comics, graphic novels, and manga from around the world",
    image: "https://images.unsplash.com/photo-1578663287732-a3985e772b6b?w=500&h=300&fit=crop",
    productCount: 3,
  },
];

// Mock vendors that match the TypeScript interface
export const mockVendors: Vendor[] = [
  {
    id: "vendor-1",
    userId: "user-1",
    storeName: "Emirates Card Exchange",
    description: "Dubai's premier destination for rare and authentic trading cards. Specializing in Pokémon, sports cards, and gaming collectibles with over 10 years of experience in the UAE market.",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=200&fit=crop",
    rating: 4.8,
    totalSales: 1250,
    totalProducts: 3,
    responseTime: "Within 2 hours",
    shippingInfo: "Free shipping across UAE for orders above 200 AED",
    returnPolicy: "30-day return policy for authentic items",
    verified: true,
    createdAt: new Date("2019-03-15"),
  },
  {
    id: "vendor-2",
    userId: "user-2",
    storeName: "Dubai Comic Vault",
    description: "The UAE's leading comic book store and collectibles hub. From vintage Marvel and DC comics to rare manga and graphic novels, we've been serving collectors across the Emirates since 2015.",
    logo: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=80&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1578663287732-a3985e772b6b?w=800&h=200&fit=crop",
    rating: 4.9,
    totalSales: 890,
    totalProducts: 3,
    responseTime: "Within 3 hours",
    shippingInfo: "Express delivery available across UAE and GCC",
    returnPolicy: "14-day return policy for collectible items",
    verified: true,
    createdAt: new Date("2015-08-20"),
  },
];

// Mock products that match the TypeScript interface exactly
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    title: "Charizard VMAX Rainbow Rare - Champions Path",
    slug: "charizard-vmax-rainbow-rare",
    description: "Ultra-rare Charizard VMAX Rainbow Rare card from the Champions Path set. PSA 10 Gem Mint condition with perfect centering and sharp corners. A must-have for serious Pokémon collectors.",
    price: 450,
    compareAtPrice: 520,
    images: [
      "https://via.placeholder.com/400x560/FF6B6B/FFFFFF?text=Charizard+VMAX",
      "https://via.placeholder.com/400x560/4ECDC4/FFFFFF?text=Pokemon+Card",
      "https://via.placeholder.com/400x560/45B7D1/FFFFFF?text=Trading+Card"
    ],
    category: mockCategories[0], // Trading Cards
    vendor: mockVendors[0], // Emirates Card Exchange
    condition: "mint",
    rarity: "very-rare",
    stock: 2,
    sold: 8,
    views: 245,
    likes: 18,
    tags: ["Pokémon", "Charizard", "Rainbow Rare", "PSA 10", "Champions Path"],
    specifications: {
      "Set": "Champions Path",
      "Card Number": "074/073",
      "Rarity": "Rainbow Rare",
      "Condition": "PSA 10 Gem Mint",
      "Language": "English"
    },
    featured: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "prod-2",
    title: "Cristiano Ronaldo Rookie Card - Panini 2003",
    slug: "ronaldo-rookie-card-2003",
    description: "Extremely rare Cristiano Ronaldo rookie card from Panini 2003 Megacracks series. Card #71 featuring CR7 in his first season at Manchester United. Excellent condition with sharp corners.",
    price: 750,
    compareAtPrice: 850,
    images: [
      "https://via.placeholder.com/400x560/F39C12/FFFFFF?text=Ronaldo+Card",
      "https://via.placeholder.com/400x560/E74C3C/FFFFFF?text=Football+Card"
    ],
    category: mockCategories[0], // Trading Cards
    vendor: mockVendors[0], // Emirates Card Exchange
    condition: "excellent",
    rarity: "legendary",
    stock: 1,
    sold: 3,
    views: 189,
    likes: 25,
    tags: ["Football", "Cristiano Ronaldo", "Rookie Card", "Panini", "Manchester United"],
    specifications: {
      "Set": "Panini Megacracks 2003",
      "Card Number": "#71",
      "Player": "Cristiano Ronaldo",
      "Team": "Manchester United",
      "Condition": "Excellent"
    },
    featured: false,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "prod-3",
    title: "Blue-Eyes White Dragon - LOB 1st Edition",
    slug: "blue-eyes-white-dragon-lob-1st",
    description: "Iconic Blue-Eyes White Dragon from Legend of Blue Eyes White Dragon (LOB) 1st Edition. Card #LOB-001 in near mint condition. A classic Yu-Gi-Oh! card that defined a generation of duelists.",
    price: 320,
    images: [
      "https://via.placeholder.com/400x560/3498DB/FFFFFF?text=Blue+Eyes+Dragon",
      "https://via.placeholder.com/400x560/9B59B6/FFFFFF?text=Yu-Gi-Oh+Card"
    ],
    category: mockCategories[0], // Trading Cards
    vendor: mockVendors[0], // Emirates Card Exchange
    condition: "excellent",
    rarity: "rare",
    stock: 3,
    sold: 12,
    views: 156,
    likes: 12,
    tags: ["Yu-Gi-Oh!", "Blue-Eyes White Dragon", "1st Edition", "LOB", "Ultra Rare"],
    specifications: {
      "Set": "Legend of Blue Eyes White Dragon",
      "Card Number": "LOB-001",
      "Edition": "1st Edition",
      "Rarity": "Ultra Rare",
      "Condition": "Near Mint"
    },
    featured: true,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "prod-4",
    title: "Amazing Spider-Man #1 (1963) - Stan Lee Signature",
    slug: "amazing-spiderman-1-1963-stan-lee",
    description: "Holy grail of comic collecting! Amazing Spider-Man #1 from 1963, signed by the legendary Stan Lee. CGC 7.5 graded with yellow label authentication. Features the first appearance of J. Jonah Jameson.",
    price: 2800,
    compareAtPrice: 3200,
    images: [
      "https://via.placeholder.com/400x600/E74C3C/FFFFFF?text=Spider-Man+%231",
      "https://via.placeholder.com/400x600/C0392B/FFFFFF?text=Marvel+Comic"
    ],
    category: mockCategories[1], // Comics
    vendor: mockVendors[1], // Dubai Comic Vault
    condition: "good",
    rarity: "legendary",
    stock: 1,
    sold: 1,
    views: 312,
    likes: 67,
    tags: ["Marvel", "Spider-Man", "Stan Lee", "CGC", "1963", "Silver Age"],
    specifications: {
      "Title": "The Amazing Spider-Man",
      "Issue": "#1",
      "Publisher": "Marvel Comics",
      "Year": "1963",
      "Grade": "CGC 7.5 VF-",
      "Signature": "Stan Lee (Yellow Label)"
    },
    featured: true,
    createdAt: new Date("2023-12-28"),
    updatedAt: new Date("2024-01-03"),
  },
  {
    id: "prod-5",
    title: "Batman: The Killing Joke - First Print (1988)",
    slug: "batman-killing-joke-first-print",
    description: "Alan Moore's masterpiece 'The Killing Joke' first print from 1988. Features the definitive Joker origin story and Barbara Gordon's transformation. Near mint condition with bright colors and sharp spine.",
    price: 180,
    compareAtPrice: 220,
    images: [
      "https://via.placeholder.com/400x600/2C3E50/FFFFFF?text=Killing+Joke",
      "https://via.placeholder.com/400x600/34495E/FFFFFF?text=Batman+Comic"
    ],
    category: mockCategories[1], // Comics
    vendor: mockVendors[1], // Dubai Comic Vault
    condition: "excellent",
    rarity: "rare",
    stock: 2,
    sold: 6,
    views: 198,
    likes: 11,
    tags: ["DC Comics", "Batman", "Joker", "Alan Moore", "First Print", "1988"],
    specifications: {
      "Title": "Batman: The Killing Joke",
      "Publisher": "DC Comics",
      "Year": "1988",
      "Writer": "Alan Moore",
      "Artist": "Brian Bolland",
      "Print": "First Print"
    },
    featured: false,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "prod-6",
    title: "One Piece Volume 1 - First Japanese Edition",
    slug: "one-piece-volume-1-japanese",
    description: "Original Japanese first edition of One Piece Volume 1 by Eiichiro Oda. Published by Shueisha in 1997. Excellent condition with minimal shelf wear. A must-have for manga collectors and One Piece fans.",
    price: 95,
    compareAtPrice: 120,
    images: [
      "https://via.placeholder.com/400x600/F39C12/FFFFFF?text=One+Piece+Vol+1",
      "https://via.placeholder.com/400x600/E67E22/FFFFFF?text=Manga+Book"
    ],
    category: mockCategories[1], // Comics
    vendor: mockVendors[1], // Dubai Comic Vault
    condition: "excellent",
    rarity: "uncommon",
    stock: 4,
    sold: 15,
    views: 134,
    likes: 9,
    tags: ["Manga", "One Piece", "Eiichiro Oda", "Japanese", "First Edition", "Shueisha"],
    specifications: {
      "Title": "One Piece",
      "Volume": "1",
      "Language": "Japanese",
      "Publisher": "Shueisha",
      "Year": "1997",
      "Author": "Eiichiro Oda"
    },
    featured: true,
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-11"),
  },
];

// Sample cart items for demonstration
export const sampleCartItems: CartItem[] = [
  {
    id: "cart-sample-1",
    product: mockProducts[0], // Charizard VMAX
    quantity: 1,
    addedAt: new Date("2024-01-20T10:30:00Z"),
  },
  {
    id: "cart-sample-2",
    product: mockProducts[2], // Blue-Eyes White Dragon
    quantity: 2,
    addedAt: new Date("2024-01-20T14:15:00Z"),
  },
  {
    id: "cart-sample-3",
    product: mockProducts[4], // Batman: The Killing Joke
    quantity: 1,
    addedAt: new Date("2024-01-21T09:45:00Z"),
  },
];

// Sample wishlist items for demonstration
export const sampleWishlistItems: WishlistItem[] = [
  {
    id: "wishlist-sample-1",
    product: mockProducts[1], // Cristiano Ronaldo Rookie Card
    addedAt: new Date("2024-01-18T16:20:00Z"),
    notes: "Waiting for price drop"
  },
  {
    id: "wishlist-sample-2",
    product: mockProducts[3], // Amazing Spider-Man #1
    addedAt: new Date("2024-01-19T11:30:00Z"),
    notes: "Dream purchase - saving up!"
  },
  {
    id: "wishlist-sample-3",
    product: mockProducts[5], // One Piece Volume 1
    addedAt: new Date("2024-01-21T13:15:00Z"),
  },
  {
    id: "wishlist-sample-4",
    product: mockProducts[0], // Charizard VMAX (also in cart)
    addedAt: new Date("2024-01-15T08:45:00Z"),
    notes: "Considering getting another one"
  },
];

// Utility functions for initializing sample data
export const mockDataUtils = {
  // Initialize cart with sample data
  initializeSampleCart: () => {
    return {
      items: [...sampleCartItems],
      discount: 0.1, // 10% discount applied
      couponCode: "SAVE10",
      timestamp: new Date(),
    };
  },

  // Initialize wishlist with sample data
  initializeSampleWishlist: () => {
    return {
      items: [...sampleWishlistItems],
      lastModified: new Date(),
    };
  },

  // Get random products for sampling
  getRandomProducts: (count: number = 3) => {
    const shuffled = [...mockProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  // Get products by category
  getProductsByCategory: (categorySlug: string) => {
    return mockProducts.filter(product => product.category.slug === categorySlug);
  },

  // Get featured products
  getFeaturedProducts: () => {
    return mockProducts.filter(product => product.featured);
  },

  // Generate sample cart with random items
  generateRandomCart: (itemCount: number = 2) => {
    const products = mockDataUtils.getRandomProducts(itemCount);
    return products.map((product, index) => ({
      id: `cart-random-${Date.now()}-${index}`,
      product,
      quantity: Math.floor(Math.random() * 3) + 1, // 1-3 quantity
      addedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
    }));
  },

  // Generate sample wishlist with random items
  generateRandomWishlist: (itemCount: number = 3) => {
    const products = mockDataUtils.getRandomProducts(itemCount);
    return products.map((product, index) => ({
      id: `wishlist-random-${Date.now()}-${index}`,
      product,
      addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last month
      notes: Math.random() > 0.5 ? "Interested in this item" : undefined,
    }));
  },
};

// Demo mode flag for development
export const DEMO_MODE = process.env.NODE_ENV === 'development';

// Auto-populate settings
export const AUTO_POPULATE_SETTINGS = {
  cart: DEMO_MODE, // Auto-populate cart in development
  wishlist: DEMO_MODE, // Auto-populate wishlist in development
  useRandomData: false, // Use predefined sample data vs random data
};