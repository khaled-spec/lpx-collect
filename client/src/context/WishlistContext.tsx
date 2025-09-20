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
import { wishlistMockService } from "@/lib/mock/wishlist";

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

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  // Refresh items from the mock service
  const refreshItems = useCallback(() => {
    if (!mounted) return;
    const wishlistItems = wishlistMockService.getWishlist();
    const products = wishlistItems.map(item => item.product);
    setItems(products);
  }, [mounted]);

  // Load wishlist on mount (client-side only)
  useEffect(() => {
    setMounted(true);

    // Force load sample data if wishlist is empty and we're in development
    const currentItems = wishlistMockService.getWishlist();
    if (currentItems.length === 0 && process.env.NODE_ENV === 'development') {
      console.log('❤️ Wishlist is empty, loading sample data...');
      wishlistMockService.loadSampleData();
    }

    refreshItems();
  }, [refreshItems]);

  const addToWishlist = useCallback((product: Product) => {
    if (!mounted) return;

    const result = wishlistMockService.addToWishlist(product);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.info(result.message);
    }

    refreshItems();
  }, [refreshItems, mounted]);

  const removeFromWishlist = useCallback((productId: string) => {
    if (!mounted) return;

    const result = wishlistMockService.removeFromWishlist(productId);

    if (result.success) {
      toast.success(result.message);
    }

    refreshItems();
  }, [refreshItems, mounted]);

  const isInWishlist = useCallback((productId: string) => {
    if (!mounted) return false;
    return wishlistMockService.isInWishlist(productId);
  }, [mounted]);

  const clearWishlist = useCallback(() => {
    if (!mounted) return;

    const result = wishlistMockService.clearWishlist();

    if (result.success) {
      toast.success(result.message);
    }

    refreshItems();
  }, [refreshItems, mounted]);

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
