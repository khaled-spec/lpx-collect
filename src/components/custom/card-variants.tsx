'use client';

import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Product Display Card
export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "overflow-hidden border border-border shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);
ProductCard.displayName = "ProductCard";

// Feature Card
export const FeatureCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "border-none shadow-none bg-transparent",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);
FeatureCard.displayName = "FeatureCard";

// Vendor Card
export const VendorCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "hover:shadow-lg transition-all duration-200 hover:border-primary",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);
VendorCard.displayName = "VendorCard";

// Category Card
export const CategoryCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "p-6 text-center hover:shadow-lg transition group-hover:border-primary cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);
CategoryCard.displayName = "CategoryCard";

// Stats Card
export const StatsCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "border-0 shadow-sm bg-gradient-to-br from-background to-muted/20",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);
StatsCard.displayName = "StatsCard";