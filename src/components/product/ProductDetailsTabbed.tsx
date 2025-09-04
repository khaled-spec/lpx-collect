'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { productStyles } from '@/components/custom/product-styles';
import { cn } from '@/lib/utils';
import { 
  Truck, 
  Package, 
  RotateCcw, 
  Shield, 
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  Store,
  Star,
  MessageCircle,
  Award
} from 'lucide-react';
import Link from 'next/link';

interface ProductDetailsTabbedProps {
  vendor: {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    responseTime: string;
    salesCount: number;
    joinedDate: string;
    avatar: string;
  };
  details: Record<string, string>;
  returns: {
    accepted: boolean;
    period: string;
    condition: string;
    restockingFee: boolean;
  };
  authenticity: {
    verified: boolean;
    certificate: boolean;
    verifiedBy: string;
    certificateNumber: string;
  };
}

export default function ProductDetailsTabbed({
  vendor,
  details,
  returns,
  authenticity,
}: ProductDetailsTabbedProps) {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="seller">Seller</TabsTrigger>
        <TabsTrigger value="returns">Returns</TabsTrigger>
        <TabsTrigger value="protection">Protection</TabsTrigger>
      </TabsList>
      
      {/* Tab Content Container with fixed height */}
      <div className="min-h-[400px]">

      {/* Details Tab */}
      <TabsContent value="details" className="mt-4">
        <div className="space-y-3">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b last:border-b-0">
              <span className="text-sm font-medium text-muted-foreground">{key}:</span>
              <span className="text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Seller Tab */}
      <TabsContent value="seller" className="mt-4">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{vendor.name}</h3>
                {vendor.verified && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium">{vendor.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({vendor.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs text-muted-foreground">Sales</p>
              <p className="font-medium">{vendor.salesCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Response</p>
              <p className="font-medium">{vendor.responseTime}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Since</p>
              <p className="font-medium">{vendor.joinedDate}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Active
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">
              <Award className="h-3 w-3 mr-1" />
              Top Rated Seller
            </Badge>
            <Badge variant="secondary">
              <Truck className="h-3 w-3 mr-1" />
              Fast Shipper
            </Badge>
            <Badge variant="secondary">
              <Shield className="h-3 w-3 mr-1" />
              Trusted Vendor
            </Badge>
          </div>

          <div className="flex gap-2 mt-4">
            <Button asChild className="flex-1">
              <Link href={`/vendor/${vendor.id}`}>
                <Store className="h-4 w-4 mr-2" />
                Visit Store
              </Link>
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </TabsContent>


      {/* Returns Tab */}
      <TabsContent value="returns" className="mt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <RotateCcw className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Return Policy</h3>
            {returns.accepted && (
              <Badge variant="secondary" className="ml-auto">
                {returns.period} Returns
              </Badge>
            )}
          </div>

          {returns.accepted ? (
            <div className="space-y-4">
              <div>
                <p className="font-medium">Hassle-Free Returns</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Return within {returns.period} for a full refund
                </p>
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                <p className={cn(productStyles.typography.meta, "text-foreground")}>
                  <strong>Return Condition:</strong> {returns.condition}
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Return Process:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Initiate return request within {returns.period}</li>
                  <li>Pack item securely in original packaging</li>
                  <li>Ship with provided prepaid label</li>
                  <li>Receive refund after inspection</li>
                </ol>
              </div>

              {!returns.restockingFee && (
                <div className="flex items-center gap-2 pt-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">No restocking fee</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              This item is not eligible for returns. Please review the product carefully before purchasing.
            </div>
          )}
        </div>
      </TabsContent>

      {/* Buyer Protection Tab */}
      <TabsContent value="protection" className="mt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Buyer Protection Program</h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your purchase is protected by our comprehensive buyer protection program. 
              Shop with confidence knowing that we guarantee authenticity and condition as described.
            </p>


            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className={productStyles.typography.meta}>Money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className={productStyles.typography.meta}>Secure payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className={productStyles.typography.meta}>24/7 support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className={productStyles.typography.meta}>Dispute resolution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className={productStyles.typography.meta}>Item as described</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className={productStyles.typography.meta}>Fast resolution</span>
              </div>
            </div>

            <div className="p-3 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground">
                If you encounter any issues with your purchase, our dedicated support team is available 24/7 to assist you. 
                We'll work to resolve any problems quickly and fairly.
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
      
      </div>
    </Tabs>
  );
}