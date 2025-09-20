"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import type { PaymentMethodUnion } from "@/types/payment";
import { mockPaymentMethodsService } from "@/lib/api/mock-payment-methods";

interface PaymentMethodsContextType {
  paymentMethods: PaymentMethodUnion[];
  isLoading: boolean;
  error: string | null;
  addMethod: (method: any) => Promise<void>;
  updateMethod: (
    id: string,
    updates: Partial<PaymentMethodUnion>,
  ) => Promise<void>;
  deleteMethod: (id: string) => Promise<void>;
  setDefaultMethod: (id: string) => Promise<void>;
  refreshMethods: () => Promise<void>;
  getDefaultMethod: () => PaymentMethodUnion | undefined;
}

const PaymentMethodsContext = createContext<
  PaymentMethodsContextType | undefined
>(undefined);

export function PaymentMethodsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodUnion[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load payment methods when user changes
  useEffect(() => {
    if (user) {
      loadPaymentMethods();
    } else {
      setPaymentMethods([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadPaymentMethods = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const methods = await mockPaymentMethodsService.getPaymentMethods(user.id);
      setPaymentMethods(methods);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load payment methods",
      );
      console.error("Error loading payment methods:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addMethod = async (method: any) => {
    if (!user) throw new Error("User not authenticated");

    try {
      setError(null);
      await mockPaymentMethodsService.addPaymentMethod(user.id, method);

      // Refresh the payment methods list
      await loadPaymentMethods();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add payment method",
      );
      throw err;
    }
  };

  const updateMethod = async (
    id: string,
    updates: Partial<PaymentMethodUnion>,
  ) => {
    if (!user) throw new Error("User not authenticated");

    try {
      setError(null);
      await mockPaymentMethodsService.updatePaymentMethod(user.id, id, updates);

      // Refresh the payment methods list
      await loadPaymentMethods();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update payment method",
      );
      throw err;
    }
  };

  const deleteMethod = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      setError(null);
      await mockPaymentMethodsService.deletePaymentMethod(user.id, id);

      // Refresh the payment methods list
      await loadPaymentMethods();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete payment method",
      );
      throw err;
    }
  };

  const setDefaultMethod = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      setError(null);
      await mockPaymentMethodsService.setDefaultPaymentMethod(user.id, id);

      // Refresh the payment methods list
      await loadPaymentMethods();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to set default payment method",
      );
      throw err;
    }
  };

  const refreshMethods = async () => {
    await loadPaymentMethods();
  };

  const getDefaultMethod = () => {
    return paymentMethods.find((m) => m.isDefault);
  };

  return (
    <PaymentMethodsContext.Provider
      value={{
        paymentMethods,
        isLoading,
        error,
        addMethod,
        updateMethod,
        deleteMethod,
        setDefaultMethod,
        refreshMethods,
        getDefaultMethod,
      }}
    >
      {children}
    </PaymentMethodsContext.Provider>
  );
}

export function usePaymentMethods() {
  const context = useContext(PaymentMethodsContext);
  if (!context) {
    throw new Error(
      "usePaymentMethods must be used within a PaymentMethodsProvider",
    );
  }
  return context;
}
