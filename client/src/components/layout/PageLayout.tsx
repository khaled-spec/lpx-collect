"use client";

import React, { ReactNode, Fragment } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { designTokens } from "@/lib/design-tokens";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  containerClassName?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  fullWidth?: boolean;
  withCard?: boolean;
}

export default function PageLayout({
  children,
  title,
  description,
  breadcrumbs = [],
  className,
  containerClassName,
  showHeader = true,
  showFooter = true,
  fullWidth = false,
  withCard = true,
}: PageLayoutProps) {
  const allBreadcrumbs =
    breadcrumbs.length > 0
      ? [{ label: "Home", href: "/" }, ...breadcrumbs]
      : [];

  return (
    <div className={cn("min-h-screen flex flex-col bg-background", className)}>
      {showHeader && <Header />}

      <main className="flex-grow">
        <div
          className={cn(
            "mx-auto px-6 py-8",
            !fullWidth && "max-w-7xl",
            containerClassName,
          )}
        >
          {withCard ? (
            <div className="bg-card rounded-xl border border-border shadow-lg p-8">
              {/* Breadcrumbs */}
              {allBreadcrumbs.length > 0 && (
                <Breadcrumb className="mb-8">
                  <BreadcrumbList>
                    {allBreadcrumbs.map((crumb, index) => (
                      <Fragment key={index}>
                        <BreadcrumbItem>
                          {index < allBreadcrumbs.length - 1 ? (
                            <BreadcrumbLink
                              href={crumb.href || "#"}
                              className="hover:text-primary transition-colors"
                            >
                              {crumb.label}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage className="text-foreground font-medium">
                              {crumb.label}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        {index < allBreadcrumbs.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              )}

              {/* Page Header */}
              {(title || description) && (
                <div className="mb-8">
                  {title && (
                    <h1 className={cn(designTokens.typography.h1, "mb-2")}>
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>
              )}

              {/* Page Content */}
              {children}
            </div>
          ) : (
            <>
              {/* Breadcrumbs for non-card layout */}
              {allBreadcrumbs.length > 0 && (
                <Breadcrumb className="mb-8">
                  <BreadcrumbList>
                    {allBreadcrumbs.map((crumb, index) => (
                      <Fragment key={index}>
                        <BreadcrumbItem>
                          {index < allBreadcrumbs.length - 1 ? (
                            <BreadcrumbLink
                              href={crumb.href || "#"}
                              className="hover:text-primary transition-colors"
                            >
                              {crumb.label}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage className="text-foreground font-medium">
                              {crumb.label}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        {index < allBreadcrumbs.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              )}

              {/* Page Header for non-card layout */}
              {(title || description) && (
                <div className="mb-8">
                  {title && (
                    <h1 className={cn(designTokens.typography.h1, "mb-2")}>
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>
              )}

              {/* Page Content */}
              {children}
            </>
          )}
        </div>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

// Export a simplified version for special pages
export function SimplePageLayout({
  children,
  className,
  containerClassName,
  showHeader = true,
  showFooter = true,
  fullWidth = false,
}: Omit<
  PageLayoutProps,
  "title" | "description" | "breadcrumbs" | "withCard"
>) {
  return (
    <div className={cn("min-h-screen flex flex-col bg-background", className)}>
      {showHeader && <Header />}

      <main className="flex-grow">
        <div
          className={cn(
            "mx-auto px-6 py-8",
            !fullWidth && "max-w-7xl",
            containerClassName,
          )}
        >
          {children}
        </div>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
