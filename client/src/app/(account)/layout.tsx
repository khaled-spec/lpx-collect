"use client";

import { CartProvider } from "@/context/CartContext";
import { PaymentMethodsProvider } from "@/context/PaymentMethodsContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <WishlistProvider>
        <PaymentMethodsProvider>{children}</PaymentMethodsProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
