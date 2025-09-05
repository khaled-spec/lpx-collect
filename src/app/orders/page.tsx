"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ShoppingBag,
  FileText,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { designTokens } from "@/lib/design-tokens";
import type { Order, OrderStatus } from "@/types/checkout";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string }> = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-500" },
  processing: { label: "Processing", icon: RefreshCw, color: "bg-blue-500" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-purple-500" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-500" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500" },
};

function OrderCard({ order, onReorder }: { order: Order; onReorder: (order: Order) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={cn("p-2 rounded-lg", status.color, "bg-opacity-10")}>
              <StatusIcon className={cn("h-5 w-5", status.color.replace("bg-", "text-"))} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Placed on {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  View Details
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b">
          <div className="mb-2 sm:mb-0">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onReorder(order)}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Reorder
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              Invoice
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="pt-4 space-y-4">
            <div>
              <h4 className="font-medium mb-3">Order Items ({order.items.length})</h4>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Delivery Address</h4>
                <div className="text-sm text-muted-foreground">
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address}</p>
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Payment Method</h4>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {typeof order.paymentMethod === "string" 
                      ? (order.paymentMethod === "card" ? "Credit Card" : order.paymentMethod)
                      : order.paymentMethod.type === "card" ? "Credit Card" : order.paymentMethod.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t">
              <h4 className="font-medium mb-2">Order Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {order.estimatedDelivery && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                <Truck className="h-4 w-4 text-primary" />
                <p className="text-sm">
                  Estimated delivery: <span className="font-medium">
                    {typeof order.estimatedDelivery === 'string' 
                      ? order.estimatedDelivery 
                      : order.estimatedDelivery?.toLocaleDateString()}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/orders");
      return;
    }

    // Load orders from localStorage
    const loadOrders = () => {
      const userOrderKey = `lpx_orders_${user.id}`;
      const storedOrders = localStorage.getItem(userOrderKey);
      
      if (storedOrders) {
        try {
          const parsedOrders = JSON.parse(storedOrders);
          // Ensure orders is an array
          const ordersArray = Array.isArray(parsedOrders) ? parsedOrders : [parsedOrders];
          setOrders(ordersArray);
          setFilteredOrders(ordersArray);
        } catch (error) {
          console.error("Failed to parse orders:", error);
          setOrders([]);
          setFilteredOrders([]);
        }
      } else {
        // Check for any order from checkout (backwards compatibility)
        const lastOrder = localStorage.getItem(`lpx_order_${user.id}_last`);
        if (lastOrder) {
          try {
            const order = JSON.parse(lastOrder);
            const ordersArray = [order];
            setOrders(ordersArray);
            setFilteredOrders(ordersArray);
            // Save to new format
            localStorage.setItem(userOrderKey, JSON.stringify(ordersArray));
          } catch (error) {
            console.error("Failed to parse last order:", error);
          }
        }
      }
    };

    loadOrders();
  }, [user, router]);

  useEffect(() => {
    let filtered = [...orders];

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "highest":
          return b.total - a.total;
        case "lowest":
          return a.total - b.total;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, filterStatus, sortBy]);

  const handleReorder = (order: Order) => {
    // For now, we'll just show a message since we don't have the full product data
    // In a real app, you'd fetch the product details from the API
    toast.info("Reorder functionality is not yet implemented");
    
    // Alternatively, if we had access to the products:
    // order.items.forEach(item => {
    //   for (let i = 0; i < item.quantity; i++) {
    //     addToCart(item.product, 1);
    //   }
    // });
    // toast.success(`${order.items.length} items added to cart`);
    // router.push("/cart");
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
                  <BreadcrumbPage>Order History</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className={cn(designTokens.heading.h1, "mb-2")}>Order History</h1>
                <p className="text-muted-foreground">
                  View and manage your past orders
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Value</SelectItem>
                    <SelectItem value="lowest">Lowest Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filters */}
            <Tabs value={filterStatus} onValueChange={setFilterStatus} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">
                  All Orders {orders.length > 0 && `(${orders.length})`}
                </TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">No orders found</h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {filterStatus === "all" 
                      ? "You haven't placed any orders yet. Start shopping to see your order history here."
                      : `No ${filterStatus} orders found. Try selecting a different filter.`}
                  </p>
                  {filterStatus === "all" && (
                    <Button asChild size="lg">
                      <a href="/browse">
                        Start Shopping
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onReorder={handleReorder} />
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