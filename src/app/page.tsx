import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { PrimaryButton, SecondaryButton, OutlineButton } from '@/components/custom/button-variants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FeatureCard, VendorCard, CategoryCard, StatsCard } from '@/components/custom/card-variants';
import { Badge } from '@/components/ui/badge';
import { VerifiedBadge } from '@/components/custom/badge-variants';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, 
  Shield, 
  Truck, 
  Award,
  TrendingUp,
  Package,
  Users,
  Star
} from 'lucide-react';
import { featuredProducts, categories, newArrivals, vendors } from '@/data/mockData';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-white text-black">
          <div className="container py-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Discover Rare & Authentic Collectibles
                </h1>
                <p className="text-xl mb-8 text-gray-600">
                  Join thousands of collectors in finding unique treasures from verified vendors worldwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <SecondaryButton asChild size="lg" className="bg-black text-white hover:bg-gray-800">
                    <Link href="/browse">
                      Start Browsing
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </SecondaryButton>
                  <OutlineButton asChild size="lg" className="border-black text-black hover:bg-black hover:text-white">
                    <Link href="/sell">
                      Become a Vendor
                    </Link>
                  </OutlineButton>
                </div>
                <div className="mt-8 flex items-center gap-6">
                  <div>
                    <p className="text-3xl font-bold">50K+</p>
                    <p className="text-sm text-gray-500">Active Collectors</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">10K+</p>
                    <p className="text-sm text-gray-500">Rare Items</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">500+</p>
                    <p className="text-sm text-gray-500">Verified Vendors</p>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] hidden md:block">
                <Image 
                  src="/ChatGPT Image Sep 4, 2025, 11_51_28 AM.png"
                  alt="LPX Collect Package"
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard>
                <CardContent className="flex items-center gap-4 p-0">
                  <Shield className="h-12 w-12 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Authenticity Guaranteed</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Every item verified by our expert team
                    </p>
                  </div>
                </CardContent>
              </FeatureCard>
              <FeatureCard>
                <CardContent className="flex items-center gap-4 p-0">
                  <Truck className="h-12 w-12 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Secure Shipping</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Protected delivery with tracking
                    </p>
                  </div>
                </CardContent>
              </FeatureCard>
              <FeatureCard>
                <CardContent className="flex items-center gap-4 p-0">
                  <Award className="h-12 w-12 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Trusted Vendors</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Carefully vetted sellers only
                    </p>
                  </div>
                </CardContent>
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Collectibles</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Hand-picked rare items from our top vendors
                </p>
              </div>
              <OutlineButton asChild className="hidden sm:inline-flex">
                <Link href="/featured">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </OutlineButton>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} variant="default" />
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Explore our diverse collection of authentic collectibles
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group"
                >
                  <CategoryCard>
                    <CardContent className="p-0">
                      <Package className="h-12 w-12 mx-auto mb-3 text-gray-400 group-hover:text-primary transition" />
                      <h3 className="font-medium mb-1 group-hover:text-primary transition">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.productCount} items
                      </p>
                    </CardContent>
                  </CategoryCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-16">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Fresh additions to our marketplace
                </p>
              </div>
              <OutlineButton asChild className="hidden sm:inline-flex">
                <Link href="/new-arrivals">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </OutlineButton>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} variant="default" />
              ))}
            </div>
          </div>
        </section>

        {/* Top Vendors */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Top Rated Vendors</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Shop with confidence from our most trusted sellers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <Link key={vendor.id} href={`/vendor/${vendor.id}`} className="group">
                  <VendorCard>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold group-hover:text-primary transition">
                                {vendor.storeName}
                              </h3>
                              {vendor.verified && (
                                <VerifiedBadge className="mt-1" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{vendor.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {vendor.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{vendor.totalProducts} items</span>
                            <span>{vendor.totalSales} sales</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </VendorCard>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <PrimaryButton asChild size="lg">
                <Link href="/vendors">
                  Explore All Vendors
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </PrimaryButton>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white text-black">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your Collection Today
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our community of passionate collectors and discover unique treasures from around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SecondaryButton asChild size="lg" className="bg-black text-white hover:bg-gray-800">
                <Link href="/register">
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </SecondaryButton>
              <OutlineButton asChild size="lg" className="border-black text-black hover:bg-black hover:text-white">
                <Link href="/how-it-works">
                  Learn More
                </Link>
              </OutlineButton>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold mb-1">$2M+</p>
                <p className="text-gray-600 dark:text-gray-400">Monthly Sales</p>
              </div>
              <div>
                <Package className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold mb-1">10K+</p>
                <p className="text-gray-600 dark:text-gray-400">Listed Items</p>
              </div>
              <div>
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold mb-1">50K+</p>
                <p className="text-gray-600 dark:text-gray-400">Happy Collectors</p>
              </div>
              <div>
                <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold mb-1">99%</p>
                <p className="text-gray-600 dark:text-gray-400">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}