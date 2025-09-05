"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Container } from "@/components/layout/Container";
import { PaymentMethodCard } from "@/components/PaymentMethodCard";
import { AddPaymentMethodForm } from "@/components/AddPaymentMethodForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  Plus, 
  CreditCard, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Info,
  Wallet
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePaymentMethods } from "@/context/PaymentMethodsContext";
import { toast } from "sonner";

export default function PaymentMethodsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const {
    paymentMethods,
    isLoading,
    error,
    addMethod,
    deleteMethod,
    setDefaultMethod,
    refreshMethods,
  } = usePaymentMethods();

  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/payment-methods");
    }
  }, [user, authLoading, router]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAddMethod = async (method: any) => {
    try {
      await addMethod(method);
      setShowAddForm(false);
      setSuccessMessage("Payment method added successfully!");
      toast.success("Payment method added successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add payment method");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultMethod(id);
      toast.success("Default payment method updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update default payment method");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMethod(id);
      toast.success("Payment method removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete payment method");
    }
  };

  if (authLoading || !user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-8">
          <Container>
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-96" />
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <Container>
          <div className="py-8 space-y-8">
            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/settings">Account Settings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Payment Methods</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your payment methods for faster checkout
                </p>
              </div>
              {paymentMethods.length > 0 && (
                <Button onClick={() => setShowAddForm(true)} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Payment Method
                </Button>
              )}
            </div>

            {/* Success Message */}
            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Security Notice */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your payment information is encrypted and secure. We comply with PCI-DSS standards
                to ensure your financial data is protected.
              </AlertDescription>
            </Alert>

            {/* Payment Methods List */}
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : paymentMethods.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <Wallet className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">No payment methods</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Add a payment method to make checkout faster and easier
                    </p>
                  </div>
                  <Button onClick={() => setShowAddForm(true)} size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Payment Method
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    paymentMethod={method}
                    onSetDefault={handleSetDefault}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            <Separator className="my-8" />

            {/* Additional Information */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Secure Payments</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        All transactions are encrypted and processed securely
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Multiple Options</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Support for cards, PayPal, crypto, and bank transfers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Info className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">PCI Compliant</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        We meet the highest security standards in the industry
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQs */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Is my payment information secure?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes, all payment information is encrypted using industry-standard SSL technology.
                      We are PCI-DSS compliant and never store your full card details on our servers.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Can I use multiple payment methods?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can add multiple payment methods to your account. During checkout,
                      you can choose which payment method to use for each purchase.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">How do I update my billing address?</h3>
                    <p className="text-sm text-muted-foreground">
                      For credit/debit cards, you'll need to delete the existing card and add it again
                      with the new billing address. Your card number and other details will need to be re-entered.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                    <p className="text-sm text-muted-foreground">
                      We accept major credit cards (Visa, Mastercard, American Express), PayPal,
                      select cryptocurrencies (Bitcoin, Ethereum, USDC), and ACH bank transfers.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Choose a payment method to add to your account
            </DialogDescription>
          </DialogHeader>
          <AddPaymentMethodForm
            onAdd={handleAddMethod}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}