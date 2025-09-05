"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/custom/badge-variants";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Grid3X3,
  Grid2X2,
  List,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { designTokens } from "@/lib/design-tokens";
import { 
  getCategoryAPI, 
  getProductAPI, 
  type Category, 
  type Product, 
  type ProductFilter 
} from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";

const sortOptions = [
  { value: "newest", label: "Newest", icon: Clock },
  { value: "price-asc", label: "Price: Low to High", icon: DollarSign },
  { value: "price-desc", label: "Price: High to Low", icon: DollarSign },
  { value: "rating", label: "Highest Rated", icon: Star },
  { value: "popular", label: "Most Popular", icon: TrendingUp },
];

const conditionOptions = [
  { value: "mint", label: "Mint" },
  { value: "near-mint", label: "Near Mint" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

const rarityOptions = [
  { value: "common", label: "Common" },
  { value: "uncommon", label: "Uncommon" },
  { value: "rare", label: "Rare" },
  { value: "ultra-rare", label: "Ultra Rare" },
  { value: "legendary", label: "Legendary" },
];

type ViewMode = "grid" | "grid-compact" | "list";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const categorySlug = params.slug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<ProductFilter["sortBy"]>("newest");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch category and products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const categoryAPI = getCategoryAPI();
        const productAPI = getProductAPI();
        
        // Fetch category details
        const categoryResult = await categoryAPI.getCategoryBySlug(categorySlug);
        
        if (!categoryResult.success) {
          toast.error("Category not found");
          router.push("/browse");
          return;
        }
        
        setCategory(categoryResult.data);
        
        // Check if it's a subcategory and fetch parent
        if (categoryResult.data.parent) {
          const parentResult = await categoryAPI.getCategoryBySlug(categoryResult.data.parent);
          if (parentResult.success) {
            setParentCategory(parentResult.data);
          }
        }
        
        // Fetch products with filters
        const filter: ProductFilter = {
          category: categorySlug,
          conditions: selectedConditions.length > 0 ? selectedConditions : undefined,
          rarities: selectedRarities.length > 0 ? selectedRarities : undefined,
          vendors: selectedVendors.length > 0 ? selectedVendors : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          inStock: inStockOnly || undefined,
          sortBy,
          limit: productsPerPage,
          offset: (currentPage - 1) * productsPerPage,
        };
        
        const productsResult = await productAPI.getProductsByCategory(categorySlug, filter);
        
        if (productsResult.success) {
          setProducts(productsResult.data.data);
          setTotalProducts(productsResult.data.total);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [categorySlug, currentPage, sortBy, priceRange, selectedConditions, selectedRarities, selectedVendors, inStockOnly]);

  const handleAddToCart = (product: Product) => {
    // Convert new Product type to old format for CartContext
    const cartProduct: any = {
      id: product.id,
      title: product.name,
      slug: product.id,
      description: product.description,
      price: product.price,
      images: product.images || [product.image],
      category: {
        id: categorySlug,
        name: product.category,
        slug: product.categorySlug,
      },
      vendor: {
        id: product.vendorId,
        storeName: product.vendor,
        rating: product.rating,
      },
      condition: product.condition,
      rarity: product.rarity,
      stock: product.stock,
      tags: product.tags || [],
    };
    
    addToCart(cartProduct, 1);
    toast.success("Added to cart");
  };

  const handleToggleWishlist = (product: Product) => {
    const isWishlisted = isInWishlist(product.id);
    
    // Convert to old Product type for wishlist
    const wishlistProduct: any = {
      id: product.id,
      title: product.name,
      slug: product.id,
      description: product.description,
      price: product.price,
      images: product.images || [product.image],
      category: {
        id: categorySlug,
        name: product.category,
        slug: product.categorySlug,
      },
      vendor: {
        id: product.vendorId,
        storeName: product.vendor,
        rating: product.rating,
      },
      condition: product.condition,
      rarity: product.rarity,
      stock: product.stock,
      tags: product.tags || [],
    };
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(wishlistProduct);
      toast.success("Added to wishlist");
    }
  };

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedConditions([]);
    setSelectedRarities([]);
    setSelectedVendors([]);
    setInStockOnly(false);
  };

  const activeFilterCount = 
    selectedConditions.length + 
    selectedRarities.length + 
    selectedVendors.length + 
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-auto p-0 text-xs"
            >
              Clear all ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Price Range</Label>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={10000}
          step={10}
          className="mb-2"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      {/* Condition */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Condition</Label>
        <div className="space-y-2">
          {conditionOptions.map((condition) => (
            <div key={condition.value} className="flex items-center space-x-2">
              <Checkbox
                id={condition.value}
                checked={selectedConditions.includes(condition.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedConditions([...selectedConditions, condition.value]);
                  } else {
                    setSelectedConditions(selectedConditions.filter((c) => c !== condition.value));
                  }
                }}
              />
              <Label
                htmlFor={condition.value}
                className="text-sm cursor-pointer"
              >
                {condition.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rarity */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Rarity</Label>
        <div className="space-y-2">
          {rarityOptions.map((rarity) => (
            <div key={rarity.value} className="flex items-center space-x-2">
              <Checkbox
                id={rarity.value}
                checked={selectedRarities.includes(rarity.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedRarities([...selectedRarities, rarity.value]);
                  } else {
                    setSelectedRarities(selectedRarities.filter((r) => r !== rarity.value));
                  }
                }}
              />
              <Label
                htmlFor={rarity.value}
                className="text-sm cursor-pointer"
              >
                {rarity.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* In Stock Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="in-stock"
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
        />
        <Label htmlFor="in-stock" className="text-sm cursor-pointer">
          In Stock Only
        </Label>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-grow">
          <Container className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <Skeleton className="h-96" />
              </div>
              <div className="lg:col-span-3">
                <Skeleton className="h-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-64" />
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow">
        <Container className="py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/browse">Browse</BreadcrumbLink>
              </BreadcrumbItem>
              {parentCategory && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/category/${parentCategory.slug}`}>
                      {parentCategory.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Category Header */}
          <Card className="mb-8 overflow-hidden">
            <div 
              className="h-48 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center relative"
              style={{
                backgroundImage: category.image ? `url(${category.image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 text-center text-white p-8">
                <h1 className={cn(designTokens.heading.h1, "mb-2")}>
                  {category.icon && <span className="mr-3">{category.icon}</span>}
                  {category.name}
                </h1>
                <p className="text-lg opacity-90">
                  {category.description}
                </p>
                <Badge variant="secondary" className="mt-4">
                  {totalProducts} Products
                </Badge>
              </div>
            </div>
          </Card>

          {/* Subcategories */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Subcategories</h2>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((subcat) => (
                  <Link key={subcat.id} href={`/category/${subcat.slug}`}>
                    <CategoryBadge className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                      {subcat.name}
                      <span className="ml-1 opacity-70">({subcat.productCount})</span>
                    </CategoryBadge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filters */}
            <div className="hidden lg:block lg:col-span-1">
              <Card className="p-6">
                <FilterSidebar />
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {products.length} of {totalProducts} products
                  </p>

                  {/* Mobile Filter Button */}
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                          <Badge className="ml-2" variant="secondary">
                            {activeFilterCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as ProductFilter["sortBy"])}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            <option.icon className="mr-2 h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="hidden md:flex items-center gap-1 border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid-compact" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setViewMode("grid-compact")}
                    >
                      <Grid2X2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedConditions.map((condition) => (
                    <Badge key={condition} variant="secondary">
                      {conditionOptions.find((c) => c.value === condition)?.label}
                      <button
                        onClick={() =>
                          setSelectedConditions(selectedConditions.filter((c) => c !== condition))
                        }
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedRarities.map((rarity) => (
                    <Badge key={rarity} variant="secondary">
                      {rarityOptions.find((r) => r.value === rarity)?.label}
                      <button
                        onClick={() =>
                          setSelectedRarities(selectedRarities.filter((r) => r !== rarity))
                        }
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                    <Badge variant="secondary">
                      ${priceRange[0]} - ${priceRange[1]}
                      <button
                        onClick={() => setPriceRange([0, 10000])}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {inStockOnly && (
                    <Badge variant="secondary">
                      In Stock Only
                      <button onClick={() => setInStockOnly(false)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Products */}
              {products.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-16">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No products found</h2>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your filters or search criteria
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div
                    className={cn(
                      "grid gap-4",
                      viewMode === "grid" && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                      viewMode === "grid-compact" && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
                      viewMode === "list" && "grid-cols-1"
                    )}
                  >
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => handleAddToCart(product)}
                        onToggleWishlist={() => handleToggleWishlist(product)}
                        isWishlisted={isInWishlist(product.id)}
                        viewMode={viewMode === "list" ? "horizontal" : "vertical"}
                        compact={viewMode === "grid-compact"}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        const pageNumber = i + 1;
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                      
                      {totalPages > 5 && (
                        <>
                          <span className="px-2">...</span>
                          <Button
                            variant={currentPage === totalPages ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}