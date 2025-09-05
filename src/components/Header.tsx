"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/custom/button-variants";
import { SearchInput } from "@/components/custom/input-variants";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/custom/badge-variants";
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
import {
  Search,
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
} from "lucide-react";

const categories = [
  { name: "Trading Cards", slug: "trading-cards" },
  { name: "Comics", slug: "comics" },
  { name: "Coins", slug: "coins" },
  { name: "Stamps", slug: "stamps" },
  { name: "Vintage Toys", slug: "vintage-toys" },
  { name: "Sports Memorabilia", slug: "sports-memorabilia" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 text-sm">
        <div className="container flex justify-between items-center">
          <span>Free shipping on orders over $100</span>
          <div className="flex gap-4">
            <Link href="/sell" className="hover:underline">
              Become a Vendor
            </Link>
            <Link href="/help" className="hover:underline">
              Help Center
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">LPX Collect</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <SearchInput
                placeholder="Search for collectibles..."
                className="w-full"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              {isSearchFocused && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border p-4">
                  <p className="text-sm text-gray-500">Popular searches:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Pokemon Cards", "Marvel Comics", "Vintage Coins"].map(
                      (term) => (
                        <CategoryBadge
                          key={term}
                          className="cursor-pointer hover:bg-primary hover:text-white"
                        >
                          {term}
                        </CategoryBadge>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {/* Categories Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-700 dark:text-gray-300 hover:text-primary transition">
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
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition"
              >
                Browse
              </Link>
              <Link
                href="/vendors"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition"
              >
                Vendors
              </Link>
              {/* Wishlist - Available for all users */}
              <IconButton asChild className="relative">
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>
              </IconButton>
              {isAuthenticated ? (
                <>
                  <IconButton asChild>
                    <Link href="/notifications">
                      <Bell className="h-5 w-5" />
                    </Link>
                  </IconButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
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
                      <DropdownMenuItem
                        onClick={logout}
                        className="cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>

            {/* Cart */}
            <IconButton asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </IconButton>

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
                  {/* Mobile Search */}
                  <div className="mb-4">
                    <SearchInput placeholder="Search..." className="w-full" />
                  </div>

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
                    {!isAuthenticated && (
                      <>
                        <Link
                          href="/login"
                          className="py-2 hover:text-primary transition"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          href="/register"
                          className="py-2 hover:text-primary transition"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                    {isAuthenticated && (
                      <>
                        <Separator className="my-2" />
                        <div className="flex items-center gap-3 py-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.avatar} alt={user?.name} />
                            <AvatarFallback>
                              {user?.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user?.email}
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
                        <Separator className="my-2" />
                        <button
                          onClick={() => {
                            logout();
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
