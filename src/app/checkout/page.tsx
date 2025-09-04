'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CheckoutProvider, useCheckout } from '@/context/CheckoutContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import ShippingForm from '@/components/checkout/ShippingForm';
import BillingForm from '@/components/checkout/BillingForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderReview from '@/components/checkout/OrderReview';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { productStyles } from '@/components/custom/product-styles';

function CheckoutContent() {
  const router = useRouter();
  const { items } = useCart();
  const { user, isLoading: authLoading } = useAuth();
  const { currentStep, setCurrentStep } = useCheckout();

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && items.length === 0) {
      router.push('/cart');
    }
  }, [items, router, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Will redirect
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'shipping':
        return <ShippingForm />;
      case 'billing':
        return <BillingForm />;
      case 'payment':
        return <PaymentForm />;
      case 'review':
        return <OrderReview />;
      default:
        return <ShippingForm />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'shipping':
        return 'Shipping Information';
      case 'billing':
        return 'Billing Information';
      case 'payment':
        return 'Payment Method';
      case 'review':
        return 'Review & Place Order';
      default:
        return 'Checkout';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList className={productStyles.typography.meta}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-primary transition-colors">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/cart" className="hover:text-primary transition-colors">
                  Cart
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground font-medium">
                  Checkout
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Guest Checkout Notice */}
          {!user && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You're checking out as a guest. 
                <Link href="/login" className="ml-1 text-primary hover:underline">
                  Sign in
                </Link> to save your information for next time.
              </AlertDescription>
            </Alert>
          )}

          {/* Checkout Progress */}
          <CheckoutSteps 
            currentStep={currentStep} 
            onStepClick={setCurrentStep}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">{getStepTitle()}</h2>
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
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}