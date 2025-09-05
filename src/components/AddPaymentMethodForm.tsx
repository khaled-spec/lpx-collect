"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Mail, 
  Bitcoin, 
  Building,
  Lock,
  Info,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Validation schemas
const cardSchema = z.object({
  cardNumber: z.string()
    .min(16, "Card number must be 16 digits")
    .max(16, "Card number must be 16 digits")
    .regex(/^\d+$/, "Card number must contain only digits"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
  expiryMonth: z.string().min(1, "Expiry month is required"),
  expiryYear: z.string().min(1, "Expiry year is required"),
  cvv: z.string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV must be at most 4 digits")
    .regex(/^\d+$/, "CVV must contain only digits"),
  billingAddress: z.object({
    line1: z.string().min(1, "Address is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().min(1, "Postal code is required"),
  }),
  setAsDefault: z.boolean().optional(),
});

const paypalSchema = z.object({
  email: z.string().email("Invalid email address"),
  setAsDefault: z.boolean().optional(),
});

const cryptoSchema = z.object({
  cryptoType: z.enum(["bitcoin", "ethereum", "usdc"]),
  walletAddress: z.string().min(1, "Wallet address is required"),
  network: z.string().min(1, "Network is required"),
  setAsDefault: z.boolean().optional(),
});

const bankSchema = z.object({
  accountHolderName: z.string().min(1, "Account holder name is required"),
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  routingNumber: z.string().min(9, "Routing number must be 9 digits").max(9),
  accountType: z.enum(["checking", "savings"]),
  setAsDefault: z.boolean().optional(),
});

interface AddPaymentMethodFormProps {
  onAdd: (paymentMethod: any) => Promise<void>;
  onCancel: () => void;
}

export function AddPaymentMethodForm({ onAdd, onCancel }: AddPaymentMethodFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("card");

  // Card form
  const cardForm = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      billingAddress: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        country: "US",
        postalCode: "",
      },
      setAsDefault: false,
    },
  });

  // PayPal form
  const paypalForm = useForm<z.infer<typeof paypalSchema>>({
    resolver: zodResolver(paypalSchema),
    defaultValues: {
      email: "",
      setAsDefault: false,
    },
  });

  // Crypto form
  const cryptoForm = useForm<z.infer<typeof cryptoSchema>>({
    resolver: zodResolver(cryptoSchema),
    defaultValues: {
      cryptoType: "ethereum",
      walletAddress: "",
      network: "Ethereum Mainnet",
      setAsDefault: false,
    },
  });

  // Bank form
  const bankForm = useForm<z.infer<typeof bankSchema>>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      accountType: "checking",
      setAsDefault: false,
    },
  });

  const handleCardSubmit = async (values: z.infer<typeof cardSchema>) => {
    setIsLoading(true);
    try {
      await onAdd({
        type: "card",
        cardDetails: {
          brand: detectCardBrand(values.cardNumber),
          last4: values.cardNumber.slice(-4),
          expiryMonth: parseInt(values.expiryMonth),
          expiryYear: parseInt(values.expiryYear),
          cardholderName: values.cardholderName,
          billingAddress: values.billingAddress,
        },
        setAsDefault: values.setAsDefault,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayPalSubmit = async (values: z.infer<typeof paypalSchema>) => {
    setIsLoading(true);
    try {
      // Simulate PayPal OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await onAdd({
        type: "paypal",
        paypalDetails: {
          email: values.email,
          accountId: `PAYPAL_${Date.now()}`,
        },
        setAsDefault: values.setAsDefault,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCryptoSubmit = async (values: z.infer<typeof cryptoSchema>) => {
    setIsLoading(true);
    try {
      await onAdd({
        type: "crypto",
        cryptoDetails: {
          cryptoType: values.cryptoType,
          walletAddress: values.walletAddress,
          network: values.network,
        },
        setAsDefault: values.setAsDefault,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankSubmit = async (values: z.infer<typeof bankSchema>) => {
    setIsLoading(true);
    try {
      await onAdd({
        type: "bank",
        bankDetails: {
          accountHolderName: values.accountHolderName,
          bankName: values.bankName,
          last4: values.accountNumber.slice(-4),
          accountType: values.accountType,
        },
        setAsDefault: values.setAsDefault,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to detect card brand
  const detectCardBrand = (cardNumber: string): string => {
    const firstDigit = cardNumber[0];
    if (firstDigit === "4") return "visa";
    if (firstDigit === "5") return "mastercard";
    if (firstDigit === "3") return "amex";
    return "other";
  };

  // Format card number input
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Add Payment Method</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a payment method to add to your account
        </p>
      </div>

      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Your payment information is encrypted and secure. We never store your full card details.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="card" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Card
          </TabsTrigger>
          <TabsTrigger value="paypal" className="gap-2">
            <Mail className="h-4 w-4" />
            PayPal
          </TabsTrigger>
          <TabsTrigger value="crypto" className="gap-2">
            <Bitcoin className="h-4 w-4" />
            Crypto
          </TabsTrigger>
          <TabsTrigger value="bank" className="gap-2">
            <Building className="h-4 w-4" />
            Bank
          </TabsTrigger>
        </TabsList>

        <TabsContent value="card" className="mt-6">
          <Form {...cardForm}>
            <form onSubmit={cardForm.handleSubmit(handleCardSubmit)} className="space-y-4">
              <FormField
                control={cardForm.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="1234 5678 9012 3456"
                        maxLength={16}
                        onChange={(e) => {
                          field.onChange(e.target.value.replace(/\D/g, ""));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={cardForm.control}
                name="cardholderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={cardForm.control}
                  name="expiryMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                              {month.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cardForm.control}
                  name="expiryYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(
                            (year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cardForm.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="123"
                          maxLength={4}
                          onChange={(e) => {
                            field.onChange(e.target.value.replace(/\D/g, ""));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Billing Address</h4>
                
                <FormField
                  control={cardForm.control}
                  name="billingAddress.line1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123 Main St" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cardForm.control}
                  name="billingAddress.line2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Apt 4B" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={cardForm.control}
                    name="billingAddress.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="San Francisco" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={cardForm.control}
                    name="billingAddress.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="CA" maxLength={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={cardForm.control}
                    name="billingAddress.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="94105" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={cardForm.control}
                    name="billingAddress.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="GB">United Kingdom</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={cardForm.control}
                name="setAsDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set as default payment method</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Card"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="paypal" className="mt-6">
          <Form {...paypalForm}>
            <form onSubmit={paypalForm.handleSubmit(handlePayPalSubmit)} className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  You will be redirected to PayPal to authorize this payment method.
                </AlertDescription>
              </Alert>

              <FormField
                control={paypalForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PayPal Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="john.doe@example.com" />
                    </FormControl>
                    <FormDescription>
                      Enter the email address associated with your PayPal account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={paypalForm.control}
                name="setAsDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set as default payment method</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Connecting..." : "Connect PayPal"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="crypto" className="mt-6">
          <Form {...cryptoForm}>
            <form onSubmit={cryptoForm.handleSubmit(handleCryptoSubmit)} className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Cryptocurrency payments are irreversible. Please double-check your wallet address.
                </AlertDescription>
              </Alert>

              <FormField
                control={cryptoForm.control}
                name="cryptoType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cryptocurrency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cryptocurrency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                        <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={cryptoForm.control}
                name="walletAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="0x..." className="font-mono" />
                    </FormControl>
                    <FormDescription>
                      Your cryptocurrency wallet address for receiving refunds
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={cryptoForm.control}
                name="network"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Network</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bitcoin Mainnet">Bitcoin Mainnet</SelectItem>
                        <SelectItem value="Ethereum Mainnet">Ethereum Mainnet</SelectItem>
                        <SelectItem value="Polygon">Polygon</SelectItem>
                        <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={cryptoForm.control}
                name="setAsDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set as default payment method</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Wallet"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="bank" className="mt-6">
          <Form {...bankForm}>
            <form onSubmit={bankForm.handleSubmit(handleBankSubmit)} className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Bank account information is encrypted and will be verified with micro-deposits.
                </AlertDescription>
              </Alert>

              <FormField
                control={bankForm.control}
                name="accountHolderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={bankForm.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Chase Bank" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={bankForm.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={bankForm.control}
                  name="routingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routing Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="123456789"
                          maxLength={9}
                          onChange={(e) => {
                            field.onChange(e.target.value.replace(/\D/g, ""));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bankForm.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••••"
                          onChange={(e) => {
                            field.onChange(e.target.value.replace(/\D/g, ""));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={bankForm.control}
                name="setAsDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set as default payment method</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Add Bank Account"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}