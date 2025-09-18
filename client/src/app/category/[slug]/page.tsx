"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { getProductAPI, getCategoryAPI } from "@/lib/api/client";
import { Product, Category } from "@/lib/api/types";
import PageLayout from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/browse/ProductGrid";
import { VendorStyleFilterBar } from "@/components/browse/VendorStyleFilterBar";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid3x3, List, ArrowUpDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ViewMode, SortOption } from "@/lib/browse-utils";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    async function fetchData() {
      try {
        const categoryAPI = getCategoryAPI();
        const productAPI = getProductAPI();

        const [categoryResponse, productsResponse] = await Promise.all([
          categoryAPI.getCategoryBySlug(categorySlug),
          productAPI.getProductsByCategory(categorySlug),
        ]);

        if (categoryResponse.success) {
          setCategory(categoryResponse.data);
        }

        if (productsResponse.success) {
          setProducts(productsResponse.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [categorySlug]);

  // Get products for this category
  const categoryProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        // Default sorting
        break;
    }

    return filtered;
  }, [products, sortBy, searchQuery]);

  // Handle product actions
  const handleAddToCart = (product: Product) => {
    // Convert API Product to Cart Product format
    const cartProduct = {
      id: product.id,
      title: product.name,
      slug: product.id,
      description: product.description,
      price: product.price,
      images: product.images || [product.image],
      category: {
        id: product.categorySlug,
        name: product.category,
        slug: product.categorySlug,
        productCount: 0,
      },
      vendor: {
        id: product.vendorId,
        userId: product.vendorId,
        storeName: product.vendor,
        description: "",
        rating: 0,
        totalSales: 0,
        totalProducts: 0,
        responseTime: "",
        shippingInfo: "",
        returnPolicy: "",
        verified: false,
        createdAt: new Date(),
      },
      condition: product.condition || ("good" as any),
      stock: product.stock,
      sold: 0,
      views: 0,
      likes: 0,
      tags: product.tags || [],
      createdAt: new Date(product.createdAt || Date.now()),
      updatedAt: new Date(product.updatedAt || Date.now()),
    };

    addToCart(cartProduct as any, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleAddToWishlist = (product: Product) => {
    // Convert Product to old format expected by wishlist
    const wishlistProduct = {
      id: product.id,
      title: product.name,
      slug: product.id,
      description: product.description,
      price: product.price,
      images: product.images || [product.image],
      category: {
        id: "cat-1",
        name: product.category,
        slug: product.categorySlug,
      },
      vendor: {
        id: product.vendorId,
        storeName: product.vendor,
        rating: 0,
      },
      condition: product.condition as any,
      stock: product.stock,
      sold: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
      tags: product.tags || [],
    };
    addToWishlist(wishlistProduct as any);
    toast.success(`${product.name} added to wishlist`);
  };

  const handleBuyNow = (product: Product) => {
    // TODO: Implement buy now functionality
    console.log("Buy now clicked for:", product.id);
    toast.info("Buy now functionality coming soon!");
  };

  const handleShare = (product: Product) => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out ${product.name} on LPX Collect`,
          url: window.location.origin + `/product/${product.id}`,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/product/${product.id}`,
      );
      toast.success("Product link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading category...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!category) {
    return (
      <PageLayout>
        <EmptyStates.Error
          onRetry={() => window.location.reload()}
          title="Category Not Found"
          description="The category you're looking for doesn't exist or has been removed."
          actionLabel="Browse All Products"
          actionHref="/browse"
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={category.name}
      description={`${categoryProducts.length} ${categoryProducts.length === 1 ? "product" : "products"} found`}
      breadcrumbs={[
        { label: "Browse", href: "/browse" },
        { label: category.name },
      ]}
    >
      <div className="space-y-6">
        {/* Controls */}
        <VendorStyleFilterBar
          search={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeFilterCount={searchQuery ? 1 : 0}
          activeFilters={searchQuery ? [{ type: "search", value: searchQuery, label: `Search: ${searchQuery}` }] : []}
          onRemoveFilter={(type) => {
            if (type === "search") setSearchQuery("");
          }}
          onClearAllFilters={() => setSearchQuery("")}
          className="mb-6"
        />

        {/* Products Grid/List */}
        <ProductGrid
          products={categoryProducts}
          viewMode={viewMode}
          isLoading={loading}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onBuyNow={handleBuyNow}
          onShare={handleShare}
        />
      </div>
    </PageLayout>
  );
}
