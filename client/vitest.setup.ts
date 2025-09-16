import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';

// Mock Clerk authentication
vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(),
  useAuth: vi.fn(),
  useClerk: vi.fn(() => ({
    signOut: vi.fn(),
    openSignIn: vi.fn(),
    openSignUp: vi.fn(),
  })),
  SignIn: vi.fn(({ children }) => children || 'SignIn Mock'),
  SignUp: vi.fn(({ children }) => children || 'SignUp Mock'),
  SignedIn: vi.fn(({ children }) => children),
  SignedOut: vi.fn(({ children }) => children),
  UserButton: vi.fn(() => 'UserButton Mock'),
  ClerkProvider: vi.fn(({ children }) => children),
  SignOutButton: vi.fn(({ children }) => children || 'SignOut Mock'),
  SignInButton: vi.fn(({ children }) => children || 'SignInButton Mock'),
  SignUpButton: vi.fn(({ children }) => children || 'SignUpButton Mock'),
}));

vi.mock('@clerk/nextjs/server', () => ({
  clerkMiddleware: vi.fn(() => vi.fn()),
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
  useParams() {
    return {};
  },
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: vi.fn(),
}));


// Mock Radix UI DropdownMenu primitives for testing with proper prop filtering
vi.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children, ...props }: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('div', { 'data-testid': 'dropdown-menu', ...cleanProps }, children);
  },
  Trigger: ({ children, asChild, ...props }: any) => {
    const { sideOffset, ...cleanProps } = props;
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, { ...cleanProps, ...children.props });
    }
    return React.createElement('button', cleanProps, children);
  },
  Content: ({ children, ...props }: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('div', { 'data-testid': 'dropdown-content', ...cleanProps }, children);
  },
  Item: ({ children, onClick, ...props }: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('div', {
      role: 'menuitem',
      onClick,
      style: { cursor: 'pointer' },
      ...cleanProps
    }, children);
  },
  Label: ({ children, ...props }: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('div', { role: 'label', ...cleanProps }, children);
  },
  Separator: (props: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('hr', cleanProps);
  },
  Group: ({ children, ...props }: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('div', cleanProps, children);
  },
  Portal: ({ children, ...props }: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('div', cleanProps, children);
  },
  Sub: ({ children, ...props }: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('div', cleanProps, children);
  },
  SubTrigger: ({ children, ...props }: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('div', cleanProps, children);
  },
  SubContent: ({ children, ...props }: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('div', cleanProps, children);
  },
  RadioGroup: ({ children, ...props }: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('div', cleanProps, children);
  },
  RadioItem: ({ children, ...props }: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('div', cleanProps, children);
  },
  CheckboxItem: ({ children, ...props }: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('div', cleanProps, children);
  },
  ItemIndicator: ({ children, ...props }: any) => {
    const { asChild, sideOffset, ...cleanProps } = props;
    return React.createElement('div', cleanProps, children);
  },
}));

// Mock other Radix UI components that might cause prop warnings
vi.mock('@radix-ui/react-tabs', () => ({
  Root: ({ children, ...props }: any) => {
    const { asChild, ...cleanProps } = props;
    return React.createElement('div', cleanProps, children);
  },
  List: ({ children, ...props }: any) => {
    const { asChild, ...cleanProps } = props;
    return React.createElement('div', { role: 'tablist', ...cleanProps }, children);
  },
  Trigger: ({ children, ...props }: any) => {
    const { asChild, ...cleanProps } = props;
    return React.createElement('button', { role: 'tab', ...cleanProps }, children);
  },
  Content: ({ children, ...props }: any) => {
    const { asChild, ...cleanProps } = props;
    return React.createElement('div', { role: 'tabpanel', ...cleanProps }, children);
  },
}));

vi.mock('@radix-ui/react-navigation-menu', () => ({
  Root: ({ children, ...props }: any) => {
    const { asChild, ...cleanProps } = props;
    return React.createElement('nav', cleanProps, children);
  },
  List: ({ children, ...props }: any) => {
    const { asChild, ...cleanProps } = props;
    return React.createElement('ul', cleanProps, children);
  },
  Item: ({ children, ...props }: any) => {
    const { asChild, ...cleanProps } = props;
    return React.createElement('li', cleanProps, children);
  },
  Trigger: ({ children, ...props }: any) => {
    const { asChild, ...cleanProps } = props;
    return React.createElement('button', cleanProps, children);
  },
  Content: ({ children, ...props }: any) => {
    const { asChild, ...cleanProps } = props;
    return React.createElement('div', cleanProps, children);
  },
  Link: ({ children, ...props }: any) => {
    const { asChild, ...cleanProps } = props;
    return React.createElement('a', cleanProps, children);
  },
  Viewport: ({ children, ...props }: any) => {
    const { asChild, ...cleanProps } = props;
    return React.createElement('div', cleanProps, children);
  },
  Indicator: ({ children, ...props }: any) => {
    const { asChild, ...cleanProps } = props;
    return React.createElement('div', cleanProps, children);
  },
}));

// Mock EmptyState components - use proper mock functions that return React elements
vi.mock('@/components/shared/EmptyState', () => ({
  default: vi.fn((props) => {
    return React.createElement('div', {
      className: 'empty-state',
      'data-testid': 'empty-state'
    }, [
      props.title,
      props.description && React.createElement('p', { key: 'desc' }, props.description),
      props.actionLabel && React.createElement('button', { key: 'action' }, props.actionLabel)
    ].filter(Boolean))
  }),
  EmptyStates: {
    NoProducts: vi.fn(() =>
      React.createElement('div', { 'data-testid': 'no-products' }, 'No products found')
    ),
    NoVendorProducts: vi.fn(() =>
      React.createElement('div', { 'data-testid': 'no-vendor-products' }, [
        'No products yet',
        React.createElement('button', { key: 'action' }, 'Add Your First Product')
      ])
    ),
    NoOrders: vi.fn(() =>
      React.createElement('div', { 'data-testid': 'no-orders' }, 'No orders yet')
    ),
    NoResults: vi.fn(() =>
      React.createElement('div', { 'data-testid': 'no-results' }, 'No results found')
    ),
  },
}));

// Add fetch polyfill for API tests
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({
    success: true,
    data: []
  }),
  status: 200,
  headers: new Headers(),
  statusText: 'OK'
});

// Mock environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_key';
process.env.CLERK_SECRET_KEY = 'sk_test_key';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});