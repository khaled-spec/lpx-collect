'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Minus, 
  Plus, 
  X, 
  Heart,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerifiedBadge } from '@/components/custom/badge-variants';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { product, quantity } = item;

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdating(true);
    onUpdateQuantity(item.id, newQuantity);
    setTimeout(() => setIsUpdating(false), 300);
  };

  const subtotal = product.price * quantity;
  const savings = product.compareAtPrice 
    ? (product.compareAtPrice - product.price) * quantity 
    : 0;

  const conditionColors = {
    new: 'bg-green-100 text-green-800',
    mint: 'bg-blue-100 text-blue-800',
    excellent: 'bg-indigo-100 text-indigo-800',
    good: 'bg-yellow-100 text-yellow-800',
    fair: 'bg-orange-100 text-orange-800',
    poor: 'bg-red-100 text-red-800',
  };

  const rarityColors = {
    common: 'bg-gray-100 text-gray-800',
    uncommon: 'bg-green-100 text-green-800',
    rare: 'bg-blue-100 text-blue-800',
    'very-rare': 'bg-purple-100 text-purple-800',
    legendary: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
          <Link href={`/product/${product.id}`}>
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition">
              <Image
                src={product.images[0] || '/placeholder.png'}
                alt={product.title}
                fill
                className="object-cover"
              />
              {product.stock <= 5 && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive" className="text-xs">
                    Low Stock
                  </Badge>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-2">
          {/* Title and Remove Button */}
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <Link 
                href={`/product/${product.id}`}
                className="font-medium text-base sm:text-lg hover:text-primary transition line-clamp-2"
              >
                {product.title}
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Product Meta */}
          <div className="flex flex-wrap gap-2">
            {product.condition && (
              <Badge variant="secondary" className={cn("text-xs", conditionColors[product.condition])}>
                {product.condition}
              </Badge>
            )}
            {product.rarity && (
              <Badge variant="secondary" className={cn("text-xs", rarityColors[product.rarity])}>
                {product.rarity}
              </Badge>
            )}
            {product.vendor.verified && (
              <VerifiedBadge className="h-5">
                {product.vendor.storeName}
              </VerifiedBadge>
            )}
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
            {/* Price Section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold">
                  ${subtotal.toFixed(2)}
                </span>
                {savings > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${(product.compareAtPrice! * quantity).toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                ${product.price.toFixed(2)} each
              </p>
              {savings > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  You save ${savings.toFixed(2)}
                </p>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || isUpdating}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      handleQuantityChange(val);
                    }
                  }}
                  className="w-12 text-center border-none outline-none focus:ring-0"
                  min="1"
                  max={product.stock}
                  disabled={isUpdating}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock || isUpdating}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {product.stock <= 10 && (
                <span className="text-xs text-muted-foreground">
                  ({product.stock} available)
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              <Heart className="h-3 w-3 mr-1" />
              Save for later
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              <Package className="h-3 w-3 mr-1" />
              View similar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}