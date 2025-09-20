"use client";

import { useWishlist } from "@/context/WishlistContext";
import PageLayout from "@/components/layout/PageLayout";
import { ProductCard } from "@/components/shared/ProductCard";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { designTokens } from "@/lib/design-tokens";

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
  const products = items.map((item: any) => ({
    ...item,
    image: item.images?.[0] || "",
    categorySlug: item.categorySlug || "uncategorized",
    vendor: typeof item.vendor === 'object' ? item.vendor?.storeName || "Unknown Vendor" : item.vendor || "Unknown Vendor",
    vendorId: typeof item.vendor === 'object' ? item.vendor?.id : undefined,
    name: item.title || item.name || "Untitled",
    category: typeof item.category === 'object' ? item.category?.name || "Uncategorized" : item.category || "Uncategorized",
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
            onAddToCart={(p) => console.log("Add to cart:", p)}
            onAddToWishlist={(p) => removeFromWishlist(p.id)}
            onBuyNow={(p) => console.log("Buy now:", p)}
            onShare={(p) => console.log("Share:", p)}
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
