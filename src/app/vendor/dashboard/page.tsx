'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockVendorDashboard } from '@/data/vendorData';
import { Container } from '@/components/layout/Container';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { PrimaryButton, SecondaryButton, OutlineButton, IconButton } from '@/components/custom/button-variants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/custom/card-variants';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { designTokens } from '@/lib/design-tokens';
import { tokens } from '@/lib/design-system';
import { 
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Download,
  Upload,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Mail,
  Settings,
  HelpCircle,
  Bell,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function VendorDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const dashboard = mockVendorDashboard;

  // Calculate percentage changes
  const revenueChange = dashboard.analytics.revenue.growth;
  const ordersChange = 15.2; // Mock data
  const customersChange = 8.5; // Mock data

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
          <Container className="py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className={`${designTokens.heading.h2} mb-2`}>
                  Vendor Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's what's happening with your store today.
                </p>
              </div>
              <div className="flex gap-3">
                <OutlineButton asChild>
                  <Link href="/vendor/products">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Link>
                </OutlineButton>
                <PrimaryButton asChild>
                  <Link href="/vendor/1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Store
                  </Link>
                </PrimaryButton>
              </div>
            </div>
          </Container>
        </section>

        {/* Quick Stats */}
        <section className={`${designTokens.spacing.section.sm}`}>
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Revenue */}
              <StatsCard>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <Badge variant={revenueChange > 0 ? 'default' : 'destructive'} className="text-xs">
                      {revenueChange > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                      {Math.abs(revenueChange)}%
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(dashboard.analytics.revenue.thisMonth)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Revenue this month
                  </p>
                  <Progress value={75} className="mt-3 h-1" />
                </CardContent>
              </StatsCard>

              {/* Orders */}
              <StatsCard>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge variant="default" className="text-xs">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {ordersChange}%
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">
                    {dashboard.analytics.orders.total}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total orders
                  </p>
                  <div className="flex gap-2 mt-3 text-xs">
                    <span className="text-yellow-600">{dashboard.analytics.orders.pending} pending</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-blue-600">{dashboard.analytics.orders.processing} processing</span>
                  </div>
                </CardContent>
              </StatsCard>

              {/* Products */}
              <StatsCard>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <OutlineButton size="sm" asChild>
                      <Link href="/vendor/products">
                        Manage
                      </Link>
                    </OutlineButton>
                  </div>
                  <div className="text-2xl font-bold">
                    {dashboard.analytics.products.active}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Active products
                  </p>
                  <div className="flex gap-2 mt-3 text-xs">
                    <span className="text-red-600">{dashboard.analytics.products.outOfStock} out of stock</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-gray-600">{dashboard.analytics.products.draft} draft</span>
                  </div>
                </CardContent>
              </StatsCard>

              {/* Customers */}
              <StatsCard>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <Badge variant="default" className="text-xs">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {customersChange}%
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">
                    {dashboard.analytics.customers.total}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total customers
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Progress value={dashboard.analytics.customers.satisfactionRate} className="flex-1 h-1" />
                    <span className="text-xs text-muted-foreground">{dashboard.analytics.customers.satisfactionRate}%</span>
                  </div>
                </CardContent>
              </StatsCard>
            </div>
          </Container>
        </section>

        {/* Main Content */}
        <section className={designTokens.spacing.section.md}>
          <Container>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Orders */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Orders</CardTitle>
                        <OutlineButton size="sm" asChild>
                          <Link href="/vendor/orders">
                            View All
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </OutlineButton>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboard.recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="font-medium">{order.id}</span>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {order.customer} • {order.product}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(order.date)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{formatCurrency(order.amount)}</div>
                              <IconButton variant="ghost" size="sm" className="mt-1">
                                <MoreVertical className="h-4 w-4" />
                              </IconButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Products */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Products</CardTitle>
                      <CardDescription>Best performing items</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboard.topProducts.map((product, index) => (
                          <div key={product.id} className="flex items-center gap-3">
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                              ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                index === 1 ? 'bg-gray-100 text-gray-700' :
                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                'bg-muted text-muted-foreground'}
                            `}>
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{product.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{product.sales} sold</span>
                                <span>•</span>
                                <span className={product.stock === 0 ? 'text-red-600' : ''}>
                                  {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">{formatCurrency(product.revenue)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Messages */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Messages</CardTitle>
                        <CardDescription>Customer inquiries and notifications</CardDescription>
                      </div>
                      <Badge variant="destructive">
                        {dashboard.messages.filter(m => m.unread).length} unread
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboard.messages.map((message) => (
                        <div key={message.id} className={`
                          p-4 rounded-lg border 
                          ${message.unread ? 'bg-primary/5 border-primary/20' : ''}
                        `}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="font-medium">{message.from}</span>
                              {message.unread && (
                                <Badge variant="default" className="ml-2 text-xs">New</Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(message.date)}
                            </span>
                          </div>
                          <p className="font-medium text-sm mb-1">{message.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="text-center">
                      <OutlineButton size="sm" asChild>
                        <Link href="/vendor/messages">
                          View All Messages
                        </Link>
                      </OutlineButton>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>View and manage all your orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dashboard.recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.product}</TableCell>
                            <TableCell>{formatCurrency(order.amount)}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(order.date)}</TableCell>
                            <TableCell>
                              <IconButton variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Product Inventory</CardTitle>
                        <CardDescription>Manage your product listings</CardDescription>
                      </div>
                      <PrimaryButton size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </PrimaryButton>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Sales</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dashboard.topProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.sales}</TableCell>
                            <TableCell>{formatCurrency(product.revenue)}</TableCell>
                            <TableCell>
                              <span className={product.stock === 0 ? 'text-red-600 font-semibold' : ''}>
                                {product.stock}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                                {product.stock > 0 ? 'Active' : 'Out of Stock'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <IconButton variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </IconButton>
                                <IconButton variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </IconButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Messages Tab */}
              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle>Messages & Notifications</CardTitle>
                    <CardDescription>Communicate with customers and manage notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>Message center coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics & Reports</CardTitle>
                    <CardDescription>Detailed insights into your store performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>Advanced analytics coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Container>
        </section>

        {/* Quick Actions */}
        <section className={`${designTokens.spacing.section.md} bg-muted/30`}>
          <Container>
            <h2 className={`${designTokens.heading.h3} mb-6`}>Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Import Products</p>
                  <p className="text-xs text-muted-foreground mt-1">Bulk upload inventory</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Download className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Export Data</p>
                  <p className="text-xs text-muted-foreground mt-1">Download reports</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Settings className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Store Settings</p>
                  <p className="text-xs text-muted-foreground mt-1">Customize your store</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <HelpCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Help Center</p>
                  <p className="text-xs text-muted-foreground mt-1">Guides & support</p>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>
      </div>
    </ProtectedRoute>
  );
}