// Mock Payment Methods API - follows the same pattern as other mock services
import type {
  NewPaymentMethodUnion,
  PaymentMethodUnion,
} from "@/types/payment";

// Mock payment methods data
const mockPaymentMethods: PaymentMethodUnion[] = [
  {
    id: "pm_mock_visa_1234",
    userId: "1", // Will be set to actual user ID
    type: "card",
    isDefault: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    cardDetails: {
      brand: "visa",
      last4: "1234",
      expiryMonth: 12,
      expiryYear: 2027,
      cardholderName: "John Doe",
      billingAddress: {
        line1: "123 Main Street",
        line2: "Apt 4B",
        city: "San Francisco",
        state: "CA",
        country: "US",
        postalCode: "94105",
      },
    },
  },
  {
    id: "pm_mock_mastercard_5678",
    userId: "1", // Will be set to actual user ID
    type: "card",
    isDefault: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    cardDetails: {
      brand: "mastercard",
      last4: "5678",
      expiryMonth: 8,
      expiryYear: 2026,
      cardholderName: "Jane Smith",
      billingAddress: {
        line1: "456 Oak Avenue",
        line2: "",
        city: "Los Angeles",
        state: "CA",
        country: "US",
        postalCode: "90210",
      },
    },
  },
];

// Storage key for localStorage persistence
const STORAGE_KEY = "lpx_payment_methods";

// Payment Methods Mock Service
export class MockPaymentMethodsService {
  private getStorageKey(userId: string): string {
    return `${STORAGE_KEY}_${userId}`;
  }

  // Load payment methods from localStorage or return mock data if empty
  async getPaymentMethods(userId: string): Promise<PaymentMethodUnion[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const stored = localStorage.getItem(this.getStorageKey(userId));
    let methods: PaymentMethodUnion[] = [];

    try {
      methods = stored ? JSON.parse(stored) : [];

      // Validate the structure of stored data
      if (methods.length > 0 && !this.validatePaymentMethods(methods)) {
        if (process.env.NODE_ENV !== "production")
          console.log(
            "Invalid payment methods data found, clearing and reinitializing...",
          );
        methods = [];
        localStorage.removeItem(this.getStorageKey(userId));
      }
    } catch (_error) {
      if (process.env.NODE_ENV !== "production")
        console.log("Corrupted payment methods data found, clearing...");
      methods = [];
      localStorage.removeItem(this.getStorageKey(userId));
    }

    // If no stored data or corrupted data, initialize with mock data
    if (methods.length === 0) {
      methods = mockPaymentMethods.map((method) => ({
        ...method,
        userId: userId,
      }));
      this.saveToStorage(userId, methods);
    }

    return methods;
  }

  // Add a new payment method
  async addPaymentMethod(
    userId: string,
    method: NewPaymentMethodUnion,
  ): Promise<PaymentMethodUnion> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const currentMethods = await this.getPaymentMethods(userId);
    const now = new Date().toISOString();

    let newMethod: PaymentMethodUnion;

    if ("type" in method && method.type === "card") {
      newMethod = {
        id: `pm_${Date.now()}`,
        userId: userId,
        type: "card",
        isDefault: method.setAsDefault || currentMethods.length === 0,
        createdAt: now,
        updatedAt: now,
        cardDetails: method.cardDetails,
      };
    } else if ("email" in method) {
      // PayPal payment method
      newMethod = {
        id: `pm_${Date.now()}`,
        userId: userId,
        type: "paypal",
        isDefault: method.setAsDefault || currentMethods.length === 0,
        createdAt: now,
        updatedAt: now,
        paypalDetails: {
          email: method.email,
          accountId: `pp_${Date.now()}`,
        },
      };
    } else if ("cryptoType" in method) {
      // Crypto payment method
      newMethod = {
        id: `pm_${Date.now()}`,
        userId: userId,
        type: "crypto",
        isDefault: method.setAsDefault || currentMethods.length === 0,
        createdAt: now,
        updatedAt: now,
        cryptoDetails: {
          cryptoType: method.cryptoType,
          walletAddress: method.walletAddress,
          network: method.network,
        },
      };
    } else if ("accountHolderName" in method) {
      // Bank payment method
      newMethod = {
        id: `pm_${Date.now()}`,
        userId: userId,
        type: "bank",
        isDefault: method.setAsDefault || currentMethods.length === 0,
        createdAt: now,
        updatedAt: now,
        bankDetails: {
          accountHolderName: method.accountHolderName,
          bankName: method.bankName,
          last4: method.accountNumber.slice(-4),
          accountType: method.accountType,
        },
      };
    } else {
      throw new Error(`Unsupported payment method type`);
    }

    // If setting as default, update other methods
    const updatedMethods = currentMethods.map((m) => ({
      ...m,
      isDefault: newMethod.isDefault ? false : m.isDefault,
    }));

    const allMethods = [...updatedMethods, newMethod];
    this.saveToStorage(userId, allMethods);

    return newMethod;
  }

  // Update an existing payment method
  async updatePaymentMethod(
    userId: string,
    id: string,
    updates: Partial<PaymentMethodUnion>,
  ): Promise<PaymentMethodUnion> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentMethods = await this.getPaymentMethods(userId);
    const methodIndex = currentMethods.findIndex((m) => m.id === id);

    if (methodIndex === -1) {
      throw new Error("Payment method not found");
    }

    const updatedMethod = {
      ...currentMethods[methodIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    } as PaymentMethodUnion;
    const updatedMethods = [...currentMethods];
    updatedMethods[methodIndex] = updatedMethod;

    this.saveToStorage(userId, updatedMethods);
    return updatedMethod;
  }

  // Delete a payment method
  async deletePaymentMethod(userId: string, id: string): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentMethods = await this.getPaymentMethods(userId);
    const method = currentMethods.find((m) => m.id === id);

    // Prevent deleting the default method if it's the only one
    if (method?.isDefault && currentMethods.length === 1) {
      throw new Error("Cannot delete your only payment method");
    }

    const updatedMethods = currentMethods.filter((m) => m.id !== id);

    // If deleted method was default and there are other methods, make the first one default
    if (method?.isDefault && updatedMethods.length > 0) {
      updatedMethods[0].isDefault = true;
    }

    this.saveToStorage(userId, updatedMethods);
  }

  // Set a payment method as default
  async setDefaultPaymentMethod(userId: string, id: string): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentMethods = await this.getPaymentMethods(userId);
    const updatedMethods = currentMethods.map((method) => ({
      ...method,
      isDefault: method.id === id,
    }));

    this.saveToStorage(userId, updatedMethods);
  }

  // Get the default payment method
  async getDefaultPaymentMethod(
    userId: string,
  ): Promise<PaymentMethodUnion | undefined> {
    const methods = await this.getPaymentMethods(userId);
    return methods.find((m) => m.isDefault);
  }

  // Save methods to localStorage
  private saveToStorage(userId: string, methods: PaymentMethodUnion[]): void {
    localStorage.setItem(this.getStorageKey(userId), JSON.stringify(methods));
  }

  // Validate payment methods structure
  private validatePaymentMethods(methods: PaymentMethodUnion[]): boolean {
    return methods.every((method) => {
      // Check required fields for all payment methods
      if (
        !method.id ||
        !method.userId ||
        !method.type ||
        typeof method.isDefault !== "boolean" ||
        !method.createdAt ||
        !method.updatedAt
      ) {
        return false;
      }

      // Check type-specific fields
      switch (method.type) {
        case "card":
          return (
            method.cardDetails?.brand &&
            method.cardDetails.last4 &&
            method.cardDetails.expiryMonth &&
            method.cardDetails.expiryYear &&
            method.cardDetails.cardholderName &&
            method.cardDetails.billingAddress
          );
        default:
          return true;
      }
    });
  }

  // Clear all payment methods (for testing/reset)
  async clearPaymentMethods(userId: string): Promise<void> {
    localStorage.removeItem(this.getStorageKey(userId));
  }
}

// Export singleton instance
export const mockPaymentMethodsService = new MockPaymentMethodsService();

// Export mock data for external use
export { mockPaymentMethods };
