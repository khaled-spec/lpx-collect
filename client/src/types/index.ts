export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "buyer" | "vendor" | "admin";
  createdAt: Date;
}

export interface Vendor {
  id: string;
  userId: string;
  storeName: string;
  description: string;
  logo?: string;
  coverImage?: string;
  rating: number;
  totalSales: number;
  totalProducts: number;
  responseTime: string;
  shippingInfo: string;
  returnPolicy: string;
  verified: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  productCount: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: Category;
  vendor: Vendor;
  condition: "new" | "mint" | "excellent" | "good" | "fair" | "poor";
  rarity?: "common" | "uncommon" | "rare" | "very-rare" | "legendary";
  stock: number;
  sold: number;
  views: number;
  likes: number;
  tags: string[];
  specifications?: Record<string, string>;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  orderNumber?: string;
  customer?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  vendorId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: Date;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  rarity?: string[];
  vendor?: string;
  sortBy?: "price-asc" | "price-desc" | "newest" | "popular" | "rating";
}
