"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<typeof Input>;

// Search Input
export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type="text"
          className={cn("pl-10 pr-4", className)}
          {...props}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";

// Form Input
export const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(
          "focus:ring-2 focus:ring-primary focus:ring-offset-2",
          className,
        )}
        {...props}
      />
    );
  },
);
FormInput.displayName = "FormInput";

// Price Input
export const PriceInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          $
        </span>
        <Input
          ref={ref}
          type="number"
          className={cn("pl-8", className)}
          {...props}
        />
      </div>
    );
  },
);
PriceInput.displayName = "PriceInput";

// Filter Input
export const FilterInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input ref={ref} className={cn("h-9 text-sm", className)} {...props} />
    );
  },
);
FilterInput.displayName = "FilterInput";
