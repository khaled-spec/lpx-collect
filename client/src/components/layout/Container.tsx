"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { designTokens, type ContainerSize } from "@/lib/design-tokens";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  as?: React.ElementType;
  noPadding?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      size = "default",
      as: Component = "div",
      noPadding = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "mx-auto w-full",
          designTokens.container[size],
          !noPadding && "px-4 sm:px-6 lg:px-8",
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
Container.displayName = "Container";

// Section Container with consistent spacing
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: keyof typeof designTokens.spacing.section;
  background?: "default" | "muted" | "primary" | "dark";
  containerSize?: ContainerSize;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      size = "md",
      background = "default",
      containerSize = "default",
      children,
      ...props
    },
    ref,
  ) => {
    const backgroundClasses = {
      default: "",
      muted: "bg-gray-50 dark:bg-gray-800",
      primary: "bg-primary text-primary-foreground",
      dark: "bg-gray-900 text-white dark:bg-gray-950",
    };

    return (
      <section
        ref={ref}
        className={cn(
          designTokens.spacing.section[size],
          backgroundClasses[background],
          className,
        )}
        {...props}
      >
        <Container size={containerSize}>{children}</Container>
      </section>
    );
  },
);
Section.displayName = "Section";

// Grid Layout Component
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: keyof typeof designTokens.grid.cols;
  gap?: keyof typeof designTokens.spacing.gap;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 3, gap = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          designTokens.grid.cols[cols],
          designTokens.spacing.gap[gap],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Grid.displayName = "Grid";

// Flex Layout Component
interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  wrap?: boolean;
  gap?: keyof typeof designTokens.spacing.gap;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      direction = "row",
      justify = "start",
      align = "stretch",
      wrap = false,
      gap = "md",
      children,
      ...props
    },
    ref,
  ) => {
    const directionClasses = {
      row: "flex-row",
      col: "flex-col",
      "row-reverse": "flex-row-reverse",
      "col-reverse": "flex-col-reverse",
    };

    const justifyClasses = {
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    const alignClasses = {
      start: "items-start",
      end: "items-end",
      center: "items-center",
      baseline: "items-baseline",
      stretch: "items-stretch",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directionClasses[direction],
          justifyClasses[justify],
          alignClasses[align],
          wrap && "flex-wrap",
          designTokens.spacing.gap[gap],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Flex.displayName = "Flex";

// Stack Component (vertical flex with gap)
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: keyof typeof designTokens.spacing.gap;
  align?: "start" | "end" | "center" | "stretch";
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap = "md", align = "stretch", children, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction="col"
        align={align}
        gap={gap}
        className={className}
        {...props}
      >
        {children}
      </Flex>
    );
  },
);
Stack.displayName = "Stack";

// Center Component
interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: ContainerSize;
}

export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, maxWidth, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center",
          maxWidth && designTokens.container[maxWidth],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Center.displayName = "Center";
