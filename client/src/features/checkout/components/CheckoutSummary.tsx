"use client";

import { CreditCard, Shield, Truck } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";

export default function CheckoutSummary() {
  const { items, subtotal, shipping, tax, discount, total, couponCode } =
    useCart();

  return (
    <div className="space-y-4">
      {/* Order Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.product.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {couponCode && discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount ({couponCode})</span>
                <span className="text-green-600">-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <Badge variant="secondary" className="text-xs">
                    FREE
                  </Badge>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-xl text-primary">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Free Shipping Notice */}
          {shipping > 0 && subtotal < 100 && (
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Add ${(100 - subtotal).toFixed(2)} more for free shipping!
              </p>
              <div className="mt-2 w-full bg-blue-100 dark:bg-blue-900 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Badges */}
      <Card>
        <CardContent className="py-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Fast & Reliable Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CreditCard className="h-4 w-4 text-purple-600" />
              <span>Multiple Payment Options</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Need help? Contact our{" "}
          <a href="/help" className="text-primary hover:underline">
            customer support
          </a>
        </p>
      </div>
    </div>
  );
}
