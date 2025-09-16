import React from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { designTokens } from "@/lib/design-tokens";

interface AuthLayoutProps {
  children: React.ReactNode;
  showFooterLinks?: boolean;
}

export function AuthLayout({
  children,
  showFooterLinks = true,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Package className="h-10 w-10 text-primary" />
        <span className={cn(designTokens.typography.h4)}>LPX Collect</span>
      </Link>

      {/* Main Content */}
      {children}

      {/* Footer Links */}
      {showFooterLinks && (
        <div
          className={cn(
            "mt-8 flex gap-4",
            designTokens.fontSize.sm,
            designTokens.colors.text.secondary,
          )}
        >
          <Link href="/terms" className={designTokens.typography.linkSubtle}>
            Terms
          </Link>
          <span>•</span>
          <Link href="/privacy" className={designTokens.typography.linkSubtle}>
            Privacy
          </Link>
          <span>•</span>
          <Link href="/help" className={designTokens.typography.linkSubtle}>
            Help
          </Link>
        </div>
      )}
    </div>
  );
}

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md",
        designTokens.animation.fadeIn,
        className,
      )}
    >
      {children}
    </div>
  );
}

interface AuthFeatureProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export function AuthFeature({ icon, title, description }: AuthFeatureProps) {
  return (
    <div className="flex items-center gap-3 text-left">
      {icon && (
        <div
          className={cn(
            "flex items-center justify-center flex-shrink-0",
            "h-12 w-12 rounded-full",
            designTokens.colors.badge.success
              .replace("text-", "bg-")
              .replace("600", "500/10"),
          )}
        >
          {icon}
        </div>
      )}
      <div>
        <p className="font-medium">{title}</p>
        <p
          className={cn(
            designTokens.fontSize.sm,
            designTokens.colors.text.secondary,
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
