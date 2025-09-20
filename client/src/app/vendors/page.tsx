"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getVendorAPI } from "@/lib/api/client";
import { Vendor } from "@/lib/api/types";
import {
  Store,
  Star,
  Package,
  Clock,
  Shield,
  CheckCircle,
  Search,
  Grid3x3,
  LayoutList,
  Filter,
  X,
  MapPin,
  ArrowUpDown,
  Users,
  TrendingUp,
  Award,
  Heart,
  MessageSquare,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { productStyles } from "@/components/custom/product-styles";
import { designTokens } from "@/lib/design-tokens";
import { VendorStyleFilterBar } from "@/components/browse/VendorStyleFilterBar";
import { ViewMode, SortOption } from "@/lib/browse-utils";

// Helper function to extend vendor data while preserving our organized data
const generateExtendedVendors = (vendors: Vendor[]) => {
  console.log('🔄 generateExtendedVendors called with:', vendors?.length, 'vendors', vendors);
  const result = vendors.map((vendor) => ({
    ...vendor,
    storeName: vendor.name,
    // Keep existing data and only add missing fields
    totalSales: vendor.totalSales || Math.floor(Math.random() * 5000) + 500,
    totalProducts: vendor.totalProducts || vendor.productCount || 0,
    // Keep vendor specialties if they exist, otherwise use fallback
    specialties: vendor.specialties && vendor.specialties.length > 0
      ? vendor.specialties
      : ["General Merchandise"],
    // Convert location object to string if needed
    location: typeof vendor.location === 'string'
      ? vendor.location
      : vendor.location?.city
        ? `${vendor.location.city}, ${vendor.location.state || ''} ${vendor.location.country || ''}`.trim()
        : 'Location not specified',
    // Add computed fields that don't exist in mock data
    badges: vendor.verified
      ? ["Verified Vendor", ...(vendor.featured ? ["Featured"] : [])]
      : [],
    stats: {
      positiveReviews: Math.floor((vendor.rating || 4.0) * 20),
      shipOnTime: 85 + Math.floor((vendor.rating || 4.0) * 3),
      responseRate: 90 + Math.floor((vendor.rating || 4.0) * 2),
      repeatCustomers: 40 + Math.floor((vendor.rating || 4.0) * 10),
    },
    joinedDate: vendor.joinedDate ? new Date(vendor.joinedDate) : new Date(),
    followers: Math.floor((vendor.totalSales || 1000) / 5) + Math.floor((vendor.rating || 4.0) * 200),
  }));
  console.log('✅ generateExtendedVendors result:', result?.length, 'extended vendors', result);
  return result;
};

const specialtyOptions = [
  "Trading Cards",
  "Comics",
  "Pokémon",
  "Magic: The Gathering",
  "Sports Cards",
  "Gaming Cards",
  "Yu-Gi-Oh!",
  "Marvel",
  "DC Comics",
  "Manga",
  "Graphic Novels",
  "Vintage Comics",
  "First Editions",
  "Rare Comics",
  "Collectible Cards",
  "PSA Graded",
  "CGC Graded",
  "Mint Condition",
  "Near Mint",
  "Excellent Condition",
  "Vintage Items",
  "Rare Items",
  "Limited Editions",
  "Special Editions",
  "Holographic Cards",
  "Foil Cards",
  "Promo Cards",
  "Tournament Cards",
  "Japanese Cards",
  "English Cards",
  "Arabic Comics",
  "International Comics",
  "Collectibles",
  "Memorabilia",
  "Authenticated Items",
  "Certified Items",
  "Investment Grade",
  "High Value Items",
  "Popular Characters",
  "Superhero Comics",
  "Anime Cards",
  "Sports Memorabilia",
  "Rookie Cards",
  "Hall of Fame",
  "Championship Cards",
  "General Merchandise",
];


interface VendorFilters {
  search: string;
  specialties: string[];
  rating: number;
  featured: boolean;
  minProducts: number;
  location: string;
}

// Mobile Filter Sheet Component
function MobileFilterSheet({
  filters,
  onUpdateFilter,
  onClearFilters,
  vendors = [],
  children,
}: {
  filters: VendorFilters;
  onUpdateFilter: <K extends keyof VendorFilters>(
    key: K,
    value: VendorFilters[K],
  ) => void;
  onClearFilters: () => void;
  vendors?: any[];
  children: React.ReactNode;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle>Filter Vendors</SheetTitle>
        </SheetHeader>
        <Separator />
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <FilterContent
            filters={filters}
            onUpdateFilter={onUpdateFilter}
            onClearFilters={onClearFilters}
            vendors={vendors}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// Filter Content Component (reusable for sidebar and mobile sheet)
function FilterContent({
  filters,
  onUpdateFilter,
  onClearFilters,
  vendors = [],
}: {
  filters: VendorFilters;
  onUpdateFilter: <K extends keyof VendorFilters>(
    key: K,
    value: VendorFilters[K],
  ) => void;
  onClearFilters: () => void;
  vendors?: any[];
}) {
  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.specialties.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.minProducts > 0 ? 1 : 0) +
    (filters.location ? 1 : 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 min-h-[61px] border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-semibold">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-7 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Filters */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <Accordion type="multiple" defaultValue={[]} className="w-full">
            {/* Specialties */}
            <AccordionItem value="specialties">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Specialties</span>
                  {filters.specialties.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {filters.specialties.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {specialtyOptions.map((specialty) => (
                    <div
                      key={specialty}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={specialty}
                        checked={filters.specialties.includes(specialty)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onUpdateFilter("specialties", [
                              ...filters.specialties,
                              specialty,
                            ]);
                          } else {
                            onUpdateFilter(
                              "specialties",
                              filters.specialties.filter(
                                (s) => s !== specialty,
                              ),
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={specialty}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {specialty}
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {
                          vendors.filter((v) =>
                            v.specialties?.includes(specialty),
                          ).length
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Rating */}
            <AccordionItem value="rating">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Minimum Rating</span>
                  {filters.rating > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {filters.rating}+
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={filters.rating.toString()}
                  onValueChange={(value) =>
                    onUpdateFilter("rating", parseFloat(value))
                  }
                >
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="rating-all" />
                      <Label
                        htmlFor="rating-all"
                        className="font-normal cursor-pointer flex-1"
                      >
                        All Ratings
                      </Label>
                    </div>
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={rating.toString()}
                          id={`rating-${rating}`}
                        />
                        <Label
                          htmlFor={`rating-${rating}`}
                          className="font-normal cursor-pointer flex-1"
                        >
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{rating}+ stars</span>
                          </div>
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {vendors.filter((v) => v.rating >= rating).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>

            {/* Features */}
            <AccordionItem value="features">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Features</span>
                  {filters.featured && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      1
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="featured"
                      className="font-normal cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span>Featured Vendors</span>
                      </div>
                    </Label>
                    <Switch
                      id="featured"
                      checked={filters.featured}
                      onCheckedChange={(checked) =>
                        onUpdateFilter("featured", checked)
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Product Count */}
            <AccordionItem value="products">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Minimum Products</span>
                  {filters.minProducts > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {filters.minProducts}+
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{filters.minProducts}</span>
                    <span className="text-muted-foreground">products</span>
                  </div>
                  <Slider
                    value={[filters.minProducts]}
                    onValueChange={([value]) =>
                      onUpdateFilter("minProducts", value)
                    }
                    min={0}
                    max={500}
                    step={50}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Any</span>
                    <span>500+</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}


// Filter Badges Component
function FilterBadges({
  filters,
  onRemoveFilter,
  onClearAll,
}: {
  filters: VendorFilters;
  onRemoveFilter: (type: string, value?: string) => void;
  onClearAll: () => void;
}) {
  const badges = [];

  if (filters.search) {
    badges.push({
      type: "search",
      label: `Search: "${filters.search}"`,
      value: filters.search,
    });
  }

  filters.specialties.forEach((specialty) => {
    badges.push({ type: "specialty", label: specialty, value: specialty });
  });

  if (filters.rating > 0) {
    badges.push({ type: "rating", label: `${filters.rating}+ stars` });
  }

  if (filters.featured) {
    badges.push({ type: "featured", label: "Featured only" });
  }

  if (filters.minProducts > 0) {
    badges.push({
      type: "minProducts",
      label: `${filters.minProducts}+ products`,
    });
  }

  if (filters.location) {
    badges.push({
      type: "location",
      label: filters.location,
      value: filters.location,
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="bg-muted/30 rounded-lg border p-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm text-muted-foreground flex-shrink-0">
          Active filters:
        </span>
        {badges.map((badge, index) => (
          <Badge
            key={`${badge.type}-${badge.value || index}`}
            variant="secondary"
            className="gap-1 pr-1"
          >
            {badge.label}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFilter(badge.type, badge.value)}
              className="h-4 w-4 p-0 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-6 text-xs"
        >
          Clear all
        </Button>
      </div>
    </div>
  );
}

// Vendor Card Component
function VendorCard({
  vendor,
  viewMode,
  onFollow,
}: {
  vendor: any;
  viewMode: "grid" | "list";
  onFollow: (vendorId: string) => void;
}) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFollowing(!isFollowing);
    onFollow(vendor.id);
    toast.success(isFollowing ? "Unfollowed vendor" : "Following vendor");
  };

  if (viewMode === "list") {
    return (
      <Link href={`/vendor/${vendor.id}`}>
        <div className="group bg-card rounded-lg border hover:shadow-lg transition-all p-6">
          <div className="flex gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                <Store className="h-10 w-10 text-primary" />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {vendor.storeName}
                    </h3>
                    {vendor.verified && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {vendor.featured && (
                      <Award className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {vendor.description}
                  </p>

                  {/* Specialties */}
                  {vendor.specialties && vendor.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {vendor.specialties.map((specialty: string) => (
                        <Badge
                          key={specialty}
                          variant="outline"
                          className="text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{vendor.rating}</span>
                      <span className="text-muted-foreground">
                        ({vendor.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>{vendor.totalProducts} products</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{vendor.totalSales.toLocaleString()} sales</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{vendor.followers.toLocaleString()} followers</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{vendor.location}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant={isFollowing ? "outline" : "default"}
                    onClick={handleFollow}
                    className="gap-1"
                  >
                    <Heart
                      className={cn("h-3 w-3", isFollowing && "fill-current")}
                    />
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <MessageSquare className="h-3 w-3" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/vendor/${vendor.id}`}>
      <div className="group bg-card rounded-lg border hover:shadow-lg transition-all p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <Button
            size="sm"
            variant={isFollowing ? "outline" : "default"}
            onClick={handleFollow}
            className="gap-1"
          >
            <Heart className={cn("h-3 w-3", isFollowing && "fill-current")} />
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>

        {/* Title & Badges */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
            {vendor.storeName}
          </h3>
          {vendor.verified && (
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          )}
          {vendor.featured && (
            <Award className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium">{vendor.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({vendor.reviewCount} reviews)
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {vendor.description}
        </p>

        {/* Specialties */}
        {vendor.specialties && vendor.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {vendor.specialties.slice(0, 3).map((specialty: string) => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {vendor.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{vendor.specialties.length - 3}
              </Badge>
            )}
          </div>
        )}

        <Separator className="my-4" />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>{vendor.totalProducts} items</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>{vendor.totalSales.toLocaleString()} sales</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{vendor.responseTime} response</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>{vendor.stats.positiveReviews}% positive</span>
          </div>
        </div>

        {/* Location & Followers */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{vendor.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{vendor.followers.toLocaleString()} followers</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Pagination Component
function VendorPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}) {
  const pages = [];
  const maxVisible = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Show</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              {itemsPerPage}
              <ArrowUpDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {[12, 24, 48, 96].map((value) => (
              <DropdownMenuItem
                key={value}
                onClick={() => onItemsPerPageChange(value)}
                className={cn(itemsPerPage === value && "bg-accent")}
              >
                {value} per page
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <span>of {totalItems} vendors</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {startPage > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(1)}
              >
                1
              </Button>
              {startPage > 2 && <span className="px-1">...</span>}
            </>
          )}

          {pages.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-1">...</span>}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default function VendorsPage() {
  console.log('🚀 VendorsPage component mounting/rendering');
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VendorFilters>({
    search: "",
    specialties: [],
    rating: 0,
    featured: false,
    minProducts: 0,
    location: "",
  });
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  console.log('📊 Current state:', {
    vendorsCount: vendors?.length,
    loading,
    filters,
    sortBy,
    viewMode,
    currentPage,
    itemsPerPage
  });

  // Update filter
  const updateFilter = <K extends keyof VendorFilters>(
    key: K,
    value: VendorFilters[K],
  ) => {
    console.log('🔄 Filter update:', key, '=', value);
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      console.log('📝 New filters state:', newFilters);
      return newFilters;
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      specialties: [],
      rating: 0,
      featured: false,
      minProducts: 0,
      location: "",
    });
    setCurrentPage(1);
  };

  // Handle filter removal from badges
  const handleRemoveFilter = (type: string, value?: string) => {
    switch (type) {
      case "search":
        updateFilter("search", "");
        break;
      case "specialty":
        updateFilter(
          "specialties",
          filters.specialties.filter((s) => s !== value),
        );
        break;
      case "rating":
        updateFilter("rating", 0);
        break;
      case "featured":
        updateFilter("featured", false);
        break;
      case "minProducts":
        updateFilter("minProducts", 0);
        break;
      case "location":
        updateFilter("location", "");
        break;
    }
  };

  // Calculate active filter count
  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.specialties.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.minProducts > 0 ? 1 : 0) +
    (filters.location ? 1 : 0);

  useEffect(() => {
    console.log('🔥 useEffect triggered - starting vendor fetch at:', new Date().toISOString());

    async function fetchVendors() {
      console.log('🛠️ fetchVendors function called');
      try {
        console.log('📡 Getting vendor API...');
        const api = getVendorAPI();
        console.log('📡 API instance created:', api);

        console.log('📡 Calling api.getVendors()...');
        const response = await api.getVendors();
        console.log('📦 API response received:', response);

        if (response.success) {
          console.log('✅ API success - processing', response.data?.length, 'vendors');
          const extended = generateExtendedVendors(response.data);
          console.log('💾 Setting vendors state with', extended?.length, 'extended vendors');
          setVendors(extended);
        } else {
          console.error('❌ API failed:', response.error);
        }
      } catch (error) {
        console.error("💥 Failed to fetch vendors:", error);
      } finally {
        console.log('🏁 Setting loading to false');
        setLoading(false);
      }
    }

    console.log('💡 Calling fetchVendors() function...');
    fetchVendors();
    console.log('📩 fetchVendors() call completed (async)');
  }, []);

  // Filter and sort vendors
  const filteredVendors = useMemo(() => {
    console.log('🧮 filteredVendors useMemo triggered - input vendors:', vendors?.length);
    console.log('🧮 Filtering with:', { filters, sortBy });
    let filtered = [...vendors];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.storeName.toLowerCase().includes(searchLower) ||
          v.description.toLowerCase().includes(searchLower) ||
          v.location?.toLowerCase().includes(searchLower) ||
          v.specialties?.some((s: string) =>
            s.toLowerCase().includes(searchLower),
          ),
      );
    }

    if (filters.specialties.length > 0) {
      filtered = filtered.filter((v) =>
        v.specialties?.some((s: string) => filters.specialties.includes(s)),
      );
    }

    if (filters.rating > 0) {
      filtered = filtered.filter((v) => v.rating >= filters.rating);
    }

    if (filters.featured) {
      filtered = filtered.filter((v) => v.featured);
    }

    if (filters.minProducts > 0) {
      filtered = filtered.filter((v) => v.totalProducts >= filters.minProducts);
    }

    if (filters.location) {
      filtered = filtered.filter((v) =>
        v.location?.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) => b.joinedDate.getTime() - a.joinedDate.getTime(),
        );
        break;
      case "name-asc":
        filtered.sort((a, b) => a.storeName.localeCompare(b.storeName));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.storeName.localeCompare(a.storeName));
        break;
      case "price-asc":
        // For vendors, we might sort by average product price or another metric
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => b.rating - a.rating);
    }

    console.log('🎯 filteredVendors result:', filtered?.length, 'vendors after filtering and sorting');
    console.log('🎯 Final filtered vendors:', filtered);
    return filtered;
  }, [vendors, filters, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const paginatedVendors = useMemo(() => {
    console.log('📄 paginatedVendors useMemo triggered');
    console.log('📄 Pagination params:', {
      filteredVendorsCount: filteredVendors?.length,
      currentPage,
      itemsPerPage,
      totalPages
    });
    const startIndex = (currentPage - 1) * itemsPerPage;
    const result = filteredVendors.slice(startIndex, startIndex + itemsPerPage);
    console.log('📄 paginatedVendors result:', result?.length, 'vendors for page', currentPage);
    console.log('📄 Final paginated vendors:', result);
    return result;
  }, [filteredVendors, currentPage, itemsPerPage]);

  // Handle vendor follow
  const handleFollow = (vendorId: string) => {
    // In a real app, this would make an API call
    console.log("👤 Following vendor:", vendorId);
  };

  // Log render decisions
  console.log('🎨 Render decision:', {
    loading,
    paginatedVendorsCount: paginatedVendors?.length,
    filteredVendorsCount: filteredVendors?.length,
    willShowEmptyState: paginatedVendors.length === 0,
    willShowVendors: paginatedVendors.length > 0
  });

  return (
    <PageLayout
      title="Browse Vendors"
      description={`${filteredVendors.length} vendors found${
        filteredVendors.length > itemsPerPage
          ? ` • Page ${currentPage} of ${totalPages}`
          : ""
      }`}
      breadcrumbs={[{ label: "Browse Vendors" }]}
    >
      {/* Page Header Actions - Mobile Filter Button */}
      <div className="flex justify-end mb-6 lg:hidden">
        <MobileFilterSheet
          filters={filters}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          vendors={vendors}
        >
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </MobileFilterSheet>
      </div>

      {/* Search and Controls */}
      <div className="mb-6">
        <VendorStyleFilterBar
          search={filters.search}
          onSearchChange={(value) => updateFilter("search", value)}
          sortOption={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeFilterCount={activeFilterCount}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={clearFilters}
          advancedFilterContent={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Specialties Filter */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Specialties
                </Label>
                <Select
                  value={filters.specialties.length > 0 ? filters.specialties[0] : "all"}
                  onValueChange={(value) => {
                    if (value && value !== "all") {
                      updateFilter("specialties", [value]);
                    } else {
                      updateFilter("specialties", []);
                    }
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select specialties..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {specialtyOptions.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Minimum Rating
                </Label>
                <Select
                  value={filters.rating.toString()}
                  onValueChange={(value) => updateFilter("rating", parseFloat(value))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select rating..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Ratings</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                    <SelectItem value="4.0">4.0+ stars</SelectItem>
                    <SelectItem value="3.5">3.5+ stars</SelectItem>
                    <SelectItem value="3.0">3.0+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

      {/* Vendor Grid/List */}
      <div className="mb-8">
        {(() => {
          if (loading) {
            console.log('⏳ Rendering loading state');
            return <div>Loading vendors...</div>;
          }

          if (paginatedVendors.length > 0) {
            console.log('✅ Rendering', paginatedVendors.length, 'vendor cards');
            return (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4",
                )}
              >
                {paginatedVendors.map((vendor) => {
                  console.log('🏢 Rendering vendor card for:', vendor.id, vendor.storeName || vendor.name);
                  return (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      viewMode={viewMode}
                      onFollow={handleFollow}
                    />
                  );
                })}
              </div>
            );
          } else {
            console.log('🚫 Rendering empty state - no vendors to show');
            return <EmptyStates.NoVendors />;
          }
        })()}
      </div>

      {/* Pagination */}
      {filteredVendors.length > itemsPerPage && (
        <div className="mt-8 pt-6 border-t border-border">
          <VendorPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredVendors.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(items) => {
              setItemsPerPage(items);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
    </PageLayout>
  );
}
