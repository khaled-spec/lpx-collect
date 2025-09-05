"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { CartItem, Product } from "@/types";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  applyCoupon: (code: string) => { valid: boolean; discount: number };
  discount: number;
  couponCode: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "lpx-cart";
const TAX_RATE = 0.08; // 8% tax
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

// Mock coupon codes
const MOCK_COUPONS: Record<string, number> = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  WELCOME15: 0.15,
  FREESHIP: 0, // Special handling for free shipping
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed.items || []);
        setDiscount(parsed.discount || 0);
        setCouponCode(parsed.couponCode || null);
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        items,
        discount,
        couponCode,
      }),
    );
  }, [items, discount, couponCode]);

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const discountAmount = subtotal * discount;
  const discountedSubtotal = subtotal - discountAmount;

  // Free shipping for orders over threshold or with FREESHIP coupon
  const shipping =
    couponCode === "FREESHIP" || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_COST;

  const tax = discountedSubtotal * TAX_RATE;
  const total = discountedSubtotal + shipping + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        // Update quantity if item already in cart
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          product.stock,
        );

        if (newQuantity === existingItem.quantity) {
          toast.error("Maximum stock reached");
          return prevItems;
        }

        toast.success(`Updated ${product.title} quantity`);

        return prevItems.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: newQuantity }
            : item,
        );
      } else {
        // Add new item to cart
        if (quantity > product.stock) {
          toast.error("Not enough stock available");
          return prevItems;
        }

        const newItem: CartItem = {
          id: `cart-${Date.now()}-${product.id}`,
          product,
          quantity: Math.min(quantity, product.stock),
          addedAt: new Date(),
        };

        toast.success(`Added ${product.title} to cart`);
        return [...prevItems, newItem];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === itemId);
      if (item) {
        toast.success(`Removed ${item.product.title} from cart`);
      }
      return prevItems.filter((item) => item.id !== itemId);
    });
  }, []);

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(itemId);
        return;
      }

      setItems((prevItems) => {
        return prevItems.map((item) => {
          if (item.id === itemId) {
            const newQuantity = Math.min(quantity, item.product.stock);
            if (newQuantity !== quantity) {
              toast.error("Maximum stock reached");
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      });
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscount(0);
    setCouponCode(null);
    toast.success("Cart cleared");
  }, []);

  const isInCart = useCallback(
    (productId: string) => {
      return items.some((item) => item.product.id === productId);
    },
    [items],
  );

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = items.find((item) => item.product.id === productId);
      return item?.quantity || 0;
    },
    [items],
  );

  const applyCoupon = useCallback((code: string) => {
    const upperCode = code.toUpperCase();

    if (MOCK_COUPONS[upperCode] !== undefined) {
      setDiscount(MOCK_COUPONS[upperCode]);
      setCouponCode(upperCode);

      if (upperCode === "FREESHIP") {
        toast.success("Free shipping applied!");
      } else {
        toast.success(
          `Coupon applied! ${MOCK_COUPONS[upperCode] * 100}% discount`,
        );
      }

      return { valid: true, discount: MOCK_COUPONS[upperCode] };
    }

    toast.error("Invalid coupon code");
    return { valid: false, discount: 0 };
  }, []);

  const value: CartContextType = {
    items,
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    applyCoupon,
    discount,
    couponCode,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
