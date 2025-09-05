"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// TODO: Replace with actual data from API or database
const extendedVendors: any[] = [];
const products: any[] = [];
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegacyProductCard from "@/components/LegacyProductCard";
import {
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  IconButton,
} from "@/components/custom/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  VerifiedBadge,
  CategoryBadge,
} from "@/components/custom/badge-variants";
import { SearchInput } from "@/components/custom/input-variants";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { designTokens } from "@/lib/design-tokens";
import { tokens } from "@/lib/design-system";
import { productStyles } from "@/components/custom/product-styles";
import { cn } from "@/lib/utils";
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
  X,
} from "lucide-react";

type ViewMode = "grid" | "list";

export default function VendorStorefrontPage() {
  const params = useParams();
  const vendorId = params.id as string;

  const [isFollowing, setIsFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
  ];

  // Find vendor
  const vendor = extendedVendors.find((v) => v.id === vendorId);

  // Get vendor products
  const vendorProducts = useMemo(() => {
    let filtered = products.filter((p) => p.vendor.id === vendorId);

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category.slug === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return filtered;
  }, [vendorId, searchQuery, selectedCategory, sortBy]);

  // Get unique categories from vendor products
  const vendorCategories = useMemo(() => {
    const categories = new Set(
      products.filter((p) => p.vendor.id === vendorId).map((p) => p.category),
    );
    return Array.from(categories);
  }, [vendorId]);

  // Calculate active filter count
  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) + (searchQuery ? 1 : 0);

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Vendor not found</h2>
          <p className="text-muted-foreground mb-4">
            The vendor you're looking for doesn't exist.
          </p>
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
                    href="/vendors"
                    className="hover:text-primary transition-colors"
                  >
                    Vendors
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium">
                    {vendor.storeName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Vendor Header Card - Improved Layout */}
            <Card className="mb-8 border-0 shadow-none">
              <CardContent className="p-0 space-y-6">
                {/* Sidebar-Style Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Sidebar Info */}
                  <div className="lg:w-64 w-full space-y-4 lg:sticky lg:top-4 lg:self-start">
                    {/* Vendor Card */}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                        <Store className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h1 className="text-xl font-bold">{vendor.storeName}</h1>
                      {vendor.verified && (
                        <div className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Verified Seller</span>
                        </div>
                      )}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-center gap-1 text-sm">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{vendor.rating}</span>
                          <span className="text-muted-foreground">rating</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {vendor.totalSales.toLocaleString()} sales •{" "}
                          {vendor.totalProducts} items
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Member since{" "}
                          {vendor.createdAt.toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Response Rate
                        </span>
                        <span className="font-semibold">
                          {vendor.stats.responseRate}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Ships On Time
                        </span>
                        <span className="font-semibold text-green-600">
                          {vendor.stats.shipOnTime}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Positive Reviews
                        </span>
                        <span className="font-semibold text-blue-600">
                          {vendor.stats.positiveReviews}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Avg Response
                        </span>
                        <span className="font-semibold">
                          {vendor.responseTime}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <PrimaryButton className="w-full" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Seller
                      </PrimaryButton>
                      <SecondaryButton
                        onClick={() => setIsFollowing(!isFollowing)}
                        className="w-full"
                        size="sm"
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4 mr-2",
                            isFollowing ? "fill-current text-red-500" : "",
                          )}
                        />
                        {isFollowing ? "Following" : "Follow Shop"}
                      </SecondaryButton>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                      <a
                        href="#products"
                        className="block px-3 py-2 text-sm rounded-md hover:bg-muted"
                      >
                        Products
                      </a>
                      <a
                        href="#about"
                        className="block px-3 py-2 text-sm rounded-md hover:bg-muted"
                      >
                        About
                      </a>
                      <a
                        href="#policies"
                        className="block px-3 py-2 text-sm rounded-md hover:bg-muted"
                      >
                        Store Policies
                      </a>
                      <a
                        href="#reviews"
                        className="block px-3 py-2 text-sm rounded-md hover:bg-muted"
                      >
                        Reviews
                      </a>
                    </nav>
                  </div>

                  {/* Main Content Area - Products */}
                  <div className="flex-1">
                    <div id="products" className="space-y-6">
                      <h2 className="text-2xl font-bold">Products</h2>

                      {/* Compact Filter Bar - Matching Browse Page */}
                      <div className="mb-6">
                        {/* Filter Toggle & Quick Actions */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() =>
                                setIsFilterExpanded(!isFilterExpanded)
                              }
                              className={cn(
                                productStyles.forms.button.md,
                                "flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors",
                              )}
                            >
                              <SlidersHorizontal
                                className={productStyles.forms.icon.md}
                              />
                              <span>Filters</span>
                              {activeFilterCount > 0 && (
                                <span className="badge badge-primary">
                                  {activeFilterCount}
                                </span>
                              )}
                              {isFilterExpanded ? (
                                <ChevronUp
                                  className={productStyles.forms.icon.md}
                                />
                              ) : (
                                <ChevronDown
                                  className={productStyles.forms.icon.md}
                                />
                              )}
                            </button>

                            {/* Quick Search */}
                            <div className="relative hidden sm:block">
                              <Search
                                className={cn(
                                  productStyles.forms.icon.md,
                                  "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                                )}
                              />
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Quick search..."
                                className={cn(
                                  productStyles.forms.input.md,
                                  "pl-10 w-64 border border-input bg-background",
                                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                )}
                              />
                            </div>

                            {/* Active Filter Pills */}
                            {!isFilterExpanded && activeFilterCount > 0 && (
                              <div className="flex items-center gap-2">
                                {selectedCategory !== "all" && (
                                  <span className="badge badge-secondary">
                                    {
                                      vendorCategories.find(
                                        (c) => c.slug === selectedCategory,
                                      )?.name
                                    }
                                    <button
                                      onClick={() => setSelectedCategory("all")}
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
                                      onClick={() => setSearchQuery("")}
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
                                onBlur={() =>
                                  setTimeout(() => setIsSortOpen(false), 200)
                                }
                                className={cn(
                                  productStyles.forms.select.md,
                                  "flex items-center justify-between gap-2 w-48 border border-input bg-background hover:bg-accent transition-colors",
                                )}
                              >
                                <span className="flex items-center gap-2 truncate">
                                  <ArrowUpDown
                                    className={cn(
                                      productStyles.forms.icon.md,
                                      "text-muted-foreground flex-shrink-0",
                                    )}
                                  />
                                  <span className="truncate">
                                    {
                                      sortOptions.find(
                                        (o) => o.value === sortBy,
                                      )?.label
                                    }
                                  </span>
                                </span>
                              </button>
                              {isSortOpen && (
                                <div className="dropdown-menu right-0">
                                  {sortOptions.map((option) => (
                                    <button
                                      key={option.value}
                                      onClick={() => {
                                        setSortBy(option.value);
                                        setIsSortOpen(false);
                                      }}
                                      className={`dropdown-item ${
                                        sortBy === option.value
                                          ? "dropdown-item-active"
                                          : ""
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
                                onClick={() => setViewMode("grid")}
                                className={cn(
                                  "h-9 px-3 flex items-center justify-center",
                                  "rounded-none border-0 transition-colors",
                                  viewMode === "grid"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                )}
                                aria-label="Grid view"
                              >
                                <Grid3x3
                                  className={productStyles.forms.icon.md}
                                />
                              </button>
                              <div className="w-px h-6 bg-input" />
                              <button
                                onClick={() => setViewMode("list")}
                                className={cn(
                                  "h-9 px-3 flex items-center justify-center",
                                  "rounded-none border-0 transition-colors",
                                  viewMode === "list"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                )}
                                aria-label="List view"
                              >
                                <LayoutList
                                  className={productStyles.forms.icon.md}
                                />
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
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                  Category
                                </label>
                                <select
                                  value={selectedCategory}
                                  onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                  }
                                  className={cn(
                                    productStyles.forms.select.md,
                                    "w-full border border-input bg-background",
                                  )}
                                >
                                  <option value="all">All Categories</option>
                                  {vendorCategories.map((cat) => (
                                    <option key={cat.id} value={cat.slug}>
                                      {cat.name} (
                                      {
                                        products.filter(
                                          (p) =>
                                            p.vendor.id === vendorId &&
                                            p.category.id === cat.id,
                                        ).length
                                      }
                                      )
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Search on Mobile */}
                              <div className="sm:hidden">
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                  Search
                                </label>
                                <div className="relative">
                                  <Search
                                    className={cn(
                                      productStyles.forms.icon.md,
                                      "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                                    )}
                                  />
                                  <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                      setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search products..."
                                    className={cn(
                                      productStyles.forms.input.md,
                                      "pl-10 w-full border border-input bg-background",
                                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
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
                                    setSearchQuery("");
                                    setSelectedCategory("all");
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
                          <h3 className="text-lg font-semibold mb-2">
                            No products found
                          </h3>
                          <p className="text-muted-foreground">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      ) : (
                        <div
                          className={
                            viewMode === "grid"
                              ? `grid grid-cols-2 lg:grid-cols-3 gap-4`
                              : "space-y-4"
                          }
                        >
                          {vendorProducts.map((product) => (
                            <LegacyProductCard
                              key={product.id}
                              product={product}
                              viewMode={viewMode}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About, Policies & Reviews Section */}
            <div className="flex flex-col lg:flex-row gap-6 mt-8">
              {/* Keep sidebar space */}
              <div className="lg:w-64 w-full" />

              {/* Main content area for other sections */}
              <div className="flex-1 space-y-8">
                {/* About Section */}
                <div id="about" className="bg-card rounded-lg border p-6">
                  <h2 className="text-xl font-bold mb-4">
                    About {vendor.storeName}
                  </h2>

                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {vendor.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                          Specialties
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {vendor.specialties?.map((specialty: string) => (
                            <span
                              key={specialty}
                              className="text-xs bg-muted px-2 py-1 rounded-md"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                          Achievements
                        </h3>
                        <div className="space-y-1">
                          {vendor.badges?.slice(0, 3).map((badge: string) => (
                            <div
                              key={badge}
                              className="flex items-center gap-2 text-xs"
                            >
                              <Award className="h-3 w-3 text-primary" />
                              <span>{badge}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {vendor.socialLinks && (
                      <div className="pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Follow us:
                          </span>
                          {vendor.socialLinks.twitter && (
                            <a
                              href={`https://twitter.com/${vendor.socialLinks.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Twitter className="h-4 w-4" />
                            </a>
                          )}
                          {vendor.socialLinks.instagram && (
                            <a
                              href={`https://instagram.com/${vendor.socialLinks.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Instagram className="h-4 w-4" />
                            </a>
                          )}
                          {vendor.socialLinks.facebook && (
                            <a
                              href={`https://facebook.com/${vendor.socialLinks.facebook}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Facebook className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Store Policies Section */}
                <div id="policies" className="bg-card rounded-lg border p-6">
                  <h2 className="text-xl font-bold mb-4">Store Policies</h2>

                  <div className="space-y-4">
                    <div className="pb-4 border-b">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Shipping</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {vendor.policies.shipping}
                      </p>
                    </div>

                    <div className="pb-4 border-b">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">
                          Returns & Refunds
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {vendor.policies.returns}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Authenticity</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {vendor.policies.authenticity}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div id="reviews" className="bg-card rounded-lg border p-6">
                  <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

                  <div className="flex items-start gap-8">
                    {/* Rating Summary */}
                    <div className="text-center">
                      <div className="text-3xl font-bold">{vendor.rating}</div>
                      <div className="flex items-center gap-0.5 mt-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(vendor.rating)
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {vendor.totalSales} reviews
                      </div>
                    </div>

                    {/* Rating Bars */}
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const percentage =
                          rating === 5
                            ? 65
                            : rating === 4
                              ? 25
                              : rating === 3
                                ? 7
                                : rating === 2
                                  ? 2
                                  : 1;
                        return (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-xs w-2">{rating}</span>
                            <Progress
                              value={percentage}
                              className="flex-1 h-1.5"
                            />
                            <span className="text-xs text-muted-foreground w-8 text-right">
                              {percentage}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                      Detailed reviews coming soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
