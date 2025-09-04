'use client';

import { useState } from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PrimaryButton, SecondaryButton } from '@/components/custom/button-variants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Edit,
  Loader2,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function OrderReview() {
  const { 
    checkoutData, 
    prevStep, 
    setCurrentStep,
    setOrderNotes,
    setAcceptTerms,
    setSubscribeNewsletter,
    placeOrder,
    isProcessing
  } = useCheckout();
  const { items, subtotal, shipping, tax, discount, total } = useCart();
  const [orderNotes, setLocalOrderNotes] = useState(checkoutData.orderNotes || '');

  const handlePlaceOrder = async () => {
    setOrderNotes(orderNotes);
    await placeOrder();
  };

  const formatAddress = (address: any) => {
    if (!address) return '';
    return `${address.firstName} ${address.lastName}
${address.address}${address.address2 ? `, ${address.address2}` : ''}
${address.city}, ${address.state} ${address.postalCode}
${address.country}`;
  };

  const getPaymentMethodDisplay = () => {
    if (!checkoutData.paymentMethod) return '';
    
    switch (checkoutData.paymentMethod.type) {
      case 'card':
        const lastFour = checkoutData.paymentMethod.cardNumber?.slice(-4) || '';
        return `Card ending in ${lastFour}`;
      case 'paypal':
        return 'PayPal';
      case 'crypto':
        return 'Cryptocurrency';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order Items</span>
            <span className="text-sm font-normal text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.product.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shipping Address */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Shipping Address
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep('shipping')}
                className="text-primary hover:underline"
              >
                <Edit className="h-3 w-3" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {formatAddress(checkoutData.shippingAddress)}
            </p>
            {checkoutData.shippingAddress?.phone && (
              <p className="text-sm text-muted-foreground mt-2">
                Phone: {checkoutData.shippingAddress.phone}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Billing Address
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep('billing')}
                className="text-primary hover:underline"
              >
                <Edit className="h-3 w-3" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {checkoutData.sameAsShipping ? (
              <p className="text-sm text-muted-foreground">Same as shipping address</p>
            ) : (
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {formatAddress(checkoutData.billingAddress)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Method
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep('payment')}
                className="text-primary hover:underline"
              >
                <Edit className="h-3 w-3" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {getPaymentMethodDisplay()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Order Notes */}
      <div>
        <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
        <Textarea
          id="orderNotes"
          value={orderNotes}
          onChange={(e) => setLocalOrderNotes(e.target.value)}
          placeholder="Add any special instructions for your order..."
          rows={3}
          className="mt-2"
        />
      </div>

      {/* Terms and Newsletter */}
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="acceptTerms"
            checked={checkoutData.acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            className="mt-0.5"
          />
          <Label 
            htmlFor="acceptTerms" 
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> *
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="subscribeNewsletter"
            checked={checkoutData.subscribeNewsletter}
            onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
            className="mt-0.5"
          />
          <Label 
            htmlFor="subscribeNewsletter" 
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Send me exclusive offers and updates about new collectibles
          </Label>
        </div>
      </div>

      {/* Error Message */}
      {!checkoutData.acceptTerms && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">
            Please accept the terms and conditions to continue
          </p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-between pt-6 border-t">
        <SecondaryButton type="button" onClick={prevStep} disabled={isProcessing}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payment
        </SecondaryButton>
        <PrimaryButton 
          onClick={handlePlaceOrder}
          size="lg"
          disabled={!checkoutData.acceptTerms || isProcessing}
          className={cn(
            "min-w-[200px]",
            isProcessing && "cursor-not-allowed"
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Place Order (${total.toFixed(2)})
            </>
          )}
        </PrimaryButton>
      </div>
    </div>
  );
}