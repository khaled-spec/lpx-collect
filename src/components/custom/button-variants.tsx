'use client';

import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { designTokens, type ButtonSize } from "@/lib/design-tokens";

// Primary CTA Button
export const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="default"
        className={cn(
          "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200",
          className
        )}
        {...props}
      />
    );
  }
);
PrimaryButton.displayName = "PrimaryButton";

// Secondary Button
export const SecondaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="secondary"
        className={cn(
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
SecondaryButton.displayName = "SecondaryButton";

// Icon Button with Tooltip support
export const IconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";

// Cart Button
export const CartButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="default"
        size="icon"
        className={cn(
          "bg-primary hover:bg-primary/90 rounded-lg h-8 w-8",
          className
        )}
        {...props}
      />
    );
  }
);
CartButton.displayName = "CartButton";

// CTA Link Button
export const CTALinkButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="link"
        className={cn(
          "text-primary hover:text-primary/80 font-semibold p-0 h-auto",
          className
        )}
        {...props}
      />
    );
  }
);
CTALinkButton.displayName = "CTALinkButton";

// Outline Button
export const OutlineButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={cn(
          "border-2 hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
OutlineButton.displayName = "OutlineButton";