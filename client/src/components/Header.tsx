"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useNotifications } from "@/context/NotificationContext";
import { getNavigationCategories } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/custom/button-variants";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { designTokens } from "@/lib/design-tokens";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Package,
  Heart,
  Bell,
  LogIn,
  LogOut,
  Settings,
  Store,
  ShoppingBag,
  CreditCard,
  Shield,
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<
    { name: string; slug: string; productCount?: number }[]
  >([]);
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    // Load categories on mount
    getNavigationCategories().then(setCategories);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border w-full">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">LPX Collect</span>
          </Link>

          {/* Professional Tagline */}
          <div className="hidden md:flex items-center">
            <span className="text-sm text-muted-foreground">
              Your Trusted Marketplace for Rare Collectibles
            </span>
          </div>

          {/* Navigation and Icons */}
          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 header-auth-section">
              {/* Categories Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        "transition",
                        designTokens.colors.text.secondary,
                        "hover:text-primary",
                      )}
                    >
                      Categories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                        {categories.map((category) => (
                          <li key={category.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={`/category/${category.slug}`}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {category.name}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Browse our collection of{" "}
                                  {category.name.toLowerCase()}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <Link
                href="/browse"
                className={cn(
                  "transition",
                  designTokens.colors.text.secondary,
                  "hover:text-primary",
                )}
              >
                Browse
              </Link>
              <Link
                href="/vendors"
                className={cn(
                  "transition",
                  designTokens.colors.text.secondary,
                  "hover:text-primary",
                )}
              >
                Vendors
              </Link>
              {/* Cart */}
              <IconButton asChild className="relative">
                <Link href="/cart">
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                      variant="destructive"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Link>
              </IconButton>
              {/* Wishlist - Available for all users */}
              <IconButton asChild className="relative">
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                      variant="destructive"
                    >
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>
              </IconButton>
              {/* Notifications - Show for all, but only with badge when authenticated */}
              <IconButton asChild className="relative">
                <Link href="/notifications">
                  <Bell className="h-5 w-5" />
                  {isSignedIn && unreadCount > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                      variant="destructive"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Link>
              </IconButton>
              {/* Show loading placeholder during initial auth check */}
              <div className="auth-button-group">
                {!isLoaded ? (
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                ) : isSignedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.imageUrl} alt={user?.firstName || "User"} />
                          <AvatarFallback>
                            {user?.firstName?.charAt(0).toUpperCase() || user?.emailAddresses?.[0]?.emailAddress?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.fullName || user?.firstName || "User"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      {user?.role === "vendor" && (
                        <DropdownMenuItem asChild>
                          <Link
                            href="/vendor/dashboard"
                            className="cursor-pointer"
                          >
                            <Store className="mr-2 h-4 w-4" />
                            Vendor Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {user?.role === "admin" && (
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin"
                            className="cursor-pointer"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href="/orders" className="cursor-pointer">
                          <Package className="mr-2 h-4 w-4" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/wishlist" className="cursor-pointer">
                          <Heart className="mr-2 h-4 w-4" />
                          Wishlist
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/sell" className="cursor-pointer">
                          <Store className="mr-2 h-4 w-4" />
                          Become a Seller
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" className="flex items-center gap-2">
                      <Link href="/sign-in">
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/sign-up">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu Toggle */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <IconButton className="md:hidden">
                  <Menu className="h-6 w-6" />
                </IconButton>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-3">
                    <p className="text-sm font-semibold mb-2">Categories</p>
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        className="block py-2 text-sm hover:text-primary transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                    <Separator className="my-2" />
                    <Link
                      href="/browse"
                      className="py-2 hover:text-primary transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Browse All
                    </Link>
                    <Link
                      href="/vendors"
                      className="py-2 hover:text-primary transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Vendors
                    </Link>
                    {isLoaded && !isSignedIn && (
                      <>
                        <Link
                          href="/sign-in"
                          className="py-2 hover:text-primary transition"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/sign-up"
                          className="py-2 hover:text-primary transition"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                    {isLoaded && isSignedIn && (
                      <>
                        <Separator className="my-2" />
                        <div className="flex items-center gap-3 py-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.imageUrl} alt={user?.firstName || "User"} />
                            <AvatarFallback>
                              {user?.firstName?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user?.fullName || user?.firstName || "User"}</p>
                            <p className="text-xs text-muted-foreground">
                              {user?.primaryEmailAddress?.emailAddress}
                            </p>
                          </div>
                        </div>
                        <Separator className="my-2" />
                        <Link
                          href="/dashboard"
                          className="py-2 hover:text-primary transition"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Dashboard
                        </Link>
                        <Link
                          href="/orders"
                          className="py-2 hover:text-primary transition"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="py-2 hover:text-primary transition"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Wishlist
                        </Link>
                        <Link
                          href="/notifications"
                          className="py-2 hover:text-primary transition"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Notifications
                        </Link>
                        <Link
                          href="/settings"
                          className="py-2 hover:text-primary transition"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Settings
                        </Link>
                        {user?.role !== "vendor" && (
                          <Link
                            href="/sell"
                            className="py-2 hover:text-primary transition"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Become a Seller
                          </Link>
                        )}
                        <Separator className="my-2" />
                        <button
                          onClick={() => {
                            signOut();
                            setIsMenuOpen(false);
                          }}
                          className="py-2 text-left hover:text-primary transition w-full"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
