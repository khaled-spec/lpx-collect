'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VerifiedBadge } from '@/components/custom/badge-variants';
import { 
  Star, 
  Store, 
  MessageSquare, 
  Clock, 
  Package,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface VendorWidgetProps {
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
}

export default function VendorWidget({ vendor }: VendorWidgetProps) {
  const initials = vendor.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Vendor Avatar */}
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage src={vendor.avatar} alt={vendor.name} />
            <AvatarFallback className="text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Vendor Info */}
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <Link 
                  href={`/vendor/${vendor.id}`}
                  className="text-lg font-semibold hover:text-primary transition-colors"
                >
                  {vendor.name}
                </Link>
                {vendor.verified && <VerifiedBadge />}
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">{vendor.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({vendor.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
            </div>

            {/* Vendor Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-1.5">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Sales</p>
                  <p className="text-sm font-medium">{vendor.salesCount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Response</p>
                  <p className="text-sm font-medium">{vendor.responseTime}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Since</p>
                  <p className="text-sm font-medium">{vendor.joinedDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium text-green-600">Active</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Top Rated Seller
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Fast Shipper
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Trusted Vendor
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/vendor/${vendor.id}`}>
                  <Store className="h-4 w-4 mr-2" />
                  Visit Store
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}