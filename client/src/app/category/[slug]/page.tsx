"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductAPI, getCategoryAPI } from "@/lib/api/client";
import { Product, Category } from "@/lib/api/types";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Heart, Grid3x3, List, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

    // Sort products
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        // Default sorting
        break;
    }

    return filtered;
  }, [categorySlug, sortBy]);

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none border-0"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none border-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        {categoryProducts.length === 0 ? (
          <EmptyStates.NoProducts />
        ) : (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4",
            )}
          >
            {categoryProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className={cn(viewMode === "grid" ? "" : "flex")}>
                  {/* Product Image */}
                  <div
                    className={cn(
                      "relative bg-gray-100",
                      viewMode === "grid"
                        ? "aspect-square"
                        : "w-48 h-48 flex-shrink-0",
                    )}
                  >
                    <Link href={`/product/${product.id}`}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </Link>
                    {product.authenticity?.verified && (
                      <Badge className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <CardContent
                    className={cn("p-4", viewMode === "list" ? "flex-1" : "")}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-1 mb-3">
                        <Link
                          href={`/product/${product.id}`}
                          className="text-lg font-semibold hover:text-primary transition-colors line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          Sold by {product.vendor}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{product.condition}</Badge>
                          <Badge variant="outline">{product.rarity}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold">
                            ${product.price}
                          </span>
                          <p className="text-sm text-muted-foreground">
                            {product.stock > 5
                              ? "In Stock"
                              : `${product.stock} left`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
