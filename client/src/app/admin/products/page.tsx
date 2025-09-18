"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VendorStyleFilterBar } from "@/components/browse/VendorStyleFilterBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewMode, SortOption } from "@/lib/browse-utils";
import {
  Search,
  MoreHorizontal,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Download,
} from "lucide-react";

export default function ProductsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Mock data
  const products = [
    {
      id: 1,
      name: "Charizard Base Set",
      category: "Pokemon Cards",
      vendor: "Pokemon Masters",
      price: 299.99,
      stock: 5,
      status: "active",
      listed: "2024-01-15",
      sales: 12,
    },
    {
      id: 2,
      name: "Amazing Spider-Man #1",
      category: "Comics",
      vendor: "Vintage Comics Co",
      price: 599.99,
      stock: 2,
      status: "active",
      listed: "2024-01-10",
      sales: 3,
    },
    {
      id: 3,
      name: "Michael Jordan Rookie Card",
      category: "Sports Cards",
      vendor: "Sports Cards Hub",
      price: 1299.99,
      stock: 1,
      status: "pending",
      listed: "2024-03-01",
      sales: 0,
    },
    {
      id: 4,
      name: "Suspicious Item",
      category: "Unknown",
      vendor: "New Vendor",
      price: 9.99,
      stock: 100,
      status: "flagged",
      listed: "2024-03-05",
      sales: 0,
      flagReason: "Possible counterfeit",
    },
  ];

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    pending: products.filter((p) => p.status === "pending").length,
    flagged: products.filter((p) => p.status === "flagged").length,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { variant: "default", icon: CheckCircle },
      pending: { variant: "secondary", icon: AlertTriangle },
      flagged: { variant: "destructive", icon: XCircle },
    };
    const config = variants[status] || variants.active;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">
            Review and manage marketplace listings
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Flagged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.flagged}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>All Products</CardTitle>
          </div>
          <VendorStyleFilterBar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            activeFilterCount={searchQuery ? 1 : 0}
            activeFilters={searchQuery ? [{ type: "search", value: searchQuery, label: `Search: ${searchQuery}` }] : []}
            onRemoveFilter={(type) => {
              if (type === "search") setSearchQuery("");
            }}
            onClearAllFilters={() => setSearchQuery("")}
            className="w-full"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.vendor}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>{product.sales}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        {product.status === "pending" && (
                          <>
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}