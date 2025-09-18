"use client";

import {
  ReactNode,
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

const GUEST_WISHLIST_KEY = "lpx_wishlist";
const USER_WISHLIST_PREFIX = "lpx_wishlist_user_";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  // Get the appropriate storage key (always use guest key since no auth)
  const getStorageKey = useCallback(() => {
    return GUEST_WISHLIST_KEY;
  }, []);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const storageKey = getStorageKey();
    const storedWishlist = localStorage.getItem(storageKey);

    if (storedWishlist) {
      try {
        const parsed = JSON.parse(storedWishlist);
        setItems(parsed);
      } catch (error) {
        console.error("Failed to parse wishlist from storage:", error);
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, [getStorageKey]);

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    const storageKey = getStorageKey();
    if (items.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } else {
      // Don't remove the key, just set it to empty array
      localStorage.setItem(storageKey, JSON.stringify([]));
    }
  }, [items, getStorageKey]);

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
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify([]));
    toast.success("Wishlist cleared");
  }, [getStorageKey]);

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
