"use client";

import { AlertCircle, CheckCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddPaymentMethodForm } from "@/components/AddPaymentMethodForm";
import PageLayout from "@/components/layout/PageLayout";
import { PaymentMethodCard } from "@/components/PaymentMethodCard";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaymentMethods } from "@/context/PaymentMethodsContext";
import type { NewPaymentMethodUnion } from "@/types/payment";

export default function PaymentMethodsPage() {
  const router = useRouter();
  // Mock user and loading state for frontend-only app
  const user = { id: "1", email: "test@gmail.com", name: "Test User" };
  const isLoaded = true;
  const authLoading = false;
  const {
    paymentMethods,
    isLoading,
    error,
    addMethod,
    deleteMethod,
    setDefaultMethod,
  } = usePaymentMethods();

  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in?redirect_url=/payment-methods");
    }
  }, [router]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAddMethod = async (method: NewPaymentMethodUnion) => {
    try {
      await addMethod(method);
      setShowAddForm(false);
      setSuccessMessage("Payment method added successfully!");
      toast.success("Payment method added successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add payment method",
      );
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultMethod(id);
      toast.success("Default payment method updated");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update default payment method",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMethod(id);
      toast.success("Payment method removed");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete payment method",
      );
    }
  };

  if (authLoading || !user) {
    return (
      <PageLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Payment Methods"
      description="Manage your payment methods for faster checkout"
      breadcrumbs={[
        { label: "Account Settings", href: "/settings" },
        { label: "Payment Methods" },
      ]}
    >
      {/* Page Header Actions */}
      {paymentMethods.length > 0 && (
        <div className="flex justify-end mb-8">
          <Button onClick={() => setShowAddForm(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Payment Method
          </Button>
        </div>
      )}

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

      {/* Payment Methods List */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : paymentMethods.length === 0 ? (
        <EmptyStates.NoPaymentMethods onAction={() => setShowAddForm(true)} />
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
    </PageLayout>
  );
}
