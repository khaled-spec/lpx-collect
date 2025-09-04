'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Mail, 
  AlertCircle, 
  Package,
  Loader2,
  CheckCircle,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

function VerifyEmailContent() {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsResending(false);
    setResendSuccess(true);
    setResendCooldown(60); // 60 second cooldown
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setResendSuccess(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Package className="h-10 w-10 text-primary" />
        <span className="text-2xl font-bold">LPX Collect</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription className="mt-2">
            We've sent a verification email to
          </CardDescription>
          <p className="font-medium text-foreground mt-1">
            {email || 'your email address'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-sm font-medium">Almost there!</AlertTitle>
            <AlertDescription className="text-sm">
              Please check your email inbox and click the verification link to activate your account.
              The link will expire in 24 hours.
            </AlertDescription>
          </Alert>

          {resendSuccess && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm">
                Verification email has been resent successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">Didn't receive the email?</p>
              <p>Check your spam folder or click below to resend</p>
            </div>

            <Button 
              onClick={handleResend}
              variant="outline"
              className="w-full"
              disabled={isResending || resendCooldown > 0}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : resendCooldown > 0 ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend in {resendCooldown}s
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend verification email
                </>
              )}
            </Button>

            <Button 
              asChild
              className="w-full"
            >
              <Link href="/login">
                Continue to login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm font-medium">Demo Note</AlertTitle>
              <AlertDescription className="text-sm">
                This is a demo. In production, you would receive an actual verification email. 
                For now, you can proceed to login - your account is already verified.
              </AlertDescription>
            </Alert>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Wrong email?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Create a new account
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="mt-8 flex gap-4 text-sm text-muted-foreground">
        <Link href="/terms" className="hover:underline">Terms</Link>
        <span>•</span>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <span>•</span>
        <Link href="/help" className="hover:underline">Help</Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}