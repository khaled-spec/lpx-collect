export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  instructions?: string;
}

export interface BillingAddress extends ShippingAddress {
  company?: string;
  vatNumber?: string;
}

export interface PaymentMethod {
  type: "card" | "paypal" | "crypto";
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  saveCard?: boolean;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress | null;
  billingAddress: BillingAddress | null;
  sameAsShipping: boolean;
  paymentMethod: PaymentMethod | null;
  orderNotes?: string;
  acceptTerms: boolean;
  subscribeNewsletter: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  orderNotes?: string;
  createdAt: Date;
  estimatedDelivery: Date;
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  vendor: string;
}

export type CheckoutStep = "shipping" | "billing" | "payment" | "review";
