"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the redirect parameter from the URL
    const redirect = searchParams.get('redirect');
    const redirectUrl = redirect ? `?redirect_url=${encodeURIComponent(redirect)}` : '';

    // Redirect to Clerk's sign-up page
    router.replace(`/sign-up${redirectUrl}`);
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" role="progressbar" aria-label="Loading"></div>
        <p className="text-muted-foreground">Redirecting to sign up...</p>
      </div>
    </div>
  );
}