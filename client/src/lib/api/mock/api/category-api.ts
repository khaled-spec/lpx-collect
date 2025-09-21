import type { ApiResponse, Category, ICategoryAPI } from "../../types";
import { mockCategories } from "../shared/categories";

export class MockCategoryAPI implements ICategoryAPI {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      return {
        success: true,
        data: mockCategories,
      };
    } catch (_error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch categories",
          code: "MOCK_ERROR",
          status: 500,
        },
      };
    }
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      const category = mockCategories.find((c) => c.slug === slug);

      if (!category) {
        return {
          success: false,
          error: {
            message: "Category not found",
            code: "NOT_FOUND",
            status: 404,
          },
        };
      }

      return {
        success: true,
        data: category,
      };
    } catch (_error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch category",
          code: "MOCK_ERROR",
          status: 500,
        },
      };
    }
  }

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      const category = mockCategories.find((c) => c.id === id);

      if (!category) {
        return {
          success: false,
          error: {
            message: "Category not found",
            code: "NOT_FOUND",
            status: 404,
          },
        };
      }

      return {
        success: true,
        data: category,
      };
    } catch (_error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch category",
          code: "MOCK_ERROR",
          status: 500,
        },
      };
    }
  }

  async getSubcategories(
    _parentSlug: string,
  ): Promise<ApiResponse<Category[]>> {
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      // For now, return empty as we don't have subcategories in mock data
      return {
        success: true,
        data: [],
      };
    } catch (_error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch subcategories",
          code: "MOCK_ERROR",
          status: 500,
        },
      };
    }
  }

  async getFeaturedCategories(): Promise<ApiResponse<Category[]>> {
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      const featuredCategories = mockCategories.filter(
        (category) => category.featured,
      );

      return {
        success: true,
        data: featuredCategories,
      };
    } catch (_error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch featured categories",
          code: "MOCK_ERROR",
          status: 500,
        },
      };
    }
  }
}
