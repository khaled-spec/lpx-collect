import type { CartItem, Product } from "@/types";
import { AUTO_POPULATE_SETTINGS, mockDataUtils } from "./data";

export interface CartOperationResult {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discount: number;
  couponCode: string | null;
}

export interface CouponResult {
  valid: boolean;
  discount: number;
  message: string;
}

const CART_STORAGE_KEY = "lpx-cart";
const TAX_RATE = 0.08; // 8% tax
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

// Mock coupon codes
const MOCK_COUPONS: Record<string, { discount: number; description: string }> =
  {
    SAVE10: { discount: 0.1, description: "10% off your order" },
    SAVE20: { discount: 0.2, description: "20% off your order" },
    WELCOME15: { discount: 0.15, description: "15% off for new customers" },
    FREESHIP: { discount: 0, description: "Free shipping on your order" },
    STUDENT25: { discount: 0.25, description: "25% student discount" },
    BLACKFRIDAY30: { discount: 0.3, description: "Black Friday 30% off" },
  };

interface CartData {
  items: CartItem[];
  discount: number;
  couponCode: string | null;
}

export class CartMockService {
  private static instance: CartMockService;

  private constructor() {}

  static getInstance(): CartMockService {
    if (!CartMockService.instance) {
      CartMockService.instance = new CartMockService();
    }
    return CartMockService.instance;
  }

  private loadCartData(): CartData {
    if (typeof window === "undefined") {
      return { items: [], discount: 0, couponCode: null };
    }

    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) {
      // Auto-populate with sample data if enabled and cart is empty
      if (AUTO_POPULATE_SETTINGS.cart) {
        return this.getDefaultSampleData();
      }
      return { items: [], discount: 0, couponCode: null };
    }

    try {
      const parsed = JSON.parse(cartData);
      return {
        items: parsed.items || [],
        discount: parsed.discount || 0,
        couponCode: parsed.couponCode || null,
      };
    } catch (error) {
      if (process.env.NODE_ENV !== "production")
        console.error("Failed to load cart from localStorage:", error);
      return { items: [], discount: 0, couponCode: null };
    }
  }

  private getDefaultSampleData(): CartData {
    const sampleData = mockDataUtils.initializeSampleCart();
    return {
      items: sampleData.items,
      discount: sampleData.discount,
      couponCode: sampleData.couponCode,
    };
  }

  private saveCartData(cartData: CartData): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      if (process.env.NODE_ENV !== "production")
        console.error("Failed to save cart to localStorage:", error);
    }
  }

  getCart(): CartItem[] {
    return this.loadCartData().items;
  }

  addToCart(product: Product, quantity: number = 1): CartOperationResult {
    if (quantity <= 0) {
      return {
        success: false,
        message: "Invalid quantity",
      };
    }

    if (quantity > product.stock) {
      return {
        success: false,
        message: "Not enough stock available",
      };
    }

    const cartData = this.loadCartData();
    const existingItem = cartData.items.find(
      (item) => item.product.id === product.id,
    );

    if (existingItem) {
      const newQuantity = Math.min(
        existingItem.quantity + quantity,
        product.stock,
      );

      if (newQuantity === existingItem.quantity) {
        return {
          success: false,
          message: "Maximum stock reached",
        };
      }

      existingItem.quantity = newQuantity;
      this.saveCartData(cartData);

      return {
        success: true,
        message: `Updated ${product.title} quantity`,
        data: existingItem,
      };
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${product.id}`,
        product,
        quantity: Math.min(quantity, product.stock),
        addedAt: new Date(),
      };

      cartData.items.push(newItem);
      this.saveCartData(cartData);

      return {
        success: true,
        message: `Added ${product.title} to cart`,
        data: newItem,
      };
    }
  }

  removeFromCart(itemId: string): CartOperationResult {
    const cartData = this.loadCartData();
    const itemIndex = cartData.items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return {
        success: false,
        message: "Item not found in cart",
      };
    }

    const removedItem = cartData.items[itemIndex];
    cartData.items.splice(itemIndex, 1);
    this.saveCartData(cartData);

    return {
      success: true,
      message: `Removed ${removedItem.product.title} from cart`,
      data: removedItem,
    };
  }

  updateQuantity(itemId: string, quantity: number): CartOperationResult {
    if (quantity < 0) {
      return {
        success: false,
        message: "Invalid quantity",
      };
    }

    if (quantity === 0) {
      return this.removeFromCart(itemId);
    }

    const cartData = this.loadCartData();
    const item = cartData.items.find((item) => item.id === itemId);

    if (!item) {
      return {
        success: false,
        message: "Item not found in cart",
      };
    }

    if (quantity > item.product.stock) {
      return {
        success: false,
        message: "Not enough stock available",
      };
    }

    item.quantity = quantity;
    this.saveCartData(cartData);

    return {
      success: true,
      message: "Quantity updated",
      data: item,
    };
  }

  clearCart(): CartOperationResult {
    const cartData: CartData = { items: [], discount: 0, couponCode: null };
    this.saveCartData(cartData);

    return {
      success: true,
      message: "Cart cleared",
    };
  }

  isInCart(productId: string): boolean {
    const cartData = this.loadCartData();
    return cartData.items.some((item) => item.product.id === productId);
  }

  getItemQuantity(productId: string): number {
    const cartData = this.loadCartData();
    const item = cartData.items.find((item) => item.product.id === productId);
    return item?.quantity || 0;
  }

  applyCoupon(code: string): CouponResult {
    const upperCode = code.toUpperCase();
    const coupon = MOCK_COUPONS[upperCode];

    if (!coupon) {
      return {
        valid: false,
        discount: 0,
        message: "Invalid coupon code",
      };
    }

    const cartData = this.loadCartData();
    cartData.discount = coupon.discount;
    cartData.couponCode = upperCode;
    this.saveCartData(cartData);

    return {
      valid: true,
      discount: coupon.discount,
      message: coupon.description,
    };
  }

  removeCoupon(): CartOperationResult {
    const cartData = this.loadCartData();
    cartData.discount = 0;
    cartData.couponCode = null;
    this.saveCartData(cartData);

    return {
      success: true,
      message: "Coupon removed",
    };
  }

  getCartSummary(): CartSummary {
    const cartData = this.loadCartData();

    // Calculate subtotal
    const subtotal = cartData.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    // Calculate discount amount
    const discountAmount = subtotal * cartData.discount;
    const discountedSubtotal = subtotal - discountAmount;

    // Calculate shipping (free for orders over threshold or with FREESHIP coupon)
    const shipping =
      cartData.couponCode === "FREESHIP" || subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_COST;

    // Calculate tax on discounted amount
    const tax = discountedSubtotal * TAX_RATE;

    // Calculate total
    const total = discountedSubtotal + shipping + tax;

    // Calculate item count
    const itemCount = cartData.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    return {
      items: cartData.items,
      itemCount,
      subtotal,
      shipping,
      tax,
      total,
      discount: discountAmount,
      couponCode: cartData.couponCode,
    };
  }

  // Get available coupon codes (for testing/demo purposes)
  getAvailableCoupons(): Array<{
    code: string;
    description: string;
    discount: number;
  }> {
    return Object.entries(MOCK_COUPONS).map(([code, coupon]) => ({
      code,
      description: coupon.description,
      discount: coupon.discount,
    }));
  }

  // Simulate order placement (clears cart)
  placeOrder(): CartOperationResult {
    const cartData = this.loadCartData();

    if (cartData.items.length === 0) {
      return {
        success: false,
        message: "Cart is empty",
      };
    }

    // Simulate order processing
    const orderData = {
      orderId: `order-${Date.now()}`,
      items: [...cartData.items],
      summary: this.getCartSummary(),
      timestamp: new Date(),
    };

    // Clear cart after successful order
    this.clearCart();

    return {
      success: true,
      message: "Order placed successfully",
      data: orderData,
    };
  }

  // Load predefined sample data
  loadSampleData(): CartOperationResult {
    const sampleData = this.getDefaultSampleData();
    this.saveCartData(sampleData);

    return {
      success: true,
      message: "Sample cart data loaded",
      data: sampleData,
    };
  }

  // Load random sample data
  loadRandomSampleData(itemCount: number = 2): CartOperationResult {
    const randomItems = mockDataUtils.generateRandomCart(itemCount);
    const cartData: CartData = {
      items: randomItems,
      discount: 0,
      couponCode: null,
    };

    this.saveCartData(cartData);

    return {
      success: true,
      message: `Loaded ${itemCount} random items to cart`,
      data: cartData,
    };
  }

  // Check if cart has any sample data
  hasSampleData(): boolean {
    const cartData = this.loadCartData();
    return cartData.items.some(
      (item) => item.id.includes("sample") || item.id.includes("random"),
    );
  }

  // Reset to empty cart (useful for testing)
  resetToEmpty(): CartOperationResult {
    const cartData: CartData = { items: [], discount: 0, couponCode: null };
    this.saveCartData(cartData);

    return {
      success: true,
      message: "Cart reset to empty state",
    };
  }
}

// Export singleton instance
export const cartMockService = CartMockService.getInstance();
