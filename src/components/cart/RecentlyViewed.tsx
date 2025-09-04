'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

// Mock recently viewed products (in real app, this would come from localStorage or API)
const mockRecentlyViewed: Product[] = [
  {
    id: '101',
    title: '1952 Mickey Mantle Rookie Card PSA 8',
    slug: 'mickey-mantle-rookie-psa-8',
    description: 'Iconic baseball card in excellent condition',
    price: 12999.99,
    compareAtPrice: 14999.99,
    images: ['https://images.unsplash.com/photo-1626267226925-3ebb9c4e7e2a?w=400&q=80'],
    category: { 
      id: '6', 
      name: 'Sports Memorabilia', 
      slug: 'sports-memorabilia',
      productCount: 920 
    },
    vendor: {
      id: '1',
      userId: 'user1',
      storeName: 'Premium Cards Co.',
      description: 'Specializing in rare cards',
      rating: 4.8,
      totalSales: 1250,
      totalProducts: 156,
      responseTime: '< 1 hour',
      shippingInfo: 'Ships within 24 hours',
      returnPolicy: '30-day returns',
      verified: true,
      createdAt: new Date(),
    },
    condition: 'excellent',
    rarity: 'legendary',
    stock: 1,
    sold: 0,
    views: 234,
    likes: 45,
    tags: ['baseball', 'vintage', 'graded'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '102',
    title: 'Amazing Spider-Man #1 CGC 9.0',
    slug: 'spider-man-1-cgc-9',
    description: 'First appearance of Spider-Man in his own series',
    price: 8999.99,
    images: ['https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&q=80'],
    category: { 
      id: '2', 
      name: 'Comics', 
      slug: 'comics',
      productCount: 850 
    },
    vendor: {
      id: '2',
      userId: 'user2',
      storeName: 'Comic Haven',
      description: 'Your source for comics',
      rating: 4.9,
      totalSales: 890,
      totalProducts: 234,
      responseTime: '< 2 hours',
      shippingInfo: 'Free shipping over $50',
      returnPolicy: '14-day returns',
      verified: true,
      createdAt: new Date(),
    },
    condition: 'mint',
    rarity: 'very-rare',
    stock: 1,
    sold: 2,
    views: 567,
    likes: 89,
    tags: ['marvel', 'silver-age', 'key-issue'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '103',
    title: '1909-S VDB Lincoln Penny MS-65',
    slug: 'lincoln-penny-ms65',
    description: 'Key date Lincoln cent in gem condition',
    price: 2499.99,
    compareAtPrice: 2999.99,
    images: ['https://images.unsplash.com/photo-1621281593168-5b0e3a022ea8?w=400&q=80'],
    category: { 
      id: '3', 
      name: 'Coins', 
      slug: 'coins',
      productCount: 600 
    },
    vendor: {
      id: '3',
      userId: 'user3',
      storeName: 'Vintage Treasures',
      description: 'Curated vintage collectibles',
      rating: 4.7,
      totalSales: 650,
      totalProducts: 178,
      responseTime: '< 3 hours',
      shippingInfo: 'Insured shipping',
      returnPolicy: '7-day returns',
      verified: true,
      createdAt: new Date(),
    },
    condition: 'mint',
    rarity: 'rare',
    stock: 2,
    sold: 5,
    views: 345,
    likes: 67,
    tags: ['lincoln', 'key-date', 'certified'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface RecentlyViewedProps {
  maxItems?: number;
}

export default function RecentlyViewed({ maxItems = 3 }: RecentlyViewedProps) {
  const { addToCart, isInCart } = useCart();
  const products = mockRecentlyViewed.slice(0, maxItems);

  if (products.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Recently Viewed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex gap-4">
              {/* Product Image */}
              <Link href={`/product/${product.id}`}>
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition">
                  <Image
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/product/${product.id}`}
                  className="text-sm font-medium hover:text-primary transition line-clamp-2"
                >
                  {product.title}
                </Link>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      ${product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {product.stock > 0 ? (
                    <Button
                      size="sm"
                      variant={isInCart(product.id) ? "secondary" : "outline"}
                      onClick={() => addToCart(product)}
                      className="text-xs"
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}
                  
                  {product.stock <= 3 && product.stock > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Only {product.stock} left
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockRecentlyViewed.length > maxItems && (
          <div className="mt-4 pt-4 border-t">
            <Link href="/recently-viewed">
              <Button variant="outline" className="w-full" size="sm">
                View All Recently Viewed ({mockRecentlyViewed.length})
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}