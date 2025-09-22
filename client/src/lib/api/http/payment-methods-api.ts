// HTTP Payment Methods API Implementation (Stubbed)
import type { IPaymentMethodsAPI, PaymentMethod } from "../types";

export class HttpPaymentMethodsAPI implements IPaymentMethodsAPI {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpPaymentMethodsAPI.getPaymentMethods() - would make HTTP call to:",
        `${this.baseUrl}/users/${userId}/payment-methods`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async addPaymentMethod(userId: string, method: PaymentMethod): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpPaymentMethodsAPI.addPaymentMethod() - would make HTTP call to:",
        `${this.baseUrl}/users/${userId}/payment-methods`,
        method,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async updatePaymentMethod(
    userId: string,
    methodId: string,
    method: Partial<PaymentMethod>,
  ): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpPaymentMethodsAPI.updatePaymentMethod() - would make HTTP call to:",
        `${this.baseUrl}/users/${userId}/payment-methods/${methodId}`,
        method,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async removePaymentMethod(userId: string, methodId: string): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpPaymentMethodsAPI.removePaymentMethod() - would make HTTP call to:",
        `${this.baseUrl}/users/${userId}/payment-methods/${methodId}`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }

  async setDefaultPaymentMethod(
    userId: string,
    methodId: string,
  ): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🌐 HttpPaymentMethodsAPI.setDefaultPaymentMethod() - would make HTTP call to:",
        `${this.baseUrl}/users/${userId}/payment-methods/${methodId}/default`,
      );
    }
    throw new Error("HTTP API not implemented yet. Using mock data instead.");
  }
}
