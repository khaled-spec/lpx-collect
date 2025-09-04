'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Package, 
  RotateCcw, 
  Shield, 
  MapPin,
  Clock,
  DollarSign,
  CheckCircle
} from 'lucide-react';

interface ShippingInfoProps {
  shipping: {
    price: number;
    expedited: number;
    estimatedDays: string;
    expeditedDays: string;
    freeShippingThreshold: number;
    locations: string;
  };
  returns: {
    accepted: boolean;
    period: string;
    condition: string;
    restockingFee: boolean;
  };
}

export default function ShippingInfo({ shipping, returns }: ShippingInfoProps) {
  return (
    <div className="space-y-4">
      {/* Shipping Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Shipping Information</h3>
          </div>

          <div className="space-y-3">
            {/* Standard Shipping */}
            <div className="flex items-start gap-3">
              <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Standard Shipping</p>
                  <span className="text-sm font-semibold">
                    ${shipping.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Estimated delivery: {shipping.estimatedDays} business days
                </p>
              </div>
            </div>

            {/* Expedited Shipping */}
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Expedited Shipping</p>
                  <span className="text-sm font-semibold">
                    ${shipping.expedited.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Estimated delivery: {shipping.expeditedDays} business days
                </p>
              </div>
            </div>

            {/* Free Shipping Notice */}
            {shipping.freeShippingThreshold && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Free shipping on orders over ${shipping.freeShippingThreshold}
                  </p>
                </div>
              </div>
            )}

            {/* Shipping Locations */}
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">{shipping.locations}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  International shipping available on request
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Features */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs">Tracked Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs">Insured Package</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs">Signature Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs">Secure Packaging</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Returns Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <RotateCcw className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Return Policy</h3>
            {returns.accepted && (
              <Badge variant="secondary" className="ml-auto">
                {returns.period} Returns
              </Badge>
            )}
          </div>

          {returns.accepted ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Hassle-Free Returns</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Return within {returns.period} for a full refund
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>Return Condition:</strong> {returns.condition}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Return Process:</p>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Initiate return request within {returns.period}</li>
                  <li>Pack item securely in original packaging</li>
                  <li>Ship with provided prepaid label</li>
                  <li>Receive refund after inspection</li>
                </ol>
              </div>

              {!returns.restockingFee && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">No restocking fee</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              This item is not eligible for returns. Please review the product carefully before purchasing.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Buyer Protection */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Buyer Protection</h3>
              <p className="text-sm text-muted-foreground">
                Your purchase is protected by our comprehensive buyer protection program. 
                Shop with confidence knowing that we guarantee authenticity and condition as described.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-xs">Money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-xs">Secure payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-xs">24/7 support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-xs">Dispute resolution</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}