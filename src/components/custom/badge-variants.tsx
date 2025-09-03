'use client';

import * as React from "react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Status Badge
export const StatusBadge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        className={cn(
          "font-medium",
          className
        )}
        {...props}
      />
    );
  }
);
StatusBadge.displayName = "StatusBadge";

// Featured Badge
export const FeaturedBadge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant="default"
        className={cn(
          "bg-primary text-primary-foreground font-semibold",
          className
        )}
        {...props}
      />
    );
  }
);
FeaturedBadge.displayName = "FeaturedBadge";

// Discount Badge
export const DiscountBadge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant="destructive"
        className={cn(
          "font-bold",
          className
        )}
        {...props}
      />
    );
  }
);
DiscountBadge.displayName = "DiscountBadge";

// Stock Badge
export const StockBadge = React.forwardRef<HTMLDivElement, BadgeProps & { stock: number }>(
  ({ className, stock, ...props }, ref) => {
    const variant = stock === 0 ? "destructive" : stock <= 5 ? "outline" : "secondary";
    const text = stock === 0 ? "Out of stock" : stock <= 5 ? `Only ${stock} left` : "In stock";
    
    return (
      <Badge
        ref={ref}
        variant={variant}
        className={cn(
          stock <= 5 && stock > 0 && "text-orange-600 border-orange-600",
          className
        )}
        {...props}
      >
        {text}
      </Badge>
    );
  }
);
StockBadge.displayName = "StockBadge";

// Verified Badge
export const VerifiedBadge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant="secondary"
        className={cn(
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
          className
        )}
        {...props}
      >
        ✓ Verified
      </Badge>
    );
  }
);
VerifiedBadge.displayName = "VerifiedBadge";

// Category Badge
export const CategoryBadge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant="outline"
        className={cn(
          "text-xs",
          className
        )}
        {...props}
      />
    );
  }
);
CategoryBadge.displayName = "CategoryBadge";

// New Badge
export const NewBadge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        className={cn(
          "bg-green-500 text-white hover:bg-green-600",
          className
        )}
        {...props}
      >
        NEW
      </Badge>
    );
  }
);
NewBadge.displayName = "NewBadge";