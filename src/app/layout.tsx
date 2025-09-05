import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { NotificationProvider } from "@/context/NotificationContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "LPX Collect - Premium Collectibles Marketplace",
  description:
    "Discover, buy, and sell rare collectibles from verified vendors. Your trusted marketplace for trading cards, comics, vintage items, and more.",
  keywords:
    "collectibles, marketplace, trading cards, comics, vintage, rare items, buy, sell",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <NotificationProvider>
            <WishlistProvider>
              <CartProvider>{children}</CartProvider>
            </WishlistProvider>
          </NotificationProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
