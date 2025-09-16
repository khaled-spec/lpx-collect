import { Product } from '@/lib/api/types';

export interface CartItem extends Product {
  quantity: number;
}

export interface CartOperationResult {
  success: boolean;
  message: string;
  data?: any;
}

const CART_STORAGE_KEY = 'cart';

// Get cart from localStorage
function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];

  const cartData = localStorage.getItem(CART_STORAGE_KEY);
  if (!cartData) return [];

  try {
    return JSON.parse(cartData);
  } catch {
    return [];
  }
}

// Save cart to localStorage
function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Add product to cart
export function addToCart(product: Product, quantity: number = 1): CartOperationResult {
  if (quantity <= 0) {
    return {
      success: false,
      message: 'Invalid quantity'
    };
  }

  if (quantity > product.stock) {
    return {
      success: false,
      message: 'Not enough stock'
    };
  }

  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === product.id);

  if (existingItemIndex >= 0) {
    // Item already in cart, update quantity
    const existingItem = cart[existingItemIndex];
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      return {
        success: false,
        message: 'Not enough stock'
      };
    }

    cart[existingItemIndex] = {
      ...existingItem,
      quantity: newQuantity
    };

    saveCart(cart);
    return {
      success: true,
      message: 'Quantity updated',
      data: cart[existingItemIndex]
    };
  } else {
    // New item, add to cart
    const cartItem: CartItem = {
      ...product,
      quantity
    };

    cart.push(cartItem);
    saveCart(cart);

    return {
      success: true,
      message: 'Added to cart',
      data: cartItem
    };
  }
}

// Remove product from cart
export function removeFromCart(productId: string): CartOperationResult {
  const cart = getCart();

  if (cart.length === 0) {
    return {
      success: false,
      message: 'Cart is empty'
    };
  }

  const itemIndex = cart.findIndex(item => item.id === productId);

  if (itemIndex === -1) {
    return {
      success: false,
      message: 'Product not in cart'
    };
  }

  cart.splice(itemIndex, 1);
  saveCart(cart);

  return {
    success: true,
    message: 'Removed from cart'
  };
}

// Update product quantity
export function updateQuantity(productId: string, quantity: number): CartOperationResult {
  if (quantity < 0) {
    return {
      success: false,
      message: 'Invalid quantity'
    };
  }

  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);

  if (itemIndex === -1) {
    return {
      success: false,
      message: 'Product not in cart'
    };
  }

  if (quantity === 0) {
    // Remove item if quantity is 0
    return removeFromCart(productId);
  }

  const item = cart[itemIndex];

  if (quantity > item.stock) {
    return {
      success: false,
      message: 'Not enough stock'
    };
  }

  cart[itemIndex] = {
    ...item,
    quantity
  };

  saveCart(cart);

  return {
    success: true,
    message: 'Quantity updated',
    data: cart[itemIndex]
  };
}

// Clear entire cart
export function clearCart(): CartOperationResult {
  if (typeof window === 'undefined') {
    return {
      success: true,
      message: 'Cart cleared'
    };
  }

  localStorage.removeItem(CART_STORAGE_KEY);

  return {
    success: true,
    message: 'Cart cleared'
  };
}

// Get cart total
export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => {
    const quantity = item.quantity || 1;
    return total + (item.price * quantity);
  }, 0);
}

// Get cart item count
export function getCartItemCount(): number {
  const cart = getCart();
  return cart.reduce((count, item) => {
    const quantity = item.quantity || 1;
    return count + quantity;
  }, 0);
}

// Check if product is in cart
export function isInCart(productId: string): boolean {
  const cart = getCart();
  return cart.some(item => item.id === productId);
}

// Get all cart items
export function getCartItems(): CartItem[] {
  return getCart();
}

// Calculate cart subtotal
export function getCartSubtotal(): number {
  return getCartTotal();
}

// Calculate estimated tax (example: 10%)
export function getEstimatedTax(subtotal?: number): number {
  const sub = subtotal ?? getCartSubtotal();
  return sub * 0.1;
}

// Calculate estimated shipping (example: flat rate)
export function getEstimatedShipping(): number {
  const cart = getCart();
  if (cart.length === 0) return 0;

  // Free shipping over $100
  const subtotal = getCartSubtotal();
  if (subtotal >= 100) return 0;

  return 9.99;
}

// Calculate cart grand total
export function getCartGrandTotal(): number {
  const subtotal = getCartSubtotal();
  const tax = getEstimatedTax(subtotal);
  const shipping = getEstimatedShipping();

  return subtotal + tax + shipping;
}