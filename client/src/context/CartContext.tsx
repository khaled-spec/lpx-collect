"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { type CartSummary, cartMockService } from "@/lib/mock/cart";
import type { CartItem, Product } from "@/types";

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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [summary, setSummary] = useState<CartSummary>(() => ({
    items: [],
    itemCount: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    discount: 0,
    couponCode: null,
  }));
  const [mounted, setMounted] = useState(false);

  // Update summary whenever cart changes
  const refreshSummary = useCallback(() => {
    if (!mounted) return;
    setSummary(cartMockService.getCartSummary());
  }, [mounted]);

  // Load cart summary on mount (client-side only)
  useEffect(() => {
    setMounted(true);

    // Force load sample data if cart is empty and we're in development
    const currentSummary = cartMockService.getCartSummary();
    if (
      currentSummary.itemCount === 0 &&
      process.env.NODE_ENV !== "production"
    ) {
      console.log("🛒 Cart is empty, loading sample data...");
      cartMockService.loadSampleData();
    }

    refreshSummary();
  }, [refreshSummary]);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (!mounted) return;

      const result = cartMockService.addToCart(product, quantity);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }

      refreshSummary();
    },
    [refreshSummary, mounted],
  );

  const removeFromCart = useCallback(
    (itemId: string) => {
      if (!mounted) return;

      const result = cartMockService.removeFromCart(itemId);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }

      refreshSummary();
    },
    [refreshSummary, mounted],
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (!mounted) return;

      const result = cartMockService.updateQuantity(itemId, quantity);

      if (result.success) {
        // Don't show toast for quantity updates unless requested
      } else {
        toast.error(result.message);
      }

      refreshSummary();
    },
    [refreshSummary, mounted],
  );

  const clearCart = useCallback(() => {
    if (!mounted) return;

    const result = cartMockService.clearCart();

    if (result.success) {
      toast.success(result.message);
    }

    refreshSummary();
  }, [refreshSummary, mounted]);

  const isInCart = useCallback(
    (productId: string) => {
      if (!mounted) return false;
      return cartMockService.isInCart(productId);
    },
    [mounted],
  );

  const getItemQuantity = useCallback(
    (productId: string) => {
      if (!mounted) return 0;
      return cartMockService.getItemQuantity(productId);
    },
    [mounted],
  );

  const applyCoupon = useCallback(
    (code: string) => {
      if (!mounted) return { valid: false, discount: 0 };

      const result = cartMockService.applyCoupon(code);

      if (result.valid) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }

      refreshSummary();
      return { valid: result.valid, discount: result.discount };
    },
    [refreshSummary, mounted],
  );

  const value: CartContextType = {
    items: summary.items,
    itemCount: summary.itemCount,
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    tax: summary.tax,
    total: summary.total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    applyCoupon,
    discount: summary.discount,
    couponCode: summary.couponCode,
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
