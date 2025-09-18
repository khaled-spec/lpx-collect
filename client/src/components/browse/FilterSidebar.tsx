"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  BrowseFilters,
  CONDITIONS,
  getPriceHistogram,
  getUniqueVendors,
  getActiveFilterCount,
} from "@/lib/browse-utils";
import { Category, Product } from "@/lib/api/types";
import {
  Filter,
  Sparkles,
  Shield,
  Package,
  Tag,
  Store,
  DollarSign,
  Star,
  TrendingUp,
  X,
  Save,
  Download,
  Upload,
} from "lucide-react";

interface FilterSidebarProps {
  filters: BrowseFilters;
  onUpdateFilter: <K extends keyof BrowseFilters>(
    key: K,
    value: BrowseFilters[K],
  ) => void;
  onClearFilters: () => void;
  categories: Category[];
  products: Product[];
  className?: string;
}

export function FilterSidebar({
  filters,
  onUpdateFilter,
  onClearFilters,
  categories,
  products,
  className,
}: FilterSidebarProps) {
  const [priceInputs, setPriceInputs] = useState({
    min: filters.priceRange.min.toString(),
    max: filters.priceRange.max.toString(),
  });
  const [priceHistogram, setPriceHistogram] = useState<
    { range: string; count: number }[]
  >([]);

  const vendors = getUniqueVendors(products);

  // Calculate histogram only on client side to avoid hydration mismatch
  useEffect(() => {
    setPriceHistogram(getPriceHistogram(products));
  }, [products]);

  const activeFilterCount = getActiveFilterCount(filters);

  const handlePriceChange = (type: "min" | "max", value: string) => {
    setPriceInputs((prev) => ({ ...prev, [type]: value }));

    const numValue = Number(value) || 0;
    onUpdateFilter("priceRange", {
      ...filters.priceRange,
      [type]: numValue,
    });
  };

  const handleCategoryToggle = (categorySlug: string) => {
    const newCategories = filters.categories.includes(categorySlug)
      ? filters.categories.filter((c) => c !== categorySlug)
      : [...filters.categories, categorySlug];
    onUpdateFilter("categories", newCategories);
  };

  const handleConditionToggle = (condition: string) => {
    const newConditions = filters.conditions.includes(condition)
      ? filters.conditions.filter((c) => c !== condition)
      : [...filters.conditions, condition];
    onUpdateFilter("conditions", newConditions);
  };


  const handleVendorToggle = (vendorId: string) => {
    const newVendors = filters.vendors.includes(vendorId)
      ? filters.vendors.filter((v) => v !== vendorId)
      : [...filters.vendors, vendorId];
    onUpdateFilter("vendors", newVendors);
  };

  const sidebarContent = (
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
            {/* Categories */}
            <AccordionItem value="categories">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>Categories</span>
                  {filters.categories.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {filters.categories.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={category.slug}
                        checked={filters.categories.includes(category.slug)}
                        onCheckedChange={() =>
                          handleCategoryToggle(category.slug)
                        }
                      />
                      <Label
                        htmlFor={category.slug}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {category.name}
                        <span className="text-muted-foreground ml-2">
                          ({category.productCount})
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Price Range */}
            <AccordionItem value="price">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Price Range</span>
                  {(filters.priceRange.min > 0 ||
                    filters.priceRange.max < 10000) && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      ${filters.priceRange.min}-${filters.priceRange.max}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Slider
                      min={0}
                      max={10000}
                      step={100}
                      value={[filters.priceRange.min, filters.priceRange.max]}
                      onValueChange={([min, max]) => {
                        setPriceInputs({
                          min: min.toString(),
                          max: max.toString(),
                        });
                        onUpdateFilter("priceRange", { min, max });
                      }}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label htmlFor="min-price" className="text-xs">
                        Min
                      </Label>
                      <Input
                        id="min-price"
                        type="number"
                        value={priceInputs.min}
                        onChange={(e) =>
                          handlePriceChange("min", e.target.value)
                        }
                        className="h-8"
                      />
                    </div>
                    <span className="text-muted-foreground mt-5">-</span>
                    <div className="flex-1">
                      <Label htmlFor="max-price" className="text-xs">
                        Max
                      </Label>
                      <Input
                        id="max-price"
                        type="number"
                        value={priceInputs.max}
                        onChange={(e) =>
                          handlePriceChange("max", e.target.value)
                        }
                        className="h-8"
                      />
                    </div>
                  </div>

                  {/* Price Histogram */}
                  {priceHistogram.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Price distribution
                      </p>
                      <div className="flex items-end h-12 gap-1">
                        {priceHistogram.map((bucket, i) => {
                          const maxCount = Math.max(
                            ...priceHistogram.map((b) => b.count),
                            1,
                          );
                          const heightPercent = Math.round(
                            (bucket.count / maxCount) * 100,
                          );
                          return (
                            <TooltipProvider key={i}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className="flex-1 bg-primary/20 hover:bg-primary/30 transition-colors cursor-pointer"
                                    style={{
                                      height: `${heightPercent}%`,
                                      minHeight: bucket.count > 0 ? "4px" : "0",
                                    }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">
                                    {bucket.range}: {bucket.count} items
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Condition */}
            <AccordionItem value="condition">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Condition</span>
                  {filters.conditions.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {filters.conditions.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {CONDITIONS.map((condition) => (
                    <div
                      key={condition.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={condition.value}
                        checked={filters.conditions.includes(condition.value)}
                        onCheckedChange={() =>
                          handleConditionToggle(condition.value)
                        }
                      />
                      <Label
                        htmlFor={condition.value}
                        className="text-sm font-normal cursor-pointer flex-1 flex items-center gap-2"
                      >
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            condition.color,
                          )}
                        />
                        {condition.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>


            {/* Vendors */}
            {vendors.length > 0 && (
              <AccordionItem value="vendors">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    <span>Vendors</span>
                    {filters.vendors.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                        {filters.vendors.length}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {vendors.slice(0, 10).map((vendor) => (
                      <div
                        key={vendor.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={vendor.id}
                          checked={filters.vendors.includes(vendor.id)}
                          onCheckedChange={() => handleVendorToggle(vendor.id)}
                        />
                        <Label
                          htmlFor={vendor.id}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {vendor.name}
                          <span className="text-muted-foreground ml-2">
                            ({vendor.count})
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          {/* Additional Filters */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="in-stock"
                  className="text-sm font-normal cursor-pointer flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  In Stock Only
                </Label>
                <Switch
                  id="in-stock"
                  checked={filters.inStock}
                  onCheckedChange={(checked) =>
                    onUpdateFilter("inStock", checked)
                  }
                />
              </div>


            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            // TODO: Implement save preset functionality
            console.log("Save filter preset");
          }}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Filter Preset
        </Button>
      </div>
    </div>
  );

  // Desktop sidebar
  return (
    <div className={cn("w-full bg-background h-full", className)}>
      {sidebarContent}
    </div>
  );
}

// Mobile filter sheet
export function MobileFilterSheet({
  filters,
  onUpdateFilter,
  onClearFilters,
  categories,
  products,
  children,
}: Omit<FilterSidebarProps, "className"> & {
  children: React.ReactNode;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <FilterSidebar
          filters={filters}
          onUpdateFilter={onUpdateFilter}
          onClearFilters={onClearFilters}
          categories={categories}
          products={products}
        />
      </SheetContent>
    </Sheet>
  );
}
