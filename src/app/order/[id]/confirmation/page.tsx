"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/custom/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  Download,
  Share2,
  Printer,
  ArrowRight,
  Calendar,
  MapPin,
  CreditCard,
  Copy,
} from "lucide-react";
import { Order } from "@/types/checkout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch order from localStorage
    const orders = JSON.parse(localStorage.getItem("lpx-orders") || "[]");
    const foundOrder = orders.find((o: Order) => o.id === orderId);

    if (foundOrder) {
      setOrder(foundOrder);
    }
    setIsLoading(false);
  }, [orderId]);

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      toast.success("Order number copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const printOrder = () => {
    window.print();
  };

  const shareOrder = () => {
    if (navigator.share && order) {
      navigator.share({
        title: `Order ${order.orderNumber}`,
        text: `I just placed an order on LPX Collect! Order ${order.orderNumber}`,
        url: window.location.href,
      });
    } else {
      copyOrderNumber();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find an order with this ID.
            </p>
            <PrimaryButton asChild>
              <Link href="/">Return to Home</Link>
            </PrimaryButton>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground mb-4">
              Thank you for your purchase. Your order has been received and is
              being processed.
            </p>

            {/* Order Number */}
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border">
              <span className="text-sm text-muted-foreground">
                Order Number:
              </span>
              <span className="font-mono font-bold">{order.orderNumber}</span>
              <button
                onClick={copyOrderNumber}
                className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Copy order number"
              >
                <Copy
                  className={cn(
                    "h-4 w-4",
                    copied ? "text-green-600" : "text-muted-foreground",
                  )}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <SecondaryButton onClick={printOrder} size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </SecondaryButton>
            <SecondaryButton onClick={shareOrder} size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </SecondaryButton>
            <SecondaryButton size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </SecondaryButton>
          </div>

          {/* Email Confirmation Notice */}
          <Alert className="mb-8">
            <Mail className="h-4 w-4" />
            <AlertDescription>
              A confirmation email has been sent to{" "}
              <strong>{order.shippingAddress.email}</strong> with your order
              details and tracking information.
            </AlertDescription>
          </Alert>

          {/* Order Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Estimated Delivery
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">
                      {new Date(order.estimatedDelivery).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Shipping Address
                  </p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {order.shippingAddress.firstName}{" "}
                        {order.shippingAddress.lastName}
                      </p>
                      <p>{order.shippingAddress.address}</p>
                      {order.shippingAddress.address2 && (
                        <p>{order.shippingAddress.address2}</p>
                      )}
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Payment Method
                  </p>
                  <p className="font-medium">
                    {order.paymentMethod.type === "card" &&
                    order.paymentMethod.cardNumber
                      ? `Card ending in ${order.paymentMethod.cardNumber.slice(-4)}`
                      : order.paymentMethod.type === "paypal"
                        ? "PayPal"
                        : "Unknown"}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Billing Address
                  </p>
                  <div className="text-sm">
                    <p className="font-medium">
                      {order.billingAddress.firstName}{" "}
                      {order.billingAddress.lastName}
                    </p>
                    <p>{order.billingAddress.address}</p>
                    {order.billingAddress.address2 && (
                      <p>{order.billingAddress.address2}</p>
                    )}
                    <p>
                      {order.billingAddress.city}, {order.billingAddress.state}{" "}
                      {order.billingAddress.postalCode}
                    </p>
                    <p>{order.billingAddress.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Sold by {item.vendor}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {order.shipping === 0
                      ? "FREE"
                      : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Order Processing</p>
                  <p className="text-sm text-muted-foreground">
                    Your order is being prepared by our vendors
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Shipping Notification</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive tracking information once your order ships
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Your package will arrive by{" "}
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Continue Shopping */}
          <div className="text-center mt-8">
            <PrimaryButton asChild size="lg">
              <Link href="/browse">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </PrimaryButton>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
