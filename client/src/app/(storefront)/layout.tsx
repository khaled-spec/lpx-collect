"use client";

import { CartProvider } from "@/context/CartContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import { PaymentMethodsProvider } from "@/context/PaymentMethodsContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PaymentMethodsProvider>
      <WishlistProvider>
        <CartProvider>
          <CheckoutProvider>{children}</CheckoutProvider>
        </CartProvider>
      </WishlistProvider>
    </PaymentMethodsProvider>
  );
}
