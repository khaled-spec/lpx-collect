"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Heart,
  ArrowRight,
  Trash2,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { productStyles } from "@/components/custom/product-styles";
import { designTokens } from "@/lib/design-tokens";

function WishlistContent() {
  const { items, clearWishlist } = useWishlist();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="flex-grow bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="bg-card rounded-xl border border-border shadow-lg p-8">
              {/* Breadcrumb */}
              <Breadcrumb className="mb-8">
                <BreadcrumbList className={productStyles.typography.meta}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="hover:text-primary transition-colors">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-foreground font-medium">
                      Wishlist
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Empty State */}
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
                  <Heart className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className={cn(designTokens.heading.h2, "mb-3")}>
                  Your wishlist is empty
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Save your favorite items to your wishlist to keep track of them and purchase them later.
                </p>
                <Button asChild size="lg">
                  <Link href="/browse">
                    Start Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-card rounded-xl border border-border shadow-lg p-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-8">
              <BreadcrumbList className={productStyles.typography.meta}>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="hover:text-primary transition-colors">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium">
                    Wishlist
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className={cn(designTokens.heading.h1, "mb-2")}>
                  My Wishlist
                </h1>
                <p className="text-muted-foreground">
                  You have {items.length} {items.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
              {items.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearWishlist}
                  className="mt-4 sm:mt-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Products Grid */}
            <div className={cn(
              "grid gap-6",
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            )}>
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="default"
                  viewMode="grid"
                />
              ))}
            </div>

            {/* Continue Shopping */}
            {items.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">
                    Looking for more?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Discover more unique collectibles from our verified vendors
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild variant="outline" size="lg">
                      <Link href="/browse">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Browse Collection
                      </Link>
                    </Button>
                    <Button asChild size="lg">
                      <Link href="/vendors">
                        Explore Vendors
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}