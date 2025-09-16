"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Eye,
  Copy,
  Trash2,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { designTokens } from "@/lib/design-tokens";
import { toast } from "sonner";

const initialVendorProducts: any[] = [];

type ProductStatus = "all" | "active" | "draft" | "sold" | "out_of_stock";

interface ProductStats {
  total: number;
  active: number;
  draft: number;
  sold: number;
  outOfStock: number;
  totalViews: number;
  totalRevenue: number;
}

function ProductStatsCards({ stats }: { stats: ProductStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Products
              </p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Listings
              </p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Views
              </p>
              <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Revenue
              </p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductRow({
  product,
  onEdit,
  onView,
  onDuplicate,
  onDelete
}: {
  product: any;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "sold":
        return <Badge className="bg-blue-100 text-blue-800">Sold</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
          <img
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold truncate">{product.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {product.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{product.category}</span>
                <span>•</span>
                <span>{product.views} views</span>
                <span>•</span>
                <span>{product.wishlistCount} wishlisted</span>
              </div>
            </div>

            {/* Price and Status */}
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-lg">${product.price}</p>
              {getStatusBadge(product.status)}
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  aria-label="Product actions"
                  data-testid={`product-actions-${product.id}`}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onView(product.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(product.id)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(product.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(product.id)}
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
    </div>
  );
}

export default function VendorProductsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState(initialVendorProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialVendorProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus>("all");

  // Calculate stats
  const stats: ProductStats = {
    total: products.length,
    active: products.filter(p => p.status === "active").length,
    draft: products.filter(p => p.status === "draft").length,
    sold: products.filter(p => p.status === "sold").length,
    outOfStock: products.filter(p => p.stock === 0 && p.status === "active").length,
    totalViews: products.reduce((sum, p) => sum + p.views, 0),
    totalRevenue: products.filter(p => p.status === "sold").reduce((sum, p) => sum + p.price, 0),
  };

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "out_of_stock") {
        filtered = filtered.filter(p => p.stock === 0 && p.status === "active");
      } else {
        filtered = filtered.filter(p => p.status === statusFilter);
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [products, statusFilter, searchQuery]);

  const handleEdit = (productId: string) => {
    router.push(`/vendor/products/${productId}/edit`);
  };

  const handleView = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleDuplicate = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const duplicated = {
        ...product,
        id: `${productId}-copy-${Date.now()}`,
        name: `${product.name} (Copy)`,
        status: "draft" as const,
        views: 0,
        wishlistCount: 0,
        dateCreated: new Date(),
        lastUpdated: new Date(),
      };
      setProducts([duplicated, ...products]);
      toast.success("Product duplicated successfully");
    }
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast.success("Product deleted successfully");
  };

  return (
    <ProtectedRoute>
      <PageLayout
        title="My Products"
        description="Manage your product listings and inventory"
        breadcrumbs={[
          { label: "Dashboard", href: "/vendor/dashboard" },
          { label: "Products" },
        ]}
      >
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-9 w-[300px]"
              />
            </div>
          </div>

          <Button asChild>
            <Link href="/vendor/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <ProductStatsCards stats={stats} />

        {/* Product Tabs */}
        <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as ProductStatus)}>
          <TabsList>
            <TabsTrigger value="all">
              All Products {stats.total > 0 && `(${stats.total})`}
            </TabsTrigger>
            <TabsTrigger value="active">
              Active {stats.active > 0 && `(${stats.active})`}
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts {stats.draft > 0 && `(${stats.draft})`}
            </TabsTrigger>
            <TabsTrigger value="sold">
              Sold {stats.sold > 0 && `(${stats.sold})`}
            </TabsTrigger>
            <TabsTrigger value="out_of_stock">
              Out of Stock {stats.outOfStock > 0 && `(${stats.outOfStock})`}
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {/* Products List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <EmptyStates.NoProducts />
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/vendor/products/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Product
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </Tabs>
      </PageLayout>
    </ProtectedRoute>
  );
}