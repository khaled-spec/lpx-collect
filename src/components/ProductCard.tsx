'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye, Star, Package } from 'lucide-react';
import { ProductCard as ProductCardVariant } from '@/components/custom/card-variants';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FeaturedBadge, DiscountBadge, StockBadge, CategoryBadge, VerifiedBadge } from '@/components/custom/badge-variants';
import { IconButton, CartButton } from '@/components/custom/button-variants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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

  return (
    <Link href={`/product/${product.slug}`} className="group">
      <ProductCardVariant>
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
          {product.featured && (
            <FeaturedBadge className="absolute top-2 left-2 z-10">
              Featured
            </FeaturedBadge>
          )}
          {discountPercentage > 0 && (
            <DiscountBadge className="absolute top-2 right-2 z-10">
              -{discountPercentage}%
            </DiscountBadge>
          )}
          
          {!imageError && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="h-16 w-16" />
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300">
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton
                      variant="secondary"
                      className="bg-white dark:bg-gray-800"
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
                      className="bg-white dark:bg-gray-800"
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

        {/* Content */}
        <CardContent className="p-4">
          {/* Category & Condition */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {product.category.name}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {product.condition}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-primary transition">
            {product.title}
          </h3>

          {/* Vendor */}
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              by {product.vendor.storeName}
            </p>
            {product.vendor.verified && (
              <VerifiedBadge className="h-4" />
            )}
          </div>

          {/* Rating */}
          {product.vendor.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.vendor.rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-400">
                ({product.sold} sold)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-400 line-through">
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
        </CardContent>
      </ProductCardVariant>
    </Link>
  );
}