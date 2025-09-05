import type { PaymentMethodUnion } from "@/types/payment";

export const mockPaymentMethods: PaymentMethodUnion[] = [
  {
    id: "pm_1",
    userId: "user_1",
    type: "card",
    isDefault: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    cardDetails: {
      brand: "visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2025,
      cardholderName: "John Doe",
      billingAddress: {
        line1: "123 Main St",
        line2: "Apt 4B",
        city: "San Francisco",
        state: "CA",
        country: "US",
        postalCode: "94105"
      }
    }
  },
  {
    id: "pm_2",
    userId: "user_1",
    type: "card",
    isDefault: false,
    createdAt: "2024-02-20T14:30:00Z",
    updatedAt: "2024-02-20T14:30:00Z",
    cardDetails: {
      brand: "mastercard",
      last4: "5555",
      expiryMonth: 6,
      expiryYear: 2026,
      cardholderName: "John Doe",
      billingAddress: {
        line1: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        country: "US",
        postalCode: "90001"
      }
    }
  },
  {
    id: "pm_3",
    userId: "user_1",
    type: "paypal",
    isDefault: false,
    createdAt: "2024-03-10T09:15:00Z",
    updatedAt: "2024-03-10T09:15:00Z",
    paypalDetails: {
      email: "john.doe@example.com",
      accountId: "PAYPAL_ACC_123456"
    }
  },
  {
    id: "pm_4",
    userId: "user_1",
    type: "crypto",
    isDefault: false,
    createdAt: "2024-04-05T16:45:00Z",
    updatedAt: "2024-04-05T16:45:00Z",
    cryptoDetails: {
      cryptoType: "ethereum",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEB7",
      network: "Ethereum Mainnet"
    }
  },
  {
    id: "pm_5",
    userId: "user_1",
    type: "bank",
    isDefault: false,
    createdAt: "2024-05-01T11:20:00Z",
    updatedAt: "2024-05-01T11:20:00Z",
    bankDetails: {
      accountHolderName: "John Doe",
      bankName: "Chase Bank",
      last4: "6789",
      accountType: "checking"
    }
  }
];

// Helper function to get card brand icon
export function getCardBrandIcon(brand: string): string {
  const brandIcons: Record<string, string> = {
    visa: "💳",
    mastercard: "💳",
    amex: "💳",
    discover: "💳",
    other: "💳"
  };
  return brandIcons[brand] || "💳";
}

// Helper function to get payment method icon
export function getPaymentMethodIcon(type: string): string {
  const typeIcons: Record<string, string> = {
    card: "💳",
    paypal: "🅿️",
    crypto: "₿",
    bank: "🏦"
  };
  return typeIcons[type] || "💰";
}

// Helper function to format card number
export function formatCardNumber(last4: string): string {
  return `•••• •••• •••• ${last4}`;
}

// Helper function to format expiry date
export function formatExpiryDate(month: number, year: number): string {
  const monthStr = month.toString().padStart(2, '0');
  const yearStr = year.toString().slice(-2);
  return `${monthStr}/${yearStr}`;
}

// Mock validation functions
export function validateCardNumber(cardNumber: string): boolean {
  // Remove spaces and check if it's 16 digits
  const cleaned = cardNumber.replace(/\s/g, '');
  return /^\d{16}$/.test(cleaned);
}

export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

export function validateExpiryDate(month: string, year: string): boolean {
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (monthNum < 1 || monthNum > 12) return false;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  if (yearNum < currentYear) return false;
  if (yearNum === currentYear && monthNum < currentMonth) return false;
  
  return true;
}

// Mock API functions
export async function fetchPaymentMethods(userId: string): Promise<PaymentMethodUnion[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get from localStorage if exists
  const stored = localStorage.getItem(`payment_methods_${userId}`);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Return mock data for demo
  return mockPaymentMethods.filter(pm => pm.userId === userId);
}

export async function addPaymentMethod(
  userId: string,
  paymentMethod: any
): Promise<PaymentMethodUnion> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get existing methods
  const existingMethods = await fetchPaymentMethods(userId);
  
  // Create new payment method
  const newMethod: any = {
    id: `pm_${Date.now()}`,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: paymentMethod.setAsDefault || existingMethods.length === 0,
    ...paymentMethod
  };
  
  // If setting as default, update other methods
  if (newMethod.isDefault) {
    existingMethods.forEach(method => {
      method.isDefault = false;
    });
  }
  
  // Add to storage
  const allMethods = [...existingMethods, newMethod];
  localStorage.setItem(`payment_methods_${userId}`, JSON.stringify(allMethods));
  
  return newMethod;
}

export async function updatePaymentMethod(
  userId: string,
  methodId: string,
  updates: Partial<PaymentMethodUnion>
): Promise<PaymentMethodUnion> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const methods = await fetchPaymentMethods(userId);
  const index = methods.findIndex(m => m.id === methodId);
  
  if (index === -1) {
    throw new Error("Payment method not found");
  }
  
  // If setting as default, update other methods
  if (updates.isDefault) {
    methods.forEach(method => {
      method.isDefault = false;
    });
  }
  
  methods[index] = {
    ...methods[index],
    ...updates,
    updatedAt: new Date().toISOString()
  } as PaymentMethodUnion;
  
  localStorage.setItem(`payment_methods_${userId}`, JSON.stringify(methods));
  
  return methods[index];
}

export async function deletePaymentMethod(
  userId: string,
  methodId: string
): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const methods = await fetchPaymentMethods(userId);
  const filteredMethods = methods.filter(m => m.id !== methodId);
  
  // If we deleted the default, set another as default
  if (!filteredMethods.some(m => m.isDefault) && filteredMethods.length > 0) {
    filteredMethods[0].isDefault = true;
  }
  
  localStorage.setItem(`payment_methods_${userId}`, JSON.stringify(filteredMethods));
}