export interface User {
  id: string;
  email: string;
  name: string;
  role: 'collector' | 'vendor' | 'admin';
  avatar?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Collector specific fields
  wishlistCount?: number;
  orderCount?: number;
  
  // Vendor specific fields
  storeName?: string;
  storeDescription?: string;
  storeVerified?: boolean;
  totalSales?: number;
  rating?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: 'collector' | 'vendor';
  acceptTerms: boolean;
  newsletter?: boolean;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  expiresIn: number;
  message?: string;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  clearError: () => void;
}