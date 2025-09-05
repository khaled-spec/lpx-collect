"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import type { PaymentMethodUnion } from "@/types/payment";
import {
  fetchPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "@/data/mockPaymentMethods";

interface PaymentMethodsContextType {
  paymentMethods: PaymentMethodUnion[];
  isLoading: boolean;
  error: string | null;
  addMethod: (method: any) => Promise<void>;
  updateMethod: (id: string, updates: Partial<PaymentMethodUnion>) => Promise<void>;
  deleteMethod: (id: string) => Promise<void>;
  setDefaultMethod: (id: string) => Promise<void>;
  refreshMethods: () => Promise<void>;
  getDefaultMethod: () => PaymentMethodUnion | undefined;
}

const PaymentMethodsContext = createContext<PaymentMethodsContextType | undefined>(undefined);

export function PaymentMethodsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodUnion[]>([]);
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
      const methods = await fetchPaymentMethods(user.id);
      setPaymentMethods(methods);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payment methods");
      console.error("Error loading payment methods:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addMethod = async (method: any) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setError(null);
      const newMethod = await addPaymentMethod(user.id, method);
      
      // If new method is default, update existing methods
      if (newMethod.isDefault) {
        setPaymentMethods(prev => 
          [...prev.map(m => ({ ...m, isDefault: false })), newMethod]
        );
      } else {
        setPaymentMethods(prev => [...prev, newMethod]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add payment method");
      throw err;
    }
  };

  const updateMethod = async (id: string, updates: Partial<PaymentMethodUnion>) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setError(null);
      const updatedMethod = await updatePaymentMethod(user.id, id, updates);
      
      setPaymentMethods(prev =>
        prev.map(m => m.id === id ? updatedMethod : m)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update payment method");
      throw err;
    }
  };

  const deleteMethod = async (id: string) => {
    if (!user) throw new Error("User not authenticated");
    
    // Prevent deleting the default method if it's the only one
    const method = paymentMethods.find(m => m.id === id);
    if (method?.isDefault && paymentMethods.length === 1) {
      throw new Error("Cannot delete your only payment method");
    }
    
    try {
      setError(null);
      await deletePaymentMethod(user.id, id);
      
      const remainingMethods = paymentMethods.filter(m => m.id !== id);
      
      // If we deleted the default and have other methods, set the first as default
      if (method?.isDefault && remainingMethods.length > 0) {
        remainingMethods[0].isDefault = true;
        await updatePaymentMethod(user.id, remainingMethods[0].id, { isDefault: true });
      }
      
      setPaymentMethods(remainingMethods);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete payment method");
      throw err;
    }
  };

  const setDefaultMethod = async (id: string) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setError(null);
      
      // Update all methods: set the selected as default, others as non-default
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }));
      
      setPaymentMethods(updatedMethods);
      
      // Persist to backend
      await updatePaymentMethod(user.id, id, { isDefault: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set default payment method");
      throw err;
    }
  };

  const refreshMethods = async () => {
    await loadPaymentMethods();
  };

  const getDefaultMethod = () => {
    return paymentMethods.find(m => m.isDefault);
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
    throw new Error("usePaymentMethods must be used within a PaymentMethodsProvider");
  }
  return context;
}