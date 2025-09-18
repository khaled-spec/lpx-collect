"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  imageUrl?: string;
  role: 'customer' | 'vendor' | 'admin';
  primaryEmailAddress?: {
    emailAddress: string;
  };
  emailAddresses?: Array<{
    emailAddress: string;
  }>;
  publicMetadata?: {
    role: 'customer' | 'vendor' | 'admin';
  };
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  isResettingPassword: boolean;
  isVerifyingEmail: boolean;
  isResendingCode: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signOut: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; message: string }>;
}

// Demo verification codes for testing
const DEMO_VERIFICATION_CODES = ['123456', '000000', '111111', '999999'];

// Default users for testing
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    email: 'test@gmail.com',
    firstName: 'Test',
    lastName: 'User',
    fullName: 'Test User',
    phone: '+1 (555) 123-4567',
    imageUrl: '',
    role: 'customer',
    primaryEmailAddress: { emailAddress: 'test@gmail.com' },
    emailAddresses: [{ emailAddress: 'test@gmail.com' }],
    publicMetadata: { role: 'customer' }
  },
  {
    id: '2',
    email: 'vendor@gmail.com',
    firstName: 'Vendor',
    lastName: 'User',
    fullName: 'Vendor User',
    phone: '+1 (555) 987-6543',
    imageUrl: '',
    role: 'vendor',
    primaryEmailAddress: { emailAddress: 'vendor@gmail.com' },
    emailAddresses: [{ emailAddress: 'vendor@gmail.com' }],
    publicMetadata: { role: 'vendor' }
  },
  {
    id: '3',
    email: 'admin@gmail.com',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    phone: '+1 (555) 555-0123',
    imageUrl: '',
    role: 'admin',
    primaryEmailAddress: { emailAddress: 'admin@gmail.com' },
    emailAddresses: [{ emailAddress: 'admin@gmail.com' }],
    publicMetadata: { role: 'admin' }
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('dummy-auth-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('dummy-auth-user');
      }
    }
    setIsLoaded(true);
  }, []);

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    setIsResettingPassword(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      // Check if email exists in our demo users
      const userExists = DEFAULT_USERS.some(u => u.email === email);

      if (userExists) {
        setIsResettingPassword(false);
        return {
          success: true,
          message: 'Password reset link has been sent to your email address.'
        };
      } else {
        setIsResettingPassword(false);
        return {
          success: false,
          message: 'No account found with this email address.'
        };
      }
    } catch (error) {
      setIsResettingPassword(false);
      return {
        success: false,
        message: 'An error occurred while processing your request. Please try again.'
      };
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
    setIsVerifyingEmail(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Check if email exists in our demo users
      const userExists = DEFAULT_USERS.some(u => u.email === email);

      if (!userExists) {
        setIsVerifyingEmail(false);
        return {
          success: false,
          message: 'Invalid email address.'
        };
      }

      // Check if verification code is valid
      if (DEMO_VERIFICATION_CODES.includes(code)) {
        setIsVerifyingEmail(false);
        return {
          success: true,
          message: 'Email verified successfully! You can now sign in.'
        };
      } else {
        setIsVerifyingEmail(false);
        return {
          success: false,
          message: 'Invalid verification code. Please check your code and try again.'
        };
      }
    } catch (error) {
      setIsVerifyingEmail(false);
      return {
        success: false,
        message: 'An error occurred while verifying your email. Please try again.'
      };
    }
  };

  const resendVerificationEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
    setIsResendingCode(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      // Check if email exists in our demo users
      const userExists = DEFAULT_USERS.some(u => u.email === email);

      if (userExists) {
        setIsResendingCode(false);
        return {
          success: true,
          message: 'Verification code has been resent to your email address.'
        };
      } else {
        setIsResendingCode(false);
        return {
          success: false,
          message: 'No account found with this email address.'
        };
      }
    } catch (error) {
      setIsResendingCode(false);
      return {
        success: false,
        message: 'An error occurred while resending the verification code. Please try again.'
      };
    }
  };

  const login = (email: string, password: string): boolean => {
    // Simple hardcoded authentication check
    if (password === 'password') {
      const foundUser = DEFAULT_USERS.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('dummy-auth-user', JSON.stringify(foundUser));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dummy-auth-user');
  };

  const signOut = logout; // Alias for compatibility

  const value: AuthContextType = {
    user,
    isLoaded,
    isSignedIn: !!user,
    isResettingPassword,
    isVerifyingEmail,
    isResendingCode,
    login,
    logout,
    signOut,
    requestPasswordReset,
    verifyEmail,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Compatibility hooks to match Clerk API
export function useUser() {
  const { user, isLoaded, isSignedIn } = useAuth();
  return { user, isLoaded, isSignedIn };
}

export function useClerk() {
  const { signOut } = useAuth();
  return { signOut };
}

// Compatibility components
export function SignInButton({ children, mode }: { children: ReactNode; mode?: string }) {
  return <>{children}</>;
}

export function SignUpButton({ children, mode }: { children: ReactNode; mode?: string }) {
  return <>{children}</>;
}