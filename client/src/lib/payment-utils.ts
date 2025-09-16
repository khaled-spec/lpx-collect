import { CreditCard, Wallet, Building, Bitcoin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Format last 4 digits of card number with dots
 */
export function formatCardNumber(last4: string): string {
  return `•••• ${last4}`;
}

/**
 * Format expiry date as MM/YY
 */
export function formatExpiryDate(month: number, year: number): string {
  const monthStr = month.toString().padStart(2, "0");
  const yearStr = year.toString().slice(-2);
  return `${monthStr}/${yearStr}`;
}

/**
 * Get icon for payment method type
 */
export function getPaymentMethodIcon(type: string): LucideIcon {
  switch (type) {
    case "card":
      return CreditCard;
    case "paypal":
      return Wallet;
    case "bank":
      return Building;
    case "crypto":
      return Bitcoin;
    default:
      return CreditCard;
  }
}

/**
 * Get display name for payment method type
 */
export function getPaymentMethodDisplayName(type: string): string {
  switch (type) {
    case "card":
      return "Credit/Debit Card";
    case "paypal":
      return "PayPal";
    case "bank":
      return "Bank Account";
    case "crypto":
      return "Cryptocurrency";
    default:
      return type;
  }
}

/**
 * Mask sensitive payment information
 */
export function maskPaymentInfo(
  value: string,
  visibleChars: number = 4,
): string {
  if (value.length <= visibleChars) return value;
  const masked = "•".repeat(value.length - visibleChars);
  const visible = value.slice(-visibleChars);
  return masked + visible;
}
