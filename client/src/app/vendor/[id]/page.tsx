"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
const extendedVendors: any[] = [];
const products: any[] = [];
import PageLayout from "@/components/layout/PageLayout";
import { ProductCard } from "@/components/shared/ProductCard";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { designTokens } from "@/lib/design-tokens";
import { productStyles } from "@/components/custom/product-styles";
import { cn } from "@/lib/utils";
import {
  Store,
  Star,
  Package,
  Heart,
  MessageCircle,
  ShoppingCart,
  Grid3x3,
  List,
  CheckCircle,
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
      <PageLayout
        title="Vendor Not Found"
        breadcrumbs={[
          { label: "Vendors", href: "/vendors" },
          { label: "Not Found" },
        ]}
      >
        <EmptyStates.NoVendorInfo />
      </PageLayout>
    );
  }

  const breadcrumbs = [
    { label: "Vendors", href: "/vendors" },
    { label: vendor.storeName },
  ];

  return (
    <PageLayout
      title={vendor.storeName}
      description={vendor.description}
      breadcrumbs={breadcrumbs}
    >
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
                <h1 className={cn(designTokens.typography.h4)}>
                  {vendor.storeName}
                </h1>
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
                  <span className="text-muted-foreground">Response Rate</span>
                  <span className="font-semibold">
                    {vendor.stats.responseRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Ships On Time</span>
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
                  <span className="text-muted-foreground">Avg Response</span>
                  <span className="font-semibold">{vendor.responseTime}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button className="w-full" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
                <Button
                  variant="outline"
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
                </Button>
              </div>
            </div>

            {/* Main Content Area - Products */}
            <div className="flex-1">
              <div id="products" className="space-y-6">
                <h2 className={cn(designTokens.typography.h3)}>Products</h2>

                {/* Compact Filter Bar - Matching Browse Page */}
                <div className="mb-6">
                  {/* Filter Toggle & Quick Actions */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setIsFilterExpanded(!isFilterExpanded)}
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
                          <ChevronUp className={productStyles.forms.icon.md} />
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
                                sortOptions.find((o) => o.value === sortBy)
                                  ?.label
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
                          <Grid3x3 className={productStyles.forms.icon.md} />
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
                              onChange={(e) => setSearchQuery(e.target.value)}
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
                  <EmptyStates.NoProducts />
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? `grid grid-cols-2 lg:grid-cols-3 gap-4`
                        : "space-y-4"
                    }
                  >
                    {vendorProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={{
                          ...product,
                          name: product.title,
                          image: product.images?.[0] || "",
                          category: product.category?.name || "Uncategorized",
                          categorySlug:
                            product.category?.slug || "uncategorized",
                          vendor: vendor.storeName,
                          stock: product.stock || 10,
                          condition: product.condition || "New",
                          rarity: product.rarity || "Common",
                        }}
                        viewMode={viewMode}
                        onAddToCart={(p) => console.log("Add to cart:", p)}
                        onAddToWishlist={(p) =>
                          console.log("Add to wishlist:", p)
                        }
                        onBuyNow={(p) => console.log("Buy now:", p)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simple About Section */}
      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        {/* Keep sidebar space */}
        <div className="lg:w-64 w-full" />

        {/* Main content area */}
        <div className="flex-1">
          <div className="bg-card rounded-lg border p-6">
            <h2 className={cn(designTokens.typography.h4, "mb-4")}>
              About {vendor.storeName}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {vendor.description}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
