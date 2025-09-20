import {
  IVendorAPI,
  Vendor,
  Product,
  ProductFilter,
  PaginatedResponse,
  ApiResponse,
} from "../../types";
import { mockVendors } from "../shared/vendors";
import { mockProducts } from "../shared/products";
import { filterProducts, paginateData } from "../shared/utils";

export class MockVendorAPI implements IVendorAPI {
  async getVendors(filter?: {
    featured?: boolean;
    verified?: boolean;
  }): Promise<ApiResponse<Vendor[]>> {
    console.log('📍 MockVendorAPI.getVendors() called with filter:', filter);
    console.log('📋 Available mockVendors:', mockVendors?.length, mockVendors);

    try {
      console.log('⏳ Starting 50ms async delay...');
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log('✅ Async delay completed');

      let filteredVendors = mockVendors;
      console.log('🔍 Initial vendors before filtering:', filteredVendors?.length);

      if (filter) {
        console.log('🔍 Applying filters:', filter);
        if (filter.featured !== undefined) {
          const beforeCount = filteredVendors.length;
          filteredVendors = filteredVendors.filter(vendor => vendor.featured === filter.featured);
          console.log('🌟 Featured filter applied: from', beforeCount, 'to', filteredVendors.length, 'vendors');
        }
        if (filter.verified !== undefined) {
          const beforeCount = filteredVendors.length;
          filteredVendors = filteredVendors.filter(vendor => vendor.verified === filter.verified);
          console.log('✅ Verified filter applied: from', beforeCount, 'to', filteredVendors.length, 'vendors');
        }
      } else {
        console.log('🔍 No filters applied - returning all vendors');
      }

      console.log('🎆 Final filtered vendors:', filteredVendors?.length, filteredVendors);

      const response = {
        success: true,
        data: filteredVendors,
      };
      console.log('📦 MockVendorAPI returning response:', response);
      return response as any;
    } catch (error) {
      console.error('💥 MockVendorAPI error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to fetch vendors',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async getVendorById(id: string): Promise<ApiResponse<Vendor>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      const vendor = mockVendors.find(v => v.id === id);

      if (!vendor) {
        return {
          success: false,
          error: {
            message: 'Vendor not found',
            code: 'NOT_FOUND',
            status: 404,
          },
        };
      }

      return {
        success: true,
        data: vendor,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch vendor',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async getVendorBySlug(slug: string): Promise<ApiResponse<Vendor>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      const vendor = mockVendors.find(v => v.slug === slug);

      if (!vendor) {
        return {
          success: false,
          error: {
            message: 'Vendor not found',
            code: 'NOT_FOUND',
            status: 404,
          },
        };
      }

      return {
        success: true,
        data: vendor,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch vendor',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }

  async getVendorProducts(
    vendorId: string,
    filter?: ProductFilter,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      const vendorProducts = mockProducts.filter(product => product.vendorId === vendorId);

      let filteredProducts = vendorProducts;
      if (filter) {
        filteredProducts = filterProducts(vendorProducts as any, filter) as any;
      }

      const page = filter?.page || 1;
      const pageSize = filter?.limit || 20;
      const paginatedResult = paginateData(filteredProducts, page, pageSize);

      return {
        success: true,
        data: paginatedResult as any,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch vendor products',
          code: 'MOCK_ERROR',
          status: 500,
        },
      };
    }
  }
}