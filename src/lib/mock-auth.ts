import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';

// Mock user database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'collector@test.com',
    name: 'John Collector',
    role: 'collector',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    wishlistCount: 12,
    orderCount: 5,
  },
  {
    id: '2',
    email: 'vendor@test.com',
    name: 'Elite Collectibles',
    role: 'vendor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elite',
    emailVerified: true,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-01'),
    storeName: 'Elite Collectibles Co.',
    storeDescription: 'Premium vintage collectibles and rare finds',
    storeVerified: true,
    totalSales: 1250,
    rating: 4.8,
  },
  {
    id: '3',
    email: 'admin@test.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    emailVerified: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock JWT token
const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    iat: Date.now(), 
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Mock login function
export const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await delay(1500); // Simulate network delay
  
  const { email, password } = credentials;
  
  // Validate input
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
  
  // Find user
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Mock password check (in real app, this would check hashed password)
  const validPasswords: Record<string, string> = {
    'collector@test.com': 'Test123!',
    'vendor@test.com': 'Test123!',
    'admin@test.com': 'Admin123!',
  };
  
  if (validPasswords[email] !== password) {
    throw new Error('Invalid email or password');
  }
  
  const token = generateMockToken(user.id);
  
  return {
    success: true,
    token,
    user,
    expiresIn: 24 * 60 * 60, // 24 hours in seconds
    message: 'Login successful',
  };
};

// Mock register function
export const mockRegister = async (data: RegisterData): Promise<AuthResponse> => {
  await delay(2000); // Simulate network delay
  
  const { name, email, password, confirmPassword, acceptTerms } = data;
  
  // Validate input
  if (!name || !email || !password || !confirmPassword) {
    throw new Error('All fields are required');
  }
  
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
  
  if (!isValidPassword(password)) {
    throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
  }
  
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  if (!acceptTerms) {
    throw new Error('You must accept the terms and conditions');
  }
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    throw new Error('An account with this email already exists');
  }
  
  // Create new user - always as collector
  const newUser: User = {
    id: `user_${Date.now()}`,
    email,
    name,
    role: 'collector', // All new users are collectors
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`,
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    wishlistCount: 0,
    orderCount: 0,
  };
  
  // Add to mock database
  mockUsers.push(newUser);
  
  const token = generateMockToken(newUser.id);
  
  return {
    success: true,
    token,
    user: newUser,
    expiresIn: 24 * 60 * 60,
    message: 'Registration successful! Please check your email to verify your account.',
  };
};

// Mock logout function
export const mockLogout = async (): Promise<void> => {
  await delay(500);
  // In a real app, this might invalidate the token on the server
  return;
};

// Mock reset password request
export const mockResetPasswordRequest = async (email: string): Promise<{ success: boolean; message: string }> => {
  await delay(1500);
  
  if (!email) {
    throw new Error('Email is required');
  }
  
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
  
  // Check if user exists (in production, don't reveal if email exists)
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  // Always return success for security (don't reveal if email exists)
  return {
    success: true,
    message: 'If an account exists with this email, you will receive password reset instructions.',
  };
};

// Mock email verification
export const mockVerifyEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
  await delay(1000);
  
  if (!token) {
    throw new Error('Verification token is required');
  }
  
  // In a real app, decode and validate the token
  // For mock, just simulate success
  return {
    success: true,
    message: 'Email verified successfully! You can now login to your account.',
  };
};

// Mock get current user from token
export const mockGetCurrentUser = async (token: string): Promise<User | null> => {
  await delay(500);
  
  if (!token) {
    return null;
  }
  
  try {
    // Decode mock token
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    
    // Check if token is expired
    if (payload.exp < Date.now()) {
      return null;
    }
    
    // Find user
    const user = mockUsers.find(u => u.id === payload.userId);
    return user || null;
  } catch {
    return null;
  }
};

// Mock update user profile
export const mockUpdateProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  await delay(1000);
  
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  const updatedUser = {
    ...mockUsers[userIndex],
    ...updates,
    updatedAt: new Date(),
  };
  
  mockUsers[userIndex] = updatedUser;
  return updatedUser;
};