"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Package, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DiscountBadge,
  StockBadge,
  VerifiedBadge,
} from "@/components/custom/badge-variants";
import { IconButton, CartButton } from "@/components/custom/button-variants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  productStyles,
  getProductClasses,
  getContentClasses,
  getImageContainerClasses,
  getImageClasses,
} from "@/components/custom/product-styles";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "large";
  viewMode?: "grid" | "list";
  imageMode?: "contain" | "cover" | "fill" | "scale";
  className?: string;
}

// Format number with thousand separators
const formatPrice = (num: number) => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function ProductCard({
  product,
  variant = "default",
  viewMode = "grid",
  imageMode = "contain",
  className,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isLiked = isInWishlist(product.id);

  const discountPercentage = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (viewMode === "list") {
    return (
      <Link href={`/product/${product.slug}`} className="group block">
        <div className={cn(productStyles.list.container, className)}>
          {/* Image */}
          <div
            className={cn(
              productStyles.list.imageContainer,
              "flex items-center justify-center",
            )}
          >
            {!imageError && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                width={128}
                height={128}
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <Package className="h-12 w-12 text-muted-foreground/30" />
            )}
          </div>

          {/* Content */}
          <div className={productStyles.list.content}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={productStyles.typography.category}>
                  {product.category.name}
                </p>
                <h3 className={cn(productStyles.typography.title, "text-base")}>
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      productStyles.badges.size.md,
                      productStyles.badges.base,
                    )}
                  >
                    {product.condition}
                  </Badge>
                  {product.rarity && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        productStyles.badges.size.md,
                        productStyles.badges.base,
                      )}
                    >
                      {product.rarity}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className={productStyles.typography.vendor}>
                    {product.vendor.storeName}
                  </p>
                  {product.vendor.rating > 0 && (
                    <div className={productStyles.rating.container}>
                      <Star className={productStyles.rating.star} />
                      <span className={productStyles.rating.text}>
                        {product.vendor.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {product.vendor.verified && (
                    <VerifiedBadge
                      className={cn(
                        productStyles.badges.size.md,
                        productStyles.badges.base,
                      )}
                    />
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className={productStyles.typography.price.current}>
                  ${formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span
                    className={cn(
                      productStyles.typography.price.original,
                      "block",
                    )}
                  >
                    ${formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4">
                {product.stock <= 5 && product.stock > 0 && (
                  <StockBadge stock={product.stock} />
                )}
              </div>
              <div className={productStyles.list.actions}>
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleLike}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      isLiked && "fill-red-500 text-red-500",
                    )}
                  />
                </IconButton>
                <CartButton
                  className={productStyles.actions.cartButton.sm}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className={productStyles.actions.icon.sm} />
                </CartButton>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <Card className={getProductClasses(variant, className)}>
        {/* Image Container with fixed dimensions */}
        <div className={getImageContainerClasses(variant)}>
          {discountPercentage > 0 && (
            <DiscountBadge className={productStyles.badges.position.topRight}>
              -{discountPercentage}%
            </DiscountBadge>
          )}

          {!imageError && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={getImageClasses(imageMode)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-20 w-20 text-muted-foreground/30" />
            </div>
          )}

          {/* Hover Actions */}
          <div className={productStyles.actions.container}>
            <div className={productStyles.actions.buttonGroup}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton
                      variant="secondary"
                      className={productStyles.actions.button}
                      onClick={handleToggleLike}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isLiked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isLiked ? "Remove from favorites" : "Add to favorites"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Content with flex-grow to push elements to consistent positions */}
        <div className={getContentClasses(variant)}>
          {/* Category */}
          <div className="flex items-center gap-2 h-4">
            <span className={productStyles.typography.category}>
              {product.category.name}
            </span>
          </div>

          {/* Title - Fixed height with line clamp */}
          <h3 className={productStyles.typography.title}>{product.title}</h3>

          {/* Badges - Fixed height */}
          <div className="flex items-center gap-1.5 h-5">
            <Badge
              variant="outline"
              className={cn(
                productStyles.badges.size.md,
                productStyles.badges.base,
              )}
            >
              {product.condition}
            </Badge>
            {product.rarity && (
              <Badge
                variant="secondary"
                className={cn(
                  productStyles.badges.size.md,
                  productStyles.badges.base,
                )}
              >
                {product.rarity}
              </Badge>
            )}
          </div>

          {/* Vendor with Rating - Fixed height */}
          <div className="flex items-center gap-1.5 h-5">
            <p className={productStyles.typography.vendor}>
              by {product.vendor.storeName}
            </p>
            {product.vendor.rating > 0 && (
              <div className={productStyles.rating.container}>
                <Star className={productStyles.rating.star} />
                <span className={productStyles.rating.text}>
                  {product.vendor.rating.toFixed(1)}
                </span>
              </div>
            )}
            {product.vendor.verified && (
              <VerifiedBadge
                className={cn(
                  productStyles.badges.size.md,
                  productStyles.badges.base,
                )}
              />
            )}
          </div>

          {/* Price - Fixed height */}
          <div className="flex items-center justify-between h-8">
            <div className="flex items-center gap-2">
              <span className={productStyles.typography.price.current}>
                ${formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className={productStyles.typography.price.original}>
                  ${formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CartButton
                    onClick={handleAddToCart}
                    className={productStyles.actions.cartButton.md}
                  >
                    <ShoppingCart className={productStyles.actions.icon.md} />
                  </CartButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to cart</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Spacer to push stock badge to bottom */}
          <div className="flex-grow" />

          {/* Stock Status */}
          {(product.stock <= 5 || product.stock === 0) && (
            <StockBadge stock={product.stock} className="mt-auto" />
          )}
        </div>
      </Card>
    </Link>
  );
}
