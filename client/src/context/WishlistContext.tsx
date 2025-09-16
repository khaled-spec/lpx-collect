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
import { useUser } from "@clerk/nextjs";

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
  const { user } = useUser();

  // Get the appropriate storage key based on auth status
  const getStorageKey = useCallback(() => {
    return user ? `${USER_WISHLIST_PREFIX}${user.id}` : GUEST_WISHLIST_KEY;
  }, [user]);

  // Load wishlist from localStorage when user changes and merge if logging in
  useEffect(() => {
    const storageKey = getStorageKey();

    // If user just logged in, merge guest wishlist first
    if (user) {
      const guestWishlist = localStorage.getItem(GUEST_WISHLIST_KEY);
      const userWishlist = localStorage.getItem(storageKey);

      if (guestWishlist) {
        try {
          const guestItems: Product[] = JSON.parse(guestWishlist);
          const userItems: Product[] = userWishlist
            ? JSON.parse(userWishlist)
            : [];

          // Merge unique items
          const mergedItems = [...userItems];
          let addedCount = 0;

          guestItems.forEach((guestItem) => {
            if (!mergedItems.some((item) => item.id === guestItem.id)) {
              mergedItems.push(guestItem);
              addedCount++;
            }
          });

          if (addedCount > 0) {
            setItems(mergedItems);
            localStorage.setItem(storageKey, JSON.stringify(mergedItems));
            toast.success(
              `${addedCount} item${addedCount > 1 ? "s" : ""} merged from your guest wishlist`,
            );
          } else {
            setItems(userItems);
          }

          // Clear guest wishlist after merge
          localStorage.removeItem(GUEST_WISHLIST_KEY);
          return;
        } catch (error) {
          console.error("Failed to merge guest wishlist:", error);
        }
      }
    }

    // Normal loading of wishlist
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
  }, [user, getStorageKey]);

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
