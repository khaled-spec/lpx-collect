'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye, Star, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FeaturedBadge, DiscountBadge, StockBadge, CategoryBadge, VerifiedBadge } from '@/components/custom/badge-variants';
import { IconButton, CartButton } from '@/components/custom/button-variants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  productStyles, 
  getProductClasses, 
  getContentClasses,
  getImageContainerClasses,
  getImageClasses 
} from '@/components/custom/product-styles';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'large';
  viewMode?: 'grid' | 'list';
  imageMode?: 'contain' | 'cover' | 'fill' | 'scale';
  className?: string;
}

export default function ProductCard({ 
  product, 
  variant = 'default',
  viewMode = 'grid',
  imageMode = 'contain',
  className 
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Add to cart:', product.id);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  if (viewMode === 'list') {
    return (
      <Link href={`/product/${product.slug}`} className="group block">
        <div className={cn(productStyles.list.container, className)}>
          {/* Image */}
          <div className={cn(productStyles.list.imageContainer, "flex items-center justify-center")}>
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
                  {product.category.name} • {product.condition}
                </p>
                <h3 className={cn(productStyles.typography.title, "text-base")}>
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className={productStyles.typography.vendor}>
                    {product.vendor.storeName}
                  </p>
                  {product.vendor.verified && <VerifiedBadge className="h-4" />}
                </div>
              </div>
              <div className="text-right">
                <span className={productStyles.typography.price.current}>
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className={cn(productStyles.typography.price.original, "block")}>
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4">
                {product.vendor.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className={productStyles.typography.meta}>
                      {product.vendor.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                <span className={productStyles.typography.meta}>
                  {product.sold} sold
                </span>
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
                  <Heart className={cn(
                    "h-4 w-4",
                    isLiked && "fill-red-500 text-red-500"
                  )} />
                </IconButton>
                <CartButton size="sm" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4" />
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
          {product.featured && (
            <FeaturedBadge className={productStyles.badges.topLeft}>
              Featured
            </FeaturedBadge>
          )}
          {discountPercentage > 0 && (
            <DiscountBadge className={productStyles.badges.topRight}>
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
                          isLiked ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isLiked ? 'Remove from favorites' : 'Add to favorites'}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton
                      variant="secondary"
                      className={productStyles.actions.button}
                    >
                      <Eye className="h-4 w-4" />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Quick view</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Content with flex-grow to push elements to consistent positions */}
        <div className={getContentClasses(variant)}>
          {/* Category & Condition */}
          <div className="flex items-center gap-2">
            <span className={productStyles.typography.category}>
              {product.category.name}
            </span>
            <span className="text-xs text-muted-foreground/50">•</span>
            <span className={cn(productStyles.typography.category, "capitalize")}>
              {product.condition}
            </span>
          </div>

          {/* Title */}
          <h3 className={productStyles.typography.title}>
            {product.title}
          </h3>

          {/* Vendor */}
          <div className="flex items-center gap-2">
            <p className={productStyles.typography.vendor}>
              by {product.vendor.storeName}
            </p>
            {product.vendor.verified && (
              <VerifiedBadge className="h-4" />
            )}
          </div>

          {/* Rating */}
          {product.vendor.rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className={productStyles.typography.meta}>
                  {product.vendor.rating.toFixed(1)}
                </span>
              </div>
              <span className={productStyles.typography.meta}>
                ({product.sold} sold)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={productStyles.typography.price.current}>
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className={productStyles.typography.price.original}>
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Add to Cart Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CartButton
                    onClick={handleAddToCart}
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </CartButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to cart</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Stock Status */}
          {(product.stock <= 5 || product.stock === 0) && (
            <StockBadge stock={product.stock} className="mt-2" />
          )}
        </div>
      </Card>
    </Link>
  );
}