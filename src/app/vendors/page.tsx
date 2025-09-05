"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// TODO: Replace with actual data from API or database
const extendedVendors: any[] = [];
import { productStyles } from "@/components/custom/product-styles";
import { cn } from "@/lib/utils";
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
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  MapPin,
  ArrowUpDown,
  Users,
} from "lucide-react";

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
  { value: "rating", label: "Highest Rated" },
  { value: "sales", label: "Most Sales" },
  { value: "newest", label: "Newest First" },
  { value: "response", label: "Fastest Response" },
];

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and sort vendors
  const filteredVendors = useMemo(() => {
    let filtered = [...extendedVendors];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.specialties?.some((s: string) =>
            s.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Specialty filter
    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter((v) =>
        v.specialties?.some((s: string) => selectedSpecialties.includes(s)),
      );
    }

    // Rating filter
    if (selectedRating !== "all") {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter((v) => v.rating >= minRating);
    }

    // Verified filter
    if (verifiedOnly) {
      filtered = filtered.filter((v) => v.verified);
    }

    // Sort
    switch (sortBy) {
      case "sales":
        filtered.sort((a, b) => b.totalSales - a.totalSales);
        break;
      case "newest":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "response":
        filtered.sort((a, b) => {
          const aTime = parseInt(a.responseTime);
          const bTime = parseInt(b.responseTime);
          return aTime - bTime;
        });
        break;
      case "rating":
      default:
        filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [searchQuery, selectedSpecialties, selectedRating, verifiedOnly, sortBy]);

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSpecialties([]);
    setSelectedRating("all");
    setVerifiedOnly(false);
  };

  const activeFilterCount =
    selectedSpecialties.length +
    (selectedRating !== "all" ? 1 : 0) +
    (verifiedOnly ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-card rounded-xl border border-border shadow-lg p-8">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Browse Vendors</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover {filteredVendors.length} trusted sellers from our
                marketplace
              </p>
            </div>

            {/* Compact Filter Bar */}
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
                      <ChevronDown className={productStyles.forms.icon.md} />
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
                      {verifiedOnly && (
                        <span className="badge badge-secondary">
                          Verified Only
                          <button
                            onClick={() => setVerifiedOnly(false)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {selectedSpecialties.length > 0 && (
                        <span className="badge badge-secondary">
                          {selectedSpecialties.length}{" "}
                          {selectedSpecialties.length === 1
                            ? "specialty"
                            : "specialties"}
                        </span>
                      )}
                      {selectedRating !== "all" && (
                        <span className="badge badge-secondary">
                          {selectedRating}+ stars
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
                          {sortOptions.find((o) => o.value === sortBy)?.label}
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
                <div className="border-t border-border animate-slide-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
                  {/* Search (Mobile) */}
                  <div className="sm:hidden">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
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
                        placeholder="Search vendors..."
                        className={cn(
                          productStyles.forms.input.md,
                          "pl-10 w-full border border-input bg-background",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        )}
                      />
                    </div>
                  </div>

                  {/* Verified Only */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Verification
                    </label>
                    <button
                      onClick={() => setVerifiedOnly(!verifiedOnly)}
                      className={cn(
                        productStyles.forms.button.md,
                        "w-full flex items-center justify-center gap-2",
                        verifiedOnly
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <CheckCircle className={productStyles.forms.icon.md} />
                      <span>Verified Only</span>
                    </button>
                  </div>

                  {/* Specialties */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Specialty
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setIsSpecialtyOpen(!isSpecialtyOpen)}
                        onBlur={() =>
                          setTimeout(() => setIsSpecialtyOpen(false), 200)
                        }
                        className={cn(
                          productStyles.forms.select.md,
                          "w-full text-left flex items-center justify-between",
                          "border border-input bg-background hover:bg-accent transition-colors",
                        )}
                      >
                        <span className="truncate">
                          {selectedSpecialties.length > 0
                            ? `${selectedSpecialties[0]}${selectedSpecialties.length > 1 ? ` +${selectedSpecialties.length - 1}` : ""}`
                            : "Select Specialty"}
                        </span>
                        <ChevronDown
                          className={cn(
                            productStyles.forms.icon.md,
                            "text-muted-foreground transition-transform flex-shrink-0",
                            isSpecialtyOpen && "rotate-180",
                          )}
                        />
                      </button>
                      {isSpecialtyOpen && (
                        <div className="dropdown-menu left-0 right-0 max-h-64 overflow-y-auto">
                          <button
                            onClick={() => {
                              setSelectedSpecialties([]);
                              setIsSpecialtyOpen(false);
                            }}
                            className={`dropdown-item ${
                              selectedSpecialties.length === 0
                                ? "dropdown-item-active"
                                : ""
                            }`}
                          >
                            All Specialties
                          </button>
                          {specialtyOptions.map((specialty) => (
                            <button
                              key={specialty}
                              onClick={() => {
                                toggleSpecialty(specialty);
                              }}
                              className={`dropdown-item ${
                                selectedSpecialties.includes(specialty)
                                  ? "dropdown-item-active"
                                  : ""
                              }`}
                            >
                              {specialty}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Minimum Rating
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setIsRatingOpen(!isRatingOpen)}
                        onBlur={() =>
                          setTimeout(() => setIsRatingOpen(false), 200)
                        }
                        className={cn(
                          productStyles.forms.select.md,
                          "w-full text-left flex items-center justify-between",
                          "border border-input bg-background hover:bg-accent transition-colors",
                        )}
                      >
                        <span>
                          {selectedRating === "all"
                            ? "Any Rating"
                            : `${selectedRating}+ Stars`}
                        </span>
                        <ChevronDown
                          className={cn(
                            productStyles.forms.icon.md,
                            "text-muted-foreground transition-transform",
                            isRatingOpen && "rotate-180",
                          )}
                        />
                      </button>
                      {isRatingOpen && (
                        <div className="dropdown-menu left-0 right-0">
                          <button
                            onClick={() => {
                              setSelectedRating("all");
                              setIsRatingOpen(false);
                            }}
                            className={`dropdown-item ${
                              selectedRating === "all"
                                ? "dropdown-item-active"
                                : ""
                            }`}
                          >
                            Any Rating
                          </button>
                          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => {
                                setSelectedRating(rating.toString());
                                setIsRatingOpen(false);
                              }}
                              className={`dropdown-item ${
                                selectedRating === rating.toString()
                                  ? "dropdown-item-active"
                                  : ""
                              }`}
                            >
                              {rating}+ Stars
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFilterCount > 0 && (
                    <div className="col-span-full mt-2 pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-xs text-muted-foreground font-medium">
                        {activeFilterCount}{" "}
                        {activeFilterCount === 1 ? "filter" : "filters"} active
                      </span>
                      <button
                        onClick={clearFilters}
                        className="btn btn-ghost btn-sm text-destructive hover:text-destructive"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear All
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="w-full">
              {/* Results Count */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {filteredVendors.length}
                  </span>{" "}
                  results
                </p>
              </div>

              {/* Vendors Grid/List */}
              {filteredVendors.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredVendors.map((vendor) => (
                    <Link
                      key={vendor.id}
                      href={`/vendor/${vendor.id}`}
                      className={cn(
                        "group",
                        viewMode === "grid"
                          ? "bg-card rounded-lg border border-border shadow-md hover:shadow-xl transition-all p-6"
                          : "bg-card rounded-lg border border-border shadow-md hover:shadow-xl transition-all p-6 flex gap-6",
                      )}
                    >
                      <div
                        className={
                          viewMode === "list"
                            ? "flex items-center gap-4 flex-1"
                            : ""
                        }
                      >
                        {/* Vendor Logo/Icon */}
                        <div
                          className={cn(
                            "flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg",
                            viewMode === "grid"
                              ? "w-16 h-16 mb-4"
                              : "w-20 h-20 flex-shrink-0",
                          )}
                        >
                          <Store className="h-8 w-8 text-gray-500" />
                        </div>

                        <div className="flex-1">
                          {/* Vendor Name & Verification */}
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                              {vendor.storeName}
                            </h3>
                            {vendor.verified && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>

                          {/* Rating & Sales */}
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span>{vendor.rating}</span>
                            </div>
                            <span>
                              ({vendor.totalSales.toLocaleString()} sales)
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {vendor.description}
                          </p>

                          {/* Quick Stats */}
                          <div
                            className={cn(
                              "grid gap-2 text-xs",
                              viewMode === "grid"
                                ? "grid-cols-2"
                                : "grid-cols-4",
                            )}
                          >
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3 text-gray-400" />
                              <span>{vendor.totalProducts} items</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span>{vendor.responseTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield className="h-3 w-3 text-gray-400" />
                              <span>
                                {vendor.stats.positiveReviews}% satisfaction
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span>{vendor.stats.shipOnTime}% on time</span>
                            </div>
                          </div>

                          {/* Badges */}
                          {vendor.badges && vendor.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {vendor.badges.slice(0, 3).map((badge: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No vendors found</h3>
                  <p className="text-gray-500">
                    Try adjusting your filters or search query
                  </p>
                  <button
                    onClick={clearFilters}
                    className="btn btn-primary btn-md mt-4"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 overflow-y-auto">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Filters</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                {/* Mobile filters content */}
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vendors..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Verified Only */}
                <div className="mb-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-sm font-medium">Verified Only</span>
                  </label>
                </div>

                {/* Specialties */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Specialties
                  </label>
                  <div className="space-y-2">
                    {specialtyOptions.map((specialty) => (
                      <label
                        key={specialty}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSpecialties.includes(specialty)}
                          onChange={() => toggleSpecialty(specialty)}
                          className="w-4 h-4 text-primary rounded focus:ring-primary"
                        />
                        <span className="text-sm">{specialty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>

                {/* Apply & Clear Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
