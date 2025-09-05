"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications, NotificationType, Notification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Bell,
  BellOff,
  Package,
  Settings,
  ShoppingBag,
  Tag,
  Store,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  MoreVertical,
  Check,
  ArrowRight,
  Filter,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { designTokens } from "@/lib/design-tokens";
import { toast } from "sonner";

const notificationIcons: Record<NotificationType, React.ElementType> = {
  order: Package,
  system: AlertCircle,
  promotion: Tag,
  vendor: Store,
  price_alert: TrendingDown,
};

const notificationColors: Record<NotificationType, string> = {
  order: "text-blue-500",
  system: "text-gray-500",
  promotion: "text-purple-500",
  vendor: "text-green-500",
  price_alert: "text-orange-500",
};

interface NotificationGroup {
  title: string;
  notifications: Notification[];
}

function NotificationCard({ 
  notification, 
  onRead, 
  onDelete, 
  isSelected,
  onSelect 
}: { 
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}) {
  const router = useRouter();
  const Icon = notificationIcons[notification.type];
  const iconColor = notificationColors[notification.type];

  const handleAction = () => {
    if (notification.actionUrl) {
      if (!notification.read) {
        onRead(notification.id);
      }
      router.push(notification.actionUrl);
    }
  };

  const handleCardClick = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md cursor-pointer",
        !notification.read && "bg-primary/5 border-primary/20"
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(notification.id, checked as boolean)}
            onClick={(e) => e.stopPropagation()}
            className="mt-1"
          />
          
          <div className={cn("p-2 rounded-lg bg-background", iconColor, "bg-opacity-10")}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                  )}
                  {notification.priority === "high" && (
                    <Badge variant="destructive" className="text-xs px-1.5 py-0">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </span>
                  {notification.actionLabel && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction();
                      }}
                    >
                      {notification.actionLabel}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!notification.read && (
                    <DropdownMenuItem onClick={() => onRead(notification.id)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as read
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onDelete(notification.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function groupNotificationsByTime(notifications: Notification[]): NotificationGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const groups: NotificationGroup[] = [];
  const todayNotifications: Notification[] = [];
  const yesterdayNotifications: Notification[] = [];
  const thisWeekNotifications: Notification[] = [];
  const olderNotifications: Notification[] = [];

  notifications.forEach(notification => {
    const date = new Date(notification.timestamp);
    
    if (date >= today) {
      todayNotifications.push(notification);
    } else if (date >= yesterday) {
      yesterdayNotifications.push(notification);
    } else if (date >= weekAgo) {
      thisWeekNotifications.push(notification);
    } else {
      olderNotifications.push(notification);
    }
  });

  if (todayNotifications.length > 0) {
    groups.push({ title: "Today", notifications: todayNotifications });
  }
  if (yesterdayNotifications.length > 0) {
    groups.push({ title: "Yesterday", notifications: yesterdayNotifications });
  }
  if (thisWeekNotifications.length > 0) {
    groups.push({ title: "This Week", notifications: thisWeekNotifications });
  }
  if (olderNotifications.length > 0) {
    groups.push({ title: "Older", notifications: olderNotifications });
  }

  return groups;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
  } = useNotifications();

  const [filterType, setFilterType] = useState<"all" | NotificationType>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/notifications");
    }
  }, [user, router]);

  const filteredNotifications = filterType === "all" 
    ? notifications 
    : getNotificationsByType(filterType);

  const displayedNotifications = showUnreadOnly
    ? filteredNotifications.filter(n => !n.read)
    : filteredNotifications;

  const groupedNotifications = groupNotificationsByTime(displayedNotifications);

  const handleSelectNotification = (id: string, checked: boolean) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(new Set(displayedNotifications.map(n => n.id)));
    } else {
      setSelectedNotifications(new Set());
    }
  };

  const handleBulkDelete = () => {
    selectedNotifications.forEach(id => {
      deleteNotification(id);
    });
    setSelectedNotifications(new Set());
    toast.success(`${selectedNotifications.size} notifications deleted`);
  };

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach(id => {
      markAsRead(id);
    });
    setSelectedNotifications(new Set());
    toast.success(`${selectedNotifications.size} notifications marked as read`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow">
        <Container className="py-8">
          <div className="bg-card rounded-xl border border-border shadow-lg p-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Notifications</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className={cn(designTokens.heading.h1, "mb-2")}>
                  Notifications
                </h1>
                <p className="text-muted-foreground">
                  {unreadCount > 0 
                    ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                    : "You're all caught up!"
                  }
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                {selectedNotifications.size > 0 ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkMarkAsRead}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as read
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkDelete}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete ({selectedNotifications.size})
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAsRead}
                      disabled={unreadCount === 0}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Mark all read
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push("/settings?tab=email")}>
                          <Bell className="mr-2 h-4 w-4" />
                          Email Preferences
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={clearAllNotifications}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Clear All Notifications
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 space-y-4">
              <Tabs value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                  <TabsTrigger value="all">
                    All {notifications.length > 0 && `(${notifications.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="order">Orders</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                  <TabsTrigger value="promotion">Promotions</TabsTrigger>
                  <TabsTrigger value="vendor">Vendors</TabsTrigger>
                  <TabsTrigger value="price_alert">Price Alerts</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedNotifications.size === displayedNotifications.length && displayedNotifications.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">Select all</span>
                  </div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={showUnreadOnly}
                      onCheckedChange={(checked) => setShowUnreadOnly(checked as boolean)}
                    />
                    <span className="text-sm text-muted-foreground">Unread only</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            {displayedNotifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
                    <BellOff className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">No notifications</h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {showUnreadOnly
                      ? "You don't have any unread notifications. Great job staying on top of things!"
                      : filterType === "all"
                      ? "You don't have any notifications yet. We'll notify you when something important happens."
                      : `No ${filterType.replace('_', ' ')} notifications found.`}
                  </p>
                  {showUnreadOnly && (
                    <Button variant="outline" onClick={() => setShowUnreadOnly(false)}>
                      Show All Notifications
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {groupedNotifications.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      {group.title}
                    </h3>
                    <div className="space-y-2">
                      {group.notifications.map((notification) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          onRead={markAsRead}
                          onDelete={deleteNotification}
                          isSelected={selectedNotifications.has(notification.id)}
                          onSelect={handleSelectNotification}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}