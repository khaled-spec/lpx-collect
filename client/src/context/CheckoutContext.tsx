"use client";

import { ReactNode, createContext, useContext, useState, useCallback } from "react";
import {
  CheckoutData,
  CheckoutStep,
  ShippingAddress,
  BillingAddress,
  PaymentMethod,
  Order,
} from "@/types/checkout";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CheckoutContextType {
  currentStep: CheckoutStep;
  checkoutData: CheckoutData;
  isProcessing: boolean;
  setCurrentStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateShippingAddress: (address: ShippingAddress) => void;
  updateBillingAddress: (address: BillingAddress) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  setSameAsShipping: (same: boolean) => void;
  setOrderNotes: (notes: string) => void;
  setAcceptTerms: (accept: boolean) => void;
  setSubscribeNewsletter: (subscribe: boolean) => void;
  placeOrder: () => Promise<string>;
  canProceed: () => boolean;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined,
);

const STEPS: CheckoutStep[] = ["shipping", "billing", "payment", "review"];

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { items, total, subtotal, shipping, tax, discount, clearCart } =
    useCart();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    shippingAddress: null,
    billingAddress: null,
    sameAsShipping: true,
    paymentMethod: null,
    orderNotes: "",
    acceptTerms: false,
    subscribeNewsletter: false,
  });

  const nextStep = useCallback(() => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    }
  }, [currentStep]);

  const updateShippingAddress = useCallback((address: ShippingAddress) => {
    setCheckoutData((prev) => ({
      ...prev,
      shippingAddress: address,
      billingAddress: prev.sameAsShipping
        ? (address as BillingAddress)
        : prev.billingAddress,
    }));
  }, []);

  const updateBillingAddress = useCallback((address: BillingAddress) => {
    setCheckoutData((prev) => ({
      ...prev,
      billingAddress: address,
    }));
  }, []);

  const updatePaymentMethod = useCallback((method: PaymentMethod) => {
    setCheckoutData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  }, []);

  const setSameAsShipping = useCallback((same: boolean) => {
    setCheckoutData((prev) => ({
      ...prev,
      sameAsShipping: same,
      billingAddress:
        same && prev.shippingAddress
          ? (prev.shippingAddress as BillingAddress)
          : prev.billingAddress,
    }));
  }, []);

  const setOrderNotes = useCallback((notes: string) => {
    setCheckoutData((prev) => ({
      ...prev,
      orderNotes: notes,
    }));
  }, []);

  const setAcceptTerms = useCallback((accept: boolean) => {
    setCheckoutData((prev) => ({
      ...prev,
      acceptTerms: accept,
    }));
  }, []);

  const setSubscribeNewsletter = useCallback((subscribe: boolean) => {
    setCheckoutData((prev) => ({
      ...prev,
      subscribeNewsletter: subscribe,
    }));
  }, []);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case "shipping":
        return !!checkoutData.shippingAddress;
      case "billing":
        return checkoutData.sameAsShipping || !!checkoutData.billingAddress;
      case "payment":
        return !!checkoutData.paymentMethod;
      case "review":
        return checkoutData.acceptTerms;
      default:
        return false;
    }
  }, [currentStep, checkoutData]);

  const placeOrder = useCallback(async (): Promise<string> => {
    if (!canProceed() || items.length === 0) {
      toast.error("Please complete all required fields");
      return "";
    }

    setIsProcessing(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate order data
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const orderNumber = `#${Math.floor(100000 + Math.random() * 900000)}`;

      const order: Order = {
        id: orderId,
        orderNumber,
        userId: undefined,
        items: items.map((item) => ({
          id: item.product.id,
          productId: item.product.id,
          name: item.product.title,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
          vendor: item.product.vendor.storeName,
        })),
        shippingAddress: {
          ...checkoutData.shippingAddress!,
          fullName: `${checkoutData.shippingAddress!.firstName} ${checkoutData.shippingAddress!.lastName}`,
          apartment: checkoutData.shippingAddress!.address2,
          zipCode: checkoutData.shippingAddress!.postalCode,
        } as any,
        billingAddress: checkoutData.sameAsShipping
          ? ({
              ...checkoutData.shippingAddress!,
              fullName: `${checkoutData.shippingAddress!.firstName} ${checkoutData.shippingAddress!.lastName}`,
              apartment: checkoutData.shippingAddress!.address2,
              zipCode: checkoutData.shippingAddress!.postalCode,
            } as any)
          : ({
              ...checkoutData.billingAddress!,
              fullName: `${checkoutData.billingAddress!.firstName} ${checkoutData.billingAddress!.lastName}`,
              apartment: checkoutData.billingAddress!.address2,
              zipCode: checkoutData.billingAddress!.postalCode,
            } as any),
        paymentMethod: checkoutData.paymentMethod?.type || "card",
        subtotal,
        shipping,
        tax,
        discount,
        total,
        status: "processing",
        orderNotes: checkoutData.orderNotes,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      // Save order to localStorage with user-specific key
      const orderKey = "lpx_orders_guest";
      const existingOrders = JSON.parse(localStorage.getItem(orderKey) || "[]");
      existingOrders.push(order);
      localStorage.setItem(orderKey, JSON.stringify(existingOrders));

      // Save as last order for backwards compatibility
      localStorage.setItem(
        "lpx_order_guest_last",
        JSON.stringify(order),
      );

      // Clear cart
      clearCart();

      // Show success message
      toast.success("Order placed successfully!");

      // Redirect to confirmation page
      router.push(`/order/${orderId}/confirmation`);

      return orderId;
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
      return "";
    } finally {
      setIsProcessing(false);
    }
  }, [
    checkoutData,
    items,
    subtotal,
    shipping,
    tax,
    discount,
    total,
    clearCart,
    router,
    canProceed,
  ]);

  const value = {
    currentStep,
    checkoutData,
    isProcessing,
    setCurrentStep,
    nextStep,
    prevStep,
    updateShippingAddress,
    updateBillingAddress,
    updatePaymentMethod,
    setSameAsShipping,
    setOrderNotes,
    setAcceptTerms,
    setSubscribeNewsletter,
    placeOrder,
    canProceed,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within CheckoutProvider");
  }
  return context;
}
