'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  ShoppingCart, 
  Heart, 
  Zap, 
  Plus, 
  Minus, 
  Share2,
  Bell,
  Tag
} from 'lucide-react';

interface ProductActionsProps {
  product: {
    id: string;
    title: string;
    price: number;
    stockQuantity: number;
    inStock: boolean;
  };
  quantity: number;
  setQuantity: (quantity: number) => void;
  isWishlisted: boolean;
  setIsWishlisted: (wishlisted: boolean) => void;
}

export default function ProductActions({
  product,
  quantity,
  setQuantity,
  isWishlisted,
  setIsWishlisted,
}: ProductActionsProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAddingToCart(false);
    toast.success(`Added ${quantity} item(s) to cart`, {
      description: product.title.substring(0, 50) + '...',
    });
  };

  const handleBuyNow = async () => {
    setIsBuyingNow(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsBuyingNow(false);
    toast.success('Redirecting to checkout...');
    // In real app, redirect to checkout
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this item: ${product.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleMakeOffer = () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast.error('Please enter a valid offer amount');
      return;
    }
    toast.success(`Offer of $${offerAmount} submitted`, {
      description: 'The seller will review your offer',
    });
    setOfferAmount('');
  };

  const subtotal = product.price * quantity;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Quantity Selector */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-20 text-center"
              min={1}
              max={product.stockQuantity}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stockQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground ml-2">
              {product.stockQuantity} available
            </span>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="text-xl font-bold">
              ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {quantity > 1 && (
            <p className="text-xs text-muted-foreground mt-1">
              ${product.price.toFixed(2)} each
            </p>
          )}
        </div>

        {/* Primary Actions */}
        <div className="space-y-2">
          <Button
            className="w-full"
            size="lg"
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddingToCart}
          >
            {isAddingToCart ? (
              <span className="animate-pulse">Adding...</span>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
          
          <Button
            className="w-full"
            size="lg"
            variant="secondary"
            onClick={handleBuyNow}
            disabled={!product.inStock || isBuyingNow}
          >
            {isBuyingNow ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Buy Now
              </>
            )}
          </Button>
        </div>

        <Separator />

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleWishlist}
            className={cn(isWishlisted && "text-red-600 border-red-600")}
          >
            <Heart 
              className={cn(
                "h-4 w-4 mr-2",
                isWishlisted && "fill-current"
              )} 
            />
            {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Make an Offer */}
        <div className="space-y-2">
          <Label htmlFor="offer">Make an Offer</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="offer"
                type="number"
                placeholder="Enter amount"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button 
              variant="outline"
              onClick={handleMakeOffer}
            >
              <Tag className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            The seller will be notified of your offer
          </p>
        </div>

        {/* Watch Price */}
        <Button variant="ghost" className="w-full" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Watch for Price Drops
        </Button>
      </CardContent>
    </Card>
  );
}