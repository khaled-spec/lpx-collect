"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/context/AuthContext";

export type NotificationType = "order" | "system" | "promotion" | "vendor" | "price_alert";
export type NotificationPriority = "low" | "medium" | "high";

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
  metadata?: {
    orderId?: string;
    productId?: string;
    vendorId?: string;
    discount?: number;
    previousPrice?: number;
    currentPrice?: number;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  getNotificationsByType: (type: NotificationType) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Mock notifications for testing
const generateMockNotifications = (): Notification[] => {
  const now = new Date();
  return [
    {
      id: "1",
      type: "order",
      priority: "high",
      title: "Order Shipped!",
      message: "Your order #123456 has been shipped and is on its way.",
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: false,
      actionUrl: "/orders",
      actionLabel: "Track Order",
      metadata: { orderId: "123456" },
    },
    {
      id: "2",
      type: "price_alert",
      priority: "medium",
      title: "Price Drop Alert",
      message: "An item in your wishlist is now 20% off!",
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      read: false,
      actionUrl: "/wishlist",
      actionLabel: "View Item",
      metadata: { 
        productId: "prod-001",
        discount: 20,
        previousPrice: 99.99,
        currentPrice: 79.99
      },
    },
    {
      id: "3",
      type: "system",
      priority: "low",
      title: "Welcome to LPX Collect!",
      message: "Complete your profile to get personalized recommendations.",
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      read: true,
      actionUrl: "/settings",
      actionLabel: "Complete Profile",
    },
    {
      id: "4",
      type: "vendor",
      priority: "medium",
      title: "New Products from CardMasters",
      message: "Your favorite vendor just added 15 new rare cards!",
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      read: true,
      actionUrl: "/vendor/cardmasters",
      actionLabel: "View Products",
      metadata: { vendorId: "vendor-001" },
    },
    {
      id: "5",
      type: "promotion",
      priority: "high",
      title: "Weekend Flash Sale!",
      message: "Get 30% off on all trading cards. Ends Sunday!",
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      read: false,
      actionUrl: "/browse?category=trading-cards",
      actionLabel: "Shop Now",
      metadata: { discount: 30 },
    },
    {
      id: "6",
      type: "order",
      priority: "high",
      title: "Order Delivered",
      message: "Your order #123455 has been delivered successfully.",
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      read: true,
      actionUrl: "/orders",
      actionLabel: "Leave Review",
      metadata: { orderId: "123455" },
    },
  ];
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const loadNotifications = () => {
      const storageKey = user ? `lpx_notifications_${user.id}` : "lpx_notifications_guest";
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setNotifications(parsed);
        } catch (error) {
          console.error("Failed to parse notifications:", error);
          // Load mock notifications for first-time users
          const mockNotifications = generateMockNotifications();
          setNotifications(mockNotifications);
          localStorage.setItem(storageKey, JSON.stringify(mockNotifications));
        }
      } else {
        // Load mock notifications for first-time users
        const mockNotifications = generateMockNotifications();
        setNotifications(mockNotifications);
        localStorage.setItem(storageKey, JSON.stringify(mockNotifications));
      }
    };

    loadNotifications();
  }, [user]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    const storageKey = user ? `lpx_notifications_${user.id}` : "lpx_notifications_guest";
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getNotificationsByType = useCallback((type: NotificationType) => {
    return notifications.filter(notif => notif.type === type);
  }, [notifications]);

  // Simulate receiving new notifications periodically (for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a new notification every 2 minutes (for demo purposes)
      if (Math.random() > 0.7) {
        const types: NotificationType[] = ["order", "system", "promotion", "vendor", "price_alert"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const messages = {
          order: {
            title: "Order Update",
            message: "Your order status has been updated.",
            priority: "high" as NotificationPriority,
          },
          system: {
            title: "System Notice",
            message: "New features have been added to your account.",
            priority: "low" as NotificationPriority,
          },
          promotion: {
            title: "Special Offer",
            message: "Limited time offer just for you!",
            priority: "medium" as NotificationPriority,
          },
          vendor: {
            title: "Vendor Update",
            message: "New items from vendors you follow.",
            priority: "medium" as NotificationPriority,
          },
          price_alert: {
            title: "Price Alert",
            message: "Price changed on your watched items.",
            priority: "high" as NotificationPriority,
          },
        };

        const notification = messages[randomType];
        addNotification({
          type: randomType,
          ...notification,
        });
      }
    }, 120000); // Check every 2 minutes

    return () => clearInterval(interval);
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        getNotificationsByType,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}