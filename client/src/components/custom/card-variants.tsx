"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardVariantProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Feature Card - Enhanced with design system
export const FeatureCard = React.forwardRef<HTMLDivElement, CardVariantProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "card card-feature border-none shadow-none bg-transparent animate-fadeInUp",
          className,
        )}
        {...props}
      >
        {children}
      </Card>
    );
  },
);
FeatureCard.displayName = "FeatureCard";

// Vendor Card - Enhanced with design system
export const VendorCard = React.forwardRef<HTMLDivElement, CardVariantProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "card card-interactive hover-lift animate-fadeInUp",
          className,
        )}
        {...props}
      >
        {children}
      </Card>
    );
  },
);
VendorCard.displayName = "VendorCard";

// Category Card - Enhanced with design system
export const CategoryCard = React.forwardRef<HTMLDivElement, CardVariantProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "card card-interactive p-6 text-center cursor-pointer hover-lift animate-fadeInUp",
          className,
        )}
        {...props}
      >
        {children}
      </Card>
    );
  },
);
CategoryCard.displayName = "CategoryCard";

// Stats Card - Enhanced with design system
export const StatsCard = React.forwardRef<HTMLDivElement, CardVariantProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "card card-stat border-0 shadow-sm bg-gradient-to-br from-background to-muted/20 animate-fadeInUp",
          className,
        )}
        {...props}
      >
        {children}
      </Card>
    );
  },
);
StatsCard.displayName = "StatsCard";
