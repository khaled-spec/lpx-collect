"use client";

import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { designTokens } from "@/design-system/compat";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

function WishlistContent() {
  const { items, clearWishlist, removeFromWishlist } = useWishlist();

  const breadcrumbs = [{ label: "Wishlist" }];

  if (items.length === 0) {
    return (
      <PageLayout
        title="My Wishlist"
        description="Save your favorite items for later"
        breadcrumbs={breadcrumbs}
      >
        <EmptyStates.NoWishlistItems />
      </PageLayout>
    );
  }

  // Transform wishlist items to match Product type for ProductCard
  const products = items.map((item: Product) => ({
    ...item,
    image: item.images?.[0] || "",
    categorySlug:
      typeof item.category === "object"
        ? item.category?.slug || "uncategorized"
        : item.category || "uncategorized",
    vendor:
      typeof item.vendor === "object"
        ? item.vendor?.storeName || "Unknown Vendor"
        : item.vendor || "Unknown Vendor",
    vendorId:
      typeof item.vendor === "object"
        ? item.vendor?.id || "unknown"
        : "unknown",
    name: item.title || "Untitled",
    category:
      typeof item.category === "object"
        ? item.category?.name || "Uncategorized"
        : item.category || "Uncategorized",
    originalPrice: item.compareAtPrice || 0,
    state: "open" as const,
    rating: 0,
    reviewCount: 0,
    isActive: true,
    tags: item.tags || [],
    year: new Date().getFullYear(),
    manufacturer: "Unknown",
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
    updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
  }));

  return (
    <PageLayout
      title="My Wishlist"
      description={`You have ${items.length} ${items.length === 1 ? "item" : "items"} saved`}
      breadcrumbs={breadcrumbs}
    >
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={cn(designTokens.typography.h3)}>
          {items.length} Saved {items.length === 1 ? "Item" : "Items"}
        </h2>
        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearWishlist}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Products Grid */}
      <div
        className={cn(
          "grid gap-6",
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        )}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode="grid"
            onAddToCart={(p) => {
              if (process.env.NODE_ENV !== "production")
                console.log("Add to cart:", p);
            }}
            onAddToWishlist={(p) => removeFromWishlist(p.id)}
            onBuyNow={(p) => {
              if (process.env.NODE_ENV !== "production")
                console.log("Buy now:", p);
            }}
            onShare={(p) => {
              if (process.env.NODE_ENV !== "production")
                console.log("Share:", p);
            }}
          />
        ))}
      </div>

      {/* Continue Shopping */}
      {items.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-center">
            <h3 className={cn(designTokens.typography.h4, "mb-4")}>
              Looking for more?
            </h3>
            <p className="text-muted-foreground mb-6">
              Discover more unique collectibles from our verified vendors
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/browse">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Browse Collection
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/vendors">
                  Explore Vendors
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default function WishlistPage() {
  return <WishlistContent />;
}
