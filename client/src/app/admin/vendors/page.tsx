"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Store, Star, TrendingUp, AlertCircle } from "lucide-react";

export default function VendorsManagement() {
  const vendors = [
    {
      id: 1,
      name: "Pokemon Masters",
      owner: "Jane Smith",
      products: 45,
      sales: 125,
      revenue: 15678.50,
      rating: 4.9,
      status: "verified",
      joined: "2023-12-20",
    },
    {
      id: 2,
      name: "Vintage Comics Co",
      owner: "Mike Johnson",
      products: 32,
      sales: 98,
      revenue: 12450.00,
      rating: 4.8,
      status: "verified",
      joined: "2023-11-15",
    },
    {
      id: 3,
      name: "New Store",
      owner: "Charlie Wilson",
      products: 0,
      sales: 0,
      revenue: 0,
      rating: 0,
      status: "pending",
      joined: "2024-03-01",
    },
  ];

  const stats = {
    totalVendors: 45,
    activeVendors: 38,
    pendingApproval: 5,
    totalRevenue: 125678.90,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vendor Management</h1>
        <p className="text-muted-foreground">Manage marketplace vendors and stores</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVendors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeVendors}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingApproval}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.owner}</TableCell>
                  <TableCell>{vendor.products}</TableCell>
                  <TableCell>{vendor.sales}</TableCell>
                  <TableCell>${vendor.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    {vendor.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm">{vendor.rating}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={vendor.status === "verified" ? "default" : "secondary"}
                    >
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{vendor.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}