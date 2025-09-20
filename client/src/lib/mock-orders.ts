import { Order, OrderItem, OrderStatus } from "@/types/checkout";

// Simple seeded random function for deterministic data generation
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate realistic order numbers
function generateOrderNumber(seed: number): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(seededRandom(seed) * 10000).toString().padStart(4, '0');
  return `LPX-${year}${month}-${random}`;
}

// Mock order items based on existing products
const mockOrderItems: OrderItem[] = [
  {
    id: "item-1",
    productId: "prod-1",
    name: "Charizard VMAX Rainbow Rare - Champions Path",
    title: "Charizard VMAX Rainbow Rare - Champions Path",
    price: 450,
    quantity: 1,
    image: "https://images.pokemontcg.io/swsh45/074_hires.png",
    vendor: "Emirates Card Exchange"
  },
  {
    id: "item-2",
    productId: "prod-2",
    name: "Cristiano Ronaldo Rookie Card - Panini 2003",
    title: "Cristiano Ronaldo Rookie Card - Panini 2003",
    price: 750,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=560&fit=crop",
    vendor: "Emirates Card Exchange"
  },
  {
    id: "item-3",
    productId: "prod-3",
    name: "Blue-Eyes White Dragon - LOB 1st Edition",
    title: "Blue-Eyes White Dragon - LOB 1st Edition",
    price: 320,
    quantity: 2,
    image: "https://52f4e29a8321344e30ae-0f55c9129972ac85d6b1f4e703468e6b.ssl.cf2.rackcdn.com/4007.jpg",
    vendor: "Emirates Card Exchange"
  },
  {
    id: "item-4",
    productId: "prod-4",
    name: "Amazing Spider-Man #1 (1963) - Stan Lee Signature",
    title: "Amazing Spider-Man #1 (1963) - Stan Lee Signature",
    price: 2800,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1578663287732-a3985e772b6b?w=400&h=600&fit=crop",
    vendor: "Dubai Comic Vault"
  },
  {
    id: "item-5",
    productId: "prod-5",
    name: "Batman: The Killing Joke - First Print (1988)",
    title: "Batman: The Killing Joke - First Print (1988)",
    price: 180,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1578663287732-a3985e772b6b?w=400&h=600&fit=crop&brightness=0.7",
    vendor: "Dubai Comic Vault"
  },
  {
    id: "item-6",
    productId: "prod-6",
    name: "One Piece Volume 1 - First Japanese Edition",
    title: "One Piece Volume 1 - First Japanese Edition",
    price: 95,
    quantity: 3,
    image: "https://images.unsplash.com/photo-1578663287732-a3985e772b6b?w=400&h=600&fit=crop&brightness=1.2",
    vendor: "Dubai Comic Vault"
  }
];

// Generate mock orders for a customer
export function generateMockOrders(userId: string, count: number = 10): Order[] {
  const orders: Order[] = [];
  const statuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

  // Create a deterministic seed based on userId
  const userSeed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  for (let i = 0; i < count; i++) {
    const orderSeed = userSeed + i;
    const orderItems = getRandomOrderItems(orderSeed);
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 25; // Free shipping over 500 AED
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% VAT
    const discount = seededRandom(orderSeed + 100) > 0.7 ? Math.round(subtotal * 0.1 * 100) / 100 : 0; // 10% discount sometimes
    const total = subtotal + shipping + tax - discount;

    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(seededRandom(orderSeed + 200) * 90)); // Orders from last 90 days

    const estimatedDelivery = new Date(createdDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(seededRandom(orderSeed + 300) * 7) + 2); // 2-9 days delivery

    const order: Order = {
      id: `order-${userId}-${i + 1}`,
      orderNumber: generateOrderNumber(orderSeed + 800),
      userId,
      items: orderItems,
      shippingAddress: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+971-50-123-4567",
        address: "Villa 123, Palm Jumeirah",
        address2: "",
        city: "Dubai",
        state: "Dubai",
        postalCode: "00000",
        country: "United Arab Emirates",
        instructions: "Leave at reception"
      },
      billingAddress: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+971-50-123-4567",
        address: "Villa 123, Palm Jumeirah",
        address2: "",
        city: "Dubai",
        state: "Dubai",
        postalCode: "00000",
        country: "United Arab Emirates"
      },
      paymentMethod: getRandomPaymentMethod(orderSeed + 700),
      subtotal,
      shipping,
      tax,
      discount,
      total,
      status: getWeightedRandomStatus(orderSeed + 400),
      orderNotes: seededRandom(orderSeed + 500) > 0.7 ? "Please handle with care" : undefined,
      createdAt: createdDate.toISOString(),
      estimatedDelivery: estimatedDelivery.toISOString(),
      trackingNumber: ["shipped", "delivered"].includes(getWeightedRandomStatus(orderSeed + 400)) ? generateTrackingNumber(orderSeed + 600) : undefined
    };

    orders.push(order);
  }

  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Get random order items (1-3 items per order)
function getRandomOrderItems(seed: number): OrderItem[] {
  const itemCount = Math.floor(seededRandom(seed) * 3) + 1;
  const selectedItems: OrderItem[] = [];
  const availableItems = [...mockOrderItems];

  for (let i = 0; i < itemCount; i++) {
    if (availableItems.length === 0) break;

    const randomIndex = Math.floor(seededRandom(seed + i + 10) * availableItems.length);
    const item = availableItems.splice(randomIndex, 1)[0];

    // Randomize quantity (1-2 for most items)
    const quantity = seededRandom(seed + i + 20) > 0.8 ? 2 : 1;
    selectedItems.push({
      ...item,
      quantity,
      id: `item-${seed}-${i}`
    });
  }

  return selectedItems;
}

// Get weighted random status (more likely to be completed)
function getWeightedRandomStatus(seed: number): OrderStatus {
  const rand = seededRandom(seed);
  if (rand < 0.05) return "cancelled";
  if (rand < 0.1) return "pending";
  if (rand < 0.2) return "processing";
  if (rand < 0.35) return "shipped";
  return "delivered";
}

// Get random payment method
function getRandomPaymentMethod(seed: number): string {
  const methods = ["Credit Card", "Debit Card", "PayPal", "Cash on Delivery", "Bank Transfer"];
  return methods[Math.floor(seededRandom(seed) * methods.length)];
}

// Generate tracking number
function generateTrackingNumber(seed: number): string {
  const prefixes = ["DXB", "AUH", "SHJ"];
  const prefix = prefixes[Math.floor(seededRandom(seed) * prefixes.length)];
  const number = Math.floor(seededRandom(seed + 1) * 1000000000).toString().padStart(9, '0');
  return `${prefix}${number}`;
}

// Order management utilities
export class OrderManager {
  static getOrderById(orderId: string, orders: Order[]): Order | undefined {
    return orders.find(order => order.id === orderId);
  }

  static getOrdersByStatus(status: OrderStatus, orders: Order[]): Order[] {
    return orders.filter(order => order.status === status);
  }

  static getOrdersByDateRange(startDate: Date, endDate: Date, orders: Order[]): Order[] {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  static calculateOrderStats(orders: Order[]) {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusCounts = orders.reduce((counts, order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
      return counts;
    }, {} as Record<OrderStatus, number>);

    return {
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      statusCounts
    };
  }

  static getRecentOrders(orders: Order[], days: number = 30): Order[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return orders.filter(order => new Date(order.createdAt) >= cutoffDate);
  }

  static canCancelOrder(order: Order): boolean {
    return ["pending", "processing"].includes(order.status);
  }

  static canTrackOrder(order: Order): boolean {
    return ["shipped", "delivered"].includes(order.status) && !!order.trackingNumber;
  }
}

// Load orders from localStorage or generate new ones
export function loadUserOrders(userId: string): Order[] {
  if (typeof window === 'undefined') return [];

  const storageKey = `lpx_orders_${userId}`;
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    try {
      const orders = JSON.parse(stored);
      return Array.isArray(orders) ? orders : [orders];
    } catch (error) {
      console.error('Failed to parse stored orders:', error);
    }
  }

  // Generate and store new orders if none exist
  const newOrders = generateMockOrders(userId, 8);
  localStorage.setItem(storageKey, JSON.stringify(newOrders));
  return newOrders;
}

// Save orders to localStorage
export function saveUserOrders(userId: string, orders: Order[]): void {
  if (typeof window === 'undefined') return;

  const storageKey = `lpx_orders_${userId}`;
  localStorage.setItem(storageKey, JSON.stringify(orders));
}

// Add new order (used when checkout completes)
export function addUserOrder(userId: string, order: Order): void {
  const existingOrders = loadUserOrders(userId);
  const updatedOrders = [order, ...existingOrders];
  saveUserOrders(userId, updatedOrders);
}