'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { 
  Filter, 
  X, 
  ChevronDown,
  Grid3x3,
  LayoutList,
  SlidersHorizontal
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Browse Collectibles</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover {filteredProducts.length} unique items from our marketplace
            </p>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary hover:underline"
                    >
                      Clear all ({activeFilterCount})
                    </button>
                  )}
                </div>

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
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Controls Bar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden btn btn-outline btn-sm flex items-center gap-2"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="badge badge-primary ml-1">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredProducts.length} results
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input py-2 pr-8"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* View Mode */}
                  <div className="flex gap-1 border border-border rounded-md">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600'}`}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600'}`}
                    >
                      <LayoutList className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              {filteredProducts.length > 0 ? (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
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

// Missing import
import { Package } from 'lucide-react';