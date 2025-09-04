'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck,
  Minus,
  Plus,
  CheckCircle,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { productStyles } from '@/components/custom/product-styles';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types';

interface ProductPurchaseCardProps {
  product: Product;
  productExtended?: {
    originalPrice: number;
    inStock: boolean;
    stockQuantity: number;
    shipping: {
      price: number;
      freeShippingThreshold: number;
      estimatedDays: string;
    };
    returns: {
      accepted: boolean;
      period: string;
    };
  };
  quantity: number;
  setQuantity: (quantity: number) => void;
  discountPercentage: number;
}

export default function ProductPurchaseCardOptimized({
  product,
  productExtended,
  quantity,
  setQuantity,
  discountPercentage,
}: ProductPurchaseCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Use extended props if available, otherwise use Product props
  const inStock = productExtended?.inStock ?? product.stock > 0;
  const stockQuantity = productExtended?.stockQuantity ?? product.stock;
  const originalPrice = productExtended?.originalPrice ?? product.compareAtPrice ?? product.price;
  const shipping = productExtended?.shipping ?? {
    price: 19.99,
    freeShippingThreshold: 100,
    estimatedDays: '3-5',
  };
  const returns = productExtended?.returns ?? {
    accepted: true,
    period: '30 days',
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    if (isAuthenticated) {
      router.push('/checkout');
    } else {
      router.push('/login?redirect=/checkout');
    }
  };

  return (
    <Card className="w-full sticky top-20 border-0 shadow-none">
      <CardContent className="p-6 space-y-4">
        {/* Price Section - Clean and prominent */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl font-bold">
              ${product.price.toLocaleString()}
            </span>
            {discountPercentage > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  ${originalPrice.toLocaleString()}
                </span>
                <Badge variant="destructive">
                  Save {discountPercentage}%
                </Badge>
              </>
            )}
          </div>

          {/* Stock Status and Delivery - Integrated */}
          {inStock ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className={cn(productStyles.forms.icon.md, "text-success")} />
                <span className={cn(productStyles.typography.meta, "font-medium text-success")}>
                  In Stock
                </span>
                {stockQuantity <= 5 && (
                  <Badge variant="outline" className="border-warning text-warning">
                    Only {stockQuantity} left
                  </Badge>
                )}
              </div>
              
              {/* Delivery info - inline without container */}
              <div className={cn("flex items-center gap-2", productStyles.typography.meta)}>
                <Truck className={cn(productStyles.forms.icon.md, "text-muted-foreground")} />
                <span className="text-muted-foreground">Delivery:</span>
                <span className="font-medium">{shipping.estimatedDays} days</span>
              </div>
              {shipping.freeShippingThreshold && (
                <p className={cn(productStyles.typography.meta, "text-success ml-6")}>
                  FREE shipping on orders over ${shipping.freeShippingThreshold}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className={cn(productStyles.typography.meta, "font-medium text-destructive")}>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Quantity Selector - Clean design */}
        {inStock && (
          <div className="space-y-2">
            <label className={cn(productStyles.typography.meta, "font-medium")}>Quantity:</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className={productStyles.forms.icon.md} />
              </Button>
              <div className="px-4 py-2 border rounded-md min-w-[5rem] text-center font-medium bg-background">
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= stockQuantity}
                aria-label="Increase quantity"
              >
                <Plus className={productStyles.forms.icon.md} />
              </Button>
            </div>
          </div>
        )}

        {/* Primary Actions - Clear hierarchy */}
        {inStock && (
          <div className="space-y-2">
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
            
            <Button 
              variant={isInCart(product.id) ? "outline" : "secondary"} 
              className={cn("w-full", justAdded && "bg-green-50 border-green-500")} 
              size="lg"
              onClick={handleAddToCart}
              disabled={isInCart(product.id) && !justAdded}
            >
              {isInCart(product.id) && !justAdded ? (
                <>
                  <Check className={cn(productStyles.forms.icon.md, "mr-2")} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className={cn(productStyles.forms.icon.md, "mr-2")} />
                  {justAdded ? 'Adding...' : 'Add to Cart'}
                </>
              )}
            </Button>
          </div>
        )}

      </CardContent>
    </Card>
  );
}