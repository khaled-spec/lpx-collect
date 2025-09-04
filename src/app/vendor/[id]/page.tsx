'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { extendedVendors } from '@/data/vendorData';
import { products } from '@/data/mockData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { PrimaryButton, SecondaryButton, OutlineButton, IconButton } from '@/components/custom/button-variants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VerifiedBadge, CategoryBadge } from '@/components/custom/badge-variants';
import { SearchInput } from '@/components/custom/input-variants';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { designTokens } from '@/lib/design-tokens';
import { tokens } from '@/lib/design-system';
import { productStyles } from '@/components/custom/product-styles';
import { cn } from '@/lib/utils';
import { 
  Store,
  Star,
  Package,
  Clock,
  Shield,
  Heart,
  Share2,
  MessageCircle,
  MapPin,
  Calendar,
  TrendingUp,
  Award,
  Users,
  ShoppingCart,
  Filter,
  Grid3x3,
  List,
  Twitter,
  Instagram,
  Facebook,
  Globe,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Search,
  ArrowUpDown,
  LayoutList,
  X
} from 'lucide-react';

type ViewMode = 'grid' | 'list';

export default function VendorStorefrontPage() {
  const params = useParams();
  const vendorId = params.id as string;
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];

  // Find vendor
  const vendor = extendedVendors.find(v => v.id === vendorId);
  
  // Get vendor products
  const vendorProducts = useMemo(() => {
    let filtered = products.filter(p => p.vendor.id === vendorId);
    
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category.slug === selectedCategory);
    }
    
    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    
    return filtered;
  }, [vendorId, searchQuery, selectedCategory, sortBy]);

  // Get unique categories from vendor products
  const vendorCategories = useMemo(() => {
    const categories = new Set(products
      .filter(p => p.vendor.id === vendorId)
      .map(p => p.category));
    return Array.from(categories);
  }, [vendorId]);

  // Calculate active filter count
  const activeFilterCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Vendor not found</h2>
          <p className="text-muted-foreground mb-4">The vendor you're looking for doesn't exist.</p>
          <PrimaryButton asChild>
            <Link href="/vendors">Browse All Vendors</Link>
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-card rounded-xl border border-border shadow-lg p-8">
            {/* Breadcrumb - matching product page style */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList className={productStyles.typography.meta}>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="hover:text-primary transition-colors">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/vendors" className="hover:text-primary transition-colors">Vendors</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium">{vendor.storeName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Vendor Header Card - Improved Layout */}
            <Card className="mb-8 border-0 shadow-none">
              <CardContent className="p-0 space-y-6">
                {/* Top Section: Logo, Name, and Action Buttons */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Logo */}
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center border border-primary/20 shadow-md">
                      <Store className="h-12 w-12 text-primary" />
                    </div>
                    
                    {/* Name and Verification */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold tracking-tight">{vendor.storeName}</h1>
                        {vendor.verified && (
                          <VerifiedBadge className={cn(productStyles.badges.size.md, productStyles.badges.base)}>
                            <CheckCircle className={cn(productStyles.forms.icon.sm, "mr-1")} />
                            Verified
                          </VerifiedBadge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1">
                          <div className={productStyles.rating.container}>
                            <Star className={productStyles.rating.star} />
                            <span className={cn(productStyles.rating.text, "text-base font-semibold")}>{vendor.rating}</span>
                          </div>
                          <span className={cn(productStyles.typography.meta, "ml-1")}>({vendor.totalSales.toLocaleString()} sales)</span>
                        </div>
                        <span className={productStyles.typography.meta}>•</span>
                        <span className={productStyles.typography.meta}>{vendor.totalProducts} products</span>
                        <span className={productStyles.typography.meta}>•</span>
                        <span className={productStyles.typography.meta}>Joined {vendor.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <SecondaryButton
                      onClick={() => setIsFollowing(!isFollowing)}
                      size="default"
                      className="min-w-[120px]"
                    >
                      <Heart className={cn(productStyles.forms.icon.md, `mr-2 ${isFollowing ? 'fill-current text-red-500' : ''}`)}/>
                      {isFollowing ? 'Following' : 'Follow'}
                    </SecondaryButton>
                    <IconButton variant="outline" size="default">
                      <Share2 className={productStyles.forms.icon.md} />
                    </IconButton>
                    <PrimaryButton size="default">
                      <MessageCircle className={cn(productStyles.forms.icon.md, "mr-2")} />
                      Contact
                    </PrimaryButton>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b border-border">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{vendor.stats.responseRate}%</div>
                    <div className={cn(productStyles.typography.meta, "font-medium")}>Response Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{vendor.stats.shipOnTime}%</div>
                    <div className={cn(productStyles.typography.meta, "font-medium")}>Ships On Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{vendor.stats.positiveReviews}%</div>
                    <div className={cn(productStyles.typography.meta, "font-medium")}>Positive Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">{vendor.responseTime}</div>
                    <div className={cn(productStyles.typography.meta, "font-medium")}>Avg Response</div>
                  </div>
                </div>

                {/* Quick Navigation */}
                <div className="flex items-center justify-center gap-8 pt-4">
                  <a href="#products" className={cn(productStyles.typography.meta, "text-base font-medium hover:text-primary transition-colors")}>Products</a>
                  <a href="#about" className={cn(productStyles.typography.meta, "text-base font-medium hover:text-primary transition-colors")}>About</a>
                  <a href="#policies" className={cn(productStyles.typography.meta, "text-base font-medium hover:text-primary transition-colors")}>Policies</a>
                  <a href="#reviews" className={cn(productStyles.typography.meta, "text-base font-medium hover:text-primary transition-colors")}>Reviews</a>
                </div>
              </CardContent>
            </Card>

            {/* Products Section */}
            <Card id="products" className="border-0 shadow-none mb-8">
              <CardContent className="p-0 space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Products</h2>
              {/* Compact Filter Bar - Matching Browse Page */}
              <div className="mb-6">
                {/* Filter Toggle & Quick Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                      className={cn(
                        productStyles.forms.button.md,
                        "flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                      )}
                    >
                      <SlidersHorizontal className={productStyles.forms.icon.md} />
                      <span>Filters</span>
                      {activeFilterCount > 0 && (
                        <span className="badge badge-primary">{activeFilterCount}</span>
                      )}
                      {isFilterExpanded ? (
                        <ChevronUp className={productStyles.forms.icon.md} />
                      ) : (
                        <ChevronDown className={productStyles.forms.icon.md} />
                      )}
                    </button>

                    {/* Quick Search */}
                    <div className="relative hidden sm:block">
                      <Search className={cn(
                        productStyles.forms.icon.md,
                        "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      )} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Quick search..."
                        className={cn(
                          productStyles.forms.input.md,
                          "pl-10 w-64 border border-input bg-background",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        )}
                      />
                    </div>

                    {/* Active Filter Pills */}
                    {!isFilterExpanded && activeFilterCount > 0 && (
                      <div className="flex items-center gap-2">
                        {selectedCategory !== 'all' && (
                          <span className="badge badge-secondary">
                            {vendorCategories.find(c => c.slug === selectedCategory)?.name}
                            <button
                              onClick={() => setSelectedCategory('all')}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        )}
                        {searchQuery && (
                          <span className="badge badge-secondary">
                            Search: {searchQuery}
                            <button
                              onClick={() => setSearchQuery('')}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Sort */}
                    <div className="relative">
                      <button 
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                        className={cn(
                          productStyles.forms.select.md,
                          "flex items-center justify-between gap-2 w-48 border border-input bg-background hover:bg-accent transition-colors"
                        )}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <ArrowUpDown className={cn(productStyles.forms.icon.md, "text-muted-foreground flex-shrink-0")} />
                          <span className="truncate">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                        </span>
                      </button>
                      {isSortOpen && (
                        <div className="dropdown-menu right-0">
                          {sortOptions.map(option => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSortBy(option.value);
                                setIsSortOpen(false);
                              }}
                              className={`dropdown-item ${
                                sortBy === option.value ? 'dropdown-item-active' : ''
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* View Mode */}
                    <div className="flex items-center border border-input rounded-md overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                          "h-9 px-3 flex items-center justify-center",
                          "rounded-none border-0 transition-colors",
                          viewMode === 'grid'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                        aria-label="Grid view"
                      >
                        <Grid3x3 className={productStyles.forms.icon.md} />
                      </button>
                      <div className="w-px h-6 bg-input" />
                      <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                          "h-9 px-3 flex items-center justify-center",
                          "rounded-none border-0 transition-colors",
                          viewMode === 'list'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                        aria-label="List view"
                      >
                        <LayoutList className={productStyles.forms.icon.md} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Filter Content */}
                {isFilterExpanded && (
                  <div className="border-t border-border animate-slide-up py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Category Filter */}
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className={cn(productStyles.forms.select.md, "w-full border border-input bg-background")}
                        >
                          <option value="all">All Categories</option>
                          {vendorCategories.map((cat) => (
                            <option key={cat.id} value={cat.slug}>
                              {cat.name} ({products.filter(p => p.vendor.id === vendorId && p.category.id === cat.id).length})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Search on Mobile */}
                      <div className="sm:hidden">
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Search</label>
                        <div className="relative">
                          <Search className={cn(
                            productStyles.forms.icon.md,
                            "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          )} />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className={cn(
                              productStyles.forms.input.md,
                              "pl-10 w-full border border-input bg-background",
                              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Clear Filters */}
                    {activeFilterCount > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                          }}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Products Grid/List */}
              {vendorProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? `grid ${designTokens.grid.cols[4]} ${designTokens.spacing.gap.md}`
                  : 'space-y-4'
                }>
                  {vendorProducts.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))}
                </div>
              )}
              </CardContent>
            </Card>

            {/* About Section */}
            <Card id="about" className="border-0 shadow-none mb-8">
              <CardContent className="p-0 space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">About {vendor.storeName}</h2>
              <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{vendor.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {vendor.specialties.map((specialty) => (
                        <CategoryBadge key={specialty} variant="secondary">
                          {specialty}
                        </CategoryBadge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Achievements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vendor.badges.map((badge) => (
                        <div key={badge} className="flex items-center gap-3">
                          <Award className="h-5 w-5 text-primary" />
                          <span>{badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {vendor.socialLinks && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-3">Connect With Us</h4>
                        <div className="flex gap-3">
                          {vendor.socialLinks.twitter && (
                            <IconButton variant="outline" size="default" asChild>
                              <a href={`https://twitter.com/${vendor.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer">
                                <Twitter className="h-4 w-4" />
                              </a>
                            </IconButton>
                          )}
                          {vendor.socialLinks.instagram && (
                            <IconButton variant="outline" size="default" asChild>
                              <a href={`https://instagram.com/${vendor.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer">
                                <Instagram className="h-4 w-4" />
                              </a>
                            </IconButton>
                          )}
                          {vendor.socialLinks.facebook && (
                            <IconButton variant="outline" size="default" asChild>
                              <a href={`https://facebook.com/${vendor.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer">
                                <Facebook className="h-4 w-4" />
                              </a>
                            </IconButton>
                          )}
                        </div>
                      </div>
                    </>
                  )}
              </div>
              </CardContent>
            </Card>

            {/* Policies Section */}
            <Card id="policies" className="border-0 shadow-none mb-8">
              <CardContent className="p-0 space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Store Policies</h2>
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Shipping Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{vendor.policies.shipping}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Returns & Refunds
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{vendor.policies.returns}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Authenticity Guarantee
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{vendor.policies.authenticity}</p>
                  </CardContent>
                </Card>
              </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card id="reviews" className="border-0 shadow-none mb-8">
              <CardContent className="p-0 space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Customer Reviews</h2>
              <p className="text-muted-foreground mb-6">Based on {vendor.totalSales} verified purchases</p>
              <div className="space-y-6">
                  {/* Overall Rating */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{vendor.rating}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(vendor.rating)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {vendor.totalSales} reviews
                      </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const percentage = rating === 5 ? 65 : 
                                         rating === 4 ? 25 :
                                         rating === 3 ? 7 :
                                         rating === 2 ? 2 : 1;
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm w-3">{rating}</span>
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <Progress value={percentage} className="flex-1 h-2" />
                            <span className="text-sm text-muted-foreground w-10 text-right">
                              {percentage}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Sample Reviews */}
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Reviews feature coming soon...
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}