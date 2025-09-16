"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

// TODO: Replace with actual data from localStorage or API
const mockRecentlyViewed: Product[] = [];

interface RecentlyViewedProps {
  className?: string;
}

export default function RecentlyViewed({ className }: RecentlyViewedProps) {
  const { addToCart } = useCart();

  if (mockRecentlyViewed.length === 0) {
    return null;
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Recently Viewed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRecentlyViewed.map((product) => (
            <div key={product.id} className="flex gap-4">
              <Link
                href={`/product/${product.slug}`}
                className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-50"
              >
                <Image
                  src={product.images[0] || "/placeholder.jpg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${product.slug}`}
                  className="font-medium text-sm hover:underline line-clamp-2"
                >
                  {product.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  {product.compareAtPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-sm font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {product.condition && (
                    <Badge variant="secondary" className="text-xs">
                      {product.condition}
                    </Badge>
                  )}
                  {product.stock === 1 && (
                    <Badge
                      variant="outline"
                      className="text-xs border-orange-200 text-orange-700"
                    >
                      Last one!
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToCart(product, 1)}
                className="flex-shrink-0"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Link
          href="/recently-viewed"
          className="block text-center text-sm text-blue-600 hover:underline mt-4 pt-4 border-t"
        >
          View All Recently Viewed
        </Link>
      </CardContent>
    </Card>
  );
}
