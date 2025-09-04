'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Star, Shield, Award, CheckCircle } from 'lucide-react';

interface ProductInfoProps {
  product: {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    category: string;
    subcategory: string;
    condition: string;
    rarity: string;
    inStock: boolean;
    stockQuantity: number;
    description: string;
    authenticity: {
      verified: boolean;
      certificate: boolean;
      verifiedBy: string;
      certificateNumber: string;
    };
  };
  discountPercentage: number;
}

const conditionColors: Record<string, string> = {
  'Mint': 'bg-green-100 text-green-800 border-green-300',
  'Near Mint': 'bg-blue-100 text-blue-800 border-blue-300',
  'Excellent': 'bg-cyan-100 text-cyan-800 border-cyan-300',
  'Very Good': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Good': 'bg-orange-100 text-orange-800 border-orange-300',
  'Fair': 'bg-red-100 text-red-800 border-red-300',
};

const rarityColors: Record<string, string> = {
  'Ultra Rare': 'bg-purple-100 text-purple-800 border-purple-300',
  'Super Rare': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'Rare': 'bg-blue-100 text-blue-800 border-blue-300',
  'Uncommon': 'bg-green-100 text-green-800 border-green-300',
  'Common': 'bg-gray-100 text-gray-800 border-gray-300',
};

export default function ProductInfo({ product, discountPercentage }: ProductInfoProps) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        {product.title}
      </h1>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant="outline" 
          className={cn("font-medium", conditionColors[product.condition])}
        >
          {product.condition}
        </Badge>
        <Badge 
          variant="outline" 
          className={cn("font-medium", rarityColors[product.rarity])}
        >
          <Star className="h-3 w-3 mr-1" />
          {product.rarity}
        </Badge>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl md:text-4xl font-bold text-foreground">
            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          {discountPercentage > 0 && (
            <>
              <span className="text-xl text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <Badge variant="destructive" className="ml-2">
                {discountPercentage}% OFF
              </Badge>
            </>
          )}
        </div>
        
        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {product.inStock ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium">In Stock</span>
              {product.stockQuantity === 1 && (
                <Badge variant="outline" className="ml-2 text-orange-600 border-orange-300">
                  Only 1 left!
                </Badge>
              )}
              {product.stockQuantity > 1 && product.stockQuantity <= 5 && (
                <Badge variant="outline" className="ml-2 text-orange-600 border-orange-300">
                  Only {product.stockQuantity} left
                </Badge>
              )}
            </>
          ) : (
            <>
              <span className="text-red-600 font-medium">Out of Stock</span>
            </>
          )}
        </div>
      </div>

      {/* Authentication Details */}
      {product.authenticity.verified && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                Verified by {product.authenticity.verifiedBy}
              </p>
              {product.authenticity.certificateNumber && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  Certificate: {product.authenticity.certificateNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Description */}
      <div className="prose prose-sm max-w-none text-muted-foreground">
        <p className="line-clamp-3">
          {product.description.split('\n')[0]}
        </p>
      </div>
    </div>
  );
}