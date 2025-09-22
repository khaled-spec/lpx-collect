import type { Order, OrderStatus } from "@/types/checkout";
import { generateMockOrders } from "./mock-orders";

// Order timeline events
export interface OrderEvent {
  id: string;
  type:
    | "status_change"
    | "payment"
    | "shipping"
    | "delivery"
    | "cancellation"
    | "refund";
  status?: OrderStatus;
  title: string;
  description: string;
  timestamp: Date | string;
  metadata?: {
    trackingNumber?: string;
    carrier?: string;
    refundAmount?: number;
    paymentMethod?: string;
    location?: string;
  };
}

// Order analytics data
export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  monthlyStats: MonthlyOrderStats[];
  statusDistribution: Record<OrderStatus, number>;
  topProducts: ProductSalesData[];
  orderTrends: OrderTrendData[];
}

export interface MonthlyOrderStats {
  month: string;
  year: number;
  orders: number;
  revenue: number;
  averageValue: number;
}

export interface ProductSalesData {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
  averagePrice: number;
}

export interface OrderTrendData {
  date: string;
  orders: number;
  revenue: number;
}

// Generate order timeline/events
export function generateOrderEvents(order: Order): OrderEvent[] {
  const events: OrderEvent[] = [];
  const orderDate = new Date(order.createdAt);

  // Order placed event
  events.push({
    id: `${order.id}-placed`,
    type: "status_change",
    status: "pending",
    title: "Order Placed",
    description: "Your order has been received and is being processed",
    timestamp: orderDate,
  });

  // Payment event
  events.push({
    id: `${order.id}-payment`,
    type: "payment",
    title: "Payment Confirmed",
    description: `Payment of $${order.total.toFixed(2)} confirmed`,
    timestamp: new Date(orderDate.getTime() + 5 * 60 * 1000), // 5 minutes later
    metadata: {
      paymentMethod:
        typeof order.paymentMethod === "string"
          ? order.paymentMethod
          : order.paymentMethod.type,
    },
  });

  if (order.status !== "cancelled") {
    // Processing event
    const processingTime = new Date(orderDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    events.push({
      id: `${order.id}-processing`,
      type: "status_change",
      status: "processing",
      title: "Order Processing",
      description: "Your order is being prepared for shipment",
      timestamp: processingTime,
    });

    if (["shipped", "delivered"].includes(order.status)) {
      // Shipped event
      const shippedTime = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000); // 1 day later
      events.push({
        id: `${order.id}-shipped`,
        type: "shipping",
        status: "shipped",
        title: "Order Shipped",
        description: "Your order has been shipped and is on its way",
        timestamp: shippedTime,
        metadata: {
          trackingNumber: order.trackingNumber,
          carrier: "Emirates Post",
        },
      });

      if (order.status === "delivered") {
        // Delivered event
        const deliveredTime = new Date(order.estimatedDelivery);
        events.push({
          id: `${order.id}-delivered`,
          type: "delivery",
          status: "delivered",
          title: "Order Delivered",
          description: "Your order has been successfully delivered",
          timestamp: deliveredTime,
          metadata: {
            location: `${order.shippingAddress.city}, ${order.shippingAddress.country}`,
          },
        });
      }
    }
  } else {
    // Cancelled event
    const cancelledTime = new Date(orderDate.getTime() + 30 * 60 * 1000); // 30 minutes later
    events.push({
      id: `${order.id}-cancelled`,
      type: "cancellation",
      status: "cancelled",
      title: "Order Cancelled",
      description: "Your order has been cancelled",
      timestamp: cancelledTime,
    });

    // Refund event
    events.push({
      id: `${order.id}-refund`,
      type: "refund",
      title: "Refund Processed",
      description:
        "Refund has been processed and will appear in your account within 3-5 business days",
      timestamp: new Date(cancelledTime.getTime() + 2 * 60 * 60 * 1000), // 2 hours after cancellation
      metadata: {
        refundAmount: order.total,
      },
    });
  }

  return events.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
}

// Generate historical order data
export function generateOrderHistory(userId: string): {
  orders: Order[];
  analytics: OrderAnalytics;
} {
  // Generate orders over the past year
  const orders = generateMockOrders(userId, 25);

  // Calculate analytics
  const analytics = calculateOrderAnalytics(orders);

  return {
    orders,
    analytics,
  };
}

// Calculate comprehensive order analytics
export function calculateOrderAnalytics(orders: Order[]): OrderAnalytics {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Monthly stats
  const monthlyStatsMap = new Map<string, MonthlyOrderStats>();

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const monthName = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();

    if (!monthlyStatsMap.has(key)) {
      monthlyStatsMap.set(key, {
        month: monthName,
        year,
        orders: 0,
        revenue: 0,
        averageValue: 0,
      });
    }

    const stats = monthlyStatsMap.get(key);
    if (stats) {
      stats.orders++;
      stats.revenue += order.total;
      stats.averageValue = stats.revenue / stats.orders;
    }
  });

  const monthlyStats = Array.from(monthlyStatsMap.values()).sort((a, b) => {
    return (
      new Date(a.year, getMonthIndex(a.month)).getTime() -
      new Date(b.year, getMonthIndex(b.month)).getTime()
    );
  });

  // Status distribution
  const statusDistribution = orders.reduce(
    (dist, order) => {
      dist[order.status] = (dist[order.status] || 0) + 1;
      return dist;
    },
    {} as Record<OrderStatus, number>,
  );

  // Top products
  const productMap = new Map<string, ProductSalesData>();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const key = item.productId || item.id;
      if (!productMap.has(key)) {
        productMap.set(key, {
          productId: key,
          productName: item.title || item.name,
          totalSold: 0,
          totalRevenue: 0,
          averagePrice: item.price,
        });
      }

      const product = productMap.get(key);
      if (product) {
        product.totalSold += item.quantity;
        product.totalRevenue += item.price * item.quantity;
        product.averagePrice = product.totalRevenue / product.totalSold;
      }
    });
  });

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  // Order trends (last 30 days)
  const orderTrends = generateOrderTrends(orders);

  return {
    totalOrders,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    monthlyStats,
    statusDistribution,
    topProducts,
    orderTrends,
  };
}

// Generate daily order trends for the last 30 days
function generateOrderTrends(orders: Order[]): OrderTrendData[] {
  const trends: OrderTrendData[] = [];
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split("T")[0];

    const dayOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      return orderDate === dateString;
    });

    trends.push({
      date: dateString,
      orders: dayOrders.length,
      revenue: dayOrders.reduce((sum, order) => sum + order.total, 0),
    });
  }

  return trends;
}

// Helper function to get month index
function getMonthIndex(monthName: string): number {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months.indexOf(monthName);
}

// Order search and filtering utilities
export function searchOrders(orders: Order[], query: string): Order[] {
  const searchTerm = query.toLowerCase();
  return orders.filter((order) => {
    return (
      order.orderNumber.toLowerCase().includes(searchTerm) ||
      order.items.some(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.title?.toLowerCase().includes(searchTerm) ||
          item.vendor?.toLowerCase().includes(searchTerm),
      ) ||
      order.status.toLowerCase().includes(searchTerm)
    );
  });
}

export function filterOrdersByDateRange(
  orders: Order[],
  startDate: Date,
  endDate: Date,
): Order[] {
  return orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= startDate && orderDate <= endDate;
  });
}

export function filterOrdersByStatus(
  orders: Order[],
  statuses: OrderStatus[],
): Order[] {
  return orders.filter((order) => statuses.includes(order.status));
}

export function filterOrdersByValueRange(
  orders: Order[],
  minValue: number,
  maxValue: number,
): Order[] {
  return orders.filter(
    (order) => order.total >= minValue && order.total <= maxValue,
  );
}

export function sortOrders(
  orders: Order[],
  sortBy: "date" | "value" | "status",
  direction: "asc" | "desc" = "desc",
): Order[] {
  const sorted = [...orders];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "value":
        comparison = a.total - b.total;
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
    }

    return direction === "desc" ? -comparison : comparison;
  });

  return sorted;
}

// Export historical data for different time periods
export const orderHistoryPresets = {
  last7Days: () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    return { startDate, endDate };
  },

  last30Days: () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    return { startDate, endDate };
  },

  last3Months: () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    return { startDate, endDate };
  },

  last6Months: () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    return { startDate, endDate };
  },

  lastYear: () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    return { startDate, endDate };
  },
};
