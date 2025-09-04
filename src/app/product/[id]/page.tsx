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
import { productStyles } from '@/components/custom/product-styles';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { categories, vendors } from '@/data/mockData';

// Convert mock product to Product type
const mockProduct: Product = {
  id: '1',
  title: '1999 Pokémon Base Set Charizard Holo #4/102 PSA 9 MINT',
  slug: 'pokemon-charizard-psa-9',
  description: 'This is an authentic 1999 Pokémon Base Set Charizard holographic card, professionally graded PSA 9 MINT condition. This iconic card is one of the most sought-after cards in the entire Pokémon Trading Card Game.',
  price: 4999.99,
  compareAtPrice: 5999.99,
  images: [
    'https://images.unsplash.com/photo-1679678691006-0ad24fecb769?w=800&q=80',
    'https://images.unsplash.com/photo-1679678691170-7781f11f9d86?w=800&q=80',
    'https://images.unsplash.com/photo-1679678691250-a14e09c004c7?w=800&q=80',
    'https://images.unsplash.com/photo-1679678691328-54929d271c3f?w=800&q=80',
  ],
  category: categories[0], // Trading Cards
  vendor: vendors[0], // Premium Cards Co.
  condition: 'mint',
  rarity: 'legendary',
  stock: 1,
  sold: 0,
  views: 1250,
  likes: 89,
  tags: ['pokemon', 'charizard', 'psa9', 'vintage', 'holographic'],
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
  featured: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Additional mock data for compatibility with existing components
const mockProductExtended = {
  ...mockProduct,
  originalPrice: mockProduct.compareAtPrice || mockProduct.price,
  inStock: mockProduct.stock > 0,
  stockQuantity: mockProduct.stock,
  subcategory: 'Pokémon',
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

  const discountPercentage = mockProduct.compareAtPrice 
    ? Math.round(((mockProduct.compareAtPrice - mockProduct.price) / mockProduct.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-card rounded-xl border border-border shadow-lg p-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList className={productStyles.typography.meta}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-primary transition-colors">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/browse" className="hover:text-primary transition-colors">Browse</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/category/${mockProduct.category.slug}`} className="hover:text-primary transition-colors">
                  {mockProduct.category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground font-medium">{mockProductExtended.subcategory}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
            </Breadcrumb>

            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-3">{mockProduct.title}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn(productStyles.typography.meta, "text-base")}>by</span>
                <span className={cn(productStyles.typography.vendor, "text-base font-medium hover:text-primary transition-colors cursor-pointer")}>{mockProduct.vendor.storeName}</span>
                <div className="flex items-center gap-1">
                  <div className={productStyles.rating.container}>
                    <Star className={productStyles.rating.star} />
                    <span className={cn(productStyles.rating.text, "text-sm font-medium")}>{mockProduct.vendor.rating}</span>
                  </div>
                  <span className={cn(productStyles.typography.meta, "ml-1")}>({mockProduct.vendor.totalSales} sales)</span>
                </div>
              </div>
            </div>

            {/* 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              {/* Left: Product Images */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
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

              {/* Middle: Checkout Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <ProductPurchaseCard
                    product={mockProduct}
                    productExtended={mockProductExtended}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    discountPercentage={discountPercentage}
                  />
                </div>
              </div>

              {/* Right: Product Info and Details Tabs */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20 border-0 shadow-none">
                  <CardContent className="p-6 space-y-6">
                    {/* Badges and Description */}
                    <div className="space-y-4">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className={cn(productStyles.badges.size.md, productStyles.badges.base)}>
                          {mockProduct.condition}
                        </Badge>
                        <Badge variant="secondary" className={cn(productStyles.badges.size.md, productStyles.badges.base)}>
                          {mockProduct.rarity}
                        </Badge>
                        <Badge variant="secondary" className={cn(productStyles.badges.size.md, productStyles.badges.base)}>
                          {mockProduct.category.name}
                        </Badge>
                      </div>

                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 tracking-tight">About This Item</h3>
                        <p className={cn(productStyles.typography.meta, "text-sm leading-relaxed text-foreground")}>
                          {mockProduct.description}
                        </p>
                      </div>
                    </div>

                    {/* Details Tabs */}
                    <ProductDetailsTabbed
                      vendor={{
                        id: mockProduct.vendor.id,
                        name: mockProduct.vendor.storeName,
                        rating: mockProduct.vendor.rating,
                        totalSales: mockProduct.vendor.totalSales,
                        verified: mockProduct.vendor.verified,
                        responseTime: mockProduct.vendor.responseTime,
                        joinedDate: mockProduct.vendor.createdAt.toISOString(),
                        avatar: mockProduct.vendor.logo || '/images/vendors/default.jpg'
                      }}
                      details={mockProduct.specifications || {}}
                      returns={mockProductExtended.returns}
                      authenticity={mockProductExtended.authenticity}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>


            {/* Related Products */}
            <RelatedProducts products={mockRelatedProducts} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}