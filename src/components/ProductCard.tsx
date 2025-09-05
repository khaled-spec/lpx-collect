"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Package, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/custom/button-variants";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/api/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
  viewMode?: "vertical" | "horizontal";
  compact?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  viewMode = "vertical",
  compact = false,
  className,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.();
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.();
  };

  // Horizontal/List view
  if (viewMode === "horizontal") {
    return (
      <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow", className)}>
        <Link href={`/product/${product.id}`} className="flex gap-4 p-4">
          {/* Image */}
          <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            {!imageError && product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">
                  {product.category}
                </p>
                <h3 className="font-semibold text-sm truncate mb-1">
                  {product.name}
                </h3>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.condition && (
                    <Badge variant="outline" className="text-xs">
                      {product.condition}
                    </Badge>
                  )}
                  {product.rarity && (
                    <Badge variant="secondary" className="text-xs">
                      {product.rarity}
                    </Badge>
                  )}
                  {product.authenticity?.verified && (
                    <Badge variant="default" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Vendor and Rating */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{product.vendor}</span>
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{product.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="text-lg font-bold">{formatPrice(product.price)}</p>
                  {product.stock <= 5 && product.stock > 0 && (
                    <p className="text-xs text-orange-500">Only {product.stock} left</p>
                  )}
                  {product.stock === 0 && (
                    <p className="text-xs text-red-500">Out of stock</p>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleWishlist}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        isWishlisted && "fill-red-500 text-red-500"
                      )}
                    />
                  </IconButton>
                  <Button
                    size="sm"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  // Vertical/Grid view
  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-lg transition-shadow",
      compact && "scale-95",
      className
    )}>
      <Link href={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className={cn(
          "relative bg-gray-100 overflow-hidden",
          compact ? "h-32" : "h-48"
        )}>
          {product.featured && (
            <Badge className="absolute top-2 left-2 z-10" variant="destructive">
              Featured
            </Badge>
          )}
          {!imageError && product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          
          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <IconButton
              variant="secondary"
              size="sm"
              onClick={handleToggleWishlist}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isWishlisted && "fill-red-500 text-red-500"
                )}
              />
            </IconButton>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className={cn("p-4", compact && "p-3")}>
          <p className="text-xs text-muted-foreground mb-1">
            {product.category}
          </p>
          <h3 className={cn(
            "font-semibold mb-2 line-clamp-2",
            compact ? "text-sm" : "text-base"
          )}>
            {product.name}
          </h3>
          
          {/* Badges */}
          {!compact && (
            <div className="flex flex-wrap gap-1 mb-2">
              {product.condition && (
                <Badge variant="outline" className="text-xs">
                  {product.condition}
                </Badge>
              )}
              {product.rarity && (
                <Badge variant="secondary" className="text-xs">
                  {product.rarity}
                </Badge>
              )}
            </div>
          )}

          {/* Vendor and Rating */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground truncate">
              {product.vendor}
            </span>
            {product.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Price and Stock */}
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                "font-bold",
                compact ? "text-sm" : "text-lg"
              )}>
                {formatPrice(product.price)}
              </p>
              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-xs text-orange-500">Only {product.stock} left</p>
              )}
              {product.stock === 0 && (
                <p className="text-xs text-red-500">Out of stock</p>
              )}
            </div>
            
            {/* Quick Add to Cart */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    size="sm"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to cart</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Link>
    </Card>
  );
}