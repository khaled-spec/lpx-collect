"use client";

import { ProductCard } from "./ProductCard";
import type { Product as OldProduct } from "@/types";
import type { Product as NewProduct } from "@/lib/api/types";

interface LegacyProductCardProps {
  product: OldProduct;
  viewMode?: "grid" | "list";
  variant?: string;
  imageMode?: string;
  className?: string;
}

/**
 * Adapter component to make old Product type work with new ProductCard
 */
export default function LegacyProductCard({ 
  product, 
  viewMode = "grid",
  variant,
  imageMode,
  className 
}: LegacyProductCardProps) {
  // Convert old Product type to new Product type
  const adaptedProduct: NewProduct = {
    id: product.id,
    name: product.title, // title -> name
    description: product.description,
    price: product.price,
    image: product.images[0] || "",
    images: product.images,
    category: product.category.name,
    categorySlug: product.category.slug,
    vendor: product.vendor.storeName,
    vendorId: product.vendor.id,
    rating: product.vendor.rating || 0,
    reviews: 0, // Product type doesn't have reviews field
    stock: product.stock,
    condition: product.condition === "new" ? "mint" : product.condition as any, // Map "new" to "mint"
    rarity: product.rarity === "very-rare" ? "ultra-rare" : product.rarity as any, // Map "very-rare" to "ultra-rare"
    authenticity: undefined, // Product type doesn't have authenticity field
    featured: product.featured,
    tags: product.tags,
  };

  // Convert viewMode from old format to new format
  const newViewMode = viewMode === "list" ? "horizontal" : "vertical";

  return (
    <ProductCard
      product={adaptedProduct}
      viewMode={newViewMode}
      compact={variant === "compact"}
      className={className}
    />
  );
}