"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  CreditCard, 
  MoreVertical, 
  Star, 
  Trash2, 
  Edit,
  Check,
  Building,
  Bitcoin,
  Mail
} from "lucide-react";
import type { PaymentMethodUnion } from "@/types/payment";
import { 
  formatCardNumber, 
  formatExpiryDate,
  getPaymentMethodIcon 
} from "@/data/mockPaymentMethods";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethodUnion;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function PaymentMethodCard({
  paymentMethod,
  onSetDefault,
  onDelete,
  onEdit,
}: PaymentMethodCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetDefault = async () => {
    setIsLoading(true);
    try {
      await onSetDefault(paymentMethod.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(paymentMethod.id);
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const renderPaymentDetails = () => {
    switch (paymentMethod.type) {
      case "card":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-semibold capitalize">
                    {paymentMethod.cardDetails.brand} {formatCardNumber(paymentMethod.cardDetails.last4)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {formatExpiryDate(
                      paymentMethod.cardDetails.expiryMonth,
                      paymentMethod.cardDetails.expiryYear
                    )}
                  </p>
                </div>
              </div>
              {paymentMethod.isDefault && (
                <Badge variant="default" className="gap-1">
                  <Star className="h-3 w-3" />
                  Default
                </Badge>
              )}
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Cardholder Name</p>
                <p className="font-medium">{paymentMethod.cardDetails.cardholderName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Billing Address</p>
                <p className="font-medium">
                  {paymentMethod.cardDetails.billingAddress.line1}
                  {paymentMethod.cardDetails.billingAddress.line2 && (
                    <>, {paymentMethod.cardDetails.billingAddress.line2}</>
                  )}
                </p>
                <p className="font-medium">
                  {paymentMethod.cardDetails.billingAddress.city}, {paymentMethod.cardDetails.billingAddress.state} {paymentMethod.cardDetails.billingAddress.postalCode}
                </p>
                <p className="font-medium">{paymentMethod.cardDetails.billingAddress.country}</p>
              </div>
            </div>
          </div>
        );

      case "paypal":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-semibold">PayPal</p>
                  <p className="text-sm text-muted-foreground">
                    {paymentMethod.paypalDetails.email}
                  </p>
                </div>
              </div>
              {paymentMethod.isDefault && (
                <Badge variant="default" className="gap-1">
                  <Star className="h-3 w-3" />
                  Default
                </Badge>
              )}
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Account ID</p>
                <p className="font-medium font-mono text-xs">
                  {paymentMethod.paypalDetails.accountId}
                </p>
              </div>
            </div>
          </div>
        );

      case "crypto":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bitcoin className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="font-semibold capitalize">
                    {paymentMethod.cryptoDetails.cryptoType} Wallet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {paymentMethod.cryptoDetails.network}
                  </p>
                </div>
              </div>
              {paymentMethod.isDefault && (
                <Badge variant="default" className="gap-1">
                  <Star className="h-3 w-3" />
                  Default
                </Badge>
              )}
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Wallet Address</p>
                <p className="font-medium font-mono text-xs break-all">
                  {paymentMethod.cryptoDetails.walletAddress}
                </p>
              </div>
            </div>
          </div>
        );

      case "bank":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold">{paymentMethod.bankDetails.bankName}</p>
                  <p className="text-sm text-muted-foreground">
                    {paymentMethod.bankDetails.accountType === 'checking' ? 'Checking' : 'Savings'} ••••{paymentMethod.bankDetails.last4}
                  </p>
                </div>
              </div>
              {paymentMethod.isDefault && (
                <Badge variant="default" className="gap-1">
                  <Star className="h-3 w-3" />
                  Default
                </Badge>
              )}
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Account Holder</p>
                <p className="font-medium">{paymentMethod.bankDetails.accountHolderName}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          {renderPaymentDetails()}
        </CardContent>
        <CardFooter className="bg-muted/50 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-xs text-muted-foreground">
              Added on {new Date(paymentMethod.createdAt).toLocaleDateString()}
            </p>
            <div className="flex items-center gap-2">
              {!paymentMethod.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSetDefault}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Set as Default
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && paymentMethod.type === 'card' && (
                    <DropdownMenuItem onClick={() => onEdit(paymentMethod.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 focus:text-red-600"
                    disabled={paymentMethod.isDefault}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment method? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}