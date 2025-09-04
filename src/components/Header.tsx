'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/custom/button-variants';
import { SearchInput } from '@/components/custom/input-variants';
import { Badge } from '@/components/ui/badge';
import { CategoryBadge } from '@/components/custom/badge-variants';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Package, 
  Heart,
  Bell,
  LogIn
} from 'lucide-react';

const categories = [
  { name: 'Trading Cards', slug: 'trading-cards' },
  { name: 'Comics', slug: 'comics' },
  { name: 'Coins', slug: 'coins' },
  { name: 'Stamps', slug: 'stamps' },
  { name: 'Vintage Toys', slug: 'vintage-toys' },
  { name: 'Sports Memorabilia', slug: 'sports-memorabilia' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cartCount] = useState(3);
  const [isLoggedIn] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 text-sm">
        <div className="container flex justify-between items-center">
          <span>Free shipping on orders over $100</span>
          <div className="flex gap-4">
            <Link href="/sell" className="hover:underline">Become a Vendor</Link>
            <Link href="/help" className="hover:underline">Help Center</Link>
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
                    {['Pokemon Cards', 'Marvel Comics', 'Vintage Coins'].map((term) => (
                      <CategoryBadge key={term} className="cursor-pointer hover:bg-primary hover:text-white">
                        {term}
                      </CategoryBadge>
                    ))}
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
                                <div className="text-sm font-medium leading-none">{category.name}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Browse our collection of {category.name.toLowerCase()}
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
              <Link href="/browse" className="text-gray-700 dark:text-gray-300 hover:text-primary transition">
                Browse
              </Link>
              <Link href="/vendors" className="text-gray-700 dark:text-gray-300 hover:text-primary transition">
                Vendors
              </Link>
              {isLoggedIn ? (
                <>
                  <IconButton>
                    <Heart className="h-5 w-5" />
                  </IconButton>
                  <IconButton>
                    <Bell className="h-5 w-5" />
                  </IconButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <IconButton>
                        <User className="h-5 w-5" />
                      </IconButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders">My Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button variant="ghost" asChild>
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                </Button>
              )}
            </nav>

            {/* Cart */}
            <IconButton asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {cartCount}
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
                    <SearchInput
                      placeholder="Search..."
                      className="w-full"
                    />
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
                    <Link href="/browse" className="py-2 hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
                      Browse All
                    </Link>
                    <Link href="/vendors" className="py-2 hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
                      Vendors
                    </Link>
                    {!isLoggedIn && (
                      <Link href="/login" className="py-2 hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
                        Login / Sign Up
                      </Link>
                    )}
                    {isLoggedIn && (
                      <>
                        <Link href="/dashboard" className="py-2 hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
                          My Dashboard
                        </Link>
                        <Link href="/favorites" className="py-2 hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
                          Favorites
                        </Link>
                        <Link href="/notifications" className="py-2 hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
                          Notifications
                        </Link>
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