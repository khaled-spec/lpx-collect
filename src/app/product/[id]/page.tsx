"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductPurchaseCard from "@/components/product/ProductPurchaseCardOptimized";
import ProductDetailsTabbed from "@/components/product/ProductDetailsTabbed";
import RelatedProducts from "@/components/product/RelatedProducts";
import { useWishlist } from "@/context/WishlistContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, TrendingUp, Star } from "lucide-react";
import { productStyles } from "@/components/custom/product-styles";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
// TODO: Replace with actual data from API or database
const categories: any[] = [];
const vendors: any[] = [];
const products: Product[] = [];

// TODO: Replace with actual data from API or database
const mockReviews: any[] = [];
const mockQuestions: any[] = [];

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Find product by slug
  useEffect(() => {
    async function loadProduct() {
      const resolvedParams = await params;
      const foundProduct = products.find((p) => p.slug === resolvedParams.id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
      setLoading(false);
    }
    loadProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link href="/browse" className="text-primary hover:underline">
              Back to Browse
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Create extended product data for compatibility
  const productExtended = {
    ...product,
    originalPrice: product.compareAtPrice || product.price,
    inStock: product.stock > 0,
    stockQuantity: product.stock,
    subcategory: "Pokémon",
    shipping: {
      price: 19.99,
      expedited: 49.99,
      estimatedDays: "3-5",
      expeditedDays: "1-2",
      freeShippingThreshold: 100,
      locations: "Ships to United States",
    },
    returns: {
      accepted: true,
      period: "30 days",
      condition: "Item must be in original sealed holder",
      restockingFee: false,
    },
    authenticity: {
      verified: true,
      certificate: true,
      verifiedBy: "PSA Authentication Services",
      certificateNumber: "PSA-12345678",
    },
  };

  const mockRelatedProducts = [
    {
      id: "2",
      title: "1999 Pokémon Base Set Blastoise Holo #2/102",
      price: 1999.99,
      image:
        "https://images.unsplash.com/photo-1679678690998-88c8711cbe5f?w=400&q=80",
      condition: "Near Mint",
      vendor: "Card Masters",
    },
    {
      id: "3",
      title: "1999 Pokémon Base Set Venusaur Holo #15/102",
      price: 899.99,
      image:
        "https://images.unsplash.com/photo-1679678691010-894374986c72?w=400&q=80",
      condition: "Excellent",
      vendor: "Vintage Cards Plus",
    },
    {
      id: "4",
      title: "1999 Pokémon Jungle Set Flareon Holo",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1679678691006-0ad24fecb769?w=400&q=80",
      condition: "Near Mint",
      vendor: "Elite Collectibles Co.",
    },
    {
      id: "5",
      title: "1999 Pokémon Base Set Mewtwo Holo #10/102",
      price: 599.99,
      image:
        "https://images.unsplash.com/photo-1679678691170-7781f11f9d86?w=400&q=80",
      condition: "Mint",
      vendor: "Card Kingdom",
    },
  ];

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this ${product.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const discountPercentage = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) /
          product.compareAtPrice) *
          100,
      )
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
                  <BreadcrumbLink
                    href="/"
                    className="hover:text-primary transition-colors"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/browse"
                    className="hover:text-primary transition-colors"
                  >
                    Browse
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/category/${product.category.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {product.category.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium">
                    {productExtended.subcategory}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-3">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(productStyles.typography.meta, "text-base")}
                >
                  by
                </span>
                <span
                  className={cn(
                    productStyles.typography.vendor,
                    "text-base font-medium hover:text-primary transition-colors cursor-pointer",
                  )}
                >
                  {product.vendor.storeName}
                </span>
                <div className="flex items-center gap-1">
                  <div className={productStyles.rating.container}>
                    <Star className={productStyles.rating.star} />
                    <span
                      className={cn(
                        productStyles.rating.text,
                        "text-sm font-medium",
                      )}
                    >
                      {product.vendor.rating}
                    </span>
                  </div>
                  <span className={cn(productStyles.typography.meta, "ml-1")}>
                    ({product.vendor.totalSales} sales)
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              {/* Left: Product Images */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <ProductImageGallery
                    images={product.images}
                    title={product.title}
                    selectedImage={selectedImage}
                    onImageSelect={setSelectedImage}
                    isWishlisted={isInWishlist(product.id)}
                    onWishlistToggle={() =>
                      isInWishlist(product.id)
                        ? removeFromWishlist(product.id)
                        : addToWishlist(product)
                    }
                    onShare={handleShare}
                  />
                </div>
              </div>

              {/* Middle: Checkout Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <ProductPurchaseCard
                    product={product}
                    productExtended={productExtended}
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
                        <Badge
                          variant="secondary"
                          className={cn(
                            productStyles.badges.size.md,
                            productStyles.badges.base,
                          )}
                        >
                          {product.condition}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={cn(
                            productStyles.badges.size.md,
                            productStyles.badges.base,
                          )}
                        >
                          {product.rarity}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={cn(
                            productStyles.badges.size.md,
                            productStyles.badges.base,
                          )}
                        >
                          {product.category.name}
                        </Badge>
                      </div>

                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 tracking-tight">
                          About This Item
                        </h3>
                        <p
                          className={cn(
                            productStyles.typography.meta,
                            "text-sm leading-relaxed text-foreground",
                          )}
                        >
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Details Tabs */}
                    <ProductDetailsTabbed
                      vendor={{
                        id: product.vendor.id,
                        name: product.vendor.storeName,
                        rating: product.vendor.rating,
                        totalSales: product.vendor.totalSales,
                        verified: product.vendor.verified,
                        responseTime: product.vendor.responseTime,
                        joinedDate: product.vendor.createdAt.toISOString(),
                        avatar:
                          product.vendor.logo ||
                          "/images/vendors/default.jpg",
                      }}
                      details={product.specifications || {}}
                      returns={productExtended.returns}
                      authenticity={productExtended.authenticity}
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
