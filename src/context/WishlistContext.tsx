"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Product } from "@/types";
import { toast } from "sonner";

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

const WISHLIST_STORAGE_KEY = "lpx_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (storedWishlist) {
      try {
        const parsed = JSON.parse(storedWishlist);
        setItems(parsed);
      } catch (error) {
        console.error("Failed to parse wishlist from storage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToWishlist = useCallback((product: Product) => {
    setItems((prevItems) => {
      const exists = prevItems.some((item) => item.id === product.id);
      if (exists) {
        toast.info("Item already in wishlist");
        return prevItems;
      }
      toast.success("Added to wishlist");
      return [...prevItems, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== productId);
      if (newItems.length < prevItems.length) {
        toast.success("Removed from wishlist");
      }
      return newItems;
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => {
      return items.some((item) => item.id === productId);
    },
    [items],
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
    toast.success("Wishlist cleared");
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
