"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, CheckCircle, AlertCircle } from "lucide-react";
import { EmptyStates } from "@/components/shared/EmptyState";
import { PaymentMethodCard } from "@/components/PaymentMethodCard";
import { AddPaymentMethodForm } from "@/components/AddPaymentMethodForm";
import { usePaymentMethods } from "@/context/PaymentMethodsContext";
import { toast } from "sonner";

export function PaymentMethodsManager() {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Header with Add Button */}
      {paymentMethods.length > 0 && (
        <div className="flex justify-end items-center">
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      )}

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <EmptyStates.NoPaymentMethods onAction={() => setShowAddForm(true)} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
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

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a payment method to your account
            </DialogDescription>
          </DialogHeader>
          <AddPaymentMethodForm
            onAdd={handleAddMethod}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}