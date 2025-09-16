"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "collector" | "vendor" | "admin";
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/sign-in",
}: ProtectedRouteProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Save the current path to redirect back after login
      const returnUrl = encodeURIComponent(pathname);
      router.push(`${redirectTo}?redirect_url=${returnUrl}`);
    } else if (isLoaded && requiredRole && user?.publicMetadata?.role !== requiredRole) {
      // User doesn't have the required role
      router.push("/unauthorized");
    }
  }, [
    isSignedIn,
    isLoaded,
    router,
    pathname,
    redirectTo,
    requiredRole,
    user,
  ]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect in useEffect
  }

  if (requiredRole && user?.publicMetadata?.role !== requiredRole) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
