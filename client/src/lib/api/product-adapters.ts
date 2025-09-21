import type { Product as ApiProduct } from "@/lib/api/types";
import type { Category, Product as DomainProduct, Vendor } from "@/types";

const FALLBACK_CATEGORY_SLUG = "general";

const VALID_CONDITIONS = new Set<DomainProduct["condition"]>([
  "new",
  "mint",
  "excellent",
  "good",
  "fair",
  "poor",
]);

function parseDate(value?: string): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function buildCategory(product: ApiProduct): Category {
  const slug = product.categorySlug || FALLBACK_CATEGORY_SLUG;

  return {
    id: slug,
    name: product.category || "General",
    slug,
    productCount: 0,
  };
}

function buildVendor(product: ApiProduct): Vendor {
  const vendorId = product.vendorId || "vendor-unknown";

  return {
    id: vendorId,
    userId: vendorId,
    storeName: product.vendor || "Unknown Vendor",
    description: "",
    rating: typeof product.rating === "number" ? product.rating : 0,
    totalSales: 0,
    totalProducts: 0,
    responseTime: "",
    shippingInfo: "",
    returnPolicy: "",
    verified: false,
    createdAt: parseDate(),
  };
}

function parseCondition(condition?: string): DomainProduct["condition"] {
  const rawCondition = condition ?? "";
  const normalized = rawCondition.toLowerCase() as DomainProduct["condition"];
  if (VALID_CONDITIONS.has(normalized)) {
    return normalized;
  }
  return "good";
}

function resolveImages(product: ApiProduct): string[] {
  if (product.images && product.images.length > 0) {
    return product.images;
  }
  if (product.image) {
    return [product.image];
  }
  return [];
}

export function toDomainProduct(product: ApiProduct): DomainProduct {
  const category = buildCategory(product);
  const vendor = buildVendor(product);

  return {
    id: product.id,
    title: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    compareAtPrice: product.originalPrice,
    images: resolveImages(product),
    category,
    vendor,
    condition: parseCondition(product.condition),
    rarity: undefined,
    stock: product.stock,
    sold: 0,
    views: typeof product.views === "number" ? product.views : 0,
    likes: 0,
    tags: product.tags || [],
    specifications: product.specifications,
    featured: !!product.featured,
    createdAt: parseDate(product.createdAt),
    updatedAt: parseDate(product.updatedAt),
  };
}

export function toDomainProducts(products: ApiProduct[]): DomainProduct[] {
  return products.map(toDomainProduct);
}
