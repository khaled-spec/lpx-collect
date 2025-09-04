'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import PromoCode from '@/components/cart/PromoCode';
import RecentlyViewed from '@/components/cart/RecentlyViewed';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingCart, 
  Package,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { productStyles } from '@/components/custom/product-styles';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const { 
    items, 
    itemCount,
    subtotal, 
    shipping, 
    tax, 
    total,
    discount,
    couponCode,
    updateQuantity, 
    removeFromCart,
    clearCart,
    applyCoupon
  } = useCart();

  // Remove coupon function
  const removeCoupon = () => {
    // Reset discount by applying an invalid code
    applyCoupon('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-card rounded-xl border border-border shadow-lg p-8">
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList className={productStyles.typography.meta}>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="hover:text-primary transition-colors">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium">Shopping Cart</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

        {/* Page Title */}
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
            <p className={cn(productStyles.typography.meta, "text-base font-medium")}>
              {itemCount === 0 
                ? "Your cart is empty" 
                : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`}
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/30 transition-all"
              size="sm"
            >
              Clear Cart
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-8 shadow-sm">
              <ShoppingCart className={cn(productStyles.actions.icon.lg, "h-10 w-10 text-muted-foreground")} />
            </div>
            <div className="space-y-4 mb-10">
              <h2 className="text-2xl font-bold tracking-tight">Your cart is empty</h2>
              <p className={cn(productStyles.typography.meta, "text-base leading-relaxed max-w-lg mx-auto")}>
                Looks like you haven't added any items to your cart yet. 
                Start exploring our collection of rare and valuable collectibles!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button asChild size="lg" className="flex-1 sm:flex-none">
                <Link href="/browse">
                  <Package className={cn(productStyles.forms.icon.md, "mr-2")} />
                  Browse Collection
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none">
                <Link href="/vendors">
                  <Sparkles className={cn(productStyles.forms.icon.md, "mr-2")} />
                  Explore Vendors
                </Link>
              </Button>
            </div>

            {/* Suggestions for Empty Cart */}
            <div className="mt-16">
              <Card className="border-dashed border-2 bg-background/50">
                <CardContent className="py-8">
                  <h3 className="font-semibold text-lg mb-6 flex items-center justify-center gap-2 tracking-tight">
                    <TrendingUp className={cn(productStyles.forms.icon.md)} />
                    Popular Categories
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {['Trading Cards', 'Comics', 'Coins', 'Vintage Toys'].map((cat) => (
                      <Link key={cat} href={`/category/${cat.toLowerCase().replace(' ', '-')}`}>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {cat}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>

              {/* Promo Code Section */}
              <div className="pt-4 border-t border-border">
                <PromoCode 
                  onApply={applyCoupon}
                  currentCode={couponCode}
                  onRemove={removeCoupon}
                />
              </div>

              {/* Recently Viewed - Desktop */}
              <div className="hidden lg:block pt-4 border-t border-border">
                <RecentlyViewed />
              </div>
            </div>

            {/* Summary Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="sticky top-24">
                <CartSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                  discount={discount}
                  itemCount={itemCount}
                  couponCode={couponCode}
                />
              </div>

              {/* Recently Viewed - Mobile */}
              <div className="lg:hidden pt-4 border-t border-border">
                <RecentlyViewed />
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}