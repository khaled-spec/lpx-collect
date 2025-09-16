import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCartTotal,
  getCartItemCount,
  isInCart
} from '@/lib/cart';
import { Product } from '@/lib/api/types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = localStorageMock as any;

// Mock product data
const mockProduct: Product = {
  id: '1',
  name: 'Charizard - Base Set',
  slug: 'charizard-base-set',
  description: 'A powerful fire-type Pokemon card',
  price: 5999.99,
  image: 'https://example.com/charizard.jpg',
  images: ['https://example.com/charizard.jpg'],
  category: 'vintage',
  vendor: 'Elite Pokemon Cards',
  stock: 5,
  condition: 'mint',
  rarity: 'legendary',
  featured: true,
  views: 1500,
  rating: 4.7,
  reviewCount: 23,
  tags: ['fire', 'starter'],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-15'
};

const mockProduct2: Product = {
  ...mockProduct,
  id: '2',
  name: 'Pikachu - Base Set',
  price: 299.99,
  stock: 10
};

describe('Cart Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('addToCart', () => {
    it('should add a product to empty cart', () => {
      const result = addToCart(mockProduct);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Added to cart');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cart',
        expect.stringContaining(mockProduct.id)
      );
    });

    it('should increment quantity if product already in cart', () => {
      const existingCart = [{ ...mockProduct, quantity: 1 }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const result = addToCart(mockProduct);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Quantity updated');

      const savedCart = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedCart[0].quantity).toBe(2);
    });

    it('should respect stock limits', () => {
      const existingCart = [{ ...mockProduct, quantity: 5 }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const result = addToCart(mockProduct);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Not enough stock');
    });

    it('should handle custom quantity', () => {
      const result = addToCart(mockProduct, 3);

      expect(result.success).toBe(true);

      const savedCart = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedCart[0].quantity).toBe(3);
    });

    it('should reject if quantity exceeds stock', () => {
      const result = addToCart(mockProduct, 10);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Not enough stock');
    });
  });

  describe('removeFromCart', () => {
    it('should remove product from cart', () => {
      const existingCart = [mockProduct, mockProduct2];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const result = removeFromCart(mockProduct.id);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Removed from cart');

      const savedCart = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedCart.length).toBe(1);
      expect(savedCart[0].id).toBe(mockProduct2.id);
    });

    it('should handle removing non-existent product', () => {
      const existingCart = [mockProduct];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const result = removeFromCart('non-existent');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Product not in cart');
    });

    it('should handle empty cart', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = removeFromCart(mockProduct.id);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Cart is empty');
    });
  });

  describe('updateQuantity', () => {
    it('should update product quantity', () => {
      const existingCart = [{ ...mockProduct, quantity: 2 }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const result = updateQuantity(mockProduct.id, 3);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Quantity updated');

      const savedCart = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedCart[0].quantity).toBe(3);
    });

    it('should remove product when quantity is 0', () => {
      const existingCart = [{ ...mockProduct, quantity: 1 }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const result = updateQuantity(mockProduct.id, 0);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Removed from cart');

      const savedCart = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedCart.length).toBe(0);
    });

    it('should respect stock limits', () => {
      const existingCart = [{ ...mockProduct, quantity: 1 }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const result = updateQuantity(mockProduct.id, 10);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Not enough stock');
    });

    it('should handle negative quantities', () => {
      const existingCart = [{ ...mockProduct, quantity: 1 }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const result = updateQuantity(mockProduct.id, -1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid quantity');
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const existingCart = [mockProduct, mockProduct2];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const result = clearCart();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Cart cleared');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cart');
    });

    it('should handle already empty cart', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = clearCart();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Cart cleared');
    });
  });

  describe('getCartTotal', () => {
    it('should calculate correct total', () => {
      const existingCart = [
        { ...mockProduct, quantity: 2, price: 100 },
        { ...mockProduct2, quantity: 1, price: 50 }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const total = getCartTotal();

      expect(total).toBe(250); // (2 * 100) + (1 * 50)
    });

    it('should return 0 for empty cart', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const total = getCartTotal();

      expect(total).toBe(0);
    });

    it('should handle cart with no quantities', () => {
      const existingCart = [mockProduct, mockProduct2];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const total = getCartTotal();

      expect(total).toBe(mockProduct.price + mockProduct2.price);
    });
  });

  describe('getCartItemCount', () => {
    it('should return correct item count', () => {
      const existingCart = [
        { ...mockProduct, quantity: 2 },
        { ...mockProduct2, quantity: 3 }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const count = getCartItemCount();

      expect(count).toBe(5); // 2 + 3
    });

    it('should return 0 for empty cart', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const count = getCartItemCount();

      expect(count).toBe(0);
    });

    it('should count unique items when no quantities', () => {
      const existingCart = [mockProduct, mockProduct2];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const count = getCartItemCount();

      expect(count).toBe(2);
    });
  });

  describe('isInCart', () => {
    it('should return true if product is in cart', () => {
      const existingCart = [mockProduct, mockProduct2];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const result = isInCart(mockProduct.id);

      expect(result).toBe(true);
    });

    it('should return false if product is not in cart', () => {
      const existingCart = [mockProduct];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart));

      const result = isInCart(mockProduct2.id);

      expect(result).toBe(false);
    });

    it('should return false for empty cart', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = isInCart(mockProduct.id);

      expect(result).toBe(false);
    });
  });
});