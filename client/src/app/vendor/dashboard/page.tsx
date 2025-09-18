"use client";

import { useState } from "react";
import Link from "next/link";
import { EmptyStates } from "@/components/shared/EmptyState";
import PageLayout from "@/components/layout/PageLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { designTokens } from "@/lib/design-tokens";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Plus,
  Eye,
  TrendingUp,
  BarChart3,
  Settings,
} from "lucide-react";

const initialDashboardData = {
  analytics: {
    revenue: { total: 0, thisMonth: 0, lastMonth: 0, growth: 0 },
    orders: { total: 0, pending: 0, processing: 0, completed: 0 },
    products: { total: 0, active: 0, outOfStock: 0, draft: 0 },
    customers: { total: 0, returning: 0, new: 0, satisfactionRate: 0 },
  },
  recentOrders: [],
  topProducts: [],
  messages: [],
};

function StatsOverview({ dashboard }: { dashboard: any }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Revenue */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Revenue
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(dashboard.analytics.revenue.thisMonth)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Orders */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Orders
              </p>
              <p className="text-2xl font-bold">
                {dashboard.analytics.orders.total}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Products
              </p>
              <p className="text-2xl font-bold">
                {dashboard.analytics.products.active}
              </p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      {/* Customers */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Customers
              </p>
              <p className="text-2xl font-bold">
                {dashboard.analytics.customers.total}
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VendorDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const dashboard = initialDashboardData;

  return (
    <ProtectedRoute>
      <PageLayout
        title="Vendor Dashboard"
        description="Welcome back! Here's what's happening with your store today."
        breadcrumbs={[
          { label: "Vendor", href: "/vendor/products" },
          { label: "Dashboard" },
        ]}
      >
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <Button variant="outline" asChild>
            <Link href="/vendor/products">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
          <Button asChild>
            <Link href="/vendor/1">
              <Eye className="h-4 w-4 mr-2" />
              View Store
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <StatsOverview dashboard={dashboard} />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your store</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/vendor/products/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/vendor/products">
                      <Package className="h-4 w-4 mr-2" />
                      Manage Products
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/vendor/1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Store
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Store Status</CardTitle>
                  <CardDescription>Your store health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Store Status</span>
                      <Badge variant="outline">Inactive</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Products</span>
                      <span>{dashboard.analytics.products.active} active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Orders</span>
                      <span>{dashboard.analytics.orders.total} total</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>Setup your store</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Add your first product</p>
                    <p>• Set up store information</p>
                    <p>• Configure payment methods</p>
                    <p>• Customize your storefront</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboard.recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Your orders will appear here once customers start purchasing.
                    </p>
                    <Button asChild>
                      <Link href="/vendor/products/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Product
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Orders list would go here */}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your inventory</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboard.topProducts.length === 0 ? (
                  <EmptyStates.NoVendorProducts />
                ) : (
                  <div className="space-y-4">
                    {/* Products list would go here */}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Store analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Analytics will show when you have data</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Revenue data will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </ProtectedRoute>
  );
}
