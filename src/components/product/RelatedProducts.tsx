'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Star } from 'lucide-react';

interface RelatedProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: string;
  vendor: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="mt-16">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">You May Also Like</h2>
        <p className="text-muted-foreground mt-1">
          Similar items from our collection
        </p>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <Link href={`/product/${product.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      {product.condition}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                      {product.title}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-xl font-bold">
                        ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {product.vendor}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>

      {/* Recently Viewed Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Recently Viewed</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.slice(0, 6).map((product) => (
            <Link key={`recent-${product.id}`} href={`/product/${product.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="text-xs line-clamp-2 mb-1">{product.title}</p>
                  <p className="text-sm font-bold">
                    ${product.price.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}