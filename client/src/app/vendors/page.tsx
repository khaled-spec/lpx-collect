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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  Zap,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { productStyles } from "@/components/custom/product-styles";
import { designTokens } from "@/lib/design-tokens";

// Helper function to generate extended vendor data
const generateExtendedVendors = (vendors: Vendor[]) =>
  vendors.map((vendor, index) => ({
    ...vendor,
    storeName: vendor.name,
    totalSales: Math.floor(Math.random() * 50000) + 1000,
    totalProducts: vendor.productCount,
    responseTime: `${Math.floor(Math.random() * 24) + 1}h`,
    verified: Math.random() > 0.3,
    featured: Math.random() > 0.7,
    specialties: [
      "Trading Cards",
      "Comics",
      "Vintage Toys",
      "Sports Memorabilia",
    ].filter(() => Math.random() > 0.5),
    badges: [
      "Top Seller",
      "Fast Shipper",
      "Trusted Vendor",
      "Premium Quality",
    ].filter(() => Math.random() > 0.6),
    stats: {
      positiveReviews: Math.floor(Math.random() * 20) + 80,
      shipOnTime: Math.floor(Math.random() * 15) + 85,
      responseRate: Math.floor(Math.random() * 10) + 90,
      repeatCustomers: Math.floor(Math.random() * 30) + 40,
    },
    joinedDate: new Date(
      2020 + Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    ),
    location: [
      "New York, USA",
      "Los Angeles, USA",
      "London, UK",
      "Tokyo, Japan",
      "Toronto, Canada",
    ][index % 5],
    followers: Math.floor(Math.random() * 10000) + 500,
  }));

const specialtyOptions = [
  "Trading Cards",
  "Comics",
  "Coins",
  "Stamps",
  "Vintage Toys",
  "Sports Memorabilia",
  "Art & Prints",
  "Antiques",
];

const sortOptions = [
  { value: "rating-desc", label: "Highest Rated", icon: Star },
  { value: "sales-desc", label: "Most Sales", icon: TrendingUp },
  { value: "newest", label: "Newest First", icon: Calendar },
  { value: "response", label: "Fastest Response", icon: Zap },
  { value: "products-desc", label: "Most Products", icon: Package },
  { value: "followers-desc", label: "Most Followers", icon: Users },
];

interface VendorFilters {
  search: string;
  specialties: string[];
  rating: number;
  verified: boolean;
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
    (filters.verified ? 1 : 0) +
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
                  {(filters.verified || filters.featured) && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {(filters.verified ? 1 : 0) + (filters.featured ? 1 : 0)}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="verified"
                      className="font-normal cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Verified Vendors</span>
                      </div>
                    </Label>
                    <Switch
                      id="verified"
                      checked={filters.verified}
                      onCheckedChange={(checked) =>
                        onUpdateFilter("verified", checked)
                      }
                    />
                  </div>
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

// Search Bar Component
function VendorSearchBar({
  search,
  onSearchChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  activeFilterCount,
  showDesktopFilters = false,
  filterContent,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  activeFilterCount: number;
  showDesktopFilters?: boolean;
  filterContent?: React.ReactNode;
}) {
  const [inputValue, setInputValue] = useState(search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== search) {
        onSearchChange(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, search, onSearchChange]);

  return (
    <div className="flex items-center gap-3">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search vendors by name, specialty, or location..."
          className="pl-9 pr-9 h-9"
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setInputValue("");
              onSearchChange("");
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Desktop Filter Button */}
      {showDesktopFilters && filterContent && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="default" className="hidden lg:flex">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            {filterContent}
          </PopoverContent>
        </Popover>
      )}

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">
              {sortOptions.find((o) => o.value === sortOption)?.label || "Sort"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={cn(
                  "gap-2",
                  sortOption === option.value && "bg-accent",
                )}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Mode Toggle */}
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(value) =>
          value && onViewModeChange(value as "grid" | "list")
        }
        className="hidden sm:flex"
      >
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <Grid3x3 className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <LayoutList className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
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

  if (filters.verified) {
    badges.push({ type: "verified", label: "Verified only" });
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
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VendorFilters>({
    search: "",
    specialties: [],
    rating: 0,
    verified: false,
    featured: false,
    minProducts: 0,
    location: "",
  });
  const [sortBy, setSortBy] = useState("rating-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // Update filter
  const updateFilter = <K extends keyof VendorFilters>(
    key: K,
    value: VendorFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      specialties: [],
      rating: 0,
      verified: false,
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
      case "verified":
        updateFilter("verified", false);
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
    (filters.verified ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.minProducts > 0 ? 1 : 0) +
    (filters.location ? 1 : 0);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const api = getVendorAPI();
        const response = await api.getVendors({ verified: filters.verified });

        if (response.success) {
          const extended = generateExtendedVendors(response.data);
          setVendors(extended);
        }
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVendors();
  }, [filters.verified]);

  // Filter and sort vendors

  const filteredVendors = useMemo(() => {
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

    if (filters.verified) {
      filtered = filtered.filter((v) => v.verified);
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
      case "sales-desc":
        filtered.sort((a, b) => b.totalSales - a.totalSales);
        break;
      case "newest":
        filtered.sort(
          (a, b) => b.joinedDate.getTime() - a.joinedDate.getTime(),
        );
        break;
      case "response":
        filtered.sort((a, b) => {
          const aTime = parseInt(a.responseTime);
          const bTime = parseInt(b.responseTime);
          return aTime - bTime;
        });
        break;
      case "products-desc":
        filtered.sort((a, b) => b.totalProducts - a.totalProducts);
        break;
      case "followers-desc":
        filtered.sort((a, b) => b.followers - a.followers);
        break;
      case "rating-desc":
      default:
        filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [filters, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const paginatedVendors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVendors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVendors, currentPage, itemsPerPage]);

  // Handle vendor follow
  const handleFollow = (vendorId: string) => {
    // In a real app, this would make an API call
    console.log("Following vendor:", vendorId);
  };

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
        <VendorSearchBar
          search={filters.search}
          onSearchChange={(value) => updateFilter("search", value)}
          sortOption={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeFilterCount={activeFilterCount}
          showDesktopFilters={true}
          filterContent={
            <div className="max-h-96 overflow-y-auto">
              <FilterContent
                filters={filters}
                onUpdateFilter={updateFilter}
                onClearFilters={clearFilters}
                vendors={vendors}
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

      {/* Vendor Grid/List */}
      <div className="mb-8">
        {paginatedVendors.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6"
                : "space-y-4",
            )}
          >
            {paginatedVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                viewMode={viewMode}
                onFollow={handleFollow}
              />
            ))}
          </div>
        ) : (
          <EmptyStates.NoVendors />
        )}
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
