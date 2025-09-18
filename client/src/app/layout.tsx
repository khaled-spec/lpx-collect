import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { PaymentMethodsProvider } from "@/context/PaymentMethodsContext";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/theme-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Script src="/noflash.js" strategy="beforeInteractive" />
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <WishlistProvider>
                <PaymentMethodsProvider>
                  <CartProvider>
                    {children}
                    <Toaster />
                  </CartProvider>
                </PaymentMethodsProvider>
              </WishlistProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
