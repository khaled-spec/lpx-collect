import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "LPX Collect - Premium Collectibles Marketplace",
  description: "Discover, buy, and sell rare collectibles from verified vendors. Your trusted marketplace for trading cards, comics, vintage items, and more.",
  keywords: "collectibles, marketplace, trading cards, comics, vintage, rare items, buy, sell",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
