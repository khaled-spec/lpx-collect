'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductPurchaseCard from '@/components/product/ProductPurchaseCardOptimized';
import ProductDetailsTabbed from '@/components/product/ProductDetailsTabbed';
import RelatedProducts from '@/components/product/RelatedProducts';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Award, TrendingUp, Star } from 'lucide-react';

// Mock product data (same as before)
const mockProduct = {
  id: '1',
  title: '1999 Pokémon Base Set Charizard Holo #4/102 PSA 9 MINT',
  price: 4999.99,
  originalPrice: 5999.99,
  category: 'Trading Cards',
  subcategory: 'Pokémon',
  condition: 'Mint',
  rarity: 'Ultra Rare',
  inStock: true,
  stockQuantity: 1,
  images: [
    'https://images.unsplash.com/photo-1679678691006-0ad24fecb769?w=800&q=80',
    'https://images.unsplash.com/photo-1679678691170-7781f11f9d86?w=800&q=80',
    'https://images.unsplash.com/photo-1679678691250-a14e09c004c7?w=800&q=80',
    'https://images.unsplash.com/photo-1679678691328-54929d271c3f?w=800&q=80',
  ],
  description: `This is an authentic 1999 Pokémon Base Set Charizard holographic card, professionally graded PSA 9 MINT condition. This iconic card is one of the most sought-after cards in the entire Pokémon Trading Card Game.`,
  specifications: {
    'Card Number': '4/102',
    'Set': 'Base Set',
    'Release Year': '1999',
    'Grade': 'PSA 9',
    'Grading Company': 'PSA',
    'Serial Number': '12345678',
    'Language': 'English',
    'Card Type': 'Holographic',
    'Manufacturer': 'Wizards of the Coast',
  },
  vendor: {
    id: 'vendor1',
    name: 'Elite Collectibles Co.',
    rating: 4.8,
    reviewCount: 2341,
    verified: true,
    responseTime: '< 1 hour',
    salesCount: 5432,
    joinedDate: '2019',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  },
  shipping: {
    price: 19.99,
    expedited: 49.99,
    estimatedDays: '3-5',
    expeditedDays: '1-2',
    freeShippingThreshold: 100,
    locations: 'Ships to United States',
  },
  returns: {
    accepted: true,
    period: '30 days',
    condition: 'Item must be in original sealed holder',
    restockingFee: false,
  },
  authenticity: {
    verified: true,
    certificate: true,
    verifiedBy: 'PSA Authentication Services',
    certificateNumber: 'PSA-12345678',
  },
};

const mockReviews = [
  {
    id: '1',
    author: 'John D.',
    rating: 5,
    date: '2024-01-15',
    verified: true,
    title: 'Amazing condition!',
    content: 'The card arrived exactly as described. Perfect PSA 9 condition, fast shipping, and excellent packaging. Highly recommend this seller!',
    helpful: 45,
    images: [],
  },
  {
    id: '2',
    author: 'Sarah M.',
    rating: 5,
    date: '2024-01-10',
    verified: true,
    title: 'Dream card acquired!',
    content: 'Finally got my hands on this grail card. The seller was responsive and the authenticity is guaranteed. Could not be happier!',
    helpful: 32,
    images: [],
  },
  {
    id: '3',
    author: 'Mike R.',
    rating: 4,
    date: '2023-12-28',
    verified: true,
    title: 'Great card, minor shipping delay',
    content: 'The card is absolutely beautiful and exactly as pictured. Only minor issue was a 2-day shipping delay due to weather, but seller kept me updated.',
    helpful: 18,
    images: [],
  },
];

const mockQuestions = [
  {
    id: '1',
    question: 'Is this card guaranteed authentic?',
    answer: 'Yes, this card has been professionally authenticated and graded by PSA. It comes with a certificate of authenticity.',
    askedBy: 'User123',
    answeredBy: 'Elite Collectibles Co.',
    date: '2024-01-12',
  },
  {
    id: '2',
    question: 'Do you accept offers on this item?',
    answer: 'We occasionally consider reasonable offers. Please use the "Make an Offer" button to submit your best offer.',
    askedBy: 'Collector99',
    answeredBy: 'Elite Collectibles Co.',
    date: '2024-01-08',
  },
];

const mockRelatedProducts = [
  {
    id: '2',
    title: '1999 Pokémon Base Set Blastoise Holo #2/102',
    price: 1999.99,
    image: 'https://images.unsplash.com/photo-1679678690998-88c8711cbe5f?w=400&q=80',
    condition: 'Near Mint',
    vendor: 'Card Masters',
  },
  {
    id: '3',
    title: '1999 Pokémon Base Set Venusaur Holo #15/102',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1679678691010-894374986c72?w=400&q=80',
    condition: 'Excellent',
    vendor: 'Vintage Cards Plus',
  },
  {
    id: '4',
    title: '1999 Pokémon Jungle Set Flareon Holo',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1679678691006-0ad24fecb769?w=400&q=80',
    condition: 'Near Mint',
    vendor: 'Elite Collectibles Co.',
  },
  {
    id: '5',
    title: '1999 Pokémon Base Set Mewtwo Holo #10/102',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1679678691170-7781f11f9d86?w=400&q=80',
    condition: 'Mint',
    vendor: 'Card Kingdom',
  },
];

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: mockProduct.title,
        text: `Check out this ${mockProduct.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const discountPercentage = Math.round(
    ((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-4">
        {/* Breadcrumb - Smaller */}
        <Breadcrumb className="mb-3">
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/browse">Browse</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${mockProduct.category.toLowerCase().replace(' ', '-')}`}>
                {mockProduct.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{mockProduct.subcategory}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title */}
        <div className="my-6">
          <h1 className="text-3xl font-bold">{mockProduct.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-muted-foreground">by</span>
            <span className="font-medium">{mockProduct.vendor.name}</span>
            <div className="flex items-center gap-0.5">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{mockProduct.vendor.rating}</span>
              <span className="text-sm text-muted-foreground">({mockProduct.vendor.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          {/* Left: Product Images - 4 cols */}
          <div className="lg:col-span-4">
            <div className="sticky top-4">
              <ProductImageGallery 
                images={mockProduct.images}
                title={mockProduct.title}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
                isWishlisted={isWishlisted}
                onWishlistToggle={() => setIsWishlisted(!isWishlisted)}
                onShare={handleShare}
              />
            </div>
          </div>

          {/* Middle: Checkout Card - 4 cols */}
          <div className="lg:col-span-4">
            <div className="sticky top-4">
              <ProductPurchaseCard
                product={mockProduct}
                quantity={quantity}
                setQuantity={setQuantity}
                discountPercentage={discountPercentage}
              />
            </div>
          </div>

          {/* Right: Product Info and Details Tabs - 4 cols */}
          <div className="lg:col-span-4">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-4">
                {/* Badges and Description */}
                <div>
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {mockProduct.condition}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {mockProduct.rarity}
                    </Badge>
                    {mockProduct.authenticity.verified && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Shield className="h-3 w-3" />
                        Verified Authentic
                      </Badge>
                    )}
                    {mockProduct.authenticity.certificate && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Award className="h-3 w-3" />
                        Certified
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">
                    {mockProduct.description}
                  </p>
                </div>

                {/* Details Tabs */}
                <ProductDetailsTabbed
                  vendor={mockProduct.vendor}
                  details={mockProduct.specifications}
                  returns={mockProduct.returns}
                  authenticity={mockProduct.authenticity}
                />
              </CardContent>
            </Card>
          </div>
        </div>


        {/* Related Products */}
        <RelatedProducts products={mockRelatedProducts} />
      </main>

      <Footer />
    </div>
  );
}