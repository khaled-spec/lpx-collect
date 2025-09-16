import { Product } from "@/lib/api/types";

export type ViewMode = "grid" | "list";
export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "popular"
  | "rating"
  | "name-asc"
  | "name-desc";

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterQuery {
  category?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  condition?: string;
  rarity?: string;
  search?: string;
  inStock?: boolean;
  vendor?: string;
  tags?: string | string[];
  categories?: string[];
  [key: string]: any;
}

export interface PriceRangeValidation extends PriceRange {
  valid: boolean;
}

export interface BrowseFilters {
  search: string;
  categories: string[];
  conditions: string[];
  rarities: string[];
  priceRange: PriceRange;
  vendors: string[];
  inStock: boolean;
  verified: boolean;
  featured: boolean;
  tags: string[];
}

export const defaultFilters: BrowseFilters = {
  search: "",
  categories: [],
  conditions: [],
  rarities: [],
  priceRange: { min: 0, max: 10000 },
  vendors: [],
  inStock: false,
  verified: false,
  featured: false,
  tags: [],
};

export const CONDITIONS = [
  { value: "mint", label: "Mint", color: "bg-green-500" },
  { value: "near-mint", label: "Near Mint", color: "bg-green-400" },
  { value: "excellent", label: "Excellent", color: "bg-blue-500" },
  { value: "good", label: "Good", color: "bg-yellow-500" },
  { value: "fair", label: "Fair", color: "bg-orange-500" },
  { value: "poor", label: "Poor", color: "bg-red-500" },
];

export const RARITIES = [
  { value: "common", label: "Common", color: "bg-gray-500" },
  { value: "uncommon", label: "Uncommon", color: "bg-green-500" },
  { value: "rare", label: "Rare", color: "bg-blue-500" },
  { value: "ultra-rare", label: "Ultra Rare", color: "bg-purple-500" },
  { value: "legendary", label: "Legendary", color: "bg-yellow-500" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First", icon: "clock" },
  { value: "price-asc", label: "Price: Low to High", icon: "arrow-up" },
  { value: "price-desc", label: "Price: High to Low", icon: "arrow-down" },
  { value: "popular", label: "Most Popular", icon: "trending-up" },
  { value: "rating", label: "Highest Rated", icon: "star" },
  { value: "name-asc", label: "Name: A to Z", icon: "sort-asc" },
  { value: "name-desc", label: "Name: Z to A", icon: "sort-desc" },
];

export function filterProducts(
  products: Product[],
  filters: BrowseFilters,
): Product[] {
  return products.filter((product) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        (typeof product.category === 'string' ? product.category : product.category.name).toLowerCase().includes(searchLower) ||
        (typeof product.vendor === 'string' ? product.vendor : product.vendor.name).toLowerCase().includes(searchLower) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.categories.length > 0) {
      if (!product.categorySlug || !filters.categories.includes(product.categorySlug)) return false;
    }

    // Condition filter
    if (filters.conditions.length > 0) {
      if (!product.condition || !filters.conditions.includes(product.condition))
        return false;
    }

    // Rarity filter
    if (filters.rarities.length > 0) {
      if (!product.rarity || !filters.rarities.includes(product.rarity))
        return false;
    }

    // Price range filter
    if (
      product.price < filters.priceRange.min ||
      product.price > filters.priceRange.max
    ) {
      return false;
    }

    // Vendor filter
    if (filters.vendors.length > 0) {
      if (!product.vendorId || !filters.vendors.includes(product.vendorId)) return false;
    }

    // Stock filter
    if (filters.inStock && product.stock === 0) return false;

    // Verified filter
    if (filters.verified && !product.authenticity?.verified) return false;

    // Featured filter
    if (filters.featured && !product.featured) return false;

    // Tags filter
    if (filters.tags.length > 0) {
      const hasMatchingTag = product.tags?.some((tag) =>
        filters.tags.includes(tag),
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });
}

export function sortProducts(
  products: Product[],
  sortOption: SortOption | string,
  order?: 'asc' | 'desc'
): Product[] {
  const sorted = [...products];

  // Handle the test's format (field, order) or the existing format (SortOption)
  if (order !== undefined) {
    // Test format: field and order are separate
    switch(sortOption) {
      case 'price':
        return sorted.sort((a, b) => {
          const diff = a.price - b.price;
          return order === 'asc' ? diff : -diff;
        });
      case 'name':
        return sorted.sort((a, b) => {
          const comp = a.name.localeCompare(b.name);
          return order === 'asc' ? comp : -comp;
        });
      case 'rarity':
        const rarityOrder: { [key: string]: number } = {
          'legendary': 4,
          'epic': 3,
          'rare': 2,
          'uncommon': 1,
          'common': 0
        };
        return sorted.sort((a, b) => {
          const aVal = rarityOrder[a.rarity || 'common'] || 0;
          const bVal = rarityOrder[b.rarity || 'common'] || 0;
          const diff = aVal - bVal;
          return order === 'asc' ? diff : -diff;
        });
      default:
        return sorted;
    }
  }

  // Original format with SortOption
  switch (sortOption) {
    case "newest":
      // In real app, would sort by createdAt
      return sorted.reverse();

    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);

    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);

    case "popular":
      // In real app, would sort by views/sales
      return sorted.sort((a, b) => (b.stock || 0) - (a.stock || 0));

    case "rating":
      // Sort by stock as a proxy for popularity since Product doesn't have rating
      return sorted.sort((a, b) => (b.stock || 0) - (a.stock || 0));

    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    default:
      return sorted;
  }
}

export function getActiveFilterCount(filters: BrowseFilters): number {
  let count = 0;

  if (filters.search) count++;
  if (filters.categories.length > 0) count += filters.categories.length;
  if (filters.conditions.length > 0) count += filters.conditions.length;
  if (filters.rarities.length > 0) count += filters.rarities.length;
  if (filters.priceRange.min > 0 || filters.priceRange.max < 10000) count++;
  if (filters.vendors.length > 0) count += filters.vendors.length;
  if (filters.inStock) count++;
  if (filters.verified) count++;
  if (filters.featured) count++;
  if (filters.tags.length > 0) count += filters.tags.length;

  return count;
}

export function formatFilterLabel(filterType: string, value: string): string {
  switch (filterType) {
    case "category":
      return value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    case "condition":
      const condition = CONDITIONS.find((c) => c.value === value);
      return condition?.label || value;

    case "rarity":
      const rarity = RARITIES.find((r) => r.value === value);
      return rarity?.label || value;

    case "price":
      return value;

    default:
      return value;
  }
}

export function getPriceHistogram(
  products: Product[],
  buckets: number = 10,
): { range: string; count: number }[] {
  if (products.length === 0) return [];

  const prices = products.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const bucketSize = (maxPrice - minPrice) / buckets;

  const histogram: { range: string; count: number }[] = [];

  for (let i = 0; i < buckets; i++) {
    const rangeMin = minPrice + i * bucketSize;
    const rangeMax = minPrice + (i + 1) * bucketSize;
    const count = products.filter(
      (p) => p.price >= rangeMin && p.price < rangeMax,
    ).length;

    histogram.push({
      range: `$${Math.round(rangeMin)}-$${Math.round(rangeMax)}`,
      count,
    });
  }

  return histogram;
}

export function getUniqueVendors(
  products: Product[],
): { id: string; name: string; count: number }[] {
  const vendorMap = new Map<string, { name: string; count: number }>();

  products.forEach((product) => {
    if (product.vendorId && vendorMap.has(product.vendorId)) {
      const vendor = vendorMap.get(product.vendorId!)!;
      vendor.count++;
    } else {
      if (product.vendorId) {
        vendorMap.set(product.vendorId, { name: typeof product.vendor === 'string' ? product.vendor : product.vendor.name, count: 1 });
      }
    }
  });

  return Array.from(vendorMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.count - a.count);
}

export function getUniqueTags(products: Product[]): string[] {
  const tags = new Set<string>();

  products.forEach((product) => {
    product.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

// Build query string from filter object
export function buildFilterQuery(filters: FilterQuery): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        params.append(key, value.join(','));
      } else {
        params.append(key, String(value));
      }
    }
  });

  return decodeURIComponent(params.toString());
}

// Parse query string to filter object
export function parseFilterQuery(query: string): FilterQuery {
  if (!query) return {};

  const params = new URLSearchParams(query);
  const filters: FilterQuery = {};

  params.forEach((value, key) => {
    // Check if we already have this key (for array values)
    if (filters[key]) {
      if (Array.isArray(filters[key])) {
        filters[key].push(value);
      } else {
        filters[key] = [filters[key], value];
      }
    } else {
      filters[key] = value;
    }
  });

  return filters;
}

// Apply filters to products array
export function applyFilters(products: Product[], filters: FilterQuery): Product[] {
  let filtered = [...products];

  if (filters.category) {
    filtered = filtered.filter(p => {
      const categorySlug = typeof p.category === 'object' ? p.category.slug : p.category;
      return categorySlug === filters.category;
    });
  }

  if (filters.minPrice !== null && filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
  }

  if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
  }

  if (filters.condition) {
    filtered = filtered.filter(p => p.condition === filters.condition);
  }

  if (filters.rarity) {
    filtered = filtered.filter(p => p.rarity === filters.rarity);
  }

  if (filters.search) {
    const searchFilter = createSearchFilter(filters.search);
    filtered = filtered.filter(searchFilter);
  }

  if (filters.inStock) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  if (filters.vendor) {
    filtered = filtered.filter(p => {
      const vendorId = typeof p.vendor === 'object' ? p.vendor.id : p.vendor;
      return vendorId === filters.vendor;
    });
  }

  return filtered;
}

// Get price range from products
export function getPriceRange(products: Product[]): PriceRange {
  if (products.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = products.map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

// Get unique values for a field
export function getUniqueValues(products: Product[], field: string): Set<string> {
  const values = new Set<string>();

  products.forEach(product => {
    let value: any = product;

    // Handle nested properties
    const fieldParts = field.split('.');
    for (const part of fieldParts) {
      value = value?.[part];
    }

    if (value !== null && value !== undefined) {
      // Handle both object and string values
      if (typeof value === 'object' && value.slug) {
        values.add(value.slug);
      } else if (typeof value === 'object' && value.name) {
        values.add(value.name);
      } else {
        values.add(String(value));
      }
    }
  });

  return values;
}

// Create search filter function
export function createSearchFilter(searchTerm: string): (product: Product) => boolean {
  if (!searchTerm) {
    return () => true;
  }

  const term = searchTerm.toLowerCase();

  return (product: Product) => {
    // Search in name
    if (product.name.toLowerCase().includes(term)) {
      return true;
    }

    // Search in description
    if (product.description && product.description.toLowerCase().includes(term)) {
      return true;
    }

    // Search in tags
    if (product.tags && product.tags.some(tag => tag.toLowerCase().includes(term))) {
      return true;
    }

    // Search in category name
    if (typeof product.category === 'object' && product.category.name) {
      if (product.category.name.toLowerCase().includes(term)) {
        return true;
      }
    }

    // Search in vendor name
    if (typeof product.vendor === 'object' && product.vendor.name) {
      if (product.vendor.name.toLowerCase().includes(term)) {
        return true;
      }
    }

    return false;
  };
}

// Validate price range
export function validatePriceRange(
  min: number | null | undefined,
  max: number | null | undefined
): PriceRangeValidation {
  let validMin = min ?? 0;
  let validMax = max ?? Number.MAX_VALUE;

  // Ensure non-negative
  validMin = Math.max(0, validMin);
  validMax = Math.max(0, validMax);

  // Swap if reversed
  if (validMin > validMax && max !== null && max !== undefined) {
    [validMin, validMax] = [validMax, validMin];
  }

  const valid = (min !== null && min !== undefined) || (max !== null && max !== undefined);

  return {
    min: validMin,
    max: validMax,
    valid
  };
}
