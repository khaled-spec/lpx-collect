'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { productStyles } from '@/components/custom/product-styles';
import { cn } from '@/lib/utils';
import { 
  Filter, 
  X, 
  ChevronDown,
  ChevronUp,
  Grid3x3,
  LayoutList,
  SlidersHorizontal,
  Package,
  Search,
  ArrowUpDown
} from 'lucide-react';
import { products, categories } from '@/data/mockData';
import type { Product } from '@/types';

const conditions = ['new', 'mint', 'excellent', 'good', 'fair', 'poor'];
const rarities = ['common', 'uncommon', 'rare', 'very-rare', 'legendary'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [isRarityOpen, setIsRarityOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category.slug === selectedCategory);
    }

    // Condition filter
    if (selectedConditions.length > 0) {
      filtered = filtered.filter(p => selectedConditions.includes(p.condition));
    }

    // Rarity filter
    if (selectedRarities.length > 0 && filtered.some(p => p.rarity)) {
      filtered = filtered.filter(p => p.rarity && selectedRarities.includes(p.rarity));
    }

    // Price filter
    if (priceRange.min) {
      filtered = filtered.filter(p => p.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(p => p.price <= Number(priceRange.max));
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedConditions, selectedRarities, priceRange, sortBy]);

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const toggleRarity = (rarity: string) => {
    setSelectedRarities(prev =>
      prev.includes(rarity)
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedConditions([]);
    setSelectedRarities([]);
    setPriceRange({ min: '', max: '' });
  };

  const activeFilterCount = 
    (selectedCategory ? 1 : 0) +
    selectedConditions.length +
    selectedRarities.length +
    (priceRange.min || priceRange.max ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container py-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Browse Collectibles</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover {filteredProducts.length} unique items from our marketplace
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
                      "flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    )}
                  >
                    <SlidersHorizontal className={productStyles.forms.icon.md} />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="badge badge-primary">{activeFilterCount}</span>
                    )}
                    {isFilterExpanded ? (
                      <ChevronUp className={productStyles.forms.icon.md} />
                    ) : (
                      <ChevronDown className={productStyles.forms.icon.md} />
                    )}
                  </button>

                  {/* Quick Search */}
                  <div className="relative hidden sm:block">
                    <Search className={cn(
                      productStyles.forms.icon.md,
                      "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    )} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Quick search..."
                      className={cn(
                        productStyles.forms.input.md,
                        "pl-10 w-64 border border-input bg-background",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      )}
                    />
                  </div>

                  {/* Active Filter Pills */}
                  {!isFilterExpanded && activeFilterCount > 0 && (
                    <div className="flex items-center gap-2">
                      {selectedCategory && (
                        <span className="badge badge-secondary">
                          {categories.find(c => c.slug === selectedCategory)?.name}
                          <button
                            onClick={() => setSelectedCategory('')}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {selectedConditions.length > 0 && (
                        <span className="badge badge-secondary">
                          {selectedConditions.length} conditions
                        </span>
                      )}
                      {(priceRange.min || priceRange.max) && (
                        <span className="badge badge-secondary">
                          Price filtered
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
                        "flex items-center justify-between gap-2 w-48 border border-input bg-background hover:bg-accent transition-colors"
                      )}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <ArrowUpDown className={cn(productStyles.forms.icon.md, "text-muted-foreground flex-shrink-0")} />
                        <span className="truncate">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                      </span>
                    </button>
                    {isSortOpen && (
                      <div className="dropdown-menu right-0">
                        {sortOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setIsSortOpen(false);
                            }}
                            className={`dropdown-item ${
                              sortBy === option.value ? 'dropdown-item-active' : ''
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
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "h-9 px-3 flex items-center justify-center",
                        "rounded-none border-0 transition-colors",
                        viewMode === 'grid'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                      aria-label="Grid view"
                    >
                      <Grid3x3 className={productStyles.forms.icon.md} />
                    </button>
                    <div className="w-px h-6 bg-input" />
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "h-9 px-3 flex items-center justify-center",
                        "rounded-none border-0 transition-colors",
                        viewMode === 'list'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Search</label>
                      <div className="relative">
                        <Search className={cn(
                          productStyles.forms.icon.md,
                          "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        )} />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search items..."
                          className={cn(
                            productStyles.forms.input.md,
                            "pl-10 w-full border border-input bg-background",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          )}
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category</label>
                      <div className="relative">
                        <button 
                          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                          onBlur={() => setTimeout(() => setIsCategoryOpen(false), 200)}
                          className={cn(
                            productStyles.forms.select.md,
                            "w-full text-left flex items-center justify-between",
                            "border border-input bg-background hover:bg-accent transition-colors"
                          )}
                        >
                          <span>
                            {selectedCategory 
                              ? categories.find(c => c.slug === selectedCategory)?.name
                              : 'All Categories'
                            }
                          </span>
                          <ChevronDown className={cn(
                            productStyles.forms.icon.md,
                            "text-muted-foreground transition-transform",
                            isCategoryOpen && "rotate-180"
                          )} />
                        </button>
                        {isCategoryOpen && (
                          <div className="dropdown-menu left-0 right-0">
                            <button
                              onClick={() => {
                                setSelectedCategory('');
                                setIsCategoryOpen(false);
                              }}
                              className={`dropdown-item ${
                                selectedCategory === '' ? 'dropdown-item-active' : ''
                              }`}
                            >
                              All Categories
                            </button>
                            {categories.map(cat => (
                              <button
                                key={cat.id}
                                onClick={() => {
                                  setSelectedCategory(cat.slug);
                                  setIsCategoryOpen(false);
                                }}
                                className={`dropdown-item ${
                                  selectedCategory === cat.slug ? 'dropdown-item-active' : ''
                                }`}
                              >
                                {cat.name} ({cat.productCount})
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Price Range</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                          className={cn(
                            productStyles.forms.input.md,
                            "w-full border border-input bg-background",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          )}
                        />
                        <span className="text-muted-foreground text-xs">to</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                          className={cn(
                            productStyles.forms.input.md,
                            "w-full border border-input bg-background",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          )}
                        />
                      </div>
                    </div>

                    {/* Condition */}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Condition</label>
                      <div className="relative">
                        <button 
                          onClick={() => setIsConditionOpen(!isConditionOpen)}
                          onBlur={() => setTimeout(() => setIsConditionOpen(false), 200)}
                          className={cn(
                            productStyles.forms.select.md,
                            "w-full text-left flex items-center justify-between",
                            "border border-input bg-background hover:bg-accent transition-colors"
                          )}
                        >
                          <span className="capitalize">
                            {selectedConditions.length > 0 
                              ? selectedConditions[0]
                              : 'Select Condition'
                            }
                          </span>
                          <ChevronDown className={cn(
                            productStyles.forms.icon.md,
                            "text-muted-foreground transition-transform",
                            isConditionOpen && "rotate-180"
                          )} />
                        </button>
                        {isConditionOpen && (
                          <div className="dropdown-menu left-0 right-0">
                            <button
                              onClick={() => {
                                setSelectedConditions([]);
                                setIsConditionOpen(false);
                              }}
                              className={`dropdown-item ${
                                selectedConditions.length === 0 ? 'dropdown-item-active' : ''
                              }`}
                            >
                              Select Condition
                            </button>
                            {conditions.map(condition => (
                              <button
                                key={condition}
                                onClick={() => {
                                  setSelectedConditions([condition]);
                                  setIsConditionOpen(false);
                                }}
                                className={`dropdown-item capitalize ${
                                  selectedConditions.includes(condition) ? 'dropdown-item-active' : ''
                                }`}
                              >
                                {condition}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rarity */}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Rarity</label>
                      <div className="relative">
                        <button 
                          onClick={() => setIsRarityOpen(!isRarityOpen)}
                          onBlur={() => setTimeout(() => setIsRarityOpen(false), 200)}
                          className={cn(
                            productStyles.forms.select.md,
                            "w-full text-left flex items-center justify-between",
                            "border border-input bg-background hover:bg-accent transition-colors"
                          )}
                        >
                          <span className="capitalize">
                            {selectedRarities.length > 0 
                              ? selectedRarities[0].replace('-', ' ')
                              : 'Select Rarity'
                            }
                          </span>
                          <ChevronDown className={cn(
                            productStyles.forms.icon.md,
                            "text-muted-foreground transition-transform",
                            isRarityOpen && "rotate-180"
                          )} />
                        </button>
                        {isRarityOpen && (
                          <div className="dropdown-menu left-0 right-0">
                            <button
                              onClick={() => {
                                setSelectedRarities([]);
                                setIsRarityOpen(false);
                              }}
                              className={`dropdown-item ${
                                selectedRarities.length === 0 ? 'dropdown-item-active' : ''
                              }`}
                            >
                              Select Rarity
                            </button>
                            {rarities.map(rarity => (
                              <button
                                key={rarity}
                                onClick={() => {
                                  setSelectedRarities([rarity]);
                                  setIsRarityOpen(false);
                                }}
                                className={`dropdown-item capitalize ${
                                  selectedRarities.includes(rarity) ? 'dropdown-item-active' : ''
                                }`}
                              >
                                {rarity.replace('-', ' ')}
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
                          {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
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

          <div className="">
            {/* Main Content */}
            <div className="w-full">
              {/* Results Count */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> results
                </p>
              </div>

              {/* Products Grid/List */}
              {filteredProducts.length > 0 ? (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }>
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                      variant="default"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
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
                {/* Mobile filters content (same as desktop) */}
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search items..."
                    className="input w-full"
                  />
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input w-full"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name} ({cat.productCount})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="input w-full"
                    />
                    <span className="self-center">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="input w-full"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Condition</label>
                  <div className="space-y-2">
                    {conditions.map(condition => (
                      <label key={condition} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedConditions.includes(condition)}
                          onChange={() => toggleCondition(condition)}
                          className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                        />
                        <span className="text-sm capitalize">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rarity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Rarity</label>
                  <div className="space-y-2">
                    {rarities.map(rarity => (
                      <label key={rarity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRarities.includes(rarity)}
                          onChange={() => toggleRarity(rarity)}
                          className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                        />
                        <span className="text-sm capitalize">
                          {rarity.replace('-', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearFilters}
                    className="btn btn-secondary btn-md flex-1"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="btn btn-primary btn-md flex-1"
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