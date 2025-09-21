// Shared category utilities for consistent category display across the app
import { getCategoryAPI } from "@/lib/api/client";

/**
 * Get categories for navigation and filtering
 * Returns empty array until backend is connected
 */
export async function getNavigationCategories() {
  try {
    const api = getCategoryAPI();
    const response = await api.getCategories();

    if (response.success) {
      return response.data.map((category) => ({
        name: category.name,
        slug: category.slug,
        productCount: category.productCount,
      }));
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production")
      console.error("Failed to fetch navigation categories:", error);
  }
  return [];
}

/**
 * Get all categories (including subcategories) for filtering
 * Returns empty array until backend is connected
 */
export async function getFilterCategories() {
  try {
    const api = getCategoryAPI();
    const response = await api.getCategories();

    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production")
      console.error("Failed to fetch filter categories:", error);
  }
  return [];
}
