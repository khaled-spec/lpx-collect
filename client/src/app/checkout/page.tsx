"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CheckoutProvider, useCheckout } from "@/context/CheckoutContext";
import PageLayout from "@/components/layout/PageLayout";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import ShippingForm from "@/components/checkout/ShippingForm";
import BillingForm from "@/components/checkout/BillingForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderReview from "@/components/checkout/OrderReview";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { designTokens } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

function CheckoutContent() {
  const router = useRouter();
  const { items } = useCart();
  const authLoading = false; // No auth loading in frontend-only app
  const { currentStep, setCurrentStep } = useCheckout();

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && items.length === 0) {
      router.push("/cart");
    }
  }, [items, router, authLoading]);

  if (authLoading) {
    return (
      <PageLayout title="Loading..." showHeader={true} showFooter={true}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  if (items.length === 0) {
    return (
      <PageLayout title="Checkout" showHeader={true} showFooter={true}>
        <div className="text-center py-12">
          <h1 className={cn(designTokens.typography.h3, "mb-4")}>
            Your cart is empty
          </h1>
          <Link href="/browse" className="text-primary hover:underline">
            Continue Shopping
          </Link>
        </div>
      </PageLayout>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "shipping":
        return <ShippingForm />;
      case "billing":
        return <BillingForm />;
      case "payment":
        return <PaymentForm />;
      case "review":
        return <OrderReview />;
      default:
        return <ShippingForm />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "shipping":
        return "Shipping Information";
      case "billing":
        return "Billing Information";
      case "payment":
        return "Payment Method";
      case "review":
        return "Review & Place Order";
      default:
        return "Checkout";
    }
  };

  const breadcrumbs = [{ label: "Cart", href: "/cart" }, { label: "Checkout" }];

  return (
    <PageLayout
      title="Checkout"
      breadcrumbs={breadcrumbs}
      showHeader={true}
      showFooter={true}
      withCard={false}
    >
      <div className="max-w-7xl mx-auto">
        {/* Guest Checkout Notice */}
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You're checking out as a guest.
            <Link href="/sign-in" className="ml-1 text-primary hover:underline">
              Sign in
            </Link>{" "}
            to save your information for next time.
          </AlertDescription>
        </Alert>

        {/* Checkout Progress */}
        <CheckoutSteps currentStep={currentStep} onStepClick={setCurrentStep} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className={cn(designTokens.typography.h3, "mb-6")}>
                  {getStepTitle()}
                </h2>
                {renderStepContent()}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CheckoutSummary />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}
