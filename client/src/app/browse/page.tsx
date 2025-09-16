"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import {
  FilterSidebar,
  MobileFilterSheet,
} from "@/components/browse/FilterSidebar";
import { SearchBar } from "@/components/browse/SearchBar";
import { ProductGrid } from "@/components/browse/ProductGrid";
import { FilterBadges } from "@/components/browse/FilterBadges";
import { QuickView } from "@/components/browse/QuickView";
import { Pagination } from "@/components/browse/Pagination";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBrowseFilters } from "@/hooks/useBrowseFilters";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getProductAPI, getCategoryAPI } from "@/lib/api/client";
import { Product, Category } from "@/lib/api/types";
import { Filter } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { designTokens } from "@/lib/design-tokens";

function BrowsePageContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const productAPI = getProductAPI();
        const categoryAPI = getCategoryAPI();

        const [productsResponse, categoriesResponse] = await Promise.all([
          productAPI.getProducts({ limit: 100 }),
          categoryAPI.getCategories(),
        ]);

        if (productsResponse.success) {
          setProducts(productsResponse.data.data);
        }

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Use the custom hook for filters
  const {
    filters,
    sortOption,
    viewMode,
    filteredProducts,
    activeFilterCount,
    isFiltering,
    updateFilter,
    clearFilters,
    clearFilter,
    setSortOption,
    setViewMode,
    saveFilterPreset,
    loadFilterPreset,
    getFilterPresets,
  } = useBrowseFilters(products);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of product grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Handle filter removal from badges
  const handleRemoveFilter = (type: string, value: string) => {
    switch (type) {
      case "search":
        updateFilter("search", "");
        break;
      case "category":
        updateFilter(
          "categories",
          filters.categories.filter((c) => c !== value),
        );
        break;
      case "condition":
        updateFilter(
          "conditions",
          filters.conditions.filter((c) => c !== value),
        );
        break;
      case "rarity":
        updateFilter(
          "rarities",
          filters.rarities.filter((r) => r !== value),
        );
        break;
      case "price":
        updateFilter("priceRange", { min: 0, max: 10000 });
        break;
      case "vendor":
        updateFilter(
          "vendors",
          filters.vendors.filter((v) => v !== value),
        );
        break;
      case "inStock":
        updateFilter("inStock", false);
        break;
      case "verified":
        updateFilter("verified", false);
        break;
      case "featured":
        updateFilter("featured", false);
        break;
      case "tag":
        updateFilter(
          "tags",
          filters.tags.filter((t) => t !== value),
        );
        break;
    }
  };

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
      featured: product.featured || false,
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
      rarity: product.rarity as any,
      stock: product.stock,
      sold: 0,
      featured: product.featured || false,
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Clear filters with Escape
      if (e.key === "Escape" && activeFilterCount > 0) {
        e.preventDefault();
        clearFilters();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeFilterCount, clearFilters]);

  return (
    <PageLayout
      title="Browse Collectibles"
      description={
        isFiltering
          ? "Filtering..."
          : `${filteredProducts.length} items found${
              filteredProducts.length > itemsPerPage
                ? ` • Page ${currentPage} of ${totalPages}`
                : ""
            }`
      }
      breadcrumbs={[{ label: "Browse Collectibles" }]}
    >
      {/* Mobile Filter Button */}
      <div className="flex justify-end mb-8 lg:hidden">
        <MobileFilterSheet
          filters={filters}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          categories={categories}
          products={products}
        >
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </MobileFilterSheet>
      </div>

      {/* Search and Controls */}
      <div className="mb-6">
        <SearchBar
          search={filters.search}
          onSearchChange={(value) => updateFilter("search", value)}
          sortOption={sortOption}
          onSortChange={setSortOption}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeFilterCount={activeFilterCount}
          onOpenFilters={() => {}}
          showDesktopFilters={true}
          filterContent={
            <div className="max-h-96 overflow-y-auto">
              <FilterSidebar
                filters={filters}
                onUpdateFilter={updateFilter}
                onClearFilters={clearFilters}
                categories={categories}
                products={products}
                className="bg-transparent border-none shadow-none p-0"
              />
            </div>
          }
        />
      </div>

      {/* Filter Badges */}
      {activeFilterCount > 0 && (
        <div className="mb-6">
          <FilterBadges
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={clearFilters}
          />
        </div>
      )}

      {/* Product Grid */}
      <div className="mb-8">
        <ProductGrid
          products={paginatedProducts}
          viewMode={viewMode}
          isLoading={isFiltering}
          onQuickView={(product) => setQuickViewProduct(product)}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onBuyNow={handleBuyNow}
          onShare={handleShare}
        />
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />
    </PageLayout>
  );
}

export default function BrowsePage() {
  return (
    <Suspense>
      <BrowsePageContent />
    </Suspense>
  );
}
