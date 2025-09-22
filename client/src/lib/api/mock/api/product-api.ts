import type {
  ApiResponse,
  IProductAPI,
  PaginatedResponse,
  Product,
  ProductFilter,
} from "../../types";
import { mockProducts } from "../shared/products";
import { filterProducts, paginateData } from "../shared/utils";

export class MockProductAPI implements IProductAPI {
  async getProducts(
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      let filteredProducts: Product[] = [
        ...mockProducts,
      ] as unknown as Product[];

      if (filter) {
        filteredProducts = filterProducts(
          mockProducts as unknown as Product[],
          filter,
        );

        // Apply sorting
        if (filter.sortBy) {
          switch (filter.sortBy) {
            case "price-asc":
              filteredProducts.sort((a, b) => a.price - b.price);
              break;
            case "price-desc":
              filteredProducts.sort((a, b) => b.price - a.price);
              break;
            case "rating":
              filteredProducts.sort(
                (a, b) => (b.rating || 0) - (a.rating || 0),
              );
              break;
            case "popular":
              filteredProducts.sort((a, b) => (b.views || 0) - (a.views || 0));
              break;
            case "newest":
              filteredProducts.sort(
                (a, b) =>
                  new Date(b.createdAt || 0).getTime() -
                  new Date(a.createdAt || 0).getTime(),
              );
              break;
            case "name":
              filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case "featured":
              filteredProducts.sort(
                (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
              );
              break;
          }
        }
      }

      const page = filter?.page || 1;
      const pageSize = filter?.limit || 20;
      const paginatedResult = paginateData(filteredProducts, page, pageSize);

      return {
        success: true,
        data: paginatedResult,
      };
    } catch (_error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch products",
          code: "MOCK_ERROR",
          status: 500,
        },
      };
    }
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      const product = mockProducts.find((p) => p.id === id);

      if (!product) {
        return {
          success: false,
          error: {
            message: "Product not found",
            code: "NOT_FOUND",
            status: 404,
          },
        };
      }

      return {
        success: true,
        data: product as unknown as Product,
      };
    } catch (_error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch product",
          code: "MOCK_ERROR",
          status: 500,
        },
      };
    }
  }

  async getProductsByCategory(
    categorySlug: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const categoryFilter = { ...filter, category: categorySlug };
    return this.getProducts(categoryFilter);
  }

  async getFeaturedProducts(
    limit: number = 8,
  ): Promise<ApiResponse<Product[]>> {
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      const featuredProducts = mockProducts
        .filter((product) => product.featured)
        .slice(0, limit);

      return {
        success: true,
        data: featuredProducts as unknown as Product[],
      };
    } catch (_error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch featured products",
          code: "MOCK_ERROR",
          status: 500,
        },
      };
    }
  }

  async getRelatedProducts(
    productId: string,
    limit: number = 4,
  ): Promise<ApiResponse<Product[]>> {
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      const product = mockProducts.find((p) => p.id === productId);
      if (!product) {
        return { success: true, data: [] };
      }

      // Find products in the same category, excluding the current product
      const relatedProducts = mockProducts
        .filter(
          (p) => p.id !== productId && p.categorySlug === product.categorySlug,
        )
        .slice(0, limit);

      return {
        success: true,
        data: relatedProducts as unknown as Product[],
      };
    } catch (_error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch related products",
          code: "MOCK_ERROR",
          status: 500,
        },
      };
    }
  }

  async searchProducts(
    query: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const searchFilter = { ...filter, search: query };
    return this.getProducts(searchFilter);
  }
}
